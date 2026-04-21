# Requirements: Welcome Auth Home

**Requirement Branch**: `feat/001-welcome`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User description: "Replace the current frontend landing page with a new authenticated Home page and move the existing operational overview into Welcome. The frontend should provide login and signup actions, show Welcome with the user first name after sign in, route users to Home after login or signup then login, and add a responsive top bar on Home for primary navigation and account actions while preserving the current status content on the Welcome page."

**Workflow Note**: Review `.specify/memory/constitution.md`,
`.specify/memory/UI_BEHAVIOR_STANDARDS.md`, `.specify/memory/LEARNINGS.md`, and
all additional files in `.specify/memory/` before drafting or revising this
requirement. Confirm uncertain semantics from tests, existing code paths,
contracts, or the user instead of guessing.

## Clarifications

### Session 2026-04-21

- Q: Should this feature reuse the existing login, signup, session, and profile contract or add backend auth work? → A: Add missing auth/profile backend work as part of this same feature if the current contract is incomplete.

## Compliance Notes _(mandatory)_

- **Relevant Constitution Principles**: I. Semantic Safety Is Non-Negotiable; II. Minimal Diffs Keep Risk Local; IV. Existing Patterns Win By Default; V. Delivery Stays Layered, Incremental, and Deployable; VI. Privacy, Security, and Compliance Override All Other Goals; VII. Agent Memory Preflight Is Mandatory
- **UI Behavior Standards Applied**: Frontend work remains inside `frontend/`; responsive desktop and mobile behavior is required; MUI-based composition is required; interactive auth surfaces must define explicit loading and error states; verification must cover touched UI states; current repo validation gaps in `frontend` must be accounted for during implementation.
- **Cross-Feature Learnings Applied**: No additional cross-feature learnings are currently recorded beyond the mandatory preflight files.
- **Conflicts and Resolution**: The request only specified that Home needs a top bar without listing all top-bar items. The safest compliant resolution is to require a responsive top bar that includes product identity, navigation between Welcome and Home where permitted, and account actions appropriate to authentication state, while leaving detailed visual design to planning and implementation. Clarification also resolved that the feature should reuse the existing auth contract when sufficient, but any missing auth or profile backend work belongs in this same feature instead of being deferred.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Reach the Correct Landing Page (Priority: P1)

As a visitor or signed-in user, I need the app to open on the correct page for my current authentication state so that I can either sign in or continue directly into the product.

**Why this priority**: This is the entrypoint behavior for the entire experience. Without correct landing and routing, the rest of the flow is not usable.

**Independent Test**: Can be fully tested by launching the frontend with no active session and with an active session, then confirming anonymous users land on Welcome and authenticated users land on Home.

**Acceptance Scenarios**:

1. **Given** no authenticated session exists, **When** the frontend loads, **Then** the user is shown the Welcome page with visible login and signup actions.
2. **Given** an authenticated session exists, **When** the frontend loads, **Then** the user is shown the Home page instead of the anonymous Welcome page.
3. **Given** the current operational overview content exists today on the frontend entry page, **When** the new landing structure is introduced, **Then** that content remains available on the Welcome page instead of being removed.

---

### User Story 2 - Complete Authentication Entry Actions (Priority: P1)

As an anonymous visitor, I need visible login and signup actions so that I can start authentication from the landing experience and continue into the product.

**Why this priority**: The request explicitly requires login and signup actions and a post-authenticated transition to Home.

**Independent Test**: Can be fully tested by opening Welcome, invoking login and signup, submitting valid credentials or valid registration data through the existing auth contract, and confirming the resulting navigation.

**Acceptance Scenarios**:

1. **Given** the user is on Welcome, **When** the user selects login, **Then** the UI presents the login flow and on successful authentication transitions the user to Home.
2. **Given** the user is on Welcome, **When** the user selects signup and completes registration successfully, **Then** the UI presents the next authentication step required by the product and the user can reach Home after successfully logging in.
3. **Given** an authentication request is in progress, **When** the request has not finished yet, **Then** the auth UI shows an explicit loading state and prevents ambiguous duplicate submission.
4. **Given** login or signup fails, **When** the failure is returned, **Then** the UI shows a safe, actionable error state without exposing sensitive payload details.

---

### User Story 3 - See Personalized Home Content (Priority: P2)

As a signed-in user, I need Home to greet me by first name and provide a top bar for core navigation and account actions so that the app feels personalized and usable after authentication.

