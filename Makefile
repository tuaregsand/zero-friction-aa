# FIRST_EDIT: add Foundry bin to PATH for CI
export PATH := $(HOME)/.foundry/bin:$(PATH)
.PHONY: ci
ci:
	pnpm lint && pnpm typecheck && pnpm test && pnpm fuzz && pnpm slither || true

.PHONY: docker-build docker-push
docker-build:
	docker compose -f docker-compose.prod.yml build


docker-push:
	docker compose -f docker-compose.prod.yml push

