param(
  [ValidateSet("auto", "region", "mrt", "education", "coupang", "season")]
  [string] $SlotType = "auto"
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "..")
$ConfigPath = Join-Path $ProjectRoot "data\toypoppo-automation.json"
$PlanPath = Join-Path $ProjectRoot "data\toypoppo-seven-day-plan.json"
$CoupangQueuePath = Join-Path $ProjectRoot "data\coupang-toy-link-queue.md"
$LogDir = Join-Path $ProjectRoot "logs"
$LogFile = Join-Path $LogDir "toypoppo-revenue-run.log"
$LatestPath = Join-Path $LogDir "toypoppo-revenue-latest.json"
$LastMessagePath = Join-Path $LogDir "toypoppo-codex-last-message.md"
$PromptPath = Join-Path $LogDir "toypoppo-revenue-prompt.md"

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
Set-Location -LiteralPath $ProjectRoot

function Write-RunLog($Message) {
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -LiteralPath $LogFile -Value "[$stamp] $Message" -Encoding UTF8
}

function Get-KstNow() {
  return [System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId((Get-Date), "Korea Standard Time")
}

function Resolve-SlotType($Config, $RequestedSlot) {
  if ($RequestedSlot -ne "auto") { return $RequestedSlot }
  $mix = @($Config.revenueMix)
  if ($mix.Count -eq 0) { return "education" }
  $now = Get-KstNow
  $times = @($Config.revenueTimes)
  for ($i = 0; $i -lt $times.Count; $i++) {
    if ($now.ToString("HH:mm") -le $times[$i]) {
      return $mix[[Math]::Min($i, $mix.Count - 1)]
    }
  }
  return $mix[[Math]::Min($mix.Count - 1, $times.Count - 1)]
}

function Build-Prompt($ResolvedSlot) {
  $today = (Get-KstNow).ToString("yyyy-MM-dd")
  return @"
토이포포(toypoppo.kr)에 수익 최적화 SEO 글을 정확히 1개 작성해 발행한다.

작업 경로:
C:\Users\곽혜란\Documents\에드센스\toypoppo-deploy-repo

오늘 날짜: $today
실행 슬롯: $ResolvedSlot

핵심 목표:
- 검색 유입 + 수익 전환을 동시에 노린다.
- 기존 토이포포에서 품질 좋았던 글처럼 쓴다.
- 얇은 자동생성 글, 상품만 나열한 글, 내부 작업 문구가 보이는 글은 실패로 본다.

반드시 먼저 확인할 파일:
- data/toypoppo-automation.json
- data/toypoppo-seven-day-plan.json
- data/coupang-toy-link-queue.md
- sitemap.xml
- blog/index.html
- local-info/index.html
- 기존 관련 글 5개 이상

슬롯별 작업:
1. region:
   지역+아이와 갈만한 곳 검색형 글을 쓴다. 예: 중랑구 아이와 갈만한 곳, 송파구 실내 아이와 갈만한 곳.
   장소 5~8개, 연령별 코스, 비오는 날 대안, 방문 후 놀이, 쿠팡 고객추천 배너 1~2개를 자연스럽게 넣는다.

2. mrt:
   마이리얼트립 제휴 기반 아이와 체험/입장권/도슨트 글을 쓴다.
   상품명 글이 아니라 검색형 방문 가이드로 작성하고, 확인된 별점·후기수·가격만 예매 카드에 넣는다.
   임의 별점·후기수 생성 금지.

3. education:
   아이 교육·발달 정보글을 쓴다.
   예: 24개월 역할놀이, 5세 집중력 놀이, 초등 저학년 문해력 루틴, 보드게임이 발달에 좋은 이유.
   수익 글로 이어질 내부링크 허브 역할을 하게 쓴다.

4. coupang:
   data/coupang-toy-link-queue.md와 data/toypoppo-seven-day-plan.json에서 미사용 묶음을 골라 장난감·교구·보드게임 추천글을 쓴다.
   개별 상품카드에는 상품명, 추천 연령, 발달 포인트, 장점, 주의점, 이런 아이에게 추천, 상품 보러가기 버튼을 넣는다.
   모든 쿠팡 링크는 target="_blank" rel="sponsored nofollow noopener"를 넣는다.
   쿠팡파트너스 고지를 명확히 넣는다.

5. season:
   시즌/상황형 수익 글을 쓴다. 예: 비오는 날 아이와 갈만한 곳, 주말 실내 체험, 방학 체험, 어린이날 선물.
   지역글, 마이리얼트립, 쿠파스 글로 자연스럽게 내부링크를 연결한다.

공통 품질 기준:
- 제목은 검색형으로 클릭하고 싶게 쓴다.
- 본문은 최소 3,500자 이상, 가능하면 4,500~5,500자.
- 정보 70% 이상, 제휴/상품 30% 이하.
- 도입부, 상황/연령 특징, 선택 기준, 실제 방법, 부모 체크리스트, 주의사항, 요약 박스, FAQ 5개 이상, 관련 글 5개 이상, 마무리 포함.
- 본문에 실사형 생성 이미지 2~3장을 넣는다. 만화, 3D, 포스터, 텍스트 박힌 이미지는 금지.
- 이미지 아래에 "토이포포 생성형 이미지입니다."를 표시한다.
- 데스크톱 이미지 최대 너비 720px, 최대 높이 520px, object-fit: contain, 모바일 width 100%.
- title, meta description, canonical, og 태그, Article/FAQ/BreadcrumbList JSON-LD 포함.
- blog/index.html 또는 local-info/index.html에 최신 글로 연결한다.
- sitemap.xml에 URL 추가/lastmod 갱신.
- 내부링크 깨짐, 이미지 누락, 한글 깨짐, ???, 과도한 이미지 크기 금지.
- 공개 본문에 product ID, API, MCP, 검색 과정, 자동화 확인, 이번에 선정한 상품 같은 내부 문구 금지.
- 직접 다녀온 척하는 허위 경험 금지.

발행 후:
- node scripts/validate-toypoppo-deploy.cjs 실행.
- git status 확인.
- git add/commit/push.
- deploy-toypoppo.ps1 실행.
- 가능하면 라이브 URL 200과 title 확인.
- logs/toypoppo-revenue-latest.json에 { "day": "$today", "slot": "$ResolvedSlot", "url": "...", "title": "...", "commit": "..." } 형식으로 기록.

최종 응답에는 URL, 제목, 슬롯, 커밋 해시, 검증 결과만 간단히 남긴다.
"@
}

try {
  if (!(Test-Path -LiteralPath $ConfigPath)) { throw "Missing config: $ConfigPath" }
  $Config = Get-Content -Raw -LiteralPath $ConfigPath | ConvertFrom-Json
  if ($Config.enabled -eq $false) {
    Write-RunLog "SKIP: ToyPoppo automation disabled"
    exit 0
  }

  $ResolvedSlot = Resolve-SlotType -Config $Config -RequestedSlot $SlotType
  Write-RunLog "START ToyPoppo revenue slot: $ResolvedSlot"
  if (Test-Path -LiteralPath $PlanPath) { Write-RunLog "Plan found: $PlanPath" }
  if (Test-Path -LiteralPath $CoupangQueuePath) { Write-RunLog "Coupang queue found: $CoupangQueuePath" }

  $Prompt = Build-Prompt -ResolvedSlot $ResolvedSlot
  Set-Content -LiteralPath $PromptPath -Value $Prompt -Encoding UTF8
  Get-Content -Raw -LiteralPath $PromptPath | codex exec -C "$ProjectRoot" --approve-for-me -m gpt-5.5 -o "$LastMessagePath" - 2>&1 | ForEach-Object { Write-RunLog "codex: $_" }
  if ($LASTEXITCODE -ne 0) { throw "Codex generation failed with exit code $LASTEXITCODE" }

  if (Test-Path -LiteralPath (Join-Path $ProjectRoot "scripts\validate-toypoppo-deploy.cjs")) {
    node .\scripts\validate-toypoppo-deploy.cjs 2>&1 | ForEach-Object { Write-RunLog "validate: $_" }
    if ($LASTEXITCODE -ne 0) { throw "Validation failed with exit code $LASTEXITCODE" }
  }

  if (Test-Path -LiteralPath (Join-Path $ProjectRoot "deploy-toypoppo.ps1")) {
    & (Join-Path $ProjectRoot "deploy-toypoppo.ps1") 2>&1 | ForEach-Object { Write-RunLog "deploy: $_" }
    if ($LASTEXITCODE -ne 0) { throw "Deploy failed with exit code $LASTEXITCODE" }
  }

  if (!(Test-Path -LiteralPath $LatestPath)) {
    $Fallback = @{
      day = (Get-KstNow).ToString("yyyy-MM-dd")
      slot = $ResolvedSlot
      url = ""
      title = ""
      commit = ""
      note = "latest file was not written by Codex"
    }
    $Fallback | ConvertTo-Json | Set-Content -LiteralPath $LatestPath -Encoding UTF8
  }

  Write-RunLog "DONE ToyPoppo revenue slot: $ResolvedSlot"
  exit 0
} catch {
  Write-RunLog "FAILED: $($_.Exception.Message)"
  exit 1
}
