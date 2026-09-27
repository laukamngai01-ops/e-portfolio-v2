# Responsive layout verification

Updated: 2026-09-26. Local changes only; no deployment or git push.

## Composition rules

| Available width | Layout |
| --- | --- |
| Below 600px | Single-column introduction and work, full-width case media, two-column process steps, compact navigation. Below 360px the menu uses a labelled 44px icon control. |
| 600–959px | Headline beside introduction/CTA, media beneath; two-column work index where space permits. Featured case and long reading sections stack below 760px. |
| 960–1799px | Two-column hero, asymmetric work index, editorial case layouts. Full navigation begins at 1040px. |
| 1800px and above | Content expands to a 1600px maximum, with controlled type and reading widths. |
| Landscape height below 550px | Navigation is not sticky, preventing it from consuming scarce viewing space; image dialog controls remain inside the viewport. |

Shared rules: fluid gutters, balanced headings, no forced horizontal overflow hiding, 16:9 film frames, full-width mobile film players, reduced-motion/transparency fallbacks, safe-area spacing, minimum 44px primary icon controls. Source media and catalog are unchanged.

## Browser verification

Performed through the Codex in-app Chromium browser viewport controls, not physical devices.

- English home: 320×740, 390×844, 600×960, 768×1024, 820×1180, 960×768, 1024×768, 1280×800, 1440×900, 1920×1080, 2560×1440 and 844×390. Document and descendant overflow checks passed. Main headline occupied two lines at these sizes.
- Traditional Chinese home: 320, 390, 600, 768, 1024 and 1440px widths passed document overflow and headline checks. Also checked 3840×2160: 1600px content maximum, no horizontal overflow.
- PPP LEMON case: 320, 390, 600, 768, 1024, 1440, 2560px widths and 844×390 landscape passed overflow checks. Four native film players retained; one gallery column below 760px, two above.
- Photography and graphic-design cases: checked at 320px; 8 and 9 image controls respectively, no document overflow. Graphic-design page had no failed loaded images.
- Light and dark themes visually checked. Native film preview switched, played muted and paused through its custom control; scene buttons now have accessible names even when their visible labels collapse.
- Mobile menu: opens, Escape closes and restores focus to its trigger; choosing a section closes the menu and scrolls to the target. Menu closes on desktop resize.
- AI film category shows two collections; All work restores five.
- Image viewer: next image and close verified. At 844×390 its 378px dialog, 268px image area and footer fit inside the viewport. Closing returns keyboard focus to the originating image control and restores page scrolling.

## Build checks

- `npm run lint`: passed.
- `npm run assets:check`: passed; 64 source records and all registered derivative checksums match.
- `npm run build`: passed.
- `git diff --check`: passed, with only Git's existing LF/CRLF normalization warnings.

No Safari/iOS/Android physical-device test or Lighthouse run was performed; no corresponding score or certification is claimed. No Lighthouse-capable tool is exposed in this session. New generated identity artwork was not required for this responsive pass and is not referenced by the site.

## Follow-up: About photograph aspect ratio

The initial overflow checks missed an image-height defect in About. At a 1280px viewport, the photograph rendered at 562×2142px because its intrinsic HTML height was not overridden; `object-fit: cover` severely cropped the composition and stretched the section to 2486px tall.

Fixed only the About image rule: explicit `height: auto`, intrinsic aspect ratio, and `object-fit: contain`. The same desktop image now renders at 562×417px; its section is 761px tall. Source media is unchanged.

Regression measurements at 320, 390, 768 and 1440px viewport widths all preserved the approximately 1.348:1 source ratio, with no horizontal overflow. Desktop and mobile screenshots were inspected to confirm the full composition. Lint and production build passed again.
