# JavaScript PowerSync + Custom Write Checkpoints

This is a demo for using custom Write Checkpoints with PowerSync. Custom Write Checkpoints eliminate flicker when uploads do not directly reflect in the backend source database. This feature is only available for customers on [Team and Enterprise](https://www.powersync.com/pricing) plans.

Docs are available [here](https://docs.powersync.com/usage/use-case-examples/custom-write-checkpoints).

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
docker compose -f demos/nodejs-custom-checkpoints/docker-compose.yaml up
```

The frontend can be accessed at `http://localhost:3034` in a browser.
