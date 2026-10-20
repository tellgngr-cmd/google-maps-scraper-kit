---
name: remotion-ad-videos
description: Create and render marketing ad videos (MP4) with Remotion for TikTok/Reels/Shorts, Instagram and Facebook feed, YouTube and LinkedIn ads, in brand colours, with batch variants for A/B testing by niche, city, hook or offer. Use this skill whenever the user asks for a video ad, promo video, social video, explainer clip, motion graphic, "make variants of this ad", or wants several ad versions for different audiences, even if they don't mention Remotion. Also use it for editing or re-rendering videos made from this template.
---

# Remotion ad videos

Turn an ad brief into finished MP4 files. The bundled template is a Remotion project with
one data-driven composition (`AdVideo`). Write copy as JSON, render it and hand over the
files, so the user gets real videos without touching code.

## Workflow

1. **Get the brief.** You need: product/offer, audience, platform(s), length, and CTA.
   Infer sensible defaults rather than interrogating the user. Ask only if the product or
   offer is unclear. Defaults: 15s, vertical, 3 variants.
2. **Set up the project** (once per folder):
   ```bash
   cp -r <skill-dir>/assets/template ./ad-videos && cd ad-videos && npm install
   ```
   If an `ad-videos/` folder already exists, reuse it: it keeps the user's brand.
3. **Set the brand** in `brand.json` (name, colours, font, optional logo URL or
   `staticFile` path in `public/`). Ask once for brand colours/logo if unknown, otherwise
   keep defaults. Brand settings persist, so later requests only need copy.
4. **Write the copy** into `variants.json`. Read `references/ad-copy.md` for hook formulas
   and length limits. Each variant is one video:
   ```json
   {
     "id": "dentists-miami-vertical-a",
     "format": "vertical",
     "durationSec": 15,
     "hook": "Need 500 dentist leads in Miami?",
     "benefits": ["Names, phones, websites", "Ratings & reviews", "Export to CSV in minutes"],
     "proof": "10,000+ leads pulled daily",
     "cta": "Get the kit today",
     "url": "yoursite.com",
     "brand": { "accent": "#34A853" }
   }
   ```
   `proof`, `url` and `brand` are optional. `brand` overrides `brand.json` for that variant only.
   `format` is one of `vertical` (9:16), `square` (1:1), `portrait` (4:5) or `landscape` (16:9).
   See `references/formats.md` for which platform uses which.
5. **Preview before the full batch.** Render one still from the middle of the first variant
   and look at it, so you catch overflowing text before spending minutes on renders:
   ```bash
   npx remotion still src/index.ts AdVideo out/preview.png --frame=60 --props=out/props/<id>.json
   ```
   (Run `node render-variants.mjs --only=<id>` first if the props file doesn't exist yet,
   or write the JSON for that variant to `out/props/<id>.json` yourself.)
6. **Render everything:** `node render-variants.mjs` writes `out/<id>.mp4` for each variant.
   `--only=id1,id2` re-renders just those.
7. **Deliver.** Send the MP4s to the user (use a file-sharing tool if available), with a
   short table: file, platform, hook. Suggest which variant to test first and why.

## Variant strategy

Variants exist so the user can find a winning ad fast. Change one thing per variant
(hook, offer or audience) so a winner tells them something. A good default set of 3:
a question hook, a pain/"stop doing X" hook and a number/result hook, all with the same
benefits and CTA. For niche × city campaigns, keep the structure fixed and swap the niche
and city into the hook.

## Customising the look

The design lives in `src/AdVideo.tsx`: Hook → Benefits → Proof → CTA scenes with spring
animations, timed as shares of the total length. Edit it when the user wants a different
style (new scene, product screenshot, music). For audio, put the file in `public/` and add
`<Audio src={staticFile("music.mp3")} />` from `remotion`. For a screenshot, use
`<Img src={staticFile("shot.png")} />`. Keep text big: viewers watch on phones, often muted.

## Troubleshooting

- **Browser download fails / "Failed to launch the browser"**: Remotion downloads Chrome
  Headless Shell on first render. If the network blocks it, point it at an installed
  Chrome/Chromium: `REMOTION_BROWSER="/path/to/chrome" node render-variants.mjs`
  (macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`).
- **Text overflows**: shorten the copy first (see limits in `references/ad-copy.md`);
  only shrink the font size if the copy is already tight.
- **Live editor**: `npm run studio` opens Remotion Studio in the browser to scrub and tweak.
