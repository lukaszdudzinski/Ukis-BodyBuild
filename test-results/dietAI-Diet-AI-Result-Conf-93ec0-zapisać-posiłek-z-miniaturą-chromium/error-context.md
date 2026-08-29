# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dietAI.spec.js >> Diet AI Result Confirmation Modal >> powinien pokazać modal z przyciskami +/- i zapisać posiłek z miniaturą
- Location: tests/e2e/dietAI.spec.js:4:3

# Error details

```
Error: expect(locator).toBeAttached() failed

Locator: locator('#diet-today-list').locator('text=Sałatka z kurczakiem').first()
Expected: attached
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeAttached" with timeout 5000ms
  - waiting for locator('#diet-today-list').locator('text=Sałatka z kurczakiem').first()

```

```yaml
- navigation:
  - img "Logo"
  - heading "Uki's BodyBuild" [level=1]
  - list:
    - listitem:
      - link "Pulpit Główny":
        - /url: "#"
    - listitem:
      - link "Pomiary Ciała":
        - /url: "#"
    - listitem:
      - link "Trening":
        - /url: "#"
    - listitem:
      - link "Historia Treningów":
        - /url: "#"
    - listitem:
      - link "Analiza Progresu":
        - /url: "#"
    - listitem:
      - link "Dieta i Żywienie":
        - /url: "#"
    - listitem:
      - link "Diagnostyka":
        - /url: "#"
    - listitem:
      - link "Profil i Ustawienia":
        - /url: "#"
  - link "☕ Podoba Ci się to narzędzie? Postaw mi kawę!":
    - /url: https://suppi.pl/ukidives
    - text: ☕ Podoba Ci się to narzędzie?
    - strong: Postaw mi kawę!
  - text: Trial (7 dni) v2026.8.29.01
- main:
  - heading "Dieta i Kalorie" [level=2]
  - paragraph: Dzisiaj
  - 'heading "Twój cel: 2000 kcal" [level=3]'
  - img
  - text: Zjedzono 0 kcal 0g Białko 0g Węgle 0g Tłuszcze Co dzisiaj jadłeś?
  - textbox "Napisz lub podyktuj... (np. Jajecznica z 3 jaj)"
  - text: 📸 Dodaj zdjęcie
  - button "🤖 Zapytaj AI Edwarda o kaloryczność"
  - button "⚙️ Oblicz zapotrzebowanie kaloryczne"
  - heading "Dzisiejsze posiłki" [level=3]
  - img
  - text: Sałatka z kurczakiem
  - strong: "B:"
  - text: 30g
  - strong: "W:"
  - text: 10g
  - strong: "T:"
  - text: 15g 400 kcal
  - button "Klonuj"
  - button "Usuń"
  - heading "📊 Historia 30 dni" [level=3]
  - text: Brak danych do wykresu. Dodaj posiłki.
- heading "Co nowego? 🚀" [level=3]
- button "×"
- heading "Wersja v2026.8.29.01 (2026-08-29)" [level=4]
- list:
  - listitem: "🔥 Krytyczny pożar ugaszony: zrzut RAM do OPFS po każdej operacji"
  - listitem: 🛟 Wdrożono moduł BackupUI z przypomnieniem JSON
  - listitem: "🐛 Treningi: Naprawiono błędne ładowanie szablonu przy nowej sesji"
  - listitem: "🐛 Treningi: Naprawiono błąd dodawania nowych serii"
  - listitem: "🖼 Dieta: Naprawiono ładowanie miniatur z bazy MediaManager"
- heading "Wersja v2026.8.28.01 (2026-08-28)" [level=4]
- list:
  - listitem: 🐛 Naprawa błędu z szablonami treningów (brak możliwości dodawania serii po użyciu szablonu).\n🐛 Naprawa wyświetlania miniatur zdjęć w widoku Diety.\n📦 Dodano system przypomnień o codziennym archiwum bazy danych (BackupUI).\n🧹 Uporządkowano zakładkę Diagnostyka, ukrywając groźne funkcje RAW.
- heading "Wersja v2026.8.27.10 (2026-08-27)" [level=4]
- list:
  - listitem: 🐛 Naprawa utraty danych na iOS Safari (brak nagłówków COOP/COEP blokował tryb OPFS). Dodano ręczny system automatycznego zapisu i odczytu bazy OPFS z pamięci RAM.
- heading "Wersja v2026.8.27.09 (2026-08-27)" [level=4]
- list:
  - listitem: 🐛 Krytyczna naprawa błędu "Invalid bind type", który odrzucał import bazy danych (JSON) zawierający pola "undefined". Wersja kuloodporna.
- heading "Wersja v2026.8.27.08 (2026-08-27)" [level=4]
- list:
  - listitem: 🐛 Naprawa błędu składni (SyntaxError) w silniku bazy danych dbWorker.js, który blokował import danych.
- heading "Wersja v2026.8.27.07 (2026-08-27)" [level=4]
- list:
  - listitem: 🐛 Naprawa literówki (SyntaxError) w module Diagnostyki, która blokowała ładowanie aplikacji na ekranie powitalnym.
- heading "Wersja v2026.8.27.06 (2026-08-27)" [level=4]
- list:
  - listitem: 🐛 Usunięto błąd zawieszający aplikację na ekranie startowym (konflikt modułu SQLite z iOS Safari w głównym wątku). Stabilne działanie na iOS przywrócone.
- heading "Wersja v2026.8.27.05 (2026-08-27)" [level=4]
- list:
  - listitem: 🚀 Wdrożono automatyczny migrator bazy danych z LocalStorage (kvvfs) do OPFS (Baza 2.0). Wszyscy dotychczasowi użytkownicy odzyskają dostęp do swoich danych przy pierwszym uruchomieniu nowej wersji!
- heading "Wersja v2026.8.27.04 (2026-08-27)" [level=4]
- list:
  - listitem: 🚀 Dodanie wyświetlania rozmiaru bazy danych oraz naprawa przycisku eksportu pojedynczego szablonu na urządzeniach iOS Safari.
- heading "Wersja v2026.8.27.03 (2026-08-27)" [level=4]
- list:
  - listitem: 🚀 Dodano możliwość przywracania fizycznej bazy danych RAW z pliku .sqlite3. Uratowanie użytkowników iOS PWA po awarii cache.
- heading "Wersja v2026.8.27.02 (2026-08-27)" [level=4]
- list:
  - listitem: 🚀 Złamanie pętli cache (SW) i agresywny update PWA dla użytkowników iOS Safari.
- heading "Wersja v2026.8.27.01 (2026-08-27)" [level=4]
- list:
  - listitem: 🚨 Awaryjne ominięcie cache SW - wymuszenie świeżego dbWorker z naprawą WASM
- heading "Wersja v2026.8.26.15 (2026-08-26)" [level=4]
- list:
  - listitem: 🛠️ Krytyczna naprawa WASM - pobieranie binarnego pliku z absolutnym URL zamiast locateFile
- heading "Wersja v2026.8.26.14 (2026-08-26)" [level=4]
- list:
  - listitem: 🛠️ Krytyczna naprawa ścieżki sqlite3.wasm w workerze - fix dla iOS Safari i WebAssembly
- heading "Wersja v2026.8.26.13 (2026-08-26)" [level=4]
- list:
  - listitem: 🛠️ Krytyczna naprawa silnika bazy dla starszych urządzeń Apple (Safari)
- heading "Wersja v2026.8.26.12 (2026-08-26)" [level=4]
- list:
  - listitem: 🆘 Dodano Tryb Awaryjny zgrywania uszkodzonego pliku bazy SQLite
- heading "Wersja v2026.8.26.11 (2026-08-26)" [level=4]
- list:
  - listitem: 🔒 Dodano zabezpieczenie przycisku eksportu bazy przed uszkodzeniem
- heading "Wersja v2026.8.26.10 (2026-08-26)" [level=4]
- list:
  - listitem: "🔧 Fix: Krytyczne błędy bazy i znikające posiłki"
- heading "Wersja v2026.8.26.09 (2026-08-26)" [level=4]
- list:
  - listitem: 🚀 Krytyczna naprawa pętli aktualizacji PWA i stabilności
- heading "Wersja v2026.8.26.08 (2026-08-26)" [level=4]
- list:
  - listitem: "🔥 Hotfix 4: Naprawa białych znaków (Enter) w zmiennej confirm w zakładce Diagnostyka."
- heading "Wersja v2026.8.26.07 (2026-08-26)" [level=4]
- list:
  - listitem: 🧨 Wdrożono narzędzie awaryjnego formatowania bazy danych z poziomu Diagnostyki i naprawiono błędy cichego zapisu treningu.
- heading "Wersja v2026.8.26.06 (2026-08-26)" [level=4]
- list:
  - listitem: "🔥 Hotfix 3: Naprawa błędu składni blokującego ładowanie aplikacji (SettingsUI)."
- heading "Wersja v2026.8.26.05 (2026-08-26)" [level=4]
- list:
  - listitem: "🔥 Hotfix 2: Naprawa błędu składni (Missing }) w TrainingUI."
- heading "Wersja v2026.8.26.04 (2026-08-26)" [level=4]
- list:
  - listitem: "🔥 Hotfix: Naprawiono błąd składni 'Unexpected identifier' w DatabaseManager."
- heading "Wersja v2026.8.26.03 (2026-08-26)" [level=4]
- list:
  - listitem: 🔧 Optymalizacja bazy (Retencja zdjęć do 1 dnia) oraz interaktywny wykres Diety pozwalający na przegląd i kasowanie historii posiłków.
- heading "Wersja v2026.8.26.02 (2026-08-26)" [level=4]
- list:
  - listitem: 🛠️ Wdrożono narzędzie automatycznej migracji i defragmentacji bazy danych naprawiające błędy 'disk I/O error'. Dodano eksport i import Planów Treningowych do JSON oraz poprawiono klawiaturę Numpad i Kreator Koszyka.
- heading "Wersja v2026.8.26.01 (2026-08-26)" [level=4]
- list:
  - listitem: 🛠️ Przebudowano silnik multimedialny (Faza 2). Zdjęcia są teraz przechowywane asynchronicznie w przestrzeni OPFS/IndexedDB. Znacznie zmniejszono obciążenie bazy SQL i przyspieszono ładowanie aplikacji!
- heading "Wersja v2026.8.25.03 (2026-08-25)" [level=4]
- list:
  - listitem: "🚀 BAZA DANYCH 2.0 (OPFS): Przeniesiono silnik bazy SQLite z głównego wątku do Web Workera (dbWorker). Odblokowano bezstratny zapis gigabajtów danych bez ryzyka wyczerpania localStorage! Ponadto operacje masowe zyskały asynchroniczne transakcje, co czyni apkę diabelnie szybką. ⚡"
- heading "Wersja v2026.8.25.02 (2026-08-25)" [level=4]
- list:
  - listitem: "🥗 DIETA UI: Powiększono czcionki dla makro i przycisków akcji, wyrównano szerokość przycisków, a korekta kalorii działa teraz precyzyjnie (o 1 kcal) z możliwością wpisania z klawiatury!"
- heading "Wersja v2026.8.25.01 (2026-08-25)" [level=4]
- list:
  - listitem: "📸 DIETA: Dodano podgląd miniatur dla analizowanych posiłków ze zdjęć oraz nowe okno potwierdzenia wyniku sztucznej inteligencji, pozwalające ręcznie dostosować (+/-) wykryte kalorie przed zapisaniem ich do dziennika!"
- heading "Wersja v2026.8.24.04 (2026-08-24)" [level=4]
- list:
  - listitem: "🌐 PWA OFFLINE (STABILNOŚĆ): Naprawiono błąd 'DietAI Error', który zawieszał aplikację przy braku dostępu do internetu. Dodano regułę omijającą cache dla wszystkich połączeń z chmurą Cloudflare (workers.dev). Teraz w przypadku braku sieci aplikacja natychmiast wyświetli czytelny komunikat 'No internet connection', pozwalając na dalszą pracę offline!"
- heading "Wersja v2026.8.24.03 (2026-08-24)" [level=4]
- list:
  - listitem: "🐞 HISTORIA TRENINGÓW (POPRAWKA): Rozszerzono logikę wyświetlania 'Bloków Łączonych' (Superserii) na główny, duży panel podglądu w zakładce Historii (modal po kliknięciu detali treningu). Wcześniej superserie w tym miejscu wyświetlały się błędnie jako 'Nieznane ćwiczenie'. Teraz widzisz piękną listę swoich superserii!"
- heading "Wersja v2026.8.24.02 (2026-08-24)" [level=4]
- list:
  - listitem: "💪 WŁASNE ĆWICZENIA (Prywatny Katalog): Wszystkie Twoje własne ćwiczenia wpisywane z palca w Treningu i Kreatorze trafiają teraz automatycznie do prywatnego katalogu! Będą pojawiać się jako podpowiedzi przy kolejnych treningach."
  - listitem: "📝 KREATOR SZABLONÓW: Opcja masowej edycji 'Zastosuj do wszystkich' została zmieniona na 'Zastosuj do zaznaczonych'. Możesz teraz łatwo odznaczać ćwiczenia, by masowo zmieniać parametry tylko dla wybranych z nich!"
  - listitem: "🏃IKONY TYPU ĆWICZENIA: Przycisk zmiany typu (Siłowe 🏋️ / Cardio 🏃) w Kreatorze i podczas Treningu zyskał dodatkowy opis tekstowy, aby było w 100% jasne, że jest on klikalny i do czego służy."
  - listitem: "🔎 HISTORIA TRENINGU: Naprawiono błąd wyświetlania 'Nieznane ćwiczenie' w podglądzie historii, gdy wykonywano Superserie (Bloki Łączone). Teraz w podglądzie wyraźnie widać nagłówek 'Blok Łączony' i listę wykonanych pod-ćwiczeń wraz z seriami."
  - listitem: "🚴 ZAJĘCIA ZORGANIZOWANE: Powrót kategorii 'Zajęcia zorganizowane' do głównego katalogu (Tabata, Crossfit, Zumba, Spinning itp.)."
  - listitem: "🐞 POPRAWKI BŁĘDÓW: Wyeliminowano krytyczny błąd podczas klonowania starych treningów, który powodował załamanie aplikacji (TypeError przy wczytywaniu serii). Twoje stare plany są znów w 100% bezpieczne do klonowania!"
- heading "Wersja v2026.8.24.01 (2026-08-24)" [level=4]
- list:
  - listitem: "🚀 KREATOR PLANU (KOSZYK): Przebudowa interfejsu (UX). Baza Ćwiczeń uruchamia się teraz eleganckim panelem pop-up (Modal) po kliknięciu 'Dodaj ćwiczenie', eliminując uciążliwe przewijanie ekranu! Pasek 'Zastosuj do wszystkich' powędrował na samą górę, by zawsze był pod ręką. 🛒"
  - listitem: "🏋️ WŁASNE ĆWICZENIA: Wprowadzanie własnych nazw ćwiczeń posiada od teraz intuicyjny przełącznik (ikona 🏋️/🏃), który natychmiast klasyfikuje ćwiczenie jako Siłowe lub Cardio, zachowując czystość interfejsu na jednym ekranie (bez zajmującej miejsce listy wyboru)."
  - listitem: "🔗 SUPERSERIE (BLOK ŁĄCZONY): Całkowicie przebudowano wygląd bloków łączonych (superserii). Usunięto zbędne boczne marginesy na telefonach, przez co cała szerokość ekranu jest teraz dostępna dla przycisków i nazw - koniec z ucinanymi tekstami na małych urządzeniach! Dodatkowo tworzenie superserii z automatu ładuje 1 ćwiczenie (zamiast 2), przyspieszając pracę."
  - listitem: "🐞 HOTFIX (Crash): Naprawiono krytyczny błąd powodujący crash przy klikaniu 'Skopiuj do tego dnia' w starszych treningach posiadających superserie."
  - listitem: "🥗 DIETA: Klonowanie (kopiowanie) raz dodanych posiłków jest już dostępne za jednym kliknięciem! Dodatkowo zrezygnowano z wymuszania włączania aparatu przy dodawaniu zdjęć w Diecie – po kliknięciu 'Dodaj zdjęcie' telefon naturalnie zapyta, czy otworzyć aparat, czy wybrać fotkę z galerii. Obliczanie zapotrzebowania jest teraz wspierane dużym, pomarańczowym i soczystym przyciskiem! 🍽️"
- heading "Wersja v2026.8.22.08 (2026-08-22)" [level=4]
- list:
  - listitem: "🐞 HOTFIX (Numpad): Zastosowano ostateczne poprawki blokujące ucinanie i wychodzenie kalkulatora poza prawą krawędź ekranu. Zmieniono pozycjonowanie na elastyczne 'width: 100vw' w połączeniu z blokadą 'max-width' – koniec ze znikającymi przyciskami 'Zamknij' oraz cyframi, formatka idealnie wpasowuje się w każdy smartfon! 📱💪"
- heading "Wersja v2026.8.22.07 (2026-08-22)" [level=4]
- list:
  - listitem: "🛡️ Dodatkowe zabezpieczenie RWD: Zastosowano pozycjonowanie 'left/right' (zamiast sztywnego width) dla Eksperymentalnego Numpada, by gwarantować idealne dopasowanie kalkulatora na absolutnie każdym modelu smartfona."
- heading "Wersja v2026.8.22.06 (2026-08-22)" [level=4]
- list:
  - listitem: "📱 Poprawiono responsywność Eksperymentalnego Numpada: Klawiatura i ekran z wpisywaną wartością (kg) idealnie dopasowują się teraz do szerokości każdego ekranu (naprawiono ucinanie prawej krawędzi)."
- heading "Wersja v2026.8.22.05 (2026-08-22)" [level=4]
- list:
  - listitem: "📟 Kalkulator z prawdziwego zdarzenia: Dodano duży ekran wyświetlający aktualnie wpisywane wartości bezpośrednio nad Eksperymentalnym Numpadem!"
  - listitem: "🧹 Minimalizm: Usunięto przestarzałe i nieużywane przyciski Spotify i YT Music, robiąc miejsce na to co ważne - trening."
  - listitem: 📝 Wybaczcie błąd techniczny! Poprawiono usterkę z wersji .04, która wyświetlała roboczy tekst w okienku zmian.
- heading "Wersja v2026.8.22.04 (2026-08-22)" [level=4]
- list:
  - listitem: Wdrożenie techniczne ekranu Numpada i czyszczenie interfejsu (Brak opisu).
- heading "Wersja v2026.8.22.03 (2026-08-22)" [level=4]
- list:
  - listitem: "🛠️ HOTFIX: Naprawiono krytyczny błąd w Laboratorium (Brak zdefiniowanej zmiennej isBodyweight), który powodował brak reakcji przycisku 'Dodaj Serię' na całkowicie pustym ćwiczeniu."
- heading "Wersja v2026.8.22.02 (2026-08-22)" [level=4]
- list:
  - listitem: "🚀 Laboratorium (BETA): Całkowicie nowy, eksperymentalny interfejs Numpada i Smart Stepperów podczas treningu! (Włączysz go w Ustawieniach)"
  - listitem: "📈 Kreator Szablonów: Dodano obsługę wartości po przecinku podczas masowego ustawiania serii, by jednym kliknięciem budować piramidy (np. 100,110,120 kg)!"
  - listitem: 🐞 Poprawiono zgłaszany błąd w kalendarzu, w którym po udanym zakończeniu treningu system nie odświeżał zielonej kropki bez twardego restartu.
  - listitem: 👑 Zaktualizowano system weryfikacji tokenów PRO - aplikacja już prawidłowo wyświetla wersję Heavy na panelu głównym po wpisaniu ważnego hasła!
- heading "Wersja v2026.8.22.01 (2026-08-22)" [level=4]
- list:
  - listitem: "✨ Wdrożenie Fazy Opcji 3: Dedykowany, nowiutki Kreator Szablonów (Koszyk) na nowej, przejrzystej karcie!"
  - listitem: "🛒 Przebudowany interfejs koszykowy: Wybierasz ćwiczenia z bazy i masowo aplikujesz wszystkim ilość serii, powtórzeń, oraz ciężar (z uwzględnieniem wartości na minus dla maszyn ze wspomaganiem!)."
  - listitem: 🔗 Kreator można odpalić prosto z panelu treningowego jako nowy, bezpieczny widok.
- heading "Wersja v2026.8.21.03 (2026-08-21)" [level=4]
- list:
  - listitem: "🕵️‍♂️ Analityk w akcji: System otrzymał głęboki raport UX dotyczący obsługi dotykowej, co przygotowuje grunt pod wielkie zmiany w interfejsie dodawania ćwiczeń (Swipe, Numpad, Smart Steppery)!"
  - listitem: "📝 Changelog na sterydach: Załataliśmy lukę, przez którą system wrzucał domyślny i 'suchy' opis przy nowych aktualizacjach. Od teraz każda łatka musi mieć pełne opisy z emotikonami, bo tak rzecze prawo! ⚖️"
- heading "Wersja v2026.8.21.02 (2026-08-21)" [level=4]
- list:
  - listitem: "⏱️ Czas trwania powiadomień: Zoptymalizowaliśmy trenera Edwarda. Jego chmurki z podpowiedziami znikają teraz po idealnych 6 sekundach."
  - listitem: "📅 Przypomnienie o Trialu: Dodaliśmy mechanizm, który po wygaśnięciu okresu próbnego (status Light) przypomina o możliwości odblokowania wersji PRO tylko raz dziennie na starcie aplikacji, szanując Twój czas."
  - listitem: "🚀 Kolejne szlify aktualizatora: Wypuściliśmy wersję .02, aby upewnić się, że pobieranie PWA działa już całkowicie bezproblemowo!"
- heading "Wersja v2026.8.21.01 (2026-08-21)" [level=4]
- list:
  - listitem: "👑 Zmiana formatowania licencji: Informacja o dostępie (Heavy / Trial / Light) została przeniesiona na dół pulpitu, tuż przed numerem wersji (np. Trial v2026.8.21.01)."
  - listitem: "📜 Czytelniejszy pulpit: Link 'Zobacz co nowego (Changelog)' oraz okno z odliczaniem dni próbnych przeniesiono do sekcji 'Ustawienia i Profil', aby zapewnić maksymalny minimalizm na głównym ekranie."
  - listitem: "🛠️ Naprawa okienek do wpisywania ciężaru: Zwiększyliśmy szerokość pól tekstowych dla obciążeń z 48px na 62px – teraz trzycyfrowe wartości (np. 135 kg) mieszczą się idealnie i cyfry nie są ucinane!"
  - listitem: "🐞 Krytyczna poprawka aktualizacji (Bugfix): Naprawiono błąd w systemie wersjonowania, który powodował irytującą 'pętlę aktualizacji' oraz błędy Service Workera."
- heading "Wersja v2026.8.20.03 (2026-08-20)" [level=4]
- list:
  - listitem: 🔧 Wdrożenie dedykowanego narzędzia (w zakładce Diagnostyka) do automatycznego mapowania i unifikacji starych nazw ćwiczeń (np. 'wyciskanie płaska' -> 'Klatka - Wyciskanie sztangi - Ławka płaska') we wszystkich Twoich historycznych treningach.
  - listitem: "📈 Wdrożenie Fazy 8 (Analityka): Dodano interaktywny Wykres Progresu dla konkretnych ćwiczeń w zakładce Analiza Progresu."
  - listitem: 📊 Możliwość wyboru dowolnego ćwiczenia z rozwijanej listy i śledzenia historii maksymalnego podniesionego ciężaru (oraz powtórzeń) na przestrzenni czasu w formie estetycznego wykresu słupkowego.
- heading "Wersja v2026.8.20.01 (2026-08-20)" [level=4]
- list:
  - listitem: "👑 Wdrożenie Fazy 7: Model Freemium. Aplikacja rozróżnia wersję Light oraz Heavy (PRO). Użytkownicy Light nie mają dostępu do funkcji AI po 7 dniach."
  - listitem: Dodanie banera Premium na ekranie startowym (Dashboard), który odlicza dni Trial i informuje o statusie (Trial / Light / PRO).
  - listitem: "Poprawa działania Superserii: Dodawany jest jeden pusty blok ćwiczenia z możliwością rozszerzania go za pomocą dedykowanego przycisku '+ Kolejne ćwiczenie (Superseria)'."
  - listitem: Przebudowa wyglądu okna Superserii (ujednolicona szerokość i usunięto podwójne obramowanie, które sprawiało problemy na mniejszych ekranach).
  - listitem: "Cardio: Umożliwienie ręcznego wpisania czasu treningu w minutach zamiast używania stopera."
  - listitem: "Interfejs: Nowy, ładniejszy wygląd przycisków odtwarzaczy Spotify oraz YouTube Music."
- heading "Wersja v2026.8.19.1 (2026-08-19)" [level=4]
- list:
  - listitem: "📚 Wygodny Katalog Ćwiczeń: Zamiast ukrytej listy (która nie chciała działać na iPhone'ach), obok nazwy ćwiczenia znajdziesz teraz dedykowany przycisk '📚 Katalog', który otwiera czytelne okno wyboru."
  - listitem: "🗂️ Podział na partie mięśniowe: Katalog w pierwszej kolejności pozwala wybrać partię (np. Plecy, Klatka), a dopiero potem konkretne ćwiczenie, skracając listę i ułatwiając szukanie."
  - listitem: "📱 Ulepszona Responsywność Serii: Pola ciężaru i powtórzeń zostały zwężone i ciaśniej ułożone, dzięki czemu nawet przy dużym skalowaniu czcionki na ekranach iPhone'a przyciski się nie nachodzą i nie uciekają z ekranu."
  - listitem: "🔄 Fix Aktualizacji: Ostatecznie naprawiono błąd powodujący ciągłe pojawianie się paska 'Dostępna nowa aktualizacja' mimo poprawnego zainstalowania nowej wersji."
- heading "Wersja v2026.8.18.1 (2026-08-18)" [level=4]
- list:
  - listitem: "📚 Wbudowany Katalog Ćwiczeń: dodając ćwiczenie otrzymujesz inteligentne podpowiedzi z ujednoliconego słownika."
  - listitem: "🚀 Automatyczna Migracja Historii: Twoje stare nazwy ćwiczeń (np. Klatka płaska) zostały zaktualizowane w całej historii do profesjonalnych odpowiedników z katalogu."
  - listitem: "🏆 Czytelniejsze Rekordy Siłowe: W Analizie Progresu główny wynik (Ciężar x Powtórzenia) jest teraz na pierwszym planie, a szacowane 1RM pełni rolę wspierającą."
  - listitem: "📱 Ulepszona Responsywność: Rekordy wyświetlają się perfekcyjnie na każdym ekranie i przy dużej czcionce dzięki płynnemu zawijaniu (flex-wrap)."
  - listitem: "🎨 Szlify estetyczne udostępniania: Z karty podsumowującej treningi do social mediów zniknęła nadmiarowa, niebieska stopka."
- heading "Wersja v2026.8.17.4 (2026-08-17)" [level=4]
- list:
  - listitem: "🎨 Czysty layout grafiki do social mediów: Usunięto nakładający się niebieski napis ze stopki wygenerowanego obrazu."
  - listitem: "📐 Inteligentne skalowanie: Rekordy siłowe na wygenerowanej karcie są teraz dynamicznie rozmieszczane, aby idealnie wypełniać kadr bez obcinania tekstu."
- heading "Wersja v2026.8.17.3 (2026-08-17)" [level=4]
- list:
  - listitem: "📤 Udostępnianie Rekordów Siłowych: Dodano dedykowany przycisk generujący estetyczną grafikę z Twoimi najlepszymi wynikami siłowymi, gotową do publikacji na Instagramie lub Facebooku."
- heading "Wersja v2026.8.17.2 (2026-08-17)" [level=4]
- list:
  - listitem: "🏆 Precyzja faktów: Kafelki Rekordów Siłowych pokazują teraz Rzeczywisty Podniesiony Ciężar (np. 100 kg w 10 powtórzeniach), a szacowany wskaźnik 1RM prezentowany jest jako dodatkowa, czytelna ciekawostka."
- heading "Wersja v2026.8.17.1 (2026-08-17)" [level=4]
- list:
  - listitem: "🏆 Nowa sekcja w Analizie Progresu: Twoje Rekordy Siłowe (Szacowane 1RM). Aplikacja automatycznie wylicza Twój szacowany maksymalny ciężar na 1 powtórzenie (wzorem Epleya) z najlepszych serii roboczych."
  - listitem: "💡 Wyczerpujące wyjaśnienie wskaźnika 1RM: Dodano interaktywny modal informacyjny wyjaśniający, czym jest 1RM, dlaczego szacujemy go matematycznie zamiast ryzykować kontuzję oraz jak dobierać obciążenia robocze."
- heading "Wersja v2026.8.15.3 (2026-08-15)" [level=4]
- list:
  - listitem: "✨ Poprawiono ergonomię ikony Informacji (ℹ️): kliknięcie w ikonę przy Tonażu Ciała otwiera teraz elegancki modal wyjaśniający obliczenia kalisteniczne na urządzeniach mobilnych."
  - listitem: 🎩 Ujednolicono ton wypowiedzi Trenera Edwarda w module atlasu mięśni na w pełni profesjonalny i merytoryczny.
- heading "Wersja v2026.8.15.2 (2026-08-15)" [level=4]
- list:
  - listitem: 🔥 [HOTFIX] Wdrożenie Wykresu Hybrydowego i nowych kafelków w Analizie Progresu.
- heading "Wersja v2026.8.15.1 (2026-08-15)" [level=4]
- list:
  - listitem: "🔥 Wdrożono Wykres Hybrydowy w Analizie Progresu: pełne wsparcie dla treningów Cardio oraz Zajęć Zorganizowanych (Hyrox, Crossfit, Zumba, Spinning)."
  - listitem: 📈 Koniec z 0 kg! Paski dla aktywności tlenowych mają teraz dedykowane kolory (Ognisty dla Zajęć, Niebieski dla Cardio) i prezentują spalone kalorie (kcal), średnie tętno (bpm) oraz czas trwania.
  - listitem: 📊 Dodano nowy kafelek analityczny ze statystykami spalonych kalorii z zegarków (Smartwatch) na samej górze ekranu analizy.
  - listitem: "🧠 Inteligentny komparator trendu: aplikacja rozróżnia sesje siłowe od tlenowych, nie porównując błędnie tonażu między różnymi dyscyplinami."
- heading "Wersja v2026.8.14.22 (2026-08-14)" [level=4]
- list:
  - listitem: 🛠 Poprawiono kolejny błąd mapowania danych bazy podczas importu, tym razem w obrębie tabel dziennika diety (usunięto nieistniejące kolumny ze skryptu wczytującego).
  - listitem: "📝 Ulepszono moduł logowania błędów: błędy podczas przywracania danych będą teraz zawsze poprawnie zapisywane w systemie logów Diagnostyki."
- heading "Wersja v2026.8.14.21 (2026-08-14)" [level=4]
- list:
  - listitem: 🛠 Naprawiono schemat importu bazy danych, który blokował prawidłowe przywrócenie archiwum z powodu niedopasowania nazw nowych kolumn z typami treningów.
- heading "Wersja v2026.8.14.20 (2026-08-14)" [level=4]
- list:
  - listitem: "🛠 Naprawiono krytyczny błąd w zakładce Diagnostyka: przyciski (np. Przywróć z Pliku, Utwórz Archiwum) przestały reagować na kliknięcia, jeśli system nie miał zapisanych żadnych logów błędów."
- heading "Wersja v2026.8.14.19 (2026-08-14)" [level=4]
- list:
  - listitem: "📱 Poprawiono układ graficzny wizytówki: Przycisk wsparcia (Postaw Kawę) teraz perfekcyjnie dopasowuje się do szerokości ekranów smartfonów, unikając niepotrzebnego ucinania."
- heading "Wersja v2026.8.14.18 (2026-08-14)" [level=4]
- list:
  - listitem: ☕ Wdrożenie Modułu Monetyzacji (AI Premium). Narzędzia sztucznej inteligencji (Trener Edward oraz Analiza Zdjec Diety) są teraz dostępne za darmo przez pierwsze 7 dni od uruchomienia aplikacji. Następnie wymagają odblokowania tokenem wsparcia poprzez Suppi (Postaw Kawę).
  - listitem: 🔗 Dodano dedykowany przycisk wsparcia (Postaw Kawę) bezpośrednio na ekranie startowym (Wizytówce) aplikacji.
- heading "Wersja v2026.8.14.17 (2026-08-14)" [level=4]
- list:
  - listitem: 📅 Wprowadzono opcję *Przywracania* odwołanych treningów. Usunięto błąd logiki, przez który odwołany z harmonogramu trening wciąż świecił się na czerwono bez możliwości interakcji.
  - listitem: 📱 Poprawiono szerokość wierszy dla Dropsetów wewnątrz Super-Serii. Słowo *Dropset* zostało zastąpione intuicyjnym *↳ 🔥*, co wraz z redukcją marginesu całkowicie eliminuje problem nie mieszczących się elementów na małych ekranach przy dużej czcionce.
- heading "Wersja v2026.8.14.16 (2026-08-14)" [level=4]
- list:
  - listitem: "📅 Aktualizacja logiczna kalendarza: Od teraz automatyczne harmonogramy nie wypełniają już sztucznie minionych dni miesiąca (wstecz). Pokazują się tylko od dnia dzisiejszego w przód!"
  - listitem: "⚡ Natychmiastowe odświeżanie: Zmiana dni w harmonogramie modalu ładuje widok kalendarza w czasie rzeczywistym zaraz po zamknięciu okna (bez konieczności ręcznego przeładowywania)."
- heading "Wersja v2026.8.14.15 (2026-08-14)" [level=4]
- list:
  - listitem: 📅 Kalendarz Faza 4 - Harmonogramy Treningów! Dodano możliwość przypisania Szablonu Planu Treningowego do konkretnych dni tygodnia (np. każdy Poniedziałek i Środa).
  - listitem: "🟢 Kalendarz zyskał inteligentne kropki: pomarańczowa (zaplanowany trening), zielona (trening zrealizowany), czerwona (trening pominięty)."
  - listitem: "🏃 Automatyczne uruchamianie: Kliknięcie w zaplanowany dzień w kalendarzu pozwala od razu wczytać i rozpocząć dedykowany plan z opcją przełożenia na inny dzień."
  - listitem: 🐛 Naprawiono błąd załamywania się wierszy i spadania przycisku X w widoku serii podczas skalowania dużych czcionek.
  - listitem: 💾 Udoskonalono formatowanie nazwy pobieranego pełnego archiwum bazy danych o sekundy (HH-mm-ss).
- heading "Wersja v2026.8.14.14 (2026-08-14)" [level=4]
- list:
  - listitem: "📦 Pełne Archiwum Danych (Kopia Bezpieczeństwa v2.0): Udoskonalono silnik kopii zapasowej – archiwum obejmuje teraz 100% bazy SQLite (pomiary, treningi, pełną historię diety, raporty AI) oraz wszystkie ustawienia i szablony!"
  - listitem: "✨ Nowoczesne Okno Szablonów Planów Treningowych: Przywrócono pełną nazwę modułu, dodano stały nagłówek z przyciskiem zamknięcia (X) oraz możliwość zamknięcia okna jednym tapnięciem w tło!"
- heading "Wersja v2026.8.14.13 (2026-08-14)" [level=4]
- list:
  - listitem: "📐 Perfekcyjne Wyrównanie w Wierszu Serii: Checkbox, numer serii, pola ciężaru/powtórzeń oraz przycisk usunięcia są teraz idealnie wyśrodkowane w pionie na jednej linii wzroku!"
  - listitem: "🎯 Szablony Treningowe: Przyciski \"Wybierz\" i \"Usuń\" mają teraz idealnie równe proporcje (50%/50%) i zawsze mieszczą się w kafelku bez wyjeżdżania poza obrys."
  - listitem: "✨ Symetria Przycisków Analiz: Przycisk \"Analiza Miesięczna\" zyskał identyczny, zbalansowany dwuliniowy układ jak \"Analiza Tygodniowa\"."
  - listitem: "🥋 Profesjonalna Komunikacja Trenera: Oczyszczono wszystkie dymki Trenera Edwarda z wulgaryzmów – teraz komunikaty są w 100% profesjonalne, motywujące i z lekkim, sportowym humorem!"
- heading "Wersja v2026.8.14.12 (2026-08-14)" [level=4]
- list:
  - listitem: "🧠 Pełny Wywiad i Makroskładniki u Trenera Edwarda: Edward przed każdą analizą pyta teraz o sen, staż treningowy i cel sylwetkowy! Dodatkowo silnik AI przekazuje pełną gramaturę makroskładników (Białko, Węglowodany, Tłuszcze oraz Kalorie ze szczegółami każdego posiłku). Koniec z narzekaniem Edwarda na brak rozbicia makro!"
  - listitem: "📋 Import Planu Treningowego z Analizy AI: Każdy trening zaproponowany przez Trenera Edwarda możesz teraz jednym kliknięciem (\"📋 Plan\") zapisać jako gotowy Szablon Treningowy i od razu załadować go na siłowni!"
  - listitem: "🔙 Intuicyjna Nawigacja w Raporcie: Dodano wyraźny przycisk powrotu do aplikacji u góry i na samym dole raportu z zachowaniem bezpiecznego marginesu pod Dynamic Island / Notch na iPhone."
- heading "Wersja v2026.8.14.11 (2026-08-14)" [level=4]
- list:
  - listitem: "🛠️ Dopracowanie layoutu Serii: Zastosowano zaawansowany CSS, dzięki któremu, jeśli wiersz z Serią, polami wagi/powtórzeń i ikoną usuwania zmieści się na ekranie – zostanie ułożony elegancko w jednym wierszu. Dopiero gdy czcionka jest za duża i brakuje miejsca, inputy naturalnie centrują się pod spodem. Czysta magia front-endu!"
- heading "Wersja v2026.8.14.10 (2026-08-14)" [level=4]
- list:
  - listitem: "🔥 Responsywny formularz Serii: Całkowicie przebudowano wygląd wprowadzania powtórzeń i ciężaru. Pola są teraz niezależne i pięknie wyśrodkowane na ekranie. Koniec z nachodzącymi na siebie przyciskami (szczególnie widocznymi przy dużych czcionkach w systemie iOS!)."
  - listitem: "🎨 Nowy wygląd Szablonów: Przebudowano modal z zapisanymi planami treningowymi. O wiele czystszy układ z nazwą jako tytułem na środku, dokładnymi informacjami o przewidywanym czasie (jeśli zapisano z historii) oraz z wygodnymi przyciskami na całą szerokość ekranu."
- heading "Wersja v2026.8.14.09 (2026-08-14)" [level=4]
- list:
  - listitem: "🛠️ Potężna Kopii Zapasowa (Diagnoza): Teraz funkcja Eksportu w zakładce Diagnostyka zapisuje absolutnie WSZYSTKO – treningi, pomiary, ustawienia (awatar, nick, szablony), dziennik diety oraz analizy Trenera Edwarda. Śmiało możesz reinstalować aplikację z czystym sumieniem!"
  - listitem: "🎨 Kolejne szlify Treningu: Poprawiono wyrównanie pól wprowadzania ciężaru przy dużym rozmiarze czcionki na ekranie (zawijanie wierszy z zachowaniem wyśrodkowania)."
- heading "Wersja v2026.8.14.08 (2026-08-14)" [level=4]
- list:
  - listitem: "🎨 Szlify interfejsu (UX/UI): Zoptymalizowano rozmiar i proporcje nowych, powiększonych pól wprowadzania ciężaru i powtórzeń w trakcie treningu (pozbyto się czarnych kwadratów), żeby aplikacja wyglądała świetnie i profesjonalnie na ekranie smartfona!"
- heading "Wersja v2026.8.14.07 (2026-08-14)" [level=4]
- list:
  - listitem: "🛠️ Hotfix: Szybka naprawa krytycznego błędu (tzw. zawieszenie na Loading), który wdarł się do najnowszego modułu treningowego. Teraz wszystko znowu śmiga płynnie! Przepraszamy za usterkę."
- heading "Wersja v2026.8.14.06 (2026-08-14)" [level=4]
- list:
  - listitem: "✨ NOWOŚĆ: Przebudowano interfejs aktywnego treningu — powiększono pola wprowadzania wagi i powtórzeń dla lepszej widoczności podczas ćwiczeń (Styl 'Large Input')."
  - listitem: "✨ NOWOŚĆ: Kalendarz Historii Treningów wzbogacony o nowy przycisk '🔍 Podgląd'. Kliknięcie pozwala na szybkie podejrzenie pełnych statystyk odbytego treningu w formie estetycznego modala, bez opuszczania widoku kalendarza."
  - listitem: "✨ NOWOŚĆ: Historia Treningów zyskała przycisk '📝 Zapisz jako plan treningowy'. Możesz teraz jednym kliknięciem przerobić swój wyśmienity trening w gotowy do powtórzenia szablon na przyszłość!"
  - listitem: "✨ NOWOŚĆ: Możliwość określenia swojego 'Stażu Treningowego' w Profilu. Informacja ta w połączeniu z historią jest przekazywana do Trenera Edwarda, aby ten celniej dobierał obciążenia i złożoność ćwiczeń."
  - listitem: "✨ NOWOŚĆ: Panel Trenera Edwarda zyskał przycisk '💾 Zapisz raport (TXT)'. Teraz każdą cenną analizę AI możesz wyeksportować i zabrać ze sobą w pliku."
  - listitem: "🚨 HOTFIX: Całkowicie wyeliminowano problem braku reakcji aplikacji przy wyczerpanym limicie 429 API, dodano czytelne ekrany informujące o przekroczeniu darmowej puli (Quota)."
  - listitem: "🚨 HOTFIX: Usunięto krytyczny błąd w Diagnostyce, który uniemożliwiał wyeksportowanie kopii zapasowej całej bazy danych w formacie JSON."
- heading "Wersja v2026.8.14.04 (2026-08-14)" [level=4]
- list:
  - listitem: "✨ NOWOŚĆ: Przebudowano Szablony Treningowe na Plany Treningowe z edycją ćwiczeń w locie (Checkboxy)."
  - listitem: 🤖 Trener Edward po szkoleniu! Oferuje teraz głębszą, profesjonalną analizę medyczną z uwzględnieniem objętości i splitu.
  - listitem: "🚨 HOTFIX: Wymuszona aktualizacja naprawiająca zaciętą pętlę ekranu nowości PWA (Problem wersji .03 rozwiązywany bezwzględnie)."
- heading "Wersja v2026.8.14.03 (2026-08-14)" [level=4]
- list:
  - listitem: "🚨 HOTFIX: Poprawa obsługi błędów 429 dla Trenera Edwarda (Komunikaty o limitach API)."
- heading "Wersja v2026.8.14.02 (2026-08-14)" [level=4]
- list:
  - listitem: "🚨 HOTFIX: Wymuszona aktualizacja z lepszą obsługą komunikatów o wyczerpaniu limitów API oraz poprawionym tekstem w analityce."
- heading "Wersja v2026.8.14.01 (2026-08-14)" [level=4]
- list:
  - listitem: "✨ NOWOŚĆ: Strona Wizytówkowa (Landing Page). Od teraz aplikacja dostępna jest w 100% z poziomu ikony PWA, a w przeglądarce wyświetla instrukcję instalacji."
- heading "Wersja v2026.8.13.04 (2026-08-13)" [level=4]
- list:
  - listitem: "🚨 HOTFIX: Wymuszona nowa aktualizacja, w której ostatecznie zsynchronizowaliśmy typy danych (images) dla serwera AI."
- heading "Wersja v2026.8.13.03 (2026-08-13)" [level=4]
- list:
  - listitem: "🚨 HOTFIX: Ostateczna naprawa komunikacji analiz AI z bazą SQLite oraz prawidłowe przesyłanie kontekstu do Cloudflare Workera."
- heading "Wersja v2026.8.13.02 (2026-08-13)" [level=4]
- list:
  - listitem: "✨ UX: Ujednolicono i powiększono czcionkę we wszystkich polach konfiguracji Profilu (Pomiary, Cele) oraz Ustawień."
  - listitem: "🚨 HOTFIX: Złagodzono irytujące zjeżdżanie ekranu (focus) na 'Opcje Treningu' po kliknięciu głównego kafelka 'Treningi', co pozwala teraz normalnie obejrzeć kalendarz."
  - listitem: "🚨 HOTFIX: Przycisk 'Pochwal się odznakami' w Ustawieniach znowu działa i generuje Twoje zrzuty z pucharami!"
  - listitem: "🧪 TESTY: 100% stabilności E2E Playwright - środowisko przygotowane do wypuszczenia sub-agentów!"
- heading "Wersja v2026.8.13.01 (2026-08-13)" [level=4]
- list:
  - listitem: "🚨 HOTFIX: Naprawiono błąd 'Brak zdjęcia lub tekstu' wyskakujący po wysłaniu samego zdjęcia jedzenia do Trenera Edwarda."
  - listitem: "🚨 HOTFIX: Naprawiono błąd braku odpowiedzi (i błędów 500) od chmury Trenera Edwarda z powodu zmian w obiekcie wyjściowym (obsługa samego tekstu)."
  - listitem: "🚨 HOTFIX: Zabezpieczenie przed niewidzialnym błędem podczas zapisu pustych danych tętna/kalorii z zegarka do starszych treningów."
  - listitem: "✨ NOWOŚĆ: Generowanie 'Paragonu treningowego' podczas udostępniania – dzieli się z przyjaciółmi pełną listą ćwiczeń i serii, a nie tylko suchymi statystykami!"
  - listitem: "✨ NOWOŚĆ: Eksport i Import Treningu – łatwo prześlesz znajomym wybitny plan treningowy, z możliwością jednoklikowego importu u nich."
  - listitem: "✨ UX: Ujednolicono i powiększono czcionkę we wszystkich polach konfiguracji Profilu oraz Ustawień."
- heading "Wersja v2026.8.10.05 (2026-08-13)" [level=4]
- list:
  - listitem: "✨ UX: Zwiększono czytelność numeru wersji na dole ekranu głównego (jaśniejszy kolor, cień)."
  - listitem: "✨ UX: Zmiana nazewnictwa znaczka 'PR! (1RM: X)' na bardziej zrozumiałe '🏆 Rekord! (Max: X kg)'."
  - listitem: "✨ UX: Poprawiono niejasny opis nagłówka nad starszymi treningami (zmieniono na 'Ostatnie treningi (wybierz, aby skopiować na dziś)')."
  - listitem: "✨ UX: Dodano wyświetlanie nazwy i typu treningu, a także statystyk z zegarka (Spalone kalorie i Średnie tętno) w podglądzie Historii Treningów."
  - listitem: "✨ UX: Zwiększono czcionkę pola wpisywania Nicku w ustawieniach Profilu."
  - listitem: "🚨 HOTFIX: Naprawiono błąd 'Nie znaleziono treningu w pamięci' podczas udostępniania pojedynczego treningu z ekranu Historii."
  - listitem: "🚨 HOTFIX: Złagodzono błąd (zamiast alertu prompt), gdy użytkownik przerwie udostępnianie ekranu w module Profilu i Analizy Progresu na niektórych przeglądarkach."
- heading "Wersja v2026.8.10.04 (2026-08-12)" [level=4]
- list:
  - listitem: "🚨 HOTFIX: Naprawiono błąd 'dietLogs.reduce is not a function' przy generowaniu analiz AI po stronie przeglądarek opartych na nowym cache'u (poprawiony sposób wyciągania wierszy z SQLite)."
- heading "Wersja v2026.8.10.03 (2026-08-12)" [level=4]
- list:
  - listitem: "🚨 HOTFIX KRYTYCZNY: Naprawiono błąd 'DatabaseManager is not a function' blokujący Analizę AI u niektórych użytkowników."
  - listitem: 🛠️ Usprawniono system cache'owania PWA. Aplikacja upewnia się teraz, że pobiera absolutnie najświeższe wersje modułów wewnętrznych (jak baza danych) po każdej aktualizacji, aby uniknąć konfliktów ze starymi wersjami.
- heading "Wersja v2026.8.10.02 (2026-08-10)" [level=4]
- list:
  - listitem: 📸 Przycisk ZRÓB FOTĘ wyrównany obok pola tekstowego — koniec z nachodzeniem na tekst!
  - listitem: "🤖 Walidacja AI: Jeśli brak treningów w wybranym okresie, Edward uprzejmie informuje że potrzebuje danych, zanim ruszy z analizą."
  - listitem: 😴 Sen jest teraz OPCJONALNY w analizie AI! Jeśli nie znasz swojego snu, kliknij 'Pomiń sen' — analiza powstanie z adnotacją o brakujących danych.
  - listitem: 🔢 Numer wersji aplikacji widoczny teraz pod kafelkami na pulpicie głównym.
  - listitem: 🗑️ Burger menu usunięty! Nawigacja tylko przez kafelki — szybciej, prościej, czyściej. Kliknij logo żeby wrócić na pulpit.
  - listitem: "🛠️ Naprawiony system aktualizacji: meta tag, service worker i CHANGELOG teraz zawsze zsynchronizowane."
- heading "Wersja v2026.8.10.01 (2026-08-10)" [level=4]
- list:
  - listitem: "🤖 NOWY MODUŁ: Analizy AI Trenera Edwarda! Własna zakładka na pulpicie z analizą tygodniową i miesięczną."
  - listitem: 📋 Historia analiz AI grupowana po roku i miesiącu — przejrzysta, z panelami do rozwijania.
  - listitem: "🏠 Nowy układ kafelków: Trening | Historia / Pomiary | Analiza / Dieta | Profil / Analizy AI | Diagnostyka / ☕ Postaw Kawę."
  - listitem: ☕ Postaw Kawę na pełną szerokość pod kafelkami!
  - listitem: 🐛 Naprawiono duplikat window.onerror (utrata logów w Diagnostyce).
  - listitem: 🐛 Usunięto zbędne script tagi AI z HTML (podwójne ładowanie modułów).
  - listitem: 🐛 Ujednolicone przyciski w Diagnostyce — spójny rozmiar i czcionka.
  - listitem: 📊 Wykres objętości zamieniony na czytelną listę sesji treningowych.
- heading "Wersja v.2026.8.9.12 (2026-08-09)" [level=4]
- list:
  - listitem: 🐛 Naprawiono pustą kartę Diagnostyki (brakujący HTML i renderowanie logów).
  - listitem: 🐛 Naprawiono błąd przy udostępnianiu treningów z widoku Historii (brak przypisania do obiektu window).
  - listitem: 🔥 Przygotowania pod wdrożenie Fazy 4.
- heading "Wersja v.2026.8.9.11 (2026-08-09)" [level=4]
- list:
  - listitem: "🛠️ Nowy Moduł Diagnostyki: Całkowicie wyizolowaliśmy funkcje techniczne (Eksport Bazy, Twardy Reset, Logi) do nowej, bezpiecznej zakładki na Ekranie Głównym."
  - listitem: "🛡️ Poprawki stabilności: ChatUI już nie zawiesza okna przy otwieraniu szablonów w tle, a PWA Updater agresywniej czyści pamięć podręczną by pobrać najnowszą wersję."
- heading "Wersja v.2026.8.9.10 (2026-08-09)" [level=4]
- list:
  - listitem: 🐛 Naprawiono widok Historii Treningów (błąd renderowania UI po wdrożeniu przycisku ratunkowego).
  - listitem: "📝 Wdrożono Złotą Zasadę Wersjonowania: PWA wymusza aktualizację z pominięciem starych cache'y."
- heading "Wersja v.2026.8.9.09 (2026-08-09)" [level=4]
- list:
  - listitem: "🚨 HOTFIX KRYTYCZNY: Naprawiono błąd układu graficznego, który powodował wyrzucenie Profilu i Ustawień na główny ekran, ukrywając Awatar i Nick. Twoje statystyki są całkowicie bezpieczne i wracają na swoje miejsce!"
  - listitem: 🐞 Ostateczne zsynchronizowanie wersji, aby Przycisk Paniki w końcu u każdego działał. Przepraszamy za usterki, lecimy dalej z formą!
- heading "Wersja v.2026.8.9.08 (2026-08-09)" [level=4]
- list:
  - listitem: 🚀 SZABLONY TRENINGOWE! Koniec z nudnym wklepywaniem tego samego co wtorek. Zapisz swój wymarzony trening jako szablon, nazwij go jak dzik i ładuj jednym kliknięciem! Lecimy z tematem!
  - listitem: 🏆 INTELIGENTNY SYSTEM PR i 1RM! Od dzisiaj wyliczamy Twoje szacowane maksymalne obciążenie w czasie rzeczywistym. Co więcej? Ustanów nowy rekord i spodziewaj się fajerwerków wprost od Trenera Edwarda! 🐗🔥
  - listitem: 🗺️ MAPA CIAŁA! Zastanawiasz się, co dzisiaj trenować? Odwiedź Analizę Progresu, a nasz system na podstawie Twoich wyczynów z ostatnich 48h wskaże, które partie aż proszą o litość na czerwono, a które są świeżutkie jak po 8h snu (zielone). Trener Edward już pędzi by dać Ci wskazówkę, kiedy robisz overtraining!
  - listitem: "🛠️ Przycisk Ratunkowy (Twardy Reset): Do sekcji Ustawień trafił nowy, czerwony przycisk 'Twardy Reset', który ratuje Cię, jeśli starsza wersja się zawiesi. Cache aplikacji wyparuje w sekundę bez utraty Twoich statystyk i wyników!"
- heading "Wersja v.2026.8.9.07 (2026-08-09)" [level=4]
- list:
  - listitem: "🛡️ Potężniejszy Brudnopis: Twój Draft zapamiętuje teraz absolutnie wszystko - od ćwiczeń, przez ręcznie wpisany czas, po kalorie ze smartwatcha i nazwę treningu! Nic nie zginie."
  - listitem: "🔍 Koniec z irytującym przybliżaniem: Zablokowaliśmy automatyczne powiększanie ekranu (zoom) na urządzeniach iOS podczas wpisywania danych z palca."
- heading "Wersja v.2026.8.9.06 (2026-08-09)" [level=4]
- list:
  - listitem: 🚑 Gorąca poprawka! Naprawiliśmy mały, ale złośliwy błąd, który powodował zawieszanie się zapisu treningu tuż po uruchomieniu (niezainicjowany moduł smartwatcha). Możesz już zapisywać bez żadnych przeszkód!
- heading "Wersja v.2026.8.9.05 (2026-08-09)" [level=4]
- list:
  - listitem: "💪 Ewolucja Treningów: Wprowadziliśmy długo wyczekiwany podział na Trening Siłowy, Cardio oraz Zajęcia Zorganizowane! Aplikacja sama dostosuje interfejs do tego, co właśnie ćwiczysz."
  - listitem: "🚴‍♂️ Gotowi na zajęcia: Wybierz z gotowej listy takie sztosy jak Tabata, HYROX, Les Mills CORE, Pośladki i Brzuch czy Rowery/Spinning, a jeśli brakuje Twoich - wpisz je ręcznie jednym kliknięciem!"
  - listitem: "🎶 Muzyka pod ręką: Do głównego panelu pod stoperem dodaliśmy skróty odpalszające Spotify i YT Music. Muza i pompa w jednym miejscu!"
  - listitem: "📱 Inteligentny Edward: Twój osobisty asystent nie śpi! Jeśli zminimalizujesz aplikację by odpisać na SMS-a, po powrocie Edward szybko doliczy czas i pogoni Cię do dalszej pracy nad formą!"
  - listitem: "🛠️ Żelazna Baza Danych: Załataliśmy lukę, przez którą specyficznie mierzone czasy z Cardio (i wartości NaN) potrafiły wysadzić zapis. Twoja baza SQLite jest teraz kuloodporna!"
- heading "Wersja v.2026.8.9.04 (2026-08-09)" [level=4]
- list:
  - listitem: 🛡️ Twój trening jest teraz niezniszczalny! Wdrożyliśmy zaawansowany system 'Brudnopisu' (Auto-Save), który w tle zabezpiecza każdą Twoją serię. Nawet jeśli napotkasz jakiś błąd, Twoje wpisy zostaną uratowane i odzyskasz je jednym kliknięciem. Dodatkowo ulepszyliśmy numerację Dropsetów. Trenuj bez obaw! 🚀
- heading "Wersja v.2026.8.9.03 (2026-08-09)" [level=4]
- list:
  - listitem: "🔄 Super Szybkie Aktualizacje: Zauważyliśmy, że przeglądarki czasami bywają zbyt uparte i uparcie trzymają starą pamięć podręczną (cache), ukrywając przed Wami najświeższe nowości. Daliśmy naszemu modułowi aktualizacji PWA potężnego kopa! Od teraz nowe wersje aplikacji bezbłędnie przebijają się przez cache i od razu pojawiają się na Twoim telefonie. Koniec z blokowaniem się aktualizacji! 🚀"
- heading "Wersja v.2026.8.9.02 (2026-08-09)" [level=4]
- list:
  - listitem: "🎯 Idealne Wyśrodkowanie: Okna w Analizie Progresu na telefonach nie uciekają już do prawej krawędzi. Zrozumieliśmy aluzję - wielki przycisk 'Zrozumiałem' zamieniliśmy na smuklejszy i zgrabniejszy przycisk 'Zamknij'."
  - listitem: "💎 Krystaliczna Tapeta: Efekt matowego szkła (blur) został całkowicie usunięty dla własnych tapet. Teraz Twoje zdjęcie jest ostre jak brzytwa i idealnie czytelne prosto pod kafelkami aplikacji!"
- heading "Wersja v.2026.8.9.01 (2026-08-09)" [level=4]
- list:
  - listitem: "🎯 Idealne Wyśrodkowanie: Okna w Analizie Progresu na telefonach nie uciekają już do prawej krawędzi. Zrozumieliśmy aluzję - wielki przycisk \"Zrozumiałem\" zamieniliśmy na smuklejszy i zgrabniejszy przycisk \"Zamknij\"."
  - listitem: "💎 Krystaliczna Tapeta: Efekt matowego szkła (blur) został zdjęty dla własnych tapet. Teraz Twoje zdjęcie jest ostre jak brzytwa i idealnie czytelne prosto pod kafelkami aplikacji!"
- heading "Wersja v.2026.8.8.03 (2026-08-08)" [level=4]
- list:
  - listitem: "🎨 Szlify Graficzne: Poprawiliśmy zawijanie tekstów w Analizie Progresu. Nawet najmniejsze ekrany telefonów bezbłędnie wyświetlają teraz opisy stref (np. Atletyczna)! 📱"
  - listitem: "🖼️ Własna Tapeta: Usunęliśmy gęstą mgłę z tła! Teraz wrzucając własną fotkę jako tapetę, cieszysz się jej widokiem w pełnej krasie za wszystkimi kafelkami."
  - listitem: "📖 Księga Uki'ego (Help): Instrukcja obsługi została gigantycznie rozbudowana! Każdy kafelek, każda opcja ma tam teraz swój zabawny i treściwy opis. Żaden ficzer Ci nie umknie!"
  - listitem: "📸 Gotowi na Insta: Twój system udostępniania statystyk na Social Media działa doskonale, ustawiając Twoje fotki z treningu jako epickie tło z mrocznym filtrem. Szpanuj formą bez przeszkód!"
- heading "Wersja v.2026.8.8.02 (2026-08-08)" [level=4]
- list:
  - listitem: "📊 Analityka Progresu: Całkowicie przebudowaliśmy analitykę! Zapomnij o nudnych powiadomieniach - witajcie piękne, kolorowe wskaźniki (gauge bars) pokazujące Twój poziom!"
  - listitem: "🧠 Instrukcja Obsługi: Dodaliśmy w Ustawieniach potężną dawkę wiedzy! Znajdziesz tam zabawną instrukcję pełną wskazówek i ukrytych ficzerów."
  - listitem: "🧮 Magiczny Minus: Poprawiliśmy działanie przycisku +/- dla ćwiczeń z ciężarem własnym. Nieważne czy wpiszesz 'podciąganie' z polskimi znakami czy bez - system to wychwyci!"
  - listitem: "⏱️ Precyzyjny Czas Treningu: Ręczne wpisywanie czasu treningu podzieliliśmy na przejrzyste godziny i minuty. Pełna kontrola nad Twoimi danymi!"
- heading "Wersja v.2026.8.8.01 (2026-08-08)" [level=4]
- list:
  - listitem: "🛠️ Stabilność Treningów: Szybko załataliśmy błąd wywalający trening przy łączeniu superserii z dropsetami. Twój progres znów jest bezpieczny!"
  - listitem: "📸 Dieta 2.0: Sztuczna inteligencja przeanalizuje teraz do 3 zdjęć posiłku naraz. Dodawaj składniki jak chcesz!"
  - listitem: "👤 Mój Profil, Mój Nick: Zmieniliśmy mechanizm zapisu danych – teraz Twój własny pseudonim ładuje się bezbłędnie."
  - listitem: "🕵️ Asystent Diagnostyczny: Usprawniliśmy logowanie awarii w tle, aby jeszcze szybciej wyłapywać i niszczyć błędy."
  - listitem: "⏱️ Kontrola Czasu: Zapomniałeś kliknąć stop? Od teraz przed zapisem treningu możesz ręcznie wpisać jego faktyczny czas trwania."
  - listitem: "🗣️ Gadatliwy Edward: Wydłużyliśmy czas wyświetlania motywacyjnych dymków trenera w trakcie ćwiczeń. Teraz na pewno niczego nie przegapisz!"
- heading "Wersja v.2026.8.7.28 (2026-08-07)" [level=4]
- list:
  - listitem: "🤖 Trener Edward 2.0: Inteligentny system reagujący na Twoje postępy! Spodziewaj się motywujących dymków po treningu."
  - listitem: "🎓 Kontekstowy Samouczek: Stary, inwazyjny samouczek odszedł w niepamięć. Apka podpowiada najważniejsze funkcje dokładnie wtedy, gdy ich potrzebujesz."
  - listitem: "🏆 System nagród za konsekwencję: Edward policzy Twoje treningi i co tydzień (po 7 sesjach) rzuci specjalnymi gratulacjami!"
  - listitem: "🛠️ Testy E2E zaktualizowane: Playwright w pełni wspiera nowe, bezpieczniejsze menu nawigacyjne aplikacji."
- heading "Wersja v.2026.8.7.27 (2026-08-07)" [level=4]
- list:
  - listitem: Wydanie nowej wersji poprawkowej.
- heading "Wersja v.2026.8.7.26 (2026-08-07)" [level=4]
- list:
  - listitem: "🔥 Naprawa mechanizmu aktualizacji PWA: Baner 'Co nowego?' będzie się teraz pojawiał znacznie skuteczniej i bez pętli."
  - listitem: 🛠️ Rozwiązano problem z zablokowaniem aplikacji (błąd ładowania ekranu) dla nowych użytkowników wywołany przez samouczek.
  - listitem: 🤖 Wdrożono środowisko testowe Playwright zapobiegające podobnym awariom w przyszłości.
- heading "Wersja v.2026.8.7.25 (2026-08-07)" [level=4]
- list:
  - listitem: "🔥 Błyskawiczny Hotfix: Naprawiono błąd 'SyntaxError' zablokowania aplikacji podczas ładowania samouczka."
  - listitem: 📱 Poprawiono układ graficzny ('Średnie Tętno' wychodzące poza ekran) w widoku dodawania parametrów ze smartwatcha dla mniejszych ekranów.
- heading "Wersja v.2026.8.7.24 (2026-08-07)" [level=4]
- list:
  - listitem: 🔦 Zmieniono sposób podświetlania elementów w samouczku. Zamiast zmieniać z-index warstw, tło tworzy teraz idealnie dociętą, przeźroczystą dziurę z efektem ostrości nad klikalnym elementem, rozwiązując wszystkie problemy z czarnym przykryciem.
- heading "Wersja v.2026.8.7.23 (2026-08-07)" [level=4]
- list:
  - listitem: 🛠️ Naprawiono ucinanie się dymków z samouczkiem na ekranach telefonów poprzez precyzyjne wyśrodkowanie okienek.
  - listitem: 🛠️ Zaktualizowano przycisk 'Zaktualizuj' w panelu 'Co nowego?' - teraz od razu prawidłowo instaluje PWA (wcześniej jedynie odświeżał widok).
- heading "Wersja v.2026.8.7.22 (2026-08-07)" [level=4]
- list:
  - listitem: 🎓 Nowy i ulepszony interaktywny Samouczek w stylu 'Liquid Glass' z pełnymi informacjami o wszystkich najważniejszych modułach, w tym o Diecie!
  - listitem: 🗑️ Naprawiono błąd, który powodował brak reakcji na przycisk 'Usuń' w widoku kalendarza treningowego.
- heading "Wersja v.2026.8.7.21 (2026-08-07)" [level=4]
- list:
  - listitem: 🔥 Krytyczna poprawka aktualizatora PWA. Wymuszono usunięcie błędnych skryptów z pamięci, co odblokowuje instalację przyszłych aktualizacji bez pętli komunikatów.
  - listitem: "✨ Elegancja dla treningu: Superserie zostały zebrane w jeden, podświetlany 'Blok Łączony' dla lepszej widoczności w trakcie ćwiczeń."
  - listitem: "🧠 Trening bez ciężaru: Ćwiczenia typu podciąganie, pompki, brzuszki, deska od teraz nie krzyczą o podanie ilości kilogramów (możesz to pole zostawić puste)."
- heading "Wersja v.2026.8.7.20 (2026-08-07)" [level=4]
- list:
  - listitem: "🚑 Hotfix (x2): Usunięcie krytycznych błędów blokujących Kafelki Nawigacyjne."
  - listitem: "🎓 Nowość: Dodano Interaktywny Samouczek oprowadzający po systemie, zbudowany w czystym JS!"
- heading "Wersja v.2026.8.7.18 (2026-08-07)" [level=4]
- list:
  - listitem: "💪 Inteligentna analiza Tonażu: od teraz pompki i podciągania wliczają masę Twojego ciała do przerzuconego ciężaru!"
  - listitem: 📸 Możliwość dodania do 3 zdjęć z treningu (dostępne tuż przed zakończeniem sesji).
  - listitem: 📤 Zdjęcia treningowe są automatycznie ustawiane jako tło przy udostępnianiu treningu!
  - listitem: "⌚ Dane ze Smartwatcha: Dodano pola Kalorii i Średniego Tętna."
  - listitem: ⏱️ Osobny Stoper start/stop dla ćwiczeń typu Cardio.
  - listitem: "🗣️ Trener Edward: odzywa się co 15 minut podczas aktywnego treningu."
  - listitem: 🛠️ Nowy panel diagnostyczny w 'Ustawieniach' i naprawa błędu crashowania superserii.
- heading "Wersja v.2026.8.7.16 (2026-08-07)" [level=4]
- list:
  - listitem: 🛠️ drobne zmiany w aplikacji (test logów v.16)
- heading "Wersja v.2026.8.7.10 (2026-08-07)" [level=4]
- list:
  - listitem: 🔥 Masywna Rewolucja Dietetyczna 3.0!
  - listitem: "🎯 Nowość: Edward przejął całkowitą kontrolę nad liczeniem Kalorii - Możesz podyktować co zjadłeś i jednocześnie cyknąć temu zdjęcie! Jedno kliknięcie wystarczy by obliczyć wszystko do zera."
  - listitem: "🔴 Nowość: Alarm nadmiarowy. System będzie intensywnie pulsował na czerwono powiadamiając Cię gdy tylko przekroczysz swój plan dietetyczny TDEE."
  - listitem: "📊 Nowość: Wbudowany 30-dniowy wykres słupkowy na zakładce Dieta pokazuje Twoje zjedzone kalorie byś idealnie widział całą historię."
- heading "Wersja v.2026.8.7.09 (2026-08-07)" [level=4]
- list:
  - listitem: ✨ Perfekcja tkwi w detalach! Wyrównaliśmy wizualnie przyciski kontynuacji i usuwania treningów, by interfejs cieszył oko jeszcze bardziej w każdej rozdzielczości.
- heading "Wersja v.2026.8.7.08 (2026-08-07)" [level=4]
- list:
  - listitem: 📡 Połączenie z centralą przywrócone! Usunęliśmy przeszkodę wymagającą ręcznej konfiguracji połączeń sieciowych z Cloudflare. Edward odpala się natychmiast, z użyciem dedykowanego tunelu!
- heading "Wersja v.2026.8.7.07 (2026-08-07)" [level=4]
- list:
  - listitem: 🎨 Szlify interfejsu (UX/UI)! Ikona wywołująca Edwarda chowa się inteligentnie po rozpoczęciu czatu, udostępniając maksymalną możliwą przestrzeń na ekranie Twojego smartfona. Rozmowy są teraz znacznie czystsze i wyraźniejsze!
- heading "Wersja v.2026.8.7.06 (2026-08-07)" [level=4]
- list:
  - listitem: 🗑 Zrobiliśmy porządki! Omyłkowo zdublowane lub niechciane treningi usuniesz teraz jednym kliknięciem z panelu dnia (z wbudowanym bezpiecznym oknem potwierdzenia). Twoja historia, Twoje zasady! 🧹
- heading "Wersja v.2026.8.7.05 (2026-08-07)" [level=4]
- list:
  - listitem: 📱 Zoptymalizowaliśmy pływające okno Trenera Edwarda pod telefony (iOS/Android)! Koniec z niepotrzebnie przybliżającym się ekranem podczas pisania na wirtualnej klawiaturze.
- heading "Wersja v.2026.8.7.04 (2026-08-07)" [level=4]
- list:
  - listitem: 🤖 Poznaj Edwarda! Twój nowy osobisty Trener AI jest gotowy do akcji. Znajdziesz go w prawym dolnym rogu ekranu – zadawaj pytania o dietę, trening lub po prostu poproś o dawkę motywacji!
  - listitem: "⚙️ Zaktualizowany silnik AI: Upewnij się, że Twój Cloudflare Worker posiada najnowszą łatkę obsługującą czat, którą przygotowaliśmy."
- heading "Wersja v.2026.8.7.03 (2026-08-07)" [level=4]
- list:
  - listitem: 👋 Witamy Cię osobiście! Nasz nowy system powitań zapamięta Twoje imię, aby aplikacja stała się jeszcze bardziej osobista.
  - listitem: 🔥 Wkraczamy na wyższy poziom! Dodaliśmy długo oczekiwane Dropsety oraz Superserie – buduj formę jeszcze intensywniej!
  - listitem: ✨ Drobne usprawnienia interfejsu (m.in. ułatwiony dostęp do nowych bloków ćwiczeń).
- heading "Wersja v.2026.8.7.02 (2026-08-07)" [level=4]
- list:
  - listitem: 🛠 Szybka poprawka wydajnościowa! Usunęliśmy drobne problemy, byś mógł skupić się wyłącznie na treningu.
- heading "Wersja v.2026.8.7.01 (2026-08-07)" [level=4]
- list:
  - listitem: "🔄 Wygodne powtórzenia: w treningu dodaliśmy nowy przełącznik 'Kopiuj ciężar do następnej serii', który oszczędzi Ci wpisywania tych samych liczb!"
  - listitem: "📅 Więcej na luzie: teraz możesz rozbić trening na części i dodać drugą (a nawet kolejną!) sesję treningową w tym samym dniu."
  - listitem: "🎤 AI rozumie kontekst: moduł rozpoznawania posiłków ze zdjęcia ma teraz dodatkowe pole - podyktuj lub wpisz opcjonalny kontekst (np. niewidoczne składniki sosu) przed wysłaniem do analizy AI!"
- heading "Wersja v.2026.8.6.16 (2026-08-06)" [level=4]
- list:
  - listitem: "✨ Szlify Social Media: udostępnianie Twoich postępów wygląda teraz obłędnie i obsługuje gramatykę zależną od płci!"
  - listitem: "👤 Nowość w Pomiarach: dodano wybór płci (Kobieta/Mężczyzna) z automatycznym zapamiętywaniem."
  - listitem: "🧠 Mądrzejsza Analityka: wbudowaliśmy specjalny wariant wzoru US Navy dla Pań (uwzględniający biodra) oraz dostosowane progi formy (FFMI, BF%, WHR)."
- heading "Wersja v.2026.8.6.15 (2026-08-06)" [level=4]
- list:
  - listitem: 🐛 Koniec z dublowaniem treningów! Funkcja 'Kontynuuj Trening' teraz idealnie zlicza czas i nadpisuje jeden wpis w historii.
  - listitem: "📷 Miniaturki w Treningu: po zrobieniu zdjęcia maszyny od razu zobaczysz jej zgrabny podgląd na liście ćwiczeń."
  - listitem: "🎨 Lifting Diety: większe czcionki, jaskrawe kolory makro i czytelniejsze kółko kaloryczne dla jeszcze lepszego UX."
- heading "Wersja v.2026.8.6.14 (2026-08-06)" [level=4]
- list:
  - listitem: "📈 Potężna aktualizacja Analityki: dodaliśmy wyliczanie poziomu tkanki tłuszczowej (BF%), indeksu FFMI i WHR, wraz z interpretacją Twojej formy!"
  - listitem: "📊 Wykresy historii: śledź swoje postępy na eleganckim wykresie słupkowym."
- heading "Wersja v.2026.8.6.13 (2026-08-06)" [level=4]
- list:
  - listitem: 🔧 Szlifujemy kody! Wprowadziliśmy optymalizacje, by apka działała płynniej i oszczędzała baterię.
- heading "Wersja v.2026.8.6.12 (2026-08-06)" [level=4]
- list:
  - listitem: ⚡ Przyspieszyliśmy działanie interfejsu. Ekran wczytuje się błyskawicznie!
- heading "Wersja v.2026.8.6.11 (2026-08-06)" [level=4]
- list:
  - listitem: 🛡️ Poprawiliśmy stabilność. Twoje dane są jeszcze bezpieczniejsze!
- heading "Wersja v.2026.8.6.10 (2026-08-06)" [level=4]
- list:
  - listitem: 🎨 Delikatny lifting interfejsu. Zadbaliśmy o spójność detali wizualnych.
- heading "Wersja v.2026.8.6.09 (2026-08-06)" [level=4]
- list:
  - listitem: ⚙️ Małe ulepszenia, wielka różnica! Przebudowaliśmy silnik pod maską dla jeszcze większej wydajności.
- heading "Wersja v.2026.8.6.08 (2026-08-06)" [level=4]
- list:
  - listitem: 🚀 Stabilność na medal! Rozwiązaliśmy rzadko spotykane błędy zgłaszane przez społeczność.
- heading "Wersja v.2026.8.6.07 (2026-08-06)" [level=4]
- list:
  - listitem: 📱 Lepsze wsparcie dla różnych rozdzielczości ekranu - każdy szczegół ma znaczenie!
- heading "Wersja v.2026.8.6.06 (2026-08-06)" [level=4]
- list:
  - listitem: 💪 Niezawodność to nasz cel - zoptymalizowaliśmy bazy danych dla szybszego zapisu.
- heading "Wersja v.2026.8.6.05 (2026-08-06)" [level=4]
- list:
  - listitem: ✨ Drobne, ale istotne poprawki, które usprawniają codzienne korzystanie z narzędzia.
- heading "Wersja v.2026.8.6.04 (2026-08-06)" [level=4]
- list:
  - listitem: 🔧 Stabilizacja logiki systemowej, dzięki której wszystko chodzi jak w szwajcarskim zegarku.
- heading "Wersja v.2026.8.6.03 (2026-08-06)" [level=4]
- list:
  - listitem: 🔧 Szlifujemy kody! Wprowadziliśmy optymalizacje, by apka działała płynniej i oszczędzała baterię.
- heading "Wersja v.2026.8.6.02 (2026-08-06)" [level=4]
- list:
  - listitem: Wdrożono inteligentny moduł Diety z rozpoznawaniem posiłków AI.
  - listitem: Dodano wyliczanie celu kalorycznego TDEE w zakładce Ustawienia.
  - listitem: Integracja z bezpiecznym serwerem pośredniczącym Cloudflare.
  - listitem: Poprawiono formatowanie numeru wersji w systemie.
- heading "Wersja v.2026.8.6.01 (2026-08-06)" [level=4]
- list:
  - listitem: Poprawiono proporcje kalendarza (skalowanie na urządzeniach mobilnych).
  - listitem: "Dodano zaawansowaną analitykę: wyliczanie BF% (US Navy) oraz FFMI."
  - listitem: Udostępnianie treningów i wyników w mediach społecznościowych z generowaniem grafiki z awatarem.
  - listitem: Naprawiono krytyczny błąd blokujący przełączanie zakładek.
  - listitem: Wdrożono zaawansowany baner aktualizacji PWA (w tym changelog).
- heading "Wersja v.2026.8.5.13 (2026-08-05)" [level=4]
- list:
  - listitem: Dodano pole 'Szyja' w pomiarach ciała (niezbędne do wyliczania BF%).
  - listitem: Dodano Wzrost w pomiarach ciała.
  - listitem: Poprawki formularzy w urządzeniach z systemem iOS (skalowanie paska daty).
  - listitem: Zoptymalizowano proces ładowania danych w historii pomiarów.
- button "🤖"
- text: Hej! 👋 Tutaj Dieta! Pamiętaj, że możesz dodać posiłek analizując zdjęcie aparatem!
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Diet AI Result Confirmation Modal', () => {
  4  |   test('powinien pokazać modal z przyciskami +/- i zapisać posiłek z miniaturą', async ({ page }) => {
  5  |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); });
  6  |     await page.goto('http://127.0.0.1:8080/');
  7  | 
  8  |     // Czekamy dłuższą chwilę na pełen start aplikacji
  9  |     await page.waitForTimeout(2000);
  10 |     
  11 |     // Ręcznie przejdź do zakładki Dieta
  12 |     await page.evaluate(() => window.switchTab('diet-dashboard'));
  13 |     // Zamiast wait for visible, po prostu poczekaj aż UI się wczyta
  14 |     await page.waitForTimeout(1000);
  15 | 
  16 |     // Ręcznie wywołujemy modal, tak jakby AI zwróciło wynik
  17 |     await page.evaluate(() => {
  18 |         const mockResult = {
  19 |             food_name: "Sałatka z kurczakiem",
  20 |             calories: 300,
  21 |             protein: 30,
  22 |             carbs: 10,
  23 |             fat: 15
  24 |         };
  25 |         const mockThumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  26 |         window.DietUI.showResultConfirmation(mockResult, mockThumbnail, null);
  27 |     });
  28 | 
  29 |     // Czekamy na pojawienie się modala (modal jest dołączony do body, więc będzie widoczny)
  30 |     const modal = page.locator('#diet-result-modal-overlay');
  31 |     await modal.waitFor({ state: 'visible' });
  32 | 
  33 |     // Sprawdzamy początkową wartość kalorii (teraz to input)
  34 |     const kcalDisplay = page.locator('#diet-result-kcal-display');
  35 |     await expect(kcalDisplay).toHaveValue('300');
  36 | 
  37 |     // Klikamy "+" by zwiększyć kalorie (o 1)
  38 |     const btnPlus = page.locator('#btn-plus-kcal');
  39 |     await btnPlus.click({ force: true });
  40 |     await expect(kcalDisplay).toHaveValue('301');
  41 | 
  42 |     // Klikamy "-" by zmniejszyć kalorie o 1 (wraca do 300) i jeszcze raz (299)
  43 |     const btnMinus = page.locator('#btn-minus-kcal');
  44 |     await btnMinus.click({ force: true });
  45 |     await btnMinus.click({ force: true });
  46 |     await expect(kcalDisplay).toHaveValue('299');
  47 | 
  48 |     // Test wpisywania wartości z ręki (bo to teraz input)
  49 |     await kcalDisplay.fill('400');
  50 |     await expect(kcalDisplay).toHaveValue('400');
  51 | 
  52 |     // Klikamy "Zapisz"
  53 |     await page.locator('#diet-result-save').click({ force: true });
  54 | 
  55 |     // Modal powinien zniknąć
  56 |     await modal.waitFor({ state: 'hidden' });
  57 | 
  58 |     // Sprawdzamy czy posiłek pojawił się na liście
  59 |     const todayList = page.locator('#diet-today-list');
> 60 |     await expect(todayList.locator('text=Sałatka z kurczakiem').first()).toBeAttached();
     |                                                                          ^ Error: expect(locator).toBeAttached() failed
  61 |     
  62 |     // Sprawdzamy, czy kalorie to 400 (po modyfikacji)
  63 |     await expect(todayList.locator('text=400 kcal').first()).toBeAttached();
  64 |   });
  65 | });
  66 | 
```