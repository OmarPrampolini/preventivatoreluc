$ErrorActionPreference = 'Stop'

$projectDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$localUrl = 'http://localhost:3000/'

function Test-PreventivatoreOnline {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $localUrl -TimeoutSec 1
    return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
  } catch {
    return $false
  }
}

if (-not (Test-PreventivatoreOnline)) {
  $logPath = Join-Path $projectDirectory 'preventivatore.log'
  $command = "Set-Location -LiteralPath '$($projectDirectory.Replace("'", "''"))'; npm.cmd run start *>> '$($logPath.Replace("'", "''"))'"
  Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-Command', $command -WindowStyle Hidden

  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 500
    if (Test-PreventivatoreOnline) { break }
  }
}

Start-Process $localUrl
