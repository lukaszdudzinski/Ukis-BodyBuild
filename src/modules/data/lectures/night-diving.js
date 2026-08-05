export const nightDivingLecture = {
    id: 'night-diving',
    title: 'Nurkowanie Nocne i w Ograniczonej Widoczności',
    readTime: '15 min',
    level: 'Advanced',
    audioSrc: 'lectures/night-diving/Tajemnice_i_bezpieczeństwo_nurkowania_po_zmroku.m4a',
    presentationSrc: 'lectures/night-diving/Navigating_Low_Visibility_Diving.pdf',
    description: 'Noc w samo południe. Dlaczego w polskich wodach latarka jest Twoim najważniejszym partnerem?',
    content: [
        { type: 'paragraph', value: 'Nurkowanie po zachodzie słońca to jedno z najbardziej ekscytujących doświadczeń w karierze płetwonurka. Znane Ci miejsca zmieniają się nie do poznania, a zmysły wyostrzają się, reagując na każdy ruch w snopie światła. W tym przewodniku dowiesz się, jak bezpiecznie wejść w świat mroku – niezależnie od tego, czy jest to noc na rafie, czy głębokie nurkowanie w polskim jeziorze.' },

        { type: 'header', level: 3, value: 'Wstęp: Dlaczego warto zanurzyć się w mrok?' },
        { type: 'paragraph', value: 'Kiedy słońce znika pod horyzontem, pod wodą następuje „zmiana warty”. Ryby dzienne zapadają w letarg, chowając się w szczelinach, a na żer wychodzą drapieżniki: mureny, ośmiornice, skorupiaki i homary, które za dnia są nieuchwytne.' },
        { type: 'paragraph', value: 'Magia nurkowania nocnego polega również na przywracaniu kolorów. Woda działa jak filtr, pochłaniając barwy (czerwony znika już na kilku metrach). W nocy Twoja latarka przywraca pełne spektrum barw na dystansie oświetlenia – rafa, która w dzień wydaje się niebiesko-szara, w nocy eksploduje żywymi kolorami. Dodatkowo, ograniczone pole widzenia (tylko to, co oświetlasz) wywołuje tzw. "efekt tunelowy", który pozwala skupić się na makro-życiu i detalach, które w dzień często umykają naszej uwadze.' },

        { type: 'header', level: 3, value: 'Specyfika Polska: "Noc w środku dnia"' },
        { type: 'paragraph', value: 'Dla nurków w Polsce umiejętność posługiwania się światłem jest kluczowa nie tylko w nocy. Nasze wody (jeziora, Bałtyk) charakteryzują się specyficzną stratyfikacją i zmąceniem. Często już na głębokości 20-30 metrów (a w mniej przejrzystych akwenach znacznie płycej) panują całkowite ciemności, nawet w słoneczny letni dzień.' },
        { type: 'paragraph', value: 'Wniosek jest prosty: W polskich warunkach latarka nie jest wyposażeniem "opcjonalnym" czy "nocnym". Jest to standardowy element ekwipunku każdego nurka schodzącego poniżej strefy światła. Traktuj każde głębsze nurkowanie w polskich wodach jak nurkowanie nocne pod względem procedur bezpieczeństwa i dublowania sprzętu oświetleniowego.' },

        { type: 'header', level: 3, value: 'Przygotowanie i Procedury (Standardy SSI/CMAS)' },
        { type: 'paragraph', value: 'Bezpieczeństwo w nocy opiera się na planowaniu i redundancji (dublowaniu).' },
        { type: 'paragraph', value: '<strong>Przygotowanie miejsca:</strong> Jeśli nurkujesz z brzegu, kluczowe jest ustawienie świateł orientacyjnych. Najlepszą praktyką jest ustawienie dwóch świateł w linii (jedno wyżej, drugie niżej), co pozwala precyzyjnie namierzyć punkt wyjścia z wody. W przypadku nurkowania z łodzi, jednostka powinna być oznaczona światłem pozycyjnym, a lina opustowa światłem chemicznym lub stroboskopowym (błyskaczem).' },
        { type: 'paragraph', value: '<strong>Kluczowa zasada Redundancji:</strong> W nurkowaniu nocnym i w ograniczonej widoczności jeden nurek musi posiadać MINIMUM dwa niezależne źródła światła:' },

        {
            type: 'list', items: [
                'Latarka Główna: Mocna, służąca do nawigacji i komunikacji.',
                'Latarka Zapasowa (Backup): Mniejsza, łatwo dostępna, niezawodna.'
            ]
        },

        { type: 'info-box', style: 'warning', title: 'Złota zasada bezpieczeństwa', content: 'Jeśli Twoja latarka główna ulegnie awarii, natychmiast włączasz latarkę zapasową, sygnalizujesz problem partnerowi i kończysz nurkowanie, rozpoczynając bezpieczne wynurzanie. Nie kontynuuj nurkowania na latarce zapasowej!' },

        { type: 'header', level: 3, value: 'Sprzęt: Ewolucja i Współczesność' },
        { type: 'paragraph', value: 'Technologia oświetlenia nurkowego przeszła długą drogę, co bezpośrednio przekłada się na nasz komfort i bezpieczeństwo:' },

        {
            type: 'list', items: [
                '<strong>Era Halogenów:</strong> Dawniej standard. Dawały ciepłe, żółte światło, które dobrze oddawało barwy, ale zużywały ogromne ilości energii (krótki czas pracy) i były wrażliwe na wstrząsy.',
                '<strong>Era HID:</strong> Krok milowy w nurkowaniu technicznym. Oferowały potężny, skupiony strumień światła (miecz świetlny), idealny do komunikacji w mętnej wodzie. Ich wadą była delikatność żarnika i wysoka cena.',
                '<strong>Era LED:</strong> Obecnie dominująca technologia. Diody LED są niezwykle odporne na wstrząsy, energooszczędne i oferują potężną moc przy małych gabarytach. Niemal całkowicie wyparły inne rozwiązania.'
            ]
        },

        { type: 'image', src: 'lectures/night-diving/night_evolution.jpg', alt: 'Ewolucja latarek nurkowych: Halogen, HID, LED', caption: 'Kliknij, aby powiększyć: Porównanie technologii oświetlenia.' },

        { type: 'paragraph', value: 'Konstrukcje latarek:' },
        {
            type: 'list', items: [
                '<strong>Ręczne (Handheld):</strong> Kompaktowe, źródło zasilania zintegrowane z głowicą. Idealne do nurkowania rekreacyjnego i jako światła zapasowe.',
                '<strong>Z zasobnikiem (Canister):</strong> Głowica połączona kablem z zasobnikiem na baterie mocowanym na pasie. Preferowane w nurkowaniu technicznym i trudnym (polskie wody). Dlaczego? Oferują bardzo długi czas pracy, a lekka głowica (często z uchwytem Goodmana) nie obciąża dłoni, co pozwala na swobodną obsługę innego sprzętu.'
            ]
        },

        { type: 'header', level: 3, value: 'Komunikacja Świetlna' },
        { type: 'paragraph', value: 'W nocy nie widzimy gestów rąk, chyba że je oświetlimy. Dlatego latarka staje się Twoim głosem. Pamiętaj o nadrzędnej zasadzie: <strong>Nigdy nie świeć partnerowi w oczy!</strong> To niszczy jego adaptację wzroku do ciemności i oślepia.' },

        { type: 'image', src: 'lectures/night-diving/night_signals.jpg', alt: 'Sygnały świetlne w nurkowaniu', caption: 'Kliknij, aby powiększyć: Kluczowe sygnały komunikacji świetlnej.' },

        { type: 'paragraph', value: 'Podstawowe sygnały świetlne:' },
        {
            type: 'list', items: [
                '<strong>OK:</strong> Rysowanie latarką powolnego koła na dnie lub przed partnerem.',
                '<strong>UWAGA / PROBLEM:</strong> Szybki, poziomy ruch latarką (lewo-prawo) lub gwałtowne ruchy.',
                '<strong>Sygnalizacja awaryjna:</strong> Bardzo szybkie, chaotyczne ruchy światłem lub użycie stroboskopu.'
            ]
        },

        { type: 'info-box', style: 'info', title: 'Komunikacja pasywna', content: 'Aby pokazać standardowy znak (np. „ile masz powietrza” lub „rezerwa”), oświetlasz własną dłoń trzymaną na wysokości klatki piersiowej, a nie świecisz na dłoń partnera. Dzięki temu Twój partner wyraźnie widzi Twój komunikat.' }
    ],
    quiz: [
        {
            question: 'Dlaczego nurkowanie nocne jest atrakcyjne dla obserwatorów życia podwodnego?',
            options: [
                'Ponieważ ryby dzienne są wtedy bardziej aktywne i szybciej pływają.',
                'Ponieważ w nocy woda staje się cieplejsza i przejrzystsza.',
                'Ponieważ następuje „zmiana warty” i na żer wychodzą drapieżniki oraz zwierzęta nieuchwytne za dnia (np. skorupiaki).',
                'Ponieważ w nocy koralowce zamykają się, odsłaniając skały.'
            ],
            correctAnswer: 2
        },
        {
            question: 'Co oznacza termin „noc w środku dnia” w kontekście polskich wód (jeziora, Bałtyk)?',
            options: [
                'Zjawisko zaćmienia słońca widoczne pod wodą.',
                'Sytuację, w której na pewnej głębokości (często 20-30m) panują całkowite ciemności nawet w słoneczny dzień, co wymusza posiadanie latarki.',
                'Nurkowanie w jaskiniach, gdzie zawsze jest ciemno.',
                'Nocne markowanie nurkowania podczas szkoleń basenowych.'
            ],
            correctAnswer: 1
        },
        {
            question: 'Jaka jest minimalna liczba niezależnych źródeł światła, którą musi posiadać nurek podczas nurkowania nocnego (zgodnie z zasadą redundancji)?',
            options: [
                'Jedna latarka główna.',
                'Trzy latarki (główna i dwie zapasowe).',
                'Dwie latarki (główna i zapasowa).',
                'Jedna latarka i jedno światło chemiczne.'
            ],
            correctAnswer: 2
        },
        {
            question: 'Jak brzmi „Złota Zasada Bezpieczeństwa” w przypadku awarii latarki głównej podczas nurkowania nocnego?',
            options: [
                'Włączasz latarkę zapasową i kontynuujesz nurkowanie zgodnie z planem.',
                'Włączasz latarkę zapasową, sygnalizujesz problem partnerowi i natychmiast kończycie nurkowanie (bezpieczne wynurzenie).',
                'Próbujesz naprawić latarkę pod wodą, a jeśli się nie uda, korzystasz ze światła partnera.',
                'Płyniesz do partnera i dzielicie się jedną latarką do końca nurkowania.'
            ],
            correctAnswer: 1
        },
        {
            question: 'W jaki sposób nurek powinien zasygnalizować standardowy znak dłonią (np. „ile masz powietrza”) w nocy?',
            options: [
                'Świecąc latarką prosto w twarz partnera, aby zwrócić jego uwagę.',
                'Oświetlając własną dłoń trzymaną na wysokości klatki piersiowej.',
                'Rysując kształt cyfr światłem latarki na dnie.',
                'Zbliżając się do maski partnera i krzycząc do automatu.'
            ],
            correctAnswer: 1
        },
        {
            question: 'Jakie ustawienie świateł orientacyjnych na brzegu najlepiej pozwala namierzyć punkt wyjścia z wody?',
            options: [
                'Dwa światła ustawione w jednej linii poziomej (obok siebie).',
                'Jedno silne światło stroboskopowe.',
                'Dwa światła ustawione w linii pionowej (jedno wyżej, drugie niżej).',
                'Trzy światła ułożone w trójkąt.'
            ],
            correctAnswer: 2
        },
        {
            question: 'Jaka jest główna zaleta latarek z zasobnikiem (kanistrowych) w nurkowaniu technicznym i trudnych warunkach?',
            options: [
                'Są najtańsze w zakupie.',
                'Oferują bardzo długi czas pracy, a lekka głowica nie obciąża dłoni.',
                'Mają zawsze słabsze światło, co nie płoszy ryb.',
                'Są jednorazowego użytku.'
            ],
            correctAnswer: 1
        },
        {
            question: 'Co oznacza sygnał świetlny polegający na szybkim, poziomym ruchu latarką (lewo-prawo)?',
            options: [
                'Wszystko w porządku (OK).',
                'Patrz na mnie / Zobacz to.',
                'Uwaga / Problem / Coś jest nie tak.',
                'Wynurzamy się.'
            ],
            correctAnswer: 2
        },
        {
            question: 'Dlaczego współczesne latarki LED niemal całkowicie wyparły starsze technologie (halogen, HID)?',
            options: [
                'Ponieważ są odporne na wstrząsy, energooszczędne i oferują dużą moc przy małych gabarytach.',
                'Ponieważ dają więcej ciepła, ogrzewając dłonie nurka.',
                'Ponieważ działają krócej, co wymusza bezpieczniejsze, krótsze nurkowania.',
                'Ponieważ dają tylko czerwone światło, niewidoczne dla ryb.'
            ],
            correctAnswer: 0
        },
        {
            question: 'Jaka jest nadrzędna zasada kultury i bezpieczeństwa podczas komunikacji światłem?',
            options: [
                'Używanie zawsze trybu stroboskopowego do rozmowy.',
                'Nigdy nie świecić partnerowi w oczy, aby go nie oślepić i nie zniszczyć akomodacji wzroku.',
                'Świecenie zawsze najmocniejszym trybem latarki.',
                'Wyłączanie latarki podczas każdego wynurzenia.'
            ],
            correctAnswer: 1
        }
    ]
};
