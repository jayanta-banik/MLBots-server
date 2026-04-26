# Implementation Plan: [FEATURE]

**Branch**: `[feat/###-feature-name or bugfix/short-name]` | **Date**: [DATE] | **Requirements**: [link]
**Input**: Requirement document from `/specs/[###-feature-name]/requirements.md` or `/specs/bugfix/[branch-name].md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Semantic Guardrails

- [List the source-of-truth behavior consulted: tests, existing code paths,
  contracts, or operator-visible behavior]
- [List the semantic invariants that MUST remain unchanged unless the spec says
  otherwise, including validation, units, rounding, timestamps, and
  interpretation rules]
- [List any conflicts found between source-of-truth artifacts and how they were
  resolved or escalated]

## Privacy & Security Guardrails

- [List any PHI/PII, secret, or compliance-sensitive surfaces touched by this
  feature]
- [Confirm only synthetic data is used in prompts, tests, fixtures, examples,
  and screenshots]
- [List logs, analytics, telemetry, or debugging paths reviewed to ensure they
  cannot capture PHI or secrets]
- [List any public exposure surfaces such as `static/` assets or admin-facing
  routes and how they remain safe]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [Node 20 for Node services, Python 3.x for Python services, or specify the affected subset]  
**Primary Dependencies**: [Express for Node-side work, Flask/Gunicorn for Python-side work, Vite/React/Redux for frontend work, Prisma for Node persistence, SQLAlchemy for Python persistence, or NEEDS CLARIFICATION]  
**Storage**: PostgreSQL  
**Testing**: [e.g., Vitest, Jest, pytest, integration checks, or NEEDS CLARIFICATION]  
**Target Platform**: Linux server / Raspberry Pi host
**Project Type**: Monorepo web service with frontend + Node API + Python API  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Review `.specify/memory/constitution.md`,
  `.specify/memory/UI_BEHAVIOR_STANDARDS.md`, `.specify/memory/LEARNINGS.md`,
  and every additional file in `.specify/memory/` before starting planning;
  record any constraints or lessons that affect this feature.
- If `node_backend` is in scope, review `.specify/memory/node_backend_standards.md`
  and record the route, service, model, alias, and middleware conventions that
  apply.
- If `frontend` or `admin` is in scope, review `.specify/memory/ui_standards.md`
  and record the MUI, Redux, motion, Moment, validation, and shared-component
  conventions that apply.
- Confirm the working branch follows `feat/NNN-short-name` for feature work or
  `bugfix/short-name` for bug work and is intended to stay short-lived.
- Inventory the feature boundary: modules involved, inbound callers, outbound
  calls, and contracts that must remain stable.
- Confirm semantic behavior is preserved unless the spec explicitly changes it,
  including validation, units, rounding, timestamps, and interpretation rules.
- Confirm any uncertainty has a source-of-truth reference or is explicitly
  escalated to the user with evidence of the conflict.
- Confirm the feature does not introduce PHI/PII into prompts, logs, tests,
  fixtures, screenshots, or examples, and that synthetic data is used instead.
- Confirm logs, analytics, telemetry, and debugging output cannot capture PHI,
  request bodies, measurement payloads, ECG traces, free-text notes, or
  secrets.
- Confirm secrets are not added to code, config, fixtures, docs, or shared
  output.
- Confirm the affected runtime layer ownership is explicit (`frontend`,
  `node_backend`, `python_backend`, root/static).
- Confirm the entrypoint map is correct for this feature: `frontend` is the
  main Vite app, `admin` is the admin-only UI, Python-only ML endpoints belong
  to the FastAPI/Python service, and anything under `static` is publicly
  accessible.
- Confirm the plan stays within existing subproject patterns and avoids drive-by
  refactors, extra architectural layers, nested patterns, and needless
  variable-copy rewrites.
- Confirm the implementation strategy creates the minimal changes needed to
  achieve the requested behavior and adapts surrounding callers before
  replacing an established shared utility, model, middleware, or contract
  surface.
- Confirm file names and folder names remain `snake_case`, Python identifiers
  remain `snake_case`, Node identifiers use `camelCase` or `PascalCase` as
  appropriate, and constants use `UPPER_SNAKE_CASE`.
- Confirm Python and Node runtime commands execute from the repository root,
  while frontend commands execute from `frontend`.
- Confirm Node internal imports use `#service`, `#util`, `#model`, or
  `#middleware` unless the import is a local helper that legitimately uses a
  relative path.
- Confirm frontend changes use Vite, Redux where shared application state is
  involved, and responsive behavior for both desktop and mobile.
- Confirm touched UI apps will run `yarn lint` and `yarn test`, or that the
  plan explicitly adds minimal test support or documents manual verification
  when a test command is missing.
- Confirm timestamp behavior in UI code uses `moment`, motion changes use
  motion wrappers where appropriate, and design changes stay consistent with
  the app theme and shared component strategy.
- Confirm every contract change is identified, including HTTP payloads,
  generated assets, or deployment-facing behavior.
- Confirm observability impact is covered, including request logging, error
  visibility, or health signal changes.
- Confirm verification is proportional to risk and names the automated or
  manual validation path for the changed behavior.
- Confirm any persistence changes stay on PostgreSQL and use Prisma in Node or
  SQLAlchemy in Python.
- Confirm Python command assumptions remain compatible with the repository venv
  being auto-activated from shell startup.
- Confirm any new dependency, service, or infrastructure complexity is justified
  against the existing Raspberry Pi friendly scaffold.
- Confirm larger feature sets or migrations define a chunked delivery path with
  runnable checkpoints and safe review or rollback points.
- Identify where implementation should re-check the constitution and learnings
  during execution if new findings or scope changes emerge.
- Confirm the plan records any conflict with UI behavior standards or learnings
  and proposes the safest compliant alternative.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── requirements.md      # Created by /speckit.specify
├── plan.md              # This file (/speckit.plan command output)
├── chunked_plan.md      # Required for large features or staged migrations
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasklist.md          # Phase 2 output (/speckit.tasks command)
```

For bugfix requirements, the canonical requirement document lives under
`specs/bugfix/[branch-name].md`, with sibling planning artifacts such as
`[branch-name].plan.md` and `[branch-name].tasklist.md`.

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above. Explain how responsibilities remain separated across
the affected runtime layers.]

## Inventory

- [List the modules in scope]
- [List who calls them and what they call]
- [List the contracts, payloads, files, or runtime expectations that must stay
  stable]
- [List any sensitive-data paths, secret boundaries, or publicly exposed files
  involved]

## Learnings Checkpoints

- [Document the planning-time takeaways from `.specify/memory/LEARNINGS.md` and
  any other relevant memory files]
- [Document the implementation checkpoints where constitution, UI behavior
  standards, and relevant memory files will be re-reviewed]

## Migration Strategy

- [Describe the incremental feature slices or migration checkpoints]
- [State how the codebase stays runnable after each checkpoint]
- [If the work is large, create `chunked_plan.md` and summarize the chunk/file
  plan here]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
