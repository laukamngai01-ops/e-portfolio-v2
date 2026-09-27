# PPP LEMON — portfolio case study

## Content and attribution

- Route: `#/project/ppp-lemon`.
- Featured before the four existing discipline collections; also included by the AI film filter.
- The owner confirmed sole responsibility for the project. Their employer supplied required wording and product talking points. Credit the owner for script, characters, storyboards, AI generation, voice and editing, not for independently substantiating product claims.
- Do not invent an employer's legal name, dates of employment, software list, campaign reach or commercial results. The project folder is not proof of these details.
- Four latest Cantonese deliveries supplied on 2026-09-25 are presented. Films 01 and 02 replace the former two exports; Films 03 and 04 extend the series. Chinese film captions follow the supplied titles with Traditional Chinese typography; English captions are concise portfolio descriptions, not official translations.
- The latest files are all 1280 × 720. These replace the previous 1080p presentation without upscaling or substituting older higher-resolution content.
- Four images are identified as **film stills**, not storyboards. All new visual material comes from the supplied final exports. No stock imagery or additional AI-generated imagery has been introduced.
- Public copy is English and Traditional Chinese. Mandarin versions with Simplified Chinese captions are not imported.

## Asset management

| Location | Purpose |
| --- | --- |
| External `E:\MK\drive` delivery directory | Four user-selected originals; other files are not imported |
| `public/assets/derived/ppp-lemon/2026-09-25/` | Versioned MP4 / WebM, posters and responsive WebP stills |
| `src/data/asset-collections/ppp-lemon.json` | Public delivery paths, stable IDs, checksums and provenance |
| `docs/assets/ppp-lemon-sources.json` | Original relative paths, checksums, dimensions and extraction recipe; not deployed |
| `scripts/ppp-lemon-release.json` | Explicit source allowlist, stable IDs and poster / still timestamps |
| `scripts/import-ppp-release.mjs` | Reproducible, read-only-source import |
| `.local/archive/ppp-lemon/2026-09-22/` | Superseded web files and registers; private, excluded from deployment |

Only the selected derivatives are deployed. Do not copy prompt documents, project files, voice working files, revision folders or the full production archive into `public/`. The supplemental catalog is merged by the frontend and included in `assets:check`; rebuilding the original catalog does not remove it.

Regenerate from the external archive with Node.js, FFmpeg and FFprobe available:

```powershell
node scripts/import-ppp-release.mjs 'E:\MK\drive'
npm run assets:check
npm run lint
npm run build
```

This rewrites only the selected release's delivery files and registers. It never writes to the external archive. MP4 uses stream copy plus faststart, preserving the supplied video and audio without another lossy encode. WebM is an alternate delivery format. Stills are 960px and 1280px wide, never enlarged. Keep the original archive backed up separately. The legacy importer now fails with an actionable message to prevent accidental regression to older exports.

For a future delivery, create a new release version in the allowlist, confirm dimensions and story mapping, generate every file, then activate the complete register. Archive superseded public delivery files outside `public/` after verification. Never let revision folders accumulate in the published website. Film counts on homepage cards are derived from the asset types rather than hard-coded.

Before any public deployment, confirm the employer permits these films to appear in a personal portfolio. Supplying files does not establish a redistribution licence. No production documents, unverified efficacy statements or performance metrics have been added to the case text. No GitHub push or deployment was performed as part of this content update.

## Verification — 2026-09-25

- The four explicitly supplied files replace / extend the old two-film collection. Original SHA-256 checksums verified unchanged after import.
- 20 public delivery files, approximately 81.2 MB, live under the dated release directory. The former 14 files and their registers are recoverable under `.local/archive/ppp-lemon/2026-09-22/`, outside the deployed website.
- `npm run lint`, `npm run assets:check` (64 total records), `npm run build`, `node --check scripts/import-ppp-release.mjs` and `git diff --check` passed.
- All eight video delivery files fully decoded through FFmpeg without errors. Byte-range checks on the new films returned HTTP 206.
- Browser checks: four players, updated durations, all four 720p captions, 390px layout without horizontal overflow, desktop two-column layout, English / Traditional Chinese content, homepage four-film count and AI filter retaining both collections. No broken loaded images observed.
- Films 03 and 04 played and paused via direct pointer controls, with advancing time, 1280px decoded width and no media errors. Avoid the native-control accessibility automation issue documented below.
- `--images-only` refreshes posters / stills without re-encoding the videos; it rejects a changed source checksum or release version. Current poster times: 28s, 10s, 42.4s and 33s. All stills come from the same latest deliveries.
- No Git push or public deployment performed.

## Previous verification — 2026-09-22 (superseded release)

- `npm run lint`, `npm run build`, `npm run assets:check` and `git diff --check` passed. Asset audit covers 62 records, including all six added records and their derivatives.
- All four delivery videos (two MP4 and two WebM) fully decode through FFmpeg without reported errors. Original checksums were rechecked against the external archive.
- Browser checks: desktop layout, 390px and 320px widths without horizontal overflow, English / Traditional Chinese switching, five homepage entries, AI filter showing the new case plus the existing experiments, and image viewer next / close interactions.
- Both WebM films play through direct on-screen play controls; video time advances, decoded width is 1920 and no media error is reported. Pause controls also work. HTTP byte-range delivery returns 206.
- The in-app browser crashed when the automation accessibility interface invoked native video controls, in both MP4 and WebM testing. Direct pointer interaction with the controls worked. The exact browser failure is not attributed to the website or claimed resolved by a codec change. Do not use accessibility-node actions for native video controls in subsequent checks.
- The added public directory contains 14 delivery files, approximately 95.4 MB including both codec versions. Browsers select one video format; they do not preload both films (`preload="none"`).
