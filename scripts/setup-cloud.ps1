# Provisions a Supabase cloud project, pushes migrations, writes .env.local, bootstraps demo data.
# Prerequisite: Supabase access token
#   npx supabase login
#   OR set $env:SUPABASE_ACCESS_TOKEN = "sbp_..."

param(
  [string]$ProjectName = "silkpanda-mvp",
  [string]$Region = "ap-south-1",
  [string]$OrgId = "",
  [switch]$SkipBootstrap
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if ($env:SUPABASE_ACCESS_TOKEN) {
  npx supabase login --token $env:SUPABASE_ACCESS_TOKEN | Out-Null
}

Write-Host "Checking Supabase CLI auth..."
$projectsJson = npx supabase projects list -o json 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host $projectsJson
  Write-Host ""
  Write-Host "Not logged in. Run: npx supabase login"
  Write-Host "Or set SUPABASE_ACCESS_TOKEN (Dashboard -> Account -> Access Tokens)."
  exit 1
}

if (-not $OrgId) {
  $orgsJson = npx supabase orgs list -o json | ConvertFrom-Json
  if (-not $orgsJson -or $orgsJson.Count -eq 0) {
    Write-Error "No Supabase organizations found for this account."
  }
  $OrgId = $orgsJson[0].id
  Write-Host "Using organization: $($orgsJson[0].name) ($OrgId)"
}

$existing = ($projectsJson | ConvertFrom-Json) | Where-Object { $_.name -eq $ProjectName }
if ($existing) {
  $projectRef = $existing.id
  Write-Host "Project '$ProjectName' already exists (ref: $projectRef)."
} else {
  $dbPassword = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 24 | ForEach-Object { [char]$_ })
  Write-Host "Creating project '$ProjectName' in $Region..."
  $createOut = npx supabase projects create $ProjectName --org-id $OrgId --db-password $dbPassword --region $Region -o json | ConvertFrom-Json
  $projectRef = $createOut.id
  Write-Host "Created project ref: $projectRef"
  Write-Host "Waiting for project to become active (up to ~2 min)..."
  $deadline = (Get-Date).AddMinutes(3)
  do {
    Start-Sleep -Seconds 10
    $status = npx supabase projects list -o json | ConvertFrom-Json | Where-Object { $_.id -eq $projectRef }
    if ($status -and $status.status -eq "ACTIVE_HEALTHY") { break }
  } while ((Get-Date) -lt $deadline)
}

Write-Host "Linking local repo to project $projectRef..."
npx supabase link --project-ref $projectRef --yes

Write-Host "Pushing database migrations..."
npx supabase db push --yes

Write-Host "Fetching API keys..."
$keys = npx supabase projects api-keys --project-ref $projectRef --reveal -o json | ConvertFrom-Json
$anon = ($keys | Where-Object { $_.name -eq "anon" }).api_key
$service = ($keys | Where-Object { $_.name -eq "service_role" }).api_key
$projectUrl = "https://$projectRef.supabase.co"

$envPath = Join-Path $Root ".env.local"
@"
NEXT_PUBLIC_SUPABASE_URL=$projectUrl
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$anon
SUPABASE_SERVICE_ROLE_KEY=$service

DEMO_OWNER_EMAIL=owner@demo.silkpanda.local
DEMO_OWNER_PASSWORD=DemoShopOwner123!
"@ | Set-Content -Path $envPath -Encoding utf8

Write-Host "Wrote $envPath"

if (-not $SkipBootstrap) {
  Write-Host "Bootstrapping demo shop owner + catalog..."
  $env:NEXT_PUBLIC_SUPABASE_URL = $projectUrl
  $env:SUPABASE_SERVICE_ROLE_KEY = $service
  node (Join-Path $PSScriptRoot "bootstrap-demo.mjs")
}

Write-Host ""
Write-Host "Supabase setup complete."
Write-Host "  Project URL: $projectUrl"
Write-Host "  Next: npm run dev"
