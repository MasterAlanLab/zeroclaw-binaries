#!/bin/sh
# ZeroClaw installer for macOS and Linux
# Usage: curl -fsSL <url>/install.sh | bash
#
# Environment variables:
#   ZEROCLAW_INSTALL_DIR  — installation directory (default: ~/.local/bin)
#   ZEROCLAW_VERSION      — specific version to install (default: latest)

set -eu

BASE_URL="${ZEROCLAW_BASE_URL:-https://dl.zeroclaw.mdzz.uk}"
MANIFEST_URL="${BASE_URL}/releases/manifest.json"
INSTALL_DIR="${ZEROCLAW_INSTALL_DIR:-${HOME}/.local/bin}"

say() { printf '%s\n' "$*"; }
err() { say "error: $*" >&2; exit 1; }

need() {
  command -v "$1" >/dev/null 2>&1 || err "need $1 (command not found)"
}

fetch() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$1"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO- "$1"
  else
    err "need curl or wget"
  fi
}

download() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$2" "$1"
  else
    wget -qO "$2" "$1"
  fi
}

detect_target() {
  os=$(uname -s)
  arch=$(uname -m)

  case "$os" in
    Linux)
      case "$arch" in
        x86_64|amd64)   echo "x86_64-unknown-linux-gnu" ;;
        aarch64|arm64)   echo "aarch64-unknown-linux-musl" ;;
        armv7*|armhf)    echo "armv7-unknown-linux-musleabihf" ;;
        *)               err "unsupported architecture: $arch" ;;
      esac
      ;;
    Darwin)
      case "$arch" in
        arm64)   echo "aarch64-apple-darwin" ;;
        *)       err "unsupported architecture: $arch (only Apple Silicon is supported)" ;;
      esac
      ;;
    *)
      err "unsupported OS: $os"
      ;;
  esac
}

verify_sha256() {
  file="$1"
  expected="$2"

  if command -v sha256sum >/dev/null 2>&1; then
    actual=$(sha256sum "$file" | awk '{print $1}')
  elif command -v shasum >/dev/null 2>&1; then
    actual=$(shasum -a 256 "$file" | awk '{print $1}')
  else
    say "warning: cannot verify SHA256 (no sha256sum or shasum)"
    return 0
  fi

  if [ "$actual" != "$expected" ]; then
    err "SHA256 mismatch\n  expected: $expected\n  actual:   $actual"
  fi
  say "SHA256 verified."
}

main() {
  say "Installing ZeroClaw..."
  say ""

  target=$(detect_target)
  say "  Platform: $target"

  # Get version — either from env or from manifest
  if [ -n "${ZEROCLAW_VERSION:-}" ]; then
    version="$ZEROCLAW_VERSION"
  else
    manifest=$(fetch "$MANIFEST_URL")
    version=$(printf '%s' "$manifest" | grep -o '"latest" *: *"[^"]*"' | head -1 | sed 's/.*:.*"\([^"]*\)"/\1/')
    [ -n "$version" ] || err "failed to parse latest version from manifest"
  fi
  say "  Version:  $version"

  archive_url="${BASE_URL}/releases/${version}/zeroclaw-${target}.tar.gz"
  sha256sums_url="${BASE_URL}/releases/${version}/SHA256SUMS"
  say "  URL:      $archive_url"
  say ""

  # Temp directory with cleanup
  tmpdir=$(mktemp -d)
  trap 'rm -rf "$tmpdir"' EXIT

  # Download archive
  say "Downloading..."
  download "$archive_url" "$tmpdir/zeroclaw.tar.gz"

  # Verify SHA256
  sha256sums=$(fetch "$sha256sums_url" 2>/dev/null || true)
  if [ -n "$sha256sums" ]; then
    expected=$(printf '%s\n' "$sha256sums" | grep "zeroclaw-${target}" | awk '{print $1}')
    if [ -n "$expected" ]; then
      verify_sha256 "$tmpdir/zeroclaw.tar.gz" "$expected"
    fi
  else
    say "warning: SHA256SUMS not available, skipping verification"
  fi

  # Extract and install
  tar xzf "$tmpdir/zeroclaw.tar.gz" -C "$tmpdir"
  mkdir -p "$INSTALL_DIR"
  mv "$tmpdir/zeroclaw" "$INSTALL_DIR/zeroclaw"
  chmod +x "$INSTALL_DIR/zeroclaw"

  say ""
  say "Installed zeroclaw v${version} to ${INSTALL_DIR}/zeroclaw"

  # Check PATH
  case ":${PATH}:" in
    *":${INSTALL_DIR}:"*)
      ;;
    *)
      say ""
      say "Add to your PATH by running:"
      say ""
      say "  export PATH=\"${INSTALL_DIR}:\$PATH\""
      say ""
      say "To make it permanent, add the line above to ~/.bashrc or ~/.zshrc"
      ;;
  esac

  say ""
  say "Run 'zeroclaw --version' to verify."
}

main
