export const dcsLecture = {
    id: 'dcs',
    title: 'Choroba Dekompresyjna',
    description: 'Mechanizm DCS, objawy, czynniki ryzyka i pierwsza pomoc w wypadku.',
    content: [
        { type: 'header', level: 2, value: 'Choroba Dekompresyjna (DCS): Cicha Pułapka Azotu' },
        { type: 'paragraph', value: 'Choroba dekompresyjna (ang. Decompression Sickness – DCS), potocznie zwana chorobą kesonową, jest zespołem schorzeń i objawów wywołanych przez azot wydzielający się z tkanek do krwi nurka w sposób niekontrolowany, głównie w formie pęcherzyków gazowych. Jest to jedno z najpoważniejszych schorzeń, zagrażających zdrowiu i życiu płetwonurków.' },

        { type: 'header', level: 3, value: 'Fizyczne Podstawy DCS: Prawo Henry’ego' },
        { type: 'paragraph', value: 'DCS jest bezpośrednim wynikiem procesów absorpcji i eliminacji azotu, które są opisywane przez Prawo Henry’ego.' },

        { type: 'header', level: 4, value: 'Prawo Henry’ego:' },
        {
            type: 'list', items: [
                'Mówi, że ilość gazu, która rozpuści się w cieczy (w tym w płynach ustrojowych i tkankach ciała), jest wprost proporcjonalna do ciśnienia parcjalnego tego gazu.',
                'Objętość gazu rozpuszczonego w cieczy rośnie wraz ze wzrostem ciśnienia.'
            ]
        },

        { type: 'header', level: 4, value: 'Jak Prawo Henry’ego działa podczas nurkowania?' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Zanurzanie (Saturacja):</strong> Powietrze, którym oddychamy, składa się głównie z azotu (ponad 78%). Podczas zanurzania, ciśnienie absolutne wzrasta, a automat podaje powietrze pod ciśnieniem równym ciśnieniu na danej głębokości. Zgodnie z Prawem Henry\'ego, azot z powietrza oddechowego zaczyna dyfundować (przenikać) do krwi i tkanek, nasycając je. Ilość rozpuszczonego azotu zależy od czasu i głębokości nurkowania (czyli od wyższego ciśnienia powietrza oddechowego).',
                '<strong>Wynurzanie (Desaturacja):</strong> W miarę wynurzania ciśnienie zewnętrzne spada. Następuje proces odwrotny – odsycanie tkanek z azotu. Azot dyfunduje z tkanek do krwi, a następnie jest usuwany w płucach z każdym wydechem.',
                '<strong>Ryzyko DCS (Tworzenie Pęcherzyków):</strong> Ciało nurka toleruje określony poziom przesycenia, ale jeśli różnica prężności (gradient) staje się zbyt duża (np. z powodu zbyt szybkiego wynurzania), azot może się uwolnić z roztworu i przejść w formę gazową (pęcherzyków) w tkankach i krwioobiegu. To właśnie te zatory gazowe, powstałe pierwotnie z pęcherzyków azotu, są bezpośrednią przyczyną choroby ciśnieniowej (DCS).'
            ]
        },

        { type: 'header', level: 3, value: 'Klasyfikacja i Objawy Choroby Dekompresyjnej' },
        { type: 'paragraph', value: 'Najprostsza klasyfikacja dzieli DCS na dwa główne typy:' },

        { type: 'header', level: 4, value: 'Typ I – Postać Lekka (DCS I)' },
        { type: 'paragraph', value: 'Związana z pęcherzykami azotu w tkankach obwodowych (pozanaczyniowo).' },
        {
            type: 'list', items: [
                '<strong>Bóle stawowo-mięśniowe (ang. Bends):</strong> Bóle mięśniowe w okolicach dużych stawów (barkowego, kolanowego, skokowego) – początkowo słabe, a następnie ostre i pulsujące. Nazwa Bends pochodzi od obserwacji poruszania się (tzw. "krzywika") osób dotkniętych silnymi bólami stawowo-kostnymi.',
                '<strong>Objawy skórne:</strong> Swędzenie skóry kończyn, często połączone z jej zaczerwienieniem lub marmurkowatością (białe, sine i czerwone plamy połączone z opuchlizną). Postać skórna jest szczególnie niebezpieczna.',
                '<strong>Ogólne:</strong> Ogólne zmęczenie i senność, osłabienie (jak przy grypie).'
            ]
        },

        { type: 'header', level: 4, value: 'Typ II – Postać Ciężka (DCS II)' },
        { type: 'paragraph', value: 'Związana z pęcherzykami azotu we krwi (w naczyniach). Objawy neurologiczne są identyczne jak w przypadku tętniczych zatorów gazowych (AGE) w przebiegu urazu ciśnieniowego płuc (UCP).' },
        {
            type: 'list', items: [
                '<strong>Objawy neurologiczne:</strong><ul><li>Utrata przytomności.</li><li>Ból głowy, drgawki.</li><li>Porażenie mięśni i paraliż (np. od pasa w dół).</li><li>Zaburzenia czuciowe (mrowienie lub drętwienie).</li><li>Zaburzenia zmysłów mowy, słuchu, wzroku, równowagi (np. zawroty głowy, dzwonienie w uszach).</li><li>Zmiany stanu psychicznego (splątanie, dezorientacja).</li></ul>',
                '<strong>Objawy płucno-krążeniowe:</strong><ul><li>Duszność, spłycony i przyspieszony oddech, suchy kaszel, ból w klatce piersiowej (objawy zawału płuc/zablokowania filtra płucnego).</li><li>Objawy zawału serca (promieniujący ból za mostkiem, zaburzenia rytmu serca, szybkie i słabe tętno, niepokój, panika, zatrzymanie pracy serca).</li></ul>'
            ]
        },

        { type: 'paragraph', value: '<strong>Występowanie Objawów:</strong> Objawy DCS najczęściej pojawiają się między 15 minutą a 12 godziną po wynurzeniu, ale w ciężkich przypadkach mogą wystąpić szybciej lub, rzadko, nawet do 24–36 godzin po nurkowaniu, szczególnie jeśli po nurkowaniu nastąpił lot samolotem.' },
        { type: 'image', src: 'lectures/dcs/DCS_typy.png', alt: 'Klasyfikacja DCS - Typ I i Typ II', caption: 'Infografika: Podział, objawy i mechanizmy DCS.' },

        { type: 'header', level: 3, value: 'Profilaktyka i Czynniki Ryzyka' },
        { type: 'paragraph', value: 'Ryzyko wystąpienia DCS istnieje, nawet pomimo przestrzegania wszystkich zasad. Profilaktyka polega na minimalizowaniu czynników ryzyka:' },

        { type: 'header', level: 4, value: 'Technika i Planowanie Nurkowania:' },
        {
            type: 'list', items: [
                '<strong>Prędkość Wynurzania:</strong> Stosuj prawidłową prędkość wynurzania (nie większą niż 10 m/min). Zbyt duża prędkość jest główną przyczyną DCS.',
                '<strong>Czas Nurkowania:</strong> Nurkuj w granicach limitów bezdekompresyjnych (tzw. no-deco limits).',
                '<strong>Przystanki Bezpieczeństwa:</strong> Zawsze wykonuj przystanek bezpieczeństwa (3–5 min na głębokości 3–5 m). Około 40% wypadków DCS to nurkowania bez przystanku bezpieczeństwa.',
                '<strong>Unikaj Profili Ryzykownych:</strong> Unikaj nurkowań o profilu „piłokształtnym” (jo-jo) lub chaotycznym. Nurkowanie rozpoczynaj od zanurzenia na największą planowaną głębokość.',
                '<strong>Nurkowania Powtórzeniowe:</strong> Zachowaj szczególną ostrożność podczas nurkowań wielokrotnych w ciągu dnia lub wielodniowych, ponieważ zwiększają one ryzyko DCS.',
                '<strong>Lot po Nurkowaniu:</strong> Po nurkowaniu należy odczekać co najmniej 24 godziny przed lotem samolotem lub podróżą na wysokość powyżej 500 metrów n.p.m., aby uniknąć zwiększonego ryzyka.'
            ]
        },

        { type: 'header', level: 4, value: 'Czynniki Fizjologiczne Zwiększające Ryzyko:' },
        {
            type: 'list', items: [
                'Odwodnienie (niewłaściwy bilans wodny).',
                'Niska temperatura wody (przechłodzenie).',
                'Duży wysiłek fizyczny (podczas i po nurkowaniu).',
                'Otyłość.',
                'Zła kondycja fizyczna i psychiczna, zmęczenie.',
                'Alkohol lub tzw. kac.',
                'Wady serca, np. przetrwały otwór owalny (PFO).',
                'Gorąca kąpiel/sauna po nurkowaniu.'
            ]
        },
        { type: 'image', src: 'lectures/dcs/DCS_profilaktyka.png', alt: 'Profilaktyka i Czynniki Ryzyka DCS', caption: 'Jak zminimalizować ryzyko choroby dekompresyjnej.' },

        { type: 'header', level: 3, value: 'Pierwsza Pomoc w Przypadku Podejrzenia DCS' },
        { type: 'paragraph', value: 'Skuteczność leczenia ciężkiej postaci DCS zależy głównie od szybkości podjęcia leczenia w komorze dekompresyjnej.' },

        { type: 'header', level: 4, value: 'Kroki Pierwszej Pomocy:' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Ocena i Wezwanie Pomocy:</strong> W przypadku podejrzenia DCS natychmiast wezwij pomoc medyczną (tel. 112 lub 999). Poinformuj, że podejrzewasz wypadek nurkowy i skontaktuj się z zespołem komór dekompresyjnych, np. Krajowy Ośrodek Medycyny Hiperbarycznej w Gdyni (tel. 58 699 86 54 lub 58 622 51 63).',
                '<strong>Tlenoterapia:</strong> Podaj poszkodowanemu 100% tlen w maksymalnym przepływie tak szybko, jak to możliwe.<ul><li>Tlen poprawia utlenowanie tkanek, redukuje możliwość powstawania nowych zatorów oraz zmniejsza średnicę pęcherzyków gazowych (zarówno azotowych, jak i powietrznych).</li><li>Poszkodowanego należy zabezpieczyć w tlen podczas transportu.</li></ul>',
                '<strong>Pozycja i Nawadnianie:</strong> Ułóż poszkodowanego w pozycji poziomej. Podaj poszkodowanemu do picia najlepiej wodę niegazowaną (jeśli jest przytomny) do 1 litra.',
                '<strong>Resuscytacja:</strong> Jeśli poszkodowany nie oddycha, wykonaj podstawowe zabiegi resuscytacyjne (BLS).',
                '<strong>Transport:</strong> W ciężkim przypadku DCS, transport śmigłowcem jest najszybszym sposobem na dostarczenie nurka do komory dekompresyjnej.'
            ]
        },
        { type: 'image', src: 'lectures/dcs/DCS_pierwsza_pomoc.png', alt: 'Pierwsza Pomoc w DCS', caption: 'Algorytm postępowania przy podejrzeniu choroby dekompresyjnej.' },

        { type: 'info-box', style: 'info', content: '<strong>Podsumowanie:</strong> Choroba dekompresyjna, choć rzadka przy prawidłowym nurkowaniu rekreacyjnym, jest stanem, w którym niekontrolowana eliminacja azotu (zgodnie z Prawem Henry\'ego) prowadzi do powstawania pęcherzyków uszkadzających tkanki. Kluczem jest przestrzeganie limitów, kontrola wynurzania i szybka reakcja w przypadku wystąpienia objawów.' }
    ],
    audioSrc: 'public/assets/lectures/dcs/Dlaczego_komputer_nie_uchroni_cię_przed_DCS.m4a',
    presentationSrc: 'public/assets/lectures/dcs/DCS_Mechanizm_Profilaktyka_Pomoc.pdf',
    quiz: [
        {
            question: "Jakie prawo fizyczne opisuje mechanizm powstawania Choroby Dekompresyjna (DCS)?",
            options: [
                "Prawo Archimedesa",
                "Prawo Boyle'a-Mariotte'a",
                "Prawo Henry'ego",
                "Prawo Daltona"
            ],
            correctAnswer: 2,
            explanation: "Prawo Henry'ego mówi o rozpuszczalności gazów w cieczach pod wpływem ciśnienia, co jest istotą nasycania i odsycania tkanek azotem."
        },
        {
            question: "Jaka jest zalecana bezpieczna prędkość wynurzania, aby zminimalizować ryzyko DCS?",
            options: [
                "18 metrów na minutę",
                "Maksymalnie 10 metrów na minutę",
                "Zawsze szybciej niż bąbelki powietrza",
                "1 metr na sekundę"
            ],
            correctAnswer: 1,
            explanation: "Współczesne standardy zalecają prędkość nie większą niż 9-10 m/min, a w ostatniej fazie (ostatnie 10m) nawet wolniej."
        },
        {
            question: "Kiedy najczęściej pojawiają się objawy DCS?",
            options: [
                "Natychmiast po wynurzeniu (w ciągu sekund)",
                "Od 15 minut do 12 godzin po nurkowaniu",
                "Tylko pod wodą",
                "Po 48 godzinach"
            ],
            correctAnswer: 1,
            explanation: "Większość objawów DCS pojawia się w ciągu pierwszej godziny, a 98% w ciągu 24h. Natychmiastowe objawy po wynurzeniu częściej sugerują UCP/AGE."
        },
        {
            question: "Co decyduje o ilości azotu absorbowanego podczas nurkowania?",
            options: [
                "Tylko głębokość",
                "Tylko czas",
                "Głębokość, czas i ciśnienie parcjalne azotu",
                "Temperatura wody"
            ],
            correctAnswer: 2,
            explanation: "Według Prawa Henry'ego, ilość rozpuszczonego azotu zależy od jego ciśnienia parcjalnego (które rośnie z głębokością) i czasu ekspozycji."
        },
        {
            question: "Jaka jest maksymalna zalecana prędkość wynurzania w nurkowaniu rekreacyjnym?",
            options: [
                "5 m/min",
                "10 m/min",
                "15 m/min",
                "20 m/min"
            ],
            correctAnswer: 1,
            explanation: "Standardowa prędkość wynurzania to nie więcej niż 10 m/min. Wolniejsze wynurzanie (9 m/min lub mniej) dodatkowo zwiększa bezpieczeństwo."
        },
        {
            question: "Czym różni się DCS Typ I od DCS Typ II?",
            options: [
                "Nie ma różnicy",
                "Typ I (lekki) - bóle stawów, skóra; Typ II (ciężki) - neurologiczne, płucne",
                "Typ I występuje przy powietrzu, Typ II przy Nitroksie",
                "Typ I to Barotrauma, Typ II to DCS"
            ],
            correctAnswer: 1,
            explanation: "DCS Typ I dotyczy tkanek obwodowych (bóle zgięć, skóra). Typ II jest znacznie poważniejszy i obejmuje objawy neurologiczne, płucne lub wielonarządowe."
        },
        {
            question: "Dlaczego przystanek bezpieczeństwa (3-5 min na 5m) jest tak ważny?",
            options: [
                "Pozwala odpocząć nurkom",
                "Daje czas na odgazowanie azotu z organizmu",
                "Jest wymagany prawnie",
                "Pomaga oszczędzać powietrze"
            ],
            correctAnswer: 1,
            explanation: "Przystanek bezpieczeństwa znacznie redukuje ryzyko DCS, umożliwiając bezpieczne uwolnienie azotu z organizmu. Ok. 40% wypadków DCS to nurkowania bez przystanku."
        },
        {
            question: "Które z poniższych zwiększa ryzyko DCS?",
            options: [
                "Odwodnienie i alkohol",
                "Otyłość i brak kondycji",
                "Nurkowania powtórzeniowe i gorąca kąpiel po nurkowaniu",
                "Wszystkie powyższe"
            ],
            correctAnswer: 3,
            explanation: "Wszystkie te czynniki zwiększają ryzyko DCS. Dehydracja utrudnia eliminację azotu, tkanka tłuszczowa gromadzi więcej azotu, a ciepło rozszerza naczynia krwionośne."
        },
        {
            question: "Ile czasu należy odczekać przed lotem samolotem po nurkowaniu rekreacyjnym?",
            options: [
                "2 godziny",
                "12 godzin",
                "Co najmniej 18-24 godziny",
                "1 godzina"
            ],
            correctAnswer: 2,
            explanation: "Zaleca się odczekać minimum 18-24 godziny przed lotem (lub podróżą powyżej 500m n.p.m.), aby zredukować ryzyko DCS spowodowane obniżonym ciśnieniem na wysokości."
        },
        {
            question: "Co oznacza 'bends' (zgięcia) w kontekście DCS?",
            options: [
                "Wykręcanie stawów przez nurka",
                "Głębokie bóle stawowe zmuszające do utrzymywania stawu w pozycji zgięcia",
                "Manewry ratunkowe",
                "Technika nurkowania"
            ],
            correctAnswer: 1,
            explanation: "'Bends' to klasyczny objaw DCS Typ I - intensywny ból w dużych stawach (kolana, łokcie), który zmusza poszkodowanego do trzymania stawu w pozycji zgięcia dla ulgi."
        },
        {
            question: "Czym jest PFO (Przetrwały Otwór Owalny) w kontekście DCS?",
            options: [
                "Wadą automatu oddechowego",
                "Wadą serca, która zwiększa ryzyko przedostania się pęcherzyków do tętnic",
                "Chorobą płuc",
                "Techniką wynurzania"
            ],
            correctAnswer: 1,
            explanation: "PFO to połączenie między przedsionkami serca. Pozwala pęcherzykom azotu ominąć filtr płucny i trafić bezpośrednio do mózgu, zwiększając ryzyko DCS II."
        },
        {
            question: "Jak objawia się DCS skórny?",
            options: [
                "Jako skaleczenia",
                "Jako swędząca wysypka lub marmurkowate plamy na skórze",
                "Jako oparzenie",
                "Jako bladość twarzy"
            ],
            correctAnswer: 1,
            explanation: "DCS skórny często objawia się swędzeniem (świąd) lub charakterystyczną marmurkowatością na tułowiu i ramionach."
        },
        {
            question: "Co to jest 'The Chokes'?",
            options: [
                "Dławienie się wodą",
                "Płucna postać DCS (DCS II), objawiająca się kaszlem i dusznością",
                "Technika ratownicza",
                "Rodzaj sprzętu"
            ],
            correctAnswer: 1,
            explanation: "'Chokes' to bardzo groźna postać DCS, gdzie pęcherzyki blokują krążenie w płucach, powodując duszność, suchy kaszel i ból w klatce."
        },
        {
            question: "Który z poniższych jest niespecyficznym, ale częstym objawem DCS?",
            options: [
                "Głód",
                "Niezwykłe, skrajne zmęczenie po nurkowaniu",
                "Euforia",
                "Czkawka"
            ],
            correctAnswer: 1,
            explanation: "Nieuzasadnione, skrajne zmęczenie po nurkowaniu (niewspółmierne do wysiłku) jest często ignorowanym objawem łagodnej DCS."
        },
        {
            question: "Dlaczego odwodnienie zwiększa ryzyko DCS?",
            options: [
                "Bo krew gęstnieje i gorzej transportuje azot do płuc",
                "Bo nurek szybciej marznie",
                "Bo automat podaje suche powietrze",
                "Nie ma wpływu"
            ],
            correctAnswer: 0,
            explanation: "Zagęszczona krew (hemokoncentracja) ma gorszą perfuzję, co utrudnia skuteczną eliminację azotu z tkanek."
        },
        {
            question: "Dlaczego profil nurkowania typu 'jo-jo' jest niebezpieczny?",
            options: [
                "Bo zużywa dużo powietrza",
                "Bo wielokrotne zmiany ciśnienia sprzyjają formowaniu się i wzrostowi mikropęcherzyków",
                "Bo błędnik szaleje",
                "Jest bezpieczny"
            ],
            correctAnswer: 1,
            explanation: "Wielokrotne zanurzanie i wynurzanie sprzyja powiększaniu się istniejących pęcherzyków gazu i zwiększa ryzyko DCS."
        },
        {
            question: "Jaka jest rola 100% tlenu w pierwszej pomocy przy DCS?",
            options: [
                "Tylko uśmierza ból",
                "Tworzy maksymalny gradient ciśnień, przyspieszając wypłukiwanie azotu",
                "Usypia poszkodowanego",
                "Chłodzi organizm"
            ],
            correctAnswer: 1,
            explanation: "Oddychanie czystym tlenem maksymalizuje różnicę ciśnień między azotem w tkankach a płucami, drastycznie przyspieszając jego eliminację."
        },
        {
            question: "Dlaczego tkanka tłuszczowa ma znaczenie w DCS?",
            options: [
                "Azot rozpuszcza się w tłuszczu 5x lepiej niż w wodzie",
                "Tłuszcz chroni przed zimnem, więc zmniejsza ryzyko",
                "Nie ma znaczenia",
                "Tłuszcz szybciej oddaje azot"
            ],
            correctAnswer: 0,
            explanation: "Tkanka tłuszczowa jest magazynem azotu (azot jest lipofilny). Osoby otyłe mogą gromadzić więcej azotu i wolniej go oddawać."
        }
    ]
};
