# Code Style

This file captures observed writing and layering conventions from the existing
repository code so future edits preserve the author's style instead of
rewriting it.

## Layer Ownership

- Keep `req`, `res`, `next`, and `res.locals` inside route files.
- Route files own request-boundary work: reading params, query, body, auth
  context, and coercing route-derived values such as user ids into internal
  types before forwarding them.
- Service files are business-logic layers only.
- Model files are internal data-access layers only.
- Do not push Express objects or HTTP transport concerns into services or
  models.

## Route Style

- Keep routes thin and direct.
- Define handlers locally in the route module and wire them onto an Express
  router near the bottom of the file.
- Let routes translate internal results into HTTP responses.
- When a service or model intentionally returns an `Error` object, the route is
  the layer that checks `payload instanceof Error` and returns the error to the
  frontend with the correct message and status.
- Let unexpected exceptions bubble to shared Express error handling instead of
  adding local defensive `try/catch` blocks.
- Use `res.locals` for auth/session context populated by middleware.

## Service Style

- Services contain business rules, orchestration, state transitions, and
  cross-model workflows.
- Services accept already-shaped internal inputs, not raw Express request
  objects.
- Services should not be concerned with request-boundary coercion such as
  converting route ids to numbers.
- Do not add blanket `try/catch` blocks in services.
- If an internal call fails unexpectedly, let it throw.
- If the failure is an expected business outcome in the touched flow, returning
  `createError(...)` is acceptable.

## Model Style

- Models usually wrap one Prisma call.
- Models do not call other models.
- Models should assume their inputs are already normalized by the caller.
- Do not add blanket `try/catch` blocks in models.
- If an expected lookup or write condition is intentionally modeled as a known
  failure, returning `createError(...)` is acceptable; otherwise let the error
  throw naturally.

## Error Handling Pattern

- Use returned `Error` objects for explicit, expected failures that the current
  flow wants to surface cleanly, such as duplicate account attempts, invalid
  credentials, or a missing user in a modeled lookup path.
- Use thrown exceptions for unexpected failures.
- Routes are responsible for converting explicit returned errors into frontend
  responses.
- Do not scatter `try/catch` blocks across services and models just to wrap or
  rethrow the same failure.

## Function and File Patterns

- Favor parameter objects such as `{ userId }`, `{ email, username }`, or
  `{ dateOfBirth, firstName, lastName }` instead of long positional argument
  lists.
- Use early returns for guard clauses and expected failure paths.
- Keep file names in `snake_case.js`.
- Preserve the naming style already established in the touched area instead of
  mass-renaming unrelated code for consistency.
- Use local `index.js` barrels for stable public exports from resource folders.

## Imports and Utilities

- Prefer the configured path aliases such as `#models/*`, `#services/*`,
  `#utils/*`, `#middleware/*`, and `#constants/*`.
- Put reusable helpers in `#utils/*` instead of defining ad hoc helpers inside
  route files.
- Reuse existing utilities and shapes before introducing a new helper or
  abstraction.

## Editing Principle

- Create the minimal changes needed to achieve the requested behavior.
- Adapt surrounding callers before replacing an existing shared utility,
  middleware, model, or contract surface.
- Preserve existing behavior and author-shaped code unless the requested change
  explicitly asks for a refactor.
