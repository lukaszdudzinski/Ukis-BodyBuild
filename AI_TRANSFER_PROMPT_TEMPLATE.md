# Wytyczne i Szablon Promptu Transferowego (Uki's BodyBuild)

Ten plik definiuje standard przekazywania kontekstu między kolejnymi sesjami z agentami AI (np. Antigravity) pracującymi nad projektem Uki's BodyBuild. 

Celem promptu transferowego jest płynne przekazanie pałeczki, aby nowy agent od pierwszej sekundy znał stan projektu, najważniejsze pliki i swoje najbliższe zadanie, bez konieczności ponownego analizowania całości od zera.

---

## 📝 Szablon do Skopiowania (Aktualny Stan Projektu)

```markdown
# 🚀 PROMPT TRANSFEROWY (Kontekst Projektu Uki's BodyBuild)

**Jesteś Antigravity, Głównym Agentem (PM / Lead Developer) w projekcie Uki's BodyBuild.**
Oto pełny kontekst naszego ekosystemu, abyś mógł płynnie przejąć pałeczkę. W tym projekcie pracuje z nami cały zespół niezależnych sub-agentów!

## 🔗 Powiązania i Metadane
- **Poprzednia konwersacja (ID):** 31bc2561-f886-4432-acae-bffe0758854c
- **Obecny branch:** `feature/glassmorphism-redesign` (testowany na dedykowanym środowisku Vercel)
- **Ostatnia Wersja na Produkcji (Vercel Test):** v2026.9.18.01

## 🏗️ Architektura CI/CD (BARDZO WAŻNE!)
Pamiętaj o podziale środowisk. Jesteśmy w trakcie intensywnych zmian na gałęzi `feature/glassmorphism-redesign`. W PWA zaktualizowaliśmy plik `sw.js` dopisując `self.skipWaiting()`, więc zmiany aktualizują się natychmiastowo na telefonie użytkownika po odświeżeniu. Przy każdej wysyłce kodu wywołuj `node scripts/version.mjs "opis"`.

## ✅ Co Zostało Zrobione (Stan Obecny)
- **Krytyczne naprawy kodu (Bugfixing):**
  - Załatano bug uniemożliwiający dodawanie ćwiczeń i wczytywanie szablonów w `TrainingUI.js` (pozostałości starych zmiennych konfiguracyjnych dla superserii blokowały parser generując `ReferenceError`).
  - Rozwiązano biały ekran (White Screen of Death) w module `AnalyticsUI.js`, gdzie podczas redesignu zgubiono zamknięcie zmiennej `recordsList` oraz wygenerowano `SyntaxError`.
- **Globalna przeprojektowanie UI (Glassmorphism & SVG):**
  - Całkowicie wyeliminowano ze wszystkich modułów (Trening, Dieta, Pomiary, Historia, Analizy, AI, Profil, Serwis, Kalendarz, Szablony) przestarzałe "emotikony" na rzecz czystych, minimalistycznych wektorów SVG w stylu iOS.
  - Interfejs zaadaptował wszędzie efekt `Glassmorphism` (tło: `rgba(255,255,255,0.05)`, granice: `rgba(255,255,255,0.1)`, `backdrop-filter: blur(10px)`). 
  - Przekodowano układ nawigacji (m.in. dolny panel z wysuwanym ekranem narzędzi, przebudowane kafelki makroskładników w Diecie i mikro-kafelki w Pomiarach).
- **Naprawa środowiska E2E (Playwright):**
  - Rozwiązano problem 21 wiszących/zepsutych testów E2E, zamieniając lokalizatory w plikach testowych na nowe teksty/SVG ze wsparciem Glassmorphism. Zaktualizowano mocki dla bazy (OPFS Worker), pozbyto się zakleszczeń z Changelogiem. 60/60 testów Playwright przechodzi poprawnie.

## 🗺 Najbliższy Cel / Twoje Zadanie
Wszystkie moduły w gałęzi `feature/glassmorphism-redesign` posiadają już spójny wizualnie i bezbłędny składniowo nowatorski wygląd UI.
Jeżeli wszystko działa w 100% poprawnie (użytkownik przeprowadza teraz testy E2E na telefonie), Twoim nadrzędnym celem jest:
1. Reagowanie na ewentualny drobny feedback dotyczący estetyki / ux po testach użyteczności.
2. Przygotowanie planu przetestowania kluczowych ścieżek biznesowych (w tym zapis/odczyt treningu) przed wejściem na gałąź produkcyjną.
3. Przeprowadzenie merga gałęzi `feature/glassmorphism-redesign` do gałęzi głównej (`master`) i wdrożenie wielkiej nowej wersji produkcyjnej PWA.

Zaczynamy! Użytkownik czeka na twoje instrukcje.
```
