param(
  [string]$ApiBase = "https://toypoppo-public-data.rururubs.workers.dev"
)

$ErrorActionPreference = "Stop"
$regions = @(
  @{ Slug = "seoul"; Name = "서울" }, @{ Slug = "gyeonggi"; Name = "경기" },
  @{ Slug = "incheon"; Name = "인천" }, @{ Slug = "busan"; Name = "부산" },
  @{ Slug = "daegu"; Name = "대구" }, @{ Slug = "gwangju"; Name = "광주" },
  @{ Slug = "daejeon"; Name = "대전" }, @{ Slug = "ulsan"; Name = "울산" },
  @{ Slug = "sejong"; Name = "세종" }, @{ Slug = "gangwon"; Name = "강원" },
  @{ Slug = "chungbuk"; Name = "충북" }, @{ Slug = "chungnam"; Name = "충남" },
  @{ Slug = "jeonbuk"; Name = "전북" }, @{ Slug = "jeonnam"; Name = "전남" },
  @{ Slug = "gyeongbuk"; Name = "경북" }, @{ Slug = "gyeongnam"; Name = "경남" },
  @{ Slug = "jeju"; Name = "제주" }
)

$categories = @(
  @{ Type = "library"; Label = "도서관"; Tip = "영유아 자료실과 휴관일을 확인하세요." },
  @{ Type = "museum"; Label = "박물관·미술관"; Tip = "아이 대상 체험과 사전예약 여부를 확인하세요." },
  @{ Type = "park"; Label = "도시공원"; Tip = "그늘·화장실·주차 위치를 먼저 살펴보세요." },
  @{ Type = "playground"; Label = "공공 어린이놀이터"; Tip = "현장 안전상태와 아이 연령에 맞는 기구인지 확인하세요." }
)

function Html([string]$value) {
  if ($null -eq $value) { $value = "" }
  return [System.Net.WebUtility]::HtmlEncode($value.Trim())
}

function MapUrl($item) {
  $query = "$($item.title) $($item.address)".Trim()
  return "https://map.kakao.com/?q=$([uri]::EscapeDataString($query))"
}

function PlaceScore($item, [string]$type) {
  $name = [string]$item.title
  $score = 0
  if ($name -match "어린이|유아|아동") { $score += 100 }
  if ($name -match "국립") { $score += 80 }
  if ($name -match "시립|도립|광역|대표|중앙") { $score += 50 }
  if ($name -match "과학|자연사|생태|천문|우주") { $score += 45 }
  if ($name -match "거점형|숲|물놀이터") { $score += 35 }
  if ($type -eq "park" -and $name -match "근린공원|수변공원") { $score += 20 }
  if ($type -eq "museum" -and $name -match "문학관|기념관") { $score -= 10 }
  if ($type -eq "library" -and $name -match "북카페|작은도서관") { $score -= 25 }
  if ([string]$item.description -match "민간") { $score -= 15 }
  return $score
}

function Select-Places($items, [string]$type, $globalSeen, [int]$limit = 3) {
  $seen = @{}
  $selected = @()
  $ranked = @($items) | Sort-Object @{ Expression = { PlaceScore $_ $type }; Descending = $true }, title
  foreach ($item in $ranked) {
    if (-not $item.title -or -not $item.address) { continue }
    $key = "$($item.title)|$($item.address)" -replace "\s+", ""
    $nameKey = ([string]$item.title -replace "\s+", "").ToLowerInvariant()
    if ($seen.ContainsKey($key) -or $globalSeen.ContainsKey($nameKey)) { continue }
    $seen[$key] = $true
    $globalSeen[$nameKey] = $true
    $selected += $item
    if ($selected.Count -ge $limit) { break }
  }
  return $selected
}

$science = (Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot "..\assets\data\science-museums.json") | ConvertFrom-Json).items
$summary = @()

foreach ($region in $regions) {
  $groups = @()
  $globalSeen = @{}
  foreach ($category in $categories) {
    $url = "$ApiBase/api/places?type=$($category.Type)&sido=$([uri]::EscapeDataString($region.Name))&limit=50&v=region-guides2"
    try {
      $payload = Invoke-RestMethod $url -TimeoutSec 60
      $places = Select-Places $payload.items $category.Type $globalSeen
    } catch {
      $places = @()
    }
    if ($places.Count) {
      $groups += [pscustomobject]@{ Label = $category.Label; Tip = $category.Tip; Places = $places }
    }
  }

  $sciencePlaces = Select-Places ($science | Where-Object {
    $_.region -eq $region.Name -and $_.address
  }) "science" $globalSeen
  if ($sciencePlaces.Count) {
    $groups += [pscustomobject]@{
      Label = "과학관·자연사관"
      Tip = "관람 대상 연령과 예약 회차를 확인하세요."
      Places = $sciencePlaces
    }
  }

  $parts = @()
  $parts += '<section class="real-place-section" data-region-places="true">'
  $parts += "<h2>$($region.Name)에서 실제로 갈 수 있는 곳</h2>"
  $parts += "<p>$($region.Name) 지역의 공공데이터와 공식 시설 목록에서 아이와 방문할 장소를 골랐습니다. 운영시간, 휴관일, 예약과 편의시설은 바뀔 수 있으므로 출발 전 시설 공식 안내를 다시 확인하세요.</p>"
  foreach ($group in $groups) {
    $parts += "<h3>$(Html $group.Label)</h3>"
    $parts += '<div class="related-grid">'
    foreach ($place in $group.Places) {
      $parts += "<a href=""$(MapUrl $place)"" target=""_blank"" rel=""noopener noreferrer""><strong>$(Html $place.title)</strong><span>$(Html $place.address)<br>$(Html $group.Tip)</span></a>"
    }
    $parts += "</div>"
  }
  $parts += '<div class="summary-box"><strong>방문 전 마지막 확인</strong><p>지도 위치만 믿기보다 공식 홈페이지나 전화로 당일 운영 여부를 확인하세요. 아이가 어릴수록 한 번에 여러 곳을 돌기보다 한 장소에서 충분히 머무는 일정이 편합니다.</p></div>'
  $parts += "</section>"
  $section = $parts -join "`n"

  $path = Join-Path $PSScriptRoot "..\local-info\$($region.Slug)\index.html"
  $html = Get-Content -Raw -Encoding UTF8 $path
  $html = [regex]::Replace($html, '<section class="real-place-section" data-region-places="true">[\s\S]*?</section>\s*(?=<h2>함께 보면 좋은 글</h2>)', "")
  $marker = "<h2>함께 보면 좋은 글</h2>"
  if (-not $html.Contains($marker)) { throw "Insertion marker missing: $path" }
  $html = $html.Replace($marker, "$section`n$marker")
  [IO.File]::WriteAllText((Resolve-Path $path), $html, (New-Object Text.UTF8Encoding($false)))

  $total = ($groups | ForEach-Object { $_.Places.Count } | Measure-Object -Sum).Sum
  $summary += [pscustomobject]@{ Region = $region.Name; Groups = $groups.Count; Places = $total }
}

$summary | Format-Table -AutoSize
