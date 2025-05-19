#!/usr/bin/env bash
set -euo pipefail

ANVIL_LOG=anvil.log
BUNDLER_LOG=bundler.log

if ! command -v anvil >/dev/null; then
  echo "anvil not found" && exit 0
fi

anvil --offline --port 8545 > "$ANVIL_LOG" 2>&1 &
ANVIL_PID=$!
trap 'kill $ANVIL_PID 2>/dev/null' EXIT
sleep 2

pnpm --filter services/bundler dev > "$BUNDLER_LOG" 2>&1 &
BUNDLER_PID=$!
sleep 5

curl -sf http://localhost:3001/healthz >> "$BUNDLER_LOG"
if grep -q "Bundler ready" "$BUNDLER_LOG"; then
  echo "Bundler started"
else
  echo "Bundler failed" && exit 1
fi

echo "TODO: send UserOp to mint NFT" >> "$BUNDLER_LOG"
kill $BUNDLER_PID
