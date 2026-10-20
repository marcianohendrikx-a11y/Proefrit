-- Dezelfde auto kan maar één keer per groep (rijd ik nu, heb ik gehad, droomauto) in je garage staan.
delete from public.garage_items g using public.garage_items o
where g.user_id = o.user_id and g.car_id = o.car_id and g.status = o.status and g.created_at > o.created_at;
create unique index if not exists garage_items_uniek on public.garage_items (user_id, car_id, status);
