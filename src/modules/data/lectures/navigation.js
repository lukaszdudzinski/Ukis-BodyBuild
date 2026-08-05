export const navigationLecture = {
    id: 'navigation',
    title: 'Nawigacja w Nurkowaniu – Sztuka Orientacji Podwodnej',
    readTime: '20 min',
    level: 'Advanced',
    audioSrc: 'lectures/navigation/Dlaczego_nurkowie_instynktownie_pływają_w_kółko.m4a',
    presentationSrc: 'lectures/navigation/Nawigacja_Podwodna_Sztuka_i_Nauka.pdf',
    description: 'Jak ufać przyrządom, gdy zmysły zawodzą – kompas vs. intuicja.',
    content: [
        { type: 'header', level: 3, value: 'Wstęp: Dlaczego w ogóle nawigujemy?' },
        { type: 'paragraph', value: 'Główna myśl: Nawigacja to różnica między byciem „prowadzonym” a byciem „odkrywcą” oraz sposób na pokonanie ograniczeń własnego ciała.' },
        { type: 'paragraph', value: 'Nawigacja podwodna to jedna z tych umiejętności, która najszybciej buduje pewność siebie nurka. Wielu początkujących nurków (OWD) polega w 100% na przewodniku (Dive Guide), co nazywamy syndromem „podążania za płetwami”. Nauka nawigacji zmienia ten układ, dając niezależność.' },
        { type: 'paragraph', value: 'Jest ona również fizjologiczną koniecznością. W warunkach ograniczonej widoczności, w toni lub nad jednolitym dnem, gdzie brakuje wizualnych punktów odniesienia, ludzki błędnik traci orientację przestrzenną. Co więcej, z powodu naturalnej asymetrii ciała (jedna noga lub ręka jest zawsze silniejsza, dominująca), bez pomocy przyrządów nurek nieświadomie zaczyna skręcać w jedną stronę. To zjawisko sprawia, że bez nawigacji i punktów odniesienia zawsze kończymy, pływając w kółko.' },

        { type: 'header', level: 4, value: 'Kluczowe korzyści (Dlaczego warto?):' },
        {
            type: 'list', items: [
                '<strong>Redukcja stresu:</strong> Wiedza o tym, gdzie jesteś i w którą stronę płynąć do wyjścia, eliminuje lęk przed zgubieniem się w toni.',
                '<strong>Oszczędność gazu:</strong> Mniej błądzenia to mniej zbędnych ruchów, spokojniejszy oddech i krótsze przebywanie pod wodą w poszukiwaniu liny opustowej.',
                '<strong>Efektywność planu:</strong> Możesz precyzyjnie dotrzeć do celu (np. wraku) i wrócić, maksymalizując czas denny w najciekawszym miejscu.',
                '<strong>Bezpieczeństwo partnerskie:</strong> W razie separacji z grupą wiesz, jak bezpiecznie wrócić do punktu wyjścia.'
            ]
        },

        { type: 'header', level: 3, value: 'Wyzwanie: Powierzchnia a Podwodny Świat' },
        { type: 'paragraph', value: 'Na powierzchni nawigacja jest intuicyjna – mamy słońce, budynki, wyraźny horyzont. Pod wodą środowisko działa przeciwko naszym zmysłom.' },

        { type: 'header', level: 4, value: 'Dlaczego jest to trudne? (Czynniki środowiskowe):' },
        {
            type: 'list', items: [
                '<strong>Ograniczona widoczność:</strong> Często widzimy tylko wycinek rzeczywistości. To tak, jakbyś chodził po lesie we mgle – widzisz pojedyncze drzewa, ale nie widzisz lasu. Trudno obrać daleki cel.',
                '<strong>Brak punktów odniesienia (Blue Water):</strong> W toni wodnej lub nad jednolitym piaszczystym dnem mózg traci punkty zaczepienia. Może to prowadzić do dezorientacji przestrzennej (vertigo).',
                '<strong>Trójwymiarowość:</strong> Poruszamy się w osi X, Y oraz Z (głębokość). Musisz kontrolować kierunek ORAZ pływalność jednocześnie. Zmiana głębokości często zmienia też warunki (np. prąd).',
                '<strong>Złudzenia zmysłów i refrakcja:</strong> Woda powiększa obraz (o ok. 33%) i go przybliża (o 25%). To sprawia, że ocena odległości "na oko" jest bardzo myląca. Dodatkowo nasz błędnik w warunkach braku wizualnych bodźców szybko "głupieje".'
            ]
        },

        { type: 'info-box', style: 'tip', content: '<strong>Wskazówka Instruktorska:</strong> „Wasz wewnętrzny kompas pod wodą nie działa. Jeśli czujesz, że powinieneś płynąć w lewo, a kompas pokazuje prosto – zaufaj kompasowi. Zawsze.”' },

        { type: 'header', level: 3, value: 'Rodzaje Nawigacji Podwodnej' },
        { type: 'paragraph', value: 'Wyróżniamy trzy główne metody orientacji, które wzajemnie się uzupełniają.' },

        { type: 'header', level: 4, value: 'Nawigacja Naturalna (Obserwacyjna)' },
        { type: 'paragraph', value: 'To sztuka czytania środowiska. Jest to najbardziej podstawowa, ale często niedoceniana forma.' },
        {
            type: 'list', items: [
                '<strong>Ukształtowanie dna:</strong> Zazwyczaj dno opada w kierunku głębszej wody (oddalanie się od brzegu) i wznosi się ku brzegowi.',
                '<strong>Formacje piaskowe (Ripples):</strong> Fale na powierzchni tworzą na dnie piaszczystym charakterystyczne zmarszczki. Układają się one zazwyczaj równolegle do brzegu. Płynąc w poprzek nich, płyniesz do lub od brzegu.',
                '<strong>Światło i Cienie:</strong> W słoneczny dzień woda jest jaśniejsza w kierunku słońca/powierzchni. Cienie rzucane przez skały są stałe w czasie jednego nurkowania – działają jak drogowskazy.',
                '<strong>Ruch wody (Prąd/Falowanie):</strong> Rośliny i gorgonie wyginają się zgodnie z prądem. Pamiętaj o zasadzie: nurkowanie zaczynamy pod prąd, aby powrót był łatwiejszy.'
            ]
        },

        { type: 'header', level: 4, value: 'Nawigacja Przyrządowa (Kompas)' },
        { type: 'paragraph', value: 'Niezbędna, gdy nawigacja naturalna zawodzi (noc, słaba widoczność, toń) lub gdy wymagana jest precyzja (np. poszukiwanie i wydobywanie). Daje nam obiektywny kurs magnetyczny.' },

        { type: 'image', src: 'lectures/navigation/nawigacja podwodna z kompasem.png', alt: 'Nawigacja Podwodna z Kompasem - Infografika' },

        { type: 'header', level: 4, value: 'Nawigacja Mieszana (Hybrydowa)' },
        { type: 'paragraph', value: 'To „Złoty Standard” SSI. Polega na łączeniu wskazań kompasu z obserwacją naturalnych punktów.' },
        { type: 'paragraph', value: '<em>Przykład: Ustawiasz kompas na cel, ale zapamiętujesz, że płyniesz wzdłuż ściany rafy, którą masz po prawej stronie. To podwójna weryfikacja.</em>' },

        { type: 'image', src: 'lectures/navigation/Nawigacja hybrydowa.png', alt: 'Nawigacja Hybrydowa - Infografika' },

        { type: 'header', level: 3, value: 'Kompas: Twoje Główne Narzędzie' },
        { type: 'paragraph', value: 'Kompas to prosty, ale precyzyjny instrument. Musimy znać jego budowę, by unikać błędów.' },

        { type: 'header', level: 4, value: 'Budowa Kompasu Klasycznego (Analogowego):' },
        {
            type: 'list', items: [
                '<strong>Igła magnetyczna (Róża wiatrów):</strong> Zanurzona w oleju (dla stabilizacji i odporności na ciśnienie). Zawsze wskazuje Północ Magnetyczną.',
                '<strong>Obrotowy pierścień (Bezel):</strong> Ruchomy element z indeksami (szczerbinką/widełkami). Służy do „zapamiętania” naszego kursu.',
                '<strong>Linia kierunkowa (Lubber Line):</strong> Czerwona lub czarna linia biegnąca przez środek kompasu. To najważniejszy element – wskazuje kierunek Twojego płynięcia. Musi być przedłużeniem osi Twojego ciała.',
                '<strong>Okienko boczne:</strong> Pozwala na precyzyjny odczyt numeryczny azymutu, gdy trzymamy kompas w pozycji "celowania".'
            ]
        },

        { type: 'header', level: 3, value: 'Zasada Działania i Technika – Jak nie zbłądzić?' },
        { type: 'paragraph', value: 'Posiadanie kompasu to nie wszystko. Trzeba go umieć użyć. Większość błędów nawigacyjnych wynika ze złej techniki, a nie awarii sprzętu.' },

        { type: 'header', level: 4, value: 'Kluczowe zasady poprawnej nawigacji:' },
        { type: 'paragraph', value: '<strong>Poziomowanie:</strong> Klasyczny kompas musi być trzymany idealnie poziomo. Przechylenie go spowoduje zablokowanie igły o obudowę.' },

        { type: 'paragraph', value: '<strong>Pozycja Ciała i Linia Centralna:</strong>' },
        {
            type: 'list', items: [
                'Linia kierunkowa kompasu musi być idealnie na środku Twojego ciała.',
                'Łokcie przy ciele, obie ręce trzymają kompas (lub konsolę).',
                'UWAGA: Nie skręcaj nadgarstkiem! Jeśli chcesz zmienić kierunek, obróć całe ciało. Kompas jest "przyspawany" do Twojej klatki piersiowej.'
            ]
        },

        { type: 'header', level: 4, value: 'Ustalanie Kursu (Setting the Heading):' },
        {
            type: 'list', ordered: true, items: [
                'Wyceluj linią kierunkową w cel.',
                'Obróć pierścień (bezel) tak, aby „widełki” (indeksy) objęły igłę północy.',
                'Płyń tak, aby igła cały czas była w widełkach.'
            ]
        },

        { type: 'header', level: 4, value: 'Kurs Powrotny (Reciprocal Heading):' },
        { type: 'paragraph', value: 'Aby wrócić po tej samej linii (o 180 stopni), obróć się tak, aby igła północy znalazła się dokładnie naprzeciwko widełek (lub na dolnym znaczniku).' },

        { type: 'header', level: 3, value: 'Szacowanie Odległości (Brakujące Ogniwo)' },
        { type: 'paragraph', value: 'Nawigacja to Kierunek + Odległość. Sam kierunek to za mało. Jak mierzymy dystans pod wodą?' },
        {
            type: 'list', items: [
                '<strong>Cykle kopnięć (Kick Cycles):</strong> Najpopularniejsza metoda. Jeden cykl to ruch lewej i prawej nogi (liczymy za każdym razem, gdy np. prawa noga idzie w dół). Wymaga kalibracji (np. ile cykli zajmuje Ci przepłynięcie 10 metrów).',
                '<strong>Czas:</strong> Mierzymy czas płynięcia w jedną stronę. Metoda łatwa, ale niedokładna przy zmiennym prądzie (pod prąd płyniesz wolniej, z prądem szybciej).',
                '<strong>Ciśnienie w butli (Zużycie gazu):</strong> Np. płyniemy do zużycia 50 barów, potem wracamy. Metoda bezpieczna dla zapasu gazu, ale mało precyzyjna nawigacyjnie (zużycie zależy od głębokości i wysiłku).'
            ]
        },

        { type: 'header', level: 3, value: 'Podsumowanie' },
        { type: 'paragraph', value: 'Pamiętaj o dewiacji magnetycznej – wraki, metalowe elementy czy włączone latarki zbyt blisko kompasu mogą zakłócić odczyt. Nawigacja to proces ciągły. Wymaga podzielności uwagi: kontrolujesz pływalność, partnera, głębokość i kompas.' },
        { type: 'paragraph', value: 'Dobra nawigacja to spokój ducha. Kiedy wiesz, gdzie jesteś, nurkowanie staje się czystą przyjemnością.' }
    ],
    quiz: [
        {
            question: "Co jest głównym celem stosowania nawigacji w nurkowaniu rekreacyjnym?",
            options: [
                "Zwiększenie zużycia powietrza poprzez dłuższe pływanie.",
                "Zwiększenie bezpieczeństwa, oszczędność gazu i pewność powrotu do punktu wyjścia.",
                "Bicie rekordów głębokości.",
                "Eliminacja konieczności używania systemu partnerskiego."
            ],
            correctIndex: 1,
            explanation: "Nawigacja zwiększa bezpieczeństwo (brak zgubienia się), oszczędza gaz (brak zbędnego błądzenia) i daje pewność."
        },
        {
            question: "Jaką funkcję pełni 'linia kierunkowa' (lub linia wiary) na obudowie kompasu?",
            options: [
                "Wskazuje zawsze północ magnetyczną.",
                "Wskazuje poziom naładowania baterii w kompasach cyfrowych.",
                "Musi być skierowana w stronę, w którą nurek zamierza płynąć (oś ciała nurka).",
                "Służy tylko do ozdoby obudowy."
            ],
            correctIndex: 2,
            explanation: "Linia kierunkowa wyznacza Twój kierunek marszu/płynięcia. Musi być przedłużeniem osi Twojego ciała."
        },
        {
            question: "Co to jest „kurs powrotny” (reciprocal heading) w nawigacji kompasowej?",
            options: [
                "Kurs różniący się od pierwotnego o 90 stopni.",
                "Kurs różniący się od pierwotnego o 180 stopni (kierunek przeciwny).",
                "Kurs, który zawsze prowadzi na północ.",
                "Kurs wyznaczany tylko przez komputery nurkowe."
            ],
            correctIndex: 1,
            explanation: "Kurs powrotny to zwrot o 180 stopni, pozwalający wrócić tą samą drogą."
        },
        {
            question: "Jakie naturalne zjawisko na piaszczystym dnie może pomóc w nawigacji względem brzegu?",
            options: [
                "Kolor piasku, który zawsze jest ciemniejszy przy brzegu.",
                "Marszczenie piasku (riplemarki), które zazwyczaj układa się równolegle do linii brzegowej.",
                "Obecność muszli, które zawsze wskazują północ.",
                "Temperatura piasku."
            ],
            correctIndex: 1,
            explanation: "Fale tworzą zmarszczki (riplemarki) równolegle do brzegu. Płynąc prostopadle do nich, płyniesz w stronę brzegu lub w głąb morza."
        },
        {
            question: "Czym jest „nawigacja mieszana”?",
            options: [
                "Używaniem dwóch kompasów jednocześnie.",
                "Łączeniem nawigacji naturalnej (obserwacja otoczenia) z nawigacją przyrządową (kompas).",
                "Nawigowaniem na zmianę przez partnerów nurkowych.",
                "Nawigowaniem tylko przy użyciu zegarka i głębokościomierza."
            ],
            correctIndex: 1,
            explanation: "To łączenie wskazań kompasu z obserwacją punktów charakterystycznych."
        },
        {
            question: "Co może spowodować błąd we wskazaniach kompasu zwany dewiacją?",
            options: [
                "Zbyt głębokie zanurzenie.",
                "Obecność dużych metalowych obiektów (np. wraków) lub działających latarek blisko kompasu.",
                "Zimna woda.",
                "Silny prąd morski."
            ],
            correctIndex: 1,
            explanation: "Metalowe obiekty i pola magnetyczne (np. od elektroniki latarki) zakłócają igłę kompasu."
        },
        {
            question: "Jaka jest główna zaleta cyfrowego kompasu wbudowanego w komputer nurkowy w porównaniu do tradycyjnego analogowego?",
            options: [
                "Nie wymaga zasilania.",
                "Jest tańszy w zakupie.",
                "Często posiada kompensację przechyłów, co pozwala na dokładny odczyt nawet gdy ręka nie jest idealnie poziomo.",
                "Zawsze świeci jaśniej niż latarka."
            ],
            correctIndex: 2,
            explanation: "Kompasy cyfrowe często działają poprawnie nawet przy znacznym przechyle (tilt compensation)."
        },
        {
            question: "W jaki sposób nurek zazwyczaj szacuje przebytą odległość pod wodą bez użycia elektroniki?",
            options: [
                "Licząc oddechy.",
                "Licząc cykle kopnięć płetwami lub mierząc czas płynięcia w stałym tempie.",
                "Obserwując zmiany temperatury wody.",
                "Licząc napotkane ryby."
            ],
            correctIndex: 1,
            explanation: "Liczenie cykli kopnięć (lub czasu) to standardowe metody pomiaru dystansu."
        },
        {
            question: "Dlaczego podczas korzystania z kompasu analogowego ważne jest trzymanie go poziomo?",
            options: [
                "Aby woda nie wylała się z obudowy.",
                "Aby tarcza (róża kompasowa) mogła swobodnie się obracać i nie zablokowała się o obudowę.",
                "Aby nurek wyglądał bardziej profesjonalnie.",
                "Aby słońce lepiej oświetlało tarczę."
            ],
            correctIndex: 1,
            explanation: "Przechylenie powoduje ocieranie się igły/tarczy o obudowę i blokowanie jej ruchu."
        },
        {
            question: "Co jest najtrudniejszym elementem w nauce nawigacji przyrządowej, gdy nurek traci orientację w toni?",
            options: [
                "Odczytanie cyfr na tarczy.",
                "Zaufanie wskazaniom przyrządu ponad własne (często błędne) poczucie kierunku.",
                "Przekręcenie pierścienia obrotowego.",
                "Włączenie podświetlenia."
            ],
            correctIndex: 1,
            explanation: "Zaufanie przyrządom wbrew błędnikowi (intuicji) jest najtrudniejsze, ale kluczowe dla uniknięcia dezorientacji."
        }
    ]
};
