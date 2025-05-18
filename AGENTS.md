# Zero-Friction AA Kit · AGENTS.md
Codex, thanks for helping!  Please respect the following repo conventions.

## 🛠️ Commands to run
- **Full test suite:** `pnpm test`
- **Type-check:**     `pnpm typecheck`
- **Lint & format:**  `pnpm lint`
- **Contracts:**      `pnpm hardhat test`
Run *all* of the above before committing a patch or opening a PR.

## 🔍 Folder map
| Path                    | Purpose                                  |
|-------------------------|------------------------------------------|
| contracts/              | Solidity / Foundry tests                |
| services/bundler/       | Node micro-service + Vitest             |
| apps/web/               | Next.js (App Router) + Wagmi + Viem     |

## 📜 Coding standards
- Use **PNPM workspaces** – never run `npm install` in a sub-folder.
- Keep Solidity at `pragma ^0.8.24;`.
- Front-end must pass **ESLint + Prettier** with the repo config.

## ✅ PR checklist
1. All tests pass locally.
2. `pnpm lint` shows no errors.
3. Describe *why* a change is needed in the PR body.

## 🧪 Programmatic checks
A pre-commit hook enforces lint + test.  If it fails, fix and recommit.

<!-- Codex spec footers -->
<!-- scope: entire repo -->
