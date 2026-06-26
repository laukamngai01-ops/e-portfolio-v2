import { useState, useEffect, useRef, useCallback } from 'react'
import './DevInspector.css'

/**
 * DevInspector — Click-to-Edit Overlay
 *
 * When activated, clicking any element with a [data-inspector-label]
 * attribute (or any visible UI element) opens a dialog showing the
 * component name. The user can type their change request and copy
 * the formatted message to send to the AI for precise modifications.
 */
export default function DevInspector() {
  const [active, setActive]         = useState(false)
  const [dialog, setDialog]         = useState(null)   // { label, x, y }
  const [request, setRequest]       = useState('')
  const [copied, setCopied]         = useState(false)
  const [highlight, setHighlight]   = useState(null)   // hovered label
  const dialogRef                   = useRef(null)
  const textareaRef                 = useRef(null)

  // ── Detect nearest labeled ancestor ──────────────────────────
  const findLabel = (el) => {
    let node = el
    while (node && node !== document.body) {
      if (node.dataset?.inspectorLabel) return { label: node.dataset.inspectorLabel, el: node }
      node = node.parentElement
    }
    // Fallback: identify by tag/class
    const tag = el.tagName?.toLowerCase()
    const cls = el.className?.toString().split(' ')[0]
    return { label: `<${tag}${cls ? `.${cls}` : ''}>`, el }
  }

  // ── Mouse move — highlight hovered component ─────────────────
  const onMouseMove = useCallback((e) => {
    if (!active) return
    // Skip inspector UI itself
    if (e.target.closest('.dev-inspector')) return
    const { label } = findLabel(e.target)
    setHighlight(label)
  }, [active])

  // ── Click — open dialog ──────────────────────────────────────
  const onClick = useCallback((e) => {
    if (!active) return
    if (e.target.closest('.dev-inspector')) return
    e.preventDefault()
    e.stopPropagation()

    const { label } = findLabel(e.target)

    // Position dialog near click but keep in viewport
    const dw = 380
    const dh = 300
    let x = Math.min(e.clientX + 12, window.innerWidth - dw - 16)
    let y = Math.min(e.clientY + 12, window.innerHeight - dh - 16)
    x = Math.max(8, x)
    y = Math.max(8, y)

    setDialog({ label, x, y })
    setRequest('')
    setCopied(false)

    // Focus textarea after paint
    setTimeout(() => textareaRef.current?.focus(), 60)
  }, [active])

  // ── Close dialog on Escape ───────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setDialog(null)
        setRequest('')
      }
      if (e.key === 'e' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setActive(v => {
          if (v) {
            setDialog(null)
            setHighlight(null)
          }
          return !v
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Bind events when inspector is active ────────────────────
  useEffect(() => {
    if (active) {
      window.addEventListener('click', onClick, true)
      window.addEventListener('mousemove', onMouseMove, true)
      document.body.style.cursor = 'crosshair'
    } else {
      document.body.style.cursor = ''
    }
    return () => {
      window.removeEventListener('click', onClick, true)
      window.removeEventListener('mousemove', onMouseMove, true)
      document.body.style.cursor = ''
    }
  }, [active, onClick, onMouseMove])

  // ── Copy formatted message ────────────────────────────────────
  const handleCopy = () => {
    const msg = `[Component: ${dialog?.label}]\n\nChange Request:\n${request}`
    navigator.clipboard.writeText(msg).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <>
      {/* ── Toggle Button ── */}
      <div className="dev-inspector dev-inspector__toggle-wrap" aria-live="polite">
        <button
          id="dev-inspector-toggle"
          className={`dev-inspector__toggle ${active ? 'dev-inspector__toggle--active' : ''}`}
          onClick={() => setActive(v => {
            if (v) {
              setDialog(null)
              setHighlight(null)
            }
            return !v
          })}
          title={active ? 'Exit Edit Mode (Ctrl+E)' : 'Enter Edit Mode (Ctrl+E)'}
          aria-pressed={active}
        >
          <span className="dev-inspector__toggle-icon" aria-hidden="true">
            {active ? '✕' : '✏'}
          </span>
          <span className="dev-inspector__toggle-label">
            {active ? 'Exit Edit Mode' : 'Edit Mode'}
          </span>
          <kbd className="dev-inspector__kbd">⌘E</kbd>
        </button>

        {/* Active mode hint */}
        {active && (
          <div className="dev-inspector__hint">
            Click any component to request a change
          </div>
        )}
      </div>

      {/* ── Highlight badge that follows cursor ── */}
      {active && highlight && !dialog && (
        <div className="dev-inspector__cursor-tag" aria-hidden="true">
          {highlight}
        </div>
      )}

      {/* ── Dialog ── */}
      {dialog && (
        <div
          ref={dialogRef}
          className="dev-inspector dev-inspector__dialog"
          style={{ left: dialog.x, top: dialog.y }}
          role="dialog"
          aria-modal="true"
          aria-label="Component Edit Request"
        >
          {/* Header */}
          <div className="dev-inspector__dialog-header">
            <div>
              <p className="dev-inspector__dialog-label-small">Selected Component</p>
              <p className="dev-inspector__dialog-label">{dialog.label}</p>
            </div>
            <button
              className="dev-inspector__close"
              onClick={() => setDialog(null)}
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Instruction */}
          <p className="dev-inspector__dialog-instruction">
            Describe the change you want for this component:
          </p>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="dev-inspector__textarea"
            placeholder="e.g. Change the heading font size, add a new skill card, update the color to blue..."
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={4}
          />

          {/* Actions */}
          <div className="dev-inspector__actions">
            <button
              className={`dev-inspector__copy-btn ${copied ? 'dev-inspector__copy-btn--copied' : ''}`}
              onClick={handleCopy}
              disabled={!request.trim()}
              aria-label="Copy request to clipboard"
            >
              {copied ? '✓ Copied! Paste in Chat →' : '📋 Copy & Send to AI'}
            </button>
            <button
              className="dev-inspector__cancel-btn"
              onClick={() => setDialog(null)}
            >
              Cancel
            </button>
          </div>

          <p className="dev-inspector__dialog-tip">
            After copying, paste the message in the chat window. The AI will
            modify exactly this component.
          </p>
        </div>
      )}

      {/* ── Full screen overlay when active (click-through) ── */}
      {active && (
        <div
          className="dev-inspector__overlay"
          aria-hidden="true"
        />
      )}
    </>
  )
}
