#Requires -Version 5.1
<#
.SYNOPSIS
  Create GitHub Release v0.1.0 for autohtml-ppt (tag + release notes).

.NOTES
  Prerequisites:
    1) GitHub CLI installed: winget install GitHub.cli
    2) Logged in:  & "$env:ProgramFiles\GitHub CLI\gh.exe" auth login
    3) Network can reach github.com
    4) Working tree committed (or pass -AllowDirty)
#>
param(
  [string]$Version = "0.1.0",
  [string]$Remote = "origin",
  [switch]$AllowDirty,
  [switch]$Draft
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$gh = Join-Path ${env:ProgramFiles} "GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
  $gh = "gh"
}

$tag = "v$Version"
$status = git status --porcelain
if ($status -and -not $AllowDirty) {
  Write-Host "Working tree has uncommitted changes. Commit/stash first, or pass -AllowDirty." -ForegroundColor Yellow
  Write-Host $status
  exit 1
}

Write-Host "==> Checking GitHub auth..."
& $gh auth status
if ($LASTEXITCODE -ne 0) {
  Write-Host "Run: & `"$gh`" auth login" -ForegroundColor Yellow
  exit 1
}

Write-Host "==> Pushing branch to $Remote..."
git push -u $Remote HEAD
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$existing = git tag -l $tag
if (-not $existing) {
  Write-Host "==> Creating tag $tag"
  git tag -a $tag -m "Tech Training Deck $tag"
} else {
  Write-Host "==> Tag $tag already exists locally"
}

Write-Host "==> Pushing tag $tag..."
git push $Remote $tag
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$notes = @"
## Tech Training Deck $tag

Offline single-file HTML training decks — modular ``docs/deck/`` source, AI-agent friendly authoring.

### Highlights
- Flipable HTML slides with 20 themes, per-slide particles, present mode
- Export PPTX from the browser toolbar
- Thumbnail rail / grid overview / ink annotations
- Runtime ``config.json`` (theme / particles / BGM / speaker / lang)
- Portable skill under ``docs/skills/tech-training-deck/``

### Quick start
1. Open ``docs/harness_training.html`` (prefer serving ``docs/`` over HTTP)
2. Edit slides in ``docs/deck/slides/`` then run ``python tools/build_deck.py``

### Links
- README: https://github.com/xiaoyutoucom/autohtml-ppt#readme
- Gitee mirror: https://gitee.com/xiaoyutou_647/autohtml-ppt
- License: MIT
"@

$notesFile = Join-Path $env:TEMP "autohtml-ppt-release-$tag.md"
Set-Content -Path $notesFile -Value $notes -Encoding UTF8

$draftArgs = @()
if ($Draft) { $draftArgs += "--draft" }

Write-Host "==> Creating GitHub Release $tag..."
& $gh release create $tag `
  --title "Tech Training Deck $tag" `
  --notes-file $notesFile `
  --latest `
  @draftArgs

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Done. Open: https://github.com/xiaoyutoucom/autohtml-ppt/releases/tag/$tag" -ForegroundColor Green
