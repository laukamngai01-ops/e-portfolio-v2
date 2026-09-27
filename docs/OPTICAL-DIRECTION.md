# Optical / Independent image-making

## Redesign brief · 2026-09-25

Audience: recruiters reviewing Kam Ngai Lau's real film, photography, design and AI-assisted production work. The owner requested autonomous visual judgement, a Liquid Glass-inspired exploration, English and Traditional Chinese, and preservation of original media.

Direction: an independent image-making practice with optical framing. Cool silver, graphite and the existing cobalt accent; large uncondensed typography; physical depth at the navigation and media controls. Native CSS glass is a web approximation, not Apple's native Liquid Glass implementation.

Design dials: variance 8 (asymmetric composition), motion 4 (explicit selection, hover and short entrance only), density 3 (room for actual work). These are working choices, not universal rules. Skill aesthetics are subordinate to the owner's brief.

## Before-edit audit

- Preserve: K/L mark; five project routes; category filters; original images and videos; bilingual copy; résumé and email actions; native video players and accessible image dialog; analytics event names.
- Retire: oversized condensed name filling the first viewport, heavy blue frame, repeated section-number labels, alternating solid blue/black sections, excessive all-caps type.
- Existing SEO: home title, description, Open Graph and Twitter metadata in index.html; per-case metadata updates in ProjectDetail; HashRouter and GitHub Pages base path. Preserve these. Hash routes do not produce independent server-rendered social previews.
- Existing assets: 64 registered source records with checksum-verified derivatives. No changes to source media are needed for this redesign.
- Checkpoint: `.local/checkpoints/before-optical-20260925-152804.zip` contains source, docs, index and package manifests. Original media remains unchanged in place. Do not extract over newer work without first making another checkpoint.

## Visual rules for this project

- Glass belongs to controls and optical media frames. Paragraphs live on solid surfaces.
- Rounded media frames (24–32px), pill navigation/controls, unboxed editorial text.
- No invented results, testimonials, client names or job titles. Employer-provided talking points remain distinguished from the owner's production responsibilities.
- Film viewing remains voluntary. No automatic carousel or audio. Preview video pauses outside the viewport, respects reduced motion and has a visible pause control.
- Generated material art, if retained, is a website identity asset, never a client portfolio item; register its source and derivatives separately.
- Respect system appearance, allow a manual theme choice, and supply solid-surface fallbacks for reduced transparency / unsupported backdrop filters.

## Reference judgement

- Apple materials guidance: https://developer.apple.com/design/human-interface-guidelines/materials
- Accessibility baseline: https://www.w3.org/TR/WCAG22/
- Neither a skill's absolute aesthetic rules nor model memory establishes what is contemporary. Judge actual rendered work, readability and interaction quality.
