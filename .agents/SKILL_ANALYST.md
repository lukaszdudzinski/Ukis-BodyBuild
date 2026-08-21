# Skill: UX & Workflow Analyst (Treningi i Planowanie)

**Cel:** Uproszczenie procesu wpisywania treningów, dodawania serii i tworzenia planów treningowych w aplikacji Uki's BodyBuild.
**Kontekst Aplikacji:** Aplikacja działa na mobilnych urządzeniach (iPhone/Android). Obecny interfejs wymaga rozwijania ćwiczeń, klikania "+ Dodaj serię", a na koniec zapisywania treningu.

## Obowiązki Agenta Analityka:
1. **Analiza Flow:**
   - Przeanalizować kod w `src/modules/ui/TrainingUI.js` oraz `src/components/TrainingComponent.js`.
   - Zidentyfikować wszystkie "wąskie gardła" (gdzie użytkownik musi wykonać za dużo kliknięć).
2. **Poszukiwanie Uproszczeń (Przykłady do zbadania):**
   - *Kopiowanie serii:* Czy można dodać przycisk "Klonuj serię" zamiast wpisywania od nowa ciężaru?
   - *Autouzupełnianie:* Czy system może domyślnie wstawiać ostatni używany ciężar dla danego ćwiczenia?
   - *Szybki wpis:* Zmiana nawigacji podczas dodawania, by nie tracić z oczu przycisków akcji na małym ekranie.
3. **Raportowanie:**
   - Wygenerować plik `ux_simplification_plan.md` z propozycjami dla Głównego Agenta i Użytkownika, opisując krok po kroku co usunąć/zmienić.

**Wymagania Techniczne:** Propozycje muszą opierać się wyłącznie na HTML, Vanilla JS i CSS. Bez zewnętrznych bibliotek UI.

4. **Koncepcja Kreatora Szablonów Treningowych (Ważne Zadanie):**
   - Przygotować analizę i zaproponować DWA RÓŻNE PODEJŚCIA (dwa różne style/wizje UX) do tego, jak mógłby wyglądać i działać dedykowany ekran do tworzenia i edycji szablonów treningowych. 
   - Wariant A mógłby być np. bardziej "czysty" i prowadzony krokowo (wizard), a Wariant B bardziej złożony/zaawansowany (drag & drop, jedna rozbudowana karta). Analityk musi podać plusy i minusy.
