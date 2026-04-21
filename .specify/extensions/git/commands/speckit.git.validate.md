---
description: "Validate current branch follows feature branch naming conventions"
---

# Validate Feature Branch

Validate that the current Git branch follows the expected requirement branch naming convention.

## Prerequisites

- Check if Git is available by running `git rev-parse --is-inside-work-tree 2>/dev/null`
- If Git is not available, output a warning and skip validation:
  ```
  [specify] Warning: Git repository not detected; skipped branch validation
  ```

## Validation Rules

Get the current branch name:

```bash
git rev-parse --abbrev-ref HEAD
```

The branch name must match one of these patterns:

1. **Feature requirement branch**: `^feat/[0-9]{3,}-` (e.g., `feat/001-user-auth`, `feat/042-admin-dashboard`)
2. **Bugfix requirement branch**: `^bugfix/[a-z0-9][a-z0-9-]*$` (e.g., `bugfix/payment-timeout`)

## Execution

If on a feature branch:
- Output: `✓ On feature branch: <branch-name>`
- Check if the corresponding spec directory exists under `specs/`:
  - Look for `specs/<prefix>-*` where prefix matches the numeric portion after `feat/`
- If spec directory exists: `✓ Spec directory found: <path>`
- If spec directory missing: `⚠ No spec directory found for prefix <prefix>`

If on a bugfix branch:
- Output: `✓ On bugfix branch: <branch-name>`
- Check if the corresponding requirement file exists under `specs/bugfix/`:
  - Look for `specs/bugfix/<branch-name>.md` using the segment after `bugfix/`

If NOT on a requirement branch:
- Output: `✗ Not on a requirement branch. Current branch: <branch-name>`
- Output: `Requirement branches should be named like: feat/001-feature-name or bugfix/short-name`

## Graceful Degradation

If Git is not installed or the directory is not a Git repository:
- Check the `SPECIFY_FEATURE` environment variable as a fallback
- If set, validate that value against the naming patterns
- If not set, skip validation with a warning

`bugfix/short-name` branches are valid for short-lived bug work and resolve to
single-file requirement artifacts under `specs/bugfix/`.
