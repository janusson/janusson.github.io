#!/bin/sh
# responsive-check — mobile layout audit via headless Chromium.
#
# Starts the Astro preview server and a headless Chromium instance, then
# runs scripts/responsive-check.mjs, which drives the browser over CDP at
# a 390px viewport and asserts:
#   • no horizontal overflow on any page,
#   • SelectedWork grid collapses to a single column,
#   • the career timeline falls back to the left-rail layout (5 entries),
#   • the Publications theme nav becomes a horizontally scrollable tab strip,
#   • the CV download card stacks vertically.
#
# Requires: a Chromium binary (override with CHROME=/path/to/chromium).
set -e

CHROME="${CHROME:-/Applications/Chromium.app/Contents/MacOS/Chromium}"
PORT="${PORT:-4321}"
CDP_PORT="${CDP_PORT:-9226}"

npx astro preview --port "$PORT" --host 127.0.0.1 > /tmp/responsive-preview.log 2>&1 &
PREVIEW_PID=$!

"$CHROME" --headless --disable-gpu --hide-scrollbars --no-first-run \
  --user-data-dir=/tmp/chrome-cdp-profile --remote-debugging-port="$CDP_PORT" \
  --window-size=390,844 about:blank > /tmp/responsive-chrome.log 2>&1 &
CHROME_PID=$!

trap 'kill "$CHROME_PID" "$PREVIEW_PID" 2>/dev/null' EXIT

sleep 5
node scripts/responsive-check.mjs
