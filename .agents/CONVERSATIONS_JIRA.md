# Rejestr Konwersacji (Wewnętrzna Jira)

## Konwersacja (Obecna): 81d8d0fa-789f-443c-980e-de49ed502d2f
- **Temat**: ROADMAPA - Faza 3: Zaawansowana Analityka, Personalizacja i Atlas Mięśni.
- **Kluczowe Zmiany**:
  - Wdrożenie systemu Szablonów Treningowych (Zapisz / Załaduj szablon).
  - Dodanie kalkulatora 1RM do każdej wpisywanej serii oraz śledzenia Personal Records (PR) z reakcjami Trenera Edwarda.
  - Wprowadzenie prostej Mapy Ciała (Atlasu Mięśni) analizującej zmęczenie partii po treningach z ostatnich 48h.
  - Oczyszczenie SettingsUI.js z funkcji diagnostycznych, przeniesienie ich do nowego kafelka "Diagnostyka".
  - Zaktualizowano system PWA (twardy reset i usunięcie błędu Service Worker).
  - Aktualizacja PWA do wersji `v.2026.8.9.11` zgodnie ze "Złotą Zasadą Aktualizacji".
  - Poprawa stabilności testów Playwright (obsługa onboardingu v22).


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
