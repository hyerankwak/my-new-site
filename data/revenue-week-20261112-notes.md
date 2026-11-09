# ToyPoppo: 2026-11-12 through 2026-11-18

Prepared on 2026-11-09 for the existing PC publisher. No future article is published early.

## Schedule (Asia/Seoul)

- 09:10: regional family destinations, 7 articles.
- 10:10: MyRealTrip experiences, 7 articles.
- 11:10: education and learning trials, 7 articles.
- 12:10: Coupang toys and games, 7 articles.
- 13:10: Coupang toys and games, 7 articles (existing `season` slot).

New campaign: 35 articles. Preserve the 10 ready articles for November 10-11. The queue has 45 ready articles through November 18. The five existing Windows tasks, not a Codex generation job, publish the stored HTML. The PC must be awake with network access.

## Commercial and Editorial Checks

- Coupon/price/rating changes are possible. Never promise revenue or search placement.
- Fourteen exact Coupang products were selected after keyword research and image/edition checks. Preserve `itemId` and `vendorItemId` when creating links.
- Coupang article IDs: `tp26111201` through `tp26111214`; regional article IDs: `tp261112r1` through `tp261112r7`. Pending records become reportable after publication. API reports may not support complete article-level attribution.
- Display observed prices with a November 9 observation notice. Do not invent Coupang rating/review data that the product API did not provide.
- Skippity image shows age 5+, not 6+. The article targets six-year-old families but correctly distinguishes target audience from the product label.
- The selected Rubik's product image is 2x2, not 3x3. Play-Doh's box shows 65 pots, not 65 distinct colors. Numberblocks is the 1-10 set.
- Seven previously approved MyRealTrip affiliate links were followed and matched to the intended product IDs. Do not substitute ordinary purchase URLs. Ratings/reviews: 3880363 4.9/473; 6117888 4.7/30; 3827459 4.9/13; 3880435 5.0/1; 3884989 4.9/52; 6114787 4.9/172; 4321186 4.9/86. Product 4321186 has no verified current starting price, so ask readers to check the chosen date/person option.
- Official destination pages support regional visit information. Optional home-play products are not represented as required gear, official facility products, or admission inclusions.
- Five education campaign links returned HTTP 200. No unverified trial length, device return fee, discount or contract condition is asserted.
- Every article has two distinct body images, affiliate disclosure, canonical metadata, Article/FAQ/Breadcrumb schema and prominent affiliate cards. Product-card images are actual product images; generated body scenes are explicitly labeled as illustrative, not real visits or product tests.

## New AI Photo Prompt Set

Output directory: `assets/images/blog/`. Each image is a photorealistic Korean family scene, no text overlays, no watermark, no testimonial claim and no copied commercial product design.

- `week-20261112-clay-play.webp`: a five-year-old rolls and flattens colored dough on a washable mat while a parent observes; plain unbranded pots; no eating or food props.
- `week-20261112-clay-storage.webp`: a visibly different overhead tidy-up scene, child returns dough to a plain pot while a parent holds the lid.
- `week-20261112-cube.webp`: a nine-year-old handles an unbranded 2x2 cube with exactly two rows and two columns on each visible face while a parent observes.
- `week-20261112-icecream-roleplay.webp`: a three-year-old offers a large generic toy ice-cream cone to a parent; no electronic-feature claim or copied commercial cart.

## Validation

Run `node scripts/prepare-revenue-week-20261112.mjs --check` to validate content and queue construction without saving. Research/provision snapshots are local ignored files under `logs/`.

Run `node scripts/check-revenue-week-20261112.cjs` to verify all 35 local drafts at 360px, 390px and 1440px: 105 viewport checks. This checks schema, distinct image hashes, rendered image pixels, overflow, affiliate disclosures, card count and button sizing. Results and screenshots are local under `logs/revenue-week-20261112-*`.

Run the standard deploy validator before pushing assets and authored sources. Upload a fresh administrator snapshot after saving the queue; verify the remote snapshot, not only the local build output. Future URLs should not be treated as live pages before their scheduled publication.
