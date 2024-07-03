# PowerSync Self hosted demo app

This is a small demonstration for connecting to a self hosted PowerSync instance. Changes made to the Postgres server should be synced to clients.

## Authentication

This essentially uses anonymous authentication. A random user ID is generated and stored in local storage. The backend returns a valid token which is not linked to a specific user. All data is synced to all users.
