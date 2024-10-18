# JavaScript PowerSync + MySQL Self Hosted Demo

This demo contains a NodeJS + MySQL backend and React frontend which are linked to a self hosted PowerSync instance.

Backend code can be found [here](https://github.com/powersync-ja/powersync-nodejs-backend-todolist-demo)

## Running

The `.env` file contains default configuration for the services. Reference this to connect to any services locally.

This demo can be started by running the following in this demo directory

```bash
docker compose up
```

or in the root directory run

```bash
docker compose -f demos/nodejs-mysql/docker-compose.yaml up
```

The frontend can be accessed at `http://localhost:3035` in a browser.

## Configuration

See [MySQL Configuration](../../services/mysql/init-scripts/my.cnf) for MySQL server configuration.
The MySQL server is initialized with the [init](../../services/mysql/init-scripts/mysql.sql) script.
