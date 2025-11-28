@echo off
echo MediConnect GitHub Push Script
echo =============================

echo Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/download/win
    echo Then run this script again
    pause
    exit /b 1
)

echo Git is installed. Proceeding with setup...

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Initial commit of MediConnect healthcare platform"

echo Setting up main branch...
git branch -M main

echo Repository is ready to push!
echo.
echo To push to GitHub:
echo 1. Create a new repository on GitHub at https://github.com/new
echo 2. Copy the repository URL
echo 3. Run: git remote add origin YOUR_REPOSITORY_URL
echo 4. Run: git push -u origin main
echo.
echo Or use the GitHub CLI:
echo 1. Install GitHub CLI from https://cli.github.com/
echo 2. Run: gh repo create
echo.
pause