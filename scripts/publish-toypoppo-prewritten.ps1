param(
  [ValidateSet("auto", "region", "mrt", "education", "coupang", "season")]
  [string] $SlotType = "auto",
  [switch] $DryRun
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "..")
$QueuePath = Join-Path $ProjectRoot "data\toypoppo-prewritten-queue.json"
$LogDir = Join-Path $ProjectRoot "logs"
$LatestPath = Join-Path $LogDir "toypoppo-revenue-latest.json"
$GitExe = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
Set-Location -LiteralPath $ProjectRoot

function Get-KstDay() {
  return [System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId((Get-Date), "Korea Standard Time").ToString("yyyy-MM-dd")
}

function Normalize-PathText($PathText) {
  return ($PathText -replace "\\", "/").TrimStart("/")
}

function Set-Utf8NoBom($Path, $Value) {
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Value, $encoding)
}

function Invoke-GitSafe([string[]] $Arguments) {
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $GitExe
  foreach ($Argument in $Arguments) {
    [void] $psi.ArgumentList.Add($Argument)
  }
  $psi.WorkingDirectory = $ProjectRoot
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true

  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $psi
  [void] $process.Start()
  $stdout = $process.StandardOutput.ReadToEnd()
  $stderr = $process.StandardError.ReadToEnd()
  $process.WaitForExit()

  if ($stdout) { Write-Output ($stdout.TrimEnd()) }
  if ($stderr) { Write-Output ($stderr.TrimEnd()) }
  return $process.ExitCode
}

if (!(Test-Path -LiteralPath $QueuePath)) {
  Write-Output "NO_QUEUE"
  exit 2
}

$Queue = Get-Content -Raw -Encoding UTF8 -LiteralPath $QueuePath | ConvertFrom-Json
$today = Get-KstDay
$Items = @($Queue.items)
$Ready = $Items | Where-Object {
  $_.status -ne "published" -and
  $_.date -le $today -and
  ($SlotType -eq "auto" -or $_.slot -eq $SlotType)
} | Sort-Object date, order | Select-Object -First 1

if ($null -eq $Ready) {
  Write-Output "NO_READY_PREWRITTEN_ITEM"
  exit 2
}

$SourcePath = Join-Path $ProjectRoot $Ready.source
$TargetRel = Normalize-PathText $Ready.target
$TargetPath = Join-Path $ProjectRoot $TargetRel

if (!(Test-Path -LiteralPath $SourcePath)) {
  throw "Missing prewritten source: $SourcePath"
}

if ($DryRun) {
  Write-Output "DRY_RUN $($Ready.title) -> $TargetRel"
  exit 0
}

New-Item -ItemType Directory -Path (Split-Path -Parent $TargetPath) -Force | Out-Null
Copy-Item -LiteralPath $SourcePath -Destination $TargetPath -Force

$IndexPath = Join-Path $ProjectRoot "blog\index.html"
if (Test-Path -LiteralPath $IndexPath) {
  $index = Get-Content -Raw -Encoding UTF8 -LiteralPath $IndexPath
  $href = "/" + $TargetRel
  if ($index -notmatch [regex]::Escape($href)) {
    $card = "<a href=""$href""><strong>$($Ready.title)</strong><span>$($Ready.description)</span></a>"
    $index = $index -replace '(<main>\s*<section class="section"><div class="link-grid">)', "`$1$card"
    Set-Content -LiteralPath $IndexPath -Value $index -Encoding UTF8
  }
}

$SitemapPath = Join-Path $ProjectRoot "sitemap.xml"
if (Test-Path -LiteralPath $SitemapPath) {
  $sitemap = Get-Content -Raw -Encoding UTF8 -LiteralPath $SitemapPath
  $loc = "https://toypoppo.kr/$TargetRel"
  if ($sitemap -notmatch [regex]::Escape($loc)) {
    $url = "  <url><loc>$loc</loc><lastmod>$today</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`r`n"
    $sitemap = $sitemap -replace '</urlset>', "$url</urlset>"
  }
  $sitemap = $sitemap -replace '(<loc>https://toypoppo.kr/blog/</loc>\s*<lastmod>)(\d{4}-\d{2}-\d{2})(</lastmod>)', "`${1}$today`${3}"
  Set-Content -LiteralPath $SitemapPath -Value $sitemap -Encoding UTF8
}

if (Test-Path -LiteralPath (Join-Path $ProjectRoot "scripts\validate-toypoppo-deploy.cjs")) {
  node .\scripts\validate-toypoppo-deploy.cjs
  if ($LASTEXITCODE -ne 0) { throw "Validation failed with exit code $LASTEXITCODE" }
}

$exit = Invoke-GitSafe @("-c", "core.autocrlf=false", "add", $TargetRel, "blog/index.html", "sitemap.xml")
if ($exit -ne 0) { throw "Git add failed with exit code $exit" }

$pending = (& $GitExe status --porcelain -- $TargetRel "blog/index.html" "sitemap.xml") -join "`n"
if ($pending.Trim()) {
  $exit = Invoke-GitSafe @("commit", "-m", "Publish prewritten ToyPoppo article")
  if ($exit -ne 0) { throw "Git commit failed with exit code $exit" }
} else {
  Write-Output "NO_GIT_CHANGES target already committed"
}

$commit = (& $GitExe rev-parse --short HEAD).Trim()
$exit = Invoke-GitSafe @("push", "origin", "gh-pages")
if ($exit -ne 0) { throw "Git push failed with exit code $exit" }

if (Test-Path -LiteralPath (Join-Path $ProjectRoot "deploy-toypoppo.ps1")) {
  & (Join-Path $ProjectRoot "deploy-toypoppo.ps1")
  if ($LASTEXITCODE -ne 0) { throw "Deploy failed with exit code $LASTEXITCODE" }
}

$Ready.status = "published"
$Ready | Add-Member -NotePropertyName publishedAt -NotePropertyValue ((Get-Date).ToUniversalTime().ToString("s") + "Z") -Force
$Ready | Add-Member -NotePropertyName url -NotePropertyValue "https://toypoppo.kr/$TargetRel" -Force
Set-Utf8NoBom -Path $QueuePath -Value (($Queue | ConvertTo-Json -Depth 8) + "`n")

@{
  day = $today
  slot = $Ready.slot
  url = "https://toypoppo.kr/$TargetRel"
  title = $Ready.title
  commit = $commit
  source = "prewritten"
} | ConvertTo-Json | ForEach-Object { Set-Utf8NoBom -Path $LatestPath -Value ($_ + "`n") }

Write-Output "PUBLISHED https://toypoppo.kr/$TargetRel"
