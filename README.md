# PowerSync Self-Hosted Example

This is an example self-hosted project using the PowerSync Open Edition version of the [PowerSync Service](https://github.com/powersync-ja/powersync-service), which is published to Docker Hub as `journeyapps/powersync-service`.

This example uses Docker Compose to define and run the containers.

Learn more about self-hosting PowerSync [here](https://docs.powersync.com/self-hosting/getting-started).

# Run

This repository contains basic demonstrations in the `demos` folder.

- [NodeJS](./demos/nodejs/README.md)

  - This can be started from the repo root with `docker compose -f demos/nodejs/docker-compose.yaml up`

- [Django](./demos/django/README.md)

  - This can be started from the repo root with `docker compose -f demos/django/docker-compose.yaml up`

- [Supabase](./demos/supabase/README.md)

  - See the README for instructions.

# Config

The configuration can be modified to match other project topologies.

Edit the demo `.env` files and config files in the `./config` directory with your specific settings.

### Connections

Populate the `replication->connections` entry with your Postgres database connection details.

A simple Postgres server is provided in the `ps-postgres.yaml` Docker compose file. Be sure to keep the credentials in `powersync.yaml` in sync with the config in `ps-postgres.yaml` if using this server.

### Storage

The PowerSync Service uses MongoDB under the hood. A basic MongoDB replica-set service is available in `ps-mongo.yaml`. The `powersync.yaml` config is configured to use this service by default. Different MongoDB servers can be configured by removing the `include` statement from `docker-compose.yaml` and updating `powersync.yaml`.

### Authentication

This example uses JWKS which provides the public key directly to the PowerSync instance in `powersync.yaml`'s `jwks` section.

The `key-generator` project demonstrates generating RSA key pairs for token signing.

### Sync Rules

[Sync Rules](https://docs.powersync.com/usage/sync-rules) are currently defined by placing them in `./config/sync_rules.yaml`.

# Cleanup

If you want to start from a fresh start:

- Delete the Docker volumes `mongo_storage` and `db_data`
  Their full names might vary depending on the directory where the `docker-compose` command was executed.
- Delete the service Docker containers.
