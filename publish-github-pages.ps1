# Publish the current repository to GitHub and prepare GitHub Pages.
# Run this from the project root: .\publish-github-pages.ps1

Set-StrictMode -Version Latest

if (-not (Test-Path .git)) {
    Write-Error "No git repository found. Run `git init` first."
    exit 1
}

$branch = git branch --show-current 2>$null
if ($branch -ne 'main') {
    Write-Host "Switching to branch 'main'..."
    git checkout -B main
}

$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "No origin remote configured."
    $user = Read-Host 'GitHub username'
    if (-not $user) { Write-Error 'GitHub username is required.'; exit 1 }
    $repo = Read-Host 'Repository name (default: My_Pilot_Plan)'
    if (-not $repo) { $repo = 'My_Pilot_Plan' }

    if (Get-Command gh -ErrorAction SilentlyContinue) {
        Write-Host "Creating GitHub repo with gh..."
        gh repo create "$user/$repo" --public --source . --remote origin --push | Out-Null
    } else {
        $remoteUrl = "https://github.com/$user/$repo.git"
        git remote add origin $remoteUrl
        git push -u origin main
        Write-Host "Repository remote added. You still need to enable GitHub Pages in repo settings if not already set."
    }
} else {
    Write-Host "Origin remote exists: $remoteUrl"
    git push -u origin main
}

if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "Setting up GitHub Pages on the main branch..."
    gh pages set-up --branch main --path / | Out-Null
    Write-Host "GitHub Pages should now be enabled."
} else {
    Write-Host "Install GitHub CLI (gh) and run `gh pages set-up --branch main --path /` to enable GitHub Pages automatically."
}

Write-Host "Your site URL will be: https://<your-username>.github.io/$repo/"
