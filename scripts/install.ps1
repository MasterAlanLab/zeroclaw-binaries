# ZeroClaw installer for Windows
# Usage: irm <url>/install.ps1 | iex
#
# Environment variables:
#   ZEROCLAW_INSTALL_DIR  — installation directory (default: ~\.local\bin)
#   ZEROCLAW_VERSION      — specific version to install (default: latest)

$ErrorActionPreference = 'Stop'

$BaseUrl = if ($env:ZEROCLAW_BASE_URL) { $env:ZEROCLAW_BASE_URL } else { 'https://zeroclaw.mdzz.uk' }
$ManifestUrl = "$BaseUrl/manifest.json"
$InstallDir = if ($env:ZEROCLAW_INSTALL_DIR) { $env:ZEROCLAW_INSTALL_DIR } else { "$env:USERPROFILE\.local\bin" }
$Target = 'x86_64-pc-windows-msvc'

function Main {
    Write-Host 'Installing ZeroClaw...'
    Write-Host ''

    Write-Host "  Platform: $Target"

    # Get version
    if ($env:ZEROCLAW_VERSION) {
        $Version = $env:ZEROCLAW_VERSION
    } else {
        $Manifest = Invoke-RestMethod -Uri $ManifestUrl
        $Version = $Manifest.latest
        if (-not $Version) {
            throw 'Failed to parse latest version from manifest'
        }
    }
    Write-Host "  Version:  $Version"

    $ArchiveUrl = "$BaseUrl/releases/$Version/zeroclaw-$Target.zip"
    Write-Host "  URL:      $ArchiveUrl"
    Write-Host ''

    # Temp directory
    $TmpDir = Join-Path ([System.IO.Path]::GetTempPath()) "zeroclaw-install-$(Get-Random)"
    New-Item -ItemType Directory -Path $TmpDir -Force | Out-Null

    try {
        $Archive = Join-Path $TmpDir 'zeroclaw.zip'

        # Download
        Write-Host 'Downloading...'
        Invoke-WebRequest -Uri $ArchiveUrl -OutFile $Archive -UseBasicParsing

        # Verify SHA256
        $Sha256SumsUrl = "$BaseUrl/releases/$Version/SHA256SUMS"
        try {
            $Sha256Sums = (Invoke-WebRequest -Uri $Sha256SumsUrl -UseBasicParsing).Content
            $ExpectedLine = ($Sha256Sums -split "`n") | Where-Object { $_ -match "zeroclaw-$Target" } | Select-Object -First 1
            if ($ExpectedLine) {
                $Expected = ($ExpectedLine -split '\s+')[0].Trim()
                $Actual = (Get-FileHash $Archive -Algorithm SHA256).Hash.ToLower()
                if ($Actual -ne $Expected) {
                    throw "SHA256 mismatch`n  expected: $Expected`n  actual:   $Actual"
                }
                Write-Host 'SHA256 verified.'
            }
        } catch [System.Net.WebException] {
            Write-Host 'warning: SHA256SUMS not available, skipping verification'
        }

        # Extract
        Expand-Archive -Path $Archive -DestinationPath $TmpDir -Force

        # Install
        New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
        $Src = Join-Path $TmpDir 'zeroclaw.exe'
        $Dst = Join-Path $InstallDir 'zeroclaw.exe'
        Move-Item -Path $Src -Destination $Dst -Force

        Write-Host ''
        Write-Host "Installed zeroclaw v$Version to $Dst"

        # Check PATH
        $UserPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
        if ($UserPath -notlike "*$InstallDir*") {
            Write-Host ''
            Write-Host 'Add to your PATH by running:'
            Write-Host ''
            Write-Host "  [Environment]::SetEnvironmentVariable('PATH', `"$InstallDir;`$env:PATH`", 'User')"
            Write-Host ''
        }

        Write-Host "Run 'zeroclaw --version' to verify."
    } finally {
        Remove-Item -Recurse -Force $TmpDir -ErrorAction SilentlyContinue
    }
}

Main
