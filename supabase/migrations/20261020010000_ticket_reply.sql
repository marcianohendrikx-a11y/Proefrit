-- Tickets beantwoorden vanuit de app: het antwoord staat bij de melding (de melder ziet het in de app).
alter table public.tickets add column if not exists reply text check (char_length(reply) <= 2000);
alter table public.tickets add column if not exists replied_at timestamptz;
