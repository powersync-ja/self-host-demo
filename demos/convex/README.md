# Convex + PowerSync Self-Hosted Demo

A turnkey demo that spins up a self-hosted [Convex](https://www.convex.dev) backend with a React todo-list app, wired to a locally-running [PowerSync](https://www.powersync.com) service.

## Architecture

```
Browser (React + PowerSync SDK)
  ├── Auth tokens ──► Convex Auth (JWT issued by Convex)
  ├── Mutations   ──► Convex client mutations (lists:create, todos:update, etc.)
  └── Sync        ◄── PowerSync Service  ◄── Convex streaming export
```

## Prerequisites

- Docker and Docker Compose (v2.20.3+)

## Running

The `.env` file contains default port configuration. Reference it to connect to services locally.

The compose file builds the React frontend and Convex functions from [`powersync-community/powersync-convex-todolist-demo`](https://github.com/powersync-community/powersync-convex-todolist-demo). Update the Git repository or branch in `docker-compose.yaml` when changing the demo source.

From the repo root:

```bash
docker compose -f demos/convex/docker-compose.yaml up
```

Or from this directory:

```bash
docker compose up
```

This single command will:

1. Start the Convex backend, dashboard, and MongoDB (for PowerSync bucket storage)
2. Generate an admin key
3. Push Convex functions (schema, auth, mutations)
4. Configure JWT keys for authentication
5. Start the PowerSync service with the Convex connector
6. Build and start the React demo app

## Services

| Service | URL | Description |
|---|---|---|
| Convex Backend | http://127.0.0.1:3210 | Database & serverless functions |
| Convex HTTP Actions | http://127.0.0.1:3211 | HTTP endpoints, JWKS |
| Convex Dashboard | http://localhost:6791 | Admin UI |
| PowerSync | http://localhost:8080 | Sync service (Convex connector) |
| Demo App | http://localhost:3030 | React todo-list |

If the Convex dashboard prompts for an admin secret, use the generated deploy key from the shared setup volume:

```bash
docker compose -f demos/convex/docker-compose.yaml run --rm --no-deps --entrypoint cat convex-keygen /setup/deploy_key
```

## Compose Services

The Compose project starts a small local stack with one-time setup services and long-running application services:

- `backend`: the self-hosted Convex backend. It stores application data, serves Convex functions, exposes HTTP actions/JWKS, and is the source database PowerSync replicates from.
- `dashboard`: the Convex dashboard UI for inspecting the local backend.
- `convex-keygen`: a one-time helper that uses the Convex backend data volume to generate an admin/deploy key and writes it into the shared setup volume.
- `convex-setup`: a one-time setup container that reads the generated key, deploys the Convex functions from the todo-list demo project to `backend`, and configures Convex Auth JWT/JWKS settings.
- `mongo` and `mongo-rs-init`: MongoDB bucket storage for the PowerSync Service, plus a one-time replica-set initializer.
- `powersync`: the PowerSync Service. It waits for Convex setup and MongoDB initialization, then connects to the Convex backend with the generated deploy key and replicates rows selected by `powersync/sync-config.yaml`.
- `demo-client`: the React todo-list app. It connects to PowerSync for local SQLite reads and sync status, and connects to the Convex backend for authentication and writes through Convex mutations.

## PowerSync Configuration

PowerSync is included in this Docker Compose file with the Convex connector module:

- **Deploy key**: The Convex admin key is used as the deploy key for replication
- **JWKS**: PowerSync verifies client tokens via the Convex Auth JWKS endpoint (`http://backend:3211/.well-known/jwks.json`)
- **Storage**: MongoDB replica set for PowerSync bucket storage
- **Sync rules**: The logged in user's rows from `lists` and `todos` tables are synced

The service config lives in `powersync/service.yaml`, and sync rules live in `powersync/sync-config.yaml`.

## Authentication

Convex Auth handles user authentication (email/password). The Convex Auth session JWT is reused directly for PowerSync authentication. PowerSync verifies tokens via Convex Auth's JWKS endpoint.

## Data Flow

The React app reads synced data from the local PowerSync SQLite database. Local writes are queued by PowerSync and uploaded by the demo app's connector to Convex mutations, then PowerSync streams the resulting Convex changes back to subscribed clients.

Convex generates its own `_id` values, while PowerSync needs stable local row IDs before writes reach Convex. The todo-list demo uses a local-first `uuid` for lists and todos, and the sync rules select `uuid AS id` so synced rows line up with the local SQLite records.

## Seeding Data

After the demo is running, create sample lists and todos from the demo app at http://localhost:3030. You can inspect the generated Convex data from the dashboard at http://localhost:6791.

## Cleanup

```bash
# Stop all services
docker compose -f demos/convex/docker-compose.yaml down

# Stop and remove volumes (full reset)
docker compose -f demos/convex/docker-compose.yaml down -v
```
