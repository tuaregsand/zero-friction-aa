# Zero-Friction AA Kit

[![CI](https://github.com/tuaregsand/zero-friction-aa/actions/workflows/ci.yml/badge.svg)](https://github.com/tuaregsand/zero-friction-aa/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-generated-blue)](https://github.com/tuaregsand/zero-friction-aa/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js Version](https://img.shields.io/badge/Node.js-20%2B-blue)
![Fastify Version](https://img.shields.io/badge/Fastify-v5-green)
![ERC-4337](https://img.shields.io/badge/ERC--4337-Compliant-brightgreen)

Zero-Friction AA Kit delivers an ERC-4337 Smart Account, a whitelist Paymaster, an offline-capable Bundler, and a Passkey-first Next.js front-end.

## Repo Layout

| Path                | What lives here                                       |
| ------------------- | ----------------------------------------------------- |
| `contracts/`        | SmartAccount, ZfaPaymaster, Foundry tests             |
| `services/bundler/` | Fastify v5 Bundler + Paymaster API (Drizzle + SQLite) |
| `apps/web/`         | Next 14 UI, Wagmi v2 hooks, Passkey onboarding        |

## 🚀 Quick start

```bash
docker compose up -d
open http://localhost:4000/onboard
```

## Installation & Dev Loop

```bash
# 1. Prerequisites
# Ensure Node.js 20+ and pnpm (v10+ recommended) are installed.
# Foundry (includes forge, cast, anvil) will be installed by the setup script if not found.

# 2. Clone & Bootstrap
git clone https://github.com/tuaregsand/zero-friction-aa.git
cd zero-friction-aa
./scripts/setup-dev.sh # Installs Foundry and pre-caches solc 0.8.24
pnpm install           # Installs workspace dependencies using frozen lock-file

# 3. Run Everything
pnpm dev               # Spawns Bundler (http://localhost:3001) & Next.js app (http://localhost:3000)
```

## Running Tests

```bash
# Ensure you've run ./scripts/setup-dev.sh and pnpm install first.
pnpm ci  # Runs: lint ⇒ typecheck ⇒ vitest (Bundler) ⇒ forge test (Contracts)
```

### Static Analysis

Run Slither (if installed) with:

```bash
pnpm slither
```

### Fuzz & Invariants

Forge invariants live under `contracts/test/Invariant.t.sol`.
Run them via:

```bash
pnpm fuzz
```

An Echidna config is provided in `contracts/echidna.yaml` for
additional property testing.

### Docker Compose

Launch Anvil, the Bundler and Next.js web app together:

```bash
docker-compose up --build
```


*   Foundry uses a **cached solc 0.8.24** and `FOUNDRY_OFFLINE=1` for reproducible builds (configured by `scripts/setup-dev.sh`).
*   Vitest covers Bundler service logic including Paymaster API interactions. More tests are always welcome!

## UX pattern

The web app keeps interactions minimal. Registration occurs through a short form that validates a username before invoking Passkey APIs. Actions show inline skeletons while RPC calls run, and a toast in the top-right reports errors such as failed simulations. Upon success the UI confirms the NFT mint and clears the loader. This lightweight approach provides feedback without heavy dependencies and works with Wagmi’s basic hooks.

## Architecture Deep-Dive

### SmartAccount
The core smart contract is an ERC-4337 compliant account.
*   **Deployed Address:** The actual address will be determined upon deployment with specific factory arguments. The ABI below is for a generic `SmartAccount`. `0x0000000000000000000000000000000000000001` is a placeholder.
*   **Constructor:** Takes an initial owner, an optional recovery address, and the global EntryPoint address.
*   **`execute`:** Allows the owner to execute arbitrary transactions through the account.
*   **Recovery:** If a recovery address is set, it can be used to change the owner under specific conditions.
*   **`validateUserOp`:** The heart of ERC-4337 compliance, validating UserOperations typically via owner's signature.

Its ABI is:
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

### Paymaster Architecture
The `ZfaPaymaster` (Zero-Friction AA Paymaster) contract builds upon [Infinitism's `BasePaymaster`](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/core/BasePaymaster.sol).
*   An **owner** controls a whitelist of dApp addresses (`tx.origin`) that are eligible for gas sponsorship.
*   The owner funds the Paymaster by calling `depositToEntryPoint` (or `addStake`).
*   The Paymaster sponsors UserOperations only if the `tx.origin` (the dApp initiating the UserOperation on behalf of the user) is on the whitelist.
*   After `postOp` execution, any ETH refunded by the EntryPoint to the Paymaster is re-deposited back to the EntryPoint up to `maxRefundWei` to maintain its stake.
*   A `GasSponsored` event is emitted, logging the sponsored user, the dApp, and the actual gas cost paid by the Paymaster.

### Bundler Service
The Bundler, located in `services/bundler/`, is a TypeScript micro-service using [Fastify v5](https://github.com/fastify/fastify/releases?utm_source=chatgpt.com) (requires Node.js 20+). It exposes the essential ERC-4337 RPC endpoints (`eth_sendUserOperation`, `eth_estimateUserOperationGas`, `eth_getUserOperationReceipt`).
*   **Simulation:** Each incoming UserOperation is simulated against the on-chain EntryPoint using Viem's `simulateHandleOp` to ensure `validationData` is zero (i.e., the operation is valid and, if applicable, the Paymaster accepts it).
*   **Batching:** Accepted operations are queued and batched. They are forwarded to the EntryPoint's `handleOps` method once a certain number of operations are gathered (e.g., 5) or a timeout occurs (e.g., 2 seconds).
*   **Integrated Paymaster Logic:** A specific route handles requests for `paymasterAndData`. If the dApp is whitelisted, this route generates and signs the `paymasterAndData` field.
*   **Gas Tracking & Budgeting:** Gas sponsored per user (or dApp) is tracked in a SQLite database using [Drizzle ORM](https://orm.drizzle.team/docs/get-started-sqlite?utm_source=chatgpt.com) with the `better-sqlite3` driver. This choice provides a simple, synchronous interface suitable for this backend, avoiding the complexities of a full Prisma setup for this specific use case. Daily or total budgets can be enforced, returning a 403 error if limits are exceeded.
*   **Startup:** The service logs "Bundler ready on http://localhost:3001" upon successful start.
*   **Local Dev:** Run with `pnpm --filter services/bundler dev`.

For detailed ERC-4337 bundler client specifications, refer to the [eth-infinitism bundler reference](https://github.com/eth-infinitism/bundler?utm_source=chatgpt.com).

### Front-end (Passkey Onboarding)
The Next.js 14 application in `apps/web/` showcases a Passkey-first user onboarding experience.
*   **WebAuthn Integration:** It leverages [`@simplewebauthn/browser`](https://simplewebauthn.dev/docs/packages/browser?utm_source=chatgpt.com) for all WebAuthn (Passkey) client-side interactions. This allows users to register and authenticate using device-bound credentials (like Face ID, Touch ID, or security keys) as the primary method for controlling their Smart Account. See also [WebAuthn conditional UI guidance](https://github.com/MasterKale/SimpleWebAuthn/issues/582?utm_source=chatgpt.com).
*   **Wallet Interaction:** [Wagmi v2 hooks](https://wagmi.sh/react/guides/viem?utm_source=chatgpt.com) and [Viem](https://viem.sh/) are used for blockchain interactions, constructing UserOperations, and interfacing with the Smart Account and Paymaster.

## Road-map / Sprint Tracking
*   **Sprint 1-4:** Core ERC-4337 components (SmartAccount, ZfaPaymaster, Bundler service), initial Passkey UI in Next.js.
*   **Sprint 5 (Current):** UI polish, end-to-end flow refinement, comprehensive README update.
*   **Sprint 6 (Upcoming):** Security hardening, expanded test coverage, deployment scripts, and audit preparation.
*   _Future Sprints:_ Advanced recovery mechanisms, alternative signature schemes, gas optimization strategies.

## License & Acknowledgements
This project is licensed under the MIT License.

It builds upon the pioneering work and specifications from:
*   [Ethereum Foundation ERC-4337](https://eips.ethereum.org/EIPS/eip-4337)
*   [eth-infinitism/account-abstraction](https://github.com/eth-infinitism/account-abstraction?utm_source=chatgpt.com) (Reference implementations and libraries)

Key technologies used:
*   [Foundry](https://book.getfoundry.sh/) for smart contract development.
*   [Fastify](https://www.fastify.io/) for the Bundler backend.
*   [Drizzle ORM](https://orm.drizzle.team/?utm_source=chatgpt.com) for database interactions.
*   [SimpleWebAuthn](https://simplewebauthn.dev/) for Passkey integration.
*   [Wagmi](https://wagmi.sh/) & [Viem](https://viem.sh/) for front-end Ethereum interactions.
