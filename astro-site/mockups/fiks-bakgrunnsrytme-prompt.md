# Oppgave: Fiks bakgrunnsrytme på `/hjemme/` – «Før du starter»-boksen

## Problem
På `/hjemme/` ligger «Før du starter»-boksen med Sky-bakgrunn (`#eff4fb`) inne i et område som også er Sky, rett under en hero som også er Sky. Boksen forsvinner visuelt — det er ingen kontrast mellom boksen og omgivelsene.

## Løsning (godkjent)
«Før du starter»-boksen skal bruke **Beige** (`#f4eee3`) i stedet for Sky.

Dette er samme token som «Krystallsykehjelpen hjemme»-seksjonen på forsiden bruker, så `/hjemme/` knyttes visuelt til forsiden, og boksen får den vekten den skal ha som forutsetning brukeren bør lese før de går videre.

Referanse: `bakgrunnsrytme-alternativer.html` (alternativ 1) viser ønsket resultat.

## Hva som skal gjøres
1. Endre bakgrunnsfargen på «Før du starter»-boksen fra Sky til Beige. Bruk det eksisterende Beige-designtokenet i prosjektet — ikke hardkod hex-verdien hvis det finnes en variabel.
2. Kontroller at teksten fortsatt har god kontrast mot Beige (Navy-tekst på Beige skal være godt lesbart — sjekk at det oppfyller WCAG AA).
3. Kontroller at de to knappene i boksen fortsatt ser riktige ut mot Beige-bakgrunn. Juster kun om noe faktisk ser galt ut — ikke redesign knappene.
4. Kontroller at overgangen hero (Sky) → Beige boks → Steg 1 (hvit) føles ryddig på både desktop og mobil.

## Etablert prinsipp for videre arbeid
Denne bakgrunnsrytmen skal gjelde videre på `/hjemme/` når fase 3 bygges:
- **Sky** — hero og rolige informasjonsområder
- **Beige** — seksjoner som krever at brukeren stopper opp og leser (forutsetninger, viktige valg)
- **Hvit** — vanlige innholds- og kortseksjoner

Ikke bruk rødt eller rosa noe sted. Ikke innfør farger utenfor de seks eksisterende tokens.

## Begrensninger
- Dette er en ren visuell justering. **Ikke endre innhold, tekst, struktur, komponenter eller lenker.**
- Ikke rør hero, Steg 1, Steg 2, ExerciseCard, SafetyNotice eller VideoGuide.
- Ikke rør forsiden eller andre sider.
- Ingen nye farger, ingen gradient, ingen nye avhengigheter.
- Ikke endre `@astrojs/react`-versjon (låst på v3.6.2).
- Ikke publiser i Sanity, ikke push til GitHub — Marie gjør dette manuelt etter lokal gjennomgang.

## Akseptansekriterier
- [ ] «Før du starter»-boksen har Beige bakgrunn og skiller seg tydelig fra området rundt
- [ ] Tekstkontrast er god (WCAG AA)
- [ ] Knappene i boksen ser riktige ut mot Beige
- [ ] Ingen innholds- eller strukturendringer
- [ ] `npm run build` kjører uten feil

Vis meg til slutt hvilke filer du har endret.
