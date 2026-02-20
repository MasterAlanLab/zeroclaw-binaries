#!/bin/sh
# ZeroClaw uninstaller for macOS and Linux
# Usage: curl -fsSL <url>/uninstall.sh | sh
#        curl -fsSL <url>/uninstall.sh | sh -s -- --purge
#
# Options:
#   --purge  Also remove config and data (~/.zeroclaw)

set -eu

INSTALL_DIR="${ZEROCLAW_INSTALL_DIR:-${HOME}/.local/bin}"
DATA_DIR="${HOME}/.zeroclaw"
BINARY="${INSTALL_DIR}/zeroclaw"
PURGE=0

for arg in "$@"; do
  case "$arg" in
    --purge) PURGE=1 ;;
    *) printf 'unknown option: %s\n' "$arg" >&2; exit 1 ;;
  esac
done

say() { printf '%s\n' "$*"; }

if [ -f "$BINARY" ]; then
  rm -f "$BINARY"
  say "Removed $BINARY"
else
  say "Binary not found at $BINARY (already removed?)"
fi

if [ "$PURGE" -eq 1 ]; then
  if [ -d "$DATA_DIR" ]; then
    rm -rf "$DATA_DIR"
    say "Removed $DATA_DIR"
  else
    say "Data directory not found at $DATA_DIR (already removed?)"
  fi
else
  if [ -d "$DATA_DIR" ]; then
    say ""
    say "Config and data remain at $DATA_DIR"
    say "To remove everything, re-run with --purge"
  fi
fi

say ""
say "ZeroClaw uninstalled."
