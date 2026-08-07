# Aktualny Stan Projektu "Uki's BodyBuild"
**Zapisany przez Agenta (Antigravity):** Sierpień 2026 r. (v.2026.8.7.25)

## Najważniejsze imperatywy i zasady w projekcie (PRZECZYTAJ UWAŻNIE)
1. **Reguły PWA**: Patrz plik `pwa_rules.md`! Kategorycznie pilnuj procedury podbijania Cache_Name, by nie uwięzić przeglądarek Safari w zepsutym silniku. Nowy instalator zawsze musi zaktualizować swój adres po zmianie (w pliku `AppUI.js`, `sw.js` oraz w `CHANGELOG.json` gdzie tablica MUST mieć najnowszą wersję dokładnie odpowiadającą `APP_VERSION`, inaczej baner wpadnie w pętlę wywołań).
2. **Brak Regresji (Testy!)**: Kod musi być weryfikowany przed deployem. Użytkownik płaci za sprawną aplikację! Planowane jest wdrożenie testów E2E (Playwright), aby wyeliminować błędy typu "SyntaxError" czy przerywanie głównych funkcji (jak zmiana zakładek czy błędy w UI). 
3. **Zarządzanie Kontekstem**: Pamiętaj, aby pilnować długości konwersacji. Bądź asertywny i sam informuj Użytkownika, kiedy konwersacja staje się zbyt długa i skomplikowana. Zawsze zaoferuj wtedy sporządzenie pełnego podsumowania prac i zaktualizowanie pliku `PROJECT_STATE.md`, aby płynnie przenieść kontekst do nowej sesji.
4. **Plik `index.html`**: Aplikacja nie korzysta ze standardowych ładowań stron z serwera, ładujemy wszystko na żywo z jednego pliku `index.html`. Utrzymuj jego czystość wynosząc wielkie logiki do zewnętrznych małych modułów w `/src/modules/ui/*.js`.
5. **Filozofia UX (Interaktywność)**: Zgodnie z wytycznymi, interfejs ma być nowoczesny (Gradienty, Liquid Glass). Użytkownik ceni piękne i eleganckie rzeczy (jak np. w najnowszym Samouczku).

## Prace zrealizowane w najnowszych iteracjach (do v.2026.8.7.28):
- **Wdrożenie inteligentnych reakcji "Trenera Edwarda"**: Trener reaguje dymkami kontekstowymi po zakończeniu pierwszego oraz co siódmego treningu, a także przypomina o regeneracji.
- **Tutorial Kontekstowy**: Obecny ciemny samouczek zastąpiono mądrym, responsywnym systemem pop-upów (Edwarda) uruchamianym przy pierwszym wejściu w Diety i Treningi. Ekran startowy pyta jedynie o Nick.
- **Przepisanie starych testów E2E**: Testy (`analytics.spec.js`, `training.spec.js`) używają selektorów paska nawigacji (`a[data-tab]`) zgodnych z najnowszym widokiem.
- **Moduł Dymków "OnboardingTour" (Samouczek)**: Całkowicie przebudowany na styl "Liquid Glass", z poprawioną logiką podświetlania (użycie `clip-path` do precyzyjnego wycinania tła).
- **Naprawa historii treningów**: Przycisk usuwania w kalendarzu ponownie odświeża widok asynchronicznie po usunięciu z IndexedDB (`TrainingUI.loadHistoryAndCalendar`).
- **Tonaż własnego ciała**: Pompki i podciągania przy obliczaniu "Volume" w analizie wliczają % masy ludzkiego ciała! (Moduł podpięty pod Treningi).
- **Zewnętrzne łączenia (Apple Watch / Smartwatch)**: Wpisywanie spalonych kalorii tuż pod koniec sesji w ekranie Finalizacji Treningu (poprawiono też overflow na małych ekranach: dodano box-sizing).
- **Global Safeguard dla PWA Updater**: Z powodu groźnego SyntaxError, który zamroził aplikację i uniemożliwił pobranie aktualizacji, **PWA Updater został całkowicie wyizolowany z modułów ES6**.

## Problemy NA JUŻ (Do rozwiązania w nowej konwersacji):
1. **Kalkulacje Kaloryczne ze smartwatcha**: Mają one ostatecznie uderzyć do sekcji Analiz (Wykresów), by łączyć się z postępami.

## Przekazanie dla nowej iteracji (Roadmapa dla Agenta):
Twoim zadaniem (Jako nowego Agenta, który właśnie wchodzi z tym promptem) będzie zrealizowanie nowej koncepcji **Tutoriala Kontekstowego** krok po kroku oraz wplecenie w to mądrych uwag Trenera Edwarda. Na samym końcu zbuduj do tego dedykowane, małe testy E2E, byśmy mieli pewność, że wszystko pięknie działa.
