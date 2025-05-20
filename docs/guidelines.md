# Contributor Guidelines

This project follows a few simple rules so the stack stays reproducible and easy to debug.

## Testing
- **Unit & integration tests** live under `contracts/test/` and `services/bundler/test/`.
- **E2E tests** are located in `e2e/tests/`.
- Run the entire suite with `pnpm test`.
- Type checking is done via `pnpm typecheck`.
- Lint and formatting are enforced with `pnpm lint`.
- Use `make ci` to run lint, type checks, fuzzing and Slither together.

## Starting the stack
- Development: `docker compose up` spins up Anvil, the Bundler and the web app.
- Production: `docker-compose -f docker-compose.prod.yml up -d`.
- Alternatively, `pnpm dev` can run the Bundler and Next.js locally without Docker.

## Coding conventions
- Only use **PNPM workspace** commands; never run `npm install` inside subfolders.
- Formatting is handled by Prettier and ESLint (flat config). Run `pnpm lint` before committing.
- Solidity sources target `pragma ^0.8.24;` with paths defined in `contracts/foundry.toml`.

## Retrieving credentials
- Copy `apps/web/.env.example` to `.env` and request the values for `NEXT_PUBLIC_BUNDLER_URL`, `ENTRY_POINT`, `PAYMASTER_ADDRESS`, and `PAYMASTER_KEY` from the maintainers.
- Additional environment variables for CI or deployments can be requested via a GitHub Issue or direct email to the project maintainers.
