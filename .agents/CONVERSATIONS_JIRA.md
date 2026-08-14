# Rejestr Konwersacji (Wewnętrzna Jira)

## Konwersacja (Obecna): 10b60446-8dba-4bf9-847f-283850fa05a5
- **Temat**: ROADMAPA - Faza 5.2: Nowe funkcje Historii, Profilu i Trenera Edwarda.
- **Kluczowe Zmiany (Zakończone)**:
  - Naprawiono eksport danych (metoda `exportDatabase`) z poziomu panelu Diagnostyki.
  - Wyeliminowano błędy wyczerpania limitu (Quota / 429) w AiAnalyticsEngine oraz DietAIEngine.
  - Zaimplementowano powiększone czcionki (Large Input) dla pól "kg" i "powt" podczas wprowadzania serii na ekranie treningu.
  - W kalendarzu przy zakończonych treningach dodano opcję "🔍 Podgląd", wyświetlającą szczegółowy Modal bez ruszania aktywnego trybu treningu.
  - Dodano możliwość zapisu wcześniejszego treningu z Historii jako szablon ("📝 Zapisz jako plan treningowy").
  - Rozbudowano Profil Użytkownika o wybór "Stażu Treningowego", który trafia wprost do promptów Trenera Edwarda.
  - Raporty analiz wygenerowane przez Trenera Edwarda otrzymały funkcję pobierania do dysku ("💾 TXT").
  - Zaktualizowano `CHANGELOG.json` wprowadzając obiecane bogate opisy dla `v2026.8.14.06`.
- **Wytyczne Customizacji (Dla kolejnego Agenta / Użytkownika)**:
  - Zgodnie z systemem **Antigravity Customization System** (szczegóły w `agy-customizations`), można dodawać własne sztywne wytyczne co do zachowania. Projekt ma już folder `.agents/rules/` i polecamy wpisać wymagania o bogatym opisie aktualizacji do `.agents/rules/core_imperative.md`.
## Konwersacja (Obecna): 347c3dc8-6407-44a6-a907-9375ef41b290
- **Temat**: ROADMAPA - Faza 4.6: Profesjonalizacja AI (Trener Edward), Szablony Treningowe, Checkboxy i Kopia Zapasowa.
- **Kluczowe Zmiany (Zakończone)**:
  - Naprawiono eksport danych (zła nazwa metody `exportDataJSON` oraz błąd z `a.click` na urządzeniach mobilnych).
  - Wdrożono Checkboxy (oznaczanie wykonanych serii) i Edycję Inline przy rozpoczynaniu gotowych "Szablonów" treningowych.
  - Podniesiono profesjonalizm Trenera Edwarda (AI analizuje tonaż, objętość, sen, cel treningowy i 5 ostatnich obwodów by określić kierunek postępów użytkownika).
  - Utworzono dokument `ROADMAP.md` jako źródło prawdy dla dalszych prac.
- **Kluczowe Zmiany (Do wdrożenia przez kolejnego Agenta)**:
  - Przycisk "Zapisz jako plan treningowy" na ekranie wykonanego treningu w zakładce Historia.
  - Przycisk "Pokaż / Podgląd" w zakładce Kalendarza, by móc wyświetlić trening w trybie tylko do odczytu bez wznawiania trybu wpisywania serii.
  - Zbieranie i przekazywanie poziomu zaawansowania do Trenera Edwarda (zapisywane w SettingsUI).
  - Powiększone czcionki wyświetlające kilogramy i powtórzenia podczas trwającego treningu.
  - Zapisywanie analiz AI (Trenera Edwarda) do pliku tekstowego na dysku użytkownika.
## Konwersacja: b37122c4-ebbb-4fd6-a9dd-6a40db267a7d
- **Temat**: ROADMAPA - Faza 4.5: Łatanie błędów, stabilizacja i testy przed Orkiestracją.
- **Kluczowe Zmiany**:
  - Naprawiono testy E2E (Playwright) po rozbiciu `AppUI` i `SettingsUI` na niezależne moduły ES6.
  - Naprawiono fałszywy błąd "Brak zdjęcia lub tekstu" przy użyciu Trenera Edwarda z poziomu "Analiza Diety AI" (kalkulator AI wymagał wysłania chociaż kawałka kontekstu lub obrazu).
  - Wdrożono jednolity, duży rozmiar czcionek w ustawieniach i polach formularzy (Profile, Pomiary, Cele TDEE).
  - Załatano irytujący scroll w kalendarzu po otwarciu ekranu Treningi.
  - Wyeksponowano z powrotem funkcje udostępniania na zewnątrz modułów, przywracając "Pochwal się odznakami".

## Konwersacja: 81d8d0fa-789f-443c-980e-de49ed502d2f
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
