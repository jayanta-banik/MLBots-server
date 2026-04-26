# Node Backend Standards

These conventions apply to work under `node_backend/` unless a spec explicitly
overrides them.

## Module and Import Conventions

- The Node API codebase uses ESM modules.
- Prefer the configured absolute import aliases over deep relative imports:
  `#service/*`, `#models/*`, `#utils/*`, `#middleware/*`, and `#constants/*`.
- There is currently no configured `#prisma/*` alias in this repo. Prisma
  access should continue to flow through `node_backend/prisma/index.js` using
  the existing import pattern in the touched area unless the repo explicitly
  adds a shared alias.
- File naming is commonly `snake_case.js` for routes, services, and models.
- Feature or resource folders SHOULD export a stable public surface through a
  local `index.js` barrel.

## Routes

Applies to `node_backend/routes/**`.

- Routes MUST be thin.
- Routes MUST own Express-specific concerns: `req`, `res`, `next`,
  `res.locals`, request parsing, request-to-internal payload shaping, and HTTP
  response shaping.
- Routes MUST convert route params, query params, auth context, and other
  request-derived values into the internal types expected by the next layer,
  such as coercing user ids to `Number(...)` before forwarding them.
- Routes MUST handle validation and auth or authorization wiring through
  middleware when that behavior is request-boundary specific.
- Routes MUST NOT contain business logic.
- Routes SHOULD NOT call Prisma directly. Prefer a model or service call.
- Exception: if the route only needs a single read or write operation with
  little to no business logic, the route MAY call a model directly and skip the
  service layer.
- Route modules SHOULD export `export default routes`, where `routes` is an
  Express `Router()`.
- Route handlers may be defined as internal async functions such as
  `const createUser = async (req, res) => { ... }`.
- A route module MUST NOT define helper functions or ad hoc utils locally.
  Reusable utility behavior belongs in `#utils/*`.
- Routes SHOULD NOT explicitly set `200`; prefer `res.json(...)` for success.
- Routes SHOULD use `400` for invalid or missing request parameters, `401` for
  unauthenticated requests, and `403` for forbidden access.
- Routes SHOULD prefer `res.locals.*` for auth context and access context
  populated by middleware instead of recomputing permission logic in handlers.
- Routes MUST inspect returned payloads for explicit `Error` objects from
  services or models and convert those known failures into HTTP responses for
  the frontend.
- Unexpected exceptions SHOULD be allowed to bubble to the shared Express error
  handler instead of being swallowed locally.
- Authorization checks for mobile routes MUST be centralized in middleware
  rather than repeated in individual route handlers.
- Route filenames are object-oriented, typically `<object>.js`, and route
  handlers commonly use `create`, `read`, `update`, and `delete` naming such as
  `async function createUser(...)`.

## Services

Applies to `node_backend/services/**`.

- Services MUST contain business logic.
- Services MUST orchestrate one or more model calls when implementing a real
  workflow such as read + validate + update, or interactions across multiple
  tables or resources.
- Calling more than one model is a strong signal that a service layer is
  required.
- Services SHOULD be the only layer that decides eligibility rules, side
  effects, and state transitions.
- Services MUST NOT depend on Express `req` or `res`.
- Services MUST be pure business-logic layers and MUST accept already-shaped
  internal inputs from routes or other internal callers.
- Services SHOULD NOT spend effort defending against transport-layer type
  noise that the route layer is responsible for normalizing.
- Services SHOULD return business payloads on success.
- For expected business failures already modeled in this repo, services MAY
  return `Error` objects created through `createError(...)` so that routes can
  translate them into HTTP responses.
- Services MUST NOT add blanket `try/catch` wrappers around internal model or
  utility calls just to rethrow or reshape unexpected failures.
- If an unexpected internal error occurs, services SHOULD let it throw and
  bubble to the route-level Express error handling path.
- Service modules may use named function declarations or
  `const fn = async (...) => { ... }`; favor readable stack traces and easy test
  mocking.
- Pure formatting or shape-mapping helpers belong in `node_backend/utils/**`
  and SHOULD be imported by services when needed.
- Prefer calling `node_backend/models/**` for reusable DB reads or writes.
- Services MAY call Prisma directly for complex workflow-specific writes,
  including nested create or update operations with `include` or `select`, when
  extracting a model would not improve clarity or reuse. If the query becomes
  reusable or is used by multiple services, extract it into a model.
- Service filenames are object-oriented, typically `<object>.js`, and exported
  functions commonly use `get`, `modify`, and `add` naming.

## Models

Applies to `node_backend/models/**`.

- A model MUST encapsulate exactly one database call.
- A model MUST NOT call other models.
- Models SHOULD be the first choice for DB access from services when the query
  is reusable or non-trivial.
- Models MUST be organized by resource or object folder when the feature grows
  beyond a single file, and those folders MUST export through a local
  `index.js` barrel.
- When a fetch exists in multiple dimensions, such as by `id` or `email`,
  prefer a single model function that takes a parameter object like
  `{ id, email, select, include }` instead of separate files.
- A model SHOULD be created when the query is non-trivial, especially when it
  uses Prisma `include`, deep `select`, nested relations, or reusable query
  objects.
- Models MUST NOT contain business logic.
- Models SHOULD use `node_backend/prisma/index.js` for Prisma access and return
  plain JavaScript objects with no `req` or `res` dependencies.
- Models SHOULD assume internal callers pass already-normalized values instead
  of repeating request-boundary coercion.
- Models MUST NOT add blanket `try/catch` wrappers around database calls just
  to rethrow unexpected failures.
- For expected data-layer misses or similar explicit conditions already modeled
  in the touched area, models MAY return `Error` objects created through
  `createError(...)` for services and routes to handle intentionally.
- When referencing Prisma schema enums, import from `@prisma/client` and use
  `Prisma.enum_name.VALUE`.
- Model filenames commonly use verb-first naming such as `fetch_user.js`,
  `update_user.js`, `upsert_user.js`, and `create_user.js`, with function names
  such as `fetchUser({ id })`.

## Helper Placement

- Reusable utilities belong in `#utils/*`.
- Route modules MUST NOT define helper functions.
- Service or model modules MAY keep tiny local helpers only when the helper is
  purely module-local, not reusable, and keeping it local clearly improves
  readability. If reuse appears, move it to `#utils/*`.

## Layer Decision Rules

- Single, simple read or write with little to no business logic: route MAY call
  a model directly.
- Any workflow with eligibility rules, state transitions, side effects, or more
  than one model call: create or use a service.
- Reusable or non-trivial database access: create or use a model.

## Current Repo Notes

- The repo currently exposes route registration from `node_backend/routes/index.js`.
- Existing code already uses `#service/*`, `#models/*`, and `#utils/*` alias
  conventions.
- New Node backend work should preserve these patterns rather than introducing
  alternate folder structures or import styles.
