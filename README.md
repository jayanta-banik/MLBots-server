# MLBots-server

Raspberry Pi friendly monorepo skeleton for a layered service stack:

- Python entrypoint at `app.py`, executed from the repository root
- Node entrypoint at `app.js`, executed from the repository root
- Vite + React + Redux frontend in `frontend`, executed from inside `frontend`
- Shared static assets in `static`

The repository shell environment assumes the Python virtual environment is
already activated for bash sessions.

See `architecture.md` for the system diagram and `file_tree.md` for the full scaffold.

Specification-driven governance for this repo lives in `.specify/memory/constitution.md`.
