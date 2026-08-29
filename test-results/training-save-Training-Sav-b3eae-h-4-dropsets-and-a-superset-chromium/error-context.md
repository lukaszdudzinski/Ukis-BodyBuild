# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: training-save.spec.js >> Training Save Bug >> should save training with 4 dropsets and a superset
- Location: tests/e2e/training-save.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('a[data-tab="training-dashboard"]')
    - locator resolved to <a href="#" data-tab="training-dashboard">Trening</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="changelog-modal-overlay">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="changelog-modal-overlay">…</div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    53 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div id="changelog-modal-overlay">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
        - generic [ref=e32] [cursor=pointer]:
          - img "Logo" [ref=e33]
          - heading "Cześć, Test! 🚀" [level=2] [ref=e34]
          - paragraph [ref=e35]: Wybierz narzędzie z menu
        - generic [ref=e36]: Trial (7 dni) v2026.8.29.01
  - text: ✕
  - generic [ref=e38]:
    - generic [ref=e39]:
      - heading "Co nowego? 🚀" [level=3] [ref=e40]
      - button "×" [ref=e41] [cursor=pointer]
    - generic [ref=e43]:
      - generic [ref=e44]:
        - heading "Wersja v2026.8.29.01 (2026-08-29)" [level=4] [ref=e45]
        - list [ref=e46]:
          - listitem [ref=e47]: "🔥 Krytyczny pożar ugaszony: zrzut RAM do OPFS po każdej operacji"
          - listitem [ref=e48]: 🛟 Wdrożono moduł BackupUI z przypomnieniem JSON
          - listitem [ref=e49]: "🐛 Treningi: Naprawiono błędne ładowanie szablonu przy nowej sesji"
          - listitem [ref=e50]: "🐛 Treningi: Naprawiono błąd dodawania nowych serii"
          - listitem [ref=e51]: "🖼 Dieta: Naprawiono ładowanie miniatur z bazy MediaManager"
      - generic [ref=e52]:
        - heading "Wersja v2026.8.28.01 (2026-08-28)" [level=4] [ref=e53]
        - list [ref=e54]:
          - listitem [ref=e55]: 🐛 Naprawa błędu z szablonami treningów (brak możliwości dodawania serii po użyciu szablonu).\n🐛 Naprawa wyświetlania miniatur zdjęć w widoku Diety.\n📦 Dodano system przypomnień o codziennym archiwum bazy danych (BackupUI).\n🧹 Uporządkowano zakładkę Diagnostyka, ukrywając groźne funkcje RAW.
      - generic [ref=e56]:
        - heading "Wersja v2026.8.27.10 (2026-08-27)" [level=4] [ref=e57]
        - list [ref=e58]:
          - listitem [ref=e59]: 🐛 Naprawa utraty danych na iOS Safari (brak nagłówków COOP/COEP blokował tryb OPFS). Dodano ręczny system automatycznego zapisu i odczytu bazy OPFS z pamięci RAM.
      - generic [ref=e60]:
        - heading "Wersja v2026.8.27.09 (2026-08-27)" [level=4] [ref=e61]
        - list [ref=e62]:
          - listitem [ref=e63]: 🐛 Krytyczna naprawa błędu "Invalid bind type", który odrzucał import bazy danych (JSON) zawierający pola "undefined". Wersja kuloodporna.
      - generic [ref=e64]:
        - heading "Wersja v2026.8.27.08 (2026-08-27)" [level=4] [ref=e65]
        - list [ref=e66]:
          - listitem [ref=e67]: 🐛 Naprawa błędu składni (SyntaxError) w silniku bazy danych dbWorker.js, który blokował import danych.
      - generic [ref=e68]:
        - heading "Wersja v2026.8.27.07 (2026-08-27)" [level=4] [ref=e69]
        - list [ref=e70]:
          - listitem [ref=e71]: 🐛 Naprawa literówki (SyntaxError) w module Diagnostyki, która blokowała ładowanie aplikacji na ekranie powitalnym.
      - generic [ref=e72]:
        - heading "Wersja v2026.8.27.06 (2026-08-27)" [level=4] [ref=e73]
        - list [ref=e74]:
          - listitem [ref=e75]: 🐛 Usunięto błąd zawieszający aplikację na ekranie startowym (konflikt modułu SQLite z iOS Safari w głównym wątku). Stabilne działanie na iOS przywrócone.
      - generic [ref=e76]:
        - heading "Wersja v2026.8.27.05 (2026-08-27)" [level=4] [ref=e77]
        - list [ref=e78]:
          - listitem [ref=e79]: 🚀 Wdrożono automatyczny migrator bazy danych z LocalStorage (kvvfs) do OPFS (Baza 2.0). Wszyscy dotychczasowi użytkownicy odzyskają dostęp do swoich danych przy pierwszym uruchomieniu nowej wersji!
      - generic [ref=e80]:
        - heading "Wersja v2026.8.27.04 (2026-08-27)" [level=4] [ref=e81]
        - list [ref=e82]:
          - listitem [ref=e83]: 🚀 Dodanie wyświetlania rozmiaru bazy danych oraz naprawa przycisku eksportu pojedynczego szablonu na urządzeniach iOS Safari.
      - generic [ref=e84]:
        - heading "Wersja v2026.8.27.03 (2026-08-27)" [level=4] [ref=e85]
        - list [ref=e86]:
          - listitem [ref=e87]: 🚀 Dodano możliwość przywracania fizycznej bazy danych RAW z pliku .sqlite3. Uratowanie użytkowników iOS PWA po awarii cache.
      - generic [ref=e88]:
        - heading "Wersja v2026.8.27.02 (2026-08-27)" [level=4] [ref=e89]
        - list [ref=e90]:
          - listitem [ref=e91]: 🚀 Złamanie pętli cache (SW) i agresywny update PWA dla użytkowników iOS Safari.
      - generic [ref=e92]:
        - heading "Wersja v2026.8.27.01 (2026-08-27)" [level=4] [ref=e93]
        - list [ref=e94]:
          - listitem [ref=e95]: 🚨 Awaryjne ominięcie cache SW - wymuszenie świeżego dbWorker z naprawą WASM
      - generic [ref=e96]:
        - heading "Wersja v2026.8.26.15 (2026-08-26)" [level=4] [ref=e97]
        - list [ref=e98]:
          - listitem [ref=e99]: 🛠️ Krytyczna naprawa WASM - pobieranie binarnego pliku z absolutnym URL zamiast locateFile
      - generic [ref=e100]:
        - heading "Wersja v2026.8.26.14 (2026-08-26)" [level=4] [ref=e101]
        - list [ref=e102]:
          - listitem [ref=e103]: 🛠️ Krytyczna naprawa ścieżki sqlite3.wasm w workerze - fix dla iOS Safari i WebAssembly
      - generic [ref=e104]:
        - heading "Wersja v2026.8.26.13 (2026-08-26)" [level=4] [ref=e105]
        - list [ref=e106]:
          - listitem [ref=e107]: 🛠️ Krytyczna naprawa silnika bazy dla starszych urządzeń Apple (Safari)
      - generic [ref=e108]:
        - heading "Wersja v2026.8.26.12 (2026-08-26)" [level=4] [ref=e109]
        - list [ref=e110]:
          - listitem [ref=e111]: 🆘 Dodano Tryb Awaryjny zgrywania uszkodzonego pliku bazy SQLite
      - generic [ref=e112]:
        - heading "Wersja v2026.8.26.11 (2026-08-26)" [level=4] [ref=e113]
        - list [ref=e114]:
          - listitem [ref=e115]: 🔒 Dodano zabezpieczenie przycisku eksportu bazy przed uszkodzeniem
      - generic [ref=e116]:
        - heading "Wersja v2026.8.26.10 (2026-08-26)" [level=4] [ref=e117]
        - list [ref=e118]:
          - listitem [ref=e119]: "🔧 Fix: Krytyczne błędy bazy i znikające posiłki"
      - generic [ref=e120]:
        - heading "Wersja v2026.8.26.09 (2026-08-26)" [level=4] [ref=e121]
        - list [ref=e122]:
          - listitem [ref=e123]: 🚀 Krytyczna naprawa pętli aktualizacji PWA i stabilności
      - generic [ref=e124]:
        - heading "Wersja v2026.8.26.08 (2026-08-26)" [level=4] [ref=e125]
        - list [ref=e126]:
          - listitem [ref=e127]: "🔥 Hotfix 4: Naprawa białych znaków (Enter) w zmiennej confirm w zakładce Diagnostyka."
      - generic [ref=e128]:
        - heading "Wersja v2026.8.26.07 (2026-08-26)" [level=4] [ref=e129]
        - list [ref=e130]:
          - listitem [ref=e131]: 🧨 Wdrożono narzędzie awaryjnego formatowania bazy danych z poziomu Diagnostyki i naprawiono błędy cichego zapisu treningu.
      - generic [ref=e132]:
        - heading "Wersja v2026.8.26.06 (2026-08-26)" [level=4] [ref=e133]
        - list [ref=e134]:
          - listitem [ref=e135]: "🔥 Hotfix 3: Naprawa błędu składni blokującego ładowanie aplikacji (SettingsUI)."
      - generic [ref=e136]:
        - heading "Wersja v2026.8.26.05 (2026-08-26)" [level=4] [ref=e137]
        - list [ref=e138]:
          - listitem [ref=e139]: "🔥 Hotfix 2: Naprawa błędu składni (Missing }) w TrainingUI."
      - generic [ref=e140]:
        - heading "Wersja v2026.8.26.04 (2026-08-26)" [level=4] [ref=e141]
        - list [ref=e142]:
          - listitem [ref=e143]: "🔥 Hotfix: Naprawiono błąd składni 'Unexpected identifier' w DatabaseManager."
      - generic [ref=e144]:
        - heading "Wersja v2026.8.26.03 (2026-08-26)" [level=4] [ref=e145]
        - list [ref=e146]:
          - listitem [ref=e147]: 🔧 Optymalizacja bazy (Retencja zdjęć do 1 dnia) oraz interaktywny wykres Diety pozwalający na przegląd i kasowanie historii posiłków.
      - generic [ref=e148]:
        - heading "Wersja v2026.8.26.02 (2026-08-26)" [level=4] [ref=e149]
        - list [ref=e150]:
          - listitem [ref=e151]: 🛠️ Wdrożono narzędzie automatycznej migracji i defragmentacji bazy danych naprawiające błędy 'disk I/O error'. Dodano eksport i import Planów Treningowych do JSON oraz poprawiono klawiaturę Numpad i Kreator Koszyka.
      - generic [ref=e152]:
        - heading "Wersja v2026.8.26.01 (2026-08-26)" [level=4] [ref=e153]
        - list [ref=e154]:
          - listitem [ref=e155]: 🛠️ Przebudowano silnik multimedialny (Faza 2). Zdjęcia są teraz przechowywane asynchronicznie w przestrzeni OPFS/IndexedDB. Znacznie zmniejszono obciążenie bazy SQL i przyspieszono ładowanie aplikacji!
      - generic [ref=e156]:
        - heading "Wersja v2026.8.25.03 (2026-08-25)" [level=4] [ref=e157]
        - list [ref=e158]:
          - listitem [ref=e159]: "🚀 BAZA DANYCH 2.0 (OPFS): Przeniesiono silnik bazy SQLite z głównego wątku do Web Workera (dbWorker). Odblokowano bezstratny zapis gigabajtów danych bez ryzyka wyczerpania localStorage! Ponadto operacje masowe zyskały asynchroniczne transakcje, co czyni apkę diabelnie szybką. ⚡"
      - generic [ref=e160]:
        - heading "Wersja v2026.8.25.02 (2026-08-25)" [level=4] [ref=e161]
        - list [ref=e162]:
          - listitem [ref=e163]: "🥗 DIETA UI: Powiększono czcionki dla makro i przycisków akcji, wyrównano szerokość przycisków, a korekta kalorii działa teraz precyzyjnie (o 1 kcal) z możliwością wpisania z klawiatury!"
      - generic [ref=e164]:
        - heading "Wersja v2026.8.25.01 (2026-08-25)" [level=4] [ref=e165]
        - list [ref=e166]:
          - listitem [ref=e167]: "📸 DIETA: Dodano podgląd miniatur dla analizowanych posiłków ze zdjęć oraz nowe okno potwierdzenia wyniku sztucznej inteligencji, pozwalające ręcznie dostosować (+/-) wykryte kalorie przed zapisaniem ich do dziennika!"
      - generic [ref=e168]:
        - heading "Wersja v2026.8.24.04 (2026-08-24)" [level=4] [ref=e169]
        - list [ref=e170]:
          - listitem [ref=e171]: "🌐 PWA OFFLINE (STABILNOŚĆ): Naprawiono błąd 'DietAI Error', który zawieszał aplikację przy braku dostępu do internetu. Dodano regułę omijającą cache dla wszystkich połączeń z chmurą Cloudflare (workers.dev). Teraz w przypadku braku sieci aplikacja natychmiast wyświetli czytelny komunikat 'No internet connection', pozwalając na dalszą pracę offline!"
      - generic [ref=e172]:
        - heading "Wersja v2026.8.24.03 (2026-08-24)" [level=4] [ref=e173]
        - list [ref=e174]:
          - listitem [ref=e175]: "🐞 HISTORIA TRENINGÓW (POPRAWKA): Rozszerzono logikę wyświetlania 'Bloków Łączonych' (Superserii) na główny, duży panel podglądu w zakładce Historii (modal po kliknięciu detali treningu). Wcześniej superserie w tym miejscu wyświetlały się błędnie jako 'Nieznane ćwiczenie'. Teraz widzisz piękną listę swoich superserii!"
      - generic [ref=e176]:
        - heading "Wersja v2026.8.24.02 (2026-08-24)" [level=4] [ref=e177]
        - list [ref=e178]:
          - listitem [ref=e179]: "💪 WŁASNE ĆWICZENIA (Prywatny Katalog): Wszystkie Twoje własne ćwiczenia wpisywane z palca w Treningu i Kreatorze trafiają teraz automatycznie do prywatnego katalogu! Będą pojawiać się jako podpowiedzi przy kolejnych treningach."
          - listitem [ref=e180]: "📝 KREATOR SZABLONÓW: Opcja masowej edycji 'Zastosuj do wszystkich' została zmieniona na 'Zastosuj do zaznaczonych'. Możesz teraz łatwo odznaczać ćwiczenia, by masowo zmieniać parametry tylko dla wybranych z nich!"
          - listitem [ref=e181]: "🏃IKONY TYPU ĆWICZENIA: Przycisk zmiany typu (Siłowe 🏋️ / Cardio 🏃) w Kreatorze i podczas Treningu zyskał dodatkowy opis tekstowy, aby było w 100% jasne, że jest on klikalny i do czego służy."
          - listitem [ref=e182]: "🔎 HISTORIA TRENINGU: Naprawiono błąd wyświetlania 'Nieznane ćwiczenie' w podglądzie historii, gdy wykonywano Superserie (Bloki Łączone). Teraz w podglądzie wyraźnie widać nagłówek 'Blok Łączony' i listę wykonanych pod-ćwiczeń wraz z seriami."
          - listitem [ref=e183]: "🚴 ZAJĘCIA ZORGANIZOWANE: Powrót kategorii 'Zajęcia zorganizowane' do głównego katalogu (Tabata, Crossfit, Zumba, Spinning itp.)."
          - listitem [ref=e184]: "🐞 POPRAWKI BŁĘDÓW: Wyeliminowano krytyczny błąd podczas klonowania starych treningów, który powodował załamanie aplikacji (TypeError przy wczytywaniu serii). Twoje stare plany są znów w 100% bezpieczne do klonowania!"
      - generic [ref=e185]:
        - heading "Wersja v2026.8.24.01 (2026-08-24)" [level=4] [ref=e186]
        - list [ref=e187]:
          - listitem [ref=e188]: "🚀 KREATOR PLANU (KOSZYK): Przebudowa interfejsu (UX). Baza Ćwiczeń uruchamia się teraz eleganckim panelem pop-up (Modal) po kliknięciu 'Dodaj ćwiczenie', eliminując uciążliwe przewijanie ekranu! Pasek 'Zastosuj do wszystkich' powędrował na samą górę, by zawsze był pod ręką. 🛒"
          - listitem [ref=e189]: "🏋️ WŁASNE ĆWICZENIA: Wprowadzanie własnych nazw ćwiczeń posiada od teraz intuicyjny przełącznik (ikona 🏋️/🏃), który natychmiast klasyfikuje ćwiczenie jako Siłowe lub Cardio, zachowując czystość interfejsu na jednym ekranie (bez zajmującej miejsce listy wyboru)."
          - listitem [ref=e190]: "🔗 SUPERSERIE (BLOK ŁĄCZONY): Całkowicie przebudowano wygląd bloków łączonych (superserii). Usunięto zbędne boczne marginesy na telefonach, przez co cała szerokość ekranu jest teraz dostępna dla przycisków i nazw - koniec z ucinanymi tekstami na małych urządzeniach! Dodatkowo tworzenie superserii z automatu ładuje 1 ćwiczenie (zamiast 2), przyspieszając pracę."
          - listitem [ref=e191]: "🐞 HOTFIX (Crash): Naprawiono krytyczny błąd powodujący crash przy klikaniu 'Skopiuj do tego dnia' w starszych treningach posiadających superserie."
          - listitem [ref=e192]: "🥗 DIETA: Klonowanie (kopiowanie) raz dodanych posiłków jest już dostępne za jednym kliknięciem! Dodatkowo zrezygnowano z wymuszania włączania aparatu przy dodawaniu zdjęć w Diecie – po kliknięciu 'Dodaj zdjęcie' telefon naturalnie zapyta, czy otworzyć aparat, czy wybrać fotkę z galerii. Obliczanie zapotrzebowania jest teraz wspierane dużym, pomarańczowym i soczystym przyciskiem! 🍽️"
      - generic [ref=e193]:
        - heading "Wersja v2026.8.22.08 (2026-08-22)" [level=4] [ref=e194]
        - list [ref=e195]:
          - listitem [ref=e196]: "🐞 HOTFIX (Numpad): Zastosowano ostateczne poprawki blokujące ucinanie i wychodzenie kalkulatora poza prawą krawędź ekranu. Zmieniono pozycjonowanie na elastyczne 'width: 100vw' w połączeniu z blokadą 'max-width' – koniec ze znikającymi przyciskami 'Zamknij' oraz cyframi, formatka idealnie wpasowuje się w każdy smartfon! 📱💪"
      - generic [ref=e197]:
        - heading "Wersja v2026.8.22.07 (2026-08-22)" [level=4] [ref=e198]
        - list [ref=e199]:
          - listitem [ref=e200]: "🛡️ Dodatkowe zabezpieczenie RWD: Zastosowano pozycjonowanie 'left/right' (zamiast sztywnego width) dla Eksperymentalnego Numpada, by gwarantować idealne dopasowanie kalkulatora na absolutnie każdym modelu smartfona."
      - generic [ref=e201]:
        - heading "Wersja v2026.8.22.06 (2026-08-22)" [level=4] [ref=e202]
        - list [ref=e203]:
          - listitem [ref=e204]: "📱 Poprawiono responsywność Eksperymentalnego Numpada: Klawiatura i ekran z wpisywaną wartością (kg) idealnie dopasowują się teraz do szerokości każdego ekranu (naprawiono ucinanie prawej krawędzi)."
      - generic [ref=e205]:
        - heading "Wersja v2026.8.22.05 (2026-08-22)" [level=4] [ref=e206]
        - list [ref=e207]:
          - listitem [ref=e208]: "📟 Kalkulator z prawdziwego zdarzenia: Dodano duży ekran wyświetlający aktualnie wpisywane wartości bezpośrednio nad Eksperymentalnym Numpadem!"
          - listitem [ref=e209]: "🧹 Minimalizm: Usunięto przestarzałe i nieużywane przyciski Spotify i YT Music, robiąc miejsce na to co ważne - trening."
          - listitem [ref=e210]: 📝 Wybaczcie błąd techniczny! Poprawiono usterkę z wersji .04, która wyświetlała roboczy tekst w okienku zmian.
      - generic [ref=e211]:
        - heading "Wersja v2026.8.22.04 (2026-08-22)" [level=4] [ref=e212]
        - list [ref=e213]:
          - listitem [ref=e214]: Wdrożenie techniczne ekranu Numpada i czyszczenie interfejsu (Brak opisu).
      - generic [ref=e215]:
        - heading "Wersja v2026.8.22.03 (2026-08-22)" [level=4] [ref=e216]
        - list [ref=e217]:
          - listitem [ref=e218]: "🛠️ HOTFIX: Naprawiono krytyczny błąd w Laboratorium (Brak zdefiniowanej zmiennej isBodyweight), który powodował brak reakcji przycisku 'Dodaj Serię' na całkowicie pustym ćwiczeniu."
      - generic [ref=e219]:
        - heading "Wersja v2026.8.22.02 (2026-08-22)" [level=4] [ref=e220]
        - list [ref=e221]:
          - listitem [ref=e222]: "🚀 Laboratorium (BETA): Całkowicie nowy, eksperymentalny interfejs Numpada i Smart Stepperów podczas treningu! (Włączysz go w Ustawieniach)"
          - listitem [ref=e223]: "📈 Kreator Szablonów: Dodano obsługę wartości po przecinku podczas masowego ustawiania serii, by jednym kliknięciem budować piramidy (np. 100,110,120 kg)!"
          - listitem [ref=e224]: 🐞 Poprawiono zgłaszany błąd w kalendarzu, w którym po udanym zakończeniu treningu system nie odświeżał zielonej kropki bez twardego restartu.
          - listitem [ref=e225]: 👑 Zaktualizowano system weryfikacji tokenów PRO - aplikacja już prawidłowo wyświetla wersję Heavy na panelu głównym po wpisaniu ważnego hasła!
      - generic [ref=e226]:
        - heading "Wersja v2026.8.22.01 (2026-08-22)" [level=4] [ref=e227]
        - list [ref=e228]:
          - listitem [ref=e229]: "✨ Wdrożenie Fazy Opcji 3: Dedykowany, nowiutki Kreator Szablonów (Koszyk) na nowej, przejrzystej karcie!"
          - listitem [ref=e230]: "🛒 Przebudowany interfejs koszykowy: Wybierasz ćwiczenia z bazy i masowo aplikujesz wszystkim ilość serii, powtórzeń, oraz ciężar (z uwzględnieniem wartości na minus dla maszyn ze wspomaganiem!)."
          - listitem [ref=e231]: 🔗 Kreator można odpalić prosto z panelu treningowego jako nowy, bezpieczny widok.
      - generic [ref=e232]:
        - heading "Wersja v2026.8.21.03 (2026-08-21)" [level=4] [ref=e233]
        - list [ref=e234]:
          - listitem [ref=e235]: "🕵️‍♂️ Analityk w akcji: System otrzymał głęboki raport UX dotyczący obsługi dotykowej, co przygotowuje grunt pod wielkie zmiany w interfejsie dodawania ćwiczeń (Swipe, Numpad, Smart Steppery)!"
          - listitem [ref=e236]: "📝 Changelog na sterydach: Załataliśmy lukę, przez którą system wrzucał domyślny i 'suchy' opis przy nowych aktualizacjach. Od teraz każda łatka musi mieć pełne opisy z emotikonami, bo tak rzecze prawo! ⚖️"
      - generic [ref=e237]:
        - heading "Wersja v2026.8.21.02 (2026-08-21)" [level=4] [ref=e238]
        - list [ref=e239]:
          - listitem [ref=e240]: "⏱️ Czas trwania powiadomień: Zoptymalizowaliśmy trenera Edwarda. Jego chmurki z podpowiedziami znikają teraz po idealnych 6 sekundach."
          - listitem [ref=e241]: "📅 Przypomnienie o Trialu: Dodaliśmy mechanizm, który po wygaśnięciu okresu próbnego (status Light) przypomina o możliwości odblokowania wersji PRO tylko raz dziennie na starcie aplikacji, szanując Twój czas."
          - listitem [ref=e242]: "🚀 Kolejne szlify aktualizatora: Wypuściliśmy wersję .02, aby upewnić się, że pobieranie PWA działa już całkowicie bezproblemowo!"
      - generic [ref=e243]:
        - heading "Wersja v2026.8.21.01 (2026-08-21)" [level=4] [ref=e244]
        - list [ref=e245]:
          - listitem [ref=e246]: "👑 Zmiana formatowania licencji: Informacja o dostępie (Heavy / Trial / Light) została przeniesiona na dół pulpitu, tuż przed numerem wersji (np. Trial v2026.8.21.01)."
          - listitem [ref=e247]: "📜 Czytelniejszy pulpit: Link 'Zobacz co nowego (Changelog)' oraz okno z odliczaniem dni próbnych przeniesiono do sekcji 'Ustawienia i Profil', aby zapewnić maksymalny minimalizm na głównym ekranie."
          - listitem [ref=e248]: "🛠️ Naprawa okienek do wpisywania ciężaru: Zwiększyliśmy szerokość pól tekstowych dla obciążeń z 48px na 62px – teraz trzycyfrowe wartości (np. 135 kg) mieszczą się idealnie i cyfry nie są ucinane!"
          - listitem [ref=e249]: "🐞 Krytyczna poprawka aktualizacji (Bugfix): Naprawiono błąd w systemie wersjonowania, który powodował irytującą 'pętlę aktualizacji' oraz błędy Service Workera."
      - generic [ref=e250]:
        - heading "Wersja v2026.8.20.03 (2026-08-20)" [level=4] [ref=e251]
        - list [ref=e252]:
          - listitem [ref=e253]: 🔧 Wdrożenie dedykowanego narzędzia (w zakładce Diagnostyka) do automatycznego mapowania i unifikacji starych nazw ćwiczeń (np. 'wyciskanie płaska' -> 'Klatka - Wyciskanie sztangi - Ławka płaska') we wszystkich Twoich historycznych treningach.
          - listitem [ref=e254]: "📈 Wdrożenie Fazy 8 (Analityka): Dodano interaktywny Wykres Progresu dla konkretnych ćwiczeń w zakładce Analiza Progresu."
          - listitem [ref=e255]: 📊 Możliwość wyboru dowolnego ćwiczenia z rozwijanej listy i śledzenia historii maksymalnego podniesionego ciężaru (oraz powtórzeń) na przestrzenni czasu w formie estetycznego wykresu słupkowego.
      - generic [ref=e256]:
        - heading "Wersja v2026.8.20.01 (2026-08-20)" [level=4] [ref=e257]
        - list [ref=e258]:
          - listitem [ref=e259]: "👑 Wdrożenie Fazy 7: Model Freemium. Aplikacja rozróżnia wersję Light oraz Heavy (PRO). Użytkownicy Light nie mają dostępu do funkcji AI po 7 dniach."
          - listitem [ref=e260]: Dodanie banera Premium na ekranie startowym (Dashboard), który odlicza dni Trial i informuje o statusie (Trial / Light / PRO).
          - listitem [ref=e261]: "Poprawa działania Superserii: Dodawany jest jeden pusty blok ćwiczenia z możliwością rozszerzania go za pomocą dedykowanego przycisku '+ Kolejne ćwiczenie (Superseria)'."
          - listitem [ref=e262]: Przebudowa wyglądu okna Superserii (ujednolicona szerokość i usunięto podwójne obramowanie, które sprawiało problemy na mniejszych ekranach).
          - listitem [ref=e263]: "Cardio: Umożliwienie ręcznego wpisania czasu treningu w minutach zamiast używania stopera."
          - listitem [ref=e264]: "Interfejs: Nowy, ładniejszy wygląd przycisków odtwarzaczy Spotify oraz YouTube Music."
      - generic [ref=e265]:
        - heading "Wersja v2026.8.19.1 (2026-08-19)" [level=4] [ref=e266]
        - list [ref=e267]:
          - listitem [ref=e268]: "📚 Wygodny Katalog Ćwiczeń: Zamiast ukrytej listy (która nie chciała działać na iPhone'ach), obok nazwy ćwiczenia znajdziesz teraz dedykowany przycisk '📚 Katalog', który otwiera czytelne okno wyboru."
          - listitem [ref=e269]: "🗂️ Podział na partie mięśniowe: Katalog w pierwszej kolejności pozwala wybrać partię (np. Plecy, Klatka), a dopiero potem konkretne ćwiczenie, skracając listę i ułatwiając szukanie."
          - listitem [ref=e270]: "📱 Ulepszona Responsywność Serii: Pola ciężaru i powtórzeń zostały zwężone i ciaśniej ułożone, dzięki czemu nawet przy dużym skalowaniu czcionki na ekranach iPhone'a przyciski się nie nachodzą i nie uciekają z ekranu."
          - listitem [ref=e271]: "🔄 Fix Aktualizacji: Ostatecznie naprawiono błąd powodujący ciągłe pojawianie się paska 'Dostępna nowa aktualizacja' mimo poprawnego zainstalowania nowej wersji."
      - generic [ref=e272]:
        - heading "Wersja v2026.8.18.1 (2026-08-18)" [level=4] [ref=e273]
        - list [ref=e274]:
          - listitem [ref=e275]: "📚 Wbudowany Katalog Ćwiczeń: dodając ćwiczenie otrzymujesz inteligentne podpowiedzi z ujednoliconego słownika."
          - listitem [ref=e276]: "🚀 Automatyczna Migracja Historii: Twoje stare nazwy ćwiczeń (np. Klatka płaska) zostały zaktualizowane w całej historii do profesjonalnych odpowiedników z katalogu."
          - listitem [ref=e277]: "🏆 Czytelniejsze Rekordy Siłowe: W Analizie Progresu główny wynik (Ciężar x Powtórzenia) jest teraz na pierwszym planie, a szacowane 1RM pełni rolę wspierającą."
          - listitem [ref=e278]: "📱 Ulepszona Responsywność: Rekordy wyświetlają się perfekcyjnie na każdym ekranie i przy dużej czcionce dzięki płynnemu zawijaniu (flex-wrap)."
          - listitem [ref=e279]: "🎨 Szlify estetyczne udostępniania: Z karty podsumowującej treningi do social mediów zniknęła nadmiarowa, niebieska stopka."
      - generic [ref=e280]:
        - heading "Wersja v2026.8.17.4 (2026-08-17)" [level=4] [ref=e281]
        - list [ref=e282]:
          - listitem [ref=e283]: "🎨 Czysty layout grafiki do social mediów: Usunięto nakładający się niebieski napis ze stopki wygenerowanego obrazu."
          - listitem [ref=e284]: "📐 Inteligentne skalowanie: Rekordy siłowe na wygenerowanej karcie są teraz dynamicznie rozmieszczane, aby idealnie wypełniać kadr bez obcinania tekstu."
      - generic [ref=e285]:
        - heading "Wersja v2026.8.17.3 (2026-08-17)" [level=4] [ref=e286]
        - list [ref=e287]:
          - listitem [ref=e288]: "📤 Udostępnianie Rekordów Siłowych: Dodano dedykowany przycisk generujący estetyczną grafikę z Twoimi najlepszymi wynikami siłowymi, gotową do publikacji na Instagramie lub Facebooku."
      - generic [ref=e289]:
        - heading "Wersja v2026.8.17.2 (2026-08-17)" [level=4] [ref=e290]
        - list [ref=e291]:
          - listitem [ref=e292]: "🏆 Precyzja faktów: Kafelki Rekordów Siłowych pokazują teraz Rzeczywisty Podniesiony Ciężar (np. 100 kg w 10 powtórzeniach), a szacowany wskaźnik 1RM prezentowany jest jako dodatkowa, czytelna ciekawostka."
      - generic [ref=e293]:
        - heading "Wersja v2026.8.17.1 (2026-08-17)" [level=4] [ref=e294]
        - list [ref=e295]:
          - listitem [ref=e296]: "🏆 Nowa sekcja w Analizie Progresu: Twoje Rekordy Siłowe (Szacowane 1RM). Aplikacja automatycznie wylicza Twój szacowany maksymalny ciężar na 1 powtórzenie (wzorem Epleya) z najlepszych serii roboczych."
          - listitem [ref=e297]: "💡 Wyczerpujące wyjaśnienie wskaźnika 1RM: Dodano interaktywny modal informacyjny wyjaśniający, czym jest 1RM, dlaczego szacujemy go matematycznie zamiast ryzykować kontuzję oraz jak dobierać obciążenia robocze."
      - generic [ref=e298]:
        - heading "Wersja v2026.8.15.3 (2026-08-15)" [level=4] [ref=e299]
        - list [ref=e300]:
          - listitem [ref=e301]: "✨ Poprawiono ergonomię ikony Informacji (ℹ️): kliknięcie w ikonę przy Tonażu Ciała otwiera teraz elegancki modal wyjaśniający obliczenia kalisteniczne na urządzeniach mobilnych."
          - listitem [ref=e302]: 🎩 Ujednolicono ton wypowiedzi Trenera Edwarda w module atlasu mięśni na w pełni profesjonalny i merytoryczny.
      - generic [ref=e303]:
        - heading "Wersja v2026.8.15.2 (2026-08-15)" [level=4] [ref=e304]
        - list [ref=e305]:
          - listitem [ref=e306]: 🔥 [HOTFIX] Wdrożenie Wykresu Hybrydowego i nowych kafelków w Analizie Progresu.
      - generic [ref=e307]:
        - heading "Wersja v2026.8.15.1 (2026-08-15)" [level=4] [ref=e308]
        - list [ref=e309]:
          - listitem [ref=e310]: "🔥 Wdrożono Wykres Hybrydowy w Analizie Progresu: pełne wsparcie dla treningów Cardio oraz Zajęć Zorganizowanych (Hyrox, Crossfit, Zumba, Spinning)."
          - listitem [ref=e311]: 📈 Koniec z 0 kg! Paski dla aktywności tlenowych mają teraz dedykowane kolory (Ognisty dla Zajęć, Niebieski dla Cardio) i prezentują spalone kalorie (kcal), średnie tętno (bpm) oraz czas trwania.
          - listitem [ref=e312]: 📊 Dodano nowy kafelek analityczny ze statystykami spalonych kalorii z zegarków (Smartwatch) na samej górze ekranu analizy.
          - listitem [ref=e313]: "🧠 Inteligentny komparator trendu: aplikacja rozróżnia sesje siłowe od tlenowych, nie porównując błędnie tonażu między różnymi dyscyplinami."
      - generic [ref=e314]:
        - heading "Wersja v2026.8.14.22 (2026-08-14)" [level=4] [ref=e315]
        - list [ref=e316]:
          - listitem [ref=e317]: 🛠 Poprawiono kolejny błąd mapowania danych bazy podczas importu, tym razem w obrębie tabel dziennika diety (usunięto nieistniejące kolumny ze skryptu wczytującego).
          - listitem [ref=e318]: "📝 Ulepszono moduł logowania błędów: błędy podczas przywracania danych będą teraz zawsze poprawnie zapisywane w systemie logów Diagnostyki."
      - generic [ref=e319]:
        - heading "Wersja v2026.8.14.21 (2026-08-14)" [level=4] [ref=e320]
        - list [ref=e321]:
          - listitem [ref=e322]: 🛠 Naprawiono schemat importu bazy danych, który blokował prawidłowe przywrócenie archiwum z powodu niedopasowania nazw nowych kolumn z typami treningów.
      - generic [ref=e323]:
        - heading "Wersja v2026.8.14.20 (2026-08-14)" [level=4] [ref=e324]
        - list [ref=e325]:
          - listitem [ref=e326]: "🛠 Naprawiono krytyczny błąd w zakładce Diagnostyka: przyciski (np. Przywróć z Pliku, Utwórz Archiwum) przestały reagować na kliknięcia, jeśli system nie miał zapisanych żadnych logów błędów."
      - generic [ref=e327]:
        - heading "Wersja v2026.8.14.19 (2026-08-14)" [level=4] [ref=e328]
        - list [ref=e329]:
          - listitem [ref=e330]: "📱 Poprawiono układ graficzny wizytówki: Przycisk wsparcia (Postaw Kawę) teraz perfekcyjnie dopasowuje się do szerokości ekranów smartfonów, unikając niepotrzebnego ucinania."
      - generic [ref=e331]:
        - heading "Wersja v2026.8.14.18 (2026-08-14)" [level=4] [ref=e332]
        - list [ref=e333]:
          - listitem [ref=e334]: ☕ Wdrożenie Modułu Monetyzacji (AI Premium). Narzędzia sztucznej inteligencji (Trener Edward oraz Analiza Zdjec Diety) są teraz dostępne za darmo przez pierwsze 7 dni od uruchomienia aplikacji. Następnie wymagają odblokowania tokenem wsparcia poprzez Suppi (Postaw Kawę).
          - listitem [ref=e335]: 🔗 Dodano dedykowany przycisk wsparcia (Postaw Kawę) bezpośrednio na ekranie startowym (Wizytówce) aplikacji.
      - generic [ref=e336]:
        - heading "Wersja v2026.8.14.17 (2026-08-14)" [level=4] [ref=e337]
        - list [ref=e338]:
          - listitem [ref=e339]: 📅 Wprowadzono opcję *Przywracania* odwołanych treningów. Usunięto błąd logiki, przez który odwołany z harmonogramu trening wciąż świecił się na czerwono bez możliwości interakcji.
          - listitem [ref=e340]: 📱 Poprawiono szerokość wierszy dla Dropsetów wewnątrz Super-Serii. Słowo *Dropset* zostało zastąpione intuicyjnym *↳ 🔥*, co wraz z redukcją marginesu całkowicie eliminuje problem nie mieszczących się elementów na małych ekranach przy dużej czcionce.
      - generic [ref=e341]:
        - heading "Wersja v2026.8.14.16 (2026-08-14)" [level=4] [ref=e342]
        - list [ref=e343]:
          - listitem [ref=e344]: "📅 Aktualizacja logiczna kalendarza: Od teraz automatyczne harmonogramy nie wypełniają już sztucznie minionych dni miesiąca (wstecz). Pokazują się tylko od dnia dzisiejszego w przód!"
          - listitem [ref=e345]: "⚡ Natychmiastowe odświeżanie: Zmiana dni w harmonogramie modalu ładuje widok kalendarza w czasie rzeczywistym zaraz po zamknięciu okna (bez konieczności ręcznego przeładowywania)."
      - generic [ref=e346]:
        - heading "Wersja v2026.8.14.15 (2026-08-14)" [level=4] [ref=e347]
        - list [ref=e348]:
          - listitem [ref=e349]: 📅 Kalendarz Faza 4 - Harmonogramy Treningów! Dodano możliwość przypisania Szablonu Planu Treningowego do konkretnych dni tygodnia (np. każdy Poniedziałek i Środa).
          - listitem [ref=e350]: "🟢 Kalendarz zyskał inteligentne kropki: pomarańczowa (zaplanowany trening), zielona (trening zrealizowany), czerwona (trening pominięty)."
          - listitem [ref=e351]: "🏃 Automatyczne uruchamianie: Kliknięcie w zaplanowany dzień w kalendarzu pozwala od razu wczytać i rozpocząć dedykowany plan z opcją przełożenia na inny dzień."
          - listitem [ref=e352]: 🐛 Naprawiono błąd załamywania się wierszy i spadania przycisku X w widoku serii podczas skalowania dużych czcionek.
          - listitem [ref=e353]: 💾 Udoskonalono formatowanie nazwy pobieranego pełnego archiwum bazy danych o sekundy (HH-mm-ss).
      - generic [ref=e354]:
        - heading "Wersja v2026.8.14.14 (2026-08-14)" [level=4] [ref=e355]
        - list [ref=e356]:
          - listitem [ref=e357]: "📦 Pełne Archiwum Danych (Kopia Bezpieczeństwa v2.0): Udoskonalono silnik kopii zapasowej – archiwum obejmuje teraz 100% bazy SQLite (pomiary, treningi, pełną historię diety, raporty AI) oraz wszystkie ustawienia i szablony!"
          - listitem [ref=e358]: "✨ Nowoczesne Okno Szablonów Planów Treningowych: Przywrócono pełną nazwę modułu, dodano stały nagłówek z przyciskiem zamknięcia (X) oraz możliwość zamknięcia okna jednym tapnięciem w tło!"
      - generic [ref=e359]:
        - heading "Wersja v2026.8.14.13 (2026-08-14)" [level=4] [ref=e360]
        - list [ref=e361]:
          - listitem [ref=e362]: "📐 Perfekcyjne Wyrównanie w Wierszu Serii: Checkbox, numer serii, pola ciężaru/powtórzeń oraz przycisk usunięcia są teraz idealnie wyśrodkowane w pionie na jednej linii wzroku!"
          - listitem [ref=e363]: "🎯 Szablony Treningowe: Przyciski \"Wybierz\" i \"Usuń\" mają teraz idealnie równe proporcje (50%/50%) i zawsze mieszczą się w kafelku bez wyjeżdżania poza obrys."
          - listitem [ref=e364]: "✨ Symetria Przycisków Analiz: Przycisk \"Analiza Miesięczna\" zyskał identyczny, zbalansowany dwuliniowy układ jak \"Analiza Tygodniowa\"."
          - listitem [ref=e365]: "🥋 Profesjonalna Komunikacja Trenera: Oczyszczono wszystkie dymki Trenera Edwarda z wulgaryzmów – teraz komunikaty są w 100% profesjonalne, motywujące i z lekkim, sportowym humorem!"
      - generic [ref=e366]:
        - heading "Wersja v2026.8.14.12 (2026-08-14)" [level=4] [ref=e367]
        - list [ref=e368]:
          - listitem [ref=e369]: "🧠 Pełny Wywiad i Makroskładniki u Trenera Edwarda: Edward przed każdą analizą pyta teraz o sen, staż treningowy i cel sylwetkowy! Dodatkowo silnik AI przekazuje pełną gramaturę makroskładników (Białko, Węglowodany, Tłuszcze oraz Kalorie ze szczegółami każdego posiłku). Koniec z narzekaniem Edwarda na brak rozbicia makro!"
          - listitem [ref=e370]: "📋 Import Planu Treningowego z Analizy AI: Każdy trening zaproponowany przez Trenera Edwarda możesz teraz jednym kliknięciem (\"📋 Plan\") zapisać jako gotowy Szablon Treningowy i od razu załadować go na siłowni!"
          - listitem [ref=e371]: "🔙 Intuicyjna Nawigacja w Raporcie: Dodano wyraźny przycisk powrotu do aplikacji u góry i na samym dole raportu z zachowaniem bezpiecznego marginesu pod Dynamic Island / Notch na iPhone."
      - generic [ref=e372]:
        - heading "Wersja v2026.8.14.11 (2026-08-14)" [level=4] [ref=e373]
        - list [ref=e374]:
          - listitem [ref=e375]: "🛠️ Dopracowanie layoutu Serii: Zastosowano zaawansowany CSS, dzięki któremu, jeśli wiersz z Serią, polami wagi/powtórzeń i ikoną usuwania zmieści się na ekranie – zostanie ułożony elegancko w jednym wierszu. Dopiero gdy czcionka jest za duża i brakuje miejsca, inputy naturalnie centrują się pod spodem. Czysta magia front-endu!"
      - generic [ref=e376]:
        - heading "Wersja v2026.8.14.10 (2026-08-14)" [level=4] [ref=e377]
        - list [ref=e378]:
          - listitem [ref=e379]: "🔥 Responsywny formularz Serii: Całkowicie przebudowano wygląd wprowadzania powtórzeń i ciężaru. Pola są teraz niezależne i pięknie wyśrodkowane na ekranie. Koniec z nachodzącymi na siebie przyciskami (szczególnie widocznymi przy dużych czcionkach w systemie iOS!)."
          - listitem [ref=e380]: "🎨 Nowy wygląd Szablonów: Przebudowano modal z zapisanymi planami treningowymi. O wiele czystszy układ z nazwą jako tytułem na środku, dokładnymi informacjami o przewidywanym czasie (jeśli zapisano z historii) oraz z wygodnymi przyciskami na całą szerokość ekranu."
      - generic [ref=e381]:
        - heading "Wersja v2026.8.14.09 (2026-08-14)" [level=4] [ref=e382]
        - list [ref=e383]:
          - listitem [ref=e384]: "🛠️ Potężna Kopii Zapasowa (Diagnoza): Teraz funkcja Eksportu w zakładce Diagnostyka zapisuje absolutnie WSZYSTKO – treningi, pomiary, ustawienia (awatar, nick, szablony), dziennik diety oraz analizy Trenera Edwarda. Śmiało możesz reinstalować aplikację z czystym sumieniem!"
          - listitem [ref=e385]: "🎨 Kolejne szlify Treningu: Poprawiono wyrównanie pól wprowadzania ciężaru przy dużym rozmiarze czcionki na ekranie (zawijanie wierszy z zachowaniem wyśrodkowania)."
      - generic [ref=e386]:
        - heading "Wersja v2026.8.14.08 (2026-08-14)" [level=4] [ref=e387]
        - list [ref=e388]:
          - listitem [ref=e389]: "🎨 Szlify interfejsu (UX/UI): Zoptymalizowano rozmiar i proporcje nowych, powiększonych pól wprowadzania ciężaru i powtórzeń w trakcie treningu (pozbyto się czarnych kwadratów), żeby aplikacja wyglądała świetnie i profesjonalnie na ekranie smartfona!"
      - generic [ref=e390]:
        - heading "Wersja v2026.8.14.07 (2026-08-14)" [level=4] [ref=e391]
        - list [ref=e392]:
          - listitem [ref=e393]: "🛠️ Hotfix: Szybka naprawa krytycznego błędu (tzw. zawieszenie na Loading), który wdarł się do najnowszego modułu treningowego. Teraz wszystko znowu śmiga płynnie! Przepraszamy za usterkę."
      - generic [ref=e394]:
        - heading "Wersja v2026.8.14.06 (2026-08-14)" [level=4] [ref=e395]
        - list [ref=e396]:
          - listitem [ref=e397]: "✨ NOWOŚĆ: Przebudowano interfejs aktywnego treningu — powiększono pola wprowadzania wagi i powtórzeń dla lepszej widoczności podczas ćwiczeń (Styl 'Large Input')."
          - listitem [ref=e398]: "✨ NOWOŚĆ: Kalendarz Historii Treningów wzbogacony o nowy przycisk '🔍 Podgląd'. Kliknięcie pozwala na szybkie podejrzenie pełnych statystyk odbytego treningu w formie estetycznego modala, bez opuszczania widoku kalendarza."
          - listitem [ref=e399]: "✨ NOWOŚĆ: Historia Treningów zyskała przycisk '📝 Zapisz jako plan treningowy'. Możesz teraz jednym kliknięciem przerobić swój wyśmienity trening w gotowy do powtórzenia szablon na przyszłość!"
          - listitem [ref=e400]: "✨ NOWOŚĆ: Możliwość określenia swojego 'Stażu Treningowego' w Profilu. Informacja ta w połączeniu z historią jest przekazywana do Trenera Edwarda, aby ten celniej dobierał obciążenia i złożoność ćwiczeń."
          - listitem [ref=e401]: "✨ NOWOŚĆ: Panel Trenera Edwarda zyskał przycisk '💾 Zapisz raport (TXT)'. Teraz każdą cenną analizę AI możesz wyeksportować i zabrać ze sobą w pliku."
          - listitem [ref=e402]: "🚨 HOTFIX: Całkowicie wyeliminowano problem braku reakcji aplikacji przy wyczerpanym limicie 429 API, dodano czytelne ekrany informujące o przekroczeniu darmowej puli (Quota)."
          - listitem [ref=e403]: "🚨 HOTFIX: Usunięto krytyczny błąd w Diagnostyce, który uniemożliwiał wyeksportowanie kopii zapasowej całej bazy danych w formacie JSON."
      - generic [ref=e404]:
        - heading "Wersja v2026.8.14.04 (2026-08-14)" [level=4] [ref=e405]
        - list [ref=e406]:
          - listitem [ref=e407]: "✨ NOWOŚĆ: Przebudowano Szablony Treningowe na Plany Treningowe z edycją ćwiczeń w locie (Checkboxy)."
          - listitem [ref=e408]: 🤖 Trener Edward po szkoleniu! Oferuje teraz głębszą, profesjonalną analizę medyczną z uwzględnieniem objętości i splitu.
          - listitem [ref=e409]: "🚨 HOTFIX: Wymuszona aktualizacja naprawiająca zaciętą pętlę ekranu nowości PWA (Problem wersji .03 rozwiązywany bezwzględnie)."
      - generic [ref=e410]:
        - heading "Wersja v2026.8.14.03 (2026-08-14)" [level=4] [ref=e411]
        - list [ref=e412]:
          - listitem [ref=e413]: "🚨 HOTFIX: Poprawa obsługi błędów 429 dla Trenera Edwarda (Komunikaty o limitach API)."
      - generic [ref=e414]:
        - heading "Wersja v2026.8.14.02 (2026-08-14)" [level=4] [ref=e415]
        - list [ref=e416]:
          - listitem [ref=e417]: "🚨 HOTFIX: Wymuszona aktualizacja z lepszą obsługą komunikatów o wyczerpaniu limitów API oraz poprawionym tekstem w analityce."
      - generic [ref=e418]:
        - heading "Wersja v2026.8.14.01 (2026-08-14)" [level=4] [ref=e419]
        - list [ref=e420]:
          - listitem [ref=e421]: "✨ NOWOŚĆ: Strona Wizytówkowa (Landing Page). Od teraz aplikacja dostępna jest w 100% z poziomu ikony PWA, a w przeglądarce wyświetla instrukcję instalacji."
      - generic [ref=e422]:
        - heading "Wersja v2026.8.13.04 (2026-08-13)" [level=4] [ref=e423]
        - list [ref=e424]:
          - listitem [ref=e425]: "🚨 HOTFIX: Wymuszona nowa aktualizacja, w której ostatecznie zsynchronizowaliśmy typy danych (images) dla serwera AI."
      - generic [ref=e426]:
        - heading "Wersja v2026.8.13.03 (2026-08-13)" [level=4] [ref=e427]
        - list [ref=e428]:
          - listitem [ref=e429]: "🚨 HOTFIX: Ostateczna naprawa komunikacji analiz AI z bazą SQLite oraz prawidłowe przesyłanie kontekstu do Cloudflare Workera."
      - generic [ref=e430]:
        - heading "Wersja v2026.8.13.02 (2026-08-13)" [level=4] [ref=e431]
        - list [ref=e432]:
          - listitem [ref=e433]: "✨ UX: Ujednolicono i powiększono czcionkę we wszystkich polach konfiguracji Profilu (Pomiary, Cele) oraz Ustawień."
          - listitem [ref=e434]: "🚨 HOTFIX: Złagodzono irytujące zjeżdżanie ekranu (focus) na 'Opcje Treningu' po kliknięciu głównego kafelka 'Treningi', co pozwala teraz normalnie obejrzeć kalendarz."
          - listitem [ref=e435]: "🚨 HOTFIX: Przycisk 'Pochwal się odznakami' w Ustawieniach znowu działa i generuje Twoje zrzuty z pucharami!"
          - listitem [ref=e436]: "🧪 TESTY: 100% stabilności E2E Playwright - środowisko przygotowane do wypuszczenia sub-agentów!"
  - button "🤖" [ref=e438] [cursor=pointer]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Training Save Bug', () => {
  4  |   test('should save training with 4 dropsets and a superset', async ({ page }) => {
  5  |     // Zresetuj localStorage żeby pominąć onboarding jeśli jest
  6  |     await page.addInitScript(() => {
  7  |       window.localStorage.setItem('tutorial_global_v22', 'true');
  8  |       window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01');
  9  |       window.localStorage.setItem('userNick', 'Test');
  10 |     });
  11 | 
  12 |     // 1. Otwarcie aplikacji
  13 |     await page.goto('http://localhost:8080');
  14 |     await page.waitForTimeout(1000); // Wait for app initialization
  15 | 
  16 |     // Wejście w trening
> 17 |     await page.click('a[data-tab="training-dashboard"]');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  18 |     // Select day 15 first
  19 |     await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));
  20 |     
  21 |     // Rozpoczęcie nowego treningu
  22 |     await page.click('#start-new-session-btn');
  23 |     
  24 |     // Dodanie nazwy ćwiczenia dla pierwszego
  25 |     await page.fill('.exercise-name-input', 'Wyciskanie');
  26 |     
  27 |     // Wpisanie wagi i powt dla pierwszej serii (normalnej)
  28 |     const weightInputs = page.locator('input[id^="weight-"]');
  29 |     const repsInputs = page.locator('input[id^="reps-"]');
  30 |     
  31 |     await weightInputs.nth(0).fill('100');
  32 |     await repsInputs.nth(0).fill('10');
  33 |     await page.click('button:has-text("+ Seria")');
  34 |     
  35 |     // Dodanie 4 dropsetów
  36 |     for(let i = 0; i < 4; i++) {
  37 |       await weightInputs.nth(0).fill((90 - i*10).toString());
  38 |       await repsInputs.nth(0).fill('8');
  39 |       await page.click('button:has-text("🔥 Dropset")');
  40 |     }
  41 |     
  42 |     // Dodanie superserii
  43 |     await page.click('#add-superset-to-plan-btn');
  44 |     
  45 |     // Zakończenie i zapis
  46 |     // Akceptacja alertu (confirm) i ewentualnego alertu sukcesu
  47 |     page.on('dialog', async dialog => {
  48 |       await dialog.accept();
  49 |     });
  50 |     
  51 |     await page.click('#finish-training-btn');
  52 |     
  53 |     // Weryfikacja że przeszło (zobaczymy widok kalendarza i historii)
  54 |     await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });
  55 |   });
  56 | });
  57 | 
```