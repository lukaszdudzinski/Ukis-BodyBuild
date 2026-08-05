export const stressRescueLecture = {
    id: 'stress-rescue',
    title: 'Stres i Ratownictwo (Diver Stress & Rescue)',
    description: 'Kluczowe umiejętności radzenia sobie ze stresem i sytuacjami awaryjnymi pod wodą. Zapobieganie panice, procedury ratownicze i pierwsza pomoc.',
    readTime: '25 min',
    level: 'Advanced',
    icon: 'fa-life-ring',
    audioSrc: 'lectures/stress-rescue/stress_rescue_audio.m4a',
    presentationSrc: 'lectures/stress-rescue/stress_rescue_presentation.pdf',
    content: [
        { type: 'header', level: 2, value: 'Diver Stress & Rescue (Stres i Ratownictwo)' },

        // Wstęp
        { type: 'header', level: 3, value: 'Wstęp: Dlaczego ten kurs jest najważniejszy?' },
        { type: 'paragraph', value: 'Wielu instruktorów uważa kurs Stress & Rescue za najważniejszy w karierze nurka amatora. Dlaczego? Ponieważ uczy on, że wypadek nurkowy rzadko jest nagłym, nieprzewidzianym zdarzeniem. Zazwyczaj jest to finał łańcucha drobnych błędów, które zostały zignorowane. Kluczem do bezpieczeństwa nie jest tylko umiejętność wyciągnięcia kogoś z wody, ale przede wszystkim umiejętność przerwania tego łańcucha, zanim dojdzie do tragedii.' },

        // Część I
        { type: 'header', level: 3, value: 'Część I: Anatomia Stresu' },
        { type: 'paragraph', value: '<strong>Definicja Stresu:</strong> Stres to reakcja na bodźce (stresory), których natężenie przekracza zdolność jednostki do radzenia sobie z nimi.' },
        {
            type: 'list', items: [
                '<strong>Stres pozytywny (Eustres):</strong> Umiarkowany poziom napięcia, który zwiększa czujność i mobilizuje do działania przed nurkowaniem.',
                '<strong>Stres negatywny (Dystres):</strong> Gdy sytuacja wymyka się spod kontroli, prowadzi do paniki i irracjonalnych decyzji.'
            ]
        },

        { type: 'header', level: 4, value: 'Cykl Stresowo-Hiperwentylacyjny (Mechanizm Paniki)' },
        { type: 'paragraph', value: 'To kluczowy mechanizm, który musisz zrozumieć na egzamin:' },
        {
            type: 'image',
            src: 'lectures/stress-rescue/stress_rescue_cycle.png',
            alt: 'Infografika - Cykl Paniki',
            caption: 'Cykl Stresowo-Hiperwentylacyjny: Od stresora do paniki.'
        },
        {
            type: 'list', items: [
                '<strong>1. Stresor:</strong> (np. zgubienie partnera, zalana maska, prąd).',
                '<strong>2. Reakcja psychiczna:</strong> Lęk, utrata kontroli.',
                '<strong>3. Reakcja fizjologiczna:</strong> Wyrzut adrenaliny, przyspieszone tętno.',
                '<strong>4. Hiperwentylacja:</strong> Płytki, szybki oddech.',
                '<strong>5. Gromadzenie CO2:</strong> Poczucie "braku powietrza" (głód tlenowy), mimo że butla jest pełna.',
                '<strong>6. PANIKA:</strong> Reakcja "walcz lub uciekaj", wyplucie automatu, niekontrolowane wynurzenie.'
            ]
        },

        // Część II
        { type: 'header', level: 3, value: 'Część II: Przyczyny Stresu (Źródła)' },
        { type: 'paragraph', value: 'SSI dzieli przyczyny stresu na cztery główne kategorie. Musisz umieć je rozróżnić na teście:' },
        {
            type: 'list', items: [
                '<strong>1. Fizyczne:</strong> Zmęczenie, słaba kondycja, choroba morska, odwodnienie, hipotermia/hipertermia, skurcze.',
                '<strong>2. Psychiczne:</strong> Presja rówieśnicza ("peer pressure" – nurkowanie ponad siły, by nie wyjść na słabego), lęk przed nieznanym, ego.',
                '<strong>3. Sprzętowe:</strong> Źle dopasowany sprzęt (ciasny skafander utrudniający oddychanie), awaria, brak zaufania do sprzętu, zgubienie elementu wyposażenia.',
                '<strong>4. Środowiskowe:</strong> Zimna woda, słaba widoczność, prądy, falowanie, utrata orientacji.'
            ]
        },

        // Część III
        { type: 'header', level: 3, value: 'Część III: Zapobieganie i Rozpoznawanie (Detekcja)' },
        { type: 'paragraph', value: 'Stres można wykryć na trzech etapach:' },
        {
            type: 'list', items: [
                '<strong>1. Przed nurkowaniem:</strong> Nurek jest nienaturalnie cichy (wycofany) lub nadmiernie gadatliwy, ma problem ze złożeniem sprzętu, zapomina o prostych czynnościach (błąd percepcyjny).<br><em>Reakcja: Rozmowa, uspokojenie, wizualizacja nurkowania, ewentualnie rezygnacja z nurkowania.</em>',
                '<strong>2. W trakcie nurkowania:</strong> "Szerokie oczy" (szerokie spojrzenie przerażenia), szybki oddech (bąble z automatu lecą ciągle), nieskoordynowane ruchy, kurczowe trzymanie się liny lub partnera.<br><em>Reakcja: Nawiązanie kontaktu wzrokowego, sygnał "STOP", wyrównanie oddechu.</em>',
                '<strong>3. Po nurkowaniu:</strong> Zmęczenie, ukrywanie problemów, szybkie opuszczenie miejsca nurkowego.'
            ]
        },

        // Część IV
        { type: 'header', level: 3, value: 'Część IV: Zarządzanie Wypadkiem i Ratownictwo' },
        { type: 'paragraph', value: 'Gdy prewencja zawiedzie, wchodzimy w tryb ratunkowy.' },

        { type: 'header', level: 4, value: 'Złota Zasada Reakcji: 3-O (lub STOP-ODDYCHAJ-POMYŚL-DZIAŁAJ)' },
        { type: 'paragraph', value: 'W każdej sytuacji awaryjnej, zanim rzucisz się na pomoc, musisz zastosować tę sekwencję, aby samemu nie stać się ofiarą:' },
        {
            type: 'image',
            src: 'lectures/stress-rescue/stress_rescue_sopd.png',
            alt: 'Infografika - Procedura STOP',
            caption: 'Procedura awaryjna: STOP - ODDYCHAJ - POMYŚL - DZIAŁAJ.'
        },
        {
            type: 'list', items: [
                '<strong>1. Zatrzymaj się:</strong> Przerwij działanie, nie panikuj.',
                '<strong>2. Oddychaj:</strong> Uspokój oddech, aby obniżyć poziom CO2 i odzyskać jasność myślenia.',
                '<strong>3. Pomyśl:</strong> Przeanalizuj opcje. Czy masz dość powietrza? Gdzie jest partner?',
                '<strong>4. Działaj:</strong> Podejmij zaplanowaną akcję.'
            ]
        },

        { type: 'header', level: 4, value: 'Priorytety w ratownictwie' },
        {
            type: 'image',
            src: 'lectures/stress-rescue/stress_rescue_scheme.png',
            alt: 'Infografika - Priorytety Ratownicze',
            caption: 'Priorytety w akcji ratunkowej.'
        },
        {
            type: 'list', items: [
                '<strong>1. Własne bezpieczeństwo:</strong> Nie możesz pomóc innym, jeśli sam zginiesz.',
                '<strong>2. Bezpieczeństwo partnera/zespołu.</strong>',
                '<strong>3. Bezpieczeństwo poszkodowanego.</strong>'
            ]
        },

        { type: 'header', level: 4, value: 'Procedury w wodzie' },
        {
            type: 'list', items: [
                '<strong>Panika na powierzchni:</strong> Nie zbliżaj się, dopóki ofiara nie uspokoi się lub nie zastosujesz odpowiedniego chwytu. Napompuj jej BCD, rzuć koło ratunkowe.',
                '<strong>Panika pod wodą:</strong> Podpłyń od tyłu/boku, chwyć za zawór butli, ustabilizuj. Jeśli nurek wypluł automat i wstrzymuje oddech – nie wolno go gwałtownie wyciągać na powierzchnię (ryzyko urazu ciśnieniowego płuc), chyba że jest nieprzytomny.',
                '<strong>Nieprzytomny nurek:</strong> Wyciągnij na powierzchnię (kontrolując tempo, jeśli to możliwe), na powierzchni: zrzuć balast (swój i ofiary), wezwij pomoc, sprawdź oddech, holuj do brzegu/łodzi wykonując sztuczne oddychanie (jeśli to możliwe i bezpieczne).'
            ]
        },

        { type: 'info-box', style: 'warning', title: 'Pierwsza Pomoc (React Right Integration)', content: 'W przypadku podejrzenia choroby dekompresyjnej (DCS) lub urazu ciśnieniowego płuc (AGE), podanie 100% tlenu jest absolutnym priorytetem i standardem postępowania.' }
    ],
    quiz: [
        {
            question: "Czym jest stres w rozumieniu teorii nurkowania?",
            options: [
                "Tylko reakcją na zimną wodę.",
                "Rezultatem działania bodźców, których natężenie przekracza zdolność jednostki do radzenia sobie z nimi.",
                "Stanem, który zawsze prowadzi do wypadku.",
                "Zjawiskiem, które dotyczy tylko początkujących nurków."
            ],
            correctAnswer: 1
        },
        {
            question: "Jaki rodzaj stresu jest uważany za pozytywny (\"eustres\")?",
            options: [
                "Taki, który powoduje panikę.",
                "Umiarkowany poziom napięcia, który zwiększa czujność i chroni przed niebezpieczeństwem.",
                "Brak jakiegokolwiek stresu.",
                "Stres, który pojawia się po nurkowaniu."
            ],
            correctAnswer: 1
        },
        {
            question: "Co jest najczęstszą fizjologiczną przyczyną paniki pod wodą?",
            options: [
                "Hipotermia.",
                "Głód.",
                "Nagromadzenie dwutlenku węgla (CO2) w wyniku nieprawidłowego oddychania (hiperwentylacji).",
                "Zbyt duża ilość tlenu."
            ],
            correctAnswer: 2
        },
        {
            question: "Co obejmuje sekwencja właściwej reakcji na stres pod wodą?",
            options: [
                "Płyń szybko do góry, Krzycz, Machaj rękami.",
                "Zatrzymaj się, Oddychaj, Pomyśl, Działaj.",
                "Zadzwoń do DAN, Pomyśl, Oddychaj.",
                "Działaj, Pomyśl, Oddychaj, Zatrzymaj się."
            ],
            correctAnswer: 1
        },
        {
            question: "Jakie są cztery główne kategorie przyczyn stresu w nurkowaniu?",
            options: [
                "Fizyczne, Psychiczne, Sprzętowe, Środowiskowe.",
                "Tlenowe, Azotowe, Helowe, Argonowe.",
                "Poranne, Południowe, Wieczorne, Nocne.",
                "Instruktorskie, Partnerskie, Łodziowe, Bazowe."
            ],
            correctAnswer: 0
        },
        {
            question: "Presja rówieśnicza (\"peer pressure\") to przykład stresora:",
            options: [
                "Fizycznego.",
                "Środowiskowego.",
                "Psychologicznego.",
                "Sprzętowego."
            ],
            correctAnswer: 2
        },
        {
            question: "Jeśli zauważysz u partnera przed nurkowaniem zachowanie nienaturalnie wycofane lub nadmierną gadatliwość, może to świadczyć o:",
            options: [
                "Dobrym humorze.",
                "Występowaniu stresu przed nurkowaniem.",
                "Narkozie azotowej.",
                "Gotowości do zejścia pod wodę."
            ],
            correctAnswer: 1
        },
        {
            question: "Co jest głównym celem systemu partnerskiego w kontekście stresu?",
            options: [
                "Dzielenie kosztów paliwa.",
                "Pomoc w noszeniu sprzętu.",
                "Zapewnienie, że w sytuacji stresowej przynajmniej jedna osoba zachowa kontrolę i udzieli pomocy.",
                "Robienie zdjęć pod wodą."
            ],
            correctAnswer: 2
        },
        {
            question: "W przypadku zauważenia u partnera oznak paniki pod wodą (szerokie oczy, szybki oddech), pierwszym krokiem powinno być:",
            options: [
                "Natychmiastowe wyciągnięcie go na powierzchnię.",
                "Nawiązanie kontaktu wzrokowego i zasygnalizowanie \"Stop\" oraz \"Oddychaj\".",
                "Odpłynięcie, aby nie zostać uderzonym.",
                "Zgaszenie latarki."
            ],
            correctAnswer: 1
        },
        {
            question: "Jaka jest najważniejsza zasada podczas prowadzenia akcji ratunkowej?",
            options: [
                "Ratuj sprzęt za wszelką cenę.",
                "Własne bezpieczeństwo ratownika jest priorytetem.",
                "Szybkość jest ważniejsza niż bezpieczeństwo.",
                "Musisz uratować poszkodowanego bez względu na ryzyko."
            ],
            correctAnswer: 1
        },
        {
            question: "Czym jest \"cykl stresowo-hiperwentylacyjny\"?",
            options: [
                "Procedurą czyszczenia maski.",
                "Mechanizmem, w którym stres prowadzi do szybkiego oddechu, co zwiększa lęk i prowadzi do paniki.",
                "Sposobem na oszczędzanie powietrza.",
                "Metodą pływania w prądzie."
            ],
            correctAnswer: 1
        },
        {
            question: "Jeśli zgubisz partnera pod wodą, standardowa procedura nakazuje:",
            options: [
                "Szukać go do wyczerpania powietrza.",
                "Szukać przez około 1 minutę, a następnie wynurzyć się na powierzchnię.",
                "Kontynuować nurkowanie samemu.",
                "Czekać na dnie, aż partner Cię znajdzie."
            ],
            correctAnswer: 1
        },
        {
            question: "Niekontrolowane, szybkie wynurzenie spanikowanego nurka grozi:",
            options: [
                "Hipotermią.",
                "Urazem ciśnieniowym płuc (np. zator gazowy) i chorobą dekompresyjną.",
                "Narkozą azotową.",
                "Zatruciem tlenowym."
            ],
            correctAnswer: 1
        },
        {
            question: "Pierwszą pomocą w przypadku podejrzenia choroby dekompresyjnej (DCS) jest:",
            options: [
                "Podanie płynów z alkoholem.",
                "Ponowne zanurzenie nurka (rekompresja w wodzie).",
                "Podanie 100% tlenu i wezwanie służb medycznych.",
                "Masaż bolących stawów."
            ],
            correctAnswer: 2
        },
        {
            question: "Co może utrudnić akcję ratunkową?",
            options: [
                "Dobra widoczność.",
                "Posiadanie bojki.",
                "Zaplątanie w sieci, silny prąd, panika poszkodowanego.",
                "Spokojne morze."
            ],
            correctAnswer: 2
        },
        {
            question: " \"Złudne poczucie bezpieczeństwa\" może być spowodowane przez:",
            options: [
                "Posiadanie zaawansowanego sprzętu bez odpowiedniego wyszkolenia.",
                "Regularne ćwiczenie umiejętności ratowniczych.",
                "Nurkowanie w znanych miejscach.",
                "Dokładne planowanie nurkowania."
            ],
            correctAnswer: 0
        },
        {
            question: "Oznaką \"wąskiego widzenia\" (widzenia tunelowego) u nurka jest:",
            options: [
                "Skupienie się na jednym problemie/obiekcie i ignorowanie otoczenia oraz bezpieczeństwa.",
                "Używanie latarki w dzień.",
                "Patrzenie przez maskę z korekcją.",
                "Dokładne sprawdzanie manometru."
            ],
            correctAnswer: 0
        },
        {
            question: "W przypadku braku powietrza, najlepszą opcją (jeśli partner jest blisko) jest:",
            options: [
                "Awaryjne wynurzenie niezależne.",
                "Oddychanie z alternatywnego źródła powietrza partnera (dzielenie się gazem).",
                "Zrzucenie pasa balastowego na dnie.",
                "Próba oddychania z kamizelki BCD."
            ],
            correctAnswer: 1
        },
        {
            question: "Co należy zrobić z nieprzytomnym nurkiem na powierzchni, który nie oddycha?",
            options: [
                "Natychmiast zanurzyć go z powrotem.",
                "Rozpocząć wentylację (sztuczne oddychanie) i holować do brzegu/łodzi, zdejmując sprzęt w trakcie.",
                "Czekać na przyjazd karetki na środku jeziora.",
                "Tylko holować, nie próbując wentylować."
            ],
            correctAnswer: 1
        },
        {
            question: "Po każdym wypadku nurkowym należy:",
            options: [
                "Ukryć sprzęt.",
                "Sporządzić raport z wypadku i zabezpieczyć sprzęt poszkodowanego do ekspertyzy.",
                "Sprzedać sprzęt poszkodowanego.",
                "Unikać kontaktu ze służbami."
            ],
            correctAnswer: 1
        }
    ]
};
