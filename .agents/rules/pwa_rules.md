# Reguły projektowe dla Uki's BodyBuild

## Mechanizmy PWA (Service Worker)

Z powodu specyfiki cache'owania środowiska GH Pages oraz samej przeglądarki, klasyczny event `updatefound` często zawodzi, blokując rozwój i nowości u aktywnych użytkowników.

1. **Wymuszanie Aktualizacji PWA:** Nie polegaj tylko na event listenerach ServiceWorkera. Aplikacja powinna używać okresowego wywoływania `registration.update()` połączonego z np. zdarzeniem nawigacji, przechodzenia do innej karty, bądź `visibilitychange`.
2. **Agresywny Fetch JSON (Fallback):** Obok natywnego mechanizmu aktualizacyjnego, zawsze używaj pętli z `fetch('CHANGELOG.json?_t=' + Date.now())` (z time-stamp'em łamiącym cache) aby pobierać faktyczny numer wersji i - w przypadku niezgodności - narzucać odświeżenie Service Workera.

## Zmiany w Interfejsie Modali (Changelog)

- Struktura pliku `CHANGELOG.json` weryfikowana przez parser powinna posiadać nienaruszony klucz `"changes"` (tablicę tekstów). Zamiana nazwy klucza na np. `"features"` bez modyfikacji samej logiki pętli w HTML spowoduje ciche błędy (np. *changes is undefined*) i doprowadzi do ukrycia Modala przed użytkownikiem! ZAWSZE trzymaj się klucza `"changes"`.
