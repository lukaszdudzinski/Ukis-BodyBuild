
export const scienceContent = {
    sac: {
        id: 'sod-sac',
        title: 'SAC',
        content: `
            <div class="science-content">
                <h4>Czym jest SAC?</h4>
                <p><strong>SAC (Surface Air Consumption)</strong>, znany również jako wskaźnik
                    powierzchniowego zużycia gazu, określa, ile litrów czynnika oddechowego zużywasz w
                    ciągu jednej minuty na powierzchni (przy ciśnieniu 1 bar). Jest to wartość
                    indywidualna dla każdego nurka, zależna od kondycji, stresu, wysiłku i sprzętu.</p>

                <h4>Dlaczego to jest ważne?</h4>
                <p>Znajomość własnego SAC jest fundamentem bezpiecznego planowania. Pozwala przewidzieć,
                    na jak długo wystarczy gazu w butli na dowolnej planowanej głębokości. Bez tej
                    wiedzy planowanie rezerw gazu (np. metodą Rock Bottom) jest niemożliwe.</p>

                <h4>Wzór do obliczenia SAC</h4>
                <div class="formula-box">
                    <p class="formula-main">SAC = (AC · V) / (t · P)</p>
                    <ul class="formula-legend">
                        <li><strong>AC</strong> = Zużyty gaz w barach (Ciśnienie początkowe – Ciśnienie
                            końcowe)</li>
                        <li><strong>V</strong> = Pojemność butli w litrach</li>
                        <li><strong>t</strong> = Czas nurkowania w minutach</li>
                        <li><strong>P</strong> = Ciśnienie absolutne na średniej głębokości (w barach)
                        </li>
                    </ul>
                </div>

                <h4>Przykład obliczenia</h4>
                <p>Nurek używa butli 12-litrowej. Wykonał nurkowanie na głębokość 20 metrów (gdzie
                    panuje ciśnienie absolutne ok. 3 bar). Czas nurkowania wyniósł 40 minut, a w tym
                    czasie zużył 150 barów powietrza.</p>
                <div class="calculation-example">
                    SAC = (150 bar · 12 l) / (40 min · 3 bar)<br>
                    SAC = 1800 / 120<br>
                    <strong>SAC = 15 l/min</strong>
                </div>
                <p>Wynik: Ten nurek zużywa 15 litrów powietrza na minutę na powierzchni.</p>

                <div class="app-feature-highlight">
                    <h4>Funkcja Aplikacji Uki's Dive Tool</h4>
                    <p>Pamiętaj, że nie musisz liczyć tego ręcznie za każdym razem! Wyliczoną wartość
                        własnego SAC możesz zapisać w pamięci aplikacji Uki's Dive Tool.
                        Zapisana wartość będzie widoczna w sekcji <strong>Ustawienia</strong> i
                        aplikacja będzie ją automatycznie wykorzystywać do wszystkich przyszłych
                        kalkulacji planowania gazu i rezerwy.</p>
                </div>
            </div>
        `
    },
    nitrox: {
        id: 'sod-nitrox',
        title: 'Nitrox',
        content: `
            <div class="science-content">
                <!-- Audio Player -->
                <div class="lecture-audio-wrapper" style="margin: 0 0 20px 0; text-align: center; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                    <p style="margin-bottom: 8px; font-weight: bold; color: var(--color-text-primary);">🎧 Posłuchaj wykładu:</p>
                    <audio controls style="width: 100%; max-width: 400px; height: 40px;">
                        <source src="lectures/dalton/Nitroks_wydłuża_czas_i_ogranicza_głębokość.m4a" type="audio/mp4">
                        Twoja przeglądarka nie obsługuje elementu audio.
                    </audio>
                </div>

                <h3>Wstęp do Nitroksu (EANx)</h3>

                <h4>Czym jest Nitroks?</h4>
                <p><strong>Nitroks (Enriched Air Nitrox – EANx)</strong> to każda mieszanina azotu i
                    tlenu,
                    w której zawartość tlenu jest wyższa niż w powietrzu (czyli powyżej 21%).
                    Najpopularniejsze mieszanki to <strong>EAN32</strong> (32% tlenu) i
                    <strong>EAN36</strong> (36% tlenu).
                </p>
                <ul>
                    <li><strong>Zaleta:</strong> Mniej azotu w butli = mniej azotu w Twoim organizmie.
                        To
                        daje dłuższy czas bezdekompresyjny i większe bezpieczeństwo.</li>
                    <li><strong>Wada/Ryzyko:</strong> Więcej tlenu oznacza ryzyko toksyczności tlenowej.
                        Tlen staje się toksyczny pod zbyt dużym ciśnieniem. Dlatego musimy pilnować
                        głębokości (MOD).</li>
                </ul>

                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">

                <h4>1. MOD – Maksymalna Głębokość Operacyjna</h4>
                <p><strong>MOD (Maximum Operating Depth)</strong> to graniczna głębokość, na którą
                    możesz
                    bezpiecznie zejść z daną mieszanką, nie przekraczając bezpiecznego ciśnienia
                    parcjalnego
                    tlenu (ppO₂).</p>
                <ul>
                    <li>Standardowy limit bezpieczeństwa dla nurkowań rekreacyjnych (faza denna):
                        <strong>1.4 ata</strong>
                    </li>
                    <li>Limit absolutny (awaryjny/dekompresyjny): <strong>1.6 ata</strong></li>
                </ul>

                <div class="formula-box">
                    <p class="formula-main">MOD = ((Limit ppO₂ / FO₂) - 1) * 10</p>
                    <ul class="formula-legend">
                        <li><strong>Limit ppO₂</strong>: Zazwyczaj 1.4</li>
                        <li><strong>FO₂</strong>: Frakcja tlenu (np. dla EAN32 wpisujemy 0.32)</li>
                        <li><strong>-1</strong>: Odjęcie ciśnienia atmosferycznego</li>
                        <li><strong>*10</strong>: Konwersja z barów na metry</li>
                    </ul>
                </div>
                <div class="calculation-example">
                    <p><strong>Przykład:</strong> EAN32, Limit 1.4 ata</p>
                    MOD = (1.4 / 0.32 - 1) * 10<br>
                    MOD = (4.375 - 1) * 10<br>
                    <strong>MOD = 33.7 metra</strong>
                </div>

                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">

                <h4>2. Best Mix – Najlepsza Mieszanina</h4>
                <p>Sytuacja odwrotna do MOD. Wiesz, na jaką głębokość chcesz zanurkować, i chcesz
                    obliczyć,
                    jaka mieszanka da Ci najdłuższy czas na dnie.</p>

                <div class="formula-box">
                    <p class="formula-main">Best Mix = Limit ppO₂ / P_otoczenia</p>
                    <ul class="formula-legend">
                        <li><strong>P_otoczenia</strong>: (Głębokość / 10) + 1</li>
                    </ul>
                </div>
                <div class="calculation-example">
                    <p><strong>Przykład:</strong> Głębokość 30m (4 ata), Limit 1.4 ata</p>
                    Best Mix = 1.4 / 4 = 0.35<br>
                    <strong>Wynik: EAN35 (35% O₂)</strong>
                </div>

                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">

                <h4>3. EAD – Równoważna Głębokość Powietrzna</h4>
                <p><strong>EAD (Equivalent Air Depth)</strong> mówi nam, jaką głębokość mamy przyjąć do
                    odczytania limitu czasu z tabel powietrznych, używając Nitroksu.</p>

                <div class="formula-box">
                    <p class="formula-main">EAD = [ ((1 - FO₂) * (D + 10)) / 0.79 ] - 10</p>
                    <ul class="formula-legend">
                        <li><strong>1 - FO₂</strong>: Frakcja azotu w mieszance (FN₂)</li>
                        <li><strong>0.79</strong>: Frakcja azotu w powietrzu</li>
                        <li><strong>D</strong>: Głębokość rzeczywista</li>
                    </ul>
                </div>
                <div class="calculation-example">
                    <p><strong>Przykład:</strong> 30m na EAN32</p>
                    EAD = [ (0.68 * 40) / 0.79 ] - 10<br>
                    EAD = [ 27.2 / 0.79 ] - 10 = 34.4 - 10<br>
                    <strong>EAD = 24.4 metra</strong> (Zyskujesz czas, jakbyś był płycej!)
                </div>

                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">

                <h4>4. CNS – Zegar Tlenowy</h4>
                <p><strong>CNS (Central Nervous System)</strong> określa stopień narażenia układu
                    nerwowego
                    na toksyczność tlenową. Przekroczenie 100% grozi drgawkami.</p>
                <p>Bezpieczna granica dla nurkowania rekreacyjnego to zazwyczaj nieprzekraczanie 80%.
                </p>

                <div style="margin-top: 40px; text-align: center;">
                    <button id="start-nitrox-quiz-btn" class="action-button"
                        style="width: 100%; max-width: 300px;">
                        Sprawdź Wiedzę (Quiz)
                    </button>
                </div>
            </div>
        `
    },
    gas: {
        id: 'sod-gas',
        title: 'Planowanie Gazu',
        content: `
            <div class="science-content">
                <h4>Planowanie Gazu</h4>
                <div class="formula-box">
                    <p class="formula">L_faza = SAC * P_avg * T</p>
                    <ul class="detailed-legend">
                        <li><strong>L_faza:</strong> Zużycie gazu w danej fazie (l)</li>
                        <li><strong>SAC:</strong> Powierzchniowe zużycie gazu (l/min)</li>
                        <li><strong>P_avg:</strong> Średnie ciśnienie otoczenia (ATA)</li>
                        <li><strong>T:</strong> Czas trwania fazy (min)</li>
                        <li><strong>L_total:</strong> Całkowite zużycie (Zanurzenie + Dno +
                            Wynurzenie +
                            Przystanki)</li>
                    </ul>
                </div>
                <h4>Rock Bottom (Rezerwa)</h4>
                <div class="formula-box">
                    <p class="formula">RB_bar = (L_reakcja + L_wynurz) / V_butli</p>
                    <ul class="detailed-legend">
                        <li><strong>RB_bar:</strong> Minimalne ciśnienie rezerwy (bar)</li>
                        <li><strong>L_reakcja:</strong> Gaz na rozwiązanie problemu na dnie (l)</li>
                        <li><strong>L_wynurz:</strong> Gaz na bezpieczny powrót na powierzchnię (l)
                        </li>
                        <li><strong>V_butli:</strong> Pojemność wodna butli (l)</li>
                        <li><strong>SAC_stres:</strong> Zwykle 2x SAC normalny (stres)</li>
                        <li><strong>Os.:</strong> Liczba nurków (np. 2 w zespole)</li>
                        <li><strong>T_reakcja:</strong> Czas na opanowanie sytuacji (min)</li>
                    </ul>
                </div>
            </div>
        `
    },
    ballast: {
        id: 'sod-ballast',
        title: 'Balast',
        content: `
            <div class="science-content">
                <h4>Kalkulacja Balastu</h4>
                <div class="formula-box">
                    <p class="formula">Baza = 10% Wagi Ciała</p>
                    <p><strong>Korekty (Wagi):</strong></p>
                    <ul class="detailed-legend">
                        <li><strong>Skafandry:</strong>
                            <ul>
                                <li>Pianka 3mm: +1 kg</li>
                                <li>Pianka 5mm: +3 kg</li>
                                <li>Pianka 7mm: +5 kg</li>
                                <li>Suchy (Laminat/Crash/Trilaminat): +6-8 kg</li>
                                <li>Suchy (Neopren): +8-10 kg</li>
                                <li>Ocieplacz Cienki / Gruby: +0 / +5 kg</li>
                                <li>Docieplenie (Kamizelka): +2 kg</li>
                            </ul>
                        </li>
                        <li><strong>Butle (Single):</strong>
                            <ul>
                                <li>Alu 11L (S80): +2 kg</li>
                                <li>Alu 7L: +1 kg</li>
                                <li>Stal 7L/10L (232): -1/-2 kg</li>
                                <li>Stal 12L (232): -2 kg</li>
                                <li>Stal 15L (232): -3 kg</li>
                                <li>Stal 10L/12L (300): -3/-4.5 kg</li>
                            </ul>
                        </li>
                        <li><strong>Zestawy Twin:</strong>
                            <ul>
                                <li>Twin 2x7L (232/300): -5/-10 kg</li>
                                <li>Twin 2x8.5L (232/300): -6/-11 kg</li>
                                <li>Twin 2x10L (232/300): -7/-13 kg</li>
                                <li>Twin 2x12L (232/300): -10/-14 kg</li>
                                <li>Twin 2x15L (232/300): -12/-17 kg</li>
                            </ul>
                        </li>
                        <li><strong>Inne:</strong>
                            <ul>
                                <li>Płyta Stalowa: -2.5 kg</li>
                                <li>Płyta Alu: -0.5 kg</li>
                                <li>Woda Słona: +2.5 kg</li>
                                <li>Budowa Szczupła: -1 kg</li>
                                <li>Budowa Atletyczna: -3 kg</li>
                                <li>Nadwaga: +2 kg</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        `
    }
};