**Why this priority**: This is the primary signed-in outcome requested by the user, but it depends on the landing and authentication flow already working.

**Independent Test**: Can be fully tested by signing in with a user profile that includes a first name, loading Home, and verifying the greeting and top bar behavior on desktop and mobile viewports.

**Acceptance Scenarios**:

1. **Given** the user has signed in successfully and a first name is available from the authenticated user context, **When** Home loads, **Then** the page displays a welcome message that includes the user first name.
2. **Given** the user is on Home, **When** the top bar renders, **Then** it provides clear product identity, access to the main landing destinations in scope, and account actions appropriate to the signed-in state.
3. **Given** the viewport changes between mobile and desktop widths, **When** the user views Home, **Then** the top bar and welcome content remain usable and visually stable.

### Edge Cases

- What happens when a user has an authenticated session but no first name is available in the returned user data? The Home greeting must fall back to a safe generic welcome rather than showing blank or broken text.
- What happens when a user refreshes the page after signing in? The app must preserve the authenticated landing decision and avoid briefly flashing the anonymous Welcome page once session state is restored.
- How does the system handle a signup success when automatic sign-in is not supported? The UI must direct the user into the required login step rather than assuming an authenticated session exists.
- How does the system handle an expired or invalid session discovered during app load? The app must return the user to Welcome and present login and signup actions again.

## System Impact _(mandatory)_

### Source-of-Truth Behavior

- The current frontend entrypoint in `frontend/src/App.jsx` is the source-of-truth for the existing anonymous landing content that presents the monorepo control-surface overview and service health panels.
- The current operational overview content and service status behavior must be preserved and relocated to the Welcome page rather than being removed or semantically altered without explicit follow-up requirements.
- No existing tests or written auth contracts were identified during requirement drafting, so authentication payload shape, session restoration behavior, and first-name sourcing are treated as integration assumptions that implementation must confirm before changing semantics.

### Privacy, Security, and Public Exposure

- This requirement may touch user-identifying profile data limited to a first name shown in the signed-in greeting.
- All examples, mock users, screenshots, fixtures, and tests must use synthetic user data only.
- Authentication UI, debugging output, and error handling must not log credentials, tokens, raw auth payloads, or sensitive backend error bodies.
- This requirement affects the public `frontend` application only. It does not authorize writing user-sensitive data into `static` or other public asset locations.

### Affected Layers

- `frontend`: owns the landing-page split, page composition, responsive top bar, authentication entry actions, authenticated routing behavior, greeting display, and any frontend auth state wiring needed for this experience.
- `node_backend` and or `python_backend`: are in scope only if the current authentication, signup, session, or profile contract required by the frontend is missing or incomplete and must be extended to deliver this user flow.
- Frontend runtime behavior must remain invocable from within `frontend` using the existing Vite app entrypoint.

### Contract Changes

- The user-visible frontend navigation contract changes from a single landing page to separate anonymous Welcome and authenticated Home experiences.
- This requirement reuses the existing login, signup, session, and user-profile contracts where sufficient, but it also includes any missing backend auth or profile work needed to complete the requested flow.
- If implementation finds that authentication endpoints or payloads must be added or extended, those contract changes are in scope for this feature and must be documented during planning.

### Data Layer Impact

- Persistence or schema changes are not automatically required, but they are in scope if current auth or profile storage cannot support signup, session restoration, or first-name retrieval for this feature.
- First-name data should come from the existing authenticated user context when available, or from profile/backend work added within this feature when the current contract is incomplete.

### Frontend Impact

- The Vite app entrypoint in `frontend/` becomes responsible for separating anonymous and authenticated page experiences.
- Frontend state management may need to track authenticated session status and user profile data, including first name, to avoid repeated auth checks and unstable routing decisions.
- The new Home and Welcome experiences must remain responsive across desktop and mobile layouts.
- Interactive auth surfaces must define explicit loading and error states and avoid layout jumps during async state restoration.
- If the backend contract is incomplete, frontend and backend changes must stay aligned on login, signup, session restoration, and profile data required by the Home greeting.

### Observability Impact

