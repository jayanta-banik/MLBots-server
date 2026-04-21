---
name: spec-branch-bootstrap
description: 'Create the next repo branch from a feature type, feature name, and optional phase. Use when starting or continuing spec-driven work, checking whether a feature is already in development, scanning specs with regex, finding the highest NNN, and creating feat or bugfix branch names consistently.'
argument-hint: 'Provide: type (feat|bugfix), feature name, and optional phase'
---

# Spec Branch Bootstrap

## What This Skill Does

Turns a natural-language request such as "start a feat branch for patient export planning" into a repeatable branch bootstrap workflow:

1. Normalize the requested feature name into a branch-safe slug.
2. Search `specs/` with regex to determine whether the same work is already in development.
3. Reuse the existing `NNN` when the work already exists.
4. Otherwise compute the next zero-padded `NNN` from the highest existing numbered spec.
5. Build the branch name from `type`, `NNN` when applicable, optional phase, and slug.
6. Create and check out the branch.

## When to Use

- Starting a new spec-driven feature branch.
- Continuing a feature that may already have a numbered spec.
- Creating a bugfix branch while still checking whether related spec work already exists.
- Enforcing consistent branch naming before running Spec Kit flows.

## Inputs

- `type`: `feat` or `bugfix`
- `feature name`: free text, converted to lowercase kebab-case
- `phase`: optional branch stage such as `discovery`, `plan`, `tasks`, or `impl`

## Repo Assumptions

- Numbered feature workflow uses `feat/NNN-short-name` branches.
- Numbered feature specs use `specs/NNN-short-name` directories.
- `NNN` starts at `001` and increments from the highest numbered spec already present.
- Short bugfix work may use `bugfix/short-name` unless the user explicitly wants a numbered bugfix flow.

## Procedure

1. Confirm the requested inputs.
   - Require `type` and `feature name`.
   - Treat `phase` as optional.

2. Normalize the feature name.
   - Lowercase it.
   - Replace spaces and separators with `-`.
   - Remove duplicate or leading/trailing `-` characters.
   - Example: `Create New Branch` becomes `create-new-branch`.

3. Search `specs/` for existing development of the same work.
   - Prefer regex search with `rg`.
   - If `rg` is unavailable, fall back to `grep -R -n -E` for content search and `find` for directory enumeration.
   - Match numbered feature specs with a pattern like `specs/[0-9]{3}-<slug>`.
   - Also scan spec file contents when the folder name may differ slightly but the feature text clearly matches.
   - Example command:

```bash
rg -n --hidden -S "[0-9]{3}-${slug}|${feature_name}" specs/
```

   - Fallback example:

```bash
grep -R -n -E "[0-9]{3}-${slug}|${feature_name}" specs/
```

4. Decide whether this work already exists.
   - If an exact or clearly intended existing spec matches the slug, reuse that `NNN`.
   - If multiple close matches exist, stop and ask the user which spec to continue.
   - If no match exists, compute the next `NNN`.

5. Compute the next `NNN` when needed.
   - Inspect numbered spec directories with a regex such as `^specs/[0-9]{3}-`.
   - Extract all `NNN` values, take the maximum, and increment by one.
   - Zero-pad to three digits.
   - If no numbered specs exist yet, use `001`.
   - Example command:

```bash
rg --files specs | rg '^specs/[0-9]{3}-' | sed -E 's#^specs/([0-9]{3})-.*#\1#' | sort -n | tail -1
```

   - Fallback example:

```bash
find specs -maxdepth 1 -type d | grep -E '^specs/[0-9]{3}-' | sed -E 's#^specs/([0-9]{3})-.*#\1#' | sort -n | tail -1
```

6. Compose the branch name.
   - Feature default: `feat/NNN-slug`
   - Feature with phase: `feat/NNN-phase-slug`
   - Bugfix default: `bugfix/slug`
   - Bugfix with phase: `bugfix/phase-slug`
   - If the user explicitly requests numbered bugfix branches, use `bugfix/NNN-slug` or `bugfix/NNN-phase-slug`.

7. Cross-check git before creating the branch.
   - Verify the target branch name does not already exist locally or remotely.
   - If it exists, switch to it instead of creating a duplicate.
   - If a spec exists but the branch does not, create the branch from the current base branch the user expects.

8. Create and check out the branch.
   - Example:

```bash
git checkout -b "$branch_name"
```

9. Report the result clearly.
   - State whether the branch reused an existing `NNN` or allocated a new one.
   - State the exact branch name created or checked out.
   - Mention any ambiguity that required user confirmation.

## Decision Points

- If `type=feat`, always prefer the numbered spec workflow.
- If `type=bugfix`, default to unnumbered naming unless the user explicitly requests numbered bugfix branches.
- If the feature already exists in `specs/`, continue with the existing `NNN` instead of allocating a new one.
- If multiple spec matches are plausible, ask before creating a branch.
- If `phase` is provided, place it before the slug segment.

## Completion Checks

- The slug is normalized and branch-safe.
- The `specs/` search was run before allocating a new number.
- `NNN` was reused when the work already existed.
- A newly allocated `NNN` is one greater than the current maximum numbered spec.
- The final branch name matches the requested type and optional phase.
- Git confirms the branch was created or checked out successfully.

## Output Format

Return:

- Resolved input summary: type, slug, phase
- Whether the work already existed in `specs/`
- Reused or newly assigned `NNN`
- Final branch name
- Any follow-up action needed before planning or implementation