<!--
Sync Impact Report
Version change: 2.1.0 -> 2.2.0
Modified principles:
- VI. Privacy, Security, and Compliance Override All Other Goals -> VI. Privacy, Security, and Compliance Override All Other Goals
Added sections:
- VII. Agent Memory Preflight Is Mandatory
- Governance escalation triggers and amendment review requirements
Removed sections:
- None
Templates requiring updates:
Version change: 2.2.0 -> 2.2.1
- ✅ updated /home/pi/MLBots-server/.specify/templates/spec-template.md
- II. Minimal Diffs Keep Risk Local -> II. Minimal Diffs Keep Risk Local
- ✅ updated /home/pi/MLBots-server/.specify/memory/README.md
- None
Follow-up TODOs:
- None
-->

- ✅ updated /home/pi/MLBots-server/.specify/templates/spec-template.md

# MLBots-server Constitution

### I. Semantic Safety Is Non-Negotiable

Agents MUST preserve existing semantic behavior unless the spec explicitly
changes it. Agents MUST NOT guess domain logic. When behavior is unclear,
agents MUST locate source-of-truth behavior in tests, existing code paths,
contracts, or operator-visible behavior, and if those sources conflict or stay
ambiguous, agents MUST stop and ask the user for clarification while presenting
the specific evidence of conflict. Existing validation rules, units, rounding,
timestamps, and interpretation logic MUST remain unchanged unless the spec says
otherwise. Almost-correct behavior is unsafe in this repository because the
backend, frontend, and operational layers depend on exact semantics.

### II. Minimal Diffs Keep Risk Local

Agents MUST keep changes small, reviewable, and directly tied to the requested
spec. Drive-by refactors, opportunistic renames, formatting churn, architecture
reshuffles, and variable-copy boilerplate unrelated to the feature are
prohibited. Agents MUST reuse existing utilities, validation flows, error
handling, and local patterns whenever they already solve the problem. Agents
MUST create the minimal changes needed to achieve the requested outcome and
SHOULD adapt surrounding callers before replacing an established shared
utility, model, middleware, or contract surface. Agents SHOULD fix only the
root cause inside the scoped area. Agents MAY record follow-up work as explicit
TODOs, but MUST NOT bundle that work into the same change set unless the spec
requests it.

### III. Incremental Migrations Preserve Operability

Large changes MUST be executed incrementally, module by module, while keeping
the codebase runnable at each step. Planning MUST begin with an inventory of
what modules exist, what calls them, and what contracts or behavior rules each
slice depends on. Migrations MUST proceed one feature slice at a time while API
semantics remain stable for unaffected callers. Plans and task lists MUST mark
clear migration checkpoints so humans can review, test, or roll back safely.
When the future scope is large enough to require staged delivery, the feature
directory under `specs` MUST include `chunked_plan.md` describing the chunks,
the file creation or modification plan for each chunk, and the stopping points
between them.

### IV. Existing Patterns Win By Default

Agents MUST locate and follow established patterns in each subproject unless a
spec explicitly mandates a new approach. This includes routing and page
composition in `frontend` and `admin`, state management and API access flows,
Express middleware, services, error responses, and any serverless mapping or
handler conventions already present in the repository. Agents SHOULD avoid
introducing new frameworks, extra architectural layers, deeply nested patterns,
or unnecessary variable redefinitions and copies. Consistency is a safety
feature in this monorepo, so deviation requires explicit spec authority.

### V. Delivery Stays Layered, Incremental, and Deployable

The repository MUST preserve a clear split between `frontend`, `node_backend`,
`python_backend`, `static`, and deployment-facing root assets. Code MUST live
in the layer that owns the responsibility, following the existing route ->
service -> model or utility structure rather than bypassing it from entrypoints.
The current deployment scaffold remains the default: Node 20, Yarn-managed
frontend and Node tooling, Flask/Gunicorn for Python services, PostgreSQL,
Prisma for Node persistence, SQLAlchemy for Python persistence, and static
frontend output written to `static/frontend/build`. Frontend work MUST use
Vite, Redux for shared application state, and responsive behavior on desktop
and mobile. Spec work MUST use short-lived Git branches named
`feat/NNN-short-name`, where `NNN` is the next zero-padded sequential feature
number starting at `001`. Non-spec bug repair work MAY use short-lived
`bugfix/short-name` branches, and those names MUST stay concise and directly
describe the bug being fixed.

