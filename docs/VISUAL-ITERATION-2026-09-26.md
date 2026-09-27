# Editorial Optical / Visual iteration

## Design read

A visual-creator portfolio for interviewers and creative leads. Editorial composition, authentic imagery and restrained optical controls; not a software-product landing page. Taste Skill informed the audit and readability checks, not a fixed visual template.

Design variance: 8. Motion intensity: 4. Visual density: 3.

## Audit and decisions

| Finding | Implemented response |
| --- | --- |
| The introduction did not clearly identify the creator's disciplines. | Name, Hong Kong location, film / photography / design and an explicit introduction accompany the new “Real moments. New worlds.” headline. |
| The tilted glass stack competed with the actual work. | Removed the decorative stack, heavy frame and floating thumbnail dock. Glass remains in navigation and the playback control. |
| The same PPP ensemble image appeared consecutively. | Default hero now shows the existing ballet preview alongside a complete outdoor portrait; the PPP spotlight uses the terrace still. |
| Photography was cropped or inset within another photograph. | Removed the inset, displayed the photography spotlight at its native 2:3 ratio, and used a different archive photograph for that spotlight. |
| Supporting text was disproportionately small. | Increased project descriptions, metadata, capability tools, career text and captions. Traditional Chinese headings have separate tracking and leading. |
| The featured case looked like a product card. | Replaced the outer card with an open editorial spread, separated by fine rules. |
| Visitors had to read a long introduction before reaching media. | Added a visible collection / film shortcut beside each case title. Existing media players, captions and full-resolution image viewer remain intact. |
| The closing section was anonymous. | Added the creator's name, location and disciplines beside the contact statement. |

## Asset management

- No new external or generated imagery, fonts or dependencies were introduced.
- Original media, checksums, rights and provenance records are unchanged.
- Display-only `spotlight` asset references live in `src/data/portfolio.js`.
- PPP spotlight: `ppp-lemon/terrace`; photography spotlight: `photography/photo_asaf_299`.
- Existing responsive derivatives remain in use. No duplicate image files were created.
- The About photograph retains `height: auto` and its original 2887:2142 ratio.
- Pre-edit source/document checkpoint: `.local/checkpoints/before-editorial-20260926.zip`.

## Verification

- Lint and production build pass.
- Asset integrity check: 64 sources; derivatives and checksums verified.
- Browser checks: 320 px English and Traditional Chinese, 390 px English/light and Traditional Chinese/dark, 768 px English, 1440 px Traditional Chinese, and 1920 px Traditional Chinese home; no document horizontal overflow in these observations.
- 1024 px photography case: complete image with `object-fit: contain` and no horizontal overflow. Portrait cover width is capped at 480 px to avoid a wide letterbox.
- All five project routes open; remaining collection counts are unchanged (photography 8, graphic design 9, videography 10, AI film 6; PPP 4 films plus 4 stills).
- At 320 px, the new PPP film shortcut reaches the gallery at the 96 px navigation offset; four video elements are present.
- Image viewer opens and closes with Escape; keyboard focus returns to the initiating gallery image.
- Mobile navigation, language and theme controls checked through the rendered interface.
- The About section was visually inspected again at 390 px in dark Traditional Chinese mode.
- These are local Chromium browser checks, not physical-device Safari testing or a Lighthouse performance score.

## Scope

No publishing, Git push, analytics changes, changes to professional claims or original media replacement. Existing routes, résumé links, contact details and project ownership descriptions are preserved.
