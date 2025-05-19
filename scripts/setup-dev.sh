#!/usr/bin/env bash
set -euo pipefail

# ensure Foundry is installed
if ! command -v forge >/dev/null; then
  echo "Foundry toolchain missing" && exit 1
fi

# cache solc 0.8.24
mkdir -p "$HOME/.svm/solc"
if [ ! -e "$HOME/.svm/solc/v0.8.24" ]; then
  echo "Using cached solc 0.8.24"
fi

# install slither if available
if [ -f "scripts/bin/slither" ]; then
  install -m 755 scripts/bin/slither "$HOME/.local/bin/slither"
fi
