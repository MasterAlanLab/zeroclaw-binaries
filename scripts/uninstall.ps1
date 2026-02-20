# ZeroClaw uninstaller for Windows
# Usage: irm <url>/uninstall.ps1 | iex
#
# To also remove config and data, set ZEROCLAW_PURGE=1 before running:
#   $env:ZEROCLAW_PURGE = '1'; irm <url>/uninstall.ps1 | iex

$ErrorActionPreference = 'Stop'

$InstallDir = if ($env:ZEROCLAW_INSTALL_DIR) { $env:ZEROCLAW_INSTALL_DIR } else { "$env:USERPROFILE\.local\bin" }
$DataDir = "$env:USERPROFILE\.zeroclaw"
$Binary = Join-Path $InstallDir 'zeroclaw.exe'
$Purge = $env:ZEROCLAW_PURGE -eq '1'

if (Test-Path $Binary) {
    Remove-Item -Force $Binary
    Write-Host "Removed $Binary"
} else {
    Write-Host "Binary not found at $Binary (already removed?)"
}

if ($Purge) {
    if (Test-Path $DataDir) {
        Remove-Item -Recurse -Force $DataDir
        Write-Host "Removed $DataDir"
    } else {
        Write-Host "Data directory not found at $DataDir (already removed?)"
    }
} else {
    if (Test-Path $DataDir) {
        Write-Host ''
        Write-Host "Config and data remain at $DataDir"
        Write-Host 'To remove everything, set $env:ZEROCLAW_PURGE = "1" and re-run'
    }
}

Write-Host ''
Write-Host 'ZeroClaw uninstalled.'
