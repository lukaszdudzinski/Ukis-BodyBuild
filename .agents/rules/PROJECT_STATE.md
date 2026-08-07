# Aktualny Stan Projektu "Uki's BodyBuild"
**Zapisany przez Agenta (Antigravity):** Sierpień 2026 r. (v.2026.8.7.20)

## Najważniejsze imperatywy i zasady w projekcie (PRZECZYTAJ UWAŻNIE)
1. **Reguły PWA**: Patrz plik `pwa_rules.md`! Kategorycznie pilnuj procedury podbijania Cache_Name, by nie uwięzić przeglądarek Safari w zepsutym silniku. Nowy instalator zawsze musi zaktualizować swój adres po zmianie (w pliku `AppUI.js`, `sw.js` oraz w `CHANGELOG.json` gdzie tablica MUST mieć najnowszą wersję dokładnie odpowiadającą `APP_VERSION`, inaczej baner wpadnie w pętlę wywołań).
2. **Filozofia UX (Interaktywność)**: Zgodnie z wytycznymi, interfejs Kafelkowy oraz okienka Modalne mają być nowoczesne (Gradienty, Pulsowanie). Użytkownik nienawidzi przestarzałego UI. Pamiętaj o dbaniu o widoczność czcionek (ludzie słabo widzący trenują!).
3. **Plik `index.html`**: Aplikacja nie korzysta ze standardowych ładowań stron z serwera, ładujemy wszystko na żywo z jednego pliku `index.html`. Utrzymuj jego czystość wynosząc wielkie logiki (takie jak Changelog, Aktualizacje, Samouczek) do zewnętrznych małych modułów w `/src/modules/ui/*.js`.
4. **Bazy danych (IndexDB)**: Aplikacja używa lokalnej bazy danych. Wszelkie manipulowanie danymi treningowymi jest realizowane przez DatabaseManager / CalendarDB.

## Prace zrealizowane w najnowszych iteracjach:
- **Tonaż własnego ciała**: Pompki i podciągania przy obliczaniu "Volume" w analizie wliczają % masy ludzkiego ciała! (Moduł podpięty pod Treningi).
- **Asystent Głosowy Trener Edward**: Aplikacja mówi głosem. 
- **Zewnętrzne łączenia (Apple Watch / Smartwatch)**: Wpisywanie spalonych kalorii tuż pod koniec sesji w ekranie Finalizacji Treningu.
- **Odłączone okno "Co Nowego" & PWA Updater**: Logika wyprowadzona do plików `ChangelogUI.js` oraz `PWAUpdateUI.js`. Działa on asynchronicznie odświeżając system i wstrzykując powiadomienia w oparciu o różnice numeru wersji z `AppUI.js` i `CHANGELOG.json`.
- **Moduł Dymków "OnboardingTour" (Samouczek)**: Moduł ukryty wewnątrz `OnboardingUI.js`. Otwierany przy powitaniu nowych użytkowników z przypięciem dymków nawigacyjnych obliczanych po GetBoundingClientRect po DOM.

## Prace przekazywane i do realizacji dla nowej iteracji (Roadmapa):
Twoim zadaniem (Jako nowego Agenta, który właśnie wchodzi z tym promptem) będzie:
1. **Wdrożenie inteligentnych reakcji "Trenera Edwarda"**: Trener ma się odzywać do nas w trakcie treningu, np. po 15 sesji ("Jak Ci idzie, ćwiczysz czy w telefonie siedzisz?").
2. **Kalkulacje Kaloryczne ze smartwatcha**: Mają one uderzyć do sekcji Analiz (Wykresów). Użytkownik kazał to opracować by to sensownie wykorzystywać!
3. **Przetestowanie Dymków Samouczka**: Jeśli użytkownik na początku zażyczy sobie by dodać dymki w kolejne miejsca (np. "Kopiowanie Ciężaru"), dopisz to rozbudowując tablicę `steps` w `OnboardingUI.js`.
4. **Zarządzanie Kontekstem**: Pamiętaj, aby pilnować długości konwersacji. Bądź asertywny i sam informuj Użytkownika, kiedy konwersacja staje się zbyt długa i skomplikowana. Zawsze zaoferuj wtedy sporządzenie pełnego podsumowania prac i zaktualizowanie pliku `PROJECT_STATE.md`, aby płynnie przenieść kontekst do nowej sesji.

**Pamiętaj! Oszczędzaj plik `index.html`.** Twórz kod hermetyczny i weryfikuj po kroku na sucho z Nod'em błędy "Syntax", przed wdrożeniem przez `git push`. A teraz zapytaj Użytkownika co odhaczamy na dziś!
