# Supabase Local Development

This is demonstration of running Supabase locally in tandem with our [React Supabase Todolist demo](https://github.com/powersync-ja/powersync-js/tree/main/demos/react-supabase-todolist).

## Getting Started

Follow the [instructions](https://supabase.com/docs/guides/cli/getting-started) for configuring Supabase locally.

Copy the environment variables template file

```bash
cp .env.template .env
```

Start the Supabase project

```bash
supabase start
```

Once started the console will contain details for the Supabase Anon key and Postgres connection. Apply these values to the `.env` file.

Start the demonstration with `docker compose up`

The frontend should be available at `http://localhost:4170`

Note that there is a known issue with the client. It will present `busy with sync` until an item has been created. This is due to no data being present in the Postgres database. Create a todo list item to skip past this.
