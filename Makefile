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

.PHONY: help deps dev preview lint format-check format-fix test test-cov build clean check audit-facts audit-deps verify-site verify all update-deps repomix responsive-check

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

## update-deps   Bump non-breaking npm dependencies, fix advisories, and refresh install stamp
update-deps:
	npx npm-check-updates --target minor -u
	npm install --no-audit --no-fund
	npm audit fix --no-audit --no-fund || true
	@touch $(STAMP)

## audit-deps    Check npm dependencies for critical vulnerabilities (production dependencies)
audit-deps: $(STAMP)
	npm audit --omit=dev --audit-level=critical

## audit-facts   Cross-check biographical facts across pages and structured sources
audit-facts:
	node audit-facts.mjs

## verify-site   Verify built dist/ routes, anchors, canonicals, link security, and image EXIF
verify-site:
	node scripts/verify-site.mjs

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

## check         Fast CI checks (lint + format + tests + fact audit, no build)
check: lint format-check test audit-facts

## verify        Full local verification gate (checks + production build + site audit)
verify: check build verify-site

## all           Run full pipeline sequentially, ending with repomix
all: deps check build verify-site repomix
	@echo ""
	@echo "  All checks passed."
