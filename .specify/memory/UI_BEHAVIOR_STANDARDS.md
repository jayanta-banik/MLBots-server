# UI Behavior Standards

This is the canonical preflight UI behavior standards file. Its contents mirror
the active UI standards used for `frontend/` and `admin/` work.

## App Boundaries

- `frontend/` is the main user-facing application and is built with Vite.
- `admin/` is the admin-only UI application.
- UI work MUST stay inside the touched app unless the spec explicitly spans
  both applications.

## Validation and Delivery Rules

- For any touched UI app, agents MUST run `yarn lint` and `yarn test` in that
  app before closing the work.
- If the touched app does not yet provide one or both commands, agents MUST add
  the minimal missing test support needed for the change OR document manual
  verification steps in the PR or delivery summary when adding the test setup
  would be disproportionate.
- Agents SHOULD run the relevant `yarn build` for the touched app when the UI
  flow changes.

## Design and Component Rules

- Use MUI components for UI construction and define or extend a theme instead
  of hand-rolling inconsistent primitives.
- Consistent design is preferred over novelty, but sophisticated design is
  preferred over flat or careless design when both can be delivered safely.
- Prefer inline modification to existing CSS over broad stylesheet churn.
- Prefer reusable basic components and small families of similar component
  utilities over one-off components.
- A single shared component style is preferred by default. Two to three
  variants are acceptable when the feature genuinely needs them. One-off visual
  components SHOULD be avoided unless the spec explicitly asks for a unique
  treatment.
- Use motion-enabled wrapper elements such as motion divs when introducing UI
  transitions or staged reveals.
- UI surfaces SHOULD feel calm, predictable, stable, and low-noise.
- Avoid too many animations, excessive color usage, decorative interactions,
  and multiple competing call-to-action buttons.

## Surface State Rules

- Every data-driven or interactive surface MUST explicitly support and visually
  distinguish loading, empty, filtered-zero-results, and error states.
- Loading states MUST use a skeleton loading animation with shimmer.
- Empty state means no data exists.
- Filtered state means data exists in the broader dataset but the current
  search or filter context returns zero results.
- Error state MUST be safe, actionable, and include retry behavior when retry
  is appropriate.
- Error states MUST NOT show raw payloads, stack traces, PHI, or stale data
  unless the spec explicitly requires stale-data fallback.

## Table Standards

- All tables MUST support header-click sorting unless the spec explicitly
  chooses another pattern.
- Tables MUST show a clear active sort direction.
- Do not add filter inputs into table headers unless the design explicitly
  calls for them.
- Use icon affordances such as an eye icon when the design specifies them
  instead of text buttons.
- Display human-friendly formatting such as Title Case for statuses.
- Show safe placeholders such as `--` for missing values.
- Truncate long content with ellipsis.
- Reveal truncated full content with a tooltip on hover.
- Tables MUST clearly distinguish loading, empty, filtered-zero-results, and
  error-with-retry states.
- Tables MUST remain stable when asynchronous data updates arrive.

## Search and Filter Standards

- Search MUST be icon-first and collapsed by default.
- Search expands into an input when activated.
- Autofill suggestions, when requested, MUST be limited to the top 5
  recommendations.
- Search and filters MUST operate only within the current dataset context
  unless the spec explicitly says otherwise.
- Search and filters MUST NOT cause unnecessary refetch loops.
- Filters shown as pills in the design MUST use pill-style presentation.
- Disabled controls MUST appear intentionally disabled rather than broken.
- Dropdowns and popovers MUST be themed; do not leave default browser or raw
  MUI styling in place.

## State, Data, and Performance Rules

- Use Redux when it reduces repeated API requests or stabilizes shared UI data.
- Eliminating repeated API calls during a single page or flow is an immediate
  requirement, not a future optimization.
- Memoization SHOULD be used where appropriate, especially for derived data,
  stable props, or expensive rendering paths.
- If an optimization would materially slow down delivery without addressing an
  immediate user or operational problem, prefer faster delivery and leave a
  clear TODO for the deferred optimization.
- Some optimizations are first-pass requirements and some can be deferred.
  Example: repeated API calls in one flow must be fixed now; lazy loading a huge
  list may be deferred with a TODO if it does not block safe delivery.
- UI must not jump layout when data arrives asynchronously.
- UI must not lose focus on rerender.
- UI must not reset scroll position unexpectedly.
- UI must not reset search or filter state unless the spec explicitly requires
  it.

## Disabled-but-Visible Rule

- If a control appears in the design but backend support is not ready, keep the
  control visible and intentionally disabled.
- Do NOT fake behavior.
- Do NOT hide the control unless the spec explicitly instructs it.
- Add a TODO comment in the backend code for the missing backend support.

## Time and Date Rules

- Use `moment` for timestamp-related UI actions.
- Do NOT use `luxon`.
- Do NOT use raw `new Date()` directly for user-facing timestamp behavior.

## Testing and Verification Expectations

- If UI tests already exist in the touched app, extend them for the changed
  flow.
- If UI tests are missing, add a minimal test when reasonable for the scope.
- When a minimal test is not reasonable in the current slice, document exact
  manual verification steps, including touched screens, expected states, and key
  interactions.
- Verification for UI work MUST cover loading, empty, filtered, and error
  states for the touched surfaces.
- Verification for table or search-heavy views MUST cover async stability,
  sort behavior, disabled states, and retry behavior where applicable.

## Current Repo Notes

- `frontend/package.json` currently lacks `lint` and `test` scripts.
- `admin/package.json` currently has `lint` but does not currently expose a
  `test` script.
- Future UI changes should account for that gap instead of silently skipping UI
  validation.