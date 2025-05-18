# Zero-Friction AA Kit

## SmartAccount

Deployed Address: `0x0000000000000000000000000000000000000001`

### ABI
```json
[
  {"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_recovery","type":"address"},{"internalType":"address","name":"_entryPoint","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"execute","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"entryPoint","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"recovery","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"initCode","type":"bytes"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"uint256","name":"callGasLimit","type":"uint256"},{"internalType":"uint256","name":"verificationGasLimit","type":"uint256"},{"internalType":"uint256","name":"preVerificationGas","type":"uint256"},{"internalType":"uint256","name":"maxFeePerGas","type":"uint256"},{"internalType":"uint256","name":"maxPriorityFeePerGas","type":"uint256"},{"internalType":"bytes","name":"paymasterAndData","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"UserOperation","name":"userOp","type":"tuple"},{"internalType":"bytes32","name":"userOpHash","type":"bytes32"},{"internalType":"uint256","name":"missingAccountFunds","type":"uint256"}],"name":"validateUserOp","outputs":[{"internalType":"uint256","name":"validationData","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}
]
```

## Paymaster architecture
ZfaPaymaster builds on Infinitism's BasePaymaster. An owner controls a whitelist
of dApps and may fund the paymaster using `depositToEntryPoint`. The paymaster
sponsors operations only when the calling dApp (`tx.origin`) is approved. After
`postOp`, any ETH returned by the EntryPoint is re-deposited up to `maxRefundWei`
and a `GasSponsored` event logs the user and actual gas cost.

## Bundler architecture
The Bundler service exposes minimal ERC-4337 RPC endpoints through Fastify. Each incoming User Operation is simulated against the on-chain EntryPoint using viem and accepted only when `validationData` is zero. Accepted operations are queued and forwarded to `handleOps` once five are gathered or two seconds pass. A built‑in paymaster route signs `paymasterAndData` for whitelisted dApps and tracks the amount of gas sponsored per user in a SQLite database via Drizzle. Daily budgets limit sponsorship and any overflow results in a 403 response. The service logs "Bundler ready" on start and can be run locally with `pnpm --filter services/bundler dev`.
