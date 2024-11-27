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


DO $$
DECLARE
    i INT;
    description TEXT;
    list_id UUID;
    created_by UUID;
    completed_by UUID;
    photo_id UUID;
BEGIN
    FOR i IN 1..20000 LOOP
        -- Generate random data for each row
        description := 'Task description ' || i;
        list_id := gen_random_uuid();
        created_by := gen_random_uuid();
        -- 50% chance for completed rows
        IF random() > 0.5 THEN
            completed_by := gen_random_uuid();
        ELSE
            completed_by := NULL;
        END IF;
        -- 30% chance to include a photo
        IF random() > 0.7 THEN
            photo_id := gen_random_uuid();
        ELSE
            photo_id := NULL;
        END IF;

        -- Insert into the todos table
        INSERT INTO public.todos (
            description,
            completed,
            created_by,
            completed_by,
            list_id,
            photo_id,
            completed_at
        ) VALUES (
            description,
            completed_by IS NOT NULL, -- True if completed_by is not NULL
            created_by,
            completed_by,
            list_id,
            photo_id,
            CASE WHEN completed_by IS NOT NULL THEN now() - (random() * interval '10 days') ELSE NULL END
        );
    END LOOP;
END $$;
