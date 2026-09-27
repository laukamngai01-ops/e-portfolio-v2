# Kam Ngai Lau — Portfolio

A bilingual portfolio for filmmaking, AI image-making, photography and visual design. The public interface uses English and Traditional Chinese.

## Local development

Use Node.js 22.12+ and npm. Install the locked dependencies with `npm ci`, then start `npm run dev -- --host 127.0.0.1`.

The local entry point is `http://127.0.0.1:5173/e-portfolio-v2/`. Hash routes keep project pages compatible with static hosting. The base path is configured in `vite.config.js`.

## Checks

```sh
npm run lint
npm run build
npm run assets:check
```

`npm run preview` serves the production build locally. Pushing to `main` runs the checks and deploys the built site through GitHub's official Pages Actions workflow. In the repository's **Settings → Pages**, select **GitHub Actions** as the build and deployment source. The expected URL is `https://laukamngai01-ops.github.io/e-portfolio-v2/` once GitHub Pages is enabled.

## Content and assets

- `src/data/portfolio.js`: collection descriptions, covers, workflow labels and contact details.
- `src/data/projects.js`: inherited source collection order.
- `src/data/assets.json`: generated asset register; do not edit hashes or derivative paths manually.
- `src/data/asset-collections/ppp-lemon.json`: managed supplemental register for the four latest PPP LEMON films.
- `src/context/`: persistent English / Traditional Chinese language preference.
- `src/index.css`: visual tokens, layouts, responsive rules and reduced-motion support.
- `src/liquid-glass.css`: opt-in animated glass navigation, with reduced-motion and reduced-transparency fallbacks.
- `docs/ASSETS.md`: source preservation, derivative generation, provenance and licence policy.
- `docs/PPP-LEMON.md`: release sources, credits and publication notes.

Original media is preserved. `npm run assets:build` uses FFmpeg and FFprobe on PATH to rebuild the base image derivatives, video posters and ballet preview. `npm run assets:previews` builds the short work-card previews. PPP LEMON has a separate allowlisted importer documented in `docs/PPP-LEMON.md`. Normal builds and the GitHub workflow use committed derivatives, so FFmpeg is not required there.

## Before sharing with employers

The owner supplied the public contact address `laukamngai01@gmail.com`. Before sharing, review the résumé PDF for matching contact information and confirm publication permission for employer-supplied work. Project outcomes, employment dates and individual credits should be added only when verified.
