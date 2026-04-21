# Tasks: Welcome Auth Home

**Input**: Design documents from `/specs/001-welcome/`
**Prerequisites**: `plan.md` (required), `requirements.md` (required for user stories), `research.md`, `data-model.md`, `contracts/auth-api.yaml`, `quickstart.md`

**Tests**: Behavior, contract, and UI flow changes require automated verification tasks. This feature also adds minimal frontend lint/test support because `frontend` currently lacks those scripts.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently after foundational work completes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align frontend and backend tooling with the planned auth/home feature work.

- [ ] T001 Add frontend auth and test dependencies in `frontend/package.json`
- [ ] T002 Add frontend lint, test, and build verification scripts in `frontend/package.json`
- [ ] T003 [P] Create frontend test setup files in `frontend/vitest.config.js` and `frontend/src/test/setup.jsx`
- [ ] T004 [P] Add frontend ESLint configuration in `frontend/eslint.config.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared auth contract, persistence support, routing shell, and safe logging required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Extend the Prisma user model and migration for first-name-aware auth in `node_backend/prisma/schema.prisma` and `node_backend/prisma/migrations/*`
- [ ] T006 [P] Create reusable auth/profile Prisma models in `node_backend/models/create_user.js`, `node_backend/models/fetch_user.js`, and `node_backend/models/index.js`
- [ ] T007 [P] Implement auth workflow and token utilities in `node_backend/services/auth_service.js` and `node_backend/utils/auth_utils.js`
- [ ] T008 Add auth routes and route registration in `node_backend/routes/auth_routes.js` and `node_backend/routes/index.js`
- [ ] T009 Add auth-safe request logging and bearer-token middleware in `node_backend/middleware/request_logger.js` and `node_backend/middleware/index.js`
- [ ] T010 [P] Add frontend store, auth slice, and provider wiring in `frontend/src/store/index.js`, `frontend/src/store/provider.jsx`, and `frontend/src/features/auth/auth_slice.js`
- [ ] T011 [P] Expand API helpers for auth and profile calls in `frontend/src/utils/api_client.js`
- [ ] T012 Add app-level route shell and session bootstrap wiring in `frontend/src/App.jsx` and `frontend/src/main.jsx`

**Checkpoint**: Foundation ready. Auth/profile contract, frontend auth state, and safe shared wiring are in place.

---

## Phase 3: User Story 1 - Reach the Correct Landing Page (Priority: P1) 🎯 MVP

**Goal**: Route anonymous users to Welcome and authenticated users to Home while preserving the current operational overview content.

**Independent Test**: Start the frontend with and without a valid auth token, then confirm anonymous users see Welcome with the current status content and authenticated users land on Home.

### Tests for User Story 1

- [ ] T013 [P] [US1] Add frontend route-shell tests for anonymous vs authenticated landing behavior in `frontend/src/App.test.jsx`
- [ ] T014 [P] [US1] Add frontend welcome-page tests for preserved status content in `frontend/src/pages/welcome.test.jsx`

### Implementation for User Story 1

- [ ] T015 [P] [US1] Move the current landing content into `frontend/src/pages/welcome.jsx`
- [ ] T016 [US1] Update `frontend/src/App.jsx` to route between Welcome and Home based on resolved auth state
- [ ] T017 [US1] Add page-level loading and fallback state handling in `frontend/src/App.jsx` and `frontend/src/features/auth/auth_selectors.js`
- [ ] T018 [US1] Preserve current health probe semantics while reusing `frontend/src/components/status_panel.jsx` and `frontend/src/components/surface_card.jsx` inside `frontend/src/pages/welcome.jsx`

**Checkpoint**: Anonymous and authenticated entry behavior works independently, and the current operational overview is preserved on Welcome.

---

## Phase 4: User Story 2 - Complete Authentication Entry Actions (Priority: P1)

**Goal**: Let anonymous users sign up or log in from Welcome and reach Home through the defined auth flow.

**Independent Test**: Submit valid and invalid signup/login requests from Welcome against the auth API and confirm success, loading, and error behavior.

### Tests for User Story 2

- [ ] T019 [P] [US2] Add Node auth contract and integration tests in `node_backend/tests/auth_routes.test.js`
- [ ] T020 [P] [US2] Add frontend auth form tests for login/signup loading and error states in `frontend/src/features/auth/auth_forms.test.jsx`

### Implementation for User Story 2

- [ ] T021 [P] [US2] Implement signup and login form components in `frontend/src/features/auth/login_form.jsx` and `frontend/src/features/auth/signup_form.jsx`
- [ ] T022 [US2] Build Welcome auth action layout and submission flow in `frontend/src/pages/welcome.jsx`
- [ ] T023 [US2] Implement backend signup, login, and current-user handlers in `node_backend/routes/auth_routes.js` and `node_backend/services/auth_service.js`
- [ ] T024 [US2] Add profile-safe response shaping and credential validation in `node_backend/services/auth_service.js` and `node_backend/utils/auth_utils.js`
- [ ] T025 [US2] Wire frontend auth thunks, token persistence, and logout/session invalidation handling in `frontend/src/features/auth/auth_thunks.js` and `frontend/src/features/auth/auth_slice.js`

**Checkpoint**: Login and signup flows work end-to-end, including loading and safe error states, and users can reach Home after successful authentication.

---

## Phase 5: User Story 3 - See Personalized Home Content (Priority: P2)

**Goal**: Show a personalized Home page with a responsive top bar and first-name greeting for authenticated users.

**Independent Test**: Sign in with a user that has first-name data, load Home on desktop and mobile widths, and verify greeting, top-bar actions, and fallback behavior.

### Tests for User Story 3

- [ ] T026 [P] [US3] Add frontend Home page tests for personalized greeting and fallback behavior in `frontend/src/pages/home.test.jsx`
- [ ] T027 [P] [US3] Add frontend top-bar responsiveness and account-action tests in `frontend/src/components/home_top_bar.test.jsx`

### Implementation for User Story 3

- [ ] T028 [P] [US3] Create the Home page in `frontend/src/pages/home.jsx`
- [ ] T029 [P] [US3] Create the responsive Home top bar in `frontend/src/components/home_top_bar.jsx`
- [ ] T030 [US3] Connect profile retrieval and first-name greeting logic in `frontend/src/features/auth/auth_thunks.js`, `frontend/src/features/auth/auth_selectors.js`, and `frontend/src/pages/home.jsx`
- [ ] T031 [US3] Add responsive navigation and signed-in account actions in `frontend/src/components/home_top_bar.jsx`
- [ ] T032 [US3] Add safe generic greeting fallback and session-refresh recovery behavior in `frontend/src/pages/home.jsx` and `frontend/src/App.jsx`

**Checkpoint**: Home is independently functional with personalized greeting, responsive top bar, and stable session-refresh behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete validation, documentation, and final cross-story hardening.

- [ ] T033 [P] Document auth environment variables and local run notes in `frontend/README.md`, `node_backend/README.md`, and `specs/001-welcome/quickstart.md`
- [ ] T034 Add synthetic auth seed data or a safe local bootstrap path in `node_backend/prisma/seeds/index.js`
- [ ] T035 Run `yarn --cwd node_backend lint` and `yarn --cwd node_backend test`
- [ ] T036 Run `cd frontend && yarn lint`, `cd frontend && yarn test`, and `cd frontend && yarn build`
- [ ] T037 Execute the manual verification checklist in `specs/001-welcome/quickstart.md` and record any follow-up notes in `specs/001-welcome/tasklist.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies; start immediately.
- **Phase 2: Foundational**: Depends on Phase 1; blocks all user stories.
- **Phase 3: User Story 1**: Depends on Phase 2.
- **Phase 4: User Story 2**: Depends on Phase 2; can proceed after the shared auth contract is in place.
- **Phase 5: User Story 3**: Depends on Phase 2 and uses the auth/session flow established by US2.
- **Phase 6: Polish**: Depends on all intended user stories being complete.

### User Story Dependencies

- **US1**: Independent after Phase 2; delivers the MVP landing split.
- **US2**: Independent after Phase 2; uses the same auth contract and route shell but does not depend on US1-specific UI polish.
- **US3**: Depends on the authenticated session/profile behavior from US2.

### Within Each User Story

- Tests and verification tasks should be completed before or alongside implementation of the touched behavior.
- Models precede services, services precede routes, and frontend store/api wiring precedes page-level integration.
- Re-check constitution, privacy guardrails, and UI standards if implementation findings materially change the contract or UI state handling.

### Parallel Opportunities

- `T003` and `T004` can run in parallel after `T001` and `T002` if dependency installation is separated from config.
- `T006`, `T007`, `T010`, and `T011` can run in parallel within Phase 2.
- `T013` and `T014` can run in parallel for US1.
- `T019` and `T020` can run in parallel for US2.
- `T026` and `T027` can run in parallel for US3.
- `T028` and `T029` can run in parallel for US3.

## Parallel Example: User Story 2

```bash
# Launch auth verification work together:
Task: "Add Node auth contract and integration tests in node_backend/tests/auth_routes.test.js"
Task: "Add frontend auth form tests for login/signup loading and error states in frontend/src/features/auth/auth_forms.test.jsx"

# Launch independent UI component work together:
Task: "Implement signup and login form components in frontend/src/features/auth/login_form.jsx and frontend/src/features/auth/signup_form.jsx"
Task: "Implement backend signup, login, and current-user handlers in node_backend/routes/auth_routes.js and node_backend/services/auth_service.js"
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Deliver User Story 1 to establish the correct landing behavior.
3. Deliver User Story 2 to make the landing flow actionable with real auth.
4. Validate the MVP before moving to User Story 3.

### Incremental Delivery

1. Setup + Foundational scaffolding
2. Welcome/Home route split and preserved operational overview
3. Signup/login contract and frontend auth flow
4. Personalized Home, top bar, and session restoration polish
5. Final validation and documentation

## Notes

- Total tasks: 37
- User story task counts: US1 = 6, US2 = 7, US3 = 7
- Parallel opportunities identified in Setup, Foundation, and each user-story test/component slice
- Manual verification remains required in Phase 6 even after automated coverage is added
