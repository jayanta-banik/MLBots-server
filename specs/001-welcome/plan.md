## Implementation Plan: Welcome Auth Home

**Branch**: `feat/001-welcome` | **Date**: 2026-04-21 | **Requirements**: `specs/001-welcome/requirements.md`
**Input**: Requirement document from `/specs/001-welcome/requirements.md`

## Summary

Split the current frontend landing experience into an anonymous Welcome page and an authenticated Home page, add login and signup entry flows, personalize Home with the user first name, and provide a responsive top bar. The implementation will keep the existing health overview content by moving it into Welcome, add a Redux-backed auth state and route shell in `frontend`, and extend `node_backend` with the smallest auth/profile contract needed for signup, login, session restoration, and first-name retrieval when the existing contract proves incomplete.

## Semantic Guardrails

- Source-of-truth behavior consulted: `frontend/src/App.jsx` for the current landing content and service-status presentation; `frontend/src/utils/api_client.js` for the current relative `/api/*` client pattern; `node_backend/routes/index.js`, `node_backend/routes/health_routes.js`, `node_backend/services/health_service.js`, and `node_backend/models/health_model.js` for the existing route -> service -> model layering; `node_backend/prisma/schema.prisma` and `node_backend/prisma/migrations/20260420211547_added_users_table/migration.sql` for the current user persistence shape.
- Semantic invariants that must remain unchanged: the existing operational overview cards and health-probe semantics remain available to anonymous users; health endpoint payload shape remains stable for the current frontend status panel unless the auth feature explicitly adds new endpoints; timestamp formatting in the frontend continues to use `moment`; error states remain safe and do not expose raw backend payloads.
- Conflicts resolved: the requirement needs auth/profile behavior but the repository currently has no implemented auth contract. Planning resolves this by assigning missing auth/profile work to `node_backend`, because it already owns the `User` table and HTTP API surface, while keeping Python out of scope unless later evidence contradicts that ownership.

## Privacy & Security Guardrails

- Sensitive surfaces touched: user email, first name, password input, bearer token or equivalent session credential, and user profile payloads.
- Prompts, tests, fixtures, examples, screenshots, and quickstart data will use synthetic users only.
- Request logging must not capture passwords, tokens, or full auth payloads. If request logging currently logs bodies generically, auth routes must redact or omit those fields.
- No files under `static/` will contain secrets or user data. The public frontend will only render the authenticated user summary provided by the safe auth/profile contract.

## Technical Context

**Language/Version**: JavaScript with Node 20 for `node_backend`; JavaScript with React 18 and Vite 5 for `frontend`  
**Primary Dependencies**: Express, Prisma, PostgreSQL, Vite, React, MUI, Framer Motion, Moment; add Redux Toolkit and React Router to `frontend`; use existing Jest/Supertest toolchain in `node_backend`; add minimal frontend test tooling if missing  
**Storage**: PostgreSQL via Prisma in `node_backend`  
**Testing**: `yarn lint` in `node_backend`; Jest + Supertest for new auth API coverage; add `lint` and minimal Vitest/Testing Library support to `frontend`, then run frontend lint/build/tests or document any remaining manual checks if a minimal test setup is disproportionate  
**Target Platform**: Linux server / Raspberry Pi host  
**Project Type**: Monorepo web service with frontend + Node API + Python API  
**Performance Goals**: Auth state restoration should resolve quickly enough to avoid visible page thrash on initial load; Home and Welcome should remain responsive at standard desktop/mobile interaction speeds; added auth endpoints should stay within normal interactive API latency budgets on Raspberry Pi hardware  
**Constraints**: Keep changes layered and incremental; keep Python out of scope unless ownership evidence changes; preserve existing relative `/api/node/*` production path and add a local frontend dev strategy that still reaches the Node API cleanly; avoid exposing raw auth failures or storing secrets in code  
**Scale/Scope**: One frontend app (`frontend`) plus a small `node_backend` auth/profile slice; no large migration or multi-app rollout expected

## Constitution Check

_GATE: Passed before Phase 0 research. Re-check after Phase 1 design._

