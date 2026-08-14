# Roadmapa Projektu - Uki's BodyBuild

Ten dokument służy jako główne źródło prawdy dla wszystkich planów biznesowych, pomysłów, i przyszłych funkcjonalności aplikacji Uki's BodyBuild. Dokument ten jest dzielony pomiędzy wszystkie sesje AI, aby nie utracić kontekstu.

## Faza Aktualna (W trakcie wdrażania)

### 1. Przebudowa Modułu Treningowego (Plany i Edycja Inline)
- **Cel:** Przekształcenie "Szablonów" w pełnoprawne "Plany Treningowe", które ułatwiają codzienny trening.
- **Funkcjonalności:**
  - Zmiana nazewnictwa w UI z "Szablony" na "Plany Treningowe".
  - **Edycja Inline i Checkboxy:** Po wczytaniu planu treningowego, wszystkie ćwiczenia, serie, ciężary i powtórzenia z ostatniego razu zostają skopiowane na ekran główny treningu. Użytkownik widzi je od razu rozwinięte z gotowymi polami (Ciężar x Powtórzenia).
  - Obok każdej serii znajduje się **Checkbox**. Zaznaczenie checkboxa oznacza wykonanie serii (podświetlenie na zielono/zgaszenie na szaro). 
  - Jeśli użytkownik chce zmienić ciężar lub liczbę powtórzeń w trakcie treningu, po prostu edytuje cyferki w polach tekstowych serii obok checkboxa, zamiast usuwać całą serię i dodawać nową.
  - Odróżnienie w Historii: Treningi, które są zapisane jako wzór Planu Treningowego, będą miały w Historii specjalną ikonkę (⭐ / 🏋️), co ułatwi ich znalezienie.
  - **Anulowanie Treningu:** Przycisk na dole trwającego treningu (obok Pauzy/Zakończ) pozwalający zrezygnować z rozpoczętej sesji (czyści brudnopis po potwierdzeniu w okienku modalnym).

### 2. Profesjonalny Asystent AI (Trener Edward)
- **Cel:** Zmiana tonu wypowiedzi z czysto humorystycznego na ekspercki, merytoryczny i analityczny.
- **Funkcjonalności:**
  - Zmiana Promptu systemowego: Trener analizuje objętość (liczba serii na partię mięśniową), tonaż całkowity i ewentualne sygnały przetrenowania.
  - Ocena doboru ćwiczeń (Split) oraz podsumowanie czasu regeneracji (sen, dni wolne).

### 3. Stabilizacja PWA
- **Cel:** Wyeliminowanie błędu, gdzie aplikacja po aktualizacji do nowszej wersji wciąż sugeruje instalację starszej. (Rozwiązane poprzez stałą synchronizację pliku CHANGELOG.json i usprawnienie `pwa-updater.js`).

---

## Faza Przyszła (Planowane)

### 4. Zaawansowane Zarządzanie Planami Treningowymi i Kalendarz
- **Cel:** Grupowanie treningów w wielodniowe programy i planowanie ich w czasie.
- **Scenariusz Biznesowy:** 
  - Użytkownik tworzy folder "Plan Masa Uki 1". W nim umieszcza "Sesja 1 (Klatka, Triceps)", "Sesja 2 (Plecy, Biceps)", "Sesja 3 (Nogi, Barki)".
  - Do każdego planu można dodać reprezentacyjne zdjęcie w tle.
  - **Kalendarz:** Użytkownik przypisuje Sesje do dni tygodnia (np. Sesja 1 -> Poniedziałek, Sesja 2 -> Środa). W głównym kalendarzu aplikacji pojawiają się pomarańczowe kropki dla zaplanowanych dni. Kropki zmieniają kolor na niebieski/zielony po zrealizowaniu treningu.
  
### 5. Monetyzacja ("Postaw Kawę") i Obejście Limitów API AI
- **Cel:** Limit zapytań AI (błąd 429 quota exceeded) staje się płatną barierą dla intensywnie korzystających użytkowników.
- **Scenariusz Biznesowy:**
  - Wersja darmowa korzysta ze wspólnego, darmowego klucza API Gemini (z nałożonymi limitami).
  - W aplikacji istnieje sekcja "Postaw Kawę na 30 dni".
  - Użytkownik wspiera twórców w serwisie zewnętrznym, a w zamian dostaje wygenerowane **Hasło Premium**.
  - Wpisuje Hasło w profilu, co daje mu nielimitowany lub wyższy dostęp na wybrany okres (np. używając komercyjnego klucza API zaszytego w Cloudflare Workerze).
  - Backend (Cloudflare Worker) weryfikuje to hasło i w przypadku zgodności, realizuje zapytania AI bez irytujących limitów.

### 6. Modularyzacja Architektury (Refaktoryzacja)
- **Cel:** Skrócenie głównych plików `index.html` oraz `main.js`.
- **Działania:** 
  - Utworzenie `ProfileUI.js`, `SettingsUI.js`.
  - Przeniesienie wszystkich powtarzających się modalów i systemów logowania błędów do osobnych serwisów (np. `ModalService.js`).
