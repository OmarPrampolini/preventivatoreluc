$ErrorActionPreference = 'Stop'

$repositoryArchive = 'https://github.com/OmarPrampolini/preventivatoreluc/archive/refs/heads/main.zip'
$installDirectory = Join-Path $env:LOCALAPPDATA 'PreventivatoreBenifin'
$temporaryRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('preventivatore-benifin-' + [Guid]::NewGuid().ToString('N'))
$archivePath = Join-Path $temporaryRoot 'preventivatore.zip'
$extractDirectory = Join-Path $temporaryRoot 'estratto'

function Enable-Node {
  $nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
  $nodeIsRecent = $false
  if ($nodeCommand) {
    $majorVersion = [int]((node --version).TrimStart('v').Split('.')[0])
    $nodeIsRecent = $majorVersion -ge 22
  }

  if ($nodeIsRecent) { return }

  Write-Host 'Preparazione del motore locale...' -ForegroundColor Cyan
  $checksums = Invoke-WebRequest -UseBasicParsing -Uri 'https://nodejs.org/dist/latest-v22.x/SHASUMS256.txt'
  $nodeArchiveMatch = [regex]::Match($checksums.Content, '(?m)^[a-f0-9]+\s+(node-v22\.[0-9.]+-win-x64\.zip)$')
  if (-not $nodeArchiveMatch.Success) { throw 'Non è stato possibile trovare il motore locale.' }

  $nodeArchiveName = $nodeArchiveMatch.Groups[1].Value
  $nodeArchivePath = Join-Path $temporaryRoot $nodeArchiveName
  $runtimeDirectory = Join-Path $installDirectory '.runtime'
  New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
  Invoke-WebRequest -UseBasicParsing -Uri "https://nodejs.org/dist/latest-v22.x/$nodeArchiveName" -OutFile $nodeArchivePath
  Expand-Archive -LiteralPath $nodeArchivePath -DestinationPath $runtimeDirectory -Force

  $portableNodeDirectory = Join-Path $runtimeDirectory ($nodeArchiveName -replace '\.zip$', '')
  $env:Path = "$portableNodeDirectory;$env:Path"
  if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) {
    throw 'Il motore locale non è stato preparato correttamente.'
  }
}

try {
  Write-Host 'Installazione Preventivatore Benifin' -ForegroundColor Green

  New-Item -ItemType Directory -Path $temporaryRoot, $extractDirectory -Force | Out-Null
  Write-Host 'Download app...' -ForegroundColor Cyan
  Invoke-WebRequest -UseBasicParsing -Uri $repositoryArchive -OutFile $archivePath
  Expand-Archive -LiteralPath $archivePath -DestinationPath $extractDirectory -Force

  $sourceDirectory = Get-ChildItem -LiteralPath $extractDirectory -Directory | Select-Object -First 1
  if (-not $sourceDirectory) { throw 'Il pacchetto scaricato non contiene i file richiesti.' }

  if (Test-Path -LiteralPath $installDirectory) {
    $resolvedInstall = (Resolve-Path -LiteralPath $installDirectory).Path
    $resolvedLocalAppData = (Resolve-Path -LiteralPath $env:LOCALAPPDATA).Path
    if (-not $resolvedInstall.StartsWith($resolvedLocalAppData, [System.StringComparison]::OrdinalIgnoreCase)) {
      throw 'Cartella di installazione non valida.'
    }
    Remove-Item -LiteralPath $resolvedInstall -Recurse -Force
  }

  New-Item -ItemType Directory -Path $installDirectory -Force | Out-Null
  Copy-Item -Path (Join-Path $sourceDirectory.FullName '*') -Destination $installDirectory -Recurse -Force
  Enable-Node

  Push-Location $installDirectory
  try {
    Write-Host 'Preparazione app...' -ForegroundColor Cyan
    npm.cmd ci --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw 'Installazione dei componenti non riuscita.' }
    npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Preparazione non riuscita.' }
  } finally {
    Pop-Location
  }

  $desktop = [Environment]::GetFolderPath('Desktop')
  $shortcutPath = Join-Path $desktop 'Preventivatore Benifin.lnk'
  $launcherPath = Join-Path $installDirectory 'avvia-preventivatore.ps1'
  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = 'powershell.exe'
  $shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$launcherPath`""
  $shortcut.WorkingDirectory = $installDirectory
  $shortcut.Description = 'Avvia Preventivatore Benifin'
  $shortcut.Save()

  Write-Host ''
  Write-Host 'Installazione completata.' -ForegroundColor Green
  Write-Host 'Da ora basta fare doppio clic su Preventivatore Benifin sul desktop.'
  & $launcherPath
} finally {
  if (Test-Path -LiteralPath $temporaryRoot) {
    $resolvedTemporary = (Resolve-Path -LiteralPath $temporaryRoot).Path
    $resolvedSystemTemp = (Resolve-Path -LiteralPath ([System.IO.Path]::GetTempPath())).Path
    if ($resolvedTemporary.StartsWith($resolvedSystemTemp, [System.StringComparison]::OrdinalIgnoreCase)) {
      Remove-Item -LiteralPath $resolvedTemporary -Recurse -Force
    }
  }
}
