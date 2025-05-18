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

- 
## 🔒 Coding rules
1. Use `pragma ^0.8.24;` in all Solidity files.  
2. Do **not** commit new lockfiles (`package-lock.json`, `yarn.lock`).  
3. Keep pull-request bodies under 1 500 chars; include *why*, not just *what*.  

<!-- scope: repository -->

## ☑️ PR check-list (enforced by CI)
* `make ci` passes.  
* No TODO or FIXME comments are added without a tracking issue.  
* All exports in `/types/` have matching tests.  

## 🚨 Failure policy
If any command above fails, abort the task and push no code.  
Use *Annotated Diffs* (Codex CLI flag `--annotate`) to explain fixes when iterating.

## 🧪 Programmatic checks
A pre-commit hook enforces lint + test.  If it fails, fix and recommit.

<!-- Codex spec footers -->
<!-- scope: entire repo -->
