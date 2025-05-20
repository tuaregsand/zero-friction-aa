# FIRST_EDIT: add Foundry bin to PATH for CI
export PATH := $(HOME)/.foundry/bin:$(PATH)
.PHONY: ci
ci:
	pnpm lint && pnpm typecheck && pnpm test && pnpm fuzz && pnpm slither && \
	if [ "$$PLAYWRIGHT_SKIP" != "true" ]; then pnpm e2e; fi || true

.PHONY: deploy-sepolia
deploy-sepolia:
RPC=$$RPC_URL CHAIN_ID=11155111 scripts/deploy.sh

