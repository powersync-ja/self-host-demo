# JavaScript PowerSync + MSSQL Self Hosted Demo

This demo contains a NodeJS + MSSQL backend and React frontend which are linked to a self hosted PowerSync instance.

Backend code can be found [here](https://github.com/powersync-ja/powersync-nodejs-backend-todolist-demo)

## Running

The `.env` file contains default configuration for the services. Reference this to connect to any services locally.

This demo can be started by running the following in this demo directory

```bash
docker compose up
```

or in the root directory run

```bash
docker compose -f demos/nodejs-mssql/docker-compose.yaml up
```

The frontend can be accessed at `http://localhost:3036` in a browser.

## Configuration

See [MSSQL Configuration](../../services/mssql/mssql.yaml) for the SQL server configuration 
The SQL server is initialized with the [init](../../services/mssql/init.sql) script. 

The initialization script (`init.sql`) performs the following setup steps:

1. **Database Creation**: Creates the application database
2. **CDC Setup**: Enables Change Data Capture at the database level
3. **User Creation**: Creates a SQL Server login and database user with appropriate permissions
4. **Create PowerSync Checkpoints table**: Creates the required `_powersync_checkpoints` table.
5. **Self Host Demo Tables**: Creates the demo tables (`lists` and `todos`)
6. **Enable Table CDC**: Enables CDC tracking on the demo tables
7. **Permissions**: Grants `db_datareader` and `cdc_reader` roles to the application user
8. **Sample Data**: Inserts initial test data into the `lists` table

All operations are idempotent, so they can safely be re-run without errors.

