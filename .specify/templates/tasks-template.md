---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), requirements.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include verification tasks whenever the feature changes behavior,
contracts, build outputs, or deployment flow. Validation may be automated or,
for low-risk wiring/doc changes only, explicitly documented manual checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from requirements.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasklist.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T000 Review `.specify/memory/constitution.md`, `.specify/memory/UI_BEHAVIOR_STANDARDS.md`, `.specify/memory/LEARNINGS.md`, and every additional file in `.specify/memory/`; capture the constraints that apply to this feature
- [ ] T000A Inventory modules, callers, outbound dependencies, and contracts inside the feature boundary
- [ ] T000B Capture the semantic invariants that MUST remain unchanged: validation, units, rounding, timestamps, and interpretation rules
- [ ] T000C Inventory PHI/PII touchpoints, secret boundaries, logging surfaces, and any publicly exposed assets such as files in `static`
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools
- [ ] T00X Document affected runtime layers and contract surfaces for this feature
- [ ] T00X Confirm the branch follows `feat/NNN-short-name` for feature work or `bugfix/short-name` for bug work and remains short-lived
- [ ] T00X Confirm the planned change stays within existing subproject patterns and avoids drive-by refactors
- [ ] T00X Confirm only synthetic data is used in prompts, tests, fixtures, screenshots, and examples
- [ ] T00X If `frontend` or `admin` is in scope, review `.specify/memory/ui_standards.md` and capture the MUI, Redux, motion, Moment, and shared-component rules
- [ ] T00X Confirm naming conventions, import paths, and `snake_case` file paths
- [ ] T00X Confirm root-vs-frontend runtime invocation paths and shell assumptions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management
- [ ] T00X Confirm observability and deployment touchpoints for changed layers
- [ ] T00X Confirm logs, telemetry, analytics, and debug output do not capture PHI/PII or secrets
- [ ] T00X For touched UI apps, run `yarn lint` and `yarn test`, or add minimal test support / document manual verification if the app does not yet expose tests
- [ ] T00X Create or update PostgreSQL migrations and Prisma or SQLAlchemy data models as required
- [ ] T00X Add or update Vite and Redux frontend scaffolding when frontend work is in scope
- [ ] T00X Record the points during implementation where constitution and learnings must be re-reviewed
- [ ] T00X Record any conflicts with UI behavior standards or established learnings and the safest compliant alternative for each
- [ ] T00X Create `specs/[###-feature-name]/chunked_plan.md` when the feature is too large for a single safe slice, including chunk-by-chunk file plans and checkpoints
- [ ] T00X Define migration checkpoints that keep the codebase runnable after each slice

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (include when behavior changes) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Contract test for [endpoint] in tests/contract/test\_[name].py
- [ ] T011 [P] [US1] Integration test for [user journey] in tests/integration/test\_[name].py
- [ ] T01X [US1] Document manual validation only if automated coverage is not
      proportionate for this change

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T013 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T014 [US1] Implement [Service] in src/services/[service].py (depends on T012, T013)
- [ ] T015 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T016 [US1] Add validation and error handling
- [ ] T017 [US1] Add logging for user story 1 operations
- [ ] T01X [US1] Verify existing semantics are preserved against the identified source-of-truth behavior
- [ ] T01X [US1] Verify the changed flow does not expose PHI/PII, secrets, or sensitive payloads in logs, tests, fixtures, or debug output
- [ ] T01X [US1] Verify UI timestamp handling uses `moment`, repeated API calls are reduced appropriately with Redux where helpful, and deferred optimizations are marked with TODOs when intentionally postponed
- [ ] T01X [US1] Normalize imports and identifiers to repo naming standards
- [ ] T01X [US1] Re-check constitution and learnings before closing the story if implementation details changed
- [ ] T01X [US1] Verify responsive desktop/mobile behavior for frontend changes
- [ ] T01X [US1] Update affected operator or developer documentation

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (include when behavior changes) ⚠️

- [ ] T018 [P] [US2] Contract test for [endpoint] in tests/contract/test\_[name].py
- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/test\_[name].py

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T021 [US2] Implement [Service] in src/services/[service].py
- [ ] T022 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (include when behavior changes) ⚠️

- [ ] T024 [P] [US3] Contract test for [endpoint] in tests/contract/test\_[name].py
- [ ] T025 [P] [US3] Integration test for [user journey] in tests/integration/test\_[name].py

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T027 [US3] Implement [Service] in src/services/[service].py
- [ ] T028 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests as needed for risk coverage in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Constitution and learnings MUST be re-checked when implementation findings,
  scope, or risk change
- UI behavior standards and any additional relevant memory files MUST also be
  re-checked when implementation findings, scope, or risk change
- Semantic invariants from the spec and plan MUST be preserved unless the spec
  explicitly changes them
- Privacy and security rules override convenience, speed, and debugging ease
- Verification tasks MUST be defined before implementation and automated when
  the change affects behavior, contracts, build output, or deployment flow
- Unclear behavior MUST be resolved from source-of-truth artifacts or explicit
  user clarification, not guessed during implementation
- Use synthetic data only in tests, fixtures, examples, screenshots, and debug
  workflows
- Touched UI apps MUST satisfy the lint/test/manual-verification rule and keep
  design consistent with the shared theme and component strategy
- File and folder paths MUST remain `snake_case`
- Python identifiers MUST remain `snake_case`; Node identifiers MUST use
  `camelCase` or `PascalCase`; constants MUST use `UPPER_SNAKE_CASE`
- Python and Node entrypoints run from repo root; frontend commands run from
  `frontend`
- Node internal imports MUST use the alias conventions except for local helper
  files that can use relative imports
- Frontend work MUST account for Vite, Redux, and responsive desktop/mobile behavior
- Models before services
- Services before endpoints
- Core implementation before integration
- Keep the codebase runnable at each migration checkpoint
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all validation work for User Story 1 together:
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify the planned validation path before implementing
- Redact sensitive output before sharing logs or debugging evidence
- Separate feature-scope tasks from follow-up cleanup or future consistency work
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
