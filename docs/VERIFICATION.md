# Local verification — 2026-09-06

## Automated checks

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run assets:check`: passed; 56 source records and all registered derivative checksums verified.
- `git diff --check`: passed; Git reported only line-ending conversion notices.
- `npm audit --omit=dev`: zero reported vulnerabilities.
- Existing résumé endpoint: HTTP 200.

## Browser checks

Checked the running local application in Chromium at desktop, 1024px tablet, 390px mobile and 320px narrow mobile widths. Both English and Traditional Chinese were exercised.

- No horizontal document overflow after the narrow-width correction.
- Homepage and visible collection images loaded without broken-image placeholders.
- Work filters, four collection routes, next-collection links and return-to-work navigation worked.
- Fullscreen image viewing, next-image navigation and Escape dismissal worked.
- Mobile menu opened and closed after section navigation.
- Language switching updated visible content and document language.
- Capability disclosures expanded; copying the email displayed a success status.
- Homepage video playback controls worked; automatic playback pauses outside the viewport and preserves a manual pause.
- Collection videos use `preload="none"` and expose native controls.
- Browser console reported no warnings or errors in the final check.

## Boundaries

No production deployment or remote Git push was performed. Browser checks were local Chromium checks, not a cross-browser certification or a formal accessibility audit. Original portfolio media and career information were retained. Contact deliverability, current résumé accuracy and publication rights still require owner confirmation.