- No new operator-facing logs or health signals are required by this requirement.
- Existing frontend-visible error handling is sufficient if auth failures are surfaced safely to users without leaking sensitive payload details.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The frontend MUST present an anonymous Welcome page as the default landing experience for users who are not authenticated.
- **FR-002**: The implementation MUST move the current landing-page operational overview content from the existing frontend entry page into the Welcome page and preserve its user-visible purpose.
- **FR-003**: The Welcome page MUST provide visible login and signup actions.
- **FR-004**: The frontend MUST allow a user who completes login successfully to reach Home immediately after authentication.
- **FR-005**: The frontend MUST support the signup path required by the existing authentication contract and MUST let the user reach Home after completing the required signup and login steps.
- **FR-005**: The frontend MUST support the signup path required by the existing authentication contract and MUST let the user reach Home after completing the required signup and login steps.
- **FR-005a**: If the current authentication, signup, session, or profile contract is incomplete for this flow, the implementation MUST add the missing backend work within this same feature rather than deferring it.
- **FR-006**: The frontend MUST present Home as the default landing experience for users with an active authenticated session.
- **FR-007**: Home MUST display a personalized welcome that includes the signed-in user first name when that value is available.
- **FR-008**: Home MUST fall back to a safe generic welcome when first-name data is unavailable or not yet resolved.
- **FR-009**: Home MUST provide a responsive top bar that includes product identity, primary in-scope navigation, and account actions appropriate to the user authentication state.
- **FR-010**: The frontend MUST keep anonymous-only and authenticated-only entry actions visually distinct so users can understand whether they are on Welcome or Home.
- **FR-011**: Authentication-related interactive surfaces MUST provide explicit loading and safe error states and MUST prevent ambiguous duplicate submissions while a request is pending.
- **FR-012**: The frontend MUST restore the correct landing page after refresh based on the resolved session state and MUST avoid showing the wrong page once session restoration completes.
- **FR-013**: The implementation MUST keep layer ownership explicit and avoid moving feature logic into root entrypoints unless the change is purely bootstrap or wiring.
- **FR-014**: The implementation MUST define a verification approach proportional to the risk of the changed behavior, including authenticated and anonymous entry behavior.
- **FR-015**: The implementation MUST preserve the existing operational overview and service-status semantics unless this requirement explicitly changes them.
- **FR-016**: The implementation MUST NOT guess authentication domain logic; unclear login, signup, session, or profile semantics MUST be resolved from source-of-truth artifacts or explicit user clarification during planning.
- **FR-017**: The implementation MUST NOT include real PHI, PII, credentials, tokens, or secrets in prompts, logs, tests, fixtures, screenshots, examples, or debugging artifacts.
- **FR-018**: Frontend work for this requirement MUST remain within the `frontend` Vite application and remain responsive across desktop and mobile layouts.
- **FR-019**: Any backend work added for this feature MUST remain minimal, preserve layer ownership, and expose only the auth and profile contract required for the requested Welcome and Home flow.

### Key Entities _(include if feature involves data)_

- **Anonymous Visitor Session**: Represents a frontend user state with no authenticated session and access only to the Welcome experience and authentication entry actions.
- **Authenticated User Session**: Represents a frontend user state with a valid authenticated session that can be restored on app load and grants access to Home.
- **User Profile Summary**: Represents the minimal authenticated user data the frontend needs for this feature, specifically a first name used for personalized greeting and account-context display.
- **Top Bar Navigation State**: Represents the visible navigation and account actions shown at the top of Home and adjusted for viewport size and authentication state.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of first-load manual verification runs route anonymous users to Welcome and authenticated users to Home without requiring a second refresh.
- **SC-002**: A test user can complete login from Welcome and reach Home in no more than 3 user actions after opening the auth flow.
- **SC-003**: A signed-in user with first-name data sees a personalized greeting on Home on both desktop and mobile layouts in at least 95% of verification runs.
- **SC-004**: In manual verification of failed login and failed signup flows, users always receive a safe error message and never see raw backend payloads, stack traces, or credential values.

## Assumptions

- Existing authentication APIs or equivalent frontend auth integration may be sufficient, but if they are incomplete they must be extended within this feature.
- Signup does not automatically create a trusted authenticated Home session unless the existing auth contract already does so; if auto-login is unsupported, the product may require login after signup.
- First-name data is available from the authenticated user context or can be retrieved through the existing user-profile contract without schema changes.
- The intended file structure may introduce page-level components such as `Home.jsx` and `Welcome.jsx`, but exact folder placement can follow the frontend app's established organization during implementation.
- The current operational overview in `frontend/src/App.jsx` remains valuable and should be preserved as Welcome content rather than redesigned out of scope.
- The Raspberry Pi host, existing Vite build flow, and current Node and Python deployment model remain unchanged.
- Because `frontend` currently lacks `lint` and `test` scripts, implementation may need minimal added validation support or precise documented manual verification for this slice.