# Data Model: Welcome Auth Home

## User

- **Purpose**: Represents the persisted account used for signup, login, and personalized Home greetings.
- **Current baseline**: Prisma `User` model with `id`, `email`, `username`, `password`, `createdAt`, and `updatedAt`.
- **Planned shape**:
  - `id`: integer primary key
  - `email`: unique string, required
  - `username`: unique string, required; implementation may derive it from email to preserve the current schema without exposing a username field in the first UI slice
  - `passwordHash`: application-level password-hash semantic stored via the existing password column or a safe schema update
  - `firstName`: string, preferred for personalized greeting; may be nullable for migration safety but should be collected during signup
  - `createdAt`: timestamp
  - `updatedAt`: timestamp
- **Validation rules**:
  - email must be present and unique
  - password must meet the minimum auth-policy rules chosen during implementation
  - firstName should be non-empty at signup even if legacy records may not have it

## Auth Session Summary

- **Purpose**: Represents the authenticated state the frontend uses to route to Home and show personalized UI.
- **Fields**:
  - `token`: opaque bearer token returned by login/signup when authenticated
  - `user`: minimal user summary for the frontend
  - `expiresAt`: optional token/session expiry indicator if returned by the backend
- **Validation rules**:
  - token must exist for authenticated state
  - user summary must never contain password or secret fields

## User Profile Summary

- **Purpose**: Minimal safe payload returned to the frontend for Home rendering.
- **Fields**:
  - `id`
  - `email`
  - `firstName`
  - `displayName`: optional derived presentation field if later needed
- **Validation rules**:
  - must omit password or password-hash fields
  - should include `firstName` when available so Home can greet the user

## Top Bar Navigation State

- **Purpose**: Encapsulates visible top-bar actions based on auth state and viewport.
- **Fields**:
  - `isAuthenticated`
  - `primaryLinks`
  - `accountActions`
  - `isMobileMenuOpen`
- **Validation rules**:
  - anonymous state must not expose authenticated-only account actions
  - authenticated state must include a clear way to exit the session or leave Home

## State Transitions

- Anonymous visitor -> signup in progress -> registered but not authenticated, or authenticated if signup flow returns a valid session
- Anonymous visitor -> login in progress -> authenticated user session
- Authenticated user session -> session refresh check -> authenticated if token is valid, anonymous if invalid
- Authenticated user session -> logout or invalid token -> anonymous visitor