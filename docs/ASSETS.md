# Portfolio asset register

The base machine-readable register is `src/data/assets.json`; additional managed projects use `src/data/asset-collections/*.json`. The frontend and asset audit combine these registers. Every record includes a stable ID, delivery path, collection, provenance, byte size and SHA-256 checksum. Media also records dimensions and video duration. Derivatives retain their source reference and generation settings.

## Directory policy

- `public/assets/portfolio/{collection}/`: owner-supplied source media. Preserve original filenames and bytes. These files remain available for full-resolution viewing.
- `public/assets/derived/{collection}/`: reproducible web derivatives. Names use `source-stem--w960.webp`, `source-stem--w1920.webp`, `source-stem--poster.webp`, or an explicit preview time range. Never place original media here.
- `public/assets/portfolio/previews/`: inherited previews from the previous design, retained for recovery. The new interface uses only registered derivatives.
- `public/resume.pdf`: existing résumé; registered as `documents/resume`.
- `public/favicon.svg`: code-authored K/L identity mark, not a portfolio project.
- `.local/checkpoints/`: private local source checkpoints. Excluded from Git and site output.
- `docs/`: design rationale, content notes and asset maintenance instructions. Not shipped as public portfolio content.

No stock or generated imagery was added for FRAME / FORM. Fonts are locally bundled Fontsource packages; their licences are retained in `docs/licenses/` and versions are pinned by `package-lock.json`. Keep font licence files when redistributing font binaries separately.

## Rebuild and validate

Run `npm run assets:build` with FFmpeg and FFprobe on PATH to regenerate the catalog and derivatives. It only writes to `public/assets/derived/` and `src/data/assets.json`; it never writes to original media. Run `npm run assets:check` to verify original and derivative hashes and detect missing files.

Image derivatives preserve aspect ratio and do not upscale. Video posters record their capture time. The homepage preview is a silent eight-second excerpt from the owner's ballet video, with its original start time recorded in the catalog. The full video remains in the project gallery.

For new media: add it to the appropriate collection, record truthful provenance, regenerate the register, select its stable ID in `src/data/portfolio.js`, and run the audit. External or generated assets require separate `public/assets/external/` or `public/assets/generated/` folders and explicit source, licence or generation records before use. Do not describe auxiliary assets as client work.

## Employer-supplied AI film case

PPP LEMON uses a separate import recipe and supplemental catalog. Its masters remain in the external production archive; only selected web derivatives are stored in `public/assets/derived/ppp-lemon/`. See [PPP-LEMON.md](PPP-LEMON.md) for attribution, source records, import commands and publication precautions. Existing catalog rebuilds do not overwrite this supplemental register.
