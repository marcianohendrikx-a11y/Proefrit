-- RDW-import telt nu ook bedrijfsauto's (grijs kenteken) mee voor het koppelen van kentekens aan modellen.
-- Nieuwe modellen komen alleen uit personenauto's; daarvoor dit aparte aantal.
alter table public.rdw_models add column if not exists passenger_vehicles int not null default 0;
update public.rdw_models set passenger_vehicles = vehicles where passenger_vehicles = 0;
