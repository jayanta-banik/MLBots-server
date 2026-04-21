# Quickstart: Welcome Auth Home

## Goal

Run the frontend and Node backend locally, implement the Welcome/Home auth flow, and verify anonymous and authenticated entry behavior.

## Prerequisites

- PostgreSQL is available and `DATABASE_URL` is configured for `node_backend`
- Node 20 is installed
- Dependencies are installed in both `frontend` and `node_backend`

## Local Run

1. Start the Node backend from the repository root.

```bash
yarn --cwd node_backend start
```

2. Start the frontend from the `frontend` directory.

```bash
cd frontend && yarn start
```

3. Confirm the existing health endpoints still work.

```bash
curl http://localhost:3000/api/node/health
```

## Planned Validation

### Node backend

```bash
yarn --cwd node_backend lint
```

Run the auth API tests once added.

```bash
yarn --cwd node_backend test
```

### Frontend

After lint/test scripts are added:

```bash
cd frontend && yarn lint
cd frontend && yarn test
cd frontend && yarn build
```

## Manual Verification Checklist

1. Anonymous users land on Welcome and still see the existing operational overview content.
2. Welcome shows visible login and signup actions.
3. Successful login routes to Home.
4. Successful signup follows the defined auth behavior and reaches Home after the required login step.
5. Home shows `Welcome, <firstName>` when first-name data exists.
6. Home falls back to a generic welcome when first-name data is missing.
7. Refreshing the page restores the correct anonymous or authenticated landing state without flashing the wrong page after resolution.
8. Auth loading states are explicit and safe.
9. Auth error states do not expose raw backend payloads.
10. The Home top bar remains usable on desktop and mobile widths.