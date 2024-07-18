# JavaScript Self Hosted Demo

This demo contains a NodeJS backend and React frontend which are linked to a self hosted PowerSync instance.

Backend code can be found [here](https://github.com/powersync-ja/powersync-nodejs-backend-todolist-demo)

## Running

The `.env` file contains default configuration for the services. Reference this to connect to any services locally.

This demo can be started by running the following in this demo directory

```bash
docker compose up
```

or in the root directory run

```bash
docker compose -f demos/nodejs/docker-compose.yaml up
```

The frontend can be accessed at `http://localhost:3030` in a browser.

## Telemetry

The enterprise edition of the PowerSync self hosting Docker image supports custom telemetry integration.

This demo can be started with custom telemetry by running

```bash
docker compose -f docker-compose.yaml -f docker-compose-telemetry.yaml up
```

This will additionally start an OpenTelemetry OTLP collector, Prometheus exporter and Grafana service.

The telemetry can be viewed by accessing `http://localhost:3121` in a browser.

Login with `admin` for both the username and password.

The `Telemetry` dashboard contains panels with various metrics.

## Cleanup

The `setup.sql` script only runs on the first initialization of the container. Delete the container and volumes if making changes.
