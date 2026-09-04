# ─────────────────────────────────────────────────────────────────────────────
# Makefile — janusson.github.io
#
# All tooling targets resolve local binaries from node_modules (no `npx`
# network lookups), and depend on an install stamp so a missing or stale
# node_modules can never produce confusing "command not found" failures.
#
# Two targets intentionally use `npx` and fetch on demand:
#   update-deps  — npm-check-updates is a maintenance-time tool
#   repomix      — repomix is a one-shot analysis tool
# ─────────────────────────────────────────────────────────────────────────────

.DEFAULT_GOAL := help

# Local binaries — deterministic, offline-safe.
NODE_BIN := ./node_modules/.bin

# Install stamp: npm install runs only when package files change.
STAMP := node_modules/.install-stamp

.PHONY: help deps dev preview lint format-check format-fix test test-cov build clean check all update-deps repomix audit-facts responsive-check

## help          Show this help
help:
	@grep -E '^##[[:space:]]' $(MAKEFILE_LIST) | \
		sed -E 's/^##[[:space:]]+//' | \
		awk -F '[[:space:]]{2,}' '{ printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2 }'

## deps          Install/refresh dependencies (runs only when package files change)
deps: $(STAMP)

$(STAMP): package.json package-lock.json
	npm install --no-audit --no-fund
	@touch $(STAMP)

## dev           Run the Astro dev server
dev: $(STAMP)
	npm run dev

## preview       Serve the production build locally
preview: $(STAMP)
	npm run preview

## lint          Type-check with astro check
lint: $(STAMP)
	$(NODE_BIN)/astro check

## format-check  Check formatting with Prettier
format-check: $(STAMP)
	$(NODE_BIN)/prettier --check .

## format-fix    Auto-fix formatting with Prettier
format-fix: $(STAMP)
	$(NODE_BIN)/prettier --write .

## test          Run unit tests with Vitest
test: $(STAMP)
	$(NODE_BIN)/vitest run

## test-cov      Run tests with coverage report
test-cov: $(STAMP)
	$(NODE_BIN)/vitest run --coverage

## build         Build the site (Astro + Pagefind)
build: $(STAMP)
	npm run build

## update-deps   Bump dependencies (npm-check-updates) and reinstall
update-deps:
	npx npm-check-updates -u
	npm install --no-audit --no-fund
	@touch $(STAMP)

## audit-facts   Cross-check biographical facts across pages and structured sources
##
## Note: exits 1 while known date conflicts exist (see report).
audit-facts:
	node audit-facts.mjs

## responsive-check  Verify mobile layouts (grids, timeline, tabs) via headless Chromium
responsive-check: build
	sh scripts/responsive-check.sh

## repomix       Generate repomix-output.xml for AI analysis
repomix: $(STAMP)
	npx repomix --style xml --output repomix-output.xml

## clean         Remove build output and stray OS files
clean:
	rm -rf dist .astro coverage
	find public -name ".DS_Store" -type f -delete

## check         Fast CI checks (lint + format + tests, no build)
check: lint format-check test

## all           Run full CI pipeline sequentially, ending with repomix
all: deps lint format-check test build repomix
	@echo ""
	@echo "  All checks passed."
