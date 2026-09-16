$ErrorActionPreference = "Stop"
$docker = "$env:ProgramFiles\Docker\Docker\resources\bin\docker.exe"
$desktop = "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path $docker)) {
  Write-Host "Docker not found. Install Docker Desktop first."
  exit 1
}

if (-not (Get-Process "Docker Desktop" -ErrorAction SilentlyContinue)) {
  Write-Host "Starting Docker Desktop..."
  Start-Process $desktop
}

Write-Host "Waiting for Docker engine (up to 3 min)..."
$ready = $false
foreach ($i in 1..36) {
  & $docker info *> $null
  if ($LASTEXITCODE -eq 0) { $ready = $true; break }
  Start-Sleep -Seconds 5
}
if (-not $ready) {
  Write-Host "Docker is not ready. Open Docker Desktop manually, wait until it says Running, then run: npm run db:pgadmin"
  exit 1
}

Set-Location $root
& $docker compose -f docker-compose.pgadmin.yml up -d
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "pgAdmin: http://localhost:5050"
Write-Host "Login: admin@local.dev / adminpass"
Write-Host "Add server -> Host: host.docker.internal  Port: 5432  User: gameuser  Pass: gamepass  DB: 1880_game"
