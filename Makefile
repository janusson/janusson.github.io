.DEFAULT_GOAL := help
.PHONY: help lint format-check format-fix test test-cov build clean all

## help       Show this help
help:
	@grep -E '^##[[:space:]]' $(MAKEFILE_LIST) | \
		sed -E 's/^##[[:space:]]+//' | \
		awk -F '[[:space:]]{2,}' '{ printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2 }'

## lint       Type-check with astro check
lint:
	npx astro check

## format-check  Check formatting with Prettier
format-check:
	npx prettier --check .

## format-fix  Auto-fix formatting with Prettier
format-fix:
	npx prettier --write .

## test       Run unit tests with Vitest
test:
	npx vitest run

## test-cov   Run tests with coverage report
test-cov:
	npx vitest run --coverage

## build      Build the site (Astro + Pagefind)
build:
	npm run build

## clean      Remove build output
clean:
	rm -rf dist .astro coverage

## all        Run full CI pipeline
all: lint format-check test build
	@echo ""
	@echo "  All checks passed."