### VI. Privacy, Security, and Compliance Override All Other Goals

Privacy and security rules override all other delivery goals. Agents MUST NEVER
place real PHI or PII in prompts, logs, tests, fixtures, screenshots, examples,
or debugging artifacts; synthetic data is mandatory. Agents MUST NEVER add
logging, analytics, telemetry, or tracking that can capture PHI, including
request bodies, measurement payloads, ECG traces, or free-text notes. Agents
MUST NEVER commit secrets such as tokens, passwords, private keys, or
certificates. Sensitive output MUST be redacted before it is shared. A privacy
or secret-handling failure is treated as a compliance and patient-safety
incident, not a routine bug.

### VII. Agent Memory Preflight Is Mandatory

Before generating any spec, plan, tasks, or implementation work, agents MUST
read and internalize `.specify/memory/UI_BEHAVIOR_STANDARDS.md`,
`.specify/memory/LEARNINGS.md`, and every additional file present in
`.specify/memory/`. Agents MUST apply relevant learnings and standards to the
current task. If a requested change conflicts with UI behavior standards or
established learnings, agents MUST explicitly call out the conflict and propose
the safest compliant alternative. Failing to perform this preflight invalidates
the change because it bypasses repository-specific safety and consistency rules.

## Technology Standards

- Existing tests, contracts, established code paths, and operator-visible
  runtime behavior are the source of truth for domain semantics unless a spec
  explicitly changes them.
- Existing validation behavior, units, rounding, timestamps, and interpretation
  rules MUST be preserved unless the spec explicitly changes them.
- Real PHI/PII MUST NOT appear in prompts, logs, tests, fixtures, screenshots,
  sample payloads, or debugging output; synthetic data is required.
- Logging, analytics, and telemetry MUST NOT capture PHI-bearing request
  bodies, measurement payloads, ECG traces, or free-text notes.
- Secrets such as tokens, passwords, private keys, and certificates MUST NOT be
  committed, copied into fixtures, or echoed in shared debugging output.
- `.specify/memory/UI_BEHAVIOR_STANDARDS.md` and `.specify/memory/LEARNINGS.md`
  are mandatory preflight files for generation and implementation work.
- Agents MUST also review any additional files present in `.specify/memory/`
  and apply the relevant repository standards they contain.
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
- `frontend` is the main Vite-built application entrypoint.
- `admin` is the admin-only UI entrypoint; its API endpoints are protected via
  middleware checks even if the UI itself is not yet secured.
- Python-only endpoints related primarily to machine-learning workflows live in
  the Python service exposed as `AI.mlbots.in`.
- Anything in `static` is directly accessible via `resource.mlbots.in/<filename>`
  and therefore MUST be treated as public material.
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
- Request logging, service health, and operator-visible failure signals MUST
  remain sufficient to diagnose production issues on Raspberry Pi-style hosts.
- Environment-specific assumptions such as ports, static output paths, and host
  requirements MUST be documented in plans or quickstarts when a feature
  depends on them.

## Delivery Workflow

- Each spec MUST describe the affected layer or layers, the user-visible or
  operator-visible contract change, and the verification path.
- Each spec MUST record the source-of-truth behavior for semantics that cannot
  safely be inferred, including any tests, contracts, or code paths consulted.
- Each new spec MUST be created on a fresh short-lived branch named
  `feat/NNN-short-name`, with `NNN` auto-incremented from the highest existing
  spec feature number.
- Bug-only work that does not justify a numbered spec branch MUST use a fresh
  short-lived `bugfix/short-name` branch.
- Each spec and plan MUST call out any naming convention, import-path, or data
  layer impact when Node or Python code is introduced or reorganized.
