<!--
Sync Impact Report
Version change: 1.1.0 -> 1.2.0
Modified principles:
- II. Layer Ownership Must Stay Explicit -> II. Layer Ownership Must Stay Explicit
- V. Keep the Scaffold Simple and Deployable -> V. Keep the Scaffold Simple and Deployable
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- ✅ updated /home/ubuntu/projects/MLBots-server/.specify/templates/plan-template.md
- ✅ updated /home/ubuntu/projects/MLBots-server/.specify/templates/spec-template.md
- ✅ updated /home/ubuntu/projects/MLBots-server/.specify/templates/tasks-template.md
- ✅ reviewed /home/ubuntu/projects/MLBots-server/.github/prompts/*.md
- ✅ reviewed /home/ubuntu/projects/MLBots-server/.specify/extensions/git/commands/*.md
- ✅ updated /home/ubuntu/projects/MLBots-server/README.md
Follow-up TODOs:
- None
-->

# MLBots-server Constitution

## Core Principles

### I. Runtime Boundaries Are Contracts

The repository MUST preserve a clear split between the frontend, the Node API
layer, the Python API layer, and deployment-facing root assets. Any change that
adds or modifies runtime behavior MUST identify which layer owns it, which
public endpoint or asset contract changes, and how adjacent layers consume that
contract. Cross-layer coupling through incidental imports, shared mutable files,
or undocumented response shapes is prohibited because it makes deployment and
debugging on Raspberry Pi targets fragile.

### II. Layer Ownership Must Stay Explicit

Code MUST be placed in the layer that owns the responsibility: UI behavior in
`frontend`, Node HTTP behavior in `node_backend`, Python HTTP behavior and
Python-only assets in `python_backend`, and compiled/static delivery artifacts
in `static` or root deployment files. New features MUST follow the existing
route -> service -> model or utility structure instead of bypassing layers with
ad hoc logic in entrypoints. This keeps the monorepo readable and prevents the
root `app.js` and `app.py` files from becoming dumping grounds. Folder names and
file names MUST use `snake_case` across both Node and Python code so paths stay
predictable and portable across the whole monorepo. Python and Node runtime
entrypoints MUST be launched from the repository root, while frontend runtime
commands MUST be launched from within `frontend`.

### III. Verification Follows Risk

Every behavior change MUST include verification proportional to its risk.
Changes to HTTP contracts, routing, serialization, build output, or deployment
scripts require automated coverage or an explicit justification in the plan for
why automated verification is deferred. At minimum, each feature spec and task
plan MUST define how the changed behavior is validated independently before it
is considered complete.

### IV. Observability Is Mandatory

Request paths, service health, and operationally relevant failures MUST be
visible through logs or explicit response metadata. New routes and background
integration points MUST emit enough structured or consistently formatted signal
to diagnose failures on low-touch environments such as Raspberry Pi hosts.
Silent failures, opaque pass-throughs, and undocumented generated assets are
not acceptable because they increase recovery time during deployment incidents.

### V. Keep the Scaffold Simple and Deployable

The repository MUST favor small, direct implementations that preserve the
current deployment model: Node 20, Yarn-managed frontend and Node tooling,
Flask/Gunicorn for Python services, PostgreSQL as the database, Prisma as the
Node data layer, SQLAlchemy as the Python data layer, and static frontend
output written to `static/frontend/build`. Frontend development MUST use Vite,
Redux for application state management, and responsive UI behavior that works
on both desktop and mobile layouts. New dependencies, services, or
infrastructure layers SHOULD only be introduced when the plan documents a
concrete need that the current scaffold cannot meet. Simplicity is a
deployment requirement here, not just a style preference.

## Technology Standards

- Python identifiers for functions, methods, variables, modules, and other
  implementation symbols MUST use `snake_case`.
- Node identifiers MUST use `camelCase` for functions, methods, variables, and
  non-type values, and `PascalCase` for classes, React components, and other
  type-like constructs.
- Constants in both runtimes MUST use `UPPER_SNAKE_CASE`.
- Node implementation code MUST use ESM conventions unless a toolchain file
  explicitly requires another module format.
- Node code MUST use the configured import aliases `#service`, `#util`,
  `#model`, and `#middleware` for non-helper internal imports. Relative imports
  such as `./some_helper.js` are allowed only for helper files local to the
  current module.
- JavaScript and frontend package workflows MUST use Yarn for commands,
  documentation, and generated instructions.
- Python commands in bash MAY assume the repository virtual environment is
  already activated through shell startup configuration.
- Python service commands MUST be run from the repository root.
- Node service commands MUST be run from the repository root.
- Frontend commands MUST be run from within `frontend`, and the frontend
  development entrypoint is expected to be exposed there via Yarn.
- Frontend applications MUST be built with Vite.
- Frontend state that spans screens, data workflows, or asynchronous UI flows
  MUST use Redux.
- Frontend interfaces MUST remain reactive and responsive across desktop and
  mobile form factors.
- PostgreSQL is the required database stack for persistent application data.
- Node persistence code MUST go through Prisma.
- Python persistence code MUST go through SQLAlchemy.
- Public API payloads SHOULD stay consistent in naming and shape across Node and
  Python layers when they represent the same concept; any intentional mismatch
  MUST be called out in the spec.
- Environment-specific assumptions such as ports, static output paths, and host
  requirements MUST be documented in plans or quickstarts when a feature
  depends on them.

## Delivery Workflow

- Each spec MUST describe the affected layer or layers, the user-visible or
  operator-visible contract change, and the verification path.
- Each spec and plan MUST call out any naming convention, import-path, or data
  layer impact when Node or Python code is introduced or reorganized.
- Each spec and plan MUST call out runtime invocation changes, frontend state
  management impact, and responsive behavior expectations when frontend work is
  involved.
- Each plan MUST pass a constitution check covering layer ownership, contract
  impact, observability changes, and deployment implications.
- Each task list MUST include the implementation work, the required validation,
  and any documentation or operational follow-up needed for the touched layers.
- Reviews MUST reject work that mixes responsibilities across layers, omits
  verification for risky behavior changes, or introduces deployment complexity
  without written justification.

## Governance

This constitution overrides conflicting local habits for work generated through
Spec Kit artifacts in this repository. Amendments require updating this file,
updating any affected templates or guidance documents in the same change, and
recording the impact in the Sync Impact Report at the top of the file.

Versioning policy follows semantic versioning for governance itself:

- MAJOR: Removes or materially redefines a principle or governance requirement.
- MINOR: Adds a principle, section, or materially stronger requirement.
- PATCH: Clarifies wording without changing expected behavior.

Compliance review is mandatory at plan time and again during implementation
review. Any justified exception MUST be documented in the plan's complexity or
constitution-check section with the simpler alternative that was rejected.

**Version**: 1.2.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
