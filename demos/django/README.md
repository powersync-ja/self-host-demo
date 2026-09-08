# Django Self Hosted Demo

This demo contains a Django backend with no frontend client. This can be used in conjunction with our Django demos:

- [React Native](https://github.com/powersync-ja/powersync-js/tree/main/demos/django-react-native-todolist)
- [Dart](https://github.com/powersync-ja/powersync.dart/tree/master/demos/django-todolist)

Backend code can be found [here](https://github.com/powersync-ja/powersync-django-backend-todolist-demo)

## Running

The [`.env`](./.env) file contains default configuration for the services. Reference this to connect to any services locally.

PowerSync service settings are in [`powersync/service.yaml`](./powersync/service.yaml), and the data to sync is defined in [`powersync/sync-config.yaml`](./powersync/sync-config.yaml). This demo mounts its own `powersync/` directory into the PowerSync container.

This demo can be started by running the following in this demo directory

```bash
docker compose up
```

or in the root directory run

```bash
docker compose -f demos/django/docker-compose.yaml up
```

The Django backend will by default be available at `http://localhost:6061`.

The PowerSync backend will by default be available at `http://localhost:8080`.

See the client demos above for starting a client.
