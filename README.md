# PowerSync Self-Hosted Example

This is an example self-hosted project using the PowerSync Open Edition version of the [PowerSync Service](https://github.com/powersync-ja/powersync-service), which is published to Docker Hub as `journeyapps/powersync-service`.

This example uses Docker Compose to define and run the containers.

Learn more about self-hosting PowerSync [here](https://docs.powersync.com/self-hosting/getting-started).

# Run

This repository contains basic demonstrations in the `demos` folder.

- [Node.js (Postgres)](./demos/nodejs/README.md)
  - This can be started from the repo root with `docker compose -f demos/nodejs/docker-compose.yaml up`

- [Node.js (Postgres + Custom Write Checkpoints)](./demos/nodejs-custom-checkpoints/README.md)
  - This can be started from the repo root with `docker compose -f demos/nodejs-custom-checkpoints/docker-compose.yaml up`

- [Node.js (MongoDB)](./demos/nodejs-mongodb/README.md)
  - This can be started from the repo root with `docker compose -f demos/nodejs-mongodb/docker-compose.yaml up`

- [Node.js (MySQL)](./demos/nodejs-mysql/README.md)
  - This can be started from the repo root with `docker compose -f demos/nodejs-mysql/docker-compose.yaml up`

- [Node.js (SQL Server)](./demos/nodejs-mssql/README.md)
  - This can be started from the repo root with `docker compose -f demos/nodejs-mssql/docker-compose.yaml up`

- [Django](./demos/django/README.md)
  - This can be started from the repo root with `docker compose -f demos/django/docker-compose.yaml up`

- [Convex](./demos/convex/README.md)
  - This can be started from the repo root with `docker compose -f demos/convex/docker-compose.yaml up`

- [Supabase](./demos/supabase/README.md)
  - See the README for instructions.

- [Node.js (Postgres + Postgres Sync Bucket Storage)](./demos/nodejs-postgres-bucket-storage/README.md)

  [![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/powersync-starter-postgres?referralCode=kChzwj&utm_medium=github&utm_source=selfhostdemo)
  - This stack can be deployed on Railway using a template
  - Alternatively, start this from the repo root with `docker compose -f demos/nodejs-postgres-bucket-storage/docker-compose.yaml up`

# Repository Structure

Each demo owns its PowerSync configuration:

```text
demos/<demo>/
  README.md                 Setup and run instructions
  .env                      Environment variables for this demo
  docker-compose.yaml       Services and config mounts for this demo
  powersync/
    service.yaml            Replication, bucket storage, and authentication
    sync-config.yaml        Data to sync for this demo
    cli.yaml                Local CLI connection settings, where provided
services/                   Shared Docker Compose service definitions
key-generator/              JWT signing key helper
```

Every demo's `docker-compose.yaml` explicitly mounts its own `./powersync` folder at `/config` inside the PowerSync container. Similar sync configs are kept in each demo so they can be understood and changed independently; some demos need different queries, such as MongoDB's `_id AS id` selection.

The files in [`services/`](./services/) define reusable Docker containers. For example, [`services/powersync.yaml`](./services/powersync.yaml) supplies common container settings, while `demos/<demo>/powersync/service.yaml` configures the PowerSync Service itself. Demo Compose files use `include` or `extends` to reuse these definitions. Several Node.js demos also reuse the client, backend definitions, and database initialization scripts in [`demos/nodejs/`](./demos/nodejs/).

If you previously edited the root `config/` directory for the Node.js/Postgres or Django demo, use that demo's `powersync/` directory instead. The former `service.yaml`, `sync-config.yaml`, and `cli.yaml` now live in both demos.

# Config

The configuration can be modified to match other project topologies.

Edit `demos/<demo>/.env` and the files in `demos/<demo>/powersync/` with your specific settings. Paths such as `powersync/service.yaml` below are relative to the selected demo directory.

### Connections

Populate the `replication->connections` entry in `powersync/service.yaml` with your database connection details.

- **Postgres:** A simple Postgres server is provided in [`services/postgres.yaml`](./services/postgres.yaml). Keep the connection settings in the demo's `powersync/service.yaml` and `.env` consistent with this server's settings.

- **MongoDB:** See the [`nodejs-mongodb` demo](./demos/nodejs-mongodb/) for MongoDB connection configuration.

### Storage

Most demos use MongoDB to store PowerSync sync bucket state and operation history. The [Postgres bucket storage demo](./demos/nodejs-postgres-bucket-storage/) uses Postgres for this instead. Each demo configures bucket storage in the `storage` section of its `powersync/service.yaml`.

A basic MongoDB replica-set service is available in [`services/mongo.yaml`](./services/mongo.yaml). To use a different storage server, update the demo's `powersync/service.yaml`, `.env`, and corresponding services in `docker-compose.yaml`.

### Authentication

Each demo configures JWT verification in the `client_auth` section of its `powersync/service.yaml`. The demos fetch public keys from their backend's JWKS endpoint; static keys can also be configured under `client_auth->jwks->keys`.

The [`key-generator`](./key-generator/) project demonstrates generating RSA key pairs for token signing.

### Sync Config

[Sync Configs](https://docs.powersync.com/usage/sync-rules) are defined in each demo's `powersync/sync-config.yaml`, referenced by the adjacent `service.yaml`. For example, the Node.js/Postgres demo uses [`demos/nodejs/powersync/sync-config.yaml`](./demos/nodejs/powersync/sync-config.yaml).

Restart the demo's PowerSync service after editing its sync config. From the demo directory, run `docker compose restart powersync`.

### Memory Limits

It's recommended to set the `NODE_OPTIONS="--max-old-space-size=<size>"` environment variable to increase the default Node.js memory limit.

Service memory limits should be adjusted to roughly 80 percent of the system memory capacity.

# Cleanup

If you want to start from a fresh start:

- Delete the Docker volumes `mongo_storage` and `db_data`
  Their full names might vary depending on the directory where the `docker-compose` command was executed.
- Delete the service Docker containers.
