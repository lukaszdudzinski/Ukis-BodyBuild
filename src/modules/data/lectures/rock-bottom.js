export const rockBottomLecture = {
    id: 'rock-bottom',
    title: 'Planowanie Gazu (Rock Bottom)',
    description: 'Dlaczego "50 bar" to za mało? Metoda Rock Bottom / Minimum Gas.',
    presentationSrc: 'lectures/rock-bottom/Rock_Bottom_Minimum_Gas.pdf',
    audioSrc: 'lectures/rock-bottom/Rock_Bottom_Minimum_Gas.m4a',
    content: [
        { type: 'header', level: 2, value: 'Planowanie Gazu – Dlaczego "50 bar" to mit? (Wstęp do Rock Bottom)' },

        { type: 'header', level: 3, value: 'Przegląd standardowych metod planowania' },
        { type: 'paragraph', value: 'Zanim przejdziemy do zaawansowanego planowania, omówmy to, co każdy nurek zna z kursu podstawowego:' },
        {
            type: 'list', items: [
                '<strong>Reguła stałej rezerwy (50 bar):</strong> Najpopularniejsza zasada w nurkowaniu rekreacyjnym. Mówi ona: "Bądź na powierzchni, mając w butli 50 bar". Jest to bezpieczny margines na płytkich wodach, ale ma jedną wadę: 50 bar to stała ilość ciśnienia, a nie objętość gazu. Na 10 metrach 50 bar starczy na długo, ale na 30 metrach, w stresie, znika błyskawicznie.',
                '<strong>Reguła 1/3 (Rule of Thirds):</strong> Stosowana często w nurkowaniu jaskiniowym i wrakowym. Dzielisz gaz na trzy części: 1/3 na dopłynięcie, 1/3 na powrót, 1/3 na rezerwę awaryjną. Jest to bardzo bezpieczna metoda, ale w prostych nurkowaniach rekreacyjnych na wodach otwartych często daje zbyt restrykcyjne limity czasu dennego.'
            ]
        },

        { type: 'header', level: 3, value: 'Dlaczego standardowe metody mogą zawieść?' },
        { type: 'paragraph', value: 'Wyobraź sobie sytuację awaryjną na głębokości 30 metrów. Twój partner nie ma powietrza ("Out of Gas"). Podajesz mu swój automat. Od teraz:' },
        {
            type: 'list', ordered: true, items: [
                'Dwie osoby oddychają z jednej butli.',
                'Obaj jesteście w stresie, co oznacza, że zużywacie gaz 2-3 razy szybciej niż zwykle.',
                'Musicie pokonać 30 metrów w górę, zachowując bezpieczną prędkość.'
            ]
        },
        { type: 'paragraph', value: 'W takim scenariuszu "sztywne" 50 bar może skończyć się w połowie drogi do powierzchni. Standardowe metody często nie uwzględniają faktu, że im głębiej jesteś, tym większej rezerwy potrzebujesz, aby bezpiecznie wrócić.' },

        { type: 'image', src: 'lectures/rock-bottom/rock_bottom.jpg', alt: 'Infografika Rock Bottom' },

        { type: 'header', level: 3, value: 'Czym jest Rock Bottom (Minimum Gas)?' },
        { type: 'paragraph', value: 'Rock Bottom (nazywane też Minimum Gas) to nie jest "sugestia". To matematycznie wyliczona ilość gazu, której NIE WOLNO Ci zużyć podczas fazy dennej. To Twoja "żelazna rezerwa".' },
        { type: 'paragraph', value: '<strong>Definicja:</strong> Rock Bottom to ciśnienie w butli, przy którym musisz rozpocząć wynurzanie, aby w razie awarii partnera, para nurków mogła bezpiecznie dotrzeć na powierzchnię, nawet przy zwiększonym zużyciu gazu (stres).' },

        { type: 'header', level: 4, value: 'Co daje Rock Bottom?' },
        {
            type: 'list', items: [
                '<strong>Gwarancję bezpieczeństwa:</strong> Obliczasz dokładnie tyle gazu, ile potrzeba, aby dwóch nurków w silnym stresie mogło bezpiecznie wynurzyć się z najgłębszego punktu nurkowania do powierzchni.',
                '<strong>Dostosowanie do głębokości:</strong> Rezerwa Rock Bottom dla nurkowania na 10 m będzie inna (mniejsza) niż dla nurkowania na 30 m (większa).',
                '<strong>Jasny punkt odwrotu:</strong> Wiesz dokładnie, przy jakim ciśnieniu na manometrze musisz bezdyskusyjnie rozpocząć wynurzanie.'
            ]
        },

        { type: 'header', level: 3, value: 'Planowanie Gazu Metodą Rock Bottom' },
        { type: 'header', level: 4, value: 'Założenia metody' },
        { type: 'paragraph', value: 'Aby obliczyć tę rezerwę, musimy przyjąć „czarny scenariusz”:' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Awaria:</strong> Coś się stało na dnie. Rozwiązanie problemu zajmuje nam np. 1-2 minuty.',
                '<strong>Zespół:</strong> Oddycha dwóch nurków z jednej butli.',
                '<strong>Stres:</strong> W stresie zużywamy powietrze znacznie szybciej. Przyjmujemy 2x SAC (lub np. 30 l/min na osobę).',
                '<strong>Wynurzenie:</strong> Spokojny powrót na powierzchnię (z prędkością 9-10 m/min).'
            ]
        },

        { type: 'header', level: 4, value: 'Przykład Obliczeniowy: Krok po Kroku (z infografiki)' },
        { type: 'paragraph', value: '<strong>Scenariusz:</strong> Głębokość 27m (3,7 bar), Butla 15L, SAC standardowy 20 l/min (w stresie 40 l/min). Dwóch nurków = 80 l/min łącznego zużycia.' },

        { type: 'paragraph', value: '<strong>Krok 1: Faza na dnie (2 minuty)</strong><br>2 min * 80 l/min * 3,7 bar = 592 litry' },

        { type: 'paragraph', value: '<strong>Krok 2: Faza wynurzania (3 minuty)</strong><br>Czas wynurzania: 27m / 9 m/min = 3 min.<br>Średnie ciśnienie (~13,5m) = 2,35 bar.<br>3 min * 80 l/min * 2,35 bar = 564 litry' },

        { type: 'paragraph', value: '<strong>Krok 3: Suma i przeliczenie</strong><br>Razem: 592 + 564 = 1156 litrów.<br>W butli 15L: 1156 / 15 = 77 bar (zaokrąglamy do 80 bar).' },

        { type: 'info-box', style: 'warning', content: '<strong>Wniosek:</strong> Twoje „Rock Bottom” wynosi ok. 80 bar. Oznacza to, że przy ciśnieniu 80 bar musisz bezwzględnie rozpocząć wynurzanie. Czekanie do 50 bar na tej głębokości jest niebezpieczne!' }
    ],
    quiz: [
        {
            question: "Jaka jest podstawowa definicja 'Rock Bottom' (Minimum Gas)?",
            options: [
                "Ilość gazu potrzebna do spędzenia dodatkowych 10 minut na dnie.",
                "Minimalna ilość gazu, która musi pozostać w butli po wyjściu z wody.",
                "Ilość gazu niezbędna, aby dwóch nurków bezpiecznie wróciło na powierzchnię z najgłębszego punktu w sytuacji awaryjnej.",
                "Zapas gazu przeznaczony wyłącznie na przystanek bezpieczeństwa."
            ],
            correctAnswer: 2,
            explanation: "Rock Bottom to matematycznie wyliczona rezerwa, która pozwala dwóm nurkom w stresie wrócić bezpiecznie na powierzchnię."
        },
        {
            question: "Dlaczego standardowa reguła '50 bar rezerwy' może być niewystarczająca przy nurkowaniu na 30 metrów?",
            options: [
                "Ponieważ manometry przestają działać na tej głębokości.",
                "Ponieważ 50 bar to stała wartość ciśnienia, która na dużej głębokości reprezentuje mniejszą objętość dostępnego gazu przy szybszym jego zużyciu.",
                "Ponieważ na 30 metrach azot działa narkotycznie i nurek zużywa mniej tlenu.",
                "Reguła 50 bar jest zawsze wystarczająca, niezależnie od głębokości."
            ],
            correctAnswer: 1,
            explanation: "Na głębokości zużycie gazu jest szybsze (większe ciśnienie), więc 50 bar znika znacznie szybciej niż na płyciźnie. Dla głębszych nurkowań 50 bar to często za mało dla dwóch osób."
        },
        {
            question: "Ile osób oddychających z jednej butli uwzględnia się w obliczeniach Rock Bottom?",
            options: [
                "Tylko jedną (nurek w sytuacji awaryjnej).",
                "Dwie (dawca gazu i biorca gazu).",
                "Trzy (cały zespół nurkowy).",
                "Żadną, to tylko teoretyczna rezerwa."
            ],
            correctAnswer: 1,
            explanation: "Zakładamy scenariusz 'Out of Gas', gdzie dawca dzieli się gazem z biorcą, więc dwie osoby oddychają z jednej butli."
        },
        {
            question: "Jak zmienia się współczynnik zużycia gazu (SAC) w sytuacji stresowej (np. brak powietrza), przyjmowany do obliczeń Rock Bottom?",
            options: [
                "Pozostaje bez zmian.",
                "Maleje o połowę ze względu na szok.",
                "Wzrasta drastycznie, zazwyczaj przyjmuje się wartość 2-krotnie lub 3-krotnie wyższą od normalnej.",
                "Wzrasta tylko o 10%."
            ],
            correctAnswer: 2,
            explanation: "Stres i wysiłek fizyczny drastycznie zwiększają zużycie tlenu, dlatego w obliczeniach awaryjnych mnożymy SAC x2 lub x3."
        },
        {
            question: "Jaki czas zazwyczaj rezerwuje się w tej metodzie na rozwiązanie problemu na dnie (opanowanie sytuacji) przed rozpoczęciem wynurzania?",
            options: [
                "0 minut (natychmiastowa ucieczka).",
                "1 do 2 minut.",
                "5 minut.",
                "10 minut."
            ],
            correctAnswer: 1,
            explanation: "Przyjmuje się około 1-2 minut na opanowanie emocji, chwycenie partnera i przygotowanie do wynurzenia."
        },
        {
            question: "Jaką bezpieczną prędkość wynurzania należy przyjąć przy obliczaniu czasu powrotu na powierzchnię?",
            options: [
                "18 metrów na minutę.",
                "30 metrów na minutę.",
                "9-10 metrów na minutę.",
                "Dowolną, byle jak najszybciej znaleźć się na powierzchni."
            ],
            correctAnswer: 2,
            explanation: "Standardowa bezpieczna prędkość wynurzania to 9-10 m/min, aby uniknąć choroby dekompresyjnej i urazów ciśnieniowych."
        },
        {
            question: "Jeśli Twoje Rock Bottom wynosi 80 bar, co powinieneś zrobić, gdy manometr wskaże tę wartość?",
            options: [
                "Zasygnalizować partnerowi zakończenie nurkowania i natychmiast rozpocząć procedurę wynurzania.",
                "Zostać na dnie jeszcze 5 minut, bo to tylko rezerwa.",
                "Zacząć oszczędzać powietrze, wstrzymując oddech.",
                "Przepłynąć na płytszą wodę i kontynuować nurkowanie."
            ],
            correctAnswer: 0,
            explanation: "Rock Bottom to 'punkt odwrotu'. Dalsze przebywanie na dnie oznacza naruszanie żelaznej rezerwy na przeżycie."
        },
        {
            question: "Który czynnik ma największy wpływ na to, że Rock Bottom dla nurkowania na 30 m jest większe niż dla nurkowania na 15 m?",
            options: [
                "Temperatura wody.",
                "Przejrzystość wody.",
                "Ciśnienie otoczenia (głębokość), które powoduje szybsze zużycie gazu z butli.",
                "Rodzaj używanych płetw."
            ],
            correctAnswer: 2,
            explanation: "Większa głębokość = większe ciśnienie = szybsze zużycie gazu = potrzeba większej rezerwy."
        },
        {
            question: "W klasycznej metodzie Rock Bottom dla nurkowania rekreacyjnego (bezdekompresyjnego), gaz na Przystanek Bezpieczeństwa jest:",
            options: [
                "Wliczany obowiązkowo jako gaz niezbędny do przeżycia.",
                "Traktowany jako dodatkowy margines; w sytuacji zagrożenia życia priorytetem jest bezpośrednie dotarcie na powierzchnię.",
                "Całkowicie ignorowany, ponieważ przystanki bezpieczeństwa są zabronione w sytuacjach awaryjnych.",
                "Wymagany tylko wtedy, gdy nurek ma komputer."
            ],
            correctAnswer: 1,
            explanation: "Przystanek bezpieczeństwa jest zalecany, ale nie obowiązkowy w sytuacji ratowania życia (brak gazu). Często traktuje się go jako dodatkowy bufor bezpieczeństwa."
        },
        {
            question: "Obliczając zużycie gazu na dnie w sytuacji stresowej dla dwóch nurków przez 1 minutę na głębokości 10 metrów (2 bary), przy założeniu łącznego stresowego SAC zespołu = 60 l/min, zużycie wyniesie:",
            options: [
                "60 litrów.",
                "120 litrów (60 l/min x 1 min x 2 bary).",
                "30 litrów.",
                "240 litrów."
            ],
            correctAnswer: 1,
            explanation: "60 l/min (SAC zespołu) * 1 min (czas) * 2 bary (ciśnienie na 10m) = 120 litrów."
        }
    ]
};
