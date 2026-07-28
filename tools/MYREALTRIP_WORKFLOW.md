# MyRealTrip workflow for ToyPoppo

ToyPoppo uses MyRealTrip affiliate links only as a supporting element. The
article itself should stay useful for parents even if the booking card is
removed.

## 1. Find article candidates

Use `tools/myrealtrip_search.py` when product discovery is available:

```powershell
python tools\myrealtrip_search.py "제주 아이와 체험" --per-page 10 --include 제주
python tools\myrealtrip_search.py "부산 아이와 체험" --per-page 10 --include 부산
python tools\myrealtrip_search.py "경주 아이와 역사 투어" --per-page 10 --include 경주
```

The search result may include:

- product title
- product URL
- representative image URL
- rating and review count
- price text
- ToyPoppo article angle

Use the product page only as source information. Do not copy review text or
review photos. Write the article as ToyPoppo's own parent guide.

## 2. Create one affiliate short link

Create `.env` locally. Never commit it.

```text
MRT_API_KEY=your_api_key_here
```

Then run:

```powershell
python tools\myrealtrip_mylink.py "https://experiences.myrealtrip.com/products/6082857?utm_content=toypoppo-top"
```

## 3. Convert raw product URLs already inside HTML

First scan only:

```powershell
python tools\myrealtrip_convert_links.py --root .
```

After `.env` is ready, create affiliate links and replace raw product URLs:

```powershell
python tools\myrealtrip_convert_links.py --root . --write
```

The script writes `tmp/myrealtrip-link-map.json` with the original URL,
tracking URL, affiliate URL, and file name.

## 4. Safe ToyPoppo article format

For AdSense and trust, keep information first:

- parent-focused intro
- who the activity fits
- age-by-age tips
- booking checklist
- one affiliate summary card near the top and one detailed card in the middle
- safety and comfort notes
- child conversation prompts
- after-visit home activity
- FAQ
- related internal links

Booking card rules:

- show real rating and review count only when the source page clearly provides it
- if rating/review is not visible, say it needs checking on the booking page
- include a notice that price, schedule, rating, review count, options, and refund rules can change
- make the button large and readable on mobile
- use official product thumbnails for booking cards when allowed
- use ToyPoppo generated images in body sections with a short caption
