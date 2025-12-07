# GenUI Development Helper Script
# Run with: .\dev-helper.ps1 [command]

param(
    [Parameter(Mandatory=$false)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "
╔══════════════════════════════════════════════════════════╗
║              GenUI Development Helper                     ║
╚══════════════════════════════════════════════════════════╝

Available Commands:

  setup         First-time setup (install dependencies)
  dev           Start frontend development server
  build         Build frontend for production
  extension     Build and copy to chrome-dev folder
  package       Create Sigma deployment package
  deploy        Deploy Catalyst function
  clean         Clean build files
  git-status    Show git status and branch info
  test          Run all tests
  help          Show this help message

Examples:
  .\dev-helper.ps1 setup
  .\dev-helper.ps1 dev
  .\dev-helper.ps1 build

" -ForegroundColor Cyan
}

function Run-Setup {
    Write-Host "🔧 Running first-time setup..." -ForegroundColor Yellow
    
    # Check Node.js
    Write-Host "Checking Node.js..." -ForegroundColor Cyan
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
    } else {
        Write-Host "✗ Node.js not found. Please install Node.js first!" -ForegroundColor Red
        return
    }
    
    # Install frontend dependencies
    Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    Set-Location ..
    
    # Install Catalyst CLI
    Write-Host "`n☁️ Installing Zoho Catalyst CLI..." -ForegroundColor Cyan
    $catalystExists = Get-Command catalyst -ErrorAction SilentlyContinue
    if (!$catalystExists) {
        npm install -g zcatalyst-cli
        Write-Host "✓ Catalyst CLI installed" -ForegroundColor Green
    } else {
        Write-Host "✓ Catalyst CLI already installed" -ForegroundColor Green
    }
    
    Write-Host "`n✅ Setup complete! Run '.\dev-helper.ps1 dev' to start development" -ForegroundColor Green
}

function Run-Dev {
    Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
    Set-Location frontend
    npm run dev
    Set-Location ..
}

function Run-Build {
    Write-Host "📦 Building frontend for production..." -ForegroundColor Yellow
    Set-Location frontend
    npm run build
    Set-Location ..
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed!" -ForegroundColor Red
    }
}

function Build-Extension {
    Write-Host "🔧 Building Chrome extension..." -ForegroundColor Yellow
    
    # Build frontend
    Write-Host "Step 1: Building frontend..." -ForegroundColor Cyan
    Set-Location frontend
    npm run build
    Set-Location ..
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        return
    }
    
    # Copy to chrome-dev
    Write-Host "Step 2: Copying files to chrome-dev..." -ForegroundColor Cyan
    Copy-Item -Path "frontend\dist\*" -Destination "chrome-dev\" -Recurse -Force
    
    Write-Host "
✅ Extension ready!

Next steps:
1. Open Chrome and go to: chrome://extensions/
2. Enable 'Developer mode' (top-right toggle)
3. Click 'Load unpacked'
4. Select the 'chrome-dev' folder
5. Your extension is now installed!

To reload after changes:
- Run this command again
- Click the refresh icon on chrome://extensions/
" -ForegroundColor Green
}

function Create-Package {
    Write-Host "📦 Creating Sigma deployment package..." -ForegroundColor Yellow
    
    # Build frontend
    Write-Host "Step 1: Building production version..." -ForegroundColor Cyan
    Set-Location frontend
    npm run build
    Set-Location ..
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        return
    }
    
    # Copy to sigma-package
    Write-Host "Step 2: Copying to sigma-package..." -ForegroundColor Cyan
    if (!(Test-Path "sigma-package\app")) {
        New-Item -ItemType Directory -Path "sigma-package\app" -Force
    }
    Copy-Item -Path "frontend\dist\*" -Destination "sigma-package\app\" -Recurse -Force
    
    # Create ZIP
    Write-Host "Step 3: Creating ZIP file..." -ForegroundColor Cyan
    $zipPath = "genui-sigma.zip"
    if (Test-Path $zipPath) {
        Remove-Item $zipPath
    }
    Compress-Archive -Path "sigma-package\*" -DestinationPath $zipPath -Force
    
    Write-Host "
✅ Package created: genui-sigma.zip

