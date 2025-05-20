#!/usr/bin/env bash
set -euo pipefail
RPC=${RPC:-http://localhost:8545}
CHAIN_ID=${CHAIN_ID:-$(cast chain-id --rpc-url $RPC || echo 0)}
VERIFY=${VERIFY:-false}
OWNER=${OWNER:-0x0000000000000000000000000000000000000001}
ENTRY=${ENTRY_POINT:-0x0000000000000000000000000000000000000000}
MAX_REFUND=${MAX_REFUND_WEI:-0}
ARGS="--rpc-url $RPC --broadcast"
if [ "$VERIFY" != "false" ]; then
  ARGS="$ARGS --verify"
fi
cd contracts
forge script script/Deploy.s.sol:Deploy $ARGS --sig "run(address,address,uint256)" --args "$OWNER" "$ENTRY" "$MAX_REFUND" > deploy.out
cd ..
mkdir -p deployments
ADDRS=$(grep -o "0x[a-fA-F0-9]\{40\}" contracts/deploy.out)
cat > deployments/$CHAIN_ID.json <<JSON
{
  "addresses": [
$(echo "$ADDRS" | sed 's/^/    "&",/' | sed '$s/,$//' )
  ]
}
JSON
