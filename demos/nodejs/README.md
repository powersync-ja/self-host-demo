# JavaScript Self Hosted Demo

This demo contains a NodeJS backend and React frontend which are linked to a self hosted PowerSync instance.

Backend code can be found [here](https://github.com/powersync-ja/powersync-nodejs-backend-todolist-demo)

## Running

This demo can be started by running the following in this demo directory

```bash
docker compose up
```

or in the root directory run

```bash
docker compose -f demos/nodejs/docker-compose.yaml up
```

The frontend can be accessed at `http://localhost:3030` in a browser.

## Cleanup

The `setup.sql` script only runs on the first initialization of the container. Delete the container and volumes if making changes.
