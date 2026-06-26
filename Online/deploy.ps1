# Deploy E-Portfolio V2 to Cloudflare Pages
# Run this script from the Online/ directory

Write-Host "🚀 E-Portfolio V2 - Cloudflare Pages Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$deployDir = Join-Path $PSScriptRoot "deploy"

# Step 1: Check if wrangler is available
Write-Host "`n📦 Checking wrangler CLI..." -ForegroundColor Yellow
try {
    $wranglerVersion = npx wrangler --version 2>&1
    Write-Host "  ✅ Wrangler: $wranglerVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️ Installing wrangler..." -ForegroundColor Yellow
    npm install -g wrangler
}

# Step 2: Deploy
Write-Host "`n🌐 Deploying to Cloudflare Pages..." -ForegroundColor Yellow
Write-Host "  Directory: $deployDir" -ForegroundColor Gray

npx wrangler pages deploy $deployDir --project-name "e-portfolio-v2"

Write-Host "`n✨ Deployment complete!" -ForegroundColor Green
Write-Host "Your site is live at: https://e-portfolio-v2.pages.dev" -ForegroundColor Cyan
