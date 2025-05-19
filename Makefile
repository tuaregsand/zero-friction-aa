# FIRST_EDIT: add Foundry bin to PATH for CI
export PATH := $(HOME)/.foundry/bin:$(PATH)
.PHONY: ci
ci:
	pnpm lint
	pnpm typecheck
	pnpm test
	pnpm fuzz
	pnpm slither

