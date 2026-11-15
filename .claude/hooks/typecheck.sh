#!/usr/bin/env bash
# PostToolUse hook: type-check the project after an edit to a .ts/.tsx file.
# Exit code 2 sends the errors back to Claude so they get fixed right away.
set -uo pipefail

file_path=$(jq -r '.tool_input.file_path // empty')

case "$file_path" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

npx --no-install next typegen >/dev/null 2>&1
if ! output=$(npx --no-install tsc --noEmit --pretty false 2>&1); then
  echo "tsc --noEmit failed after editing $file_path:" >&2
  echo "$output" | head -40 >&2
  exit 2
fi
