export const boyleLecture = {
    id: 'science-boyle',
    title: 'Prawo Boyle’a-Mariotte’a',
    description: 'Fundament Bezpieczeństwa – Ciśnienie i Objętość. Dlaczego płuca są bezpieczne, czy maska nie zgniecie Ci twarzy?',
    readTime: '15 min',
    level: 'Basic',
    icon: 'fa-compress-arrows-alt',
    // image removed - moved to content
    audioSrc: 'lectures/science-boyle/boyle_audio.m4a',
    presentationSrc: 'lectures/science-boyle/boyle_presentation.pdf',
    content: [
        { type: 'header', level: 2, value: 'Prawo Boyle’a-Mariotte’a – Ciśnienie i Objętość' },
        { type: 'paragraph', value: '<strong>Wstęp: Dlaczego to najważniejsze prawo?</strong><br>Obok Prawa Archimedesa, Prawo Boyle’a-Mariotte’a jest absolutnym fundamentem, z którym każdy nurek styka się w każdej sekundzie pod wodą. To ono decyduje o tym, czy Twoje płuca są bezpieczne, czy maska nie zgniecie Ci twarzy i dlaczego zużywasz więcej powietrza na dnie niż na powierzchni. Zrozumienie tej zasady to granica między bezpiecznym nurkowaniem a ryzykiem poważnego urazu.' },

        { type: 'header', level: 3, value: 'Definicja Fizyczna' },
        { type: 'paragraph', value: 'Prawo to opisuje zachowanie gazów w stałej temperaturze. Mówi ono: <strong>Objętość danej masy gazu jest odwrotnie proporcjonalna do ciśnienia absolutnego.</strong>' },
        { type: 'paragraph', value: 'Prościej: Jeśli ciśnienie rośnie (zanurzasz się), objętość gazu maleje (kurczy się). Jeśli ciśnienie maleje (wynurzasz się), objętość gazu rośnie (rozpręża się).' },

        {
            type: 'html',
            value: '<div class="formula-box"><p class="formula">P<sub>1</sub> × V<sub>1</sub> = P<sub>2</sub> × V<sub>2</sub></p><p>Gdzie:<br>P<sub>1</sub> = ciśnienie początkowe<br>V<sub>1</sub> = objętość początkowa<br>P<sub>2</sub> = ciśnienie końcowe<br>V<sub>2</sub> = objętość końcowa</p></div>'
        },

        { type: 'header', level: 3, value: 'Praktyczne Zastosowanie i Przykłady' },
        {
            type: 'list', items: [
                '<strong>1. Balon pod wodą:</strong> Jeśli weźmiesz balon o objętości 4 litrów z powierzchni (1 bar) i zabierzesz go na głębokość 30 metrów (gdzie panuje ciśnienie 4 bary), jego objętość zmniejszy się 4-krotnie. Będzie miał tylko 1 litr.<br><em>Obliczenie: 1 bar × 4 litry = 4 bary × X. Wynik: X = 1 litr.</em>',
                '<strong>2. Zużycie powietrza:</strong> To prawo wyjaśnia, dlaczego na głębokości oddychasz „szybciej”. Na 20 metrach (3 bary) każdy Twój oddech pobiera z butli 3 razy więcej cząsteczek powietrza niż na powierzchni, aby wypełnić tę samą objętość płuc. Dlatego butla starcza na krócej.',
                '<strong>3. Krytyczna strefa 0-10 metrów:</strong> Największa zmiana objętości zachodzi w najpłytszej wodzie. Między powierzchnią a 10 metrami ciśnienie podwaja się (z 1 do 2 barów), co oznacza zmianę objętości o 50%. To tutaj najtrudniej utrzymać pływalność i najłatwiej o uraz.'
            ]
        },
        {
            type: 'image',
            src: 'lectures/science-boyle/boyle_infographic.png',
            alt: 'Infografika - Prawo Boyle’a-Mariotte’a',
            caption: 'Zależność ciśnienia i objętości: balon pod wodą, zużycie powietrza i urazy ciśnieniowe.'
        },

        { type: 'header', level: 3, value: 'Związek z Barotraumą (Urazy Ciśnieniowe)' },
        { type: 'paragraph', value: 'Prawo Boyle’a tłumaczy mechanizm wszystkich urazów ciśnieniowych:' },
        {
            type: 'list', items: [
                '<strong>Przy zanurzaniu (Squeeze/Ucisk):</strong> Jeśli nie wyrównasz ciśnienia (nie dodasz gazu do ucha, maski), malejąca objętość gazu wciągnie tkanki do środka, powodując ból i uszkodzenia (barotrauma ucha, zatok, maski).',
                '<strong>Przy wynurzaniu (Uraz Ciśnieniowy Płuc):</strong> To najważniejsza lekcja. Jeśli wstrzymasz oddech podczas wynurzania, gaz w płucach będzie się rozprężał. Płuca mają ograniczoną elastyczność. Przekroczenie ich objętości (nawet przy wynurzeniu o 1-2 metry w płytkiej wodzie) prowadzi do rozerwania pęcherzyków płucnych, odmy lub zatoru gazowego.'
            ]
        },

        { type: 'info-box', style: 'warning', title: 'Złota Zasada', content: 'Nigdy nie wstrzymuj oddechu pod wodą. To bezpośrednie zastosowanie Prawa Boyle’a w praktyce, które chroni Twoje życie.' },

        { type: 'header', level: 2, value: 'Wykład Rozszerzony: Fizyka Urazu' },
        { type: 'paragraph', value: 'Prawo Boyle’a (P1V1 = P2V2) jest bezpośrednią przyczyną wszystkich urazów ciśnieniowych (barotraum). Uraz powstaje, gdy zamknięta przestrzeń gazowa w organizmie nie może wyrównać ciśnienia z otoczeniem, co prowadzi do jej odkształcenia (ściśnięcia lub rozerwania).' },

        { type: 'header', level: 3, value: '1. Barotraumy Zanurzenia (Efekt Podciśnienia/Squeeze)' },
        { type: 'paragraph', value: 'Występują, gdy objętość gazu maleje, a nurek nie "dopowietrza" przestrzeni.' },
        {
            type: 'list', items: [
                '<strong>Ucho środkowe:</strong> Najczęstszy uraz. Jeśli trąbka Eustachiusza jest niedrożna (katar, obrzęk), malejąca objętość gazu wciąga błonę bębenkową do wewnątrz. Skutek: ból, pęknięcie błony, zalanie ucha zimną wodą (powoduje zawroty głowy i wymioty).',
                '<strong>Zatoki:</strong> Zablokowanie ujścia zatok powoduje wciąganie błony śluzowej, co prowadzi do silnego bólu czoła/szczęki i krwawienia z nosa do maski.',
                '<strong>Maska (Mask Squeeze):</strong> Niewydmuchanie nosa do maski przy zanurzaniu powoduje przyssanie jej do twarzy, pękanie naczynek w oczach i siniaki na twarzy.',
                '<strong>Ząb:</strong> Powietrze uwięzione pod plombą kurczy się (podciśnienie) lub rozpręża, powodując implozję/eksplozję zęba.'
            ]
        },

        { type: 'header', level: 3, value: '2. Barotraumy Wynurzania (Nadmierne Rozprężenie Płuc)' },
        { type: 'paragraph', value: 'Najgroźniejsze urazy w nurkowaniu, wynikające z zatrzymania oddechu (nawet przy wynurzeniu o 1 metr w płytkiej wodzie) lub zmian patologicznych w płucach.' },
        {
            type: 'list', items: [
                '<strong>Tętniczy Zator Gazowy (AGE - Arterial Gas Embolism):</strong> Pęcherzyki płucne pękają, gaz wchodzi do krwiobiegu i blokuje naczynia w mózgu. Objawy (natychmiastowe): utrata przytomności, paraliż, objawy udarowe, krwista piana z ust.',
                '<strong>Odma Opłucnowa:</strong> Gaz dostaje się między płuco a ścianę klatki piersiowej, powodując zapadnięcie się płuca. Objawy: silny ból w klatce, duszność, asymetria ruchów klatki piersiowej.',
                '<strong>Odma Śródpiersiowa:</strong> Gaz gromadzi się wokół serca. Objawy: ból za mostkiem, chrypka, trudności w połykaniu.',
                '<strong>Odma Podskórna:</strong> Gaz wędruje pod skórę szyi. Objawy: obrzęk szyi, trzeszczenie pod skórą przy dotyku (jak chodzenie po śniegu).'
            ]
        },

        { type: 'header', level: 3, value: 'Pierwsza Pomoc (Dla wszystkich urazów płucnych)' },
        {
            type: 'list', items: [
                '<strong>1. Priorytet:</strong> 100% TLEN (przyspiesza wchłanianie pęcherzyków, dotlenia tkanki).',
                '<strong>2. Pozycja:</strong> Ułożenie w pozycji bezpiecznej/poziomej (nie unosić nóg przy podejrzeniu urazu głowy/płuc, aby nie zwiększać obrzęku).',
                '<strong>3. Transport:</strong> Wezwanie Zespołu Ratownictwa Medycznego i transport do szpitala (AGE wymaga komory hiperbarycznej).'
            ]
        }
    ],
    quiz: [
        {
            question: "Czego dotyczy Prawo Boyle’a-Mariotte’a?",
            options: [
                "Rozpuszczalności gazów w cieczy.",
                "Zależności między ciśnieniem a objętością gazu w stałej temperaturze.",
                "Siły wyporu działającej na ciało.",
                "Zmiany temperatury gazu przy rozprężaniu."
            ],
            correctAnswer: 1
        },
        {
            question: "Jeśli ciśnienie otoczenia wzrośnie dwukrotnie, co stanie się z objętością gazu w elastycznym zbiorniku?",
            options: [
                "Wzrośnie dwukrotnie.",
                "Pozostanie bez zmian.",
                "Zmaleje o połowę.",
                "Zmaleje o 1/3."
            ],
            correctAnswer: 2
        },
        {
            question: "Na jakiej głębokości (w wodzie słonej) ciśnienie absolutne wynosi 2 bary?",
            options: [
                "20 metrów.",
                "33 metry.",
                "10 metrów.",
                "Na powierzchni."
            ],
            correctAnswer: 2
        },
        {
            question: "Który uraz jest bezpośrednim skutkiem łamania Prawa Boyle’a przy wynurzaniu?",
            options: [
                "Narkoza azotowa.",
                "Hipotermia.",
                "Uraz ciśnieniowy płuc (barotrauma płuc).",
                "Choroba dekompresyjna."
            ],
            correctAnswer: 2
        },
        {
            question: "Dlaczego zużycie powietrza rośnie wraz z głębokością?",
            options: [
                "Ponieważ gaz staje się gęstszy pod wpływem ciśnienia.",
                "Ponieważ woda jest zimniejsza.",
                "Ponieważ automat ciężej pracuje.",
                "Prawo Boyle’a nie ma na to wpływu."
            ],
            correctAnswer: 0
        },
        {
            question: "W którym przedziale głębokości zmiana objętości gazu jest procentowo największa?",
            options: [
                "30–40 m.",
                "20–30 m.",
                "10–20 m.",
                "0–10 m."
            ],
            correctAnswer: 3
        },
        {
            question: "Jeśli balon ma 10 litrów na powierzchni, jaką objętość będzie miał na 30 metrach (4 bary)?",
            options: [
                "2,5 litra.",
                "5 litrów.",
                "3,3 litra.",
                "40 litrów."
            ],
            correctAnswer: 0
        },
        {
            question: "Co należy robić podczas wynurzania, aby uniknąć urazu płuc?",
            options: [
                "Wstrzymać oddech.",
                "Oddychać szybko i płytko.",
                "Oddychać spokojnie i ciągle, nie wstrzymując oddechu.",
                "Wdmuchać całe powietrze na dnie."
            ],
            correctAnswer: 2
        },
        {
            question: "Zjawisko „mask squeeze” (ucisk maski) podczas zanurzania wynika z:",
            options: [
                "Zwiększenia objętości gazu w masce.",
                "Zmniejszenia objętości gazu w masce pod wpływem ciśnienia.",
                "Złego dopasowania maski.",
                "Zbyt mocnego paska."
            ],
            correctAnswer: 1
        },
        {
            question: "Wzór P1 x V1 = P2 x V2 opisuje:",
            options: [
                "Prawo Archimedesa.",
                "Prawo Henry’ego.",
                "Prawo Boyle’a-Mariotte’a.",
                "Prawo Daltona."
            ],
            correctAnswer: 2
        },
        {
            question: "Jeśli nurek napełni kamizelkę (BCD) na głębokości 20 m i wynurzy się bez wypuszczania powietrza, co się stanie?",
            options: [
                "Powietrze się skurczy i nurek opadnie.",
                "Powietrze się rozpręży, powodując niekontrolowane szybkie wynurzanie.",
                "Nic się nie stanie.",
                "Automat zamarznie."
            ],
            correctAnswer: 1
        },
        {
            question: "Ciśnienie absolutne na głębokości 40 metrów wynosi:",
            options: [
                "4 bary.",
                "5 barów.",
                "3 bary.",
                "1 bar."
            ],
            correctAnswer: 1
        },
        {
            question: "Jakie zjawisko fizyczne odpowiada za konieczność wyrównywania ciśnienia w uszach?",
            options: [
                "Zmiana gęstości wody.",
                "Zmiana objętości powietrza w uchu środkowym (Prawo Boyle’a).",
                "Rozpuszczalność azotu.",
                "Refrakcja światła."
            ],
            correctAnswer: 1
        },
        {
            question: "Gęstość powietrza, którym oddychasz na 20 metrach (3 bary) w porównaniu do powierzchni jest:",
            options: [
                "2 razy większa.",
                "3 razy większa.",
                "Taka sama.",
                "Mniejsza."
            ],
            correctAnswer: 1
        },
        {
            question: "Jeśli wciągniesz powietrze z butli na 10 metrach i wstrzymasz oddech wynurzając się na powierzchnię, objętość gazu w płucach:",
            options: [
                "Zmaleje o połowę.",
                "Wzrośnie dwukrotnie (ryzyko rozerwania płuc).",
                "Nie zmieni się.",
                "Wzrośnie trzykrotnie."
            ],
            correctAnswer: 1
        },
        {
            question: "Barotrauma to:",
            options: [
                "Uraz spowodowany zmianą ciśnienia.",
                "Zatrucie gazem.",
                "Uraz mechaniczny od uderzenia.",
                "Przechłodzenie organizmu."
            ],
            correctAnswer: 0
        },
        {
            question: "Podczas zanurzania, wolne przestrzenie powietrzne w skafandrze suchym:",
            options: [
                "Rozszerzają się.",
                "Kurczą się, mogąc powodować szczypanie skóry.",
                "Nie zmieniają objętości.",
                "Wypełniają się wodą."
            ],
            correctAnswer: 1
        },
        {
            question: "Pełna butla 12 litrowa (200 bar) zawiera około:",
            options: [
                "240 litrów powietrza.",
                "1200 litrów powietrza.",
                "2400 litrów powietrza atmosferycznego.",
                "12 litrów powietrza atmosferycznego."
            ],
            correctAnswer: 2
        },
        {
            question: "Dlaczego nurek nie może oddychać przez rurkę (fajkę) będąc 2 metry pod wodą?",
            options: [
                "Rurka jest za krótka.",
                "Ciśnienie wody na klatkę piersiową jest zbyt duże, by mięśnie mogły rozprężyć płuca przeciwko ciśnieniu atmosferycznemu w rurce.",
                "Woda wleje się do rurki.",
                "Brakuje tlenu."
            ],
            correctAnswer: 1
        },
        {
            question: "Która zasada jest najważniejsza przy zapobieganiu urazom wynikającym z Prawa Boyle’a?",
            options: [
                "Pływaj szybko.",
                "Nigdy nie wstrzymuj oddechu i wyrównuj ciśnienie.",
                "Używaj tylko nowych masek.",
                "Jedz dużo przed nurkowaniem."
            ],
            correctAnswer: 1
        }
    ]
};
