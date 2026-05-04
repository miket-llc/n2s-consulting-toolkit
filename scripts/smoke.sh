#!/usr/bin/env bash
# scripts/smoke.sh — minimal smoke test for the v2 consulting toolkit.
#
# What it checks:
#   1. `pnpm next build` succeeds (TS strict + static prerender pass).
#   2. The built app boots via `pnpm next start` and serves HTTP 200 on /.
#   3. The rendered HTML contains the v2 surface markers we expect.
#
# What it does NOT check:
#   - Client-side hydration, hash routing, keyboard shortcuts, theme toggle,
#     or any interactive behavior. Those need a real browser-driver framework
#     (Playwright). When that lands, replace this script.
#
# Exits 0 on pass, non-zero on any failure. Intentionally noisy so a CI log
# is self-explanatory.

set -uo pipefail

PORT=3001
ROOT="http://localhost:${PORT}"
LOG=$(mktemp)
SERVER_PID=""

cleanup() {
  if [[ -n "${SERVER_PID}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    kill "${SERVER_PID}" 2>/dev/null || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
  rm -f "${LOG}"
}
trap cleanup EXIT

step() { printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }
fail() { printf '\033[1;31m✗ %s\033[0m\n' "$*"; exit 1; }
pass() { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }

# ── 1. Build ──────────────────────────────────────────────────────────────
step "pnpm next build"
if ! pnpm next build; then
  fail "build failed"
fi
pass "build succeeded"

# ── 2. Start ──────────────────────────────────────────────────────────────
step "pnpm next start --port ${PORT}"
pnpm next start --port "${PORT}" >"${LOG}" 2>&1 &
SERVER_PID=$!

# Wait up to 20s for the server to answer.
for _ in $(seq 1 40); do
  if curl -fsS -o /dev/null "${ROOT}" 2>/dev/null; then
    break
  fi
  sleep 0.5
done
if ! curl -fsS -o /dev/null "${ROOT}"; then
  printf '── server log ──\n' >&2
  cat "${LOG}" >&2
  fail "server did not respond on ${ROOT}"
fi
pass "server is up at ${ROOT}"

# ── 3. Smoke the rendered HTML ────────────────────────────────────────────
step "GET ${ROOT}"
HTML=$(curl -fsS "${ROOT}")
if [[ -z "${HTML}" ]]; then
  fail "empty response body"
fi

assert_contains() {
  local needle="$1"
  if grep -qF -- "${needle}" <<<"${HTML}"; then
    pass "renders \"${needle}\""
  else
    fail "missing expected marker: \"${needle}\""
  fi
}

assert_contains 'v2-shell'
assert_contains 'v2-topbar'
assert_contains 'v2-rail'
assert_contains 'v2-hero'
assert_contains 'Ellucian'
assert_contains 'Consulting Toolkit'
assert_contains 'Across your engagements'
assert_contains 'theme-light'

# Sanity: dev/error overlay should NOT be present in a production build.
if grep -qF 'next-devtools' <<<"${HTML}"; then
  fail "next-devtools shipped in production HTML — unexpected"
fi
pass "no devtools in production HTML"

printf '\n\033[1;32m✓ smoke OK\033[0m\n'
