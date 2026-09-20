create or replace function public.create_order(
  p_products jsonb,
  p_customer_name text,
  p_phone text,
  p_email text,
  p_delivery_method text,
  p_payment_method text,
  p_address jsonb default null,
  p_comment text default null
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := (select auth.uid());
  requested_lines integer;
  distinct_requested_lines integer;
  requested_count integer;
  available_count integer;
  calculated_products jsonb;
  calculated_products_price numeric;
  calculated_delivery_price numeric := case
    when p_delivery_method = 'courier' then 500
    else 0
  end;
  created_order public.orders;
begin
  if current_user_id is null or not public.is_active_user() then
    raise exception 'User is not authorized';
  end if;

  if p_delivery_method not in ('courier', 'pickup')
    or p_payment_method not in ('cash', 'card') then
    raise exception 'Invalid order method';
  end if;

  select count(*), count(distinct item.product_id), coalesce(sum(item.quantity), 0)
  into requested_lines, distinct_requested_lines, requested_count
  from jsonb_to_recordset(coalesce(p_products, '[]'::jsonb))
    as item(product_id bigint, quantity integer);

  select count(*)
  into available_count
  from jsonb_to_recordset(coalesce(p_products, '[]'::jsonb))
    as item(product_id bigint, quantity integer)
  join public.products product on product.id = item.product_id
  where item.quantity > 0
    and product.stock >= item.quantity;

  if requested_lines = 0
    or requested_lines <> distinct_requested_lines
    or available_count <> requested_lines
    or requested_count = 0 then
    raise exception 'Order must contain available products';
  end if;

  select
    jsonb_agg(jsonb_build_object(
      'productId', product.id,
      'name', product.name,
      'price', product.price,
      'quantity', item.quantity,
      'image', product.images[1]
    )),
    sum(product.price * item.quantity)
  into calculated_products, calculated_products_price
  from jsonb_to_recordset(coalesce(p_products, '[]'::jsonb))
    as item(product_id bigint, quantity integer)
  join public.products product on product.id = item.product_id
  where item.quantity > 0
    and product.stock >= item.quantity;

  insert into public.orders (
    user_id, products, customer_name, phone, email, delivery_method,
    payment_method, address, comment, products_price, delivery_price,
    discount, total, status
  )
  values (
    current_user_id, calculated_products, left(trim(p_customer_name), 200),
    left(trim(p_phone), 50), left(lower(trim(p_email)), 320),
    p_delivery_method, p_payment_method, p_address,
    left(trim(coalesce(p_comment, '')), 1000), calculated_products_price,
    calculated_delivery_price, 0,
    calculated_products_price + calculated_delivery_price, 'new'
  )
  returning * into created_order;

  delete from public.cart_items
  where user_id = current_user_id
    and product_id in (
      select item.product_id
      from jsonb_to_recordset(coalesce(p_products, '[]'::jsonb))
        as item(product_id bigint, quantity integer)
    );

  return created_order;
end;
$$;

revoke all on function public.create_order(jsonb, text, text, text, text, text, jsonb, text)
from public;
grant execute on function public.create_order(jsonb, text, text, text, text, text, jsonb, text)
to authenticated;
