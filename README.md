# PowerSync Self Hosted Example

This repo is an example of using the PowerSync service self hosted Docker image.

# Setup

## Docker

Get a repository login token from PowerSync support.
[Discord](https://discord.gg/powersync)
[Email](support@powersync.com)

Login to the PowerSync Docker repository. Note that the `username` is not used. Feel free to enter anything if prompted.

```bash
docker login container-registry.journeyapps.com -u foobar
```

# Run

This demo repository contains a basic local configuration for Postgres. The entire stack can be started with a single command.

```bash
docker-compose --env-file=.env  up
```

## Demo app

This compose file serves an example app at `localhost:3030`. This app syncs changes made from the Postgres Server DB.

# Config

The configuration can be modified to match other project topologies.

Edit the `.env` file and config files in the `./config` directory with your specific settings.

### Connections

Populate the `replication->connections` entry with your SQL server connection details.

A simple Postgres server is provided in the `ps-postgres.yaml` Docker compose file. Be sure to keep the credentials in `powersync.yml` in sync with the config in `ps-postgres.yaml` if using this server.

### Storage

The PowerSync service uses MongoDB under the hood. A basic MongoDB replica-set service is available in `ps-mongo.yaml`. The `powersync.yml` config is configured to use this service by default. Different MongoDB servers can be configured by removing the `include` statement from `docker-compose.yaml` and updating `powersync.yml`.

### Authentication

This example uses JWKS which provides the public key directly to the PowerSync instance in `powersync.yml`'s `jwks` section.

The `key-generator` project demonstrates generating RSA key pairs for token signing.

### Sync Rules

Sync rules are currently defined by placing them in `./config/sync_rules.yml`.

# Cleanup

The `setup.sql` script only runs on the first initialization of the container.

If you want to start from a fresh start:

- Delete the Docker volumes `mongo_storage` and `db_data`
  Their full names might vary depending on the directory where the `docker-compose` command was executed.
- Delete the service Docker containers.
