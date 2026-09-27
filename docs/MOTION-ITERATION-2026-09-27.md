# Screening room / Motion iteration

## Intent and design decisions

An interview portfolio for a visual creator: a short, memorable opening; larger film presentation; continuity from a work cover into its case study. Design variance 8 / motion 5 / density 3. Taste Skill's performance and accessibility checks inform implementation, but do not prescribe the art direction. No generic particle field, pointer replacement, mandatory intro or scroll hijack.

## Implemented

- Hero: two image shutters open in 800 ms; title lines settle in 650 ms with a 90 ms stagger. Content and links never wait for an intro overlay. Reduced-motion users see the static composition.
- Featured PPP case: a full-width, original-aspect image followed by larger typography and a separate production summary, replacing the repeated small image/text split.
- Three film collections have short, muted previews. Fine-pointer hover starts after a 160 ms intent delay. Explicit play/pause buttons support keyboard and touch. No preview URL is attached before intent.
- Mobile preview buttons are below the image. They do not cover the film's embedded captions.
- Pointer departure stops hover previews; explicit playback remains under user control. Leaving the viewport or hiding the document pauses playback. Reduced-motion and Save Data preferences suppress hover autoplay.
- Work-card covers, titles and case links use native same-document View Transitions where supported. The clicked source alone receives the shared cover name; the destination retains the selected catalogued cover. Normal links remain the fallback, including modified clicks and reduced-motion navigation.
- Case pages are synchronously available for the snapshot. HashRouter uses `useTransitions={false}` to allow the native transition callback to commit navigation. URLs, navigation labels and analytics event names are unchanged.

## Assets

Original files are unchanged. New derived previews are in `public/assets/derived/motion-previews/2026-09-27/`:

| Source | Segment | Output | Bytes |
| --- | --- | --- | --- |
| PPP film 04 | 26–34 seconds | 960 × 540 / 24 fps / silent H.264 | 592731 |
| AI film new 4 | 1–7 seconds | 960 × 540 / 24 fps / silent H.264 | 718355 |

The existing ballet 9–17 second preview is reused. All preview records include checksums and segment information; the two new records also include the source checksum and provenance. Rights remain those of their parent assets.

Regenerate with `npm run assets:previews`, then run `npm run assets:check`. Run the preview command again after rebuilding the base asset catalog or importing a new PPP release, because those importers replace their catalogs. Review segment choices when source films change; the new preview script verifies each input against its current catalog checksum before encoding.

Checkpoint: `.local/checkpoints/before-screening-room-20260927.zip`.

## Verification

- Lint, production build and the 64-source checksum audit pass.
- The initial three work-preview video elements have no source URL and are paused.
- PPP and AI previews reach playable state, advance time, remain muted and have no media error. PPP pauses through its control. Offscreen previews were observed paused after navigating to About.
- Mouse-click and keyboard Enter both reach the PPP case with the selected terrace image preserved.
- The opening's `frame-open` and `title-enter` animations are applied in the browser. Native cover transition CSS and synchronous navigation are present; navigation completed without browser console warnings or errors during testing.
- Viewports checked: 1440 px desktop, 768 px tablet, 390 px English/light mobile and 320 px Traditional Chinese. No horizontal document overflow in those observations.
- At 390 px the preview button sits below the image and remains 45 px tall.
- Reduced-motion and unsupported-API fallback branches were reviewed in code; OS-level motion emulation and older-browser testing were not performed. Hover departure was reviewed in code, not independently mouse-hover tested by automation.
- No claim of a Lighthouse score or real-device Safari validation.

## Implementation references

- [MDN: same-document View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition)
- [React: synchronous DOM updates](https://react.dev/reference/react-dom/flushSync)

No deployment, Git push, replacement of owner artwork, new dependencies or changes to installed Skill files.
