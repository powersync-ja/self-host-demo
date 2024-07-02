-- TODO change this if changing the DB connection name
\connect postgres;

-- Create tables
create table public.lists (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text not null,
    owner_id uuid not null,
    constraint lists_pkey primary key (id)
  );

create table public.todos (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    completed_at timestamp with time zone null,
    description text not null,
    completed boolean not null default false,
    created_by uuid null,
    completed_by uuid null,
    list_id uuid not null,
    photo_id uuid null,
    constraint todos_pkey primary key (id)
  );

-- Creates some initial data to be synced
INSERT INTO lists (id, name, owner_id) VALUES ('75f89104-d95a-4f16-8309-5363f1bb377a', 'Getting Started', gen_random_uuid()  );
INSERT INTO todos(description, list_id, completed) VALUES ('Run services locally', '75f89104-d95a-4f16-8309-5363f1bb377a', true);
INSERT INTO todos (description, list_id, completed) VALUES ('Create a todo here. Query the todos table via a Postgres connection. Your todo should be synced', '75f89104-d95a-4f16-8309-5363f1bb377a', false);

-- Create publication for PowerSync
create publication powersync for table lists, todos;
