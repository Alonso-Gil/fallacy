do $enum$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'RoomStatus' and n.nspname = 'public'
  ) then
    create type public."RoomStatus" as enum ('WAITING', 'IN_PROGRESS', 'ENDED');
  end if;
end$enum$;

drop table if exists public.rooms cascade;

create table public.rooms (
  "id" uuid not null default gen_random_uuid(),
  "title" text not null,
  "description" text,
  "max_seats" integer not null default 4,
  "is_public" boolean not null default true,
  "status" public."RoomStatus" not null default 'WAITING',
  "created_by" uuid not null,
  "created_at" timestamp(3) not null default current_timestamp,
  "updated_at" timestamp(3) not null default current_timestamp,
  constraint "rooms_pkey" primary key ("id")
);

alter table public.rooms
  add constraint "rooms_created_by_fkey"
  foreign key ("created_by")
  references auth.users ("id")
  on delete restrict
  on update no action;

alter table public.rooms enable row level security;

revoke all on table public.rooms from PUBLIC;
grant usage on schema public to anon, authenticated, service_role;
grant all on table public.rooms to postgres, service_role;
grant select on table public.rooms to anon;
grant select, insert, update, delete on table public.rooms to authenticated;
revoke insert, update, delete on table public.rooms from anon;

do $$ begin
  if exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'RoomStatus' and n.nspname = 'public'
  ) then
    grant usage on type public."RoomStatus" to anon;
    grant usage on type public."RoomStatus" to authenticated;
    grant usage on type public."RoomStatus" to service_role;
  end if;
end $$;

create or replace function public.current_user_id()
returns uuid
language sql
stable
as $fn$
  select nullif(
    coalesce(
      current_setting('request.jwt.claim.sub', true),
      nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'sub'
    ),
    ''
  )::uuid
$fn$;

grant execute on function public.current_user_id() to anon;
grant execute on function public.current_user_id() to authenticated;
grant execute on function public.current_user_id() to service_role;

drop policy if exists "Anyone can read public rooms" on public.rooms;
drop policy if exists "Authenticated users can create rooms" on public.rooms;
drop policy if exists "Users can update their own rooms" on public.rooms;
drop policy if exists "Users can delete their own rooms" on public.rooms;
drop policy if exists "Service role full access to rooms" on public.rooms;
drop policy if exists "Postgres can manage all rooms" on public.rooms;

create policy "Service role full access to rooms"
on public.rooms
as permissive
for all
to service_role
using (true)
with check (true);

create policy "Postgres can manage all rooms"
on public.rooms
as permissive
for all
to postgres
using (true)
with check (true);

create policy "Anyone can read public rooms"
on public.rooms
for select
to anon, authenticated
using (
  is_public = true
  or public.current_user_id() = created_by
);

create policy "Authenticated users can create rooms"
on public.rooms
for insert
to authenticated
with check (public.current_user_id() = created_by);

create policy "Users can update their own rooms"
on public.rooms
for update
to authenticated
using (public.current_user_id() = created_by)
with check (public.current_user_id() = created_by);

create policy "Users can delete their own rooms"
on public.rooms
for delete
to authenticated
using (public.current_user_id() = created_by);

notify pgrst, 'reload schema';
