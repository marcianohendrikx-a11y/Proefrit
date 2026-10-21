# Proefrit: context voor Claude

Proefrit is een app zoals Untappd, maar voor auto's: reviews van mensen die echt in de auto gereden hebben.
De interface is volledig Nederlands. Eigenaar: Marciano Hendrikx. Praat Nederlands met hem.

## Hoe de code in elkaar zit

- `app/src/` bevat de bronbestanden van de app (`head8.html`, `logic8.js`, `visual8.js`, `vocab8.js`, `live_core.js`, catalogusbestanden).
- `python3 app/build.py` bouwt daaruit `web/index.html`, inclusief de koppeling met de backend. Elke vervanging in `build.py` controleert dat de oorspronkelijke tekst precies één keer voorkomt; pas bij wijzigingen in `app/src/` ook de bijbehorende vervangingen aan.
- `node app/check.mjs` controleert dat het script in `web/index.html` geen syntaxfout heeft. Draai dit na elke build.
- `web/` wordt via GitHub Pages online gezet (`.github/workflows/pages.yml`) bij een push naar `main`.
- `web/prototype.html` is het oorspronkelijke prototype zonder backend.
- Backend: Supabase in de EU (Ierland), project-ref `rwhvhzwrqutzyzkcykut`.
  - `supabase/migrations/`: databaseschema met Row Level Security. Nieuwe wijzigingen altijd als nieuwe migratie, nooit een oude aanpassen. Wordt uitgerold via `migrate.yml`.
  - `supabase/functions/`: Edge Functions (check-in, bewijs, RDW-kenteken, garage, tickets, foto's, account verwijderen). Uitgerold via `deploy-functions.yml`.
  - `supabase/seed/`: catalogus en woordenlijsten.
- Maandelijkse taken: RDW-catalogus bijwerken (`import-rdw.yml`) en oude gegevens opruimen (`opruimen.yml`).

## Vaste afspraken

- Alleen geverifieerde check-ins (kenteken gecontroleerd tegen de auto) tellen voor badges. Check-ins alleen via de serverfunctie, zodat niemand zelf 'geverifieerd' kan aanzetten.
- Inchecken vereist een account; rondkijken niet.
- Inloggen via Google (eventueel later andere accounts).
- Het supportadres staat alleen in de geheime instelling `SUPPORT_EMAIL` en mag nergens in de app, de code of de git-geschiedenis te vinden zijn. Deze repo is openbaar.
- Nooit geheimen in de repo: alleen de `anon`-sleutel in `web/config.js`, nooit de `service_role`-sleutel.
- Kentekens worden nooit leesbaar opgeslagen (alleen HMAC met `PLATE_PEPPER`).
- De privacyverklaring staat voorlopig op naam van Marciano zelf, zonder bedrijf.

## Werkwijze

- Alles in de app moet er standaard verzorgd en professioneel uitzien, niet alleen werken.
- Verbeteringen aan de interface mag je altijd voorstellen of direct doorvoeren.
- Denk mee en stel ideeën gerust ter discussie.
- Commitberichten in het Nederlands, kort en beschrijvend.
