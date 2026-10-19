# Proefrit: de echte app

Reviews van auto's door mensen die er echt in gereden hebben. Deze map bevat de backend en de koppeling
waarmee het prototype een echte app wordt.

## Opbouw

| Onderdeel | Waarvoor |
|---|---|
| `supabase/migrations/20261018000000_init.sql` | Databaseschema met toegangsregels (Row Level Security) voor profielen, catalogus, garage, check-ins, Top!, reacties, chat met akkoord, tickets en foto's van rijders. |
| `supabase/migrations/20261018000100_storage.sql` | Opslagmappen (buckets) voor ingestuurde foto's, goedgekeurde foto's en avatars. |
| `supabase/seed/cars.sql` | De catalogus: 1.830 modellen van 129 merken met 1.095 versies. |
| `supabase/seed/vocab.sql` | De woordenlijsten: 196 kenmerken, 92 interesses plus alle merken, en het woordfilter. Draai na `cars.sql`. |
| `supabase/functions/checkin` | Check-in plaatsen. Controleert kenteken bij de RDW en de foto met Claude, en zet zelf 'geverifieerd'. |
| `supabase/functions/add-proof` | Bewijs toevoegen aan een eerdere check-in. |
| `supabase/functions/rdw-lookup` | Kenteken invullen, en merk, model en brandstof voorstellen. |
| `supabase/functions/garage-plate` | Kenteken controleren bij een auto in je garage. |
| `supabase/functions/ticket` | Opmerking over de website: ticket opslaan en e-mail naar het supportadres. |
| `supabase/functions/photo` | Foto van een rijder insturen: Claude keurt voor, de app maakt kentekens onherkenbaar, Claude controleert opnieuw, daarna wacht de foto op keuring. |
| `supabase/functions/photo-moderate` | Fotokeuring voor beheerders: lijst, goedkeuren (eventueel met extra afscherming), afkeuren met reden, offline halen. |
| `web/api.js` | Koppeling tussen de app en de backend (inloggen, profielen, check-ins, chat, tickets). |
| `scripts/export-catalog.js` | Zet de catalogus uit het prototype om naar `cars.sql`. |
| `scripts/import-rdw.mjs` | Haalt alle personenauto-modellen op die ooit in Nederland op kenteken stonden (RDW, CC0), koppelt ze aan de catalogus en zet ontbrekende modellen erbij. Draait maandelijks via `.github/workflows/import-rdw.yml`. |

## Beveiliging in het kort

- Alles staat standaard dicht. Elke tabel heeft regels voor wie mag lezen en schrijven.
- Check-ins kunnen alleen via de serverfunctie worden geplaatst, zodat niemand zelf 'geverifieerd' kan aanzetten.
- Kentekens worden nooit opgeslagen, alleen als HMAC-code met een geheime 'pepper'. Een gewone hash zou terug te rekenen zijn.
- Verificatiefoto's worden niet bewaard; alleen een code om hergebruik te herkennen.
- Foto's van rijders: Claude keurt voor en wijst kentekens aan, de app maakt die onherkenbaar en de server controleert de afgeschermde versie opnieuw. Er wordt nooit een foto met leesbaar kenteken bewaard die de controle niet heeft doorstaan, en niets wordt openbaar zonder akkoord van een beheerder.
- Profielgegevens (leeftijdsgroep, woonplaats, rijervaring) zijn alleen zichtbaar als de gebruiker dat aanzet.
- Chat: een verzoek bevat precies één bericht; pas na akkoord van de ontvanger kan er verder gepraat worden. Wie geen verzoeken wil, krijgt ze niet.
- Het supportadres staat alleen in de geheime instelling `SUPPORT_EMAIL`, niet in de code.
- Woordfilter: scheldwoorden en ziektes als scheldwoord worden geweigerd in chat, reacties, reviews, gebruikersnaam, bio en woonplaats. De app en de serverfuncties controleren eerst (ook trucs als `k@nker` en `k a n k e r`), de database weigert daarnaast alles wat er toch doorheen komt. Basis: [LDNOOBW](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words) (CC BY 4.0), opgeschoond voor een auto-app en aangevuld.
- Kenmerken en interesses moeten uit de vaste woordenlijst komen (tabel `vocab`), dus altijd goed gespeld en over auto's.

