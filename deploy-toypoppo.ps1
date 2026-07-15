$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repo

node scripts/validate-toypoppo-deploy.cjs

$branch = git branch --show-current
if ($branch -ne "gh-pages") {
  throw "Deploy blocked: current branch must be gh-pages, got '$branch'."
}

$cname = (Get-Content -LiteralPath "CNAME" -Raw).Trim()
if ($cname -ne "toypoppo.kr") {
  throw "Deploy blocked: CNAME must be toypoppo.kr."
}

git push origin HEAD:gh-pages
