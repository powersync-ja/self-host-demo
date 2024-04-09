-- Create tables
create table
  public.customers (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text not null
  ) tablespace pg_default;

insert into public.customers (name) ('Steven Customerson')

-- Create publication for PowerSync
create publication powersync for table customers;