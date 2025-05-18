.PHONY: ci
ci:
	pnpm test
	pnpm typecheck
	pnpm lint
	pnpm hardhat test
