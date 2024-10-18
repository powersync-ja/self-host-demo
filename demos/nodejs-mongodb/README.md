# JavaScript PowerSync + MongoDB Self Hosted Demo

This demo contains a NodeJS + MongoDB backend and React frontend which are linked to a self hosted PowerSync instance.

Backend code can be found [here](https://github.com/powersync-ja/powersync-nodejs-backend-todolist-demo)

## Running

The `.env` file contains default configuration for the services. Reference this to connect to any services locally.

This demo can be started by running the following in this demo directory

```bash
docker compose up
```

or in the root directory run

```bash
docker compose -f demos/nodejs-mongodb/docker-compose.yaml up
```

The frontend can be accessed at `http://localhost:3033` in a browser.
