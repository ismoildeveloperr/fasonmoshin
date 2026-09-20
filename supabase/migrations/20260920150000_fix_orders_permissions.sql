drop policy if exists "Users can create orders" on public.orders;
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Admin can view all orders" on public.orders;
drop policy if exists "Users read own orders" on public.orders;
drop policy if exists "Admins read orders" on public.orders;
drop policy if exists "Admins manage orders" on public.orders;

create policy "Users read own orders"
on public.orders for select
to authenticated
using (
  (select auth.uid()) = user_id
  and (select public.is_active_user())
);

create policy "Admins read orders"
on public.orders for select
to authenticated
using ((select public.is_admin()));

create policy "Admins manage orders"
on public.orders for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

revoke all on public.orders from anon;
grant select, update on public.orders to authenticated;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

revoke all on function public.is_active_user() from public;
grant execute on function public.is_active_user() to authenticated;
