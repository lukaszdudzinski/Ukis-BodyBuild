# Aktualny Stan Projektu "Uki's BodyBuild"
**Zapisany przez Agenta (Antigravity):** Sierpień 2026 r. (v2026.8.13.02)

## Najważniejsze imperatywy i zasady w projekcie (PRZECZYTAJ UWAŻNIE)
1. **Reguły PWA**: Patrz plik `pwa_rules.md`! Kategorycznie pilnuj procedury podbijania Cache_Name, by nie uwięzić przeglądarek Safari w zepsutym silniku. Nowy instalator zawsze musi zaktualizować swój adres po zmianie (w pliku `AppUI.js`, `sw.js` oraz w `CHANGELOG.json` gdzie tablica MUST mieć najnowszą wersję dokładnie odpowiadającą `APP_VERSION`, inaczej baner wpadnie w pętlę wywołań).
2. **Brak Regresji (Testy!)**: Kod musi być weryfikowany przed deployem. Użytkownik płaci za sprawną aplikację! Planowane jest wdrożenie testów E2E (Playwright), aby wyeliminować błędy typu "SyntaxError" czy przerywanie głównych funkcji (jak zmiana zakładek czy błędy w UI). 
3. **Zarządzanie Kontekstem**: Pamiętaj, aby pilnować długości konwersacji. Bądź asertywny i sam informuj Użytkownika, kiedy konwersacja staje się zbyt długa i skomplikowana. Zawsze zaoferuj wtedy sporządzenie pełnego podsumowania prac i zaktualizowanie pliku `PROJECT_STATE.md`, aby płynnie przenieść kontekst do nowej sesji.
4. **Plik `index.html`**: Aplikacja nie korzysta ze standardowych ładowań stron z serwera, ładujemy wszystko na żywo z jednego pliku `index.html`. Utrzymuj jego czystość wynosząc wielkie logiki do zewnętrznych małych modułów w `/src/modules/ui/*.js`.
5. **Filozofia UX (Interaktywność)**: Zgodnie z wytycznymi, interfejs ma być nowoczesny (Gradienty, Liquid Glass). Użytkownik ceni piękne i eleganckie rzeczy (jak np. w najnowszym Samouczku).
6. **Rejestr Konwersacji (Wewnętrzna Jira)**: Na koniec każdej fazy/konwersacji Agent MUSI uaktualnić plik `.agents/CONVERSATIONS_JIRA.md`, dopisując ID swojej konwersacji oraz zwięzłe podsumowanie wykonanych prac i wdrożonych założeń. Po uaktualnieniu Jiry, Agent musi przygotować "paczkę informacyjną" (prompt przekazania) dla następnego Agenta, zawierającą m.in. ID właśnie zakończonej konwersacji, aby zachować ciągłość prac na Roadmapie.

## Prace zrealizowane w najnowszych iteracjach (do v.2026.8.14.06 - Koniec Fazy 5.2):
- **Eksport/Import JSON**: Zbudowano system pozwalający przekazać swój trening innej osobie oraz wyeksportować całą bazę dla bezpieczeństwa (naprawiono błąd exportDatabase w Diagnostyce).
- **AiAnalyticsEngine (Trener Edward)**: Naprawiono błędy limitów 429 (Quota Exceeded) by wyświetlać przyjazne komunikaty. Zintegrowano "Staż Treningowy" z Profilem (aby prompt AI był celniejszy). Dodano opcję pobierania raportów analizy jako plik `.txt`. Ustawiono sztywną regułę dla AI, by plany naprawcze generowane były "w punktach".
- **Szablony Treningowe -> Plany Treningowe**: Dodano opcję zapisywania odbytych treningów prosto z historii jako nowe Szablony ('Zapisz jako plan treningowy').
- **UX i Interfejs**: Powiększono czcionki i inputy (`.training-input-large`) w aktywnym treningu dla lepszej czytelności podczas ćwiczeń (jak prosił użytkownik).
- **Podgląd Historii**: Dodano wygodny przycisk 'Podgląd' (Modal window) przy odbytych treningach w kalendarzu, by podejrzeć parametry bez wchodzenia w szczegółowy widok historii.
- **Wydajność / PWA**: Zaimplementowano bezwzględne reguły wersji (Cache). Aktualizacja APP_VERSION i CACHE_NAME działa sprawnie, nie więżąc użytkowników w nieskończonych pętlach instalacji.

## Wytyczne dla Agenta (Reguły Customizacji - 'Imperatywy'):
- **Gdzie Agent powinien czytać/zapisywać reguły zachowania?** W ekosystemie Antigravity możesz (jako użytkownik) dopisać zasady w `.agents/rules/core_imperative.md`. Agent przy każdym wejściu do projektu przeczyta ten plik i zastosuje jego wytyczne (np. to, by pisać bogate logi w CHANGELOG.json).

## Problemy NA JUŻ (Do rozwiązania w kolejnych iteracjach):
1. Dalsza poprawa testów automatycznych, by objęły nowe funkcje (np. generowanie podglądu, modal, zapisy raportów w .txt).
2. Dalsza orkiestracja agentów przy testach i wdrażaniu nowości (Subagenci).
