---
description: Zasada dotycząca kończenia pracy nad zadaniami i przekazywania wiedzy pomiędzy agentami w projekcie Uki's BodyBuild.
---

# Imperatyw: Przekazanie Wiedzy (Hand-off Prompt)

Zasada ta jest **KRYTYCZNA** dla całego projektu Uki's BodyBuild.

Gdy jako Agent kończysz pracę nad przydzielonym zadaniem (niezależnie od tego czy jest to Faza projektu, naprawa pojedynczego błędu, czy dodanie nowej funkcji) i zamierzasz poinformować użytkownika, że praca jest skończona, **MUSISZ**:
1. Stworzyć dla użytkownika "hand-off prompt" (analogiczny prompt dla kolejnego Agenta).
2. Ten prompt musi zawierać dokładne informacje o tym, co zostało zrobione, w jakim celu, z jakiego miejsca projektu zaczynamy (odniesienie do pliku `.agents/CONVERSATIONS_JIRA.md`) oraz jakie jest ID twojej (czyli bieżącej) konwersacji, by nowy agent mógł się do niej odnieść.
3. Musisz przypomnieć nowemu agentowi w tym prompcie, że również będzie musiał wygenerować taki hand-off prompt, gdy będzie kończył swoje zadanie w przyszłości.

Każda iteracja w tym projekcie MUST kończyć się wygenerowaniem dla Użytkownika gotowego do skopiowania bloku tekstu z promptem przekazania pałeczki.

# Imperatyw: Raportowanie Zmian (Changelog)

Zasada ta jest **KRYTYCZNA** przy zamykaniu każdego zadania.
- Zawsze, gdy modyfikujesz `CHANGELOG.json` lub publikujesz nową wersję, wpisy **NIE MOGĄ** brzmieć jak suche komunikaty techniczne typu "Poprawiono błąd", czy domyślne "Wydanie nowej wersji poprawkowej".
- Opisy zmian MUSZĄ być bogate, radosne, urozmaicone o emotikony i napisane w marketingowym, potocznym stylu (np. "🚀 Super Szybkie Aktualizacje", "💪 Ewolucja Treningów", "🛠️ Żelazna Baza Danych"). Wzoruj się na wcześniejszych wpisach w `CHANGELOG.json`!
- Użytkownik chce czuć, że aplikacja żyje i się rozwija. Pisz szczegółowo, konkretnie wyjaśniając korzyści dla formy i zdrowia.
