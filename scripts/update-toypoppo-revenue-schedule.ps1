$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "..")
$ConfigPath = Join-Path $ProjectRoot "data\toypoppo-automation.json"
$Runner = Join-Path $ScriptDir "run-toypoppo-revenue-slot.cmd"
$Config = Get-Content -Raw -LiteralPath $ConfigPath | ConvertFrom-Json
$Times = @($Config.revenueTimes)

if ($Times.Count -ne 5) { throw "revenueTimes must contain exactly five times." }
if (!(Test-Path -LiteralPath $Runner)) { throw "Missing runner: $Runner" }

Get-ScheduledTask -TaskName "ToyPoppoRevenue*" -ErrorAction SilentlyContinue | Disable-ScheduledTask -ErrorAction SilentlyContinue | Out-Null

foreach ($Time in $Times) {
  if ($Time -notmatch "^([01]\d|2[0-3]):[0-5]\d$") { throw "Invalid time: $Time" }
  $TaskName = "ToyPoppoRevenue$($Time.Replace(':', ''))"
  schtasks /Create /F /SC DAILY /ST $Time /TN $TaskName /TR "`"$Runner`"" /IT | Out-Null
  if ($Config.enabled -eq $false) { Disable-ScheduledTask -TaskName $TaskName | Out-Null }
  Write-Output "Updated $TaskName -> $Time"
}

Write-Output "Five-slot ToyPoppo revenue schedule updated."
