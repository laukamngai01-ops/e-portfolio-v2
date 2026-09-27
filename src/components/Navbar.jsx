import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { assetUrl, contact, getAsset } from "../data/portfolio";
import LiquidGlass from "./LiquidGlass";
export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const reducedMotion = useReducedMotion();
  const [glassPaused, setGlassPaused] = useState(() => {
    try { return localStorage.getItem("portfolio-glass-paused") === "true"; } catch { return false; }
  });
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const motionPaused = Boolean(reducedMotion || glassPaused || !pageVisible);
  const toggleGlass = () => {
    const next = !glassPaused;
    setGlassPaused(next);
    try { localStorage.setItem("portfolio-glass-paused", String(next)); } catch { /* Optional preference. */ }
  };
  const motionLabel = reducedMotion
    ? t("Glass motion off: reduced motion enabled", "玻璃動態已關閉：系統設定減少動態")
    : glassPaused ? t("Play glass motion", "播放玻璃動態") : t("Pause glass motion", "暫停玻璃動態");
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1040px)").matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("portfolio-theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch { /* Storage is optional. */ }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = (event) => {
      try { if (localStorage.getItem("portfolio-theme")) return; } catch { /* Follow system. */ }
      setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    let frame;
    const update = () => {
      frame = undefined;
      const sections = [...document.querySelectorAll("#hero, #projects, #about, #skills, #contact")];
      const reached = sections.filter((section) => section.getBoundingClientRect().top <= Math.max(120, window.innerHeight * .3));
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3;
      const next = atBottom && document.getElementById("contact") ? "contact" : reached.at(-1)?.id || "";
      setActiveSection((previous) => previous === next ? previous : next);
    };
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [location.pathname]);
  const currentSection = location.pathname.startsWith("/project/") && activeSection !== "contact" ? "projects" : activeSection;
  const links = [
    ["projects", "Work", "作品"],
    ["about", "About", "關於"],
    ["skills", "Capabilities", "專長"],
    ["contact", "Contact", "聯絡"],
  ];
  return (
    <header className="site-header glass liquid-header" data-glass-paused={motionPaused ? "true" : "false"}>
      <LiquidGlass />
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
          document
            .getElementById("main-content")
            ?.scrollIntoView({ behavior: "instant" });
        }}
      >
        {t("Skip to content", "跳至主要內容")}
      </a>
      <Link
        className="wordmark"
        to="/"
        aria-label="Kam Ngai Lau / Home"
        onClick={() => {
          setOpen(false);
          if (location.pathname === "/")
            window.scrollTo({ top: 0, behavior: "instant" });
        }}
      >
        <span className="wordmark-name">KAM NGAI<br />LAU<span className="name-stop">.</span></span>
      </Link>
      <nav
        className="desktop-nav"
        aria-label={t("Main navigation", "主要導覽")}
      >
        {links.map(([id, en, zh]) => (
          <Link to={"/#" + id} key={id} aria-current={currentSection === id ? "location" : undefined}>
            {t(en, zh)}
          </Link>
        ))}
      </nav>
      <div className="header-tools">
        <button type="button" className="glass-motion-control desktop-preference" onClick={toggleGlass}
          aria-label={motionLabel} title={motionLabel} aria-pressed={!motionPaused} disabled={Boolean(reducedMotion)}>
          <span aria-hidden="true">{motionPaused ? "▷" : "Ⅱ"}</span>
        </button>
        <button type="button" className="theme-switch desktop-preference" aria-label={theme === "dark" ? t("Switch to light mode", "切換淺色模式") : t("Switch to dark mode", "切換深色模式")}
          onClick={() => {
            const next = theme === "dark" ? "light" : "dark";
            setTheme(next);
            try { localStorage.setItem("portfolio-theme", next); } catch { /* Theme still works without persistence. */ }
          }}><span aria-hidden="true">◐</span></button>
        <div className="language-switch desktop-preference" aria-label="Language / 語言">
          <button
            type="button"
            aria-pressed={language === "en"}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
          <span>/</span>
          <button
            type="button"
            aria-pressed={language === "zh-Hant"}
            onClick={() => setLanguage("zh-Hant")}
          >
            繁體
          </button>
        </div>
        <Link className="header-contact" to="/#contact" onClick={() => setOpen(false)}>{t("Contact", "聯絡")}</Link>
        <a
          className="resume-link"
          href={assetUrl(getAsset(contact.resume).src)}
          target="_blank"
          rel="noreferrer"
          data-track="resume_opened_navigation"
        >
          {t("Résumé", "履歷")} <span aria-hidden="true">↗</span>
        </a>
        <button
          type="button"
          className="menu-button"
          ref={menuButton}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? t("Close menu", "關閉選單") : t("Open menu", "開啟選單")}
          onClick={() => setOpen(!open)}
        >
          {open ? t("Close −", "關閉 −") : t("Menu +", "選單 +")}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label={t("Mobile navigation", "流動版導覽")}
        >
          {links.map(([id, en, zh]) => (
            <Link to={"/#" + id} key={id} aria-current={currentSection === id ? "location" : undefined} onClick={() => setOpen(false)}>
              {t(en, zh)}
              <span>↗</span>
            </Link>
          ))}
          <a
            href={assetUrl(getAsset(contact.resume).src)}
            target="_blank"
            rel="noreferrer"
          >
            {t("Open résumé", "開啟履歷")} ↗
          </a>
          <div className="mobile-preferences">
            <div className="language-switch" aria-label="Language / 語言">
              <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
              <button type="button" aria-pressed={language === "zh-Hant"} onClick={() => setLanguage("zh-Hant")}>繁體</button>
            </div>
            <button type="button" className="mobile-theme" onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              try { localStorage.setItem("portfolio-theme", next); } catch { /* Optional preference. */ }
            }}>{theme === "dark" ? t("Light appearance", "淺色外觀") : t("Dark appearance", "深色外觀")} <span aria-hidden="true">◐</span></button>
          </div>
          <button type="button" className="mobile-glass-motion" onClick={toggleGlass} aria-pressed={!motionPaused}
            disabled={Boolean(reducedMotion)}><span>{motionLabel}</span><span aria-hidden="true">{motionPaused ? "▷" : "Ⅱ"}</span></button>
        </nav>
      )}
    </header>
  );
}
