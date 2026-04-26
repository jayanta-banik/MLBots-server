# MLBots-server

Raspberry Pi friendly monorepo skeleton for a layered service stack:

- Python entrypoint at `app.py`, executed from the repository root
- Node entrypoint at `app.js`, executed from the repository root
- Vite + React + Redux frontend in `frontend`, executed from inside `frontend`
- Admin-only UI in `admin`, with admin API access protected through middleware checks
- Shared static assets in `static`

Routing and public-surface map:

- `frontend` is the main application and is built with Vite.
- `admin` is the admin-only UI; the UI itself is not fully secured, but its API endpoints are protected with middleware checks.
- Python-only endpoints, especially machine-learning related workflows, belong in the Python service exposed as `AI.mlbots.in`.
- Anything in `static` is directly accessible via `resource.mlbots.in/<filename>` and must be treated as public.

Privacy and security rules are non-negotiable: never use real PHI/PII in test data,
fixtures, prompts, logs, screenshots, or examples; never commit secrets; and never
add logging or telemetry that can capture sensitive medical or personal data.

The repository shell environment assumes the Python virtual environment is
already activated for bash sessions.

See `architecture.md` for the system diagram and `file_tree.md` for the full scaffold.

Specification-driven governance for this repo lives in `.specify/memory/constitution.md`.
