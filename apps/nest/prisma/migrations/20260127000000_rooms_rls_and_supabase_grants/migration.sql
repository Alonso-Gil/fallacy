grant usage on schema public to anon;
grant usage on schema public to authenticated;

grant select on table public.rooms to anon;
grant select, insert, update, delete on table public.rooms to authenticated;

revoke insert, update, delete on table public.rooms from anon;

do $$
begin
  if exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'RoomStatus'
      and n.nspname = 'public'
  ) then
    grant usage on type public."RoomStatus" to anon;
    grant usage on type public."RoomStatus" to authenticated;
  end if;
end $$;

create or replace function public.current_user_id()
returns uuid
language sql
stable
as $$
  select nullif(
    coalesce(
      current_setting('request.jwt.claim.sub', true),
      nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'
    ),
    ''
  )::uuid;
$$;

grant execute on function public.current_user_id() to anon;
grant execute on function public.current_user_id() to authenticated;

alter table public.rooms enable row level security;

drop policy if exists "Anyone can read public rooms" on public.rooms;
drop policy if exists "Authenticated users can create rooms" on public.rooms;
drop policy if exists "Users can update their own rooms" on public.rooms;
drop policy if exists "Users can delete their own rooms" on public.rooms;

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
with check (
  public.current_user_id() = created_by
);

create policy "Users can update their own rooms"
on public.rooms
for update
to authenticated
using (
  public.current_user_id() = created_by
)
with check (
  public.current_user_id() = created_by
);

create policy "Users can delete their own rooms"
on public.rooms
for delete
to authenticated
using (
  public.current_user_id() = created_by
);

notify pgrst, 'reload schema';
