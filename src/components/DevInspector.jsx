import { useCallback, useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import "./DevInspector.css";

const QUICK_REQUESTS = [
  "Adjust layout, typography and spacing",
  "Edit this text",
  "Change the colours and visual treatment",
  "Improve the mobile layout",
];

const LEGACY_SOURCE_FILES = {
  "Navigation Bar": "src/components/Navbar.jsx",
  "Hero Section": "src/components/Hero.jsx",
  "Projects Section": "src/components/Projects.jsx",
  "Skills Section": "src/components/Skills.jsx",
  "Process Section": "src/components/Process.jsx",
  "About Section": "src/components/About.jsx",
  "Contact Section": "src/components/Contact.jsx",
};

function toEditId(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

function getDomPath(element) {
  if (!(element instanceof Element)) return "";
  if (element.id) return `#${CSS.escape(element.id)}`;

  const parts = [];
  let node = element;

  while (node && node !== document.body && parts.length < 6) {
    let part = node.tagName.toLowerCase();
    const stableClass = [...node.classList].find(
      (name) => !name.startsWith("is-") && !name.startsWith("active"),
    );
    if (stableClass) part += `.${CSS.escape(stableClass)}`;

    const sameTagSiblings = node.parentElement
      ? [...node.parentElement.children].filter(
          (child) => child.tagName === node.tagName,
        )
      : [];

    if (sameTagSiblings.length > 1) {
      part += `:nth-of-type(${sameTagSiblings.indexOf(node) + 1})`;
    }

    parts.unshift(part);
    node = node.parentElement;
  }

  return parts.join(" > ");
}

function describeElement(element) {
  if (!(element instanceof Element)) return null;

  const annotated = element.closest("[data-edit-id], [data-inspector-label]");
  const rect = element.getBoundingClientRect();
  const hierarchy = [];
  let node = element;

  while (node && node !== document.body) {
    if (node.dataset?.editId || node.dataset?.inspectorLabel) {
      const legacyLabel = node.dataset.inspectorLabel;
      hierarchy.unshift({
        id: node.dataset.editId || toEditId(legacyLabel),
        label: node.dataset.editLabel || legacyLabel || node.dataset.editId,
        element: node,
      });
    }
    node = node.parentElement;
  }

  const visibleText = (element.innerText || element.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);

  return {
    element,
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    },
    editId:
      annotated?.dataset.editId ||
      toEditId(annotated?.dataset.inspectorLabel || "unannotated"),
    component:
      annotated?.dataset.editLabel ||
      annotated?.dataset.inspectorLabel ||
      "Unannotated element",
    file:
      annotated?.dataset.editFile ||
      LEGACY_SOURCE_FILES[annotated?.dataset.inspectorLabel] ||
      "Locate from DOM selector",
    elementName: element.tagName.toLowerCase(),
    selector: getDomPath(element),
    visibleText,
    hierarchy,
  };
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

export default function DevInspector() {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [request, setRequest] = useState("");
  const [copied, setCopied] = useState(false);
  const frameRef = useRef(null);
  const textareaRef = useRef(null);
  const { scrollY } = useScroll();

  const closeSelection = useCallback(() => {
    setSelected(null);
    setRequest("");
    setCopied(false);
  }, []);

  const deactivate = useCallback(() => {
    setActive(false);
    setHovered(null);
    closeSelection();
  }, [closeSelection]);

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.key.toLowerCase() === "e" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setActive((value) => {
          if (value) {
            setHovered(null);
            closeSelection();
          }
          return !value;
        });
      }

      if (event.key === "Escape") {
        if (selected) closeSelection();
        else if (active) deactivate();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [active, closeSelection, deactivate, selected]);

  useEffect(() => {
    document.documentElement.classList.toggle("edit-mode-active", active);
    return () => document.documentElement.classList.remove("edit-mode-active");
  }, [active]);

  useEffect(() => {
    if (!active) return undefined;

    const handleMove = (event) => {
      if (event.target.closest("[data-dev-inspector]") || selected) return;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() =>
        setHovered(describeElement(event.target)),
      );
    };

    const handleClick = (event) => {
      if (event.target.closest("[data-dev-inspector]")) return;
      event.preventDefault();
      event.stopPropagation();
      const target = describeElement(event.target);
      setSelected(target);
      setHovered(null);
      setRequest("");
      setCopied(false);
      requestAnimationFrame(() => textareaRef.current?.focus());
    };

    const updateRects = () => {
      setHovered((value) =>
        value?.element ? describeElement(value.element) : value,
      );
      setSelected((value) =>
        value?.element ? describeElement(value.element) : value,
      );
    };

    window.addEventListener("mousemove", handleMove, true);
    window.addEventListener("click", handleClick, true);
    window.addEventListener("resize", updateRects);
    const stopScrollTracking = scrollY.on("change", updateRects);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMove, true);
      window.removeEventListener("click", handleClick, true);
      window.removeEventListener("resize", updateRects);
      stopScrollTracking();
    };
  }, [active, scrollY, selected]);

  const handleCopy = async () => {
    if (!selected || !request.trim()) return;

    const message = [
      "[Targeted website edit request]",
      `Route: ${window.location.pathname}`,
      `Edit ID: ${selected.editId}`,
      `Component: ${selected.component}`,
      `Source file: ${selected.file}`,
      `DOM selector: ${selected.selector}`,
      `Element: <${selected.elementName}>`,
      `Viewport: ${window.innerWidth} × ${window.innerHeight}`,
      `Element size: ${Math.round(selected.rect.width)} × ${Math.round(selected.rect.height)}`,
      `Visible text: ${selected.visibleText || "(none)"}`,
      "",
      "Requested changes:",
      request.trim(),
      "",
      "Edit the selected area. Describe any effects on shared components or other pages.",
    ].join("\n");

    await copyText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const target = selected || hovered;

  return (
    <div className="dev-inspector" data-dev-inspector>
      {active && target && (
        <div
          className={`dev-inspector__outline ${selected ? "is-selected" : ""}`}
          style={{
            top: target.rect.top,
            left: target.rect.left,
            width: target.rect.width,
            height: target.rect.height,
          }}
          aria-hidden="true"
        >
          <span>
            {target.component} · {target.elementName}
          </span>
        </div>
      )}

      <div className={`dev-inspector__dock ${active ? "is-active" : ""}`}>
        {active && (
          <span className="dev-inspector__mode">
            <i />
            Element selection active
          </span>
        )}
        <button
          type="button"
          className="dev-inspector__toggle"
          onClick={() => (active ? deactivate() : setActive(true))}
          aria-pressed={active}
          title="Toggle Edit Mode (Ctrl/⌘ + E)"
        >
          <span className="dev-inspector__toggle-icon">
            {active ? "×" : "⌖"}
          </span>
          <span>{active ? "Exit editor" : "Edit Mode"}</span>
          <kbd>⌘E</kbd>
        </button>
      </div>

      {selected && (
        <aside
          className="dev-inspector__panel"
          role="dialog"
          aria-label="Precise edit request"
        >
          <header>
            <div>
              <span>Selected target</span>
              <h2>{selected.component}</h2>
            </div>
            <button
              type="button"
              onClick={closeSelection}
              aria-label="Close edit panel"
            >
              ×
            </button>
          </header>

          {selected.hierarchy.length > 1 && (
            <div className="dev-inspector__trail">
              <span>Selection hierarchy</span>
              <div>
                {selected.hierarchy.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelected(describeElement(item.element))}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <dl className="dev-inspector__details">
            <div>
              <dt>Route</dt>
              <dd>{window.location.pathname}</dd>
            </div>
            <div>
              <dt>Edit ID</dt>
              <dd>{selected.editId}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>{selected.file}</dd>
            </div>
            <div>
              <dt>Selector</dt>
              <dd>{selected.selector}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>
                {Math.round(selected.rect.width)} ×{" "}
                {Math.round(selected.rect.height)} px
              </dd>
            </div>
          </dl>

          {selected.visibleText && (
            <div className="dev-inspector__content">
              <span>Current content</span>
              <p>{selected.visibleText}</p>
            </div>
          )}

          <div className="dev-inspector__request">
            <label htmlFor="edit-request">Describe the requested change</label>
            <textarea
              ref={textareaRef}
              id="edit-request"
              value={request}
              onChange={(event) => setRequest(event.target.value)}
              placeholder="For example: use a two-line heading and adjust the desktop spacing."
              rows={5}
            />
            <div className="dev-inspector__quick">
              {QUICK_REQUESTS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setRequest(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="dev-inspector__copy"
            onClick={handleCopy}
            disabled={!request.trim()}
          >
            {copied ? "Copied to clipboard ✓" : "Copy edit request"}
          </button>
          <p className="dev-inspector__tip">
            Esc 取消选择 · Ctrl/⌘ + E Exit editor模式
          </p>
        </aside>
      )}
    </div>
  );
}
