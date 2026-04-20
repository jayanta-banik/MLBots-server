# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

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

- Confirm the affected runtime layer ownership is explicit (`frontend`,
  `node_backend`, `python_backend`, root/static).
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

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

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

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
