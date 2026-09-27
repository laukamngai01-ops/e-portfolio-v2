# Hiring focus — 2026-09-27

## Direction

An interview portfolio for a Hong Kong visual creator. Prioritise a recognisable name, filmmaking and AI image-making, and a short path to work, résumé and contact. Photography and design remain visible supporting disciplines.

Taste Skill was used as a contextual audit checklist, not as a prescribed aesthetic. Design variance / motion / density: 7 / 4 / 4. Retain original imagery, the restrained cobalt accent, glass controls and existing opt-in previews. No additional motion system, dependency or generated artwork.

## Changes

- Name-led bilingual hero, a full-name wordmark, concise role description, résumé link and contact shortcut.
- Consistent numbered editorial section markers and caption rules. English name typography retains its own spacing in the Traditional Chinese interface.
- Mobile navigation prioritises Contact and Résumé; language and appearance controls move into the menu below 1040px. Escape restores focus to the menu button.
- Section tracking handles short footers and page-bottom navigation. The state stores a section identifier, not continuous scroll coordinates; layout reads are requestAnimationFrame-throttled and listeners are cleaned up.
- About copy distinguishes the employer's required wording/product talking points from the owner's independently completed production.
- Earlier construction and hospitality experience is retained inside a keyboard-operable native disclosure.
- Contact uses the address explicitly supplied by the owner this turn: laukamngai01@gmail.com. The shared data source feeds the homepage and case pages.
- Browser title and social title/description reflect the updated positioning.

## Preservation and asset management

- No original media, video derivatives, résumé PDF or source catalog entries were replaced or deleted.
- Existing photographs are still clearly identified as the owner's work, not portraits of the owner.
- Source/docs checkpoint: `.local/checkpoints/before-hiring-focus-20260927.zip` (ignored by Git; not a media backup).
- Asset audit: 64 sources, all derivatives and checksums verified.

## Verification

- ESLint and production build pass.
- Browser checks: 320px English/light, 390px Traditional Chinese/dark, 768px English/light and 1440px desktop in both languages.
- A 320px navigation overflow was found and corrected. Final scroll width equals document client width, and all header controls remain inside the header.
- About photograph retains its complete ratio (desktop rendered approximately 634 × 470).
- Earlier experience expands by pointer and collapses with Enter; mobile language/theme controls work; Escape closes the menu and restores focus.
- Homepage and case-page contact shortcuts reach the homepage contact section; desktop page-bottom active navigation reads Contact.
- PPP LEMON case navigation continues to work. The contact email is shared consistently across routes.
- No browser warnings or errors observed during the regression check.

## Remaining launch checks

- No deployment, push, external messages or emails were sent.
- Résumé contents were not edited or certified against the new contact details; confirm the PDF before public release.
- The existing photographic social sharing image is unchanged; a dedicated share cover remains a separate polish item.
- Physical iPhone/Safari, constrained network, reduced-motion OS settings and public social-crawler previews were not tested this turn. Existing motion fallbacks are retained.
