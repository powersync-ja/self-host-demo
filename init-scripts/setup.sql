-- Create tables
create table
  public.customers (
    id uuid primary key default gen_random_uuid () not null,
    created_at timestamp with time zone not null default now(),
    name text not null
  ) tablespace pg_default;

insert into public.customers (name) values ('Demo Customer');

-- Create publication for PowerSync
create publication powersync for table customers;
