#!/usr/bin/env bash

set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
temp_dir="$(mktemp -d)"

cleanup() {
	git -C "$repo_root" worktree remove --force "$temp_dir" >/dev/null 2>&1 || true
	rm -rf "$temp_dir"
}

trap cleanup EXIT

git -C "$repo_root" fetch origin backup:refs/heads/backup
git -C "$repo_root" worktree add --force "$temp_dir" backup

rsync -a --delete \
	--exclude='.git' \
	--exclude='.venv' \
	--exclude='venv' \
	--exclude='__pycache__' \
	--exclude='node_modules' \
	--exclude='app.sock' \
	"$repo_root/" "$temp_dir/"

git -C "$temp_dir" add -A

if git -C "$temp_dir" diff --cached --quiet; then
	echo "No backup changes to commit."
	exit 0
fi

git -C "$temp_dir" commit -m "$timestamp"
git -C "$temp_dir" push origin backup

echo "Backup pushed to origin/backup with commit: $timestamp"
