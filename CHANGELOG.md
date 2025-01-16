# PowerSync Self Hosted Example

## 2025-01-16

- Updated PowerSync SDK packages in demo application.
- Updated Supabase demo to use JWT secret

## 2025-01-10

- Added demo for using Postgres as the bucket storage.

## 2024-11-27

- Updated `journeyapps/powersync-service:latest` image specifier which will target `>v.1.0.0` of the Docker image. This version of the Docker image contains support for MongoDB (alpha), MySQL (alpha) and the new modular architecture.

## v0.6.1

- Updated `powersync/web` to version `1.11.0` in NodeJS demo app.

## v0.6.0

- Use Supabase Docker networks. This removes the use of `host.docker.internal` which is not always available on all Systems.

## v0.5.2

- Added note for PowerSync service memory limits using the `NODE_OPTIONS` environment variable.

## v0.5.1

- Use Next (development) PowerSync service image for testing.

## v0.5.0

- Added alpha demo for MongoDB replication

## v0.4.1

- Cleaned `powersync.yaml` config file placeholder values

## v0.4.0

- Added Supabase local development demo.

## v0.3.0

- Added a Django demo. Split code to make demos more modular

## v0.2.0

- Updated to MongoDB v7
- Implemented config file environment variable template substitution
- Renamed `.yml` files to `.yaml`
- Neatened `powersync.yaml` layout and comments
- Added JSON schema for `powersync.yaml`
- Updated PowerSync Web SDK in demo app

## v0.1.0

- Initial release
