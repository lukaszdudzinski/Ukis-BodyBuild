# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: trainingHistory.spec.js >> Training and History Flow >> should create a training session and verify it appears in history
- Location: tests/e2e/trainingHistory.spec.js:9:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("+ Seria")').nth(1)
    - locator resolved to <button onclick="window.TrainingUI.addSet('1788023263210', false)">+ Seria</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <li>🐛 Naprawa błędu z szablonami treningów (brak możl…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div id="changelog-modal-overlay">…</div> intercepts pointer events
  - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <li>🖼 Dieta: Naprawiono ładowanie miniatur z bazy Med…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  2 × retrying click action
      - waiting 100ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="changelog-modal-overlay">…</div> intercepts pointer events
  13 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div id="changelog-modal-overlay">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <li>🖼 Dieta: Naprawiono ładowanie miniatur z bazy Med…</li> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div id="changelog-modal-overlay">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div id="changelog-modal-overlay">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic "Powrót do ekranu startowego" [ref=e4] [cursor=pointer]:
        - img "Logo" [ref=e5]
        - heading "Uki's BodyBuild" [level=1] [ref=e6]
      - list [ref=e7]:
        - listitem [ref=e8]:
          - link "Pulpit Główny" [ref=e9] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e10]:
          - link "Pomiary Ciała" [ref=e11] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e12]:
          - link "Trening" [ref=e13] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e14]:
          - link "Historia Treningów" [ref=e15] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e16]:
          - link "Analiza Progresu" [ref=e17] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e18]:
          - link "Dieta i Żywienie" [ref=e19] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e20]:
          - link "Diagnostyka" [ref=e21] [cursor=pointer]:
            - /url: "#"
        - listitem [ref=e22]:
          - link "Profil i Ustawienia" [ref=e23] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e24]:
        - link [ref=e26] [cursor=pointer]:
          - /url: https://suppi.pl/ukidives
          - text: ☕ Podoba Ci się to narzędzie?
          - strong [ref=e27]: Postaw mi kawę!
        - generic [ref=e28]: Trial (7 dni) v2026.8.29.01
    - main [ref=e29]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - heading "Trening" [level=2] [ref=e33]
          - paragraph [ref=e34]: Zaplanuj i wykonuj treningi
        - generic [ref=e35]:
          - textbox "NAZWA Treningu (opcjonalnie)" [ref=e37]: Trening siłowy test
          - combobox [ref=e39] [cursor=pointer]:
            - option "Trening Siłowy" [selected]
            - option "Cardio"
            - option "Zajęcia Zorganizowane"
          - generic [ref=e40]:
            - 'heading "Czas trwania: 00:00:29" [level=3] [ref=e41]'
            - generic [ref=e43] [cursor=pointer]:
              - checkbox "Wpisz czas treningu ręcznie" [ref=e44]
              - text: Wpisz czas treningu ręcznie
          - generic [ref=e45]:
            - heading "Bieżące ćwiczenia" [level=4] [ref=e46]
            - generic [ref=e47]:
              - generic [ref=e48]:
                - generic [ref=e50]:
                  - button "🏋️ Siłowe" [ref=e51] [cursor=pointer]:
                    - generic [ref=e52]: 🏋️
                    - generic [ref=e53]: Siłowe
                  - textbox "Wpisz nazwę..." [ref=e54]: Wyciskanie sztangi leżąc
                  - button "📚 Katalog" [ref=e55] [cursor=pointer]:
                    - text: 📚
                    - generic [ref=e56]: Katalog
                - generic [ref=e57]: 📷 Zrób zdjęcie maszyny
                - generic [ref=e59]:
                  - generic [ref=e60]:
                    - generic [ref=e61]:
                      - generic [ref=e62]:
                        - checkbox [ref=e63] [cursor=pointer]
                        - generic [ref=e64]: "Seria 1:"
                      - generic [ref=e65]:
                        - spinbutton [ref=e66]: "85"
                        - generic [ref=e67]: kg
                        - generic [ref=e68]: x
                        - spinbutton [ref=e69]: "10"
                      - button "×" [ref=e70] [cursor=pointer]
                    - generic [ref=e71]:
                      - generic [ref=e72]: 🏆 Rekord!
                      - generic [ref=e73]: "(Max: ~113 kg)"
                  - generic [ref=e74]:
                    - generic [ref=e75]:
                      - generic [ref=e76]:
                        - checkbox [ref=e77] [cursor=pointer]
                        - generic [ref=e78]: "Seria 2:"
                      - generic [ref=e79]:
                        - spinbutton [ref=e80]: "90"
                        - generic [ref=e81]: kg
                        - generic [ref=e82]: x
                        - spinbutton [ref=e83]: "8"
                      - button "×" [ref=e84] [cursor=pointer]
                    - generic [ref=e85]:
                      - generic [ref=e86]: 🏆 Rekord!
                      - generic [ref=e87]: "(Max: ~114 kg)"
                - generic [ref=e88]:
                  - spinbutton "kg" [ref=e90]
                  - generic [ref=e91]: X
                  - spinbutton "powt" [ref=e92]
                - generic [ref=e93]:
                  - button "+ Seria" [ref=e94] [cursor=pointer]
                  - button "🔥 Dropset" [ref=e95] [cursor=pointer]
                - generic [ref=e97] [cursor=pointer]:
                  - checkbox "Skopiuj dane z poprzedniej serii" [ref=e98]
                  - text: Skopiuj dane z poprzedniej serii
              - generic [ref=e99]:
                - generic [ref=e101]:
                  - button "🏋️ Siłowe" [ref=e102] [cursor=pointer]:
                    - generic [ref=e103]: 🏋️
                    - generic [ref=e104]: Siłowe
                  - textbox "Wpisz nazwę..." [ref=e105]: Wyciskanie skośne
                  - button "📚 Katalog" [ref=e106] [cursor=pointer]:
                    - text: 📚
                    - generic [ref=e107]: Katalog
                - generic [ref=e108]: 📷 Zrób zdjęcie maszyny
                - generic [ref=e110]:
                  - spinbutton "kg" [ref=e112]
                  - generic [ref=e113]: X
                  - spinbutton "powt" [active] [ref=e114]: "15"
                - generic [ref=e115]:
                  - button "+ Seria" [ref=e116] [cursor=pointer]
                  - button "🔥 Dropset" [ref=e117] [cursor=pointer]
                - generic [ref=e119] [cursor=pointer]:
                  - checkbox "Skopiuj dane z poprzedniej serii" [ref=e120]
                  - text: Skopiuj dane z poprzedniej serii
            - generic [ref=e121]:
              - button "+ Dodaj ćwiczenie" [ref=e122] [cursor=pointer]
              - button "🔗 Dodaj Superserię" [ref=e123] [cursor=pointer]
          - generic [ref=e124]:
            - heading "📸 Zdjęcia z treningu" [level=4] [ref=e125]
            - paragraph [ref=e126]: Dodaj foty by wleciały jako tło w Raportach Progresu!
            - generic [ref=e127]: +
          - generic [ref=e130]:
            - heading "⌚ Dane ze smartwatcha" [level=4] [ref=e131]
            - generic [ref=e132]:
              - generic [ref=e133]:
                - text: Kalorie Aktywności
                - spinbutton "kcal" [ref=e134]
              - generic [ref=e135]:
                - text: Średnie Tętno
                - spinbutton "bpm" [ref=e136]
          - generic [ref=e137]:
            - button "💾 Zapisz jako Plan Treningowy" [ref=e138] [cursor=pointer]
            - generic [ref=e139]:
              - button "⏸ Pauza" [ref=e140] [cursor=pointer]
              - button "❌ Anuluj" [ref=e141] [cursor=pointer]
            - button "⏹ Zakończ Trening" [ref=e142] [cursor=pointer]
  - text: ✕
  - generic [ref=e144]:
    - generic [ref=e145]:
      - heading "Co nowego? 🚀" [level=3] [ref=e146]
      - button "×" [ref=e147] [cursor=pointer]
    - generic [ref=e149]:
      - generic [ref=e150]:
        - heading "Wersja v2026.8.29.01 (2026-08-29)" [level=4] [ref=e151]
        - list [ref=e152]:
          - listitem [ref=e153]: "🔥 Krytyczny pożar ugaszony: zrzut RAM do OPFS po każdej operacji"
          - listitem [ref=e154]: 🛟 Wdrożono moduł BackupUI z przypomnieniem JSON
          - listitem [ref=e155]: "🐛 Treningi: Naprawiono błędne ładowanie szablonu przy nowej sesji"
          - listitem [ref=e156]: "🐛 Treningi: Naprawiono błąd dodawania nowych serii"
          - listitem [ref=e157]: "🖼 Dieta: Naprawiono ładowanie miniatur z bazy MediaManager"
      - generic [ref=e158]:
        - heading "Wersja v2026.8.28.01 (2026-08-28)" [level=4] [ref=e159]
        - list [ref=e160]:
          - listitem [ref=e161]: 🐛 Naprawa błędu z szablonami treningów (brak możliwości dodawania serii po użyciu szablonu).\n🐛 Naprawa wyświetlania miniatur zdjęć w widoku Diety.\n📦 Dodano system przypomnień o codziennym archiwum bazy danych (BackupUI).\n🧹 Uporządkowano zakładkę Diagnostyka, ukrywając groźne funkcje RAW.
      - generic [ref=e162]:
        - heading "Wersja v2026.8.27.10 (2026-08-27)" [level=4] [ref=e163]
        - list [ref=e164]:
          - listitem [ref=e165]: 🐛 Naprawa utraty danych na iOS Safari (brak nagłówków COOP/COEP blokował tryb OPFS). Dodano ręczny system automatycznego zapisu i odczytu bazy OPFS z pamięci RAM.
      - generic [ref=e166]:
        - heading "Wersja v2026.8.27.09 (2026-08-27)" [level=4] [ref=e167]
        - list [ref=e168]:
          - listitem [ref=e169]: 🐛 Krytyczna naprawa błędu "Invalid bind type", który odrzucał import bazy danych (JSON) zawierający pola "undefined". Wersja kuloodporna.
      - generic [ref=e170]:
        - heading "Wersja v2026.8.27.08 (2026-08-27)" [level=4] [ref=e171]
        - list [ref=e172]:
          - listitem [ref=e173]: 🐛 Naprawa błędu składni (SyntaxError) w silniku bazy danych dbWorker.js, który blokował import danych.
      - generic [ref=e174]:
        - heading "Wersja v2026.8.27.07 (2026-08-27)" [level=4] [ref=e175]
        - list [ref=e176]:
          - listitem [ref=e177]: 🐛 Naprawa literówki (SyntaxError) w module Diagnostyki, która blokowała ładowanie aplikacji na ekranie powitalnym.
      - generic [ref=e178]:
        - heading "Wersja v2026.8.27.06 (2026-08-27)" [level=4] [ref=e179]
        - list [ref=e180]:
          - listitem [ref=e181]: 🐛 Usunięto błąd zawieszający aplikację na ekranie startowym (konflikt modułu SQLite z iOS Safari w głównym wątku). Stabilne działanie na iOS przywrócone.
      - generic [ref=e182]:
        - heading "Wersja v2026.8.27.05 (2026-08-27)" [level=4] [ref=e183]
        - list [ref=e184]:
          - listitem [ref=e185]: 🚀 Wdrożono automatyczny migrator bazy danych z LocalStorage (kvvfs) do OPFS (Baza 2.0). Wszyscy dotychczasowi użytkownicy odzyskają dostęp do swoich danych przy pierwszym uruchomieniu nowej wersji!
      - generic [ref=e186]:
        - heading "Wersja v2026.8.27.04 (2026-08-27)" [level=4] [ref=e187]
        - list [ref=e188]:
          - listitem [ref=e189]: 🚀 Dodanie wyświetlania rozmiaru bazy danych oraz naprawa przycisku eksportu pojedynczego szablonu na urządzeniach iOS Safari.
      - generic [ref=e190]:
        - heading "Wersja v2026.8.27.03 (2026-08-27)" [level=4] [ref=e191]
        - list [ref=e192]:
          - listitem [ref=e193]: 🚀 Dodano możliwość przywracania fizycznej bazy danych RAW z pliku .sqlite3. Uratowanie użytkowników iOS PWA po awarii cache.
      - generic [ref=e194]:
        - heading "Wersja v2026.8.27.02 (2026-08-27)" [level=4] [ref=e195]
        - list [ref=e196]:
          - listitem [ref=e197]: 🚀 Złamanie pętli cache (SW) i agresywny update PWA dla użytkowników iOS Safari.
      - generic [ref=e198]:
        - heading "Wersja v2026.8.27.01 (2026-08-27)" [level=4] [ref=e199]
        - list [ref=e200]:
          - listitem [ref=e201]: 🚨 Awaryjne ominięcie cache SW - wymuszenie świeżego dbWorker z naprawą WASM
      - generic [ref=e202]:
        - heading "Wersja v2026.8.26.15 (2026-08-26)" [level=4] [ref=e203]
        - list [ref=e204]:
          - listitem [ref=e205]: 🛠️ Krytyczna naprawa WASM - pobieranie binarnego pliku z absolutnym URL zamiast locateFile
      - generic [ref=e206]:
        - heading "Wersja v2026.8.26.14 (2026-08-26)" [level=4] [ref=e207]
        - list [ref=e208]:
          - listitem [ref=e209]: 🛠️ Krytyczna naprawa ścieżki sqlite3.wasm w workerze - fix dla iOS Safari i WebAssembly
      - generic [ref=e210]:
        - heading "Wersja v2026.8.26.13 (2026-08-26)" [level=4] [ref=e211]
        - list [ref=e212]:
          - listitem [ref=e213]: 🛠️ Krytyczna naprawa silnika bazy dla starszych urządzeń Apple (Safari)
      - generic [ref=e214]:
        - heading "Wersja v2026.8.26.12 (2026-08-26)" [level=4] [ref=e215]
        - list [ref=e216]:
          - listitem [ref=e217]: 🆘 Dodano Tryb Awaryjny zgrywania uszkodzonego pliku bazy SQLite
      - generic [ref=e218]:
        - heading "Wersja v2026.8.26.11 (2026-08-26)" [level=4] [ref=e219]
        - list [ref=e220]:
          - listitem [ref=e221]: 🔒 Dodano zabezpieczenie przycisku eksportu bazy przed uszkodzeniem
      - generic [ref=e222]:
        - heading "Wersja v2026.8.26.10 (2026-08-26)" [level=4] [ref=e223]
        - list [ref=e224]:
          - listitem [ref=e225]: "🔧 Fix: Krytyczne błędy bazy i znikające posiłki"
      - generic [ref=e226]:
        - heading "Wersja v2026.8.26.09 (2026-08-26)" [level=4] [ref=e227]
        - list [ref=e228]:
          - listitem [ref=e229]: 🚀 Krytyczna naprawa pętli aktualizacji PWA i stabilności
      - generic [ref=e230]:
        - heading "Wersja v2026.8.26.08 (2026-08-26)" [level=4] [ref=e231]
        - list [ref=e232]:
          - listitem [ref=e233]: "🔥 Hotfix 4: Naprawa białych znaków (Enter) w zmiennej confirm w zakładce Diagnostyka."
      - generic [ref=e234]:
        - heading "Wersja v2026.8.26.07 (2026-08-26)" [level=4] [ref=e235]
        - list [ref=e236]:
          - listitem [ref=e237]: 🧨 Wdrożono narzędzie awaryjnego formatowania bazy danych z poziomu Diagnostyki i naprawiono błędy cichego zapisu treningu.
      - generic [ref=e238]:
        - heading "Wersja v2026.8.26.06 (2026-08-26)" [level=4] [ref=e239]
        - list [ref=e240]:
          - listitem [ref=e241]: "🔥 Hotfix 3: Naprawa błędu składni blokującego ładowanie aplikacji (SettingsUI)."
      - generic [ref=e242]:
        - heading "Wersja v2026.8.26.05 (2026-08-26)" [level=4] [ref=e243]
        - list [ref=e244]:
          - listitem [ref=e245]: "🔥 Hotfix 2: Naprawa błędu składni (Missing }) w TrainingUI."
      - generic [ref=e246]:
        - heading "Wersja v2026.8.26.04 (2026-08-26)" [level=4] [ref=e247]
        - list [ref=e248]:
          - listitem [ref=e249]: "🔥 Hotfix: Naprawiono błąd składni 'Unexpected identifier' w DatabaseManager."
      - generic [ref=e250]:
        - heading "Wersja v2026.8.26.03 (2026-08-26)" [level=4] [ref=e251]
        - list [ref=e252]:
          - listitem [ref=e253]: 🔧 Optymalizacja bazy (Retencja zdjęć do 1 dnia) oraz interaktywny wykres Diety pozwalający na przegląd i kasowanie historii posiłków.
      - generic [ref=e254]:
        - heading "Wersja v2026.8.26.02 (2026-08-26)" [level=4] [ref=e255]
        - list [ref=e256]:
          - listitem [ref=e257]: 🛠️ Wdrożono narzędzie automatycznej migracji i defragmentacji bazy danych naprawiające błędy 'disk I/O error'. Dodano eksport i import Planów Treningowych do JSON oraz poprawiono klawiaturę Numpad i Kreator Koszyka.
      - generic [ref=e258]:
        - heading "Wersja v2026.8.26.01 (2026-08-26)" [level=4] [ref=e259]
        - list [ref=e260]:
          - listitem [ref=e261]: 🛠️ Przebudowano silnik multimedialny (Faza 2). Zdjęcia są teraz przechowywane asynchronicznie w przestrzeni OPFS/IndexedDB. Znacznie zmniejszono obciążenie bazy SQL i przyspieszono ładowanie aplikacji!
      - generic [ref=e262]:
        - heading "Wersja v2026.8.25.03 (2026-08-25)" [level=4] [ref=e263]
        - list [ref=e264]:
          - listitem [ref=e265]: "🚀 BAZA DANYCH 2.0 (OPFS): Przeniesiono silnik bazy SQLite z głównego wątku do Web Workera (dbWorker). Odblokowano bezstratny zapis gigabajtów danych bez ryzyka wyczerpania localStorage! Ponadto operacje masowe zyskały asynchroniczne transakcje, co czyni apkę diabelnie szybką. ⚡"
      - generic [ref=e266]:
        - heading "Wersja v2026.8.25.02 (2026-08-25)" [level=4] [ref=e267]
        - list [ref=e268]:
          - listitem [ref=e269]: "🥗 DIETA UI: Powiększono czcionki dla makro i przycisków akcji, wyrównano szerokość przycisków, a korekta kalorii działa teraz precyzyjnie (o 1 kcal) z możliwością wpisania z klawiatury!"
      - generic [ref=e270]:
        - heading "Wersja v2026.8.25.01 (2026-08-25)" [level=4] [ref=e271]
        - list [ref=e272]:
          - listitem [ref=e273]: "📸 DIETA: Dodano podgląd miniatur dla analizowanych posiłków ze zdjęć oraz nowe okno potwierdzenia wyniku sztucznej inteligencji, pozwalające ręcznie dostosować (+/-) wykryte kalorie przed zapisaniem ich do dziennika!"
      - generic [ref=e274]:
        - heading "Wersja v2026.8.24.04 (2026-08-24)" [level=4] [ref=e275]
        - list [ref=e276]:
          - listitem [ref=e277]: "🌐 PWA OFFLINE (STABILNOŚĆ): Naprawiono błąd 'DietAI Error', który zawieszał aplikację przy braku dostępu do internetu. Dodano regułę omijającą cache dla wszystkich połączeń z chmurą Cloudflare (workers.dev). Teraz w przypadku braku sieci aplikacja natychmiast wyświetli czytelny komunikat 'No internet connection', pozwalając na dalszą pracę offline!"
      - generic [ref=e278]:
        - heading "Wersja v2026.8.24.03 (2026-08-24)" [level=4] [ref=e279]
        - list [ref=e280]:
          - listitem [ref=e281]: "🐞 HISTORIA TRENINGÓW (POPRAWKA): Rozszerzono logikę wyświetlania 'Bloków Łączonych' (Superserii) na główny, duży panel podglądu w zakładce Historii (modal po kliknięciu detali treningu). Wcześniej superserie w tym miejscu wyświetlały się błędnie jako 'Nieznane ćwiczenie'. Teraz widzisz piękną listę swoich superserii!"
      - generic [ref=e282]:
        - heading "Wersja v2026.8.24.02 (2026-08-24)" [level=4] [ref=e283]
        - list [ref=e284]:
          - listitem [ref=e285]: "💪 WŁASNE ĆWICZENIA (Prywatny Katalog): Wszystkie Twoje własne ćwiczenia wpisywane z palca w Treningu i Kreatorze trafiają teraz automatycznie do prywatnego katalogu! Będą pojawiać się jako podpowiedzi przy kolejnych treningach."
          - listitem [ref=e286]: "📝 KREATOR SZABLONÓW: Opcja masowej edycji 'Zastosuj do wszystkich' została zmieniona na 'Zastosuj do zaznaczonych'. Możesz teraz łatwo odznaczać ćwiczenia, by masowo zmieniać parametry tylko dla wybranych z nich!"
          - listitem [ref=e287]: "🏃IKONY TYPU ĆWICZENIA: Przycisk zmiany typu (Siłowe 🏋️ / Cardio 🏃) w Kreatorze i podczas Treningu zyskał dodatkowy opis tekstowy, aby było w 100% jasne, że jest on klikalny i do czego służy."
          - listitem [ref=e288]: "🔎 HISTORIA TRENINGU: Naprawiono błąd wyświetlania 'Nieznane ćwiczenie' w podglądzie historii, gdy wykonywano Superserie (Bloki Łączone). Teraz w podglądzie wyraźnie widać nagłówek 'Blok Łączony' i listę wykonanych pod-ćwiczeń wraz z seriami."
          - listitem [ref=e289]: "🚴 ZAJĘCIA ZORGANIZOWANE: Powrót kategorii 'Zajęcia zorganizowane' do głównego katalogu (Tabata, Crossfit, Zumba, Spinning itp.)."
          - listitem [ref=e290]: "🐞 POPRAWKI BŁĘDÓW: Wyeliminowano krytyczny błąd podczas klonowania starych treningów, który powodował załamanie aplikacji (TypeError przy wczytywaniu serii). Twoje stare plany są znów w 100% bezpieczne do klonowania!"
      - generic [ref=e291]:
        - heading "Wersja v2026.8.24.01 (2026-08-24)" [level=4] [ref=e292]
        - list [ref=e293]:
          - listitem [ref=e294]: "🚀 KREATOR PLANU (KOSZYK): Przebudowa interfejsu (UX). Baza Ćwiczeń uruchamia się teraz eleganckim panelem pop-up (Modal) po kliknięciu 'Dodaj ćwiczenie', eliminując uciążliwe przewijanie ekranu! Pasek 'Zastosuj do wszystkich' powędrował na samą górę, by zawsze był pod ręką. 🛒"
          - listitem [ref=e295]: "🏋️ WŁASNE ĆWICZENIA: Wprowadzanie własnych nazw ćwiczeń posiada od teraz intuicyjny przełącznik (ikona 🏋️/🏃), który natychmiast klasyfikuje ćwiczenie jako Siłowe lub Cardio, zachowując czystość interfejsu na jednym ekranie (bez zajmującej miejsce listy wyboru)."
          - listitem [ref=e296]: "🔗 SUPERSERIE (BLOK ŁĄCZONY): Całkowicie przebudowano wygląd bloków łączonych (superserii). Usunięto zbędne boczne marginesy na telefonach, przez co cała szerokość ekranu jest teraz dostępna dla przycisków i nazw - koniec z ucinanymi tekstami na małych urządzeniach! Dodatkowo tworzenie superserii z automatu ładuje 1 ćwiczenie (zamiast 2), przyspieszając pracę."
          - listitem [ref=e297]: "🐞 HOTFIX (Crash): Naprawiono krytyczny błąd powodujący crash przy klikaniu 'Skopiuj do tego dnia' w starszych treningach posiadających superserie."
          - listitem [ref=e298]: "🥗 DIETA: Klonowanie (kopiowanie) raz dodanych posiłków jest już dostępne za jednym kliknięciem! Dodatkowo zrezygnowano z wymuszania włączania aparatu przy dodawaniu zdjęć w Diecie – po kliknięciu 'Dodaj zdjęcie' telefon naturalnie zapyta, czy otworzyć aparat, czy wybrać fotkę z galerii. Obliczanie zapotrzebowania jest teraz wspierane dużym, pomarańczowym i soczystym przyciskiem! 🍽️"
      - generic [ref=e299]:
        - heading "Wersja v2026.8.22.08 (2026-08-22)" [level=4] [ref=e300]
        - list [ref=e301]:
          - listitem [ref=e302]: "🐞 HOTFIX (Numpad): Zastosowano ostateczne poprawki blokujące ucinanie i wychodzenie kalkulatora poza prawą krawędź ekranu. Zmieniono pozycjonowanie na elastyczne 'width: 100vw' w połączeniu z blokadą 'max-width' – koniec ze znikającymi przyciskami 'Zamknij' oraz cyframi, formatka idealnie wpasowuje się w każdy smartfon! 📱💪"
      - generic [ref=e303]:
        - heading "Wersja v2026.8.22.07 (2026-08-22)" [level=4] [ref=e304]
        - list [ref=e305]:
          - listitem [ref=e306]: "🛡️ Dodatkowe zabezpieczenie RWD: Zastosowano pozycjonowanie 'left/right' (zamiast sztywnego width) dla Eksperymentalnego Numpada, by gwarantować idealne dopasowanie kalkulatora na absolutnie każdym modelu smartfona."
      - generic [ref=e307]:
        - heading "Wersja v2026.8.22.06 (2026-08-22)" [level=4] [ref=e308]
        - list [ref=e309]:
          - listitem [ref=e310]: "📱 Poprawiono responsywność Eksperymentalnego Numpada: Klawiatura i ekran z wpisywaną wartością (kg) idealnie dopasowują się teraz do szerokości każdego ekranu (naprawiono ucinanie prawej krawędzi)."
      - generic [ref=e311]:
        - heading "Wersja v2026.8.22.05 (2026-08-22)" [level=4] [ref=e312]
        - list [ref=e313]:
          - listitem [ref=e314]: "📟 Kalkulator z prawdziwego zdarzenia: Dodano duży ekran wyświetlający aktualnie wpisywane wartości bezpośrednio nad Eksperymentalnym Numpadem!"
          - listitem [ref=e315]: "🧹 Minimalizm: Usunięto przestarzałe i nieużywane przyciski Spotify i YT Music, robiąc miejsce na to co ważne - trening."
          - listitem [ref=e316]: 📝 Wybaczcie błąd techniczny! Poprawiono usterkę z wersji .04, która wyświetlała roboczy tekst w okienku zmian.
      - generic [ref=e317]:
        - heading "Wersja v2026.8.22.04 (2026-08-22)" [level=4] [ref=e318]
        - list [ref=e319]:
          - listitem [ref=e320]: Wdrożenie techniczne ekranu Numpada i czyszczenie interfejsu (Brak opisu).
      - generic [ref=e321]:
        - heading "Wersja v2026.8.22.03 (2026-08-22)" [level=4] [ref=e322]
        - list [ref=e323]:
          - listitem [ref=e324]: "🛠️ HOTFIX: Naprawiono krytyczny błąd w Laboratorium (Brak zdefiniowanej zmiennej isBodyweight), który powodował brak reakcji przycisku 'Dodaj Serię' na całkowicie pustym ćwiczeniu."
      - generic [ref=e325]:
        - heading "Wersja v2026.8.22.02 (2026-08-22)" [level=4] [ref=e326]
        - list [ref=e327]:
          - listitem [ref=e328]: "🚀 Laboratorium (BETA): Całkowicie nowy, eksperymentalny interfejs Numpada i Smart Stepperów podczas treningu! (Włączysz go w Ustawieniach)"
          - listitem [ref=e329]: "📈 Kreator Szablonów: Dodano obsługę wartości po przecinku podczas masowego ustawiania serii, by jednym kliknięciem budować piramidy (np. 100,110,120 kg)!"
          - listitem [ref=e330]: 🐞 Poprawiono zgłaszany błąd w kalendarzu, w którym po udanym zakończeniu treningu system nie odświeżał zielonej kropki bez twardego restartu.
          - listitem [ref=e331]: 👑 Zaktualizowano system weryfikacji tokenów PRO - aplikacja już prawidłowo wyświetla wersję Heavy na panelu głównym po wpisaniu ważnego hasła!
      - generic [ref=e332]:
        - heading "Wersja v2026.8.22.01 (2026-08-22)" [level=4] [ref=e333]
        - list [ref=e334]:
          - listitem [ref=e335]: "✨ Wdrożenie Fazy Opcji 3: Dedykowany, nowiutki Kreator Szablonów (Koszyk) na nowej, przejrzystej karcie!"
          - listitem [ref=e336]: "🛒 Przebudowany interfejs koszykowy: Wybierasz ćwiczenia z bazy i masowo aplikujesz wszystkim ilość serii, powtórzeń, oraz ciężar (z uwzględnieniem wartości na minus dla maszyn ze wspomaganiem!)."
          - listitem [ref=e337]: 🔗 Kreator można odpalić prosto z panelu treningowego jako nowy, bezpieczny widok.
      - generic [ref=e338]:
        - heading "Wersja v2026.8.21.03 (2026-08-21)" [level=4] [ref=e339]
        - list [ref=e340]:
          - listitem [ref=e341]: "🕵️‍♂️ Analityk w akcji: System otrzymał głęboki raport UX dotyczący obsługi dotykowej, co przygotowuje grunt pod wielkie zmiany w interfejsie dodawania ćwiczeń (Swipe, Numpad, Smart Steppery)!"
          - listitem [ref=e342]: "📝 Changelog na sterydach: Załataliśmy lukę, przez którą system wrzucał domyślny i 'suchy' opis przy nowych aktualizacjach. Od teraz każda łatka musi mieć pełne opisy z emotikonami, bo tak rzecze prawo! ⚖️"
      - generic [ref=e343]:
        - heading "Wersja v2026.8.21.02 (2026-08-21)" [level=4] [ref=e344]
        - list [ref=e345]:
          - listitem [ref=e346]: "⏱️ Czas trwania powiadomień: Zoptymalizowaliśmy trenera Edwarda. Jego chmurki z podpowiedziami znikają teraz po idealnych 6 sekundach."
          - listitem [ref=e347]: "📅 Przypomnienie o Trialu: Dodaliśmy mechanizm, który po wygaśnięciu okresu próbnego (status Light) przypomina o możliwości odblokowania wersji PRO tylko raz dziennie na starcie aplikacji, szanując Twój czas."
          - listitem [ref=e348]: "🚀 Kolejne szlify aktualizatora: Wypuściliśmy wersję .02, aby upewnić się, że pobieranie PWA działa już całkowicie bezproblemowo!"
      - generic [ref=e349]:
        - heading "Wersja v2026.8.21.01 (2026-08-21)" [level=4] [ref=e350]
        - list [ref=e351]:
          - listitem [ref=e352]: "👑 Zmiana formatowania licencji: Informacja o dostępie (Heavy / Trial / Light) została przeniesiona na dół pulpitu, tuż przed numerem wersji (np. Trial v2026.8.21.01)."
          - listitem [ref=e353]: "📜 Czytelniejszy pulpit: Link 'Zobacz co nowego (Changelog)' oraz okno z odliczaniem dni próbnych przeniesiono do sekcji 'Ustawienia i Profil', aby zapewnić maksymalny minimalizm na głównym ekranie."
          - listitem [ref=e354]: "🛠️ Naprawa okienek do wpisywania ciężaru: Zwiększyliśmy szerokość pól tekstowych dla obciążeń z 48px na 62px – teraz trzycyfrowe wartości (np. 135 kg) mieszczą się idealnie i cyfry nie są ucinane!"
          - listitem [ref=e355]: "🐞 Krytyczna poprawka aktualizacji (Bugfix): Naprawiono błąd w systemie wersjonowania, który powodował irytującą 'pętlę aktualizacji' oraz błędy Service Workera."
      - generic [ref=e356]:
        - heading "Wersja v2026.8.20.03 (2026-08-20)" [level=4] [ref=e357]
        - list [ref=e358]:
          - listitem [ref=e359]: 🔧 Wdrożenie dedykowanego narzędzia (w zakładce Diagnostyka) do automatycznego mapowania i unifikacji starych nazw ćwiczeń (np. 'wyciskanie płaska' -> 'Klatka - Wyciskanie sztangi - Ławka płaska') we wszystkich Twoich historycznych treningach.
          - listitem [ref=e360]: "📈 Wdrożenie Fazy 8 (Analityka): Dodano interaktywny Wykres Progresu dla konkretnych ćwiczeń w zakładce Analiza Progresu."
          - listitem [ref=e361]: 📊 Możliwość wyboru dowolnego ćwiczenia z rozwijanej listy i śledzenia historii maksymalnego podniesionego ciężaru (oraz powtórzeń) na przestrzenni czasu w formie estetycznego wykresu słupkowego.
      - generic [ref=e362]:
        - heading "Wersja v2026.8.20.01 (2026-08-20)" [level=4] [ref=e363]
        - list [ref=e364]:
          - listitem [ref=e365]: "👑 Wdrożenie Fazy 7: Model Freemium. Aplikacja rozróżnia wersję Light oraz Heavy (PRO). Użytkownicy Light nie mają dostępu do funkcji AI po 7 dniach."
          - listitem [ref=e366]: Dodanie banera Premium na ekranie startowym (Dashboard), który odlicza dni Trial i informuje o statusie (Trial / Light / PRO).
          - listitem [ref=e367]: "Poprawa działania Superserii: Dodawany jest jeden pusty blok ćwiczenia z możliwością rozszerzania go za pomocą dedykowanego przycisku '+ Kolejne ćwiczenie (Superseria)'."
          - listitem [ref=e368]: Przebudowa wyglądu okna Superserii (ujednolicona szerokość i usunięto podwójne obramowanie, które sprawiało problemy na mniejszych ekranach).
          - listitem [ref=e369]: "Cardio: Umożliwienie ręcznego wpisania czasu treningu w minutach zamiast używania stopera."
          - listitem [ref=e370]: "Interfejs: Nowy, ładniejszy wygląd przycisków odtwarzaczy Spotify oraz YouTube Music."
      - generic [ref=e371]:
        - heading "Wersja v2026.8.19.1 (2026-08-19)" [level=4] [ref=e372]
        - list [ref=e373]:
          - listitem [ref=e374]: "📚 Wygodny Katalog Ćwiczeń: Zamiast ukrytej listy (która nie chciała działać na iPhone'ach), obok nazwy ćwiczenia znajdziesz teraz dedykowany przycisk '📚 Katalog', który otwiera czytelne okno wyboru."
          - listitem [ref=e375]: "🗂️ Podział na partie mięśniowe: Katalog w pierwszej kolejności pozwala wybrać partię (np. Plecy, Klatka), a dopiero potem konkretne ćwiczenie, skracając listę i ułatwiając szukanie."
          - listitem [ref=e376]: "📱 Ulepszona Responsywność Serii: Pola ciężaru i powtórzeń zostały zwężone i ciaśniej ułożone, dzięki czemu nawet przy dużym skalowaniu czcionki na ekranach iPhone'a przyciski się nie nachodzą i nie uciekają z ekranu."
          - listitem [ref=e377]: "🔄 Fix Aktualizacji: Ostatecznie naprawiono błąd powodujący ciągłe pojawianie się paska 'Dostępna nowa aktualizacja' mimo poprawnego zainstalowania nowej wersji."
      - generic [ref=e378]:
        - heading "Wersja v2026.8.18.1 (2026-08-18)" [level=4] [ref=e379]
        - list [ref=e380]:
          - listitem [ref=e381]: "📚 Wbudowany Katalog Ćwiczeń: dodając ćwiczenie otrzymujesz inteligentne podpowiedzi z ujednoliconego słownika."
          - listitem [ref=e382]: "🚀 Automatyczna Migracja Historii: Twoje stare nazwy ćwiczeń (np. Klatka płaska) zostały zaktualizowane w całej historii do profesjonalnych odpowiedników z katalogu."
          - listitem [ref=e383]: "🏆 Czytelniejsze Rekordy Siłowe: W Analizie Progresu główny wynik (Ciężar x Powtórzenia) jest teraz na pierwszym planie, a szacowane 1RM pełni rolę wspierającą."
          - listitem [ref=e384]: "📱 Ulepszona Responsywność: Rekordy wyświetlają się perfekcyjnie na każdym ekranie i przy dużej czcionce dzięki płynnemu zawijaniu (flex-wrap)."
          - listitem [ref=e385]: "🎨 Szlify estetyczne udostępniania: Z karty podsumowującej treningi do social mediów zniknęła nadmiarowa, niebieska stopka."
      - generic [ref=e386]:
        - heading "Wersja v2026.8.17.4 (2026-08-17)" [level=4] [ref=e387]
        - list [ref=e388]:
          - listitem [ref=e389]: "🎨 Czysty layout grafiki do social mediów: Usunięto nakładający się niebieski napis ze stopki wygenerowanego obrazu."
          - listitem [ref=e390]: "📐 Inteligentne skalowanie: Rekordy siłowe na wygenerowanej karcie są teraz dynamicznie rozmieszczane, aby idealnie wypełniać kadr bez obcinania tekstu."
      - generic [ref=e391]:
        - heading "Wersja v2026.8.17.3 (2026-08-17)" [level=4] [ref=e392]
        - list [ref=e393]:
          - listitem [ref=e394]: "📤 Udostępnianie Rekordów Siłowych: Dodano dedykowany przycisk generujący estetyczną grafikę z Twoimi najlepszymi wynikami siłowymi, gotową do publikacji na Instagramie lub Facebooku."
      - generic [ref=e395]:
        - heading "Wersja v2026.8.17.2 (2026-08-17)" [level=4] [ref=e396]
        - list [ref=e397]:
          - listitem [ref=e398]: "🏆 Precyzja faktów: Kafelki Rekordów Siłowych pokazują teraz Rzeczywisty Podniesiony Ciężar (np. 100 kg w 10 powtórzeniach), a szacowany wskaźnik 1RM prezentowany jest jako dodatkowa, czytelna ciekawostka."
      - generic [ref=e399]:
        - heading "Wersja v2026.8.17.1 (2026-08-17)" [level=4] [ref=e400]
        - list [ref=e401]:
          - listitem [ref=e402]: "🏆 Nowa sekcja w Analizie Progresu: Twoje Rekordy Siłowe (Szacowane 1RM). Aplikacja automatycznie wylicza Twój szacowany maksymalny ciężar na 1 powtórzenie (wzorem Epleya) z najlepszych serii roboczych."
          - listitem [ref=e403]: "💡 Wyczerpujące wyjaśnienie wskaźnika 1RM: Dodano interaktywny modal informacyjny wyjaśniający, czym jest 1RM, dlaczego szacujemy go matematycznie zamiast ryzykować kontuzję oraz jak dobierać obciążenia robocze."
      - generic [ref=e404]:
        - heading "Wersja v2026.8.15.3 (2026-08-15)" [level=4] [ref=e405]
        - list [ref=e406]:
          - listitem [ref=e407]: "✨ Poprawiono ergonomię ikony Informacji (ℹ️): kliknięcie w ikonę przy Tonażu Ciała otwiera teraz elegancki modal wyjaśniający obliczenia kalisteniczne na urządzeniach mobilnych."
          - listitem [ref=e408]: 🎩 Ujednolicono ton wypowiedzi Trenera Edwarda w module atlasu mięśni na w pełni profesjonalny i merytoryczny.
      - generic [ref=e409]:
        - heading "Wersja v2026.8.15.2 (2026-08-15)" [level=4] [ref=e410]
        - list [ref=e411]:
          - listitem [ref=e412]: 🔥 [HOTFIX] Wdrożenie Wykresu Hybrydowego i nowych kafelków w Analizie Progresu.
      - generic [ref=e413]:
        - heading "Wersja v2026.8.15.1 (2026-08-15)" [level=4] [ref=e414]
        - list [ref=e415]:
          - listitem [ref=e416]: "🔥 Wdrożono Wykres Hybrydowy w Analizie Progresu: pełne wsparcie dla treningów Cardio oraz Zajęć Zorganizowanych (Hyrox, Crossfit, Zumba, Spinning)."
          - listitem [ref=e417]: 📈 Koniec z 0 kg! Paski dla aktywności tlenowych mają teraz dedykowane kolory (Ognisty dla Zajęć, Niebieski dla Cardio) i prezentują spalone kalorie (kcal), średnie tętno (bpm) oraz czas trwania.
          - listitem [ref=e418]: 📊 Dodano nowy kafelek analityczny ze statystykami spalonych kalorii z zegarków (Smartwatch) na samej górze ekranu analizy.
          - listitem [ref=e419]: "🧠 Inteligentny komparator trendu: aplikacja rozróżnia sesje siłowe od tlenowych, nie porównując błędnie tonażu między różnymi dyscyplinami."
      - generic [ref=e420]:
        - heading "Wersja v2026.8.14.22 (2026-08-14)" [level=4] [ref=e421]
        - list [ref=e422]:
          - listitem [ref=e423]: 🛠 Poprawiono kolejny błąd mapowania danych bazy podczas importu, tym razem w obrębie tabel dziennika diety (usunięto nieistniejące kolumny ze skryptu wczytującego).
          - listitem [ref=e424]: "📝 Ulepszono moduł logowania błędów: błędy podczas przywracania danych będą teraz zawsze poprawnie zapisywane w systemie logów Diagnostyki."
      - generic [ref=e425]:
        - heading "Wersja v2026.8.14.21 (2026-08-14)" [level=4] [ref=e426]
        - list [ref=e427]:
          - listitem [ref=e428]: 🛠 Naprawiono schemat importu bazy danych, który blokował prawidłowe przywrócenie archiwum z powodu niedopasowania nazw nowych kolumn z typami treningów.
      - generic [ref=e429]:
        - heading "Wersja v2026.8.14.20 (2026-08-14)" [level=4] [ref=e430]
        - list [ref=e431]:
          - listitem [ref=e432]: "🛠 Naprawiono krytyczny błąd w zakładce Diagnostyka: przyciski (np. Przywróć z Pliku, Utwórz Archiwum) przestały reagować na kliknięcia, jeśli system nie miał zapisanych żadnych logów błędów."
      - generic [ref=e433]:
        - heading "Wersja v2026.8.14.19 (2026-08-14)" [level=4] [ref=e434]
        - list [ref=e435]:
          - listitem [ref=e436]: "📱 Poprawiono układ graficzny wizytówki: Przycisk wsparcia (Postaw Kawę) teraz perfekcyjnie dopasowuje się do szerokości ekranów smartfonów, unikając niepotrzebnego ucinania."
      - generic [ref=e437]:
        - heading "Wersja v2026.8.14.18 (2026-08-14)" [level=4] [ref=e438]
        - list [ref=e439]:
          - listitem [ref=e440]: ☕ Wdrożenie Modułu Monetyzacji (AI Premium). Narzędzia sztucznej inteligencji (Trener Edward oraz Analiza Zdjec Diety) są teraz dostępne za darmo przez pierwsze 7 dni od uruchomienia aplikacji. Następnie wymagają odblokowania tokenem wsparcia poprzez Suppi (Postaw Kawę).
          - listitem [ref=e441]: 🔗 Dodano dedykowany przycisk wsparcia (Postaw Kawę) bezpośrednio na ekranie startowym (Wizytówce) aplikacji.
      - generic [ref=e442]:
        - heading "Wersja v2026.8.14.17 (2026-08-14)" [level=4] [ref=e443]
        - list [ref=e444]:
          - listitem [ref=e445]: 📅 Wprowadzono opcję *Przywracania* odwołanych treningów. Usunięto błąd logiki, przez który odwołany z harmonogramu trening wciąż świecił się na czerwono bez możliwości interakcji.
          - listitem [ref=e446]: 📱 Poprawiono szerokość wierszy dla Dropsetów wewnątrz Super-Serii. Słowo *Dropset* zostało zastąpione intuicyjnym *↳ 🔥*, co wraz z redukcją marginesu całkowicie eliminuje problem nie mieszczących się elementów na małych ekranach przy dużej czcionce.
      - generic [ref=e447]:
        - heading "Wersja v2026.8.14.16 (2026-08-14)" [level=4] [ref=e448]
        - list [ref=e449]:
          - listitem [ref=e450]: "📅 Aktualizacja logiczna kalendarza: Od teraz automatyczne harmonogramy nie wypełniają już sztucznie minionych dni miesiąca (wstecz). Pokazują się tylko od dnia dzisiejszego w przód!"
          - listitem [ref=e451]: "⚡ Natychmiastowe odświeżanie: Zmiana dni w harmonogramie modalu ładuje widok kalendarza w czasie rzeczywistym zaraz po zamknięciu okna (bez konieczności ręcznego przeładowywania)."
      - generic [ref=e452]:
        - heading "Wersja v2026.8.14.15 (2026-08-14)" [level=4] [ref=e453]
        - list [ref=e454]:
          - listitem [ref=e455]: 📅 Kalendarz Faza 4 - Harmonogramy Treningów! Dodano możliwość przypisania Szablonu Planu Treningowego do konkretnych dni tygodnia (np. każdy Poniedziałek i Środa).
          - listitem [ref=e456]: "🟢 Kalendarz zyskał inteligentne kropki: pomarańczowa (zaplanowany trening), zielona (trening zrealizowany), czerwona (trening pominięty)."
          - listitem [ref=e457]: "🏃 Automatyczne uruchamianie: Kliknięcie w zaplanowany dzień w kalendarzu pozwala od razu wczytać i rozpocząć dedykowany plan z opcją przełożenia na inny dzień."
          - listitem [ref=e458]: 🐛 Naprawiono błąd załamywania się wierszy i spadania przycisku X w widoku serii podczas skalowania dużych czcionek.
          - listitem [ref=e459]: 💾 Udoskonalono formatowanie nazwy pobieranego pełnego archiwum bazy danych o sekundy (HH-mm-ss).
      - generic [ref=e460]:
        - heading "Wersja v2026.8.14.14 (2026-08-14)" [level=4] [ref=e461]
        - list [ref=e462]:
          - listitem [ref=e463]: "📦 Pełne Archiwum Danych (Kopia Bezpieczeństwa v2.0): Udoskonalono silnik kopii zapasowej – archiwum obejmuje teraz 100% bazy SQLite (pomiary, treningi, pełną historię diety, raporty AI) oraz wszystkie ustawienia i szablony!"
          - listitem [ref=e464]: "✨ Nowoczesne Okno Szablonów Planów Treningowych: Przywrócono pełną nazwę modułu, dodano stały nagłówek z przyciskiem zamknięcia (X) oraz możliwość zamknięcia okna jednym tapnięciem w tło!"
      - generic [ref=e465]:
        - heading "Wersja v2026.8.14.13 (2026-08-14)" [level=4] [ref=e466]
        - list [ref=e467]:
          - listitem [ref=e468]: "📐 Perfekcyjne Wyrównanie w Wierszu Serii: Checkbox, numer serii, pola ciężaru/powtórzeń oraz przycisk usunięcia są teraz idealnie wyśrodkowane w pionie na jednej linii wzroku!"
          - listitem [ref=e469]: "🎯 Szablony Treningowe: Przyciski \"Wybierz\" i \"Usuń\" mają teraz idealnie równe proporcje (50%/50%) i zawsze mieszczą się w kafelku bez wyjeżdżania poza obrys."
          - listitem [ref=e470]: "✨ Symetria Przycisków Analiz: Przycisk \"Analiza Miesięczna\" zyskał identyczny, zbalansowany dwuliniowy układ jak \"Analiza Tygodniowa\"."
          - listitem [ref=e471]: "🥋 Profesjonalna Komunikacja Trenera: Oczyszczono wszystkie dymki Trenera Edwarda z wulgaryzmów – teraz komunikaty są w 100% profesjonalne, motywujące i z lekkim, sportowym humorem!"
      - generic [ref=e472]:
        - heading "Wersja v2026.8.14.12 (2026-08-14)" [level=4] [ref=e473]
        - list [ref=e474]:
          - listitem [ref=e475]: "🧠 Pełny Wywiad i Makroskładniki u Trenera Edwarda: Edward przed każdą analizą pyta teraz o sen, staż treningowy i cel sylwetkowy! Dodatkowo silnik AI przekazuje pełną gramaturę makroskładników (Białko, Węglowodany, Tłuszcze oraz Kalorie ze szczegółami każdego posiłku). Koniec z narzekaniem Edwarda na brak rozbicia makro!"
          - listitem [ref=e476]: "📋 Import Planu Treningowego z Analizy AI: Każdy trening zaproponowany przez Trenera Edwarda możesz teraz jednym kliknięciem (\"📋 Plan\") zapisać jako gotowy Szablon Treningowy i od razu załadować go na siłowni!"
          - listitem [ref=e477]: "🔙 Intuicyjna Nawigacja w Raporcie: Dodano wyraźny przycisk powrotu do aplikacji u góry i na samym dole raportu z zachowaniem bezpiecznego marginesu pod Dynamic Island / Notch na iPhone."
      - generic [ref=e478]:
        - heading "Wersja v2026.8.14.11 (2026-08-14)" [level=4] [ref=e479]
        - list [ref=e480]:
          - listitem [ref=e481]: "🛠️ Dopracowanie layoutu Serii: Zastosowano zaawansowany CSS, dzięki któremu, jeśli wiersz z Serią, polami wagi/powtórzeń i ikoną usuwania zmieści się na ekranie – zostanie ułożony elegancko w jednym wierszu. Dopiero gdy czcionka jest za duża i brakuje miejsca, inputy naturalnie centrują się pod spodem. Czysta magia front-endu!"
      - generic [ref=e482]:
        - heading "Wersja v2026.8.14.10 (2026-08-14)" [level=4] [ref=e483]
        - list [ref=e484]:
          - listitem [ref=e485]: "🔥 Responsywny formularz Serii: Całkowicie przebudowano wygląd wprowadzania powtórzeń i ciężaru. Pola są teraz niezależne i pięknie wyśrodkowane na ekranie. Koniec z nachodzącymi na siebie przyciskami (szczególnie widocznymi przy dużych czcionkach w systemie iOS!)."
          - listitem [ref=e486]: "🎨 Nowy wygląd Szablonów: Przebudowano modal z zapisanymi planami treningowymi. O wiele czystszy układ z nazwą jako tytułem na środku, dokładnymi informacjami o przewidywanym czasie (jeśli zapisano z historii) oraz z wygodnymi przyciskami na całą szerokość ekranu."
      - generic [ref=e487]:
        - heading "Wersja v2026.8.14.09 (2026-08-14)" [level=4] [ref=e488]
        - list [ref=e489]:
          - listitem [ref=e490]: "🛠️ Potężna Kopii Zapasowa (Diagnoza): Teraz funkcja Eksportu w zakładce Diagnostyka zapisuje absolutnie WSZYSTKO – treningi, pomiary, ustawienia (awatar, nick, szablony), dziennik diety oraz analizy Trenera Edwarda. Śmiało możesz reinstalować aplikację z czystym sumieniem!"
          - listitem [ref=e491]: "🎨 Kolejne szlify Treningu: Poprawiono wyrównanie pól wprowadzania ciężaru przy dużym rozmiarze czcionki na ekranie (zawijanie wierszy z zachowaniem wyśrodkowania)."
      - generic [ref=e492]:
        - heading "Wersja v2026.8.14.08 (2026-08-14)" [level=4] [ref=e493]
        - list [ref=e494]:
          - listitem [ref=e495]: "🎨 Szlify interfejsu (UX/UI): Zoptymalizowano rozmiar i proporcje nowych, powiększonych pól wprowadzania ciężaru i powtórzeń w trakcie treningu (pozbyto się czarnych kwadratów), żeby aplikacja wyglądała świetnie i profesjonalnie na ekranie smartfona!"
      - generic [ref=e496]:
        - heading "Wersja v2026.8.14.07 (2026-08-14)" [level=4] [ref=e497]
        - list [ref=e498]:
          - listitem [ref=e499]: "🛠️ Hotfix: Szybka naprawa krytycznego błędu (tzw. zawieszenie na Loading), który wdarł się do najnowszego modułu treningowego. Teraz wszystko znowu śmiga płynnie! Przepraszamy za usterkę."
      - generic [ref=e500]:
        - heading "Wersja v2026.8.14.06 (2026-08-14)" [level=4] [ref=e501]
        - list [ref=e502]:
          - listitem [ref=e503]: "✨ NOWOŚĆ: Przebudowano interfejs aktywnego treningu — powiększono pola wprowadzania wagi i powtórzeń dla lepszej widoczności podczas ćwiczeń (Styl 'Large Input')."
          - listitem [ref=e504]: "✨ NOWOŚĆ: Kalendarz Historii Treningów wzbogacony o nowy przycisk '🔍 Podgląd'. Kliknięcie pozwala na szybkie podejrzenie pełnych statystyk odbytego treningu w formie estetycznego modala, bez opuszczania widoku kalendarza."
          - listitem [ref=e505]: "✨ NOWOŚĆ: Historia Treningów zyskała przycisk '📝 Zapisz jako plan treningowy'. Możesz teraz jednym kliknięciem przerobić swój wyśmienity trening w gotowy do powtórzenia szablon na przyszłość!"
          - listitem [ref=e506]: "✨ NOWOŚĆ: Możliwość określenia swojego 'Stażu Treningowego' w Profilu. Informacja ta w połączeniu z historią jest przekazywana do Trenera Edwarda, aby ten celniej dobierał obciążenia i złożoność ćwiczeń."
          - listitem [ref=e507]: "✨ NOWOŚĆ: Panel Trenera Edwarda zyskał przycisk '💾 Zapisz raport (TXT)'. Teraz każdą cenną analizę AI możesz wyeksportować i zabrać ze sobą w pliku."
          - listitem [ref=e508]: "🚨 HOTFIX: Całkowicie wyeliminowano problem braku reakcji aplikacji przy wyczerpanym limicie 429 API, dodano czytelne ekrany informujące o przekroczeniu darmowej puli (Quota)."
          - listitem [ref=e509]: "🚨 HOTFIX: Usunięto krytyczny błąd w Diagnostyce, który uniemożliwiał wyeksportowanie kopii zapasowej całej bazy danych w formacie JSON."
      - generic [ref=e510]:
        - heading "Wersja v2026.8.14.04 (2026-08-14)" [level=4] [ref=e511]
        - list [ref=e512]:
          - listitem [ref=e513]: "✨ NOWOŚĆ: Przebudowano Szablony Treningowe na Plany Treningowe z edycją ćwiczeń w locie (Checkboxy)."
          - listitem [ref=e514]: 🤖 Trener Edward po szkoleniu! Oferuje teraz głębszą, profesjonalną analizę medyczną z uwzględnieniem objętości i splitu.
          - listitem [ref=e515]: "🚨 HOTFIX: Wymuszona aktualizacja naprawiająca zaciętą pętlę ekranu nowości PWA (Problem wersji .03 rozwiązywany bezwzględnie)."
      - generic [ref=e516]:
        - heading "Wersja v2026.8.14.03 (2026-08-14)" [level=4] [ref=e517]
        - list [ref=e518]:
          - listitem [ref=e519]: "🚨 HOTFIX: Poprawa obsługi błędów 429 dla Trenera Edwarda (Komunikaty o limitach API)."
      - generic [ref=e520]:
        - heading "Wersja v2026.8.14.02 (2026-08-14)" [level=4] [ref=e521]
        - list [ref=e522]:
          - listitem [ref=e523]: "🚨 HOTFIX: Wymuszona aktualizacja z lepszą obsługą komunikatów o wyczerpaniu limitów API oraz poprawionym tekstem w analityce."
      - generic [ref=e524]:
        - heading "Wersja v2026.8.14.01 (2026-08-14)" [level=4] [ref=e525]
        - list [ref=e526]:
          - listitem [ref=e527]: "✨ NOWOŚĆ: Strona Wizytówkowa (Landing Page). Od teraz aplikacja dostępna jest w 100% z poziomu ikony PWA, a w przeglądarce wyświetla instrukcję instalacji."
      - generic [ref=e528]:
        - heading "Wersja v2026.8.13.04 (2026-08-13)" [level=4] [ref=e529]
        - list [ref=e530]:
          - listitem [ref=e531]: "🚨 HOTFIX: Wymuszona nowa aktualizacja, w której ostatecznie zsynchronizowaliśmy typy danych (images) dla serwera AI."
      - generic [ref=e532]:
        - heading "Wersja v2026.8.13.03 (2026-08-13)" [level=4] [ref=e533]
        - list [ref=e534]:
          - listitem [ref=e535]: "🚨 HOTFIX: Ostateczna naprawa komunikacji analiz AI z bazą SQLite oraz prawidłowe przesyłanie kontekstu do Cloudflare Workera."
      - generic [ref=e536]:
        - heading "Wersja v2026.8.13.02 (2026-08-13)" [level=4] [ref=e537]
        - list [ref=e538]:
          - listitem [ref=e539]: "✨ UX: Ujednolicono i powiększono czcionkę we wszystkich polach konfiguracji Profilu (Pomiary, Cele) oraz Ustawień."
          - listitem [ref=e540]: "🚨 HOTFIX: Złagodzono irytujące zjeżdżanie ekranu (focus) na 'Opcje Treningu' po kliknięciu głównego kafelka 'Treningi', co pozwala teraz normalnie obejrzeć kalendarz."
          - listitem [ref=e541]: "🚨 HOTFIX: Przycisk 'Pochwal się odznakami' w Ustawieniach znowu działa i generuje Twoje zrzuty z pucharami!"
          - listitem [ref=e542]: "🧪 TESTY: 100% stabilności E2E Playwright - środowisko przygotowane do wypuszczenia sub-agentów!"
      - generic [ref=e543]:
        - heading "Wersja v2026.8.13.01 (2026-08-13)" [level=4] [ref=e544]
        - list [ref=e545]:
          - listitem [ref=e546]: "🚨 HOTFIX: Naprawiono błąd 'Brak zdjęcia lub tekstu' wyskakujący po wysłaniu samego zdjęcia jedzenia do Trenera Edwarda."
          - listitem [ref=e547]: "🚨 HOTFIX: Naprawiono błąd braku odpowiedzi (i błędów 500) od chmury Trenera Edwarda z powodu zmian w obiekcie wyjściowym (obsługa samego tekstu)."
          - listitem [ref=e548]: "🚨 HOTFIX: Zabezpieczenie przed niewidzialnym błędem podczas zapisu pustych danych tętna/kalorii z zegarka do starszych treningów."
          - listitem [ref=e549]: "✨ NOWOŚĆ: Generowanie 'Paragonu treningowego' podczas udostępniania – dzieli się z przyjaciółmi pełną listą ćwiczeń i serii, a nie tylko suchymi statystykami!"
          - listitem [ref=e550]: "✨ NOWOŚĆ: Eksport i Import Treningu – łatwo prześlesz znajomym wybitny plan treningowy, z możliwością jednoklikowego importu u nich."
          - listitem [ref=e551]: "✨ UX: Ujednolicono i powiększono czcionkę we wszystkich polach konfiguracji Profilu oraz Ustawień."
      - generic [ref=e552]:
        - heading "Wersja v2026.8.10.05 (2026-08-13)" [level=4] [ref=e553]
        - list [ref=e554]:
          - listitem [ref=e555]: "✨ UX: Zwiększono czytelność numeru wersji na dole ekranu głównego (jaśniejszy kolor, cień)."
          - listitem [ref=e556]: "✨ UX: Zmiana nazewnictwa znaczka 'PR! (1RM: X)' na bardziej zrozumiałe '🏆 Rekord! (Max: X kg)'."
          - listitem [ref=e557]: "✨ UX: Poprawiono niejasny opis nagłówka nad starszymi treningami (zmieniono na 'Ostatnie treningi (wybierz, aby skopiować na dziś)')."
          - listitem [ref=e558]: "✨ UX: Dodano wyświetlanie nazwy i typu treningu, a także statystyk z zegarka (Spalone kalorie i Średnie tętno) w podglądzie Historii Treningów."
          - listitem [ref=e559]: "✨ UX: Zwiększono czcionkę pola wpisywania Nicku w ustawieniach Profilu."
          - listitem [ref=e560]: "🚨 HOTFIX: Naprawiono błąd 'Nie znaleziono treningu w pamięci' podczas udostępniania pojedynczego treningu z ekranu Historii."
          - listitem [ref=e561]: "🚨 HOTFIX: Złagodzono błąd (zamiast alertu prompt), gdy użytkownik przerwie udostępnianie ekranu w module Profilu i Analizy Progresu na niektórych przeglądarkach."
      - generic [ref=e562]:
        - heading "Wersja v2026.8.10.04 (2026-08-12)" [level=4] [ref=e563]
        - list [ref=e564]:
          - listitem [ref=e565]: "🚨 HOTFIX: Naprawiono błąd 'dietLogs.reduce is not a function' przy generowaniu analiz AI po stronie przeglądarek opartych na nowym cache'u (poprawiony sposób wyciągania wierszy z SQLite)."
      - generic [ref=e566]:
        - heading "Wersja v2026.8.10.03 (2026-08-12)" [level=4] [ref=e567]
        - list [ref=e568]:
          - listitem [ref=e569]: "🚨 HOTFIX KRYTYCZNY: Naprawiono błąd 'DatabaseManager is not a function' blokujący Analizę AI u niektórych użytkowników."
          - listitem [ref=e570]: 🛠️ Usprawniono system cache'owania PWA. Aplikacja upewnia się teraz, że pobiera absolutnie najświeższe wersje modułów wewnętrznych (jak baza danych) po każdej aktualizacji, aby uniknąć konfliktów ze starymi wersjami.
      - generic [ref=e571]:
        - heading "Wersja v2026.8.10.02 (2026-08-10)" [level=4] [ref=e572]
        - list [ref=e573]:
          - listitem [ref=e574]: 📸 Przycisk ZRÓB FOTĘ wyrównany obok pola tekstowego — koniec z nachodzeniem na tekst!
          - listitem [ref=e575]: "🤖 Walidacja AI: Jeśli brak treningów w wybranym okresie, Edward uprzejmie informuje że potrzebuje danych, zanim ruszy z analizą."
          - listitem [ref=e576]: 😴 Sen jest teraz OPCJONALNY w analizie AI! Jeśli nie znasz swojego snu, kliknij 'Pomiń sen' — analiza powstanie z adnotacją o brakujących danych.
          - listitem [ref=e577]: 🔢 Numer wersji aplikacji widoczny teraz pod kafelkami na pulpicie głównym.
          - listitem [ref=e578]: 🗑️ Burger menu usunięty! Nawigacja tylko przez kafelki — szybciej, prościej, czyściej. Kliknij logo żeby wrócić na pulpit.
          - listitem [ref=e579]: "🛠️ Naprawiony system aktualizacji: meta tag, service worker i CHANGELOG teraz zawsze zsynchronizowane."
      - generic [ref=e580]:
        - heading "Wersja v2026.8.10.01 (2026-08-10)" [level=4] [ref=e581]
        - list [ref=e582]:
          - listitem [ref=e583]: "🤖 NOWY MODUŁ: Analizy AI Trenera Edwarda! Własna zakładka na pulpicie z analizą tygodniową i miesięczną."
          - listitem [ref=e584]: 📋 Historia analiz AI grupowana po roku i miesiącu — przejrzysta, z panelami do rozwijania.
          - listitem [ref=e585]: "🏠 Nowy układ kafelków: Trening | Historia / Pomiary | Analiza / Dieta | Profil / Analizy AI | Diagnostyka / ☕ Postaw Kawę."
          - listitem [ref=e586]: ☕ Postaw Kawę na pełną szerokość pod kafelkami!
          - listitem [ref=e587]: 🐛 Naprawiono duplikat window.onerror (utrata logów w Diagnostyce).
          - listitem [ref=e588]: 🐛 Usunięto zbędne script tagi AI z HTML (podwójne ładowanie modułów).
          - listitem [ref=e589]: 🐛 Ujednolicone przyciski w Diagnostyce — spójny rozmiar i czcionka.
          - listitem [ref=e590]: 📊 Wykres objętości zamieniony na czytelną listę sesji treningowych.
      - generic [ref=e591]:
        - heading "Wersja v.2026.8.9.12 (2026-08-09)" [level=4] [ref=e592]
        - list [ref=e593]:
          - listitem [ref=e594]: 🐛 Naprawiono pustą kartę Diagnostyki (brakujący HTML i renderowanie logów).
          - listitem [ref=e595]: 🐛 Naprawiono błąd przy udostępnianiu treningów z widoku Historii (brak przypisania do obiektu window).
          - listitem [ref=e596]: 🔥 Przygotowania pod wdrożenie Fazy 4.
      - generic [ref=e597]:
        - heading "Wersja v.2026.8.9.11 (2026-08-09)" [level=4] [ref=e598]
        - list [ref=e599]:
          - listitem [ref=e600]: "🛠️ Nowy Moduł Diagnostyki: Całkowicie wyizolowaliśmy funkcje techniczne (Eksport Bazy, Twardy Reset, Logi) do nowej, bezpiecznej zakładki na Ekranie Głównym."
          - listitem [ref=e601]: "🛡️ Poprawki stabilności: ChatUI już nie zawiesza okna przy otwieraniu szablonów w tle, a PWA Updater agresywniej czyści pamięć podręczną by pobrać najnowszą wersję."
      - generic [ref=e602]:
        - heading "Wersja v.2026.8.9.10 (2026-08-09)" [level=4] [ref=e603]
        - list [ref=e604]:
          - listitem [ref=e605]: 🐛 Naprawiono widok Historii Treningów (błąd renderowania UI po wdrożeniu przycisku ratunkowego).
          - listitem [ref=e606]: "📝 Wdrożono Złotą Zasadę Wersjonowania: PWA wymusza aktualizację z pominięciem starych cache'y."
      - generic [ref=e607]:
        - heading "Wersja v.2026.8.9.09 (2026-08-09)" [level=4] [ref=e608]
        - list [ref=e609]:
          - listitem [ref=e610]: "🚨 HOTFIX KRYTYCZNY: Naprawiono błąd układu graficznego, który powodował wyrzucenie Profilu i Ustawień na główny ekran, ukrywając Awatar i Nick. Twoje statystyki są całkowicie bezpieczne i wracają na swoje miejsce!"
          - listitem [ref=e611]: 🐞 Ostateczne zsynchronizowanie wersji, aby Przycisk Paniki w końcu u każdego działał. Przepraszamy za usterki, lecimy dalej z formą!
      - generic [ref=e612]:
        - heading "Wersja v.2026.8.9.08 (2026-08-09)" [level=4] [ref=e613]
        - list [ref=e614]:
          - listitem [ref=e615]: 🚀 SZABLONY TRENINGOWE! Koniec z nudnym wklepywaniem tego samego co wtorek. Zapisz swój wymarzony trening jako szablon, nazwij go jak dzik i ładuj jednym kliknięciem! Lecimy z tematem!
          - listitem [ref=e616]: 🏆 INTELIGENTNY SYSTEM PR i 1RM! Od dzisiaj wyliczamy Twoje szacowane maksymalne obciążenie w czasie rzeczywistym. Co więcej? Ustanów nowy rekord i spodziewaj się fajerwerków wprost od Trenera Edwarda! 🐗🔥
          - listitem [ref=e617]: 🗺️ MAPA CIAŁA! Zastanawiasz się, co dzisiaj trenować? Odwiedź Analizę Progresu, a nasz system na podstawie Twoich wyczynów z ostatnich 48h wskaże, które partie aż proszą o litość na czerwono, a które są świeżutkie jak po 8h snu (zielone). Trener Edward już pędzi by dać Ci wskazówkę, kiedy robisz overtraining!
          - listitem [ref=e618]: "🛠️ Przycisk Ratunkowy (Twardy Reset): Do sekcji Ustawień trafił nowy, czerwony przycisk 'Twardy Reset', który ratuje Cię, jeśli starsza wersja się zawiesi. Cache aplikacji wyparuje w sekundę bez utraty Twoich statystyk i wyników!"
      - generic [ref=e619]:
        - heading "Wersja v.2026.8.9.07 (2026-08-09)" [level=4] [ref=e620]
        - list [ref=e621]:
          - listitem [ref=e622]: "🛡️ Potężniejszy Brudnopis: Twój Draft zapamiętuje teraz absolutnie wszystko - od ćwiczeń, przez ręcznie wpisany czas, po kalorie ze smartwatcha i nazwę treningu! Nic nie zginie."
          - listitem [ref=e623]: "🔍 Koniec z irytującym przybliżaniem: Zablokowaliśmy automatyczne powiększanie ekranu (zoom) na urządzeniach iOS podczas wpisywania danych z palca."
      - generic [ref=e624]:
        - heading "Wersja v.2026.8.9.06 (2026-08-09)" [level=4] [ref=e625]
        - list [ref=e626]:
          - listitem [ref=e627]: 🚑 Gorąca poprawka! Naprawiliśmy mały, ale złośliwy błąd, który powodował zawieszanie się zapisu treningu tuż po uruchomieniu (niezainicjowany moduł smartwatcha). Możesz już zapisywać bez żadnych przeszkód!
      - generic [ref=e628]:
        - heading "Wersja v.2026.8.9.05 (2026-08-09)" [level=4] [ref=e629]
        - list [ref=e630]:
          - listitem [ref=e631]: "💪 Ewolucja Treningów: Wprowadziliśmy długo wyczekiwany podział na Trening Siłowy, Cardio oraz Zajęcia Zorganizowane! Aplikacja sama dostosuje interfejs do tego, co właśnie ćwiczysz."
          - listitem [ref=e632]: "🚴‍♂️ Gotowi na zajęcia: Wybierz z gotowej listy takie sztosy jak Tabata, HYROX, Les Mills CORE, Pośladki i Brzuch czy Rowery/Spinning, a jeśli brakuje Twoich - wpisz je ręcznie jednym kliknięciem!"
          - listitem [ref=e633]: "🎶 Muzyka pod ręką: Do głównego panelu pod stoperem dodaliśmy skróty odpalszające Spotify i YT Music. Muza i pompa w jednym miejscu!"
          - listitem [ref=e634]: "📱 Inteligentny Edward: Twój osobisty asystent nie śpi! Jeśli zminimalizujesz aplikację by odpisać na SMS-a, po powrocie Edward szybko doliczy czas i pogoni Cię do dalszej pracy nad formą!"
          - listitem [ref=e635]: "🛠️ Żelazna Baza Danych: Załataliśmy lukę, przez którą specyficznie mierzone czasy z Cardio (i wartości NaN) potrafiły wysadzić zapis. Twoja baza SQLite jest teraz kuloodporna!"
      - generic [ref=e636]:
        - heading "Wersja v.2026.8.9.04 (2026-08-09)" [level=4] [ref=e637]
        - list [ref=e638]:
          - listitem [ref=e639]: 🛡️ Twój trening jest teraz niezniszczalny! Wdrożyliśmy zaawansowany system 'Brudnopisu' (Auto-Save), który w tle zabezpiecza każdą Twoją serię. Nawet jeśli napotkasz jakiś błąd, Twoje wpisy zostaną uratowane i odzyskasz je jednym kliknięciem. Dodatkowo ulepszyliśmy numerację Dropsetów. Trenuj bez obaw! 🚀
      - generic [ref=e640]:
        - heading "Wersja v.2026.8.9.03 (2026-08-09)" [level=4] [ref=e641]
        - list [ref=e642]:
          - listitem [ref=e643]: "🔄 Super Szybkie Aktualizacje: Zauważyliśmy, że przeglądarki czasami bywają zbyt uparte i uparcie trzymają starą pamięć podręczną (cache), ukrywając przed Wami najświeższe nowości. Daliśmy naszemu modułowi aktualizacji PWA potężnego kopa! Od teraz nowe wersje aplikacji bezbłędnie przebijają się przez cache i od razu pojawiają się na Twoim telefonie. Koniec z blokowaniem się aktualizacji! 🚀"
      - generic [ref=e644]:
        - heading "Wersja v.2026.8.9.02 (2026-08-09)" [level=4] [ref=e645]
        - list [ref=e646]:
          - listitem [ref=e647]: "🎯 Idealne Wyśrodkowanie: Okna w Analizie Progresu na telefonach nie uciekają już do prawej krawędzi. Zrozumieliśmy aluzję - wielki przycisk 'Zrozumiałem' zamieniliśmy na smuklejszy i zgrabniejszy przycisk 'Zamknij'."
          - listitem [ref=e648]: "💎 Krystaliczna Tapeta: Efekt matowego szkła (blur) został całkowicie usunięty dla własnych tapet. Teraz Twoje zdjęcie jest ostre jak brzytwa i idealnie czytelne prosto pod kafelkami aplikacji!"
      - generic [ref=e649]:
        - heading "Wersja v.2026.8.9.01 (2026-08-09)" [level=4] [ref=e650]
        - list [ref=e651]:
          - listitem [ref=e652]: "🎯 Idealne Wyśrodkowanie: Okna w Analizie Progresu na telefonach nie uciekają już do prawej krawędzi. Zrozumieliśmy aluzję - wielki przycisk \"Zrozumiałem\" zamieniliśmy na smuklejszy i zgrabniejszy przycisk \"Zamknij\"."
          - listitem [ref=e653]: "💎 Krystaliczna Tapeta: Efekt matowego szkła (blur) został zdjęty dla własnych tapet. Teraz Twoje zdjęcie jest ostre jak brzytwa i idealnie czytelne prosto pod kafelkami aplikacji!"
      - generic [ref=e654]:
        - heading "Wersja v.2026.8.8.03 (2026-08-08)" [level=4] [ref=e655]
        - list [ref=e656]:
          - listitem [ref=e657]: "🎨 Szlify Graficzne: Poprawiliśmy zawijanie tekstów w Analizie Progresu. Nawet najmniejsze ekrany telefonów bezbłędnie wyświetlają teraz opisy stref (np. Atletyczna)! 📱"
          - listitem [ref=e658]: "🖼️ Własna Tapeta: Usunęliśmy gęstą mgłę z tła! Teraz wrzucając własną fotkę jako tapetę, cieszysz się jej widokiem w pełnej krasie za wszystkimi kafelkami."
          - listitem [ref=e659]: "📖 Księga Uki'ego (Help): Instrukcja obsługi została gigantycznie rozbudowana! Każdy kafelek, każda opcja ma tam teraz swój zabawny i treściwy opis. Żaden ficzer Ci nie umknie!"
          - listitem [ref=e660]: "📸 Gotowi na Insta: Twój system udostępniania statystyk na Social Media działa doskonale, ustawiając Twoje fotki z treningu jako epickie tło z mrocznym filtrem. Szpanuj formą bez przeszkód!"
      - generic [ref=e661]:
        - heading "Wersja v.2026.8.8.02 (2026-08-08)" [level=4] [ref=e662]
        - list [ref=e663]:
          - listitem [ref=e664]: "📊 Analityka Progresu: Całkowicie przebudowaliśmy analitykę! Zapomnij o nudnych powiadomieniach - witajcie piękne, kolorowe wskaźniki (gauge bars) pokazujące Twój poziom!"
          - listitem [ref=e665]: "🧠 Instrukcja Obsługi: Dodaliśmy w Ustawieniach potężną dawkę wiedzy! Znajdziesz tam zabawną instrukcję pełną wskazówek i ukrytych ficzerów."
          - listitem [ref=e666]: "🧮 Magiczny Minus: Poprawiliśmy działanie przycisku +/- dla ćwiczeń z ciężarem własnym. Nieważne czy wpiszesz 'podciąganie' z polskimi znakami czy bez - system to wychwyci!"
          - listitem [ref=e667]: "⏱️ Precyzyjny Czas Treningu: Ręczne wpisywanie czasu treningu podzieliliśmy na przejrzyste godziny i minuty. Pełna kontrola nad Twoimi danymi!"
      - generic [ref=e668]:
        - heading "Wersja v.2026.8.8.01 (2026-08-08)" [level=4] [ref=e669]
        - list [ref=e670]:
          - listitem [ref=e671]: "🛠️ Stabilność Treningów: Szybko załataliśmy błąd wywalający trening przy łączeniu superserii z dropsetami. Twój progres znów jest bezpieczny!"
          - listitem [ref=e672]: "📸 Dieta 2.0: Sztuczna inteligencja przeanalizuje teraz do 3 zdjęć posiłku naraz. Dodawaj składniki jak chcesz!"
          - listitem [ref=e673]: "👤 Mój Profil, Mój Nick: Zmieniliśmy mechanizm zapisu danych – teraz Twój własny pseudonim ładuje się bezbłędnie."
          - listitem [ref=e674]: "🕵️ Asystent Diagnostyczny: Usprawniliśmy logowanie awarii w tle, aby jeszcze szybciej wyłapywać i niszczyć błędy."
          - listitem [ref=e675]: "⏱️ Kontrola Czasu: Zapomniałeś kliknąć stop? Od teraz przed zapisem treningu możesz ręcznie wpisać jego faktyczny czas trwania."
          - listitem [ref=e676]: "🗣️ Gadatliwy Edward: Wydłużyliśmy czas wyświetlania motywacyjnych dymków trenera w trakcie ćwiczeń. Teraz na pewno niczego nie przegapisz!"
      - generic [ref=e677]:
        - heading "Wersja v.2026.8.7.28 (2026-08-07)" [level=4] [ref=e678]
        - list [ref=e679]:
          - listitem [ref=e680]: "🤖 Trener Edward 2.0: Inteligentny system reagujący na Twoje postępy! Spodziewaj się motywujących dymków po treningu."
          - listitem [ref=e681]: "🎓 Kontekstowy Samouczek: Stary, inwazyjny samouczek odszedł w niepamięć. Apka podpowiada najważniejsze funkcje dokładnie wtedy, gdy ich potrzebujesz."
          - listitem [ref=e682]: "🏆 System nagród za konsekwencję: Edward policzy Twoje treningi i co tydzień (po 7 sesjach) rzuci specjalnymi gratulacjami!"
          - listitem [ref=e683]: "🛠️ Testy E2E zaktualizowane: Playwright w pełni wspiera nowe, bezpieczniejsze menu nawigacyjne aplikacji."
      - generic [ref=e684]:
        - heading "Wersja v.2026.8.7.27 (2026-08-07)" [level=4] [ref=e685]
        - list [ref=e686]:
          - listitem [ref=e687]: Wydanie nowej wersji poprawkowej.
      - generic [ref=e688]:
        - heading "Wersja v.2026.8.7.26 (2026-08-07)" [level=4] [ref=e689]
        - list [ref=e690]:
          - listitem [ref=e691]: "🔥 Naprawa mechanizmu aktualizacji PWA: Baner 'Co nowego?' będzie się teraz pojawiał znacznie skuteczniej i bez pętli."
          - listitem [ref=e692]: 🛠️ Rozwiązano problem z zablokowaniem aplikacji (błąd ładowania ekranu) dla nowych użytkowników wywołany przez samouczek.
          - listitem [ref=e693]: 🤖 Wdrożono środowisko testowe Playwright zapobiegające podobnym awariom w przyszłości.
      - generic [ref=e694]:
        - heading "Wersja v.2026.8.7.25 (2026-08-07)" [level=4] [ref=e695]
        - list [ref=e696]:
          - listitem [ref=e697]: "🔥 Błyskawiczny Hotfix: Naprawiono błąd 'SyntaxError' zablokowania aplikacji podczas ładowania samouczka."
          - listitem [ref=e698]: 📱 Poprawiono układ graficzny ('Średnie Tętno' wychodzące poza ekran) w widoku dodawania parametrów ze smartwatcha dla mniejszych ekranów.
      - generic [ref=e699]:
        - heading "Wersja v.2026.8.7.24 (2026-08-07)" [level=4] [ref=e700]
        - list [ref=e701]:
          - listitem [ref=e702]: 🔦 Zmieniono sposób podświetlania elementów w samouczku. Zamiast zmieniać z-index warstw, tło tworzy teraz idealnie dociętą, przeźroczystą dziurę z efektem ostrości nad klikalnym elementem, rozwiązując wszystkie problemy z czarnym przykryciem.
      - generic [ref=e703]:
        - heading "Wersja v.2026.8.7.23 (2026-08-07)" [level=4] [ref=e704]
        - list [ref=e705]:
          - listitem [ref=e706]: 🛠️ Naprawiono ucinanie się dymków z samouczkiem na ekranach telefonów poprzez precyzyjne wyśrodkowanie okienek.
          - listitem [ref=e707]: 🛠️ Zaktualizowano przycisk 'Zaktualizuj' w panelu 'Co nowego?' - teraz od razu prawidłowo instaluje PWA (wcześniej jedynie odświeżał widok).
      - generic [ref=e708]:
        - heading "Wersja v.2026.8.7.22 (2026-08-07)" [level=4] [ref=e709]
        - list [ref=e710]:
          - listitem [ref=e711]: 🎓 Nowy i ulepszony interaktywny Samouczek w stylu 'Liquid Glass' z pełnymi informacjami o wszystkich najważniejszych modułach, w tym o Diecie!
          - listitem [ref=e712]: 🗑️ Naprawiono błąd, który powodował brak reakcji na przycisk 'Usuń' w widoku kalendarza treningowego.
      - generic [ref=e713]:
        - heading "Wersja v.2026.8.7.21 (2026-08-07)" [level=4] [ref=e714]
        - list [ref=e715]:
          - listitem [ref=e716]: 🔥 Krytyczna poprawka aktualizatora PWA. Wymuszono usunięcie błędnych skryptów z pamięci, co odblokowuje instalację przyszłych aktualizacji bez pętli komunikatów.
          - listitem [ref=e717]: "✨ Elegancja dla treningu: Superserie zostały zebrane w jeden, podświetlany 'Blok Łączony' dla lepszej widoczności w trakcie ćwiczeń."
          - listitem [ref=e718]: "🧠 Trening bez ciężaru: Ćwiczenia typu podciąganie, pompki, brzuszki, deska od teraz nie krzyczą o podanie ilości kilogramów (możesz to pole zostawić puste)."
      - generic [ref=e719]:
        - heading "Wersja v.2026.8.7.20 (2026-08-07)" [level=4] [ref=e720]
        - list [ref=e721]:
          - listitem [ref=e722]: "🚑 Hotfix (x2): Usunięcie krytycznych błędów blokujących Kafelki Nawigacyjne."
          - listitem [ref=e723]: "🎓 Nowość: Dodano Interaktywny Samouczek oprowadzający po systemie, zbudowany w czystym JS!"
      - generic [ref=e724]:
        - heading "Wersja v.2026.8.7.18 (2026-08-07)" [level=4] [ref=e725]
        - list [ref=e726]:
          - listitem [ref=e727]: "💪 Inteligentna analiza Tonażu: od teraz pompki i podciągania wliczają masę Twojego ciała do przerzuconego ciężaru!"
          - listitem [ref=e728]: 📸 Możliwość dodania do 3 zdjęć z treningu (dostępne tuż przed zakończeniem sesji).
          - listitem [ref=e729]: 📤 Zdjęcia treningowe są automatycznie ustawiane jako tło przy udostępnianiu treningu!
          - listitem [ref=e730]: "⌚ Dane ze Smartwatcha: Dodano pola Kalorii i Średniego Tętna."
          - listitem [ref=e731]: ⏱️ Osobny Stoper start/stop dla ćwiczeń typu Cardio.
          - listitem [ref=e732]: "🗣️ Trener Edward: odzywa się co 15 minut podczas aktywnego treningu."
          - listitem [ref=e733]: 🛠️ Nowy panel diagnostyczny w 'Ustawieniach' i naprawa błędu crashowania superserii.
      - generic [ref=e734]:
        - heading "Wersja v.2026.8.7.16 (2026-08-07)" [level=4] [ref=e735]
        - list [ref=e736]:
          - listitem [ref=e737]: 🛠️ drobne zmiany w aplikacji (test logów v.16)
      - generic [ref=e738]:
        - heading "Wersja v.2026.8.7.10 (2026-08-07)" [level=4] [ref=e739]
        - list [ref=e740]:
          - listitem [ref=e741]: 🔥 Masywna Rewolucja Dietetyczna 3.0!
          - listitem [ref=e742]: "🎯 Nowość: Edward przejął całkowitą kontrolę nad liczeniem Kalorii - Możesz podyktować co zjadłeś i jednocześnie cyknąć temu zdjęcie! Jedno kliknięcie wystarczy by obliczyć wszystko do zera."
          - listitem [ref=e743]: "🔴 Nowość: Alarm nadmiarowy. System będzie intensywnie pulsował na czerwono powiadamiając Cię gdy tylko przekroczysz swój plan dietetyczny TDEE."
          - listitem [ref=e744]: "📊 Nowość: Wbudowany 30-dniowy wykres słupkowy na zakładce Dieta pokazuje Twoje zjedzone kalorie byś idealnie widział całą historię."
      - generic [ref=e745]:
        - heading "Wersja v.2026.8.7.09 (2026-08-07)" [level=4] [ref=e746]
        - list [ref=e747]:
          - listitem [ref=e748]: ✨ Perfekcja tkwi w detalach! Wyrównaliśmy wizualnie przyciski kontynuacji i usuwania treningów, by interfejs cieszył oko jeszcze bardziej w każdej rozdzielczości.
      - generic [ref=e749]:
        - heading "Wersja v.2026.8.7.08 (2026-08-07)" [level=4] [ref=e750]
        - list [ref=e751]:
          - listitem [ref=e752]: 📡 Połączenie z centralą przywrócone! Usunęliśmy przeszkodę wymagającą ręcznej konfiguracji połączeń sieciowych z Cloudflare. Edward odpala się natychmiast, z użyciem dedykowanego tunelu!
      - generic [ref=e753]:
        - heading "Wersja v.2026.8.7.07 (2026-08-07)" [level=4] [ref=e754]
        - list [ref=e755]:
          - listitem [ref=e756]: 🎨 Szlify interfejsu (UX/UI)! Ikona wywołująca Edwarda chowa się inteligentnie po rozpoczęciu czatu, udostępniając maksymalną możliwą przestrzeń na ekranie Twojego smartfona. Rozmowy są teraz znacznie czystsze i wyraźniejsze!
      - generic [ref=e757]:
        - heading "Wersja v.2026.8.7.06 (2026-08-07)" [level=4] [ref=e758]
        - list [ref=e759]:
          - listitem [ref=e760]: 🗑 Zrobiliśmy porządki! Omyłkowo zdublowane lub niechciane treningi usuniesz teraz jednym kliknięciem z panelu dnia (z wbudowanym bezpiecznym oknem potwierdzenia). Twoja historia, Twoje zasady! 🧹
      - generic [ref=e761]:
        - heading "Wersja v.2026.8.7.05 (2026-08-07)" [level=4] [ref=e762]
        - list [ref=e763]:
          - listitem [ref=e764]: 📱 Zoptymalizowaliśmy pływające okno Trenera Edwarda pod telefony (iOS/Android)! Koniec z niepotrzebnie przybliżającym się ekranem podczas pisania na wirtualnej klawiaturze.
      - generic [ref=e765]:
        - heading "Wersja v.2026.8.7.04 (2026-08-07)" [level=4] [ref=e766]
        - list [ref=e767]:
          - listitem [ref=e768]: 🤖 Poznaj Edwarda! Twój nowy osobisty Trener AI jest gotowy do akcji. Znajdziesz go w prawym dolnym rogu ekranu – zadawaj pytania o dietę, trening lub po prostu poproś o dawkę motywacji!
          - listitem [ref=e769]: "⚙️ Zaktualizowany silnik AI: Upewnij się, że Twój Cloudflare Worker posiada najnowszą łatkę obsługującą czat, którą przygotowaliśmy."
      - generic [ref=e770]:
        - heading "Wersja v.2026.8.7.03 (2026-08-07)" [level=4] [ref=e771]
        - list [ref=e772]:
          - listitem [ref=e773]: 👋 Witamy Cię osobiście! Nasz nowy system powitań zapamięta Twoje imię, aby aplikacja stała się jeszcze bardziej osobista.
          - listitem [ref=e774]: 🔥 Wkraczamy na wyższy poziom! Dodaliśmy długo oczekiwane Dropsety oraz Superserie – buduj formę jeszcze intensywniej!
          - listitem [ref=e775]: ✨ Drobne usprawnienia interfejsu (m.in. ułatwiony dostęp do nowych bloków ćwiczeń).
      - generic [ref=e776]:
        - heading "Wersja v.2026.8.7.02 (2026-08-07)" [level=4] [ref=e777]
        - list [ref=e778]:
          - listitem [ref=e779]: 🛠 Szybka poprawka wydajnościowa! Usunęliśmy drobne problemy, byś mógł skupić się wyłącznie na treningu.
      - generic [ref=e780]:
        - heading "Wersja v.2026.8.7.01 (2026-08-07)" [level=4] [ref=e781]
        - list [ref=e782]:
          - listitem [ref=e783]: "🔄 Wygodne powtórzenia: w treningu dodaliśmy nowy przełącznik 'Kopiuj ciężar do następnej serii', który oszczędzi Ci wpisywania tych samych liczb!"
          - listitem [ref=e784]: "📅 Więcej na luzie: teraz możesz rozbić trening na części i dodać drugą (a nawet kolejną!) sesję treningową w tym samym dniu."
          - listitem [ref=e785]: "🎤 AI rozumie kontekst: moduł rozpoznawania posiłków ze zdjęcia ma teraz dodatkowe pole - podyktuj lub wpisz opcjonalny kontekst (np. niewidoczne składniki sosu) przed wysłaniem do analizy AI!"
      - generic [ref=e786]:
        - heading "Wersja v.2026.8.6.16 (2026-08-06)" [level=4] [ref=e787]
        - list [ref=e788]:
          - listitem [ref=e789]: "✨ Szlify Social Media: udostępnianie Twoich postępów wygląda teraz obłędnie i obsługuje gramatykę zależną od płci!"
          - listitem [ref=e790]: "👤 Nowość w Pomiarach: dodano wybór płci (Kobieta/Mężczyzna) z automatycznym zapamiętywaniem."
          - listitem [ref=e791]: "🧠 Mądrzejsza Analityka: wbudowaliśmy specjalny wariant wzoru US Navy dla Pań (uwzględniający biodra) oraz dostosowane progi formy (FFMI, BF%, WHR)."
      - generic [ref=e792]:
        - heading "Wersja v.2026.8.6.15 (2026-08-06)" [level=4] [ref=e793]
        - list [ref=e794]:
          - listitem [ref=e795]: 🐛 Koniec z dublowaniem treningów! Funkcja 'Kontynuuj Trening' teraz idealnie zlicza czas i nadpisuje jeden wpis w historii.
          - listitem [ref=e796]: "📷 Miniaturki w Treningu: po zrobieniu zdjęcia maszyny od razu zobaczysz jej zgrabny podgląd na liście ćwiczeń."
          - listitem [ref=e797]: "🎨 Lifting Diety: większe czcionki, jaskrawe kolory makro i czytelniejsze kółko kaloryczne dla jeszcze lepszego UX."
      - generic [ref=e798]:
        - heading "Wersja v.2026.8.6.14 (2026-08-06)" [level=4] [ref=e799]
        - list [ref=e800]:
          - listitem [ref=e801]: "📈 Potężna aktualizacja Analityki: dodaliśmy wyliczanie poziomu tkanki tłuszczowej (BF%), indeksu FFMI i WHR, wraz z interpretacją Twojej formy!"
          - listitem [ref=e802]: "📊 Wykresy historii: śledź swoje postępy na eleganckim wykresie słupkowym."
      - generic [ref=e803]:
        - heading "Wersja v.2026.8.6.13 (2026-08-06)" [level=4] [ref=e804]
        - list [ref=e805]:
          - listitem [ref=e806]: 🔧 Szlifujemy kody! Wprowadziliśmy optymalizacje, by apka działała płynniej i oszczędzała baterię.
      - generic [ref=e807]:
        - heading "Wersja v.2026.8.6.12 (2026-08-06)" [level=4] [ref=e808]
        - list [ref=e809]:
          - listitem [ref=e810]: ⚡ Przyspieszyliśmy działanie interfejsu. Ekran wczytuje się błyskawicznie!
      - generic [ref=e811]:
        - heading "Wersja v.2026.8.6.11 (2026-08-06)" [level=4] [ref=e812]
        - list [ref=e813]:
          - listitem [ref=e814]: 🛡️ Poprawiliśmy stabilność. Twoje dane są jeszcze bezpieczniejsze!
      - generic [ref=e815]:
        - heading "Wersja v.2026.8.6.10 (2026-08-06)" [level=4] [ref=e816]
        - list [ref=e817]:
          - listitem [ref=e818]: 🎨 Delikatny lifting interfejsu. Zadbaliśmy o spójność detali wizualnych.
      - generic [ref=e819]:
        - heading "Wersja v.2026.8.6.09 (2026-08-06)" [level=4] [ref=e820]
        - list [ref=e821]:
          - listitem [ref=e822]: ⚙️ Małe ulepszenia, wielka różnica! Przebudowaliśmy silnik pod maską dla jeszcze większej wydajności.
      - generic [ref=e823]:
        - heading "Wersja v.2026.8.6.08 (2026-08-06)" [level=4] [ref=e824]
        - list [ref=e825]:
          - listitem [ref=e826]: 🚀 Stabilność na medal! Rozwiązaliśmy rzadko spotykane błędy zgłaszane przez społeczność.
      - generic [ref=e827]:
        - heading "Wersja v.2026.8.6.07 (2026-08-06)" [level=4] [ref=e828]
        - list [ref=e829]:
          - listitem [ref=e830]: 📱 Lepsze wsparcie dla różnych rozdzielczości ekranu - każdy szczegół ma znaczenie!
      - generic [ref=e831]:
        - heading "Wersja v.2026.8.6.06 (2026-08-06)" [level=4] [ref=e832]
        - list [ref=e833]:
          - listitem [ref=e834]: 💪 Niezawodność to nasz cel - zoptymalizowaliśmy bazy danych dla szybszego zapisu.
      - generic [ref=e835]:
        - heading "Wersja v.2026.8.6.05 (2026-08-06)" [level=4] [ref=e836]
        - list [ref=e837]:
          - listitem [ref=e838]: ✨ Drobne, ale istotne poprawki, które usprawniają codzienne korzystanie z narzędzia.
      - generic [ref=e839]:
        - heading "Wersja v.2026.8.6.04 (2026-08-06)" [level=4] [ref=e840]
        - list [ref=e841]:
          - listitem [ref=e842]: 🔧 Stabilizacja logiki systemowej, dzięki której wszystko chodzi jak w szwajcarskim zegarku.
      - generic [ref=e843]:
        - heading "Wersja v.2026.8.6.03 (2026-08-06)" [level=4] [ref=e844]
        - list [ref=e845]:
          - listitem [ref=e846]: 🔧 Szlifujemy kody! Wprowadziliśmy optymalizacje, by apka działała płynniej i oszczędzała baterię.
      - generic [ref=e847]:
        - heading "Wersja v.2026.8.6.02 (2026-08-06)" [level=4] [ref=e848]
        - list [ref=e849]:
          - listitem [ref=e850]: Wdrożono inteligentny moduł Diety z rozpoznawaniem posiłków AI.
          - listitem [ref=e851]: Dodano wyliczanie celu kalorycznego TDEE w zakładce Ustawienia.
          - listitem [ref=e852]: Integracja z bezpiecznym serwerem pośredniczącym Cloudflare.
          - listitem [ref=e853]: Poprawiono formatowanie numeru wersji w systemie.
      - generic [ref=e854]:
        - heading "Wersja v.2026.8.6.01 (2026-08-06)" [level=4] [ref=e855]
        - list [ref=e856]:
          - listitem [ref=e857]: Poprawiono proporcje kalendarza (skalowanie na urządzeniach mobilnych).
          - listitem [ref=e858]: "Dodano zaawansowaną analitykę: wyliczanie BF% (US Navy) oraz FFMI."
          - listitem [ref=e859]: Udostępnianie treningów i wyników w mediach społecznościowych z generowaniem grafiki z awatarem.
          - listitem [ref=e860]: Naprawiono krytyczny błąd blokujący przełączanie zakładek.
          - listitem [ref=e861]: Wdrożono zaawansowany baner aktualizacji PWA (w tym changelog).
      - generic [ref=e862]:
        - heading "Wersja v.2026.8.5.13 (2026-08-05)" [level=4] [ref=e863]
        - list [ref=e864]:
          - listitem [ref=e865]: Dodano pole 'Szyja' w pomiarach ciała (niezbędne do wyliczania BF%).
          - listitem [ref=e866]: Dodano Wzrost w pomiarach ciała.
          - listitem [ref=e867]: Poprawki formularzy w urządzeniach z systemem iOS (skalowanie paska daty).
          - listitem [ref=e868]: Zoptymalizowano proces ładowania danych w historii pomiarów.
  - button "🤖" [ref=e870] [cursor=pointer]
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | test.describe('Training and History Flow', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
  6   |     await page.goto('/');
  7   |   });
  8   | 
  9   |   test('should create a training session and verify it appears in history', async ({ page }) => {
  10  |     await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
  11  |     // 1. Go to Training Tab
  12  |     await page.click('a[data-tab="training-dashboard"]');
  13  | 
  14  |     // Wait for the calendar to render and click "Dodaj nową sesję treningową"
  15  |     await page.click('text=Dodaj nową sesję treningową');
  16  |     
  17  |     // Fill the training name
  18  |     await page.fill('#training-name-input', 'Trening siłowy test');
  19  | 
  20  |     // Wait a moment for UI
  21  |     await page.waitForTimeout(500);
  22  | 
  23  |     // --- Exercise 1: Wyciskanie ---
  24  |     await page.fill('.exercise-name-input', 'Wyciskanie sztangi leżąc');
  25  |     
  26  |     // Add sets (3 sets with weights and reps)
  27  |     // Set 1
  28  |     await page.fill('input[placeholder="kg"]', '80');
  29  |     await page.fill('input[placeholder="powt"]', '12');
  30  |     await page.click('button:has-text("+ Seria")');
  31  |     // Set 2
  32  |     await page.fill('input[placeholder="kg"]', '85');
  33  |     await page.fill('input[placeholder="powt"]', '10');
  34  |     await page.click('button:has-text("+ Seria")');
  35  |     // Set 3
  36  |     await page.fill('input[placeholder="kg"]', '90');
  37  |     await page.fill('input[placeholder="powt"]', '8');
  38  |     await page.click('button:has-text("+ Seria")');
  39  | 
  40  |     // Add another exercise
  41  |     await page.click('#add-exercise-to-plan-btn');
  42  |     await page.waitForTimeout(500);
  43  | 
  44  |     // --- Exercise 2: Wyciskanie skośne ---
  45  |     const exerciseInputs = page.locator('.exercise-name-input');
  46  |     await exerciseInputs.nth(1).fill('Wyciskanie skośne');
  47  | 
  48  |     const weightInputs = page.locator('input[placeholder="kg"]');
  49  |     const repsInputs = page.locator('input[placeholder="powt"]');
  50  |     const addSetBtns = page.locator('button:has-text("+ Seria")');
  51  |     
  52  |     await weightInputs.nth(1).fill('60');
  53  |     await repsInputs.nth(1).fill('15');
> 54  |     await addSetBtns.nth(1).click();
      |                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  55  |     await weightInputs.nth(1).fill('65');
  56  |     await repsInputs.nth(1).fill('12');
  57  |     await addSetBtns.nth(1).click();
  58  |     await weightInputs.nth(1).fill('70');
  59  |     await repsInputs.nth(1).fill('10');
  60  |     await addSetBtns.nth(1).click();
  61  | 
  62  |     // Add third exercise
  63  |     await page.click('#add-exercise-to-plan-btn');
  64  |     await page.waitForTimeout(500);
  65  | 
  66  |     // --- Exercise 3: Triceps ---
  67  |     const exInputs3 = page.locator('.exercise-name-input');
  68  |     await exInputs3.nth(2).fill('Francuskie wyciskanie (Triceps)');
  69  | 
  70  |     const weightInputs3 = page.locator('input[placeholder="kg"]');
  71  |     const repsInputs3 = page.locator('input[placeholder="powt"]');
  72  |     const addSetBtns3 = page.locator('button:has-text("+ Seria")');
  73  | 
  74  |     await weightInputs3.nth(2).fill('30');
  75  |     await repsInputs3.nth(2).fill('15');
  76  |     await addSetBtns3.nth(2).click();
  77  |     await weightInputs3.nth(2).fill('35');
  78  |     await repsInputs3.nth(2).fill('12');
  79  |     await addSetBtns3.nth(2).click();
  80  |     await weightInputs3.nth(2).fill('40');
  81  |     await repsInputs3.nth(2).fill('10');
  82  |     await addSetBtns3.nth(2).click();
  83  | 
  84  |     // Finish training
  85  |     page.on('dialog', dialog => dialog.accept());
  86  |     await page.click('#finish-training-btn');
  87  |     await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });
  88  | 
  89  |     // Go to History tab
  90  |     await page.evaluate(() => window.switchTab('history-dashboard'));
  91  | 
  92  |     // Wait for history to load
  93  |     await page.waitForTimeout(1000);
  94  | 
  95  |     // Assert that the training is in history
  96  |     await expect(page.locator('#history-dashboard >> text=Trening siłowy test').first()).toBeVisible();
  97  | 
  98  |     // Expand details
  99  |     await page.locator('text=▼').first().click();
  100 | 
  101 |     // Verify details are shown
  102 |     await expect(page.locator('text=Szczegóły ćwiczeń:').first()).toBeVisible();
  103 |     await expect(page.locator('text=Wyciskanie sztangi leżąc').first()).toBeVisible();
  104 |     await expect(page.locator('text=Wyciskanie skośne').first()).toBeVisible();
  105 |     await expect(page.locator('text=Francuskie wyciskanie (Triceps)').first()).toBeVisible();
  106 |   });
  107 | 
  108 |   test('powinien poprawnie wyświetlać Blok Łączony w oknie modalnym historii (bez Nieznane ćwiczenie)', async ({ page }) => {
  109 |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); });
  110 |     await page.goto('http://127.0.0.1:8080/');
  111 | 
  112 |     // Utwórz trening z blokiem łączonym (manualnie wstrzyknięty do DB dla szybkości, by przetestować UI historii)
  113 |     await page.evaluate(async () => {
  114 |         const today = new Date().toISOString().split('T')[0];
  115 |         await window.DatabaseManager.addTraining({
  116 |             date: today,
  117 |             name: "Trening z superserią test",
  118 |             duration_seconds: 3600,
  119 |             type: "strength",
  120 |             exercises: [
  121 |                 {
  122 |                     id: "sup1",
  123 |                     type: "superset",
  124 |                     name: "",
  125 |                     exercises: [
  126 |                         { id: "s1", type: "strength", name: "Biceps", sets: [{weight: 10, reps: 10}] },
  127 |                         { id: "s2", type: "strength", name: "Triceps", sets: [{weight: 15, reps: 10}] }
  128 |                     ]
  129 |                 }
  130 |             ]
  131 |         });
  132 |     });
  133 | 
  134 |     await page.reload();
  135 | 
  136 |     // Idź do historii
  137 |     await page.evaluate(() => window.switchTab('history-dashboard'));
  138 |     await page.waitForSelector('#history-dashboard', { state: 'visible' });
  139 | 
  140 |     // Rozwiń trening z superserią
  141 |     await expect(page.locator('text=Trening z superserią test').first()).toBeVisible();
  142 |     
  143 |     // Kliknij żeby otworzyć modal podglądu (w Historii kliknięcie w kartę zazwyczaj otwiera podgląd viewTrainingFromHistory lub rozwija go)
  144 |     // Zrzut pokazuje, że po kliknięciu jest modal. Możemy wywołać podgląd bezpośrednio jeśli selektory są trudne, np. viewTrainingFromHistory
  145 |     await page.locator('text=Trening z superserią test').first().click();
  146 | 
  147 |     // Sprawdź czy jest Blok Łączony i nie ma "Nieznane ćwiczenie"
  148 |     await expect(page.locator('text=Blok Łączony (Superseria)').first()).toBeVisible();
  149 |     await expect(page.locator('text=Biceps').first()).toBeVisible();
  150 |     await expect(page.locator('text=Triceps').first()).toBeVisible();
  151 | 
  152 |     // Powinno nie być tekstu "Nieznane ćwiczenie"
  153 |     await expect(page.locator('text=Nieznane ćwiczenie')).toHaveCount(0);
  154 |   });
```