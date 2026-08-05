
export const deepDivingLecture = {
    id: 'deep-diving',
    title: 'Nurkowanie Głębokie (Deep Diving)',
    description: 'Fizyka, fizjologia i procedury bezpiecznego nurkowania rekreacyjnego poniżej 18 metrów.',
    duration: '20 min',
    level: 'Advanced',
    // image: 'lectures/deep-diving/deep_diving_gas.png', // Usunięte na prośbę: nadmiarowa grafika tytułowa
    audioSrc: 'lectures/deep-diving/deep_diving_audio.m4a',
    presentationSrc: 'lectures/deep-diving/deep_diving_presentation.pdf',
    content: [
        { type: 'header', level: 2, value: 'Wstęp: Czym jest nurkowanie głębokie?' },
        { type: 'paragraph', value: 'Nurkowanie głębokie definiuje się zazwyczaj jako każde zanurzenie poniżej 18 metrów. W nurkowaniu rekreacyjnym absolutną granicą jest 40 metrów. Celem tego szkolenia nie jest tylko "zaliczenie głębokości", ale nauczenie się bezpiecznego planowania i przeprowadzania takich nurkowań bez konieczności dekompresji (nurkowanie bezdekompresyjne), przy użyciu powietrza lub nitroksu.' },

        { type: 'header', level: 2, value: 'Część I: Fizyka i Fizjologia Głębin' },
        { type: 'header', level: 3, value: '1. Ciśnienie i Zużycie Gazu' },
        { type: 'paragraph', value: 'Na głębokości 40 metrów ciśnienie otoczenia wynosi 5 barów. Oznacza to, że zużywasz powietrze 5 razy szybciej niż na powierzchni. Gęstość gazu wzrasta, co zwiększa opory oddechowe. Należy oddychać głęboko i powoli, aby uniknąć zadyszki i retencji CO2.' },
        {
            type: 'image',
            src: 'lectures/deep-diving/deep_diving_gas.png',
            alt: 'Wykres zużycia gazu w zależności od głębokości',
            caption: 'Zużycie gazu rośnie proporcjonalnie do ciśnienia otoczenia.'
        },
        { type: 'header', level: 3, value: '2. Narkoza Azotowa' },
        { type: 'paragraph', value: 'Jest to stan odurzenia wywołany wysokim ciśnieniem parcjalnym azotu. Objawy (euforia, lęk, spowolnienie reakcji, zawroty głowy) mogą pojawić się już od 30 metrów. Reakcja: Wynurzenie się na mniejszą głębokość powoduje natychmiastowe ustąpienie objawów.' },
        {
            type: 'image',
            src: 'lectures/deep-diving/deep_diving_narcosis.png',
            alt: 'Infografika objawów narkozy azotowej',
            caption: 'Objawy narkozy azotowej mogą przypominać upojenie alkoholowe.'
        },
        { type: 'header', level: 3, value: '3. Choroba Dekompresyjna (DCS)' },
        { type: 'paragraph', value: 'Im głębiej i dłużej nurkujesz, tym więcej azotu rozpuszcza się w tkankach. Przekroczenie limitów lub zbyt szybkie wynurzanie prowadzi do powstawania pęcherzyków gazu. Bezpieczeństwo opiera się na przestrzeganiu limitów bezdekompresyjnych (NDL) i prędkości wynurzania (max. 9-10 m/min).' },

        { type: 'header', level: 2, value: 'Część II: Sprzęt do Nurkowania Głębokiego' },
        { type: 'paragraph', value: 'Sprzęt musi być najwyższej jakości i niezawodny. Margines błędu na głębokości jest minimalny.' },
        {
            type: 'list', items: [
                '<strong>System Dostarczania Powietrza:</strong> Zalecane są automaty odciążone (zapewniające stały wydatek gazu niezależnie od ciśnienia w butli i głębokości).',
                '<strong>Alternatywne Źródło Powietrza:</strong> Musi być łatwo dostępne. Zaleca się posiadanie niezależnego źródła (np. butla pony lub stage) lub w konfiguracji twinset.',
                '<strong>Butla:</strong> Odpowiednia pojemność (np. 15 litrów), aby zapewnić zapas gazu na czas denny, powolne wynurzenie i przystanek bezpieczeństwa.',
                '<strong>Przyrządy:</strong> Komputer nurkowy (niezbędny do monitorowania NDL i prędkości wynurzania), kompas, manometr.'
            ]
        },

        { type: 'header', level: 2, value: 'Część III: Planowanie Nurkowania' },
        { type: 'paragraph', value: 'Planowanie jest kluczem do bezpieczeństwa. Każde nurkowanie głębokie musi być dokładnie zaplanowane przed wejściem do wody.' },
        {
            type: 'list', items: [
                '<strong>1. Cel i Limity:</strong> Ustalenie maksymalnej głębokości i czasu. Planowana głębokość nie powinna przekraczać limitów wyszkolenia partnera o niższych kwalifikacjach.',
                '<strong>2. Zarządzanie Gazem (SAC):</strong> Obliczenie zużycia gazu w oparciu o wskaźnik powierzchniowego zużycia (SAC). Musisz wiedzieć, ile gazu zużyjesz na danej głębokości. Reguła rezerwy: Planuj wynurzenie z większą rezerwą niż standardowe 50 bar.',
                '<strong>3. Przerwa powierzchniowa:</strong> Jeśli planujesz nurkowania powtórzeniowe, przerwa na powierzchni musi być wystarczająco długa, aby zredukować poziom azotu resztkowego.'
            ]
        },

        { type: 'header', level: 2, value: 'Część IV: Procedury w Wodzie' },
        { type: 'header', level: 3, value: '1. Zanurzanie' },
        { type: 'paragraph', value: 'Kontrolowane, przy linie opustowej lub w kontakcie wzrokowym z dnem/ścianą. Częste wyrównywanie ciśnienia.' },
        { type: 'header', level: 3, value: '2. Na dnie' },
        { type: 'paragraph', value: 'Częsta kontrola manometru (częściej niż na płytkiej wodzie), kontrola NDL na komputerze, obserwacja partnera pod kątem narkozy.' },
        { type: 'header', level: 3, value: '3. Wynurzanie' },
        { type: 'paragraph', value: 'Najbardziej krytyczna faza.' },
        {
            type: 'list', items: [
                'Prędkość nie większa niż 9-10 m/min.',
                'Obowiązkowy przystanek bezpieczeństwa na 5 metrach przez 3-5 minut.',
                'W razie przypadkowego przekroczenia limitu bezdekompresyjnego (o mniej niż 5 min), wykonaj przystanek bezpieczeństwa wydłużony do 10-15 minut (tzw. dekompresja awaryjna), jeśli masz dość gazu.'
            ]
        },
        {
            type: 'image',
            src: 'lectures/deep-diving/deep_diving_ascent.png',
            alt: 'Infografika procedury bezpiecznego wynurzania',
            caption: 'Procedura bezpiecznego wynurzania z przystankiem bezpieczeństwa.'
        },

        { type: 'header', level: 2, value: 'Podsumowanie' },
        { type: 'paragraph', value: 'Nurkowanie głębokie otwiera dostęp do wraków i unikalnych formacji, ale wymaga dyscypliny. Nigdy nie nurkuj głęboko sam, dbaj o sprzęt i zawsze zostawiaj margines bezpieczeństwa w planie gazowym i dekompresyjnym.' }
    ],
    quiz: [
        {
            question: "Jaka jest definicja nurkowania głębokiego w nurkowaniu rekreacyjnym (wg większości standardów)?",
            options: ["Każde nurkowanie poniżej 12 metrów.", "Każde nurkowanie poniżej 18 metrów.", "Każde nurkowanie poniżej 30 metrów.", "Każde nurkowanie z łodzi."],
            correctAnswer: 1
        },
        {
            question: "Jakie ciśnienie absolutne panuje na głębokości 30 metrów (w wodzie słonej)?",
            options: ["3 bary.", "4 bary.", "2 bary.", "5 barów."],
            correctAnswer: 1
        },
        {
            question: "Dlaczego zużycie powietrza wzrasta wraz z głębokością?",
            options: ["Ponieważ płuca się powiększają.", "Ponieważ gaz jest gęstszy pod wpływem ciśnienia (zgodnie z prawem Boyle'a).", "Ponieważ woda jest zimniejsza.", "Ponieważ automat ciężej pracuje."],
            correctAnswer: 1
        },
        {
            question: "Co jest głównym objawem narkozy azotowej?",
            options: ["Ból stawów.", "Euforia, spowolnienie reakcji, lęk lub zaburzenia oceny sytuacji.", "Drgawki.", "Kaszel."],
            correctAnswer: 1
        },
        {
            question: "Jakie jest najskuteczniejsze działanie w przypadku wystąpienia objawów narkozy azotowej?",
            options: ["Szybkie wynurzenie na powierzchnię.", "Spokojne wynurzenie na mniejszą głębokość, aż objawy ustąpią.", "Zatrzymanie się i głębokie oddychanie na tej samej głębokości.", "Podanie tlenu pod wodą."],
            correctAnswer: 1
        },
        {
            question: "Jaki rodzaj automatu oddechowego jest zalecany do nurkowań głębokich?",
            options: ["Tłokowy nieodciążony.", "Odciążony (zapewniający stały komfort oddechowy).", "Zintegrowany z inflatorem.", "Dowolny sprawny automat."],
            correctAnswer: 1
        },
        {
            question: "Obliczając zużycie gazu, wskaźnik SAC (Surface Air Consumption) pozwala określić:",
            options: ["Ile gazu zużyjesz na powierzchni przed nurkowaniem.", "Ile gazu zużyjesz na dowolnej głębokości, mnożąc SAC przez ciśnienie otoczenia.", "Maksymalną głębokość nurkowania.", "Wagę balastu."],
            correctAnswer: 1
        },
        {
            question: "Co należy zrobić w przypadku przypadkowego przekroczenia limitu bezdekompresyjnego o mniej niż 5 minut (zgodnie z procedurami awaryjnymi)?",
            options: ["Wynurzyć się natychmiast i udać do lekarza.", "Wykonać przystanek bezpieczeństwa na 5 metrach przez co najmniej 10-15 minut (o ile zapas gazu pozwala).", "Ponownie zanurzyć się głębiej.", "Nie robić nic, jeśli nie ma objawów."],
            correctAnswer: 1
        },
        {
            question: "Zalecana maksymalna prędkość wynurzania podczas nurkowania głębokiego to:",
            options: ["18 m/min.", "9-10 m/min.", "15 m/min.", "3 m/min."],
            correctAnswer: 1
        },
        {
            question: "Jaki jest maksymalny limit głębokości dla nurkowania rekreacyjnego?",
            options: ["30 metrów.", "40 metrów.", "50 metrów.", "60 metrów."],
            correctAnswer: 1
        },
        {
            question: "Dlaczego podczas nurkowań głębokich zaleca się korzystanie z liny opustowej (jeśli dostępna)?",
            options: ["Aby szybciej opaść na dno.", "Aby kontrolować prędkość zanurzania, ułatwić wyrównywanie ciśnienia i utrzymać grupę razem.", "Aby nie musieć używać płetw.", "Jest to wymagane tylko w prądzie."],
            correctAnswer: 1
        },
        {
            question: "Jeśli planujesz nurkowanie na 30 metrów, a Twój partner ma uprawnienia tylko do 18 metrów, na jaką głębokość powinniście zejść?",
            options: ["Do 30 metrów, Ty będziesz go pilnować.", "Do 24 metrów (średnia).", "Do 18 metrów (limit partnera o niższych uprawnieniach).", "Partner powinien zostać na 18m, a Ty zejść na 30m."],
            correct: 2
        },
        {
            question: "'Off-gassing' (odsycanie) azotu odbywa się głównie:",
            options: ["Podczas zanurzania.", "Podczas pobytu na dnie.", "Podczas wynurzania i przerwy na powierzchni.", "Tylko po wyjściu z wody."],
            correct: 2
        },
        {
            question: "Jaki wpływ na ryzyko choroby dekompresyjnej ma odwodnienie?",
            options: ["Zmniejsza ryzyko.", "Zwiększa ryzyko (krew jest gęstsza, gorsza perfuzja).", "Nie ma wpływu.", "Zależy od temperatury wody."],
            correctAnswer: 1
        },
        {
            question: "Dlaczego nie zaleca się używania przycisku 'bypass' (pucka) automatu na głębokości bez potrzeby?",
            options: ["Może to spowodować zamarznięcie automatu w zimnej wodzie.", "Zużywa baterię komputera.", "Płoszy ryby.", "Zwiększa pływalność."],
            correct: 0
        },
        {
            question: "Przystanek bezpieczeństwa wykonuje się:",
            options: ["Tylko po nurkowaniach dekompresyjnych.", "Na głębokości 3 metrów przez 1 minutę.", "Na głębokości 5 metrów przez 3-5 minut po każdym nurkowaniu głębokim.", "Tylko gdy brakuje powietrza."],
            correct: 2
        },
        {
            question: "Komputer nurkowy oblicza limit bezdekompresyjny (NDL) w oparciu o:",
            options: ["Tylko głębokość maksymalną.", "Głębokość i czas (model tkankowy).", "Ilość powietrza w butli.", "Temperaturę wody."],
            correctAnswer: 1
        },
        {
            question: "Najbezpieczniejszym miejscem dla alternatywnego źródła powietrza (np. octopusa) jest:",
            options: ["W kieszeni jacketu.", "Zwisające luźno, by było widoczne.", "W 'trójkącie bezpieczeństwa' na klatce piersiowej, łatwo dostępne dla partnera.", "Przypięte do nogi."],
            correct: 2
        },
        {
            question: "Co oznacza skrót MOD?",
            options: ["Minimalna Głębokość Operacyjna.", "Maksymalna Głębokość Operacyjna (dla danej mieszanki gazowej).", "Metoda Obliczania Dekompresji.", "Maksymalny Czas Denny."],
            correctAnswer: 1
        },
        {
            question: "Po nurkowaniu głębokim (bezdekompresyjnym) należy powstrzymać się od lotu samolotem przez co najmniej:",
            options: ["2 godziny.", "12 godzin (po pojedynczym) lub 18-24 godziny (po wielokrotnych).", "48 godzin.", "Nie ma ograniczeń."],
            correctAnswer: 1
        }
    ]
};
