---
description: Zasada dotycząca kończenia pracy nad zadaniami i przekazywania wiedzy pomiędzy agentami w projekcie Uki's BodyBuild.
---

# Imperatyw: Przekazanie Wiedzy (Hand-off Prompt)

Zasada ta jest **KRYTYCZNA** dla całego projektu Uki's BodyBuild.

Gdy jako Agent kończysz pracę nad przydzielonym zadaniem (niezależnie od tego czy jest to Faza projektu, naprawa pojedynczego błędu, czy dodanie nowej funkcji) i zamierzasz poinformować użytkownika, że praca jest skończona, **MUSISZ**:
1. Stworzyć dla użytkownika "hand-off prompt" (analogiczny prompt startowy dla kolejnego Agenta).
2. Hand-off ten MUSI zaczynać się od sekcji wylistowującej pliki projektowe, dokładnie w takim formacie:

```markdown
## TWOJE KLUCZOWE ZASOBY NA START (Koniecznie przeczytaj te pliki!):
- **`.agents/rules/PROJECT_STATE.md`** - Absolutna podstawa. Znajdziesz tam status z ostatniej iteracji i priorytety na teraz.
- **`.agents/CONVERSATIONS_JIRA.md`** - Znajdziesz tam historię naszych prac (m m.in. co zrobiono w poprzedniej konwersacji), abyś nie cofał już wdrożonych poprawek. Dopisz do niego swoje ID na końcu pracy.
- **`ROADMAP.md`** - Główne źródło prawdy o funkcjach biznesowych i merytorycznych.
- **`.agents/rules/pwa_rules.md`** - Krytyczne zasady działania PWA (baza OPFS, cache, system Updater).
- **`.agents/rules/core_imperative.md`** - Główne zasady, zakazy (np. format wersji bez kropki).
- **`.agents/rules/handoff.md`** - Instrukcja jak przekazać zadanie dalej (czyli to, co czytasz).
```

3. Pod tą sekcją musisz opisać dokładnie:
   - Co zostało zrobione w bieżącej sesji (i jakie było jej ID).
   - Co jest do zrobienia (plan implementacyjny / następne kroki).
4. Musisz przypomnieć nowemu agentowi, że on również będzie musiał wygenerować taki hand-off prompt na koniec swojej pracy.

# Imperatyw: Raportowanie Zmian (Changelog)

Zasada ta jest **KRYTYCZNA** przy zamykaniu każdego zadania.
- Zawsze, gdy modyfikujesz `CHANGELOG.json` lub publikujesz nową wersję, wpisy **NIE MOGĄ** brzmieć jak suche komunikaty techniczne typu "Poprawiono błąd", czy domyślne "Wydanie nowej wersji poprawkowej".
- Opisy zmian MUSZĄ być bogate, radosne, urozmaicone o emotikony i napisane w marketingowym, potocznym stylu (np. "🚀 Super Szybkie Aktualizacje", "💪 Ewolucja Treningów", "🛠️ Żelazna Baza Danych"). Wzoruj się na wcześniejszych wpisach w `CHANGELOG.json`!
- Użytkownik chce czuć, że aplikacja żyje i się rozwija. Pisz szczegółowo, konkretnie wyjaśniając korzyści dla formy i zdrowia.
