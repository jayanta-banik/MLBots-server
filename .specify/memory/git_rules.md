# Git Branch Rules

- `/speckit.specify` MUST create a new branch from the current checked-out branch.
- Feature requirements MUST use `feat/NNN-short-name` where `NNN` is the next
  zero-padded sequential number.
- Bugfix requirements MUST use `bugfix/short-name`.
- Feature requirement artifacts live in `specs/NNN-short-name/` and MUST start
  with `requirements.md`; `tasklist.md` is the paired execution artifact.
- Bugfix requirement artifacts live in `specs/bugfix/` and the primary
  requirement file MUST be named after the branch suffix (for example,
  `bugfix/payment-timeout` -> `specs/bugfix/payment-timeout.md`).
- Branch names and artifact names MUST stay concise, lowercase, and hyphenated.