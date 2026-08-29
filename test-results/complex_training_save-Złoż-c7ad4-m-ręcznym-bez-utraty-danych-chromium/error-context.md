# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complex_training_save.spec.js >> Złożony scenariusz zapisu treningu z draftem >> Powinien zapisać trening z dropsetami, superseriami, cardio i czasem ręcznym bez utraty danych
- Location: tests/e2e/complex_training_save.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#start-new-session-btn')
    - locator resolved to <button id="start-new-session-btn" class="action-button pulse">➕ Dodaj nową sesję treningową</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
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
       - <h4>…</h4> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div>…</div> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div>…</div> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
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
    - <h4>…</h4> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div>…</div> from <div id="changelog-modal-overlay">…</div> subtree intercepts pointer events
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
          - link "Trening" [active] [ref=e13] [cursor=pointer]:
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
        - generic [ref=e28]: Trial (7 dni) v2026.8.28.01
    - main [ref=e29]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - heading "Trening" [level=2] [ref=e33]
          - paragraph [ref=e34]: Zaplanuj i wykonuj treningi
        - generic [ref=e35]:
          - generic [ref=e36]:
            - button "◀" [ref=e37] [cursor=pointer]
            - heading "Sierpień 2026" [level=3] [ref=e38]
            - button "▶" [ref=e39] [cursor=pointer]
          - generic [ref=e40]:
            - generic [ref=e41]: Pn
            - generic [ref=e42]: Wt
            - generic [ref=e43]: Śr
            - generic [ref=e44]: Cz
            - generic [ref=e45]: Pt
            - generic [ref=e46]: So
            - generic [ref=e47]: Nd
            - generic [ref=e48] [cursor=pointer]: "1"
            - generic [ref=e49] [cursor=pointer]: "2"
            - generic [ref=e50] [cursor=pointer]: "3"
            - generic [ref=e51] [cursor=pointer]: "4"
            - generic [ref=e52] [cursor=pointer]: "5"
            - generic [ref=e53] [cursor=pointer]: "6"
            - generic [ref=e54] [cursor=pointer]: "7"
            - generic [ref=e55] [cursor=pointer]: "8"
            - generic [ref=e56] [cursor=pointer]: "9"
            - generic [ref=e57] [cursor=pointer]: "10"
            - generic [ref=e58] [cursor=pointer]: "11"
            - generic [ref=e59] [cursor=pointer]: "12"
            - generic [ref=e60] [cursor=pointer]: "13"
            - generic [ref=e61] [cursor=pointer]: "14"
            - generic [ref=e62] [cursor=pointer]: "15"
            - generic [ref=e63] [cursor=pointer]: "16"
            - generic [ref=e64] [cursor=pointer]: "17"
            - generic [ref=e65] [cursor=pointer]: "18"
            - generic [ref=e66] [cursor=pointer]: "19"
            - generic [ref=e67] [cursor=pointer]: "20"
            - generic [ref=e68] [cursor=pointer]: "21"
            - generic [ref=e69] [cursor=pointer]: "22"
            - generic [ref=e70] [cursor=pointer]: "23"
            - generic [ref=e71] [cursor=pointer]: "24"
            - generic [ref=e72] [cursor=pointer]: "25"
            - generic [ref=e73] [cursor=pointer]: "26"
            - generic [ref=e74] [cursor=pointer]: "27"
            - generic [ref=e75] [cursor=pointer]: "28"
            - generic [ref=e76] [cursor=pointer]: "29"
            - generic [ref=e77] [cursor=pointer]: "30"
            - generic [ref=e78] [cursor=pointer]: "31"
          - generic [ref=e79]:
            - 'heading "Opcje dla: 2026-08-15" [level=4] [ref=e80]'
            - generic [ref=e81]:
              - button "➕ Dodaj nową sesję treningową" [ref=e82] [cursor=pointer]
              - button "📄 Wybierz Szablon Treningowy" [ref=e83] [cursor=pointer]
              - button "✨ Kreator Szablonów (Koszyk)" [ref=e84] [cursor=pointer]
              - generic [ref=e85]:
                - heading "📋 Ostatnie treningi (wybierz, aby skopiować na dziś):" [level=5] [ref=e86]
                - paragraph [ref=e87]: Brak sesji w historii do skopiowania.
          - generic [ref=e88]:
            - generic [ref=e89]: Wykonany
            - generic [ref=e91]: Zaplanowany
            - generic [ref=e93]: Pominięty
  - text: ✕
  - generic [ref=e96]:
    - generic [ref=e97]:
      - heading "Co nowego? 🚀" [level=3] [ref=e98]
      - button "×" [ref=e99] [cursor=pointer]
    - generic [ref=e101]:
      - generic [ref=e102]:
        - heading "Wersja v2026.8.28.01 (2026-08-28)" [level=4] [ref=e103]
        - list [ref=e104]:
          - listitem [ref=e105]: 🐛 Naprawa błędu z szablonami treningów (brak możliwości dodawania serii po użyciu szablonu).\n🐛 Naprawa wyświetlania miniatur zdjęć w widoku Diety.\n📦 Dodano system przypomnień o codziennym archiwum bazy danych (BackupUI).\n🧹 Uporządkowano zakładkę Diagnostyka, ukrywając groźne funkcje RAW.
      - generic [ref=e106]:
        - heading "Wersja v2026.8.27.10 (2026-08-27)" [level=4] [ref=e107]
        - list [ref=e108]:
          - listitem [ref=e109]: 🐛 Naprawa utraty danych na iOS Safari (brak nagłówków COOP/COEP blokował tryb OPFS). Dodano ręczny system automatycznego zapisu i odczytu bazy OPFS z pamięci RAM.
      - generic [ref=e110]:
        - heading "Wersja v2026.8.27.09 (2026-08-27)" [level=4] [ref=e111]
        - list [ref=e112]:
          - listitem [ref=e113]: 🐛 Krytyczna naprawa błędu "Invalid bind type", który odrzucał import bazy danych (JSON) zawierający pola "undefined". Wersja kuloodporna.
      - generic [ref=e114]:
        - heading "Wersja v2026.8.27.08 (2026-08-27)" [level=4] [ref=e115]
        - list [ref=e116]:
          - listitem [ref=e117]: 🐛 Naprawa błędu składni (SyntaxError) w silniku bazy danych dbWorker.js, który blokował import danych.
      - generic [ref=e118]:
        - heading "Wersja v2026.8.27.07 (2026-08-27)" [level=4] [ref=e119]
        - list [ref=e120]:
          - listitem [ref=e121]: 🐛 Naprawa literówki (SyntaxError) w module Diagnostyki, która blokowała ładowanie aplikacji na ekranie powitalnym.
      - generic [ref=e122]:
        - heading "Wersja v2026.8.27.06 (2026-08-27)" [level=4] [ref=e123]
        - list [ref=e124]:
          - listitem [ref=e125]: 🐛 Usunięto błąd zawieszający aplikację na ekranie startowym (konflikt modułu SQLite z iOS Safari w głównym wątku). Stabilne działanie na iOS przywrócone.
      - generic [ref=e126]:
        - heading "Wersja v2026.8.27.05 (2026-08-27)" [level=4] [ref=e127]
        - list [ref=e128]:
          - listitem [ref=e129]: 🚀 Wdrożono automatyczny migrator bazy danych z LocalStorage (kvvfs) do OPFS (Baza 2.0). Wszyscy dotychczasowi użytkownicy odzyskają dostęp do swoich danych przy pierwszym uruchomieniu nowej wersji!
      - generic [ref=e130]:
        - heading "Wersja v2026.8.27.04 (2026-08-27)" [level=4] [ref=e131]
        - list [ref=e132]:
          - listitem [ref=e133]: 🚀 Dodanie wyświetlania rozmiaru bazy danych oraz naprawa przycisku eksportu pojedynczego szablonu na urządzeniach iOS Safari.
      - generic [ref=e134]:
        - heading "Wersja v2026.8.27.03 (2026-08-27)" [level=4] [ref=e135]
        - list [ref=e136]:
          - listitem [ref=e137]: 🚀 Dodano możliwość przywracania fizycznej bazy danych RAW z pliku .sqlite3. Uratowanie użytkowników iOS PWA po awarii cache.
      - generic [ref=e138]:
        - heading "Wersja v2026.8.27.02 (2026-08-27)" [level=4] [ref=e139]
        - list [ref=e140]:
          - listitem [ref=e141]: 🚀 Złamanie pętli cache (SW) i agresywny update PWA dla użytkowników iOS Safari.
      - generic [ref=e142]:
        - heading "Wersja v2026.8.27.01 (2026-08-27)" [level=4] [ref=e143]
        - list [ref=e144]:
          - listitem [ref=e145]: 🚨 Awaryjne ominięcie cache SW - wymuszenie świeżego dbWorker z naprawą WASM
      - generic [ref=e146]:
        - heading "Wersja v2026.8.26.15 (2026-08-26)" [level=4] [ref=e147]
        - list [ref=e148]:
          - listitem [ref=e149]: 🛠️ Krytyczna naprawa WASM - pobieranie binarnego pliku z absolutnym URL zamiast locateFile
      - generic [ref=e150]:
        - heading "Wersja v2026.8.26.14 (2026-08-26)" [level=4] [ref=e151]
        - list [ref=e152]:
          - listitem [ref=e153]: 🛠️ Krytyczna naprawa ścieżki sqlite3.wasm w workerze - fix dla iOS Safari i WebAssembly
      - generic [ref=e154]:
        - heading "Wersja v2026.8.26.13 (2026-08-26)" [level=4] [ref=e155]
        - list [ref=e156]:
          - listitem [ref=e157]: 🛠️ Krytyczna naprawa silnika bazy dla starszych urządzeń Apple (Safari)
      - generic [ref=e158]:
        - heading "Wersja v2026.8.26.12 (2026-08-26)" [level=4] [ref=e159]
        - list [ref=e160]:
          - listitem [ref=e161]: 🆘 Dodano Tryb Awaryjny zgrywania uszkodzonego pliku bazy SQLite
      - generic [ref=e162]:
        - heading "Wersja v2026.8.26.11 (2026-08-26)" [level=4] [ref=e163]
        - list [ref=e164]:
          - listitem [ref=e165]: 🔒 Dodano zabezpieczenie przycisku eksportu bazy przed uszkodzeniem
      - generic [ref=e166]:
        - heading "Wersja v2026.8.26.10 (2026-08-26)" [level=4] [ref=e167]
        - list [ref=e168]:
          - listitem [ref=e169]: "🔧 Fix: Krytyczne błędy bazy i znikające posiłki"
      - generic [ref=e170]:
        - heading "Wersja v2026.8.26.09 (2026-08-26)" [level=4] [ref=e171]
        - list [ref=e172]:
          - listitem [ref=e173]: 🚀 Krytyczna naprawa pętli aktualizacji PWA i stabilności
      - generic [ref=e174]:
        - heading "Wersja v2026.8.26.08 (2026-08-26)" [level=4] [ref=e175]
        - list [ref=e176]:
          - listitem [ref=e177]: "🔥 Hotfix 4: Naprawa białych znaków (Enter) w zmiennej confirm w zakładce Diagnostyka."
      - generic [ref=e178]:
        - heading "Wersja v2026.8.26.07 (2026-08-26)" [level=4] [ref=e179]
        - list [ref=e180]:
          - listitem [ref=e181]: 🧨 Wdrożono narzędzie awaryjnego formatowania bazy danych z poziomu Diagnostyki i naprawiono błędy cichego zapisu treningu.
      - generic [ref=e182]:
        - heading "Wersja v2026.8.26.06 (2026-08-26)" [level=4] [ref=e183]
        - list [ref=e184]:
          - listitem [ref=e185]: "🔥 Hotfix 3: Naprawa błędu składni blokującego ładowanie aplikacji (SettingsUI)."
      - generic [ref=e186]:
        - heading "Wersja v2026.8.26.05 (2026-08-26)" [level=4] [ref=e187]
        - list [ref=e188]:
          - listitem [ref=e189]: "🔥 Hotfix 2: Naprawa błędu składni (Missing }) w TrainingUI."
      - generic [ref=e190]:
        - heading "Wersja v2026.8.26.04 (2026-08-26)" [level=4] [ref=e191]
        - list [ref=e192]:
          - listitem [ref=e193]: "🔥 Hotfix: Naprawiono błąd składni 'Unexpected identifier' w DatabaseManager."
      - generic [ref=e194]:
        - heading "Wersja v2026.8.26.03 (2026-08-26)" [level=4] [ref=e195]
        - list [ref=e196]:
          - listitem [ref=e197]: 🔧 Optymalizacja bazy (Retencja zdjęć do 1 dnia) oraz interaktywny wykres Diety pozwalający na przegląd i kasowanie historii posiłków.
      - generic [ref=e198]:
        - heading "Wersja v2026.8.26.02 (2026-08-26)" [level=4] [ref=e199]
        - list [ref=e200]:
          - listitem [ref=e201]: 🛠️ Wdrożono narzędzie automatycznej migracji i defragmentacji bazy danych naprawiające błędy 'disk I/O error'. Dodano eksport i import Planów Treningowych do JSON oraz poprawiono klawiaturę Numpad i Kreator Koszyka.
      - generic [ref=e202]:
        - heading "Wersja v2026.8.26.01 (2026-08-26)" [level=4] [ref=e203]
        - list [ref=e204]:
          - listitem [ref=e205]: 🛠️ Przebudowano silnik multimedialny (Faza 2). Zdjęcia są teraz przechowywane asynchronicznie w przestrzeni OPFS/IndexedDB. Znacznie zmniejszono obciążenie bazy SQL i przyspieszono ładowanie aplikacji!
      - generic [ref=e206]:
        - heading "Wersja v2026.8.25.03 (2026-08-25)" [level=4] [ref=e207]
        - list [ref=e208]:
          - listitem [ref=e209]: "🚀 BAZA DANYCH 2.0 (OPFS): Przeniesiono silnik bazy SQLite z głównego wątku do Web Workera (dbWorker). Odblokowano bezstratny zapis gigabajtów danych bez ryzyka wyczerpania localStorage! Ponadto operacje masowe zyskały asynchroniczne transakcje, co czyni apkę diabelnie szybką. ⚡"
      - generic [ref=e210]:
        - heading "Wersja v2026.8.25.02 (2026-08-25)" [level=4] [ref=e211]
        - list [ref=e212]:
          - listitem [ref=e213]: "🥗 DIETA UI: Powiększono czcionki dla makro i przycisków akcji, wyrównano szerokość przycisków, a korekta kalorii działa teraz precyzyjnie (o 1 kcal) z możliwością wpisania z klawiatury!"
      - generic [ref=e214]:
        - heading "Wersja v2026.8.25.01 (2026-08-25)" [level=4] [ref=e215]
        - list [ref=e216]:
          - listitem [ref=e217]: "📸 DIETA: Dodano podgląd miniatur dla analizowanych posiłków ze zdjęć oraz nowe okno potwierdzenia wyniku sztucznej inteligencji, pozwalające ręcznie dostosować (+/-) wykryte kalorie przed zapisaniem ich do dziennika!"
      - generic [ref=e218]:
        - heading "Wersja v2026.8.24.04 (2026-08-24)" [level=4] [ref=e219]
        - list [ref=e220]:
          - listitem [ref=e221]: "🌐 PWA OFFLINE (STABILNOŚĆ): Naprawiono błąd 'DietAI Error', który zawieszał aplikację przy braku dostępu do internetu. Dodano regułę omijającą cache dla wszystkich połączeń z chmurą Cloudflare (workers.dev). Teraz w przypadku braku sieci aplikacja natychmiast wyświetli czytelny komunikat 'No internet connection', pozwalając na dalszą pracę offline!"
      - generic [ref=e222]:
        - heading "Wersja v2026.8.24.03 (2026-08-24)" [level=4] [ref=e223]
        - list [ref=e224]:
          - listitem [ref=e225]: "🐞 HISTORIA TRENINGÓW (POPRAWKA): Rozszerzono logikę wyświetlania 'Bloków Łączonych' (Superserii) na główny, duży panel podglądu w zakładce Historii (modal po kliknięciu detali treningu). Wcześniej superserie w tym miejscu wyświetlały się błędnie jako 'Nieznane ćwiczenie'. Teraz widzisz piękną listę swoich superserii!"
      - generic [ref=e226]:
        - heading "Wersja v2026.8.24.02 (2026-08-24)" [level=4] [ref=e227]
        - list [ref=e228]:
          - listitem [ref=e229]: "💪 WŁASNE ĆWICZENIA (Prywatny Katalog): Wszystkie Twoje własne ćwiczenia wpisywane z palca w Treningu i Kreatorze trafiają teraz automatycznie do prywatnego katalogu! Będą pojawiać się jako podpowiedzi przy kolejnych treningach."
          - listitem [ref=e230]: "📝 KREATOR SZABLONÓW: Opcja masowej edycji 'Zastosuj do wszystkich' została zmieniona na 'Zastosuj do zaznaczonych'. Możesz teraz łatwo odznaczać ćwiczenia, by masowo zmieniać parametry tylko dla wybranych z nich!"
          - listitem [ref=e231]: "🏃IKONY TYPU ĆWICZENIA: Przycisk zmiany typu (Siłowe 🏋️ / Cardio 🏃) w Kreatorze i podczas Treningu zyskał dodatkowy opis tekstowy, aby było w 100% jasne, że jest on klikalny i do czego służy."
          - listitem [ref=e232]: "🔎 HISTORIA TRENINGU: Naprawiono błąd wyświetlania 'Nieznane ćwiczenie' w podglądzie historii, gdy wykonywano Superserie (Bloki Łączone). Teraz w podglądzie wyraźnie widać nagłówek 'Blok Łączony' i listę wykonanych pod-ćwiczeń wraz z seriami."
          - listitem [ref=e233]: "🚴 ZAJĘCIA ZORGANIZOWANE: Powrót kategorii 'Zajęcia zorganizowane' do głównego katalogu (Tabata, Crossfit, Zumba, Spinning itp.)."
          - listitem [ref=e234]: "🐞 POPRAWKI BŁĘDÓW: Wyeliminowano krytyczny błąd podczas klonowania starych treningów, który powodował załamanie aplikacji (TypeError przy wczytywaniu serii). Twoje stare plany są znów w 100% bezpieczne do klonowania!"
      - generic [ref=e235]:
        - heading "Wersja v2026.8.24.01 (2026-08-24)" [level=4] [ref=e236]
        - list [ref=e237]:
          - listitem [ref=e238]: "🚀 KREATOR PLANU (KOSZYK): Przebudowa interfejsu (UX). Baza Ćwiczeń uruchamia się teraz eleganckim panelem pop-up (Modal) po kliknięciu 'Dodaj ćwiczenie', eliminując uciążliwe przewijanie ekranu! Pasek 'Zastosuj do wszystkich' powędrował na samą górę, by zawsze był pod ręką. 🛒"
          - listitem [ref=e239]: "🏋️ WŁASNE ĆWICZENIA: Wprowadzanie własnych nazw ćwiczeń posiada od teraz intuicyjny przełącznik (ikona 🏋️/🏃), który natychmiast klasyfikuje ćwiczenie jako Siłowe lub Cardio, zachowując czystość interfejsu na jednym ekranie (bez zajmującej miejsce listy wyboru)."
          - listitem [ref=e240]: "🔗 SUPERSERIE (BLOK ŁĄCZONY): Całkowicie przebudowano wygląd bloków łączonych (superserii). Usunięto zbędne boczne marginesy na telefonach, przez co cała szerokość ekranu jest teraz dostępna dla przycisków i nazw - koniec z ucinanymi tekstami na małych urządzeniach! Dodatkowo tworzenie superserii z automatu ładuje 1 ćwiczenie (zamiast 2), przyspieszając pracę."
          - listitem [ref=e241]: "🐞 HOTFIX (Crash): Naprawiono krytyczny błąd powodujący crash przy klikaniu 'Skopiuj do tego dnia' w starszych treningach posiadających superserie."
          - listitem [ref=e242]: "🥗 DIETA: Klonowanie (kopiowanie) raz dodanych posiłków jest już dostępne za jednym kliknięciem! Dodatkowo zrezygnowano z wymuszania włączania aparatu przy dodawaniu zdjęć w Diecie – po kliknięciu 'Dodaj zdjęcie' telefon naturalnie zapyta, czy otworzyć aparat, czy wybrać fotkę z galerii. Obliczanie zapotrzebowania jest teraz wspierane dużym, pomarańczowym i soczystym przyciskiem! 🍽️"
      - generic [ref=e243]:
        - heading "Wersja v2026.8.22.08 (2026-08-22)" [level=4] [ref=e244]
        - list [ref=e245]:
          - listitem [ref=e246]: "🐞 HOTFIX (Numpad): Zastosowano ostateczne poprawki blokujące ucinanie i wychodzenie kalkulatora poza prawą krawędź ekranu. Zmieniono pozycjonowanie na elastyczne 'width: 100vw' w połączeniu z blokadą 'max-width' – koniec ze znikającymi przyciskami 'Zamknij' oraz cyframi, formatka idealnie wpasowuje się w każdy smartfon! 📱💪"
      - generic [ref=e247]:
        - heading "Wersja v2026.8.22.07 (2026-08-22)" [level=4] [ref=e248]
        - list [ref=e249]:
          - listitem [ref=e250]: "🛡️ Dodatkowe zabezpieczenie RWD: Zastosowano pozycjonowanie 'left/right' (zamiast sztywnego width) dla Eksperymentalnego Numpada, by gwarantować idealne dopasowanie kalkulatora na absolutnie każdym modelu smartfona."
      - generic [ref=e251]:
        - heading "Wersja v2026.8.22.06 (2026-08-22)" [level=4] [ref=e252]
        - list [ref=e253]:
          - listitem [ref=e254]: "📱 Poprawiono responsywność Eksperymentalnego Numpada: Klawiatura i ekran z wpisywaną wartością (kg) idealnie dopasowują się teraz do szerokości każdego ekranu (naprawiono ucinanie prawej krawędzi)."
      - generic [ref=e255]:
        - heading "Wersja v2026.8.22.05 (2026-08-22)" [level=4] [ref=e256]
        - list [ref=e257]:
          - listitem [ref=e258]: "📟 Kalkulator z prawdziwego zdarzenia: Dodano duży ekran wyświetlający aktualnie wpisywane wartości bezpośrednio nad Eksperymentalnym Numpadem!"
          - listitem [ref=e259]: "🧹 Minimalizm: Usunięto przestarzałe i nieużywane przyciski Spotify i YT Music, robiąc miejsce na to co ważne - trening."
          - listitem [ref=e260]: 📝 Wybaczcie błąd techniczny! Poprawiono usterkę z wersji .04, która wyświetlała roboczy tekst w okienku zmian.
      - generic [ref=e261]:
        - heading "Wersja v2026.8.22.04 (2026-08-22)" [level=4] [ref=e262]
        - list [ref=e263]:
          - listitem [ref=e264]: Wdrożenie techniczne ekranu Numpada i czyszczenie interfejsu (Brak opisu).
      - generic [ref=e265]:
        - heading "Wersja v2026.8.22.03 (2026-08-22)" [level=4] [ref=e266]
        - list [ref=e267]:
          - listitem [ref=e268]: "🛠️ HOTFIX: Naprawiono krytyczny błąd w Laboratorium (Brak zdefiniowanej zmiennej isBodyweight), który powodował brak reakcji przycisku 'Dodaj Serię' na całkowicie pustym ćwiczeniu."
      - generic [ref=e269]:
        - heading "Wersja v2026.8.22.02 (2026-08-22)" [level=4] [ref=e270]
        - list [ref=e271]:
          - listitem [ref=e272]: "🚀 Laboratorium (BETA): Całkowicie nowy, eksperymentalny interfejs Numpada i Smart Stepperów podczas treningu! (Włączysz go w Ustawieniach)"
          - listitem [ref=e273]: "📈 Kreator Szablonów: Dodano obsługę wartości po przecinku podczas masowego ustawiania serii, by jednym kliknięciem budować piramidy (np. 100,110,120 kg)!"
          - listitem [ref=e274]: 🐞 Poprawiono zgłaszany błąd w kalendarzu, w którym po udanym zakończeniu treningu system nie odświeżał zielonej kropki bez twardego restartu.
          - listitem [ref=e275]: 👑 Zaktualizowano system weryfikacji tokenów PRO - aplikacja już prawidłowo wyświetla wersję Heavy na panelu głównym po wpisaniu ważnego hasła!
      - generic [ref=e276]:
        - heading "Wersja v2026.8.22.01 (2026-08-22)" [level=4] [ref=e277]
        - list [ref=e278]:
          - listitem [ref=e279]: "✨ Wdrożenie Fazy Opcji 3: Dedykowany, nowiutki Kreator Szablonów (Koszyk) na nowej, przejrzystej karcie!"
          - listitem [ref=e280]: "🛒 Przebudowany interfejs koszykowy: Wybierasz ćwiczenia z bazy i masowo aplikujesz wszystkim ilość serii, powtórzeń, oraz ciężar (z uwzględnieniem wartości na minus dla maszyn ze wspomaganiem!)."
          - listitem [ref=e281]: 🔗 Kreator można odpalić prosto z panelu treningowego jako nowy, bezpieczny widok.
      - generic [ref=e282]:
        - heading "Wersja v2026.8.21.03 (2026-08-21)" [level=4] [ref=e283]
        - list [ref=e284]:
          - listitem [ref=e285]: "🕵️‍♂️ Analityk w akcji: System otrzymał głęboki raport UX dotyczący obsługi dotykowej, co przygotowuje grunt pod wielkie zmiany w interfejsie dodawania ćwiczeń (Swipe, Numpad, Smart Steppery)!"
          - listitem [ref=e286]: "📝 Changelog na sterydach: Załataliśmy lukę, przez którą system wrzucał domyślny i 'suchy' opis przy nowych aktualizacjach. Od teraz każda łatka musi mieć pełne opisy z emotikonami, bo tak rzecze prawo! ⚖️"
      - generic [ref=e287]:
        - heading "Wersja v2026.8.21.02 (2026-08-21)" [level=4] [ref=e288]
        - list [ref=e289]:
          - listitem [ref=e290]: "⏱️ Czas trwania powiadomień: Zoptymalizowaliśmy trenera Edwarda. Jego chmurki z podpowiedziami znikają teraz po idealnych 6 sekundach."
          - listitem [ref=e291]: "📅 Przypomnienie o Trialu: Dodaliśmy mechanizm, który po wygaśnięciu okresu próbnego (status Light) przypomina o możliwości odblokowania wersji PRO tylko raz dziennie na starcie aplikacji, szanując Twój czas."
          - listitem [ref=e292]: "🚀 Kolejne szlify aktualizatora: Wypuściliśmy wersję .02, aby upewnić się, że pobieranie PWA działa już całkowicie bezproblemowo!"
      - generic [ref=e293]:
        - heading "Wersja v2026.8.21.01 (2026-08-21)" [level=4] [ref=e294]
        - list [ref=e295]:
          - listitem [ref=e296]: "👑 Zmiana formatowania licencji: Informacja o dostępie (Heavy / Trial / Light) została przeniesiona na dół pulpitu, tuż przed numerem wersji (np. Trial v2026.8.21.01)."
          - listitem [ref=e297]: "📜 Czytelniejszy pulpit: Link 'Zobacz co nowego (Changelog)' oraz okno z odliczaniem dni próbnych przeniesiono do sekcji 'Ustawienia i Profil', aby zapewnić maksymalny minimalizm na głównym ekranie."
          - listitem [ref=e298]: "🛠️ Naprawa okienek do wpisywania ciężaru: Zwiększyliśmy szerokość pól tekstowych dla obciążeń z 48px na 62px – teraz trzycyfrowe wartości (np. 135 kg) mieszczą się idealnie i cyfry nie są ucinane!"
          - listitem [ref=e299]: "🐞 Krytyczna poprawka aktualizacji (Bugfix): Naprawiono błąd w systemie wersjonowania, który powodował irytującą 'pętlę aktualizacji' oraz błędy Service Workera."
      - generic [ref=e300]:
        - heading "Wersja v2026.8.20.03 (2026-08-20)" [level=4] [ref=e301]
        - list [ref=e302]:
          - listitem [ref=e303]: 🔧 Wdrożenie dedykowanego narzędzia (w zakładce Diagnostyka) do automatycznego mapowania i unifikacji starych nazw ćwiczeń (np. 'wyciskanie płaska' -> 'Klatka - Wyciskanie sztangi - Ławka płaska') we wszystkich Twoich historycznych treningach.
          - listitem [ref=e304]: "📈 Wdrożenie Fazy 8 (Analityka): Dodano interaktywny Wykres Progresu dla konkretnych ćwiczeń w zakładce Analiza Progresu."
          - listitem [ref=e305]: 📊 Możliwość wyboru dowolnego ćwiczenia z rozwijanej listy i śledzenia historii maksymalnego podniesionego ciężaru (oraz powtórzeń) na przestrzenni czasu w formie estetycznego wykresu słupkowego.
      - generic [ref=e306]:
        - heading "Wersja v2026.8.20.01 (2026-08-20)" [level=4] [ref=e307]
        - list [ref=e308]:
          - listitem [ref=e309]: "👑 Wdrożenie Fazy 7: Model Freemium. Aplikacja rozróżnia wersję Light oraz Heavy (PRO). Użytkownicy Light nie mają dostępu do funkcji AI po 7 dniach."
          - listitem [ref=e310]: Dodanie banera Premium na ekranie startowym (Dashboard), który odlicza dni Trial i informuje o statusie (Trial / Light / PRO).
          - listitem [ref=e311]: "Poprawa działania Superserii: Dodawany jest jeden pusty blok ćwiczenia z możliwością rozszerzania go za pomocą dedykowanego przycisku '+ Kolejne ćwiczenie (Superseria)'."
          - listitem [ref=e312]: Przebudowa wyglądu okna Superserii (ujednolicona szerokość i usunięto podwójne obramowanie, które sprawiało problemy na mniejszych ekranach).
          - listitem [ref=e313]: "Cardio: Umożliwienie ręcznego wpisania czasu treningu w minutach zamiast używania stopera."
          - listitem [ref=e314]: "Interfejs: Nowy, ładniejszy wygląd przycisków odtwarzaczy Spotify oraz YouTube Music."
      - generic [ref=e315]:
        - heading "Wersja v2026.8.19.1 (2026-08-19)" [level=4] [ref=e316]
        - list [ref=e317]:
          - listitem [ref=e318]: "📚 Wygodny Katalog Ćwiczeń: Zamiast ukrytej listy (która nie chciała działać na iPhone'ach), obok nazwy ćwiczenia znajdziesz teraz dedykowany przycisk '📚 Katalog', który otwiera czytelne okno wyboru."
          - listitem [ref=e319]: "🗂️ Podział na partie mięśniowe: Katalog w pierwszej kolejności pozwala wybrać partię (np. Plecy, Klatka), a dopiero potem konkretne ćwiczenie, skracając listę i ułatwiając szukanie."
          - listitem [ref=e320]: "📱 Ulepszona Responsywność Serii: Pola ciężaru i powtórzeń zostały zwężone i ciaśniej ułożone, dzięki czemu nawet przy dużym skalowaniu czcionki na ekranach iPhone'a przyciski się nie nachodzą i nie uciekają z ekranu."
          - listitem [ref=e321]: "🔄 Fix Aktualizacji: Ostatecznie naprawiono błąd powodujący ciągłe pojawianie się paska 'Dostępna nowa aktualizacja' mimo poprawnego zainstalowania nowej wersji."
      - generic [ref=e322]:
        - heading "Wersja v2026.8.18.1 (2026-08-18)" [level=4] [ref=e323]
        - list [ref=e324]:
          - listitem [ref=e325]: "📚 Wbudowany Katalog Ćwiczeń: dodając ćwiczenie otrzymujesz inteligentne podpowiedzi z ujednoliconego słownika."
          - listitem [ref=e326]: "🚀 Automatyczna Migracja Historii: Twoje stare nazwy ćwiczeń (np. Klatka płaska) zostały zaktualizowane w całej historii do profesjonalnych odpowiedników z katalogu."
          - listitem [ref=e327]: "🏆 Czytelniejsze Rekordy Siłowe: W Analizie Progresu główny wynik (Ciężar x Powtórzenia) jest teraz na pierwszym planie, a szacowane 1RM pełni rolę wspierającą."
          - listitem [ref=e328]: "📱 Ulepszona Responsywność: Rekordy wyświetlają się perfekcyjnie na każdym ekranie i przy dużej czcionce dzięki płynnemu zawijaniu (flex-wrap)."
          - listitem [ref=e329]: "🎨 Szlify estetyczne udostępniania: Z karty podsumowującej treningi do social mediów zniknęła nadmiarowa, niebieska stopka."
      - generic [ref=e330]:
        - heading "Wersja v2026.8.17.4 (2026-08-17)" [level=4] [ref=e331]
        - list [ref=e332]:
          - listitem [ref=e333]: "🎨 Czysty layout grafiki do social mediów: Usunięto nakładający się niebieski napis ze stopki wygenerowanego obrazu."
          - listitem [ref=e334]: "📐 Inteligentne skalowanie: Rekordy siłowe na wygenerowanej karcie są teraz dynamicznie rozmieszczane, aby idealnie wypełniać kadr bez obcinania tekstu."
      - generic [ref=e335]:
        - heading "Wersja v2026.8.17.3 (2026-08-17)" [level=4] [ref=e336]
        - list [ref=e337]:
          - listitem [ref=e338]: "📤 Udostępnianie Rekordów Siłowych: Dodano dedykowany przycisk generujący estetyczną grafikę z Twoimi najlepszymi wynikami siłowymi, gotową do publikacji na Instagramie lub Facebooku."
      - generic [ref=e339]:
        - heading "Wersja v2026.8.17.2 (2026-08-17)" [level=4] [ref=e340]
        - list [ref=e341]:
          - listitem [ref=e342]: "🏆 Precyzja faktów: Kafelki Rekordów Siłowych pokazują teraz Rzeczywisty Podniesiony Ciężar (np. 100 kg w 10 powtórzeniach), a szacowany wskaźnik 1RM prezentowany jest jako dodatkowa, czytelna ciekawostka."
      - generic [ref=e343]:
        - heading "Wersja v2026.8.17.1 (2026-08-17)" [level=4] [ref=e344]
        - list [ref=e345]:
          - listitem [ref=e346]: "🏆 Nowa sekcja w Analizie Progresu: Twoje Rekordy Siłowe (Szacowane 1RM). Aplikacja automatycznie wylicza Twój szacowany maksymalny ciężar na 1 powtórzenie (wzorem Epleya) z najlepszych serii roboczych."
          - listitem [ref=e347]: "💡 Wyczerpujące wyjaśnienie wskaźnika 1RM: Dodano interaktywny modal informacyjny wyjaśniający, czym jest 1RM, dlaczego szacujemy go matematycznie zamiast ryzykować kontuzję oraz jak dobierać obciążenia robocze."
      - generic [ref=e348]:
        - heading "Wersja v2026.8.15.3 (2026-08-15)" [level=4] [ref=e349]
        - list [ref=e350]:
          - listitem [ref=e351]: "✨ Poprawiono ergonomię ikony Informacji (ℹ️): kliknięcie w ikonę przy Tonażu Ciała otwiera teraz elegancki modal wyjaśniający obliczenia kalisteniczne na urządzeniach mobilnych."
          - listitem [ref=e352]: 🎩 Ujednolicono ton wypowiedzi Trenera Edwarda w module atlasu mięśni na w pełni profesjonalny i merytoryczny.
      - generic [ref=e353]:
        - heading "Wersja v2026.8.15.2 (2026-08-15)" [level=4] [ref=e354]
        - list [ref=e355]:
          - listitem [ref=e356]: 🔥 [HOTFIX] Wdrożenie Wykresu Hybrydowego i nowych kafelków w Analizie Progresu.
      - generic [ref=e357]:
        - heading "Wersja v2026.8.15.1 (2026-08-15)" [level=4] [ref=e358]
        - list [ref=e359]:
          - listitem [ref=e360]: "🔥 Wdrożono Wykres Hybrydowy w Analizie Progresu: pełne wsparcie dla treningów Cardio oraz Zajęć Zorganizowanych (Hyrox, Crossfit, Zumba, Spinning)."
          - listitem [ref=e361]: 📈 Koniec z 0 kg! Paski dla aktywności tlenowych mają teraz dedykowane kolory (Ognisty dla Zajęć, Niebieski dla Cardio) i prezentują spalone kalorie (kcal), średnie tętno (bpm) oraz czas trwania.
          - listitem [ref=e362]: 📊 Dodano nowy kafelek analityczny ze statystykami spalonych kalorii z zegarków (Smartwatch) na samej górze ekranu analizy.
          - listitem [ref=e363]: "🧠 Inteligentny komparator trendu: aplikacja rozróżnia sesje siłowe od tlenowych, nie porównując błędnie tonażu między różnymi dyscyplinami."
      - generic [ref=e364]:
        - heading "Wersja v2026.8.14.22 (2026-08-14)" [level=4] [ref=e365]
        - list [ref=e366]:
          - listitem [ref=e367]: 🛠 Poprawiono kolejny błąd mapowania danych bazy podczas importu, tym razem w obrębie tabel dziennika diety (usunięto nieistniejące kolumny ze skryptu wczytującego).
          - listitem [ref=e368]: "📝 Ulepszono moduł logowania błędów: błędy podczas przywracania danych będą teraz zawsze poprawnie zapisywane w systemie logów Diagnostyki."
      - generic [ref=e369]:
        - heading "Wersja v2026.8.14.21 (2026-08-14)" [level=4] [ref=e370]
        - list [ref=e371]:
          - listitem [ref=e372]: 🛠 Naprawiono schemat importu bazy danych, który blokował prawidłowe przywrócenie archiwum z powodu niedopasowania nazw nowych kolumn z typami treningów.
      - generic [ref=e373]:
        - heading "Wersja v2026.8.14.20 (2026-08-14)" [level=4] [ref=e374]
        - list [ref=e375]:
          - listitem [ref=e376]: "🛠 Naprawiono krytyczny błąd w zakładce Diagnostyka: przyciski (np. Przywróć z Pliku, Utwórz Archiwum) przestały reagować na kliknięcia, jeśli system nie miał zapisanych żadnych logów błędów."
      - generic [ref=e377]:
        - heading "Wersja v2026.8.14.19 (2026-08-14)" [level=4] [ref=e378]
        - list [ref=e379]:
          - listitem [ref=e380]: "📱 Poprawiono układ graficzny wizytówki: Przycisk wsparcia (Postaw Kawę) teraz perfekcyjnie dopasowuje się do szerokości ekranów smartfonów, unikając niepotrzebnego ucinania."
      - generic [ref=e381]:
        - heading "Wersja v2026.8.14.18 (2026-08-14)" [level=4] [ref=e382]
        - list [ref=e383]:
          - listitem [ref=e384]: ☕ Wdrożenie Modułu Monetyzacji (AI Premium). Narzędzia sztucznej inteligencji (Trener Edward oraz Analiza Zdjec Diety) są teraz dostępne za darmo przez pierwsze 7 dni od uruchomienia aplikacji. Następnie wymagają odblokowania tokenem wsparcia poprzez Suppi (Postaw Kawę).
          - listitem [ref=e385]: 🔗 Dodano dedykowany przycisk wsparcia (Postaw Kawę) bezpośrednio na ekranie startowym (Wizytówce) aplikacji.
      - generic [ref=e386]:
        - heading "Wersja v2026.8.14.17 (2026-08-14)" [level=4] [ref=e387]
        - list [ref=e388]:
          - listitem [ref=e389]: 📅 Wprowadzono opcję *Przywracania* odwołanych treningów. Usunięto błąd logiki, przez który odwołany z harmonogramu trening wciąż świecił się na czerwono bez możliwości interakcji.
          - listitem [ref=e390]: 📱 Poprawiono szerokość wierszy dla Dropsetów wewnątrz Super-Serii. Słowo *Dropset* zostało zastąpione intuicyjnym *↳ 🔥*, co wraz z redukcją marginesu całkowicie eliminuje problem nie mieszczących się elementów na małych ekranach przy dużej czcionce.
      - generic [ref=e391]:
        - heading "Wersja v2026.8.14.16 (2026-08-14)" [level=4] [ref=e392]
        - list [ref=e393]:
          - listitem [ref=e394]: "📅 Aktualizacja logiczna kalendarza: Od teraz automatyczne harmonogramy nie wypełniają już sztucznie minionych dni miesiąca (wstecz). Pokazują się tylko od dnia dzisiejszego w przód!"
          - listitem [ref=e395]: "⚡ Natychmiastowe odświeżanie: Zmiana dni w harmonogramie modalu ładuje widok kalendarza w czasie rzeczywistym zaraz po zamknięciu okna (bez konieczności ręcznego przeładowywania)."
      - generic [ref=e396]:
        - heading "Wersja v2026.8.14.15 (2026-08-14)" [level=4] [ref=e397]
        - list [ref=e398]:
          - listitem [ref=e399]: 📅 Kalendarz Faza 4 - Harmonogramy Treningów! Dodano możliwość przypisania Szablonu Planu Treningowego do konkretnych dni tygodnia (np. każdy Poniedziałek i Środa).
          - listitem [ref=e400]: "🟢 Kalendarz zyskał inteligentne kropki: pomarańczowa (zaplanowany trening), zielona (trening zrealizowany), czerwona (trening pominięty)."
          - listitem [ref=e401]: "🏃 Automatyczne uruchamianie: Kliknięcie w zaplanowany dzień w kalendarzu pozwala od razu wczytać i rozpocząć dedykowany plan z opcją przełożenia na inny dzień."
          - listitem [ref=e402]: 🐛 Naprawiono błąd załamywania się wierszy i spadania przycisku X w widoku serii podczas skalowania dużych czcionek.
          - listitem [ref=e403]: 💾 Udoskonalono formatowanie nazwy pobieranego pełnego archiwum bazy danych o sekundy (HH-mm-ss).
      - generic [ref=e404]:
        - heading "Wersja v2026.8.14.14 (2026-08-14)" [level=4] [ref=e405]
        - list [ref=e406]:
          - listitem [ref=e407]: "📦 Pełne Archiwum Danych (Kopia Bezpieczeństwa v2.0): Udoskonalono silnik kopii zapasowej – archiwum obejmuje teraz 100% bazy SQLite (pomiary, treningi, pełną historię diety, raporty AI) oraz wszystkie ustawienia i szablony!"
          - listitem [ref=e408]: "✨ Nowoczesne Okno Szablonów Planów Treningowych: Przywrócono pełną nazwę modułu, dodano stały nagłówek z przyciskiem zamknięcia (X) oraz możliwość zamknięcia okna jednym tapnięciem w tło!"
      - generic [ref=e409]:
        - heading "Wersja v2026.8.14.13 (2026-08-14)" [level=4] [ref=e410]
        - list [ref=e411]:
          - listitem [ref=e412]: "📐 Perfekcyjne Wyrównanie w Wierszu Serii: Checkbox, numer serii, pola ciężaru/powtórzeń oraz przycisk usunięcia są teraz idealnie wyśrodkowane w pionie na jednej linii wzroku!"
          - listitem [ref=e413]: "🎯 Szablony Treningowe: Przyciski \"Wybierz\" i \"Usuń\" mają teraz idealnie równe proporcje (50%/50%) i zawsze mieszczą się w kafelku bez wyjeżdżania poza obrys."
          - listitem [ref=e414]: "✨ Symetria Przycisków Analiz: Przycisk \"Analiza Miesięczna\" zyskał identyczny, zbalansowany dwuliniowy układ jak \"Analiza Tygodniowa\"."
          - listitem [ref=e415]: "🥋 Profesjonalna Komunikacja Trenera: Oczyszczono wszystkie dymki Trenera Edwarda z wulgaryzmów – teraz komunikaty są w 100% profesjonalne, motywujące i z lekkim, sportowym humorem!"
      - generic [ref=e416]:
        - heading "Wersja v2026.8.14.12 (2026-08-14)" [level=4] [ref=e417]
        - list [ref=e418]:
          - listitem [ref=e419]: "🧠 Pełny Wywiad i Makroskładniki u Trenera Edwarda: Edward przed każdą analizą pyta teraz o sen, staż treningowy i cel sylwetkowy! Dodatkowo silnik AI przekazuje pełną gramaturę makroskładników (Białko, Węglowodany, Tłuszcze oraz Kalorie ze szczegółami każdego posiłku). Koniec z narzekaniem Edwarda na brak rozbicia makro!"
          - listitem [ref=e420]: "📋 Import Planu Treningowego z Analizy AI: Każdy trening zaproponowany przez Trenera Edwarda możesz teraz jednym kliknięciem (\"📋 Plan\") zapisać jako gotowy Szablon Treningowy i od razu załadować go na siłowni!"
          - listitem [ref=e421]: "🔙 Intuicyjna Nawigacja w Raporcie: Dodano wyraźny przycisk powrotu do aplikacji u góry i na samym dole raportu z zachowaniem bezpiecznego marginesu pod Dynamic Island / Notch na iPhone."
      - generic [ref=e422]:
        - heading "Wersja v2026.8.14.11 (2026-08-14)" [level=4] [ref=e423]
        - list [ref=e424]:
          - listitem [ref=e425]: "🛠️ Dopracowanie layoutu Serii: Zastosowano zaawansowany CSS, dzięki któremu, jeśli wiersz z Serią, polami wagi/powtórzeń i ikoną usuwania zmieści się na ekranie – zostanie ułożony elegancko w jednym wierszu. Dopiero gdy czcionka jest za duża i brakuje miejsca, inputy naturalnie centrują się pod spodem. Czysta magia front-endu!"
      - generic [ref=e426]:
        - heading "Wersja v2026.8.14.10 (2026-08-14)" [level=4] [ref=e427]
        - list [ref=e428]:
          - listitem [ref=e429]: "🔥 Responsywny formularz Serii: Całkowicie przebudowano wygląd wprowadzania powtórzeń i ciężaru. Pola są teraz niezależne i pięknie wyśrodkowane na ekranie. Koniec z nachodzącymi na siebie przyciskami (szczególnie widocznymi przy dużych czcionkach w systemie iOS!)."
          - listitem [ref=e430]: "🎨 Nowy wygląd Szablonów: Przebudowano modal z zapisanymi planami treningowymi. O wiele czystszy układ z nazwą jako tytułem na środku, dokładnymi informacjami o przewidywanym czasie (jeśli zapisano z historii) oraz z wygodnymi przyciskami na całą szerokość ekranu."
      - generic [ref=e431]:
        - heading "Wersja v2026.8.14.09 (2026-08-14)" [level=4] [ref=e432]
        - list [ref=e433]:
          - listitem [ref=e434]: "🛠️ Potężna Kopii Zapasowa (Diagnoza): Teraz funkcja Eksportu w zakładce Diagnostyka zapisuje absolutnie WSZYSTKO – treningi, pomiary, ustawienia (awatar, nick, szablony), dziennik diety oraz analizy Trenera Edwarda. Śmiało możesz reinstalować aplikację z czystym sumieniem!"
          - listitem [ref=e435]: "🎨 Kolejne szlify Treningu: Poprawiono wyrównanie pól wprowadzania ciężaru przy dużym rozmiarze czcionki na ekranie (zawijanie wierszy z zachowaniem wyśrodkowania)."
      - generic [ref=e436]:
        - heading "Wersja v2026.8.14.08 (2026-08-14)" [level=4] [ref=e437]
        - list [ref=e438]:
          - listitem [ref=e439]: "🎨 Szlify interfejsu (UX/UI): Zoptymalizowano rozmiar i proporcje nowych, powiększonych pól wprowadzania ciężaru i powtórzeń w trakcie treningu (pozbyto się czarnych kwadratów), żeby aplikacja wyglądała świetnie i profesjonalnie na ekranie smartfona!"
      - generic [ref=e440]:
        - heading "Wersja v2026.8.14.07 (2026-08-14)" [level=4] [ref=e441]
        - list [ref=e442]:
          - listitem [ref=e443]: "🛠️ Hotfix: Szybka naprawa krytycznego błędu (tzw. zawieszenie na Loading), który wdarł się do najnowszego modułu treningowego. Teraz wszystko znowu śmiga płynnie! Przepraszamy za usterkę."
      - generic [ref=e444]:
        - heading "Wersja v2026.8.14.06 (2026-08-14)" [level=4] [ref=e445]
        - list [ref=e446]:
          - listitem [ref=e447]: "✨ NOWOŚĆ: Przebudowano interfejs aktywnego treningu — powiększono pola wprowadzania wagi i powtórzeń dla lepszej widoczności podczas ćwiczeń (Styl 'Large Input')."
          - listitem [ref=e448]: "✨ NOWOŚĆ: Kalendarz Historii Treningów wzbogacony o nowy przycisk '🔍 Podgląd'. Kliknięcie pozwala na szybkie podejrzenie pełnych statystyk odbytego treningu w formie estetycznego modala, bez opuszczania widoku kalendarza."
          - listitem [ref=e449]: "✨ NOWOŚĆ: Historia Treningów zyskała przycisk '📝 Zapisz jako plan treningowy'. Możesz teraz jednym kliknięciem przerobić swój wyśmienity trening w gotowy do powtórzenia szablon na przyszłość!"
          - listitem [ref=e450]: "✨ NOWOŚĆ: Możliwość określenia swojego 'Stażu Treningowego' w Profilu. Informacja ta w połączeniu z historią jest przekazywana do Trenera Edwarda, aby ten celniej dobierał obciążenia i złożoność ćwiczeń."
          - listitem [ref=e451]: "✨ NOWOŚĆ: Panel Trenera Edwarda zyskał przycisk '💾 Zapisz raport (TXT)'. Teraz każdą cenną analizę AI możesz wyeksportować i zabrać ze sobą w pliku."
          - listitem [ref=e452]: "🚨 HOTFIX: Całkowicie wyeliminowano problem braku reakcji aplikacji przy wyczerpanym limicie 429 API, dodano czytelne ekrany informujące o przekroczeniu darmowej puli (Quota)."
          - listitem [ref=e453]: "🚨 HOTFIX: Usunięto krytyczny błąd w Diagnostyce, który uniemożliwiał wyeksportowanie kopii zapasowej całej bazy danych w formacie JSON."
      - generic [ref=e454]:
        - heading "Wersja v2026.8.14.04 (2026-08-14)" [level=4] [ref=e455]
        - list [ref=e456]:
          - listitem [ref=e457]: "✨ NOWOŚĆ: Przebudowano Szablony Treningowe na Plany Treningowe z edycją ćwiczeń w locie (Checkboxy)."
          - listitem [ref=e458]: 🤖 Trener Edward po szkoleniu! Oferuje teraz głębszą, profesjonalną analizę medyczną z uwzględnieniem objętości i splitu.
          - listitem [ref=e459]: "🚨 HOTFIX: Wymuszona aktualizacja naprawiająca zaciętą pętlę ekranu nowości PWA (Problem wersji .03 rozwiązywany bezwzględnie)."
      - generic [ref=e460]:
        - heading "Wersja v2026.8.14.03 (2026-08-14)" [level=4] [ref=e461]
        - list [ref=e462]:
          - listitem [ref=e463]: "🚨 HOTFIX: Poprawa obsługi błędów 429 dla Trenera Edwarda (Komunikaty o limitach API)."
      - generic [ref=e464]:
        - heading "Wersja v2026.8.14.02 (2026-08-14)" [level=4] [ref=e465]
        - list [ref=e466]:
          - listitem [ref=e467]: "🚨 HOTFIX: Wymuszona aktualizacja z lepszą obsługą komunikatów o wyczerpaniu limitów API oraz poprawionym tekstem w analityce."
      - generic [ref=e468]:
        - heading "Wersja v2026.8.14.01 (2026-08-14)" [level=4] [ref=e469]
        - list [ref=e470]:
          - listitem [ref=e471]: "✨ NOWOŚĆ: Strona Wizytówkowa (Landing Page). Od teraz aplikacja dostępna jest w 100% z poziomu ikony PWA, a w przeglądarce wyświetla instrukcję instalacji."
      - generic [ref=e472]:
        - heading "Wersja v2026.8.13.04 (2026-08-13)" [level=4] [ref=e473]
        - list [ref=e474]:
          - listitem [ref=e475]: "🚨 HOTFIX: Wymuszona nowa aktualizacja, w której ostatecznie zsynchronizowaliśmy typy danych (images) dla serwera AI."
      - generic [ref=e476]:
        - heading "Wersja v2026.8.13.03 (2026-08-13)" [level=4] [ref=e477]
        - list [ref=e478]:
          - listitem [ref=e479]: "🚨 HOTFIX: Ostateczna naprawa komunikacji analiz AI z bazą SQLite oraz prawidłowe przesyłanie kontekstu do Cloudflare Workera."
      - generic [ref=e480]:
        - heading "Wersja v2026.8.13.02 (2026-08-13)" [level=4] [ref=e481]
        - list [ref=e482]:
          - listitem [ref=e483]: "✨ UX: Ujednolicono i powiększono czcionkę we wszystkich polach konfiguracji Profilu (Pomiary, Cele) oraz Ustawień."
          - listitem [ref=e484]: "🚨 HOTFIX: Złagodzono irytujące zjeżdżanie ekranu (focus) na 'Opcje Treningu' po kliknięciu głównego kafelka 'Treningi', co pozwala teraz normalnie obejrzeć kalendarz."
          - listitem [ref=e485]: "🚨 HOTFIX: Przycisk 'Pochwal się odznakami' w Ustawieniach znowu działa i generuje Twoje zrzuty z pucharami!"
          - listitem [ref=e486]: "🧪 TESTY: 100% stabilności E2E Playwright - środowisko przygotowane do wypuszczenia sub-agentów!"
  - button "🤖" [ref=e488] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Złożony scenariusz zapisu treningu z draftem', () => {
  4  |   test('Powinien zapisać trening z dropsetami, superseriami, cardio i czasem ręcznym bez utraty danych', async ({ page }) => {
  5  |     // Navigate to the app (assuming it's served locally during tests)
  6  |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });
  7  |     await page.goto('/');
  8  | 
  9  |     // Wait for the app to load
  10 |     await page.waitForSelector('.app-wrapper');
  11 | 
  12 |     // Go to Training tab
  13 |     await page.click('a[data-tab="training-dashboard"]');
  14 | 
  15 |     // Select day 15 first
  16 |     await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));
  17 | 
  18 |     // Start a new session
> 19 |     await page.click('#start-new-session-btn');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  20 |     await page.waitForSelector('#active-training-view', { state: 'visible' });
  21 | 
  22 |     // Set Name
  23 |     await page.fill('#training-name-input', 'Klatka triceps barki');
  24 | 
  25 |     // 1st Exercise: Klatka (Main)
  26 |     const exerciseInputs = page.locator('.exercise-name-input');
  27 |     await exerciseInputs.nth(0).fill('Wyciskanie klatki');
  28 |     
  29 |     // Add 9 sets
  30 |     for(let i=0; i<8; i++) {
  31 |         await page.click('text=+ Seria');
  32 |     }
  33 |     
  34 |     // Fill first set
  35 |     await page.locator('input[id^="weight-"]').nth(0).fill('50');
  36 |     await page.locator('input[id^="reps-"]').nth(0).fill('20');
  37 | 
  38 |     // 2nd Exercise: Wzno Klatka
  39 |     await page.click('#add-exercise-to-plan-btn');
  40 |     await exerciseInputs.nth(1).fill('Wzno Klatka');
  41 |     await page.locator('input[id^="weight-"]').nth(1).fill('3');
  42 |     await page.locator('input[id^="reps-"]').nth(1).fill('10');
  43 | 
  44 |     // 3rd Exercise: Superset (Wzno Klatka + Barki)
  45 |     await page.click('#add-superset-to-plan-btn');
  46 |     await exerciseInputs.nth(2).fill('Wzno Klatka (Superseria)');
  47 |     await exerciseInputs.nth(3).fill('Barki');
  48 | 
  49 |     // Add dropsets to the first exercise of the superset
  50 |     const addDropsetBtns = page.locator('text=🔥 Dropset');
  51 |     await addDropsetBtns.nth(0).click(); // Dropset 1
  52 |     await addDropsetBtns.nth(0).click(); // Dropset 2
  53 | 
  54 |     // 4th Exercise: Orbitrek (Cardio)
  55 |     await page.click('#add-exercise-to-plan-btn');
  56 |     await exerciseInputs.nth(4).fill('Orbitrek');
  57 |     
  58 |     // Change type to cardio
  59 |     const typeSelects = page.locator('select');
  60 |     await typeSelects.nth(4).selectOption('cardio');
  61 | 
  62 |     // Start cardio
  63 |     await page.click('text=▶ Start');
  64 |     await page.waitForTimeout(1000); // Wait a second
  65 |     await page.click('text=⏹ Stop');
  66 | 
  67 |     // Toggle manual time
  68 |     await page.click('text=Wpisz czas treningu ręcznie');
  69 |     await page.fill('#manual-training-hours', '1');
  70 |     await page.fill('#manual-training-minutes', '5');
  71 | 
  72 |     // Pause the training (Simulate user pausing and returning)
  73 |     await page.click('#pause-training-btn');
  74 | 
  75 |     // Now, finish the training!
  76 |     // Handle dialog
  77 |     page.once('dialog', dialog => dialog.accept());
  78 |     await page.click('#finish-training-btn');
  79 | 
  80 |     // Wait for successful save alert
  81 |     page.once('dialog', dialog => {
  82 |         expect(dialog.message()).toContain('Trening zapisany pomyślnie!');
  83 |         dialog.accept();
  84 |     });
  85 | 
  86 |     // Check if draft was cleared
  87 |     const draft = await page.evaluate(() => localStorage.getItem('uki_active_training_draft'));
  88 |     expect(draft).toBeNull();
  89 |     
  90 |     // Ensure we're back to calendar view
  91 |     await page.waitForSelector('#training-calendar-view', { state: 'visible' });
  92 |   });
  93 | });
  94 | 
```