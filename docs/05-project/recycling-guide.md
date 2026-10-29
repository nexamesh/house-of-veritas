# Recycling guide

The shared `/dashboard/[persona]/recycling` page gives Hans, Charl, Lucky and Irma a reference for sorting common household recyclables. It is educational reference content, not household inventory, a collection booking, or a live price feed. The filter and weight estimate run in the browser and store no data.

## Source of truth

- [Plastics SA material identification codes](https://www.plasticsinfo.co.za/2021/01/26/what-do-the-numbers-on-plastic-products-mean/) explains codes 1–7 and examples. A code describes the main polymer, not collection availability.
- [Petco FAQs](https://petco.co.za/faqs/) explains local acceptance and separation at source. Buyers decide which forms and grades they accept.
- [WasteGo Green buyback page](https://wastegogreen.co.za/what-we-buy) supplied the displayed R/kg examples. Checked 29 October 2026. These are one Milnerton buyer's published rates; the site asks sellers to confirm the price on the day. No quote was inferred for PVC or code 7.
- [Petco buyback centre directory](https://petco.co.za/buy-back-centres/) helps readers find a local point.

If rates are updated, edit the integer cents in `lib/recycling-guide.ts` and `PRICE_CHECKED_AT` together, after checking the buyer page. Do not imply national or guaranteed prices. The grade and sorting copy should be reviewed against the same primary sources when changed.

## Images

The three images under `public/images/recycling/` were generated with OpenAI image generation in photorealistic natural mode on 29 October 2026. They depict representative objects and have no logos, text or purported resin stamps. They do not prove a pictured item's material. Prompts:

- `hero.webp`: wide South African household recycling guide hero with separated PET bottle, HDPE jug, PP tub, LDPE bag, aluminium can, glass bottle, copper coil and steel pieces; dark slate background and negative space for heading.
- `plastics.webp`: neutral flat lay of unbranded PET bottle, HDPE jug, PP tub and LDPE film bag.
- `metals-glass.webp`: neutral table with separate clean copper wire, aluminium cans, steel offcuts and glass bottles.

## Delivery

This is an isolated UI/navigation change. Validation: `pnpm run lint`, relevant Vitest cases, `pnpm run build`, and a dashboard browser check when an authenticated test session is available. No demo data or persistence was added.
