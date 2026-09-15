create type public.user_role as enum ('user', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Пользователь',
  phone text not null default '',
  email_notifications boolean not null default true,
  order_notifications boolean not null default true,
  role public.user_role not null default 'user',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.profiles (id, name, phone, email_notifications, order_notifications)
select
  id,
  coalesce(raw_user_meta_data ->> 'name', 'Пользователь'),
  coalesce(raw_user_meta_data ->> 'phone', ''),
  coalesce((raw_user_meta_data ->> 'emailNotifications')::boolean, true),
  coalesce((raw_user_meta_data ->> 'orderNotifications')::boolean, true)
from auth.users
on conflict (id) do nothing;

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id or (select public.is_admin()));

create policy "Users can update their own profile data"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    name,
    phone,
    email_notifications,
    order_notifications
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'Пользователь'),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce((new.raw_user_meta_data ->> 'emailNotifications')::boolean, true),
    coalesce((new.raw_user_meta_data ->> 'orderNotifications')::boolean, true)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an administrator can change a user role';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;

create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute procedure public.prevent_role_escalation();

grant select, update on public.profiles to authenticated;
