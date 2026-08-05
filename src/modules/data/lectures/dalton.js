export const daltonLecture = {
    id: 'dalton',
    title: 'Prawo Daltona',
    description: 'Fundament nurkowania Nitroxowego. Definicja, wzory, MOD, EAD i bezpieczeństwo.',
    presentationSrc: 'lectures/dalton/Dalton_s_Law_Diving_Survival.pdf',
    audioSrc: 'lectures/dalton/Prawo_Daltona_i_toksyczność_tlenu_pod_wodą.m4a',
    content: [
        { type: 'header', level: 2, value: 'Prawo Daltona – Klucz do Bezpiecznego Nurkowania' },
        { type: 'paragraph', value: '<strong>Wstęp: Dlaczego to prawo jest tak ważne?</strong><br>Wielu nurków na początku swojej drogi uważa fizykę za „zło konieczne”. Jednak Prawo Daltona to nie tylko sucha teoria – to fundamentalna zasada, która decyduje o tym, jak głęboko możemy bezpiecznie zejść i czym możemy oddychać. Zrozumienie tego prawa pozwala uniknąć dwóch śmiertelnych zagrożeń: toksyczności tlenowej i narkozy azotowej. Traktuj Prawo Daltona jako instrukcję obsługi mieszanin oddechowych pod wodą.' },

        { type: 'header', level: 3, value: '1. Definicja Prawa Daltona – "Zasada Sumowania"' },
        { type: 'paragraph', value: 'Wyobraź sobie, że powietrze to zespół muzyczny. Każdy muzyk (składnik gazu) gra na swoim instrumencie z określoną głośnością (ciśnieniem). Prawo Daltona mówi: <strong>Całkowite ciśnienie mieszaniny gazów jest równe sumie ciśnień parcjalnych (cząstkowych) poszczególnych gazów wchodzących w jej skład.</strong>' },
        {
            type: 'html',
            value: '<div class="formula-box"><p class="formula">P<sub>całkowite</sub> = ppGaz<sub>1</sub> + ppGaz<sub>2</sub> + ppGaz<sub>3</sub> …</p></div>'
        },
        { type: 'paragraph', value: 'W nurkowaniu najważniejszy wniosek z tego prawa brzmi: <strong>Fizjologiczne oddziaływanie gazu na organizm nurka (to, czy nas uśpi, otruje, czy podtrzyma przy życiu) zależy od jego ciśnienia parcjalnego (pp), a nie od procentowej zawartości w butli.</strong>' },

        { type: 'header', level: 3, value: '2. Jak to działa w praktyce? "Efekt Lupy"' },
        { type: 'paragraph', value: 'Na powierzchni (1 bar) oddychamy powietrzem, które ma ok. 21% tlenu i 79% azotu.' },
        {
            type: 'list', items: [
                'Ciśnienie parcjalne tlenu (ppO<sub>2</sub>) = 0,21 bara.',
                'Ciśnienie parcjalne azotu (ppN<sub>2</sub>) = 0,79 bara.'
            ]
        },
        { type: 'paragraph', value: 'Gdy schodzimy pod wodę, ciśnienie otoczenia rośnie. Działa to jak szkło powiększające – procentowy skład gazu w butli się nie zmienia (nadal mamy 21% tlenu), ale "siła" działania (ciśnienie parcjalne) każdego gazu rośnie proporcjonalnie do głębokości.' },
        { type: 'paragraph', value: '<strong>Przykład na 30 metrach (4 bary ciśnienia absolutnego):</strong><br>Wdychasz 4 razy więcej cząsteczek tlenu i azotu w każdym oddechu niż na powierzchni.' },
        {
            type: 'list', items: [
                'ppO<sub>2</sub> = 0,21 × 4 = 0,84 bara (to tak, jakbyś na powierzchni oddychał gazem o zawartości 84% tlenu!).',
                'ppN<sub>2</sub> = 0,79 × 4 = 3,16 bara.'
            ]
        },

        { type: 'header', level: 3, value: '3. Prawo Daltona a Zagrożenia Medyczne' },
        { type: 'paragraph', value: 'Prawo Daltona jest „tłumaczem” między ciśnieniem w butli a reakcją Twojego organizmu. Mówi ono wprost: im głębiej jesteś, tym bardziej każdy gaz z osobna próbuje wpłynąć na Twoje tkanki.' },

        { type: 'header', level: 4, value: 'A. Toksyczność Tlenowa Ośrodkowego Układu Nerwowego (CNS)' },
        { type: 'paragraph', value: 'Tlen pod wysokim ciśnieniem parcjalnym (powyżej 1,4–1,6 bara) przestaje być gazem życiodajnym, a staje się neurotoksyną. Działa jak „przeładowanie” układu elektrycznego mózgu, co prowadzi do gwałtownych wyładowań, czyli drgawek (ataku podobnego do padaczki).' },
        { type: 'paragraph', value: '<strong>Kluczowe objawy – Akronim ConVENTID:</strong> Aby zapamiętać sygnały ostrzegawcze, używamy angielskiego akronimu ConVENTID. Należy pamiętać, że objawy te mogą wystąpić w dowolnej kolejności, ale drgawki często pojawiają się bez żadnego ostrzeżenia.' },
        {
            type: 'list', items: [
                '<strong>Con – Convulsions (Drgawki):</strong> Najgroźniejszy objaw. Mogą wystąpić nagle. Dzielą się na fazę toniczną (sztywność mięśni, zatrzymanie oddechu) i kloniczną (gwałtowne skurcze). Pod wodą grozi to wypluciem automatu i utonięciem.',
                '<strong>V – Vision (Zaburzenia wzroku):</strong> Widzenie tunelowe (zawężenie pola widzenia), „mroczki” przed oczami, nieostre widzenie lub nadwrażliwość na światło.',
                '<strong>E – Ears (Zaburzenia słuchu):</strong> Dzwonienie, szum w uszach, dziwne echa lub wrażenie „stukania”.',
                '<strong>N – Nausea (Nudności):</strong> Nagłe mdłości, które mogą pojawiać się falami (często mylone z chorobą morską, ale pod wodą to sygnał alarmowy).',
                '<strong>T – Twitching (Drżenie mięśni):</strong> Niekontrolowane drganie drobnych mięśni, najczęściej twarzy (wargi, powieki) lub dłoni. Jest to jeden z najbardziej charakterystycznych i wiarygodnych sygnałów ostrzegawczych.',
                '<strong>I – Irritability (Drażliwość/Irytacja):</strong> Nagła zmiana nastroju, niepokój, splątanie, agresja lub euforia. Jeśli spokojny nurek nagle staje się nerwowy bez powodu, może to być toksyczność tlenowa.',
                '<strong>D – Dizziness (Zawroty głowy):</strong> Dezorientacja, problemy z błędnikiem, uczucie wirowania.'
            ]
        },
        { type: 'info-box', style: 'warning', content: '⚠️ <strong>Reakcja:</strong> Jeśli zauważysz u siebie lub partnera jakikolwiek z tych objawów (poza drgawkami), należy natychmiast, ale spokojnie, wynurzyć się na mniejszą głębokość, aby zmniejszyć ciśnienie parcjalne tlenu (ppO<sub>2</sub>).' },
        { type: 'image', src: 'lectures/dalton/conventid.png', alt: 'Infografika: ConVENTID - Objawy toksyczności tlenowej' },

        { type: 'header', level: 4, value: 'B. Narkoza Azotowa (Ekstaza głębin)' },
        { type: 'paragraph', value: 'Zgodnie z Prawem Daltona, na głębokości 40 metrów oddychasz azotem pod ciśnieniem parcjalnym prawie 4 barów (0,79 x 5 bar = 3,95 bar).' },
        {
            type: 'list', items: [
                '<strong>Mechanizm (Teoria Meyera-Overtona):</strong> Azot pod wysokim ciśnieniem rozpuszcza się w tłuszczach (lipidach). Ponieważ osłonki naszych nerwów są zbudowane z lipidów, azot „nasącza” je, co zakłóca i spowalnia przesyłanie sygnałów elektrycznych w mózgu.',
                '<strong>Objawy:</strong> Prawo Daltona tłumaczy, dlaczego objawy narastają liniowo wraz z głębokością. Zaczyna się od euforii i spowolnienia (jak po alkoholu), a kończy na utracie pamięci krótkotrwałej, halucynacjach, a nawet utracie przytomności („narkoza to anestezja”).',
                '<strong>Wniosek praktyczny:</strong> Jeśli czujesz się "pijany", wynurz się o kilka metrów. Spadek ciśnienia otoczenia natychmiast obniży ppN<sub>2</sub> (Prawo Daltona) i objawy ustąpią bez śladu.'
            ]
        },
        { type: 'image', src: 'lectures/dalton/narkoza azotowa.png', alt: 'Infografika: Narkoza Azotowa' },

        { type: 'header', level: 4, value: 'C. Hipoksja (Niedotlenienie) – Druga strona Prawa Daltona' },
        { type: 'paragraph', value: 'Prawo Daltona działa w obie strony. Jeśli ciśnienie otoczenia spada, spada też ciśnienie parcjalne każdego gazu w mieszance.' },
        {
            type: 'list', items: [
                '<strong>Zagrożenie:</strong> Na powierzchni (1 bar) powietrze ma ppO<sub>2</sub> = 0,21 bar. Jest to bezpieczne. Ale jeśli używasz mieszanki trimiksowej (do bardzo głębokich nurkowań), która ma tylko 10% tlenu, na powierzchni jej ppO<sub>2</sub> wyniesie tylko 0,10 bar.',
                '<strong>Efekt:</strong> Granica utraty przytomności to ppO<sub>2</sub> ok. 0,10–0,16 bara. Zgodnie z Prawem Daltona, taką mieszanką można oddychać tylko na głębokości (gdzie ciśnienie otoczenia podbije ppO<sub>2</sub> do bezpiecznego poziomu), ale na powierzchni (lub przy zbyt szybkim wynurzaniu) nurek straci przytomność z niedotlenienia.'
            ]
        },

        { type: 'header', level: 3, value: '4. Praktyczne Zastosowanie: Planowanie Nurkowania' },
        { type: 'paragraph', value: 'Dzięki Prawu Daltona możemy odpowiedzieć na trzy kluczowe pytania przed wejściem do wody (korzystając z tzw. Diamentu lub Trójkąta Daltona):' },

        { type: 'header', level: 4, value: '1. Jak głęboko mogę zejść? (MOD)' },
        {
            type: 'html',
            value: '<div class="formula-box"><p class="formula">MOD = (Limit ppO<sub>2</sub> / FO<sub>2</sub> - 1) × 10</p><p>Przykład: Mam Nitrox 32 (FO<sub>2</sub> = 0,32). Limit bezpieczeństwa to 1,4 bara.<br>Ciśnienie max = 1,4 / 0,32 = 4,375 bara.<br>MOD = 33,7 metra. Głębiej tlen stanie się toksyczny!</p></div>'
        },

        { type: 'header', level: 4, value: '2. Jaki gaz jest najlepszy na daną głębokość? (Best Mix)' },
        {
            type: 'html',
            value: '<div class="formula-box"><p class="formula">FO<sub>2</sub> = Limit ppO<sub>2</sub> / Ciśnienie na dnie</p><p>Przykład: Chcę nurkować na 30 metrów (4 bary).<br>FO<sub>2</sub> = 1,4 / 4 = 0,35.<br>Najlepszy będzie Nitrox 35.</p></div>'
        },

        { type: 'header', level: 4, value: '3. Jakie ciśnienie parcjalne będę miał na dnie?' },
        {
            type: 'html',
            value: '<div class="formula-box"><p class="formula">ppO<sub>2</sub> = Ciśnienie otoczenia × FO<sub>2</sub></p><p>Służy do sprawdzenia, czy wybrany gaz jest bezpieczny na planowanej głębokości.</p></div>'
        },

        { type: 'header', level: 3, value: 'Podsumowanie' },
        { type: 'paragraph', value: 'Prawo Daltona to fundament bezpieczeństwa w nurkowaniu, zwłaszcza przy użyciu Nitroxu. Uczy nas, że to ciśnienie parcjalne, a nie procentowa zawartość gazu, decyduje o reakcji naszego organizmu. Dzięki niemu wiemy, że tlen może zabić (toksyczność), a azot odurzyć (narkoza), jeśli zejdziemy zbyt głęboko. Pamiętaj: Planuj nurkowanie, znając swoje limity MOD i przestrzegaj ich bezwzględnie.' }
    ],
    quiz: [
        {
            question: "Co mówi Prawo Daltona?",
            options: [
                "Objętość gazu maleje wraz ze wzrostem ciśnienia.",
                "Ilość gazu rozpuszczonego w cieczy zależy od temperatury.",
                "Całkowite ciśnienie mieszaniny gazów jest sumą ciśnień parcjalnych jej składników.",
                "Na ciało zanurzone w cieczy działa siła wyporu."
            ],
            correctAnswer: 2
        },
        {
            question: "Co decyduje o fizjologicznym oddziaływaniu gazu na nurka (np. toksyczności)?",
            options: [
                "Tylko procentowa zawartość gazu w butli.",
                "Ciśnienie parcjalne tego gazu.",
                "Kolor butli nurkowej.",
                "Temperatura wody."
            ],
            correctAnswer: 1
        },
        {
            question: "Jeśli na powierzchni (1 bar) ppO2 w powietrzu wynosi 0,21 bara, to ile wyniesie na głębokości 10 metrów (2 bary)?",
            options: [
                "0,21 bara.",
                "0,42 bara.",
                "1,0 bara.",
                "0,105 bara."
            ],
            correctAnswer: 1
        },
        {
            question: "Jaki jest standardowy, bezpieczny limit ciśnienia parcjalnego tlenu (ppO2) dla nurkowań rekreacyjnych (faza denna)?",
            options: [
                "1,0 bara.",
                "1,6 bara.",
                "1,4 bara.",
                "2,0 bara."
            ],
            correctAnswer: 2
        },
        {
            question: "Czym grozi przekroczenie limitu ciśnienia parcjalnego tlenu?",
            options: [
                "Narkozą azotową.",
                "Hipotermią.",
                "Toksycznością tlenową układu nerwowego (CNS).",
                "Chorobą dekompresyjną."
            ],
            correctAnswer: 2
        },
        {
            question: "Co oznacza skrót MOD?",
            options: [
                "Minimalna Odległość Dekompresyjna.",
                "Maksymalna Głębokość Operacyjna.",
                "Metoda Obliczania Dekompresji.",
                "Mieszanina Oddechowa Denna."
            ],
            correctAnswer: 1
        },
        {
            question: "Który gaz w powietrzu odpowiada za narkozę azotową pod wpływem wysokiego ciśnienia parcjalnego?",
            options: [
                "Tlen.",
                "Dwutlenek węgla.",
                "Azot.",
                "Hel."
            ],
            correctAnswer: 2
        },
        {
            question: "Jakie objawy sugerują zatrucie tlenowe CNS (skrót ConVENTID)?",
            options: [
                "Ból stawów i wysypka.",
                "Drgawki, zaburzenia widzenia, dzwonienie w uszach.",
                "Krwawienie z nosa.",
                "Euforia i śmiech."
            ],
            correctAnswer: 1
        },
        {
            question: "Oblicz MOD dla Nitroxu EAN32 przy limicie ppO2 = 1,4 bara.",
            options: [
                "40 metrów.",
                "33 metry (dokładnie 33,75 m).",
                "28 metrów.",
                "22 metry."
            ],
            correctAnswer: 1
        },
        {
            question: "Do czego służy wzór na \"Best Mix\" wynikający z prawa Daltona?",
            options: [
                "Do obliczenia zużycia powietrza.",
                "Do dobrania najlepszej mieszanki gazowej na zadaną głębokość.",
                "Do obliczenia wagi balastu.",
                "Do sprawdzenia temperatury wody."
            ],
            correctAnswer: 1
        },
        {
            question: "Jaka jest minimalna wartość ppO2 niezbędna do podtrzymania przytomności (granica hipoksji)?",
            options: [
                "0,16 bara.",
                "0,21 bara.",
                "0,50 bara.",
                "1,4 bara."
            ],
            correctAnswer: 0
        },
        {
            question: "Jeśli nurkujesz na powietrzu na 40 metrach (5 barów), jakie jest ciśnienie parcjalne azotu (ppN2), zakładając 79% azotu?",
            options: [
                "0,79 bara.",
                "3,95 bara.",
                "5,0 bara.",
                "1,58 bara."
            ],
            correctAnswer: 1
        },
        {
            question: "Dlaczego narkoza azotowa pojawia się dopiero na głębokości, a nie na powierzchni?",
            options: [
                "Ponieważ woda jest zimna.",
                "Ponieważ na głębokości ciśnienie parcjalne azotu wzrasta do poziomu, który wpływa na układ nerwowy.",
                "Ponieważ na głębokości jest ciemno.",
                "Ponieważ azot zmienia się w tlen."
            ],
            correctAnswer: 1
        },
        {
            question: "Co się dzieje z ciśnieniami parcjalnymi składników powietrza podczas wynurzania?",
            options: [
                "Rosną.",
                "Maleją.",
                "Pozostają bez zmian.",
                "Zmieniają proporcje procentowe."
            ],
            correctAnswer: 1
        },
        {
            question: "Którego elementu \"Diamentu Daltona\" używasz, aby obliczyć ppO2?",
            options: [
                "Frakcja gazu podzielona przez ciśnienie otoczenia.",
                "Ciśnienie otoczenia pomnożone przez frakcję gazu.",
                "Ciśnienie otoczenia minus frakcja gazu.",
                "Frakcja gazu plus głębokość."
            ],
            correctAnswer: 1
        }
    ]
};
