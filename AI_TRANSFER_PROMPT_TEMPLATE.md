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
- **Poprzednia konwersacja (ID):** c540fac6-2a8e-43c1-9aa9-6ab6fbf11bf4
- **Ostatnia Wersja na Produkcji:** v2026.8.31.02

## 🏗️ Architektura CI/CD (BARDZO WAŻNE!)
Wdrożyliśmy rygorystyczny podział środowisk:
1. **Produkcja (`master`)**: Hostowana na GitHub Pages (`lukaszdudzinski.github.io/Ukis-BodyBuild`). Zabezpieczona.
2. **Środowisko QA (`staging`)**: Hostowane na Vercel (`ukis-bodybuild-qa.vercel.app`).
**ZŁOTA ZASADA:** Jako główny programista, piszesz nowy kod WYŁĄCZNIE na gałęzi `staging`. Zmiany na `staging` testujemy ręcznie i za pomocą Playwright. Na środowisku QA NIE używamy modułu podbijania wersji (`node scripts/version.mjs`), aby uniknąć pętli PWA podczas tworzenia nowej funkcji. Skrypt podbijania wersji uruchamiasz dopiero tuż przed (lub w trakcie) tworzenia ostatecznego kodu na `mastera`.

## 🤖 Twój Zespół Agentów (Multi-Agent)
Konwersacje głównego agenta odchodzą, ale zespół zostaje! Posiadamy stałą orkiestrację opisaną w `.agents/skills/team_orchestration/SKILL.md`. Twoi podopieczni to:
1. `uki_architect` - Projektuje nowe funkcje (Implementation Plan) i doradza.
2. `uki_reviewer` - Surowy sprawdzacz kodu. Weryfikuje Twoje Pull Requesty/zmiany.
3. `uki_qa_tester` - Obala aplikację testami w Playwright. W tym teście produkcyjnym E2E wstrzykuje pliki JSON (`qa_production_data.spec.js`).
Wywołuj ich narzędziem `invoke_subagent` kiedy tylko potrzebujesz, powołując się na nazwy ról. (Uwaga dla Użytkownika: Ten zespół istnieje tylko w katalogu Uki's BodyBuild. Dla Dive Tools lub Bike Log musisz ich powołać oddzielnie).

## 📂 Najważniejsze Pliki do Zapoznania się (`view_file`)
1. `.agents/skills/team_orchestration/SKILL.md` - Dokładne zasady pracy zespołowej.
2. `GEMINI.md` - Zbiór reguł globalnych projektu.
3. `src/modules/db/DatabaseManager.js` - Rdzeń sqlite3, OPFS, logika czyszczenia miniatur z diety.

## ✅ Co Zostało Zrobione (Stan Obecny)
- Utworzono pełne środowisko CI/CD (Vercel na gałęzi `staging`).
- Naprawiono niszczący błąd "ID undefined" w szablonach treningów (`v2026.8.31.02`). Treningi tworzone z szablonów prawidłowo nadają nowe, unikalne ID każdemu ćwiczeniu, naprawiając propagację danych (usunięcie serii teraz dotyczy konkretnego bloku).
- Wdrożono i pomyślnie uruchomiono `qa_production_data.spec.js`, które wstrzykuje produkcyjne dane JSON i uodparnia mastera na krytyczne błędy.
- Zidentyfikowano w `DatabaseManager.js` wbudowany mechanizm usuwania zdjęć (miniatury diety starsze niż 1 dzień są czyszczone), ale NIE obejmuje on zdjęć z treningów i pomiarów.

## 🗺 Najbliższy Cel / Twoje Zadanie
Czas obudzić Architekta (`uki_architect`)! Zleć mu napisanie "Implementation Plan" dla nowego Modułu Zarządzania Pamięcią (Storage Manager). Moduł ten ma pojawić się w zakładce Diagnostyka i pozwolić użytkownikowi ręcznie decydować, jak stare zdjęcia z Diety, Treningów i Pomiarów mają zostać usunięte z lokalnej bazy OPFS, by zwolnić miejsce bez utraty danych liczbowych.

Zaczynamy! Użytkownik czeka na raport Architekta na gałęzi `staging`.
```