- Each spec and plan MUST call out runtime invocation changes, frontend state
  management impact, and responsive behavior expectations when frontend work is
  involved.
- Each planning pass MUST explicitly review this constitution and
  `.specify/memory/UI_BEHAVIOR_STANDARDS.md`,
  `.specify/memory/LEARNINGS.md`, and every additional file in
  `.specify/memory/` before research starts.
- Each planning pass MUST begin with an inventory of modules, call sites,
  behavior dependencies, and contracts within the feature boundary.
- Each planning pass MUST identify the semantic invariants that cannot change,
  including validation, units, rounding, timestamps, and interpretation rules.
- Each planning pass MUST identify privacy and security exposure points,
  including PHI/PII handling, secret boundaries, logging surfaces, and publicly
  accessible assets such as files under `static`.
- Each plan MUST pass a constitution check covering layer ownership, contract
  impact, observability changes, and deployment implications.
- Large features or migrations MUST include `chunked_plan.md` under the feature
  directory in `specs`, with chunk-by-chunk file plans and review checkpoints.
- Each task generation pass MUST explicitly review this constitution and
  `.specify/memory/UI_BEHAVIOR_STANDARDS.md`,
  `.specify/memory/LEARNINGS.md`, and every additional file in
  `.specify/memory/` before tasks are finalized.
- Each task list MUST include privacy/security work needed to preserve PHI/PII
  protection, secret handling, redaction, and safe logging behavior.
- Each task list MUST preserve minimal diffs by separating required feature work
  from follow-up cleanup or future consistency work.
- Each task list MUST include the implementation work, the required validation,
  and any documentation or operational follow-up needed for the touched layers.
- Implementation work MUST revisit this constitution and
  `.specify/memory/UI_BEHAVIOR_STANDARDS.md`,
  `.specify/memory/LEARNINGS.md`, and any additional relevant memory files at
  meaningful checkpoints, especially before major refactors, after new
  findings, and before declaring a story complete.
- Generated specs MUST include a brief `Compliance Notes` section summarizing
  the relevant constitution principles, the UI behavior standards applied, the
  cross-feature learnings that influenced the solution, and any conflicts plus
  how they were resolved.
- When implementation evidence conflicts with the spec or established behavior,
  agents MUST stop, document the conflict, and ask the user to resolve it.
- Reviews MUST reject work that mixes responsibilities across layers, omits
  verification for risky behavior changes, introduces deployment complexity
  without written justification, or changes semantics without explicit spec
  authority.
- Reviews MUST reject work that exposes PHI/PII, logs sensitive payloads,
  leaks secrets, or treats public surfaces as if they were private.

## Governance

This constitution overrides conflicting local habits for work generated through
Spec Kit artifacts in this repository. Amendments require updating this file,
updating any affected templates or guidance documents in the same change, and
recording the impact in the Sync Impact Report at the top of the file. This
constitution supersedes local conventions when they conflict.

Any change to this document MUST be reviewed by a human maintainer. The
amendment PR MUST include the reason for change, compatibility impact, and any
required follow-up migrations.

Versioning policy follows semantic versioning for governance itself:

- MAJOR: Removes or materially redefines a principle or governance requirement.
- MINOR: Adds a principle, section, or materially stronger requirement.
- PATCH: Clarifies wording without changing expected behavior.

Compliance review is mandatory at plan time and again during implementation
review. Any justified exception MUST be documented in the plan's complexity or
constitution-check section with the simpler alternative that was rejected.

Every PR review MUST explicitly check the Privacy & Security rules.
If a change touches PCC/MC integrations, serverless configuration, or
patient-critical workflows, escalation to a human reviewer is mandatory.

Escalation triggers (agents MUST stop and ask a human):

- Requested work conflicts with the constitution, UI behavior standards, or
  established learnings and the conflict cannot be resolved safely.
- Privacy, PHI/PII handling, or secret-management implications are unclear.
- The change proposes or requires amending this constitution.

**Version**: 2.2.1 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-26
