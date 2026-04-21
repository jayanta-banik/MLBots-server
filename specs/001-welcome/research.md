# Research: Welcome Auth Home

## Decision 1: `node_backend` owns missing auth and profile contract work

- **Decision**: Implement any missing login, signup, and current-user profile endpoints in `node_backend`, not `python_backend`.
- **Rationale**: `node_backend` already owns the public `/api/node/*` surface and the Prisma `User` model. `python_backend` currently exposes only a dummy FastAPI service and has no implemented user runtime.
- **Alternatives considered**:
  - Add auth to `python_backend`: rejected because there is no existing Python user/auth runtime or persistence layer wired for this feature.
  - Keep the feature frontend-only: rejected because the clarified requirement explicitly includes backend work when the contract is incomplete.

## Decision 2: Preserve the existing `User.password` database column while exposing safer application semantics

- **Decision**: Treat the existing `password` column as implementation debt and model application code around a password-hash concept, using Prisma mapping or a safe migration strategy rather than continuing to treat it as a plain reversible password field.
- **Rationale**: The repository has a `User` table but no auth runtime. Preserving the existing column shape where possible minimizes migration risk, while application code should speak in password-hash terms to avoid normalizing unsafe semantics.
- **Alternatives considered**:
  - Keep using a plain `password` field directly in app code: rejected for security and clarity reasons.
  - Replace the entire user schema immediately: rejected because the minimal-diff plan should extend the current persistence baseline rather than rewrite it without evidence of need.

## Decision 3: Use a minimal token-based auth contract with `signup`, `login`, and `me`

- **Decision**: Define a compact auth HTTP surface under `/api/node/auth` with `POST /signup`, `POST /login`, and `GET /me` as the minimum contract required by the feature.
- **Rationale**: The feature needs signup, login, session restoration, and first-name retrieval. Those needs map directly to these three endpoints without over-expanding the API.
- **Alternatives considered**:
  - Full session/cookie stack: rejected for this planning slice because the repository currently has no cookie/session middleware and no evidence that heavier stateful auth is required.
  - Signup/login UI without a `me` endpoint: rejected because Home needs reliable session restoration and first-name retrieval after refresh.

## Decision 4: Frontend auth state should use Redux and page routing should be explicit

- **Decision**: Add Redux-backed auth state in `frontend` and explicit page routing for Welcome and Home.
- **Rationale**: Repository UI standards require Redux where shared application state stabilizes data across screens and async flows. Auth/session state is shared across the app shell, routing, greeting, and top bar. Separate Welcome and Home pages are clearer and more testable than conditional content in a single file.
- **Alternatives considered**:
  - Local component state only: rejected because session restoration and cross-page auth state would become brittle.
  - Single-page conditional rendering: rejected because the requirement explicitly calls for Home and Welcome as distinct pages.

## Decision 5: Add minimal frontend test support instead of relying only on manual checks

- **Decision**: Add frontend lint and a minimal test runner stack as part of implementation.
- **Rationale**: UI standards require `yarn lint` and `yarn test` for touched apps when reasonable. `frontend` currently lacks both scripts, so this feature should add the minimal support needed for auth and page-shell verification.
- **Alternatives considered**:
  - Manual verification only: rejected as the default because this feature changes app entry, async auth state, and error handling, which are high enough risk to justify baseline automated coverage.