# Requirements: [FEATURE NAME]

**Requirement Branch**: `[feat/###-feature-name or bugfix/short-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

**Workflow Note**: Review `.specify/memory/constitution.md`,
`.specify/memory/UI_BEHAVIOR_STANDARDS.md`, `.specify/memory/LEARNINGS.md`, and
all additional files in `.specify/memory/` before drafting or revising this
requirement. Confirm uncertain semantics from tests, existing code paths,
contracts, or the user instead of guessing.

## Compliance Notes _(mandatory)_

- **Relevant Constitution Principles**: [List the constitution principles that
  directly constrained this requirement]
- **UI Behavior Standards Applied**: [List the UI behavior standards used, or
  state "Not applicable"]
- **Cross-Feature Learnings Applied**: [List the learnings from
  `.specify/memory/LEARNINGS.md` or other memory files that influenced this
  requirement]
- **Conflicts and Resolution**: [List any conflicts with UI standards,
  learnings, or existing behavior and how the safest compliant alternative was
  chosen, or state "None"]

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## System Impact _(mandatory)_

### Source-of-Truth Behavior

- [Identify the tests, code paths, contracts, or operator-visible behaviors
  that define current semantics for this requirement]
- [Call out any semantic invariants that MUST be preserved: validation, units,
  rounding, timestamps, interpretation rules]
- [If artifacts disagree, record the conflict and the user clarification needed]

### Privacy, Security, and Public Exposure

- [Identify any PHI/PII, measurement data, notes, ECG traces, or secrets this
  requirement can touch]
- [State how tests, fixtures, prompts, screenshots, and examples use synthetic
  data only]
- [Identify any logging, analytics, telemetry, or debugging surfaces that must
  avoid sensitive payload capture]
- [Identify whether the requirement touches `frontend`, `admin`, Python-only
  endpoints, or files under `static`, and call out any public exposure]

### Affected Layers

- [Identify which of `frontend`, `node_backend`, `python_backend`, root/static`
  are changed and why each layer owns that work]
- [If Node or Python code is added, note the naming convention impact and how
  file paths remain `snake_case`]
- [State how the requirement is invoked: root for Python/Node, `frontend` for UI]

### Contract Changes

- [Describe any HTTP payload, route, build output, static asset, or operator
  workflow contract that changes]
- [If no public contract changes, state that explicitly]

### Data Layer Impact

- [Describe any PostgreSQL schema, Prisma model, migration, SQLAlchemy model, or
  query-layer change]
- [If persistence is untouched, state that explicitly]

### Frontend Impact

- [If frontend work is involved, describe the Vite entrypoint, Redux state
  impact, and desktop/mobile responsive behavior]
- [If frontend is untouched, state that explicitly]

### Observability Impact

- [Describe what logs, health signals, or operator-visible diagnostics are added
  or changed]
- [If no observability changes are needed, explain why existing signals are
  sufficient]

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]
- **FR-XXX**: The implementation MUST keep layer ownership explicit and avoid
  moving feature logic into root entrypoints unless the change is purely
  bootstrap or wiring.
- **FR-XXX**: The implementation MUST define a verification approach that is
  proportional to the risk of the changed behavior.
- **FR-XXX**: The implementation MUST preserve semantic behavior unless this
  requirement explicitly changes it.
- **FR-XXX**: The implementation MUST NOT guess domain logic; unclear behavior
  MUST be resolved from source-of-truth artifacts or explicit user
  clarification.
- **FR-XXX**: Existing validation, units, rounding, timestamps, and
  interpretation rules MUST remain unchanged unless this requirement explicitly
  says otherwise.
- **FR-XXX**: The implementation MUST NOT include real PHI/PII in prompts,
  logs, tests, fixtures, screenshots, examples, or debugging artifacts.
- **FR-XXX**: The implementation MUST use synthetic data for all examples,
  fixtures, tests, and debugging workflows.
- **FR-XXX**: The implementation MUST NOT introduce logging, analytics,
  telemetry, or tracking that can capture PHI-bearing request bodies,
  measurement payloads, ECG traces, or free-text notes.
- **FR-XXX**: The implementation MUST redact sensitive output before sharing
  debugging evidence.
- **FR-XXX**: The implementation MUST NOT commit secrets such as tokens,
  passwords, private keys, or certificates.
- **FR-XXX**: The implementation MUST stay within minimal, reviewable diffs and
  MUST NOT bundle unrelated refactors into the same change.
- **FR-XXX**: File names and folder names MUST remain `snake_case` across Node
  and Python code.
- **FR-XXX**: Python code MUST use `snake_case`, Node code MUST use
  `camelCase` or `PascalCase` as appropriate, and constants MUST use
  `UPPER_SNAKE_CASE`.
- **FR-XXX**: Persistence changes MUST target PostgreSQL, using Prisma in Node
  and SQLAlchemy in Python.
- **FR-XXX**: Node internal imports MUST use `#service`, `#util`, `#model`, or
  `#middleware`, with relative imports reserved for local helper files only.
- **FR-XXX**: Python and Node runtime entrypoints MUST remain callable from the
  repository root.
- **FR-XXX**: Frontend runtime commands MUST remain callable from within
  `frontend`.
- **FR-XXX**: Features in `frontend` MUST treat that app as the main Vite-built
  user-facing UI, features in `admin` MUST follow the admin UI patterns and
  respect secured admin API middleware, Python-only ML endpoints MUST remain in
  the Python service, and anything written to `static` MUST be safe for public
  access.
- **FR-XXX**: Frontend work MUST use Vite, Redux for shared application state,
  and responsive behavior across desktop and mobile layouts.
- **FR-XXX**: Larger feature sets or migrations MUST define incremental chunks
  and create `chunked_plan.md` under the requirement directory when staged
  delivery is required.

_Example of marking unclear requirements:_

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities _(include if feature involves data)_

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- [Assumption about target users, e.g., "Users have stable internet connectivity"]
- [Assumption about scope boundaries, e.g., "Mobile support is out of scope for v1"]
- [Assumption about data/environment, e.g., "Existing authentication system will be reused"]
- [Dependency on existing system/service, e.g., "Requires access to the existing user profile API"]
- [Assumption about deployment environment, e.g., "The Raspberry Pi host keeps
  the existing Node, Python, and static asset serving model"]
- [Assumption about persistence, e.g., "PostgreSQL remains the system of record,
  with Prisma for Node and SQLAlchemy for Python"]
- [Assumption about Python execution, e.g., "The repository virtual environment
  is auto-activated from shell startup for bash sessions"]
- [Assumption about branch workflow, e.g., "This requirement is delivered from a
  short-lived `feat/NNN-short-name` or `bugfix/short-name` branch"]