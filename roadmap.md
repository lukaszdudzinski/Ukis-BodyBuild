# Uki's BodyBuild - Roadmapa Projektu

Dokument ten jest głównym źródłem prawdy o zaplanowanych funkcjach biznesowych i kierunku rozwoju aplikacji. Zawiera historię wykonanych faz oraz plany na przyszłe etapy.

## Wykonane Fazy

### Faza 1: Stabilność zapisu i bezpieczeństwo danych (ZAKOŃCZONE)
- [x] Naprawa błędów zapisu z Dropsetami i Superseriami.
- [x] Wdrożenie funkcji "Auto-Save" (Brudnopis), by chronić niezapisany trening.

### Faza 2: Modułowość Treningów i Smartwatch (ZAKOŃCZONE)
- [x] Wprowadzenie trzech typów treningu: Siłowy, Cardio, Zajęcia Zorganizowane.
- [x] Słownik zajęć zorganizowanych (Tabata, HYROX itp.).
- [x] Dodanie ręcznego wpisywania kalorii i tętna ze smartwatcha.

### Faza 3: Zaawansowana Analityka i Atlas Mięśni (ZAKOŃCZONE)
- [x] Szablony Treningowe (Zapisz / Załaduj plan).
- [x] Inteligentny system śledzenia 1RM (Personal Records).
- [x] Mapa Ciała (Atlas Mięśni) wskazująca zmęczenie danych partii.
- [x] Separacja funkcji diagnostycznych do kafelka "Diagnostyka".

### Faza 4: Wdrożenie AI - Trener Edward (ZAKOŃCZONE)
- [x] Kalkulator Dietetyczny ze zdjęcia posiłku (Cloudflare Worker).
- [x] System "Onboarding Tour" wprowadzający nowych użytkowników.
- [x] Analiza 7-dniowa i 30-dniowa generowana przez AI.
- [x] Architektura Modułowa (refaktor plików na ES6).

### Faza 4.5: Łatanie, Stabilizacja i E2E (ZAKOŃCZONE)
- [x] Solidne przetestowanie środowiska narzędziem Playwright.
- [x] Poprawki UI: naprawa kalendarza, ujednolicenie czcionek.
- [x] Naprawienie ukrytego błędu "DietAI" przy pustych promtach tekstowych.

---

## 🛠️ Obecna Faza: Faza 5 - Społeczność, Orkiestracja i Udostępnianie (W TRAKCIE)

Głównym celem Fazy 5 jest rozbudowa funkcji "Social" w aplikacji, by użytkownicy mogli łatwo chwalić się wynikami w internecie oraz wymieniać się planami treningowymi między sobą. To w tej fazie wdrożymy również sub-agenta do testów.

1. **Udostępnianie Graficzne Treningu (Zrzuty)**
   - Aktualnie system generuje tylko suchy tekst "Paragon Treningowy".
   - **Cel:** Należy użyć biblioteki takiej jak `html2canvas`, by generować wysokiej jakości render całego rozwinięcia Treningu w pięknej oprawie, gotowej do wstawienia np. na relację na Instagramie.

2. **Pełny Eksport / Import w `.json`**
   - **Cel:** Użytkownik musi mieć możliwość kliknięcia "Eksportuj", co wygeneruje plik JSON z całym danym treningiem. Kolega na innej maszynie klika "Importuj", ładuje ten sam plik, i od razu zapisuje sobie ten Trening w swojej historii lub jako szablon gotowy do użycia.

3. **Orkiestracja AI (Multi-Agent)**
   - **Cel:** Budujemy zautomatyzowany flow developerski. Przy każdym skomplikowanym wdrożeniu wywołujemy w tle sub-agenta "Testera", który przejmuje proces odpalania frameworka Playwright i weryfikuje czy nic się nie popsuło.

---

## 🔮 Faza 6: Grywalizacja i Dalszy Rozwój AI (PLANOWANE)

1. **Wyzwania Tygodniowe i Miesięczne**
   - Dodanie "Questów" z nagrodami (odznakami), np. "Zrób trening 4 razy w tym tygodniu", "Spal łącznie 5000 kcal".
2. **Synchronizacja w Chmurze (Web3 / Firebase)**
   - Opcjonalne dodanie backendu (np. Firebase), aby zapisywać stany bazy na różnych urządzeniach.
3. **Inteligentny Asystent Głosowy**
   - Możliwość gadania do Edwarda na żywo w trakcie treningu (przekształcanie głosu na tekst i dodawanie serii bez użycia rąk!).
