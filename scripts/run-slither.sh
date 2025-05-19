#!/usr/bin/env bash
set -e
if ! command -v slither >/dev/null 2>&1; then
  echo "slither not installed; skipping"
  exit 0
fi
slither ./contracts --solc-version 0.8.24
