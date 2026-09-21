# Link to SilkPanda Supabase project and apply migrations.
# Requires: $env:SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)

param(
  [string]$ProjectRef = "wmgqamdoqrqcyobmtxwo",
  [switch]$SkipBootstrap
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not $env:SUPABASE_ACCESS_TOKEN) {
  Write-Host "Set SUPABASE_ACCESS_TOKEN first (Supabase Dashboard -> Account -> Access Tokens)."
  exit 1
}

npx supabase login --token $env:SUPABASE_ACCESS_TOKEN | Out-Null

Write-Host "Linking project $ProjectRef..."
npx supabase link --project-ref $ProjectRef --yes

Write-Host "Pushing migrations..."
npx supabase db push --yes

Write-Host "Fetching API keys..."
$keys = npx supabase projects api-keys --project-ref $ProjectRef --reveal -o json | ConvertFrom-Json
$publishable = ($keys | Where-Object { $_.name -eq "anon" -or $_.name -eq "publishable" } | Select-Object -First 1).api_key
$service = ($keys | Where-Object { $_.name -eq "service_role" }).api_key
$projectUrl = "https://$ProjectRef.supabase.co"

$envPath = Join-Path $Root ".env.local"
$existing = if (Test-Path $envPath) { Get-Content $envPath -Raw } else { "" }

$lines = @(
  "NEXT_PUBLIC_SUPABASE_URL=$projectUrl",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$publishable",
  "SUPABASE_SERVICE_ROLE_KEY=$service",
  "",
  "DEMO_OWNER_EMAIL=owner@demo.silkpanda.local",
  "DEMO_OWNER_PASSWORD=DemoShopOwner123!"
)
$lines | Set-Content -Path $envPath -Encoding utf8
Write-Host "Updated $envPath"

if (-not $SkipBootstrap) {
  Write-Host "Bootstrapping demo shop..."
  $env:NEXT_PUBLIC_SUPABASE_URL = $projectUrl
  $env:SUPABASE_SERVICE_ROLE_KEY = $service
  node (Join-Path $PSScriptRoot "bootstrap-demo.mjs")
}

Write-Host "Done. Run: npm run dev"
