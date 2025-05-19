# FIRST_EDIT: add Foundry bin to PATH for CI
export PATH := $(HOME)/.foundry/bin:$(PATH)
.PHONY: ci
ci:
	pnpm test
	pnpm typecheck
	pnpm lint
	pnpm hardhat
