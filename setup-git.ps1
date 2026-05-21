# Check if Git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
}

# Create .gitignore if it doesn't exist
if (-not (Test-Path .gitignore)) {
    Write-Host "Creating .gitignore..." -ForegroundColor Cyan
    @'
node_modules/
.DS_Store
*.log
.gemini/
'@ | Out-File -FilePath .gitignore -Encoding utf8
}

# Stage and commit files
Write-Host "Staging and committing files..." -ForegroundColor Cyan
git add .
git commit -m "Initial commit: Sabev Raw Material Tracking App with warehouse renaming and mobile optimizations"

# Check if GitHub CLI is authenticated
Write-Host "Checking GitHub CLI authentication..." -ForegroundColor Cyan
$authStatus = gh auth status 2>&1 | Out-String

if ($authStatus -like "*Logged in to github.com*") {
    Write-Host "GitHub CLI is authenticated. Creating repository 'sabev-raw-material-tracking-app'..." -ForegroundColor Green
    gh repo create "sabev-raw-material-tracking-app" --public --source=. --push
} else {
    Write-Host "" -ForegroundColor Yellow
    Write-Host "=================================================================" -ForegroundColor Yellow
    Write-Host "GitHub CLI (gh) is not authenticated on your system." -ForegroundColor Yellow
    Write-Host "Please complete the setup manually in your terminal:" -ForegroundColor Yellow
    Write-Host "1. Authenticate with GitHub:" -ForegroundColor White
    Write-Host "   gh auth login" -ForegroundColor Green
    Write-Host "2. Create the repo and push the code:" -ForegroundColor White
    Write-Host "   gh repo create sabev-raw-material-tracking-app --public --source=. --push" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Yellow
}
