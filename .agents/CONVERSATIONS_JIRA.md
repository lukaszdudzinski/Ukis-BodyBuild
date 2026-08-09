# Rejestr Konwersacji (Wewnętrzna Jira)

Ten plik służy do śledzenia historii konwersacji z agentami. Pozwala to na zachowanie pełnego kontekstu i powrót do poprzednich sesji, aby zrozumieć, jakie zmiany zostały wprowadzone.

## Konwersacja: 4840560b-3145-4499-997e-1311d07ebf4a
- **Temat**: Implementacja Samouczka Kontekstowego PWA, naprawa HTTP Cache Trap.
- **Kluczowe Zmiany**: 
  - Rozbudowa samouczka ("Liquid Glass") z "Trenerem Edwardem".
  - Naprawa cache PWA (`sw.js` fetch timeout i `no-store` dla obejścia blokady Safari).
  - Wdrożenie inteligentnych podpowiedzi Trenera (pierwszy, siódmy trening, regeneracja).
  - Testy nawigacji E2E (aktualizacja selektorów na `a[data-tab]`).

## Konwersacja (Obecna): cb0b064b-7514-42c8-adc8-d8bf9337e9ce
- **Temat**: ROADMAPA - Faza 1: Stabilność zapisu treningów, błędy z Drop Setami i znikające dane.
- **Planowane Zmiany**:
  - Wdrożenie wewnętrznej Jiry i śledzenia ID.
  - Naprawa krytycznego błędu zapisu złożonych treningów.
  - Automatyczny "brudnopis" (Draft) treningu w localStorage.
  - Poprawa numeracji serii dla Drop Setów.

## Konwersacja: 0a0a9070-1497-438f-a739-aa25e79273b7
- **Temat**: ROADMAPA - Faza 2: Podział treningów, zajęcia zorganizowane, asystent na zablokowanym ekranie.
- **Kluczowe Zmiany**:
  - Poprawa błędu zapisu treningów (ochrona SQLite przed `NaN` oraz naprawa interwałów).
  - Wdrożenie 3 typów treningów: Siłowy, Cardio, Zajęcia Zorganizowane.
  - Słownik zajęć zorganizowanych (Tabata, Les Mills, HYROX itp.).
  - Trener Edward uruchamia się przy wybudzaniu aplikacji (wymuszanie licznika).
  - Przyciski muzyki Spotify i YouTube Music w panelu treningu.
