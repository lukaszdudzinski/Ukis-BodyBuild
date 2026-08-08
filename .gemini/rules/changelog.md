# Zasady Tworzenia Changeloga ("Co Nowego")

Przy każdej aktualizacji wersji i modyfikacji pliku `CHANGELOG.json` należy ściśle przestrzegać poniższych zasad pisania opisów zmian:

1. **Język Marketingowy i Pozytywny Przekaz:** Opisy w changelogu MUSZĄ być pozytywne, entuzjastyczne i stanowić pochwałę wprowadzanych zmian. Należy unikać suchych terminów technicznych, takich jak "Wydanie nowej wersji poprawkowej" czy "Naprawiono bug w funkcji X".
2. **Szybkość Reakcji:** Należy podkreślać, że poprawki pojawiają się bardzo szybko i problemy zgłaszane przez użytkowników są rozwiązywane błyskawicznie.
3. **Wymagana Struktura i Emotikony:** ZAWSZE wzoruj się na starych wpisach. Struktura każdego punktu (bulletu) musi wyglądać następująco:
   `[Emoji] [Krótkie Chwytliwe Hasło]: [Opis korzyści/zmiany]`. 
   Przykłady: 
   - "🤖 Trener Edward 2.0: Inteligentny system reagujący na Twoje postępy!"
   - "🛠️ Krytyczna Poprawka: Szybko załataliśmy błąd powodujący crash przy superseriach!"
5. **Nigdy nie zostawiaj domyślnych tekstów ze skryptów release'ujących!** W razie puszczenia skryptu z wersją, ZAWSZE ręcznie zaktualizuj wygenerowany wpis w pliku CHANGELOG.json wg powyższych wytycznych.