- Mandatory memory preflight completed for constitution, UI behavior standards, learnings, git rules, node backend standards, and UI standards.
- Branch is compliant: `feat/001-welcome`.
- Runtime ownership is explicit: `frontend` owns page composition, routing, and auth UI; `node_backend` owns any missing auth/profile HTTP contract and Prisma-backed persistence; `python_backend` remains out of scope because it currently exposes only a dummy FastAPI service and no user/auth runtime.
- Existing patterns remain default: Node work will follow route -> service -> model; frontend work will stay in the Vite app and use MUI plus Redux for shared auth state.
- Privacy and security constraints are accounted for: auth requests must redact sensitive fields from logs, examples remain synthetic, and no secret material is added to docs or fixtures.
- Contract impact is identified: new auth/profile endpoints are expected under `/api/node/auth/*` if the current contract is missing.
- Observability impact is contained: existing health signals stay intact, while auth failures surface only safe user-facing messages.
- Verification remains proportional: Node auth tests plus frontend auth/UI tests and manual verification for state restoration, loading, and error behavior.
- No constitution violations currently require exception handling.
- Post-design re-check: still passes. The design keeps work inside the existing frontend and Node layers, uses repository-standard tooling, preserves the current anonymous landing content, and limits backend expansion to the missing auth/profile slice only.

## Project Structure

### Documentation (this feature)

```text
specs/001-welcome/
├── requirements.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── auth-api.yaml
└── tasklist.md
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── status_panel.jsx
│   │   └── surface_card.jsx
│   ├── pages/
│   │   ├── home.jsx
│   │   └── welcome.jsx
│   ├── store/
│   ├── features/auth/
│   └── utils/api_client.js

node_backend/
├── app.js
├── middleware/
│   ├── index.js
│   └── request_logger.js
├── routes/
│   ├── index.js
│   ├── health_routes.js
│   └── auth_routes.js
├── services/
│   ├── health_service.js
│   └── auth_service.js
├── models/
│   ├── health_model.js
│   ├── fetch_user.js
│   └── create_user.js
└── prisma/
    ├── schema.prisma
    └── migrations/
```

**Structure Decision**: Use the existing split between `frontend` and `node_backend`. `frontend` gains page-level and auth-state modules while preserving the shared component pattern already present. `node_backend` gains a narrow auth/profile slice implemented with thin routes, service-owned workflow logic, model-owned single DB calls, and Prisma-backed persistence. Python remains unchanged.

## Inventory

- `frontend/src/App.jsx`: current single-page anonymous landing content; will become the app shell/router entry.
- `frontend/src/main.jsx`: current theme bootstrap; remains the mounting point and will wrap any Redux/store providers.
- `frontend/src/utils/api_client.js`: current relative API client; will expand to auth/profile calls while preserving existing health probe calls.
- `frontend/src/components/status_panel.jsx` and `surface_card.jsx`: reusable UI pieces likely retained by `welcome.jsx`.
- `node_backend/app.js` and `routes/index.js`: current API entry and route registration; auth routes will register here.
- `node_backend/routes/health_routes.js`, `services/health_service.js`, `models/health_model.js`: source-of-truth for the current layered Node pattern.
- `node_backend/prisma/schema.prisma` and existing user migration: current persistence baseline. The `User` model exists with `email`, `username`, and `password`; planning assumes `password` is not yet a stable auth contract because no runtime auth code exists.
- Inbound callers and outbound calls: frontend callers hit relative `/api/node/*` endpoints; Node calls PostgreSQL through Prisma; no existing frontend auth caller or backend auth provider is wired today.
- Stable contracts to preserve: `/api/node/health` payload shape and the current anonymous landing content semantics.
- Sensitive boundaries: auth credentials in request bodies, returned tokens, request logging middleware, `.env` secrets, and any profile payload returned to the public frontend.

## Learnings Checkpoints

- Planning-time takeaways: there are no feature-specific learnings yet, so repository memory files are the active standards. UI changes must add or account for missing frontend validation support. Node changes must stay in the route/service/model structure and prefer Prisma via models.
- Implementation checkpoints:
  - Re-check constitution and UI standards after backend contract inventory is confirmed and before modifying Prisma/auth persistence.
  - Re-check node backend standards before adding routes/services/models.
  - Re-check UI standards before building Home/Welcome, especially loading/error states and responsive top-bar behavior.
  - Re-check privacy guardrails before finalizing auth logging, fixtures, and manual verification notes.

## Migration Strategy

- Slice 1: Inventory and extend the Node auth/profile contract only if missing. Add auth routes, service logic, Prisma access, and any safe schema adjustments while keeping existing health endpoints intact.
- Slice 2: Add frontend routing/auth state shell and move the current landing content into `welcome.jsx` without yet polishing the authenticated Home experience beyond functional navigation.
- Slice 3: Add `home.jsx`, personalized greeting, top bar, and complete auth loading/error/session-restore behavior.
- Slice 4: Add validation support and tests, then run lint/build/test commands and documented manual verification.
- The codebase stays runnable after each checkpoint because health routes remain untouched, frontend entry can continue rendering with fallback routing, and auth additions are additive rather than rewrites.
- `chunked_plan.md` is not required at this time because the feature is moderate in size and can be delivered in the slices above without a larger staged migration artifact.

## Complexity Tracking

No constitution violations currently require justification.
