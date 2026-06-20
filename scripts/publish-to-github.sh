#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="${1:-palpatine-earth-dashboard}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required. Install: brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Log in to GitHub first:"
  gh auth login -h github.com -p https -w
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' already configured."
else
  gh repo create "$REPO_NAME" \
    --public \
    --source=. \
    --remote=origin \
    --description "Emperor Palpatine Earth intelligence dashboards — Cursor Canvas war-room panels" \
    --push
  echo "Created and pushed: https://github.com/$(gh api user -q .login)/${REPO_NAME}"
  exit 0
fi

git push -u origin main
echo "Pushed to origin main."