Getest op Postgres 16 met nagebootste Supabase-rollen: profielen van anderen niet leesbaar,
geen rechtstreekse check-ins, geen zelf-verificatie, chatregel van één bericht, maximaal 4 droomauto's,
niemand kan andermans reviews wijzigen, foto's alleen via de serverfunctie insturen en alleen goedgekeurde foto's openbaar.

## Geheime instellingen (Supabase > Edge Functions > Secrets)

| Naam | Inhoud |
|---|---|
| `PLATE_PEPPER` | Een lange willekeurige tekst (minstens 32 tekens). Nooit veranderen na de start. |
| `ANTHROPIC_API_KEY` | Sleutel voor het lezen van foto's met Claude. |
| `ANTHROPIC_MODEL` | Optioneel, model voor het kenteken lezen; standaard `claude-haiku-5-5`. |
| `ANTHROPIC_PHOTO_MODEL` | Optioneel, model voor de fotokeuring (kaders aanwijzen); standaard `claude-sonnet-5-5`. |
| `RESEND_API_KEY` | Sleutel van de e-maildienst Resend. |
| `SUPPORT_EMAIL` | Het adres waar tickets heen gaan. |
| `FROM_EMAIL` | Optioneel, afzender na domeinverificatie, bijv. `Proefrit <support@jouwdomein.nl>`. |
| `RDW_APP_TOKEN` | Optioneel, hogere limieten bij de RDW open data. |
| `APP_ORIGIN` | Het webadres van de app, voor CORS. |

`SUPABASE_URL` en `SUPABASE_SERVICE_ROLE_KEY` zijn in serverfuncties automatisch beschikbaar.

## Installeren met de Supabase-CLI (voor ontwikkelaars)

```bash
supabase link --project-ref <project-ref>
supabase db push                      # schema en opslag
psql "$DATABASE_URL" -f supabase/seed/cars.sql
psql "$DATABASE_URL" -f supabase/seed/vocab.sql
supabase secrets set PLATE_PEPPER=... ANTHROPIC_API_KEY=... RESEND_API_KEY=... SUPPORT_EMAIL=...
supabase functions deploy checkin add-proof rdw-lookup garage-plate ticket photo photo-moderate
```

Zonder CLI kan het ook via het dashboard: plak de twee migratiebestanden, `cars.sql` en `vocab.sql` in de SQL Editor.
De serverfuncties gaan automatisch online via `.github/workflows/deploy-functions.yml` zodra de GitHub-geheimen
`SUPABASE_ACCESS_TOKEN` en `SUPABASE_PROJECT_REF` zijn ingesteld.

## RDW-import nakijken

De import koppelt RDW-namen automatisch aan een model (`rdw_models.match = 'voorstel'`) en zet RDW-modellen zonder
passend model, met minstens 50 voertuigen, als nieuw model in de catalogus (`cars.source = 'rdw'`, brandstof volgt uit
het kenteken). Kijk na de eerste run in de Table Editor naar `rdw_models` (gesorteerd op `vehicles`) en zet goede
koppelingen op `zeker`. Sommige namen verschillen van onze catalogus (de RDW schrijft bijvoorbeeld `3ER REIHE` waar wij
`3-serie` gebruiken): koppel die met de hand en verwijder het dubbele model. Een koppeling op `zeker` blijft bij elke
volgende run staan.

## Bronnen

- RDW Open Data (CC0): `m9d7-ebf2` (gekentekende voertuigen) en `8ys7-d773` (brandstof).
- Logica van de RDW-import getest met voorbeeldrijen op Postgres 16; de echte RDW-aanroep draait pas in GitHub Actions.
- Catalogus deels op basis van [US Car Models Data](https://github.com/abhionlyone/us-car-models-data) (CC BY 4.0).
- Woordfilter deels op basis van [LDNOOBW](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words) (CC BY 4.0).
