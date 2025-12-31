# Supabase Local Development

This is demonstration of running Supabase locally in tandem with our [React Supabase Todolist demo](https://github.com/powersync-ja/powersync-js/tree/main/demos/react-supabase-todolist).

## Getting Started

Make sure you are using the latest version of the Supabase CLI. If you don't have the Supabase CLI installed, follow the [instructions](https://supabase.com/docs/guides/local-development/cli/getting-started#installing-the-supabase-cli). 

Start the Supabase project using the setup script (this automatically generates asymmetric signing keys):

```bash
chmod +x setup.sh
./setup.sh
```

Alternatively, you can run the steps manually:

```bash
supabase gen signing-key --algorithm ES256 --append

supabase start
```

Start the demonstration with `docker compose up`

The frontend should be available at `http://localhost:4170`

> **Note:** This demo uses Supabase's new asymmetric JWT signing keys (ES256). PowerSync is compatible with these keys and will automatically fetch the public key from Supabase's JWKS endpoint. 