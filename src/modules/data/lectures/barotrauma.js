export const barotraumaLecture = {
    id: 'barotrauma',
    title: 'Barotrauma',
    description: 'Urazy ciśnieniowe. Fizyka, rodzaje, profilaktyka i pierwsza pomoc.',
    audioSrc: 'lectures/barotrauma/Barotrauma.m4a', // Corrected property name and Case
    presentationSrc: 'lectures/barotrauma/Barotrauma.pdf', // Added PDF presentation path
    content: [
        { type: 'header', level: 2, value: 'BAROTRAUMA (Uraz Ciśnieniowy): Pełny Przewodnik dla Początkujących Nurków' },
        { type: 'paragraph', value: 'Barotrauma to uszkodzenie tkanek, które wynika z nadmiernej różnicy ciśnień między przestrzenią gazową w ciele a ciśnieniem otoczenia. Zrozumienie tego zjawiska jest fundamentalne, ponieważ woda nie jest naturalnym środowiskiem człowieka.' },

        { type: 'header', level: 3, value: 'Fizyczne Podstawy Barotraumy: Prawo Boyle’a-Mariotte’a' },
        { type: 'paragraph', value: 'Wszystkie urazy ciśnieniowe są ściśle związane z Prawem Boyle’a-Mariotte’a. Prawo to opisuje zachowanie gazu w stałej temperaturze (przemiana izotermiczna).' },
        { type: 'paragraph', value: 'Prawo Boyle’a-Mariotte’a głosi, że objętość danej masy gazu (V) jest odwrotnie proporcjonalna do jego ciśnienia bezwzględnego (p) [p<sub>1</sub>V<sub>1</sub> = p<sub>2</sub>V<sub>2</sub>].' },

        {
            type: 'list', items: [
                '<strong>Ciśnienie Bezwzględne (Absolutne):</strong> W nurkowaniu do obliczeń stosuje się ciśnienie bezwzględne (p), które jest sumą ciśnienia atmosferycznego (p<sub>0</sub>, czyli 1 bar na powierzchni) i ciśnienia hydrostatycznego (ciśnienia słupa wody).',
                '<strong>Wpływ Głębokości:</strong> Ciśnienie w wodzie wzrasta o około 1 bar na każde 10 metrów głębokości.',
                '<strong>Nieliniowa Zmiana Objętości:</strong> Największa zmiana objętości gazu w stosunku do głębokości (aż o 100%) następuje w płytkiej wodzie, między 0 a 10 metrów.'
            ]
        },

        { type: 'header', level: 4, value: 'Fazy Powstawania Barotraumy:' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Podczas Zanurzania (Kompresja):</strong> Wraz ze wzrostem ciśnienia zewnętrznego, objętość gazu w zamkniętych przestrzeniach ciała maleje. Jeśli ciśnienie nie jest wyrównane, powstaje siła ssąca, która uszkadza tkanki.',
                '<strong>Podczas Wynurzania (Rozprężanie):</strong> Wraz ze spadkiem ciśnienia zewnętrznego, objętość gazu w zamkniętych lub częściowo zamkniętych przestrzeniach (np. płucach) rośnie. Jeśli uwięziony gaz nie ma ujścia, rozpręża się i wywołuje siłę napierającą/rozrywającą.'
            ]
        },

        { type: 'html', value: '<hr>' },

        { type: 'header', level: 3, value: 'Rodzaje Barotraumy i Mechanizmy Uszkodzeń' },
        { type: 'paragraph', value: 'Barotrauma dotyczy wszystkich przestrzeni wypełnionych gazem, które są zamknięte lub mają ograniczoną drożność.' },

        { type: 'header', level: 4, value: 'Urazy Związane głównie z Zanurzaniem (Kompresja)' },
        { type: 'paragraph', value: 'Te urazy wynikają z braku dodania powietrza do przestrzeni gazowych, aby zrównoważyć wzrost ciśnienia otoczenia.' },

        { type: 'header', level: 5, value: 'Uraz Ciśnieniowy Ucha Środkowego (UCU):' },
        {
            type: 'list', items: [
                '<strong>Mechanizm:</strong> Jest to najczęstszy uraz nurkowy. Ucho środkowe jest jamą gazową połączoną z gardłem trąbką Eustachiusza. Wzrastające ciśnienie odkształca błonę bębenkową do wewnątrz. Jeśli ciśnienie nie jest wyrównane, następuje bolesny efekt ssący w uchu środkowym. W skrajnych przypadkach błona bębenkowa może pęknąć.',
                '<strong>Objawy:</strong> Narastający ucisk, przechodzący w kłujący ból. Nagłe ustąpienie kłującego bólu i dotkliwy ból spowodowany zalaniem ucha środkowego zimną i zanieczyszczoną wodą, nudności, wymioty oraz utrata orientacji w przestrzeni.'
            ]
        },

        { type: 'header', level: 5, value: 'Uraz Ciśnieniowy Zatok:' },
        {
            type: 'list', items: [
                '<strong>Mechanizm:</strong> Uraz następuje, gdy ujścia zatok są niedrożne (np. z powodu kataru, zapalenia zatok, polipów). Siła ssąca powoduje wysięk krwi z nabłonka do zamkniętej części zatoki.',
                '<strong>Objawy:</strong> Uczucie pełności i silny ból w okolicy niedrożnej zatoki. Ból głowy, który może promieniować do oczodołu lub ucha.'
            ]
        },

        { type: 'header', level: 5, value: 'Uraz Ciśnieniowy Maski (Oczu i Twarzy):' },
        {
            type: 'list', items: [
                '<strong>Mechanizm:</strong> Maska jest przestrzenią gazową. Brak wyrównania ciśnienia w masce podczas zanurzania powoduje, że wzrastające ciśnienie wywołuje siłę ssącą na twarz i oczy.',
                '<strong>Skutki:</strong> Pękanie drobnych naczyń krwionośnych skóry twarzy, gałek ocznych i nosa. Silne krwawienie do wnętrza gałek ocznych może doprowadzić do uszkodzenia wzroku.'
            ]
        },

        { type: 'header', level: 5, value: 'Uraz Ciśnieniowy Zęba (Barodontalgia):' },
        {
            type: 'list', items: [
                '<strong>Mechanizm (zanurzanie):</strong> Rzadkie zjawisko związane z małymi komorami powietrznymi uwięzionymi pod nieprawidłowo założonymi plombami lub koronkami. Kompresja uwięzionego powietrza może prowadzić do silnego bólu zęba (barodontalgia).'
            ]
        },

        { type: 'image', src: 'lectures/barotrauma/barotrauma_urazy.jpg', alt: 'Infografika: Urazy Nurkowe (Kompresja)', caption: 'Kliknij, aby powiększyć: Urazy wynikające z kompresji (zanurzania).' },

        { type: 'header', level: 4, value: 'Urazy Związane głównie z Wynurzaniem (Rozprężanie)' },
        { type: 'paragraph', value: 'Urazy te są wynikiem rozprężania się gazu zgodnie z Prawem Boyle’a-Mariotte’a, gdy maleje ciśnienie otoczenia.' },

        { type: 'header', level: 5, value: 'Uraz Ciśnieniowy Płuc (UCP):' },
        {
            type: 'list', items: [
                '<strong>Najgroźniejszy uraz:</strong> UCP jest najgroźniejszy dla zdrowia i życia spośród wszystkich urazów nurkowych.',
                '<strong>Przyczyna:</strong> Powietrze zostaje całkowicie lub częściowo uwięzione w płucach podczas wynurzania się z aparatem oddechowym. Najczęstszą przyczyną jest wstrzymanie oddechu podczas wynurzania. UCP może wystąpić już przy wynurzeniu bez wydychania po pełnym wdechu z głębokości zaledwie 1 metra.',
                '<strong>Mechanizm Uszkodzenia:</strong> Rozprężające się powietrze mechanicznie uszkadza pęcherzyki płucne. Może to prowadzić do:<br><ul><li>Tętniczych Zatorów Gazowych (AGE): Pęcherzyki powietrza dostają się do układu naczyniowego.</li><li>Odmy Opłucnowej: Powietrze dostaje się do jamy opłucnowej.</li><li>Odmy Śródpiersiowej/Podskórnej: Powietrze dostaje się do śródpiersia lub pod skórę szyi.</li></ul>',
                '<strong>Objawy AGE w Mózgu:</strong> Utrata przytomności (często w ciągu 4-6 minut po wynurzeniu), ból głowy, drgawki, porażenie mięśni i paraliż, zaburzenia czuciowe (mrowienie, drętwienie) oraz zaburzenia zmysłów (mowy, słuchu, wzroku, równowagi).'
            ]
        },

        { type: 'image', src: 'lectures/barotrauma/barotrauma_ucp.jpg', alt: 'Infografika: Uraz Ciśnieniowy Płuc (UCP)', caption: 'Kliknij, aby powiększyć: Mechanizm Urazu Ciśnieniowego Płuc.' },

        { type: 'header', level: 5, value: 'Uraz Ciśnieniowy Zatok (Rozprężny):' },
        {
            type: 'list', items: [
                '<strong>Mechanizm:</strong> Uwięzione powietrze rozpręża się podczas wynurzania, powodując wzrost ciśnienia na ściany zatoki. Ból ustępuje, gdy powietrze pokonuje opór zamkniętego ujścia.',
                '<strong>Objawy:</strong> Silny ból w okolicy zamkniętej części zatoki i możliwe wyrzucenie z nosa krwi, wydzieliny i powietrza.'
            ]
        },

        { type: 'header', level: 5, value: 'Uraz Ciśnieniowy Przewodu Pokarmowego:' },
        {
            type: 'list', items: [
                '<strong>Mechanizm:</strong> Gaz uwięziony w żołądku lub jelitach (np. z połkniętego powietrza, napojów gazowanych) rozpręża się podczas wynurzania.',
                '<strong>Skutki:</strong> Ucisk na żołądek, cofanie się treści żołądka do przełyku i odbijanie.'
            ]
        },

        { type: 'header', level: 5, value: 'Uraz Ciśnieniowy Zęba (Rozprężny):' },
        {
            type: 'list', items: [
                '<strong>Mechanizm:</strong> Trudność z wydostaniem się rozprężającego powietrza z komory pod plombą lub koroną.',
                '<strong>Skutki:</strong> Może dojść do odwarstwienia plomby, poluzowania koronki lub pęknięcia zęba.'
            ]
        },

        { type: 'html', value: '<hr>' },

        { type: 'header', level: 3, value: 'Profilaktyka Barotraumy' },
        { type: 'paragraph', value: 'Prawidłowa technika i dbałość o sprzęt są kluczowe dla uniknięcia urazów.' },

        { type: 'header', level: 4, value: 'Zapobieganie Urazom podczas Zanurzania (Ucho, Zatoki, Maska):' },
        {
            type: 'list', items: [
                '<strong>Ucho i Zatoki:</strong><br><ul><li>Wyrównuj ciśnienie często i delikatnie podczas zanurzania, szczególnie w płytkim zakresie głębokości.</li><li>Stosuj metody takie jak próba Valsalvy, manewr Toynbee\'ego lub manewr Frenzela. Próbę Valsalvy wykonuj bez zbędnej siły.</li><li>Jeśli poczujesz narastający ucisk, zatrzymaj się, zmniejsz głębokość i spróbuj ponownie wyrównać ciśnienie.</li><li>Nigdy nie nurkuj z katarem lub inną infekcją dróg oddechowych.</li></ul>',
                '<strong>Maska:</strong> Okresowo wdmuchuj powietrze do wnętrza maski przez nos podczas zanurzania.',
                '<strong>Zęby:</strong> Utrzymuj zęby w doskonałym stanie i regularnie odwiedzaj dentystę. W przypadku bólu zęba podczas zanurzania natychmiast zakończ nurkowanie.'
            ]
        },

        { type: 'header', level: 4, value: 'Zapobieganie UCP i Urazom Rozprężnym:' },
        {
            type: 'list', items: [
                '<strong>Oddychanie:</strong> W trakcie całego nurkowania oddychaj swobodnie i nigdy nie wstrzymuj oddechu podczas wynurzania.',
                '<strong>Prędkość Wynurzania:</strong> Stosuj prawidłową prędkość wynurzania (zwykle nie większą niż 10 m/min).',
                '<strong>Stan Zdrowia:</strong> Zachowaj co najmniej miesięczną przerwę w nurkowaniu po przebytych chorobach układu oddechowego, takich jak zapalenie oskrzeli lub płuc.',
                '<strong>Przewód Pokarmowy:</strong> Unikaj spożywania pokarmów gazotwórczych i napojów gazowanych przed nurkowaniem.',
                '<strong>Aparatura:</strong> Utrzymuj dobry stan techniczny sprzętu nurkowego, w tym automatów.',
                '<strong>Utrzymanie Czystości:</strong> Dbałość o czystość uszu jest również ważna.'
            ]
        },

        { type: 'html', value: '<hr>' },

        { type: 'header', level: 3, value: 'Postępowanie w Sytuacjach Awaryjnych (Pierwsza Pomoc)' },
        { type: 'paragraph', value: 'W przypadku podejrzenia poważnego urazu ciśnieniowego (UCP, zator gazowy) kluczowa jest szybkość działania, ponieważ skuteczność leczenia zależy głównie od szybkości podjęcia leczenia w komorze dekompresyjnej.' },

        {
            type: 'list', items: [
                '<strong>Ocena Sytuacji:</strong> Jeśli masz wątpliwości, czy objawy wskazują na UCP, potraktuj je, jakby nimi były.',
                '<strong>Pomoc Medyczna:</strong> Wezwij pomoc medyczną i powiadom służby o konieczności transportu poszkodowanego do komory dekompresyjnej.',
                '<strong>Tlenoterapia:</strong> Podaj poszkodowanemu 100% tlen w maksymalnym przepływie tak szybko, jak to możliwe. Tlen jest najważniejszym lekarstwem, ponieważ poprawia utlenowanie tkanek, redukuje możliwość powstawania nowych zatorów i zmniejsza średnicę pęcherzyków gazowych.',
                '<strong>Pozycja:</strong> Ułóż poszkodowanego w pozycji poziomej.',
                '<strong>Nawadnianie:</strong> Jeśli poszkodowany jest przytomny, podaj mu do 1 litra płynów, najlepiej woda niegazowana.',
                '<strong>Resuscytacja:</strong> Jeśli jest to konieczne, wykonaj podstawowe zabiegi resuscytacyjne (BLS).'
            ]
        },

        { type: 'image', src: 'lectures/barotrauma/barotrauma_pomoc.png', alt: 'Infografika: Pierwsza Pomoc (UCP)', caption: 'Kliknij, aby powiększyć: Algorytm pierwszej pomocy przy UCP.' }
    ],
    quiz: [
        {
            question: "Co jest najczęstszą i najgroźniejszą przyczyną Urazu Ciśnieniowego Płuc (UCP)?",
            options: [
                "Zbyt szybkie zanurzanie",
                "Wstrzymanie oddechu podczas wynurzania",
                "Brak przystanku bezpieczeństwa",
                "Nurkowanie na głębokim wdechu"
            ],
            correctAnswer: 1,
            explanation: "Wstrzymanie oddechu podczas wynurzania powoduje rozprężanie się powietrza w płucach, co prowadzi do ich rozerwania (zgodnie z prawem Boyle'a)."
        },
        {
            question: "W jakim zakresie głębokości następuje największa zmiana objętości gazu?",
            options: [
                "0 - 10 metrów",
                "10 - 20 metrów",
                "30 - 40 metrów",
                "Zmiana jest stała na każdej głębokości"
            ],
            correctAnswer: 0,
            explanation: "W zakresie 0-10m ciśnienie zmienia się z 1 na 2 bary, co powoduje dwukrotną zmianę objętości (największą procentowo)."
        },
        {
            question: "Jaka jest pierwsza czynność w przypadku podejrzenia Tętniczego Zatoru Gazowego (AGE)?",
            options: [
                "Ponowne zanurzenie poszkodowanego (rekompresja w wodzie)",
                "Podanie dużej ilości płynów",
                "Podanie 100% tlenu i wezwanie pomocy medycznej",
                "Położenie poszkodowanego w pozycji siedzącej"
            ],
            correctAnswer: 2,
            explanation: "Tlen 100% pomaga zmniejszyć pęcherzyki gazu i dotlenić tkanki. Natychmiastowy transport do komory jest kluczowy."
        },
        {
            question: "Jakie prawo fizyczne rządzi urazami ciśnieniowymi (Barotrauma)?",
            options: [
                "Prawo Daltona",
                "Prawo Henry'ego",
                "Prawo Boyle'a-Mariotte'a",
                "Prawo Archimedesa"
            ],
            correctAnswer: 2,
            explanation: "Prawo Boyle'a-Mariotte'a mówi, że objętość gazu jest odwrotnie proporcjonalna do ciśnienia. Największe zmiany objętości występują na płytkich głębokościach."
        },
        {
            question: "Którą z poniższych metod należy stosować do wyrównywania ciśnienia w uszach podczas zanurzania?",
            options: [
                "Metoda Valsalvy (dmuchanie z zamkniętym nosem)",
                "Połknięcie (manewr Toynbee'ego)",
                "Ruch szczęką (manewr Frenzela)",
                "Wszystkie powyższe"
            ],
            correctAnswer: 3,
            explanation: "Wszystkie te metody są skuteczne. Najważniejsze to wyrównywać ciśnienie często, delikatnie i zanim poczujesz dyskomfort."
        },
        {
            question: "Co należy zrobić, gdy podczas zanurzania nie możesz wyrównać ciśnienia w uszach?",
            options: [
                "Kontynuować zanurzanie i próbować silniej",
                "Zatrzymać się, wynurzyć o 1-2m i spróbować ponownie delikatnie",
                "Ignorować dyskomfort i nurkować dalej",
                "Wstrzymać oddech i czekać"
            ],
            correctAnswer: 1,
            explanation: "Nigdy nie forsuj wyrównywania. Zatrzymaj się, wynurz lekko i spróbuj ponownie. Przy uporczywych problemach przerwij nurkowanie."
        },
        {
            question: "Barotrauma maski objawia się:",
            options: [
                "Bólem głowy",
                "Przekrwionymi oczami i podbiegnięciami krwawymi (petech) na twarzy",
                "Bólem w stawach",
                "Zawrotami głowy"
            ],
            correctAnswer: 1,
            explanation: "Podciśnienie w masce podczas zanurzania powoduje wciąganie tkanek twarzy i może prowadzić do pęknięcia drobnych naczyń krwionośnych."
        },
        {
            question: "Dlaczego nie wolno nurkować z katarem lub infekcją górnych dróg oddechowych?",
            options: [
                "Bo można zarazić inne osoby",
                "Bo jest to niekomfortowe",
                "Bo utrudnia to wyrównywanie ciśnienia i zwiększa ryzyko barotraumy",
                "Bo obniża to SAC"
            ],
            correctAnswer: 2,
            explanation: "Opuchnięta błona śluzowa i zatoki blokują kanały łączące ucho środkowe z gardłem (trąbka Eustachiusza), uniemożliwiając wyrównywanie ciśnienia."
        },
        {
            question: "Jaka jest maksymalna różnica ciśnienia, jaką płuca mogą wytrzymać przed rozerwaniem?",
            options: [
                "0.02 bara (20 mm Hg)",
                "0.12 bara (50-90 mm Hg)",
                "1 bar",
                "2 bary"
            ],
            correctAnswer: 1,
            explanation: "Płuca są bardzo delikatne - nadciśnienie zaledwie 0.12 bara może spowodować ich rozerwanie, dlatego NIGDY nie wstrzymuj oddechu podczas wynurzania."
        },
        {
            question: "Które z poniższych zwiększa ryzyko barotraumy płuc?",
            options: [
                "Astma, przewlekłe zapalenie oskrzeli",
                "Palenie tytoniu",
                "Nurkowanie tuż po chorobie układu oddechowego",
                "Wszystkie powyższe"
            ],
            correctAnswer: 3,
            explanation: "Wszystkie te czynniki mogą prowadzić do uwięzienia powietrza w płucach (air trapping) i zwiększać ryzyko UCP podczas wynurzania."
        },
        {
            question: "Co to jest 'blokada wsteczna'?",
            options: [
                "Niemożność zanurzenia się",
                "Ból ucha podczas wynurzania spowodowany rozprężającym się powietrzem",
                "Zablokowanie automatu oddechowego",
                "Skurcz mięśni nóg"
            ],
            correctAnswer: 1,
            explanation: "Blokada wsteczna (reverse block) to rzadka sytuacja, gdy powietrze uwięzione w uchu środkowym nie może się wydostać podczas wynurzania, powodując ból."
        },
        {
            question: "Jak nazywa się uraz ciśnieniowy zęba?",
            options: [
                "Barodontalgia",
                "Barotitis",
                "Barosinusitis",
                "Baro-dentalizm"
            ],
            correctAnswer: 0,
            explanation: "Barodontalgia to ból zęba spowodowany zmianą ciśnienia, gdy pęcherzyk powietrza (np. pod plombą) kurczy się lub rozszerza."
        },
        {
            question: "Jak zapobiec barotraumie maski?",
            options: [
                "Mocno docisnąć maskę do twarzy",
                "Wdmuchiwać nosem powietrze do maski podczas zanurzania",
                "Pauzować co metr",
                "Kupić maskę z zaworkiem"
            ],
            correctAnswer: 1,
            explanation: "Aby wyrównać podciśnienie w masce (squeeze), należy regularnie wypuszczać odrobinę powietrza nosem do jej wnętrza."
        },
        {
            question: "Co sygnalizuje ból w okolicy czoła lub kości policzkowych podczas zanurzania?",
            options: [
                "Barotraumę zatok",
                "Ból głowy z napięcia",
                "Barotraumę maski",
                "Zatrucie tlenowe"
            ],
            correctAnswer: 0,
            explanation: "Sygnalizuje kłopoty z wyrównaniem ciśnienia w zatokach, co prowadzi do barotraumy (tzw. 'squeeze' zatokowy)."
        },
        {
            question: "Co się stanie, jeśli pęknie błona bębenkowa pod wodą?",
            options: [
                "Woda zalewająca ucho środkowe spowoduje silny zawrót głowy i nudności",
                "Nic poważnego, tylko ból",
                "Utrata słuchu na zawsze",
                "Natychmiastowa utrata przytomności"
            ],
            correctAnswer: 0,
            explanation: "Zimna woda wlewająca się do ucha środkowego podrażnia błędnik, powodując gwałtowne zawroty głowy (efekt kaloryczny) i dezorientację."
        },
        {
            question: "Jak prawidłowo wykonywać manewr Valsalvy?",
            options: [
                "Dmuchać z całej siły aż uszy 'strzelą'",
                "Dmuchać delikatnie przy zatkanym nosie, nie na siłę",
                "Tylko przełykać ślinę",
                "Czekać aż ciśnienie samo się wyrówna"
            ],
            correctAnswer: 1,
            explanation: "Manewr Valsalvy należy wykonywać delikatnie. Użycie zbyt dużej siły może uszkodzić ucho wewnętrzne (okienko owalne)."
        },
        {
            question: "Dlaczego strefa 0-10 metrów jest najbardziej ryzykowna dla barotraumy?",
            options: [
                "Bo tam jest najzimniej",
                "Bo tam następują największe procentowe zmiany objętości gazu",
                "Bo tam jest największy ruch wody",
                "Bo tam jest najwięcej nurków"
            ],
            correctAnswer: 1,
            explanation: "Zgodnie z prawem Boyle'a, objętość gazu zmienia się o 50% między 0 a 10m (z 100% na 50%), co jest największą zmianą w całym profilu nurkowania."
        },
        {
            question: "Gdzie leczy się poważne urazy ciśnieniowe (DCS/AGE)?",
            options: [
                "Na SORze",
                "W komorze dekompresyjnej (hiperbarycznej)",
                "W domu aspiryną",
                "Pod wodą"
            ],
            correctAnswer: 1,
            explanation: "Jedynym skutecznym leczeniem w przypadku zatorów gazowych i DCS jest rekompresja w komorze hiperbarycznej."
        }
    ]
};
