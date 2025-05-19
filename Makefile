.PHONY: ci
ci:
<TAB>pnpm test
<TAB>pnpm typecheck
<TAB>pnpm lint
<TAB>pnpm hardhat