# JavaScript PowerSync + Postgres Bucket Storage

This is a demo for using Postgres as the sync bucket storage driver with PowerSync. This feature is only available for customers on [Team and Enterprise](https://www.powersync.com/pricing) plans.

Separate Postgres servers are required for the bucket storage and replication data source.

## Running

The `.env` file contains default configuration for the services. Reference this to connect to any services locally.

Ensure you have authenticated with our Docker Image repository. Please reach out to support for an access token.

```bash
# the value for user doesn't matter
docker login container-registry.journeyapps.com -u user
```

This demo can be started by running the following in this demo directory

```bash
docker compose up
```

or in the root directory run

```bash
docker compose -f demos/nodejs-postgres-bucket-storage/docker-compose.yaml up
```

The frontend can be accessed at `http://localhost:3039` in a browser.

The Postgres databases can be accessed at the following URIs

Application data: `postgres://postgres:postgres@localhost:5432/postgres`

bucket storage: `postgres://postgres:postgres@localhost:5431/postgres`
Bucket storage tables are located in the `powersync` schema.