Next steps:
1. Go to Zoho Sigma dashboard
2. Click 'Upload Extension'
3. Upload genui-sigma.zip
4. Test in Sigma sandbox
5. Submit for review!
" -ForegroundColor Green
}

function Deploy-Catalyst {
    Write-Host "☁️ Deploying to Zoho Catalyst..." -ForegroundColor Yellow
    
    # Check if logged in
    $catalystExists = Get-Command catalyst -ErrorAction SilentlyContinue
    if (!$catalystExists) {
        Write-Host "❌ Catalyst CLI not installed. Run '.\dev-helper.ps1 setup' first" -ForegroundColor Red
        return
    }
    
    Set-Location catalyst
    
    # Initialize if needed
    if (!(Test-Path "catalyst.json")) {
        Write-Host "Initializing Catalyst project..." -ForegroundColor Cyan
        catalyst init
    }
    
    # Deploy
    Write-Host "Deploying functions..." -ForegroundColor Cyan
    catalyst deploy
    
    Set-Location ..
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "
✅ Deployment successful!

Don't forget to:
1. Copy the endpoint URL from the output above
2. Update frontend/.env with the URL
3. Rebuild frontend (.\dev-helper.ps1 build)
" -ForegroundColor Green
    } else {
        Write-Host "
❌ Deployment failed!

Try:
1. Run 'catalyst login' to authenticate
2. Check you're in the right directory
3. Review any error messages above
" -ForegroundColor Red
    }
}

function Clean-Build {
    Write-Host "🧹 Cleaning build files..." -ForegroundColor Yellow
    
    # Clean frontend
    if (Test-Path "frontend\dist") {
        Remove-Item -Recurse -Force "frontend\dist"
        Write-Host "✓ Cleaned frontend/dist" -ForegroundColor Green
    }
    
    # Clean chrome-dev build files
    if (Test-Path "chrome-dev\index.html") {
        Remove-Item "chrome-dev\index.html" -ErrorAction SilentlyContinue
        Write-Host "✓ Cleaned chrome-dev build files" -ForegroundColor Green
    }
    
    # Clean sigma package
    if (Test-Path "genui-sigma.zip") {
        Remove-Item "genui-sigma.zip"
        Write-Host "✓ Removed genui-sigma.zip" -ForegroundColor Green
    }
    
    Write-Host "✅ Clean complete!" -ForegroundColor Green
}

function Show-GitStatus {
    Write-Host "📊 Git Status" -ForegroundColor Yellow
    Write-Host "─────────────`n" -ForegroundColor Gray
    
    git status
    
    Write-Host "`n📍 Current Branch:" -ForegroundColor Cyan
    git branch --show-current
    
    Write-Host "`n📋 Recent Commits:" -ForegroundColor Cyan
    git log --oneline -5
}

function Run-Tests {
    Write-Host "🧪 Running tests..." -ForegroundColor Yellow
    
    # Check TypeScript compilation
    Write-Host "`nChecking TypeScript..." -ForegroundColor Cyan
    Set-Location frontend
    $tscPath = "node_modules\.bin\tsc"
    if (Test-Path $tscPath) {
        & $tscPath --noEmit
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ TypeScript: No errors" -ForegroundColor Green
        } else {
            Write-Host "✗ TypeScript: Errors found" -ForegroundColor Red
        }
    }
    
    # Check ESLint
    Write-Host "`nChecking ESLint..." -ForegroundColor Cyan
    npm run lint 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ ESLint: No errors" -ForegroundColor Green
    } else {
        Write-Host "✗ ESLint: Issues found" -ForegroundColor Red
    }
    
    Set-Location ..
    
    Write-Host "`n✅ Tests complete!" -ForegroundColor Green
}

# Main script logic
switch ($Command.ToLower()) {
    "setup" { Run-Setup }
    "dev" { Run-Dev }
    "build" { Run-Build }
    "extension" { Build-Extension }
    "package" { Create-Package }
    "deploy" { Deploy-Catalyst }
    "clean" { Clean-Build }
    "git-status" { Show-GitStatus }
    "test" { Run-Tests }
    "help" { Show-Help }
    default { 
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Show-Help 
    }
}
