-- Chat: een eigen verzoek intrekken of iemand die je blokkeerde weer deblokkeren.
-- In beide gevallen verdwijnt het gesprek; daarna kan er opnieuw een verzoek komen.
create or replace function public.chat_remove(conv uuid, action text) returns boolean
  language plpgsql security definer set search_path = public as $$
declare c public.conversations;
begin
  select * into c from public.conversations where id = conv;
  if c.id is null or auth.uid() not in (c.user_a, c.user_b) then raise exception 'Gesprek niet gevonden'; end if;
  if action = 'withdraw' then
    if c.state <> 'requested' or c.requested_by <> auth.uid() then raise exception 'Alleen een eigen openstaand verzoek kun je intrekken'; end if;
  elsif action = 'unblock' then
    if c.state <> 'blocked' or c.blocked_by <> auth.uid() then raise exception 'Je kunt alleen iemand deblokkeren die jij hebt geblokkeerd'; end if;
  else
    raise exception 'Onbekende actie';
  end if;
  delete from public.conversations where id = conv;
  return true;
end $$;
revoke all on function public.chat_remove(uuid, text) from public, anon;
grant execute on function public.chat_remove(uuid, text) to authenticated;
