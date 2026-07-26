# MyRealTrip workflow for ToyPoppo

## 1. Find article candidates

Use the public MyRealTrip MCP endpoint through `tools/myrealtrip_search.py`.

```powershell
python tools\myrealtrip_search.py "제주 아이와 체험" --per-page 10 --include 제주
python tools\myrealtrip_search.py "부산 아이와 체험" --per-page 10 --include 부산
python tools\myrealtrip_search.py "경주 아이와 역사 투어" --per-page 10 --include 경주
```

The script prints:

- product title
- product URL
- representative image URL
- rating and review count when provided by the MCP result
- price text when provided
- ToyPoppo article angle

Use the candidates as source data only. The article body should be written as
ToyPoppo's own parent guide, not copied from the product page.

## 2. Create affiliate short links

Create `.env` locally:

```text
MRT_API_KEY=your_api_key_here
```

Then run:

```powershell
python tools\myrealtrip_mylink.py "https://experiences.myrealtrip.com/products/6082857?utm_content=toypoppo-top"
```

Rules:

- Never commit `.env`.
- Use different `utm_content` values for top, middle, and bottom links when tracking matters.
- Product prices, ratings, review counts, options, and cancellation rules can change. Always add a change notice in the article.

## 3. Safe ToyPoppo article format

For AdSense and trust, keep information first:

- intro for parents
- who the activity fits
- age-by-age tips
- booking checklist
- one affiliate card near the top and one in the middle
- safety/comfort notes
- child conversation prompts
- after-visit home activity
- FAQ
- related internal links

Avoid using user review photos. Use the official product thumbnail for the booking
card and ToyPoppo generated images in the body with a short caption.
