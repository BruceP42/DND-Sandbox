# ---------------------------------------------------------------
# Phase 0.2: Initialize Git Repo for D&D Sandbox
# ---------------------------------------------------------------

# Set sandbox path
$sandboxRoot = "C:\Users\bruce\OneDrive\D&D-Sandbox"
Set-Location $sandboxRoot

Write-Host "Initializing Git repository in $sandboxRoot..."

# 1️⃣ Initialize git repo
git init

# 2️⃣ Create .gitignore
$gitignorePath = Join-Path $sandboxRoot ".gitignore"

$gitignoreContent = @"
# Ignore system files
Thumbs.db
.DS_Store

# Ignore log files
*.log

# Ignore temporary editors / IDE files
*.swp
*.tmp
*.bak

# Ignore Node modules (if any)
node_modules/

# Ignore OS-specific files
$RECYCLE.BIN/
*.lnk
"@

$gitignoreContent | Out-File -Encoding UTF8 -FilePath $gitignorePath -Force
Write-Host "Created .gitignore"

# 3️⃣ Stage and commit all files
git add .
git commit -m "Initial commit: sandbox with SRD + custom datasets and loaders"
Write-Host "Initial commit completed."

# 4️⃣ Optional: Push to GitHub
Write-Host "`nIf you want to push to GitHub, create a repository on GitHub and then run:"
Write-Host "  git remote add origin https://github.com/<your-username>/DND-Sandbox.git"
Write-Host "  git branch -M main"
Write-Host "  git push -u origin main"
Write-Host "You will need to log in / authenticate with GitHub to push."
