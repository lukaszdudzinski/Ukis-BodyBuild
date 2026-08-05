export const p1TheoryLecture = {
    id: 'p1-theory',
    title: 'OWD/P1 (Open Water Diver)',
    description: 'Kompendium wiedzy kursu podstawowego: Sprzęt, Fizyka, Fizjologia, Środowisko i Technika.',
    audioSrc: 'lectures/p1-theory/Odcinek_1.m4a',
    presentationSrc: 'lectures/p1-theory/Underwater_Operator_Briefing.pdf',
    courseBadge: 'Kurs Podstawowy',
    quizBadge: '40 pytań',
    content: [
        // ROZDZIAŁ 1: SPRZĘT PODSTAWOWY (ABC)
        { type: 'header', level: 2, value: 'ROZDZIAŁ 1: SPRZĘT PODSTAWOWY (ABC)' },

        { type: 'paragraph', value: 'Sprzęt podstawowy, znany jako ABC, to fundament wyposażenia każdego płetwonurka. Składa się z maski, fajki i płetw. Choć wydaje się prosty, jego właściwy dobór i zrozumienie budowy są kluczowe dla komfortu i bezpieczeństwa pod wodą.' },

        { type: 'header', level: 3, value: '1.1 Maska Nurkowa' },
        { type: 'paragraph', value: 'Ludzkie oko jest przystosowane do widzenia w powietrzu. W wodzie, która ma inną gęstość optyczną, światło załamuje się inaczej, co powoduje, że obraz staje się nieostry. Maska tworzy przed oczami przestrzeń powietrzną, która przywraca ostrość widzenia.' },
        { type: 'paragraph', value: 'Budowa maski:' },
        {
            type: 'list', items: [
                '<strong>Szyba (Soczewka):</strong> Musi być wykonana ze szkła hartowanego (oznaczenie Tempered lub Safety Glass). Jest to wymóg bezpieczeństwa – w razie stłuczenia szkło to rozpada się na drobne, nieostre kawałki, co chroni oczy przed poważnym urazem. W maskach rekreacyjnych nie stosuje się zwykłego szkła ani plastiku (który łatwo się rysuje). Maski mogą być jednoszybowe (szerokie pole widzenia, brak ramki na środku) lub dwuszybowe (mniejsza pojemność, możliwość wstawienia szkieł korekcyjnych).',
                '<strong>Kołnierz uszczelniający (Fartuch):</strong> Wykonany z wysokiej jakości, hipoalergicznego silikonu (dawniej z gumy). Silikon jest trwały, elastyczny i odporny na działanie słońca oraz wody morskiej. Występuje w wersji przezroczystej (daje poczucie przestrzeni, ale może powodować refleksy świetlne) lub czarnej/kolorowej (ogranicza pole widzenia, co ułatwia skupienie – preferowane przez fotografów). Kołnierz musi posiadać podwójną krawędź uszczelniającą (wewnętrzny i zewnętrzny płaszcz), co znacznie zwiększa szczelność maski.',
                '<strong>Ramka:</strong> Element konstrukcyjny (zazwyczaj z tworzywa), w którym osadzona jest szyba i do którego przymocowany jest kołnierz. Nowoczesne maski typu frameless (bezramkowe) mają szybę wtopioną bezpośrednio w silikon, co zmniejsza ich wagę i objętość oraz przybliża szybę do oczu, zwiększając pole widzenia.',
                '<strong>Kieszeń na nos (Noski):</strong> Elastyczna część kołnierza osłaniająca nos. Jest to niezbędny element maski nurkowej (w odróżnieniu od okularków pływackich). Umożliwia ona zaciśnięcie nosa palcami w celu wyrównania ciśnienia w uszach (manewr Valsalvy) oraz wyrównanie ciśnienia wewnątrz samej maski poprzez wydech nosem podczas zanurzania (zapobiega to urazowi ciśnieniowemu twarzy/oczu, tzw. mask squeeze).',
                '<strong>Pasek i klamry:</strong> Pasek (najczęściej silikonowy, rozdwojony w części potylicznej dla stabilności) utrzymuje maskę na głowie. Klamry powinny umożliwiać łatwą i precyzyjną regulację długości paska, nawet w grubych rękawicach. Ważne jest, aby pasek nie był zbyt mocno dociągnięty – szczelność zapewnia ciśnienie wody dociskające maskę do twarzy, a nie siła naciągu paska.'
            ]
        },

        { type: 'header', level: 3, value: '1.2 Fajka (Rurka oddechowa)' },
        { type: 'image', src: 'lectures/p1-theory/owd_1.png', alt: 'Infografika Sprzętu', caption: 'Przegląd Podstawowego Sprzętu ABC' },
        { type: 'paragraph', value: 'Fajka pozwala na oddychanie powietrzem atmosferycznym, gdy twarz nurka jest zanurzona pod powierzchnią wody. Służy do oszczędzania powietrza z butli podczas płynięcia po powierzchni do miejsca zanurzenia lub powrotu na brzeg/łódź.' },
        { type: 'paragraph', value: 'Budowa i rodzaje:' },
        {
            type: 'list', items: [
                '<strong>Rurka:</strong> Powinna mieć odpowiednią średnicę (ok. 2 cm) i długość (ok. 30-35 cm). Zbyt długa lub szeroka rurka zwiększa tzw. przestrzeń martwą (objętość powietrza, która nie bierze udziału w wymianie gazowej), co może prowadzić do gromadzenia się dwutlenku węgla i duszności. Zbyt wąska rurka stawia duży opór oddechowy.',
                '<strong>Ustnik:</strong> Wykonany z miękkiego silikonu, anatomicznie dopasowany, aby nie męczyć szczęki.',
                '<strong>Zawór wylotowy (dolny):</strong> Umieszczony pod ustnikiem jednokierunkowy zawór grzybkowy. Ułatwia oczyszczanie fajki z wody – woda spływa grawitacyjnie w dół i jest wypychana przy lekkim wydechu, zamiast być wypychana całą długością rurki do góry.',
                '<strong>Zabezpieczenie przed falą (Labirynt/Deflektor):</strong> Element na szczycie fajki, który ogranicza wlewanie się wody do środka przy zafalowaniu (fajki "półsuche"). Istnieją też fajki z zaworem zamykającym dopływ wody przy pełnym zanurzeniu (tzw. fajki "suche"), ale są one mniej popularne w nurkowaniu sprzętowym ze względu na większą awaryjność mechanizmu.',
                '<strong>Zaczep (Klips):</strong> Służy do przymocowania fajki do paska maski. Fajkę nosimy zawsze po lewej stronie głowy, ponieważ automat oddechowy podawany jest z prawej strony.'
            ]
        },

        { type: 'header', level: 3, value: '1.3 Płetwy' },
        { type: 'paragraph', value: 'Większość napędu w nurkowaniu pochodzi z nóg. Płetwy zwiększają powierzchnię stopy, umożliwiając efektywne odpychanie się od wody.' },
        { type: 'paragraph', value: 'Rodzaje płetw:' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Płetwy kaloszowe:</strong> Zakładane na gołą stopę (ewentualnie w cienkiej skarpecie neoprenowej). Posiadają pełny kalosz obejmujący piętę. Są lżejsze i używane głównie w ciepłych wodach oraz na basenie.',
                '<strong>Płetwy paskowe:</strong> Posiadają otwartą piętę i regulowany pasek (lub sprężynę). Są przeznaczone do używania wyłącznie z butami nurkowymi (neoprenowymi butami z twardą podeszwą). Buty te zapewniają komfort termiczny i ochronę stopy podczas chodzenia po brzegu. Jest to standard w nurkowaniu w polskich wodach i większości nurkowań rekreacyjnych.'
            ]
        },
        { type: 'paragraph', value: '<strong>Budowa pióra:</strong> Pióra płetw mogą być wykonane z gumy, plastiku lub kompozytów. Często posiadają dysze, kanały przepływowe lub są wykonane z materiałów o różnej twardości, aby zoptymalizować przepływ wody i zmniejszyć wysiłek mięśni przy zachowaniu dużej siły ciągu.' },

        { type: 'paragraph', value: '<hr>' },

        // ROZDZIAŁ 2: FIZYKA NURKOWANIA
        { type: 'header', level: 2, value: 'ROZDZIAŁ 2: FIZYKA NURKOWANIA' },
        { type: 'paragraph', value: 'Zrozumienie fizyki jest kluczem do bezpieczeństwa. Woda jest środowiskiem o gęstości około 800 razy większej niż powietrze, co drastycznie zmienia oddziaływanie na ludzkie ciało.' },

        { type: 'header', level: 3, value: '2.1 Ciśnienie' },
        { type: 'paragraph', value: 'Ciśnienie to siła nacisku działająca na jednostkę powierzchni. W nurkowaniu operujemy trzema rodzajami ciśnienia:' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Ciśnienie atmosferyczne (barometryczne):</strong> Ciśnienie wywierane przez słup powietrza nad nami. Na poziomie morza przyjmujemy, że wynosi ono 1 bar (1 at).',
                '<strong>Ciśnienie hydrostatyczne (słupa wody):</strong> Ciśnienie wywierane przez wodę. Ze względu na ciężar wody, ciśnienie rośnie bardzo szybko. Każde 10 metrów słupa wody (słonej) to dodatkowy 1 bar ciśnienia.',
                '<strong>Ciśnienie całkowite (absolutne/bezwzględne):</strong> To suma ciśnienia atmosferycznego i hydrostatycznego. To właśnie to ciśnienie oddziałuje na nurka i jego sprzęt.'
            ]
        },
        { type: 'paragraph', value: 'Skala ciśnienia w nurkowaniu:' },
        {
            type: 'list', items: [
                'Głębokość 0 m (powierzchnia) = 1 bar atmosferyczny + 0 bar wodnych = 1 bar (absolutny).',
                'Głębokość 10 m = 1 bar atm. + 1 bar wodny = 2 bary.',
                'Głębokość 20 m = 1 bar atm. + 2 bary wodne = 3 bary.',
                'Głębokość 30 m = 1 bar atm. + 3 bary wodne = 4 bary.'
            ]
        },

        { type: 'header', level: 3, value: '2.2 Prawo Boyle’a-Mariotte’a' },
        { type: 'image', src: 'lectures/p1-theory/owd_2.png', alt: 'Prawo Boyle\'a', caption: 'Rozprężanie i Kurczenie Gazów' },
        { type: 'paragraph', value: 'To fundamentalne prawo dla nurków. Mówi ono, że w stałej temperaturze objętość danej masy gazu jest odwrotnie proporcjonalna do ciśnienia.' },
        {
            type: 'list', items: [
                'Jeśli ciśnienie rośnie (zanurzanie), objętość gazu maleje.',
                'Jeśli ciśnienie maleje (wynurzanie), objętość gazu rośnie.'
            ]
        },
        { type: 'paragraph', value: 'Praktyczne skutki dla nurka:' },
        {
            type: 'list', items: [
                'Podczas zanurzania powietrze w przestrzeniach zamkniętych (ucho środkowe, zatoki, maska, skafander suchy) kurczy się. Jeśli nurek nie doda tam powietrza (wyrównanie ciśnienia), dojdzie do zassania tkanek i urazu (barotrauma ucisku).',
                'Podczas wynurzania powietrze w płucach i kamizelce (BCD) rozpręża się. Nurek musi oddychać spokojnie i ciągle, aby nadmiar powietrza mógł uciec z płuc. Wstrzymanie oddechu przy wynurzaniu grozi rozerwaniem pęcherzyków płucnych (uraz ciśnieniowy płuc), co jest stanem bezpośredniego zagrożenia życia.',
                'Zmiany objętości są najbardziej drastyczne płytko. Pomiędzy powierzchnią (1 bar) a 10 metrami (2 bary) ciśnienie podwaja się, a objętość gazu maleje o połowę (50%). Dlatego najtrudniej utrzymać pływalność i najłatwiej o uraz w strefie 0-10 metrów.'
            ]
        },

        { type: 'header', level: 3, value: '2.3 Prawo Archimedesa i Pływalność' },
        { type: 'paragraph', value: 'Prawo to mówi, że na ciało zanurzone w cieczy działa siła wyporu skierowana ku górze, równa ciężarowi cieczy wypartej przez to ciało. W nurkowaniu rozróżniamy trzy stany pływalności:' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Pływalność dodatnia:</strong> Siła wyporu jest większa niż ciężar nurka ze sprzętem. Nurek unosi się na powierzchni.',
                '<strong>Pływalność ujemna:</strong> Ciężar nurka jest większy niż siła wyporu. Nurek tonie (opada na dno).',
                '<strong>Pływalność neutralna (zerowa):</strong> Siła wyporu równoważy ciężar. Nurek "lewituje" w toni wodnej, nie opadając ani nie wypływając. Jest to stan pożądany podczas samego nurkowania.'
            ]
        },
        { type: 'paragraph', value: 'Do kontroli pływalności służy kamizelka ratowniczo-wypornościowa (KRW/BCD) oraz płuca nurka. Dodając powietrze do kamizelki, zwiększamy objętość (wypieramy więcej wody) i zyskujemy pływalność. Wypuszczając powietrze – tracimy ją.' },

        { type: 'paragraph', value: '<hr>' },

        // ROZDZIAŁ 3: FIZJOLOGIA I PATOFIZJOLOGIA NURKOWANIA
        { type: 'header', level: 2, value: 'ROZDZIAŁ 3: FIZJOLOGIA I PATOFIZJOLOGIA NURKOWANIA' },
        { type: 'paragraph', value: 'Organizm człowieka reaguje na zmiany ciśnienia i składników oddechowych w sposób specyficzny. Zrozumienie tych mechanizmów pozwala unikać chorób nurkowych.' },

        { type: 'header', level: 3, value: '3.1 Urazy Ciśnieniowe (Barotraumy)' },
        { type: 'paragraph', value: 'Są to uszkodzenia tkanek wynikające z różnicy ciśnień między gazem wewnątrz ciała (lub przy ciele) a ciśnieniem otoczenia.' },
        { type: 'paragraph', value: '<strong>A. Barotraumy Ucisku (przy zanurzaniu):</strong> Powstają, gdy nurek nie wyrównuje ciśnienia w przestrzeniach powietrznych w miarę wzrostu ciśnienia otoczenia (zgodnie z prawem Boyle’a objętość gazu maleje, tworząc podciśnienie).' },
        { type: 'image', src: 'lectures/p1-theory/owd_3.png', alt: 'Barotrauma Ucha', caption: 'Urazy Ciśnieniowe Ucha Środkowego' },
        {
            type: 'list', items: [
                '<strong>Ucho środkowe:</strong> Najczęstszy problem. Błona bębenkowa jest zasysana do wewnątrz, co powoduje ból. Brak wyrównania (przedmuchania) może prowadzić do pęknięcia błony i zalania ucha środkowego zimną wodą, co skutkuje gwałtownymi zawrotami głowy i wymiotami pod wodą.',
                '<strong>Zatoki:</strong> Jeśli ujścia zatok są niedrożne (katar, alergia, polipy), powietrze w nich uwięzione kurczy się, zasysając błonę śluzową. Objawia się to silnym bólem czoła lub szczęki i krwawieniem z nosa po wynurzeniu.',
                '<strong>Maska (Squeeze maski):</strong> Niewydmuchanie nosa do maski podczas zanurzania powoduje przyssanie jej do twarzy. Może to skutkować pęknięciem naczynek w oczach (czerwone oczy) i siniakami na twarzy.'
            ]
        },
        { type: 'paragraph', value: '<strong>B. Barotraumy Rozprężeniowe (przy wynurzaniu):</strong> Wynikają z rozszerzania się gazów przy spadku ciśnienia.' },
        {
            type: 'list', items: [
                '<strong>Uraz ciśnieniowy płuc (Barotrauma płuc):</strong> Najpoważniejszy uraz. Występuje, gdy nurek wstrzyma oddech podczas wynurzania. Płuca mają ograniczoną elastyczność. Nadmiar powietrza rozrywa pęcherzyki płucne. Gaz może dostać się do jamy opłucnej (odma opłucnowa), śródpiersia (odma śródpiersiowa) lub bezpośrednio do krwiobiegu (Tętniczy Zator Gazowy - AGE). Zator gazowy blokuje dopływ krwi do mózgu, co prowadzi do utraty przytomności, paraliżu i śmierci.'
            ]
        },
        { type: 'info-box', style: 'warning', content: '<strong>Zasada:</strong> W przypadku każdego awaryjnego wynurzania należy wydychać powietrze w sposób ciągły, wydając dźwięk (np. "ahhh").' },

        { type: 'header', level: 3, value: '3.2 Choroby związane z gazami' },
        { type: 'paragraph', value: '<strong>A. Narkoza Azotowa (Ekstaza Głębin):</strong> Azot, który jest głównym składnikiem powietrza (78%), pod zwiększonym ciśnieniem parcjalnym działa na układ nerwowy jak środek odurzający/anestetyczny. Objawy zaczynają być odczuwalne zazwyczaj poniżej 30 metrów głębokości.' },
        {
            type: 'list', items: [
                '<strong>Objawy:</strong> Euforia, lęk, spowolnienie reakcji, zawężenie pola widzenia, błędna ocena sytuacji, utrata koordynacji. Stan ten przypomina upojenie alkoholowe.',
                '<strong>Postępowanie:</strong> Natychmiastowe wynurzenie się na mniejszą głębokość. Objawy ustępują od razu po zmniejszeniu ciśnienia i nie pozostawiają trwałych skutków (poza amnezją dotyczącą zdarzenia).'
            ]
        },
        { type: 'paragraph', value: '<strong>B. Choroba Dekompresyjna (DCS - Decompression Sickness):</strong> Podczas nurkowania, pod wpływem zwiększonego ciśnienia, azot z powietrza oddechowego rozpuszcza się w tkankach organizmu (zgodnie z prawem Henry’ego). Im głębiej i dłużej nurkujemy, tym więcej azotu się gromadzi (saturacja). Podczas wynurzania ciśnienie spada i azot chce opuścić tkanki (desaturacja).' },
        {
            type: 'list', items: [
                '<strong>Mechanizm:</strong> Jeśli wynurzanie jest powolne, azot jest transportowany krwią do płuc i wydychany. Jeśli wynurzanie jest zbyt szybkie, azot nie zdąży się wydostać w formie rozpuszczonej i tworzy pęcherzyki gazu bezpośrednio w tkankach i krwi (efekt otwartej butelki szampana).',
                '<strong>Objawy:</strong> Mogą wystąpić od 15 minut do 24 godzin po nurkowaniu.',
                'Typ I (Łagodny): Bóle stawów i mięśni, wysypka skórna, świąd ("mrowienie").',
                'Typ II (Poważny): Objawy neurologiczne (drętwienia, paraliż, utrata czucia), duszność (zatory w płucach), wstrząs.',
                '<strong>Zapobieganie:</strong> Przestrzeganie limitów bezdekompresyjnych (tabel/komputera), przestrzeganie prędkości wynurzania (max. 10 m/min) oraz wykonywanie Przystanku Bezpieczeństwa (3-5 min na 5 m).'
            ]
        },

        { type: 'header', level: 3, value: '3.3 Hipotermia (Wychłodzenie)' },
        { type: 'paragraph', value: 'Woda przewodzi ciepło około 25 razy szybciej niż powietrze. Nawet w wodzie o temperaturze 24°C nurek bez skafandra po pewnym czasie ulegnie wychłodzeniu.' },
        {
            type: 'list', items: [
                '<strong>Objawy:</strong> Dreszcze (pierwszy sygnał obronny), gęsia skórka, zasinienie ust, drętwienie palców, apatia, utrata koordynacji.',
                '<strong>Postępowanie:</strong> Przerwanie nurkowania przy pierwszych dreszczach. Ogrzanie po wyjściu (suche ubranie, ciepłe napoje). Ignorowanie dreszczy prowadzi do głębokiej hipotermii, która jest stanem zagrażającym życiu i może prowadzić do utonięcia.'
            ]
        },

        { type: 'paragraph', value: '<hr>' },
        // ROZDZIAŁ 4: RYS HISTORYCZNY NURKOWANIA
        {
            type: 'html', value: `
            <div class="lecture-audio-wrapper" style="margin: 20px 0; text-align: center; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                <p style="margin-bottom: 8px; font-weight: bold; color: var(--color-text-primary);">🎧 Część 2: Historia i Środowisko Wodne (Rozdziały 4-5)</p>
                <audio controls style="width: 100%; max-width: 400px; height: 40px;">
                    <source src="lectures/p1-theory/Odcinek_2.m4a" type="audio/mp4">
                    Twoja przeglądarka nie obsługuje elementu audio.
                </audio>
            </div>
        `},
        { type: 'header', level: 2, value: 'ROZDZIAŁ 4: RYS HISTORYCZNY NURKOWANIA' },
        { type: 'paragraph', value: 'Historia podboju głębin to opowieść o dążeniu człowieka do uniezależnienia się od powierzchni i wydłużenia czasu przebywania pod wodą.' },

        { type: 'header', level: 3, value: '4.1 Od starożytności do dzwonów nurkowych' },
        { type: 'paragraph', value: 'Próby penetracji środowiska wodnego sięgają tysięcy lat wstecz. Starożytni nurkowie, poławiacze gąbek czy pereł, polegali wyłącznie na pojemności własnych płuc, wykorzystując czasem prymitywne rurki z trzciny do oddychania tuż pod powierzchnią. Z czasem zaczęto eksperymentować z urządzeniami magazynującymi powietrze, takimi jak dzwony nurkowe. Były to otwarte od dołu naczynia opuszczane pod wodę, w których uwięzione powietrze pozwalało na krótki pobyt i pracę na dnie. Pierwsze wzmianki o takich konstrukcjach powiązane są z Aleksandrem Wielkim (IV w. p.n.e.), a ich udoskonalone wersje stosowano w pracach inżynieryjnych aż do XVIII wieku.' },

        { type: 'header', level: 3, value: '4.2 Era hełmów klasycznych' },
        { type: 'paragraph', value: 'Prawdziwy przełom w pracach podwodnych nastąpił w XIX wieku wraz z wynalezieniem klasycznego skafandra nurkowego (tzw. "ciężkiego sprzętu"). Nurek ubrany był w gumowy skafander i miedziany hełm, do którego powietrze tłoczono wężem z powierzchni za pomocą pomp. System ten zapewniał nieograniczony czas pracy, ale wiązał nurka "pępowiną" z powierzchnią, drastycznie ograniczając jego swobodę ruchów i zasięg.' },

        { type: 'header', level: 3, value: '4.3 Rewolucja Cousteau-Gagnana (1943)' },
        { type: 'paragraph', value: 'Kamieniem milowym dla nurkowania rekreacyjnego, jakie znamy dzisiaj, był rok 1943. Wtedy to we Francji, oficer marynarki Jacques-Yves Cousteau oraz inżynier Émile Gagnan skonstruowali pierwszy w pełni automatyczny, bezpieczny automat oddechowy na sprężone powietrze, znany jako "Aqualung".' },
        { type: 'image', src: 'lectures/p1-theory/owd_4.png', alt: 'Historia Nurkowania', caption: 'Rozwój Autonomicznego Sprzętu SCUBA' },
        { type: 'paragraph', value: 'Urządzenie to redukowało wysokie ciśnienie z butli do ciśnienia otoczenia dokładnie w momencie wdechu nurka (stąd nazwa "automat na żądanie"). Wynalazek ten uwolnił człowieka od węży powierzchniowych, dając mu pełną autonomię i możliwość swobodnego poruszania się w trójwymiarowej przestrzeni wodnej (SCUBA – Self Contained Underwater Breathing Apparatus).' },

        { type: 'header', level: 3, value: '4.4 Nurkowanie w Polsce' },
        { type: 'paragraph', value: 'W Polsce rozwój nurkowania swobodnego rozpoczął się w połowie lat 50. XX wieku. W 1955 roku sprowadzono do kraju pierwsze trzy komplety sprzętu typu "Aqualung". Przełomowym momentem był rok 1956, kiedy to przy Polskim Towarzystwie Turystyczno-Krajoznawczym (PTTK) powstała Komisja Turystyki Podwodnej (obecnie Komisja Działalności Podwodnej – KDP). W tym samym roku założono pierwsze legendarne kluby: Warszawski Klub Płetwonurków oraz Poznański Klub Płetwonurków "Akwanauta". To właśnie KDP PTTK, będąca federacją członkowską światowej konfederacji CMAS, stworzyła w Polsce spójny system szkolenia, z którego materiałów korzystasz.' },

        { type: 'paragraph', value: '<hr>' },

        // ROZDZIAŁ 5: ŚRODOWISKO WODNE
        { type: 'header', level: 2, value: 'ROZDZIAŁ 5: ŚRODOWISKO WODNE' },
        { type: 'paragraph', value: 'Jako nurek wkraczasz do ekosystemu, który rządzi się swoimi prawami fizycznymi i biologicznymi. Zrozumienie budowy zbiorników wodnych, zwłaszcza jezior (w których najczęściej odbywa się szkolenie w Polsce), jest kluczowe dla bezpieczeństwa i komfortu.' },

        { type: 'header', level: 3, value: '5.1 Charakterystyka wód jeziornych' },
        { type: 'paragraph', value: 'Jeziora w naszej strefie klimatycznej podlegają cyklicznym zmianom termicznym w ciągu roku. Woda ma największą gęstość w temperaturze +4°C, co decyduje o tym, jak układają się jej warstwy.' },
        { type: 'paragraph', value: 'Wyróżniamy dwa okresy cyrkulacji (mieszania się wód) – wiosną i jesienią, kiedy woda w całym jeziorze ma wyrównaną temperaturę i jest natleniona. Pomiędzy nimi występują okresy stagnacji (letniej i zimowej), kiedy woda dzieli się na stabilne warstwy.' },

        { type: 'header', level: 3, value: '5.2 Stratyfikacja termiczna latem (Uwarstwienie)' },
        { type: 'paragraph', value: 'Podczas stagnacji letniej, w głębokich jeziorach woda dzieli się na trzy wyraźne strefy:' },
        { type: 'image', src: 'lectures/p1-theory/owd_5.png', alt: 'Profil Termiczny Jeziora', caption: 'Warstwienie Wód w Jeziorze Latem' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Epilimnion (Warstwa powierzchniowa):</strong> To górna, najcieplejsza warstwa wody, nagrzewana przez słońce i mieszana przez wiatr. Jest to strefa bogata w życie, światło i roślinność. Temperatura w tej warstwie jest w miarę wyrównana.',
                '<strong>Metalimnion (Termoklina / Warstwa skokowa):</strong> Warstwa przejściowa znajdująca się poniżej epilimnionu. Charakteryzuje się gwałtownym spadkiem temperatury wraz ze wzrostem głębokości (nawet o kilka stopni na metr).',
                '<strong>Hypolimnion (Warstwa przydenna):</strong> Najgłębsza, najzimniejsza i najciemniejsza warstwa. Woda ma tu stałą temperaturę około 4°C (ponieważ w tej temperaturze jest najcięższa i opada na dno). Jest to strefa odcięta od dopływu tlenu z powierzchni.'
            ]
        },

        { type: 'header', level: 3, value: '5.3 Termoklina w praktyce nurkowej' },
        { type: 'paragraph', value: 'Dla płetwonurka termoklina jest zjawiskiem, które można odczuć fizycznie i zobaczyć.' },
        {
            type: 'list', items: [
                '<strong>Szok termiczny:</strong> Przepływając przez termoklinę (np. na głębokości 6–8 metrów w polskich jeziorach latem), nurek doświadcza nagłej zmiany temperatury. Różnica może wynosić np. z przyjemnych 20°C do lodowatych 6°C w ciągu kilku sekund. Wymaga to odpowiedniej ochrony termicznej (dobry skafander), nawet jeśli na powierzchni jest upał.',
                '<strong>Zjawiska optyczne:</strong> Na granicy ciepłej i zimnej wody dochodzi do zmiany gęstości ośrodka. Powoduje to załamywanie się światła, widoczne jako "migotanie" lub "rozmycie" obrazu (efekt podobny do gorącego powietrza nad asfaltem). Może to chwilowo utrudnić widoczność i komunikację z partnerem.',
                '<strong>Zmiana pływalności:</strong> Zimna woda jest gęstsza od ciepłej. Wpływając w termoklinę (zimną wodę), nurek może odczuć nieznaczne zwiększenie wyporności (wyrzucanie w górę), a wpływając z powrotem w wodę ciepłą – nagłe opadanie. Wymaga to korekty pływalności za pomocą oddechu lub inflatora.'
            ]
        },

        { type: 'header', level: 3, value: '5.4 Strefy życia w jeziorze' },
        { type: 'paragraph', value: 'Z punktu widzenia biologii i atrakcyjności nurkowej, jezioro dzielimy na:' },
        {
            type: 'list', items: [
                '<strong>Litoral (Strefa przybrzeżna):</strong> Najpłytsza, najlepiej doświetlona strefa. Występuje tu najbujniejsza roślinność i najwięcej ryb. Jest to najciekawszy obszar do nurkowania rekreacyjnego.',
                '<strong>Pelagial:</strong> Strefa otwartej toni wodnej.',
                '<strong>Profundal:</strong> Strefa głębinowa, przydenna, gdzie nie dociera światło wystarczające do fotosyntezy. Życie jest tu ubogie, a warunki trudniejsze (zimno, ciemno).'
            ]
        },

        { type: 'header', level: 3, value: '5.5 Ruchy wody: Falowanie i Prądy' },
        { type: 'paragraph', value: 'Nawet w jeziorach, a zwłaszcza w morzach, woda rzadko stoi w miejscu.' },
        {
            type: 'list', items: [
                '<strong>Falowanie:</strong> Wywoływane głównie przez wiatr. W strefie przyboju (przy brzegu) fale mogą utrudniać wejście i wyjście, a także powodować zmącenie wody, co pogarsza widoczność.',
                '<strong>Prądy:</strong> Mogą być wywołane przez wiatr, przepływ rzeki przez jezioro lub pływy morskie. Pływanie pod prąd szybko prowadzi do wyczerpania i zwiększonego zużycia powietrza. Zasadą jest rozpoczynanie nurkowania "pod prąd", aby powrót odbywał się z prądem (wspomagany), co zwiększa bezpieczeństwo przy kończącym się zapasie powietrza.'
            ]
        },

        { type: 'paragraph', value: '<hr>' },

        // ROZDZIAŁ 6: SPRZĘT POWIETRZNY I WYPORNOŚCIOWY (SCUBA)
        {
            type: 'html', value: `
            <div class="lecture-audio-wrapper" style="margin: 20px 0; text-align: center; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                <p style="margin-bottom: 8px; font-weight: bold; color: var(--color-text-primary);">🎧 Część 3: Sprzęt SCUBA, Technika i Bezpieczeństwo (Rozdziały 6-7)</p>
                <audio controls style="width: 100%; max-width: 400px; height: 40px;">
                    <source src="lectures/p1-theory/Odcinek_3.m4a" type="audio/mp4">
                    Twoja przeglądarka nie obsługuje elementu audio.
                </audio>
            </div>
        `},
        { type: 'header', level: 2, value: 'ROZDZIAŁ 6: SPRZĘT POWIETRZNY I WYPORNOŚCIOWY (SCUBA)' },
        { type: 'paragraph', value: 'Akronim SCUBA (Self Contained Underwater Breathing Apparatus) oznacza autonomiczny aparat oddechowy. To właśnie ten zestaw uniezależnia nurka od powierzchni. Zrozumienie jego działania jest niezbędne nie tylko do jego obsługi, ale i do radzenia sobie z ewentualnymi awariami.' },

        { type: 'header', level: 3, value: '6.1 Butla Nurkowa' },
        { type: 'paragraph', value: 'Butla jest zbiornikiem ciśnieniowym, magazynującym zapas czynnika oddechowego (najczęściej powietrza).' },
        {
            type: 'list', items: [
                '<strong>Materiał:</strong> Butle wykonuje się ze stali (popularne w Europie, cięższe, mają ujemną pływalność, co pozwala zabrać mniej balastu na pasie) lub stopów aluminium (popularne w ciepłych krajach/bazach nurkowych, lżejsze na lądzie, ale pod wodą mogą mieć tendencję do dodatniej pływalności pod koniec nurkowania).',
                '<strong>Pojemność i Ciśnienie:</strong> Standardowa butla rekreacyjna ma pojemność 10, 12 lub 15 litrów. Ciśnienie robocze wynosi zazwyczaj 200 bar (choć spotyka się butle 300-barowe). Oznacza to, że w 12-litrowej butli pod ciśnieniem 200 bar zgromadzone jest ok. 2400 litrów powietrza atmosferycznego (zgodnie z prawem Boyle’a).',
                '<strong>Zawór:</strong> Element wkręcony w szyjkę butli, umożliwiający otwieranie i zamykanie przepływu gazu. Musi być chroniony przed uderzeniem. Wyróżniamy dwa główne typy połączeń z automatem: DIN (wkręcany, bezpieczniejszy, standard w Europie) oraz INT/Yoke (jarzmo, nakładany od góry, popularny w USA i tropikach). Ważne: Zawór butli posiada wewnątrz rurkę (standpipe), która zapobiega dostawaniu się do automatu zanieczyszczeń lub skroplin z dna butli.'
            ]
        },

        { type: 'header', level: 3, value: '6.2 Automat Oddechowy' },
        { type: 'paragraph', value: 'Jego zadaniem jest dostarczenie nurkowi powietrza o ciśnieniu równym ciśnieniu otoczenia, w ilości, jakiej nurek potrzebuje w danym momencie (na żądanie). Współczesne automaty są dwustopniowe.' },
        { type: 'image', src: 'lectures/p1-theory/owd_6.png', alt: 'Sprzęt SCUBA', caption: 'Konfiguracja Zestawu SCUBA' },
        {
            type: 'list', items: [
                '<strong>Pierwszy Stopień:</strong> Przykręcany bezpośrednio do butli. Jego zadaniem jest redukcja wysokiego ciśnienia z butli (np. 200 bar) do tzw. ciśnienia średniego (międzystopniowego), które wynosi zazwyczaj około 9-10 barów powyżej ciśnienia otoczenia. Pierwszy stopień posiada porty wysokiego ciśnienia (HP) – do podłączenia manometru, oraz porty średniego ciśnienia (LP/MP) – do podłączenia drugich stopni i węży inflatora.',
                '<strong>Drugi Stopień (Główny):</strong> To element, który trzymasz w ustach. Redukuje ciśnienie średnie do ciśnienia otoczenia dokładnie w momencie wdechu. Posiada przycisk dodawczy (bypass), który pozwala na ręczne "przedmuchanie" automatu (np. w celu usunięcia z niego wody) oraz zawór wydechowy, odprowadzający zużyte powietrze do wody (bąble).',
                '<strong>Alternatywne Źródło Powietrza (Octopus):</strong> Zapasowy drugi stopień, zazwyczaj w kolorze żółtym, na dłuższym wężu. Służy do podania powietrza partnerowi w sytuacji awaryjnej (brak gazu). Umieszcza się go w "trójkącie bezpieczeństwa" (na klatce piersiowej), aby był łatwo dostępny.'
            ]
        },

        { type: 'header', level: 3, value: '6.3 System Kontroli Pływalności (BCD/Jacket)' },
        { type: 'paragraph', value: 'Kamizelka Ratowniczo-Wypornościowa (KRW), popularnie zwana jacketem lub BCD (Buoyancy Control Device), pełni trzy funkcje:' },
        {
            type: 'list', ordered: true, items: [
                'Utrzymuje butlę na plecach nurka.',
                'Pozwala na uzyskanie pływalności neutralnej pod wodą (poprzez dodawanie/upuszczanie powietrza).',
                'Zapewnia pływalność dodatnią na powierzchni (działa jak kamizelka ratunkowa), pozwalając na odpoczynek bez machania płetwami.'
            ]
        },
        { type: 'paragraph', value: 'Kluczowe elementy BCD:' },
        {
            type: 'list', items: [
                '<strong>Inflator:</strong> Rurka sterująca, podłączona wężem do I stopnia automatu. Posiada dwa przyciski: dodawczy (wpuszcza powietrze z butli do kamizelki) i upustowy (wypuszcza powietrze).',
                '<strong>Zawory nadmiarowe (Spłuczki):</strong> Pozwalają na szybkie wypuszczenie powietrza w różnych pozycjach ciała (np. gdy nurek płynie głową w dół) i chronią kamizelkę przed rozerwaniem w przypadku przepełnienia.'
            ]
        },

        { type: 'header', level: 3, value: '6.4 Przyrządy Pomiarowe (Konsola)' },
        { type: 'paragraph', value: 'System informacyjny nurka, niezbędny do kontroli parametrów życia:' },
        {
            type: 'list', items: [
                '<strong>Manometr (SPG):</strong> Podłączony wężem wysokiego ciśnienia do I stopnia. Pokazuje aktualne ciśnienie w butli (zapas gazu). Nurek musi kontrolować go regularnie, aby nie dopuścić do sytuacji braku powietrza.',
                '<strong>Głębokościomierz i Czasomierz:</strong> Obecnie najczęściej zastępowane przez Komputer Nurkowy, który łączy te funkcje i na bieżąco oblicza limity bezdekompresyjne.'
            ]
        },

        { type: 'paragraph', value: '<hr>' },
        // ROZDZIAŁ 7: TECHNIKA I BEZPIECZEŃSTWO NURKOWANIA
        { type: 'header', level: 2, value: 'ROZDZIAŁ 7: TECHNIKA I BEZPIECZEŃSTWO NURKOWANIA' },
        { type: 'paragraph', value: 'Posiadanie sprzętu to dopiero połowa sukcesu. Bezpieczeństwo zależy od procedur i umiejętności nurka.' },

        { type: 'header', level: 3, value: '7.1 System Partnerski' },
        { type: 'paragraph', value: 'Złota zasada nurkowania rekreacyjnego brzmi: Nigdy nie nurkuj sam. System partnerski zakłada, że dwóch nurków (tzw. Buddy Team) odpowiada za siebie nawzajem.' },
        {
            type: 'list', items: [
                '<strong>Przed wejściem do wody:</strong> Partnerzy sprawdzają sobie nawzajem sprzęt (BWRAF: BCD, Balast, Klamry, Powietrze, Maska/Płetwy). Pozwala to wykryć np. zakręconą butlę czy niepodłączony inflator przed skokiem do wody.',
                '<strong>Pod wodą:</strong> Partnerzy płyną blisko siebie (na wyciągnięcie ręki lub w zasięgu wzroku), komunikują się znakami i regularnie pytają o ilość powietrza.',
                '<strong>Sytuacja awaryjna:</strong> W przypadku awarii sprzętu lub braku powietrza, partner jest Twoim "zapasowym płucem" – udostępnia Ci swój Octopus.'
            ]
        },

        { type: 'header', level: 3, value: '7.2 Kontrola Pływalności (Najważniejsza umiejętność)' },
        { type: 'paragraph', value: 'Celem każdego nurka jest osiągnięcie pływalności neutralnej (zerowej) – stanu nieważkości, w którym nie opada na dno ani nie wypływa na powierzchnię.' },
        {
            type: 'list', items: [
                '<strong>Wyważenie:</strong> Nurek zakłada pas balastowy (ołów), aby zrównoważyć wyporność skafandra. Prawidłowe wyważenie sprawdza się na powierzchni: z pustym jacketem i na wdechu powinieneś unosić się na wysokości oczu.',
                '<strong>Kompensacja pod wodą:</strong> Wraz z głębokością skafander jest ściskany (Prawo Boyle’a) i traci wyporność – nurek zaczyna tonąć szybciej. Aby to skompensować, należy dodać odrobinę powietrza do BCD. Przy wynurzaniu powietrze w BCD się rozpręża, więc trzeba je systematycznie wypuszczać, aby nie wystrzelić na powierzchnię jak korek.'
            ]
        },

        { type: 'header', level: 3, value: '7.3 Procedury Zanurzania i Wynurzania' },
        { type: 'paragraph', value: 'Każde nurkowanie ma swoje krytyczne fazy:' },
        { type: 'image', src: 'lectures/p1-theory/owd_7.png', alt: 'Profil Wynurzania', caption: 'Prawidłowy Profil i Prędkość Wynurzenia' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Zanurzanie:</strong> Musi być kontrolowane. Wypuść powietrze z BCD, zrób wydech i zanurzaj się powoli (najlepiej przy linie opustowej). Pamiętaj o wyrównywaniu ciśnienia w uszach od samego początku, zanim poczujesz ból.',
                '<strong>Wynurzanie:</strong>',
                'Maksymalna prędkość: 9-10 metrów na minutę (wolniej niż najmniejsze bąbelki).',
                'Patrz w górę, trzymaj rękę nad głową (ochrona przed uderzeniem w łódź/przeszkodę).',
                'Wypuszczaj powietrze z jacketu (aby nie przyspieszyć).',
                'Nigdy nie wstrzymuj oddechu!',
                '<strong>Przystanek Bezpieczeństwa (Safety Stop):</strong> Zalecana procedura kończąca każde nurkowanie głębsze niż 10m. Zatrzymaj się na głębokości 5 metrów na 3 do 5 minut. Pozwala to na bezpieczne usunięcie nadmiaru azotu z organizmu przed ostatecznym wyjściem na powierzchnię.'
            ]
        },

        { type: 'header', level: 3, value: '7.4 Komunikacja Podwodna' },
        { type: 'paragraph', value: 'Woda uniemożliwia rozmowę, dlatego nurkowie używają znormalizowanych znaków migowych. Znak musi być pokazany wyraźnie, a partner musi go potwierdzić (np. odpowiadając tym samym znakiem "OK"). Kluczowe znaki:' },
        {
            type: 'list', items: [
                '<strong>OK:</strong> Kółko z palców (wszystko w porządku).',
                '<strong>Góra/Dół:</strong> Kciuk w górę/dół (zmieniamy głębokość).',
                '<strong>Stop:</strong> Otwarta dłoń.',
                '<strong>Problem:</strong> Wahadłowy ruch dłoni + wskazanie źródła (np. ucho).',
                '<strong>Brak powietrza:</strong> Ruch "podcinania gardła".'
            ]
        },

        { type: 'paragraph', value: '<hr>' },

        // ROZDZIAŁ 8: PLANOWANIE NURKOWANIA (TABELE I KOMPUTERY)
        {
            type: 'html', value: `
            <div class="lecture-audio-wrapper" style="margin: 20px 0; text-align: center; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                <p style="margin-bottom: 8px; font-weight: bold; color: var(--color-text-primary);">🎧 Część 4: Planowanie, Procedury Awaryjne i Pierwsza Pomoc (Rozdziały 8-10)</p>
                <audio controls style="width: 100%; max-width: 400px; height: 40px;">
                    <source src="lectures/p1-theory/Odcinek_4.m4a" type="audio/mp4">
                    Twoja przeglądarka nie obsługuje elementu audio.
                </audio>
            </div>
        `},
        { type: 'header', level: 2, value: 'ROZDZIAŁ 8: PLANOWANIE NURKOWANIA (TABELE I KOMPUTERY)' },
        { type: 'paragraph', value: 'Bezpieczne nurkowanie to nurkowanie zaplanowane. Planowanie pozwala uniknąć choroby dekompresyjnej, braku powietrza i zagubienia pod wodą.' },

        { type: 'header', level: 3, value: '8.1 Tabele Dekompresyjne' },
        { type: 'paragraph', value: 'Przed erą komputerów nurkowie używali wyłącznie tabel. Choć dziś są rzadziej stosowane w praktyce, ich zrozumienie jest fundamentem wiedzy o nasycaniu tkanek azotem.' },
        { type: 'image', src: 'lectures/p1-theory/owd_8.png', alt: 'Planowanie Nurkowania', caption: 'Krzywa Limitów Bezdekompresyjnych' },
        { type: 'paragraph', value: '<strong>Zasada działania:</strong> Tabele (np. Bühlmanna/Hahna stosowane w KDP/CMAS) pozwalają wyznaczyć limit bezdekompresyjny (NDL) – czyli maksymalny czas, jaki możesz spędzić na danej głębokości, aby móc wynurzyć się bezpośrednio na powierzchnię (z zalecanym przystankiem bezpieczeństwa), bez konieczności wykonywania obowiązkowych przystanków dekompresyjnych.' },
        { type: 'paragraph', value: '<strong>Nurkowanie powtórzeniowe:</strong> Jeśli wykonujesz drugie nurkowanie tego samego dnia, w Twoim organizmie wciąż znajduje się azot z pierwszego zanurzenia (tzw. azot resztkowy). Tabele pozwalają obliczyć:' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Grupę powtórzeniową (Współczynnik Pamięci Tkankowej):</strong> Oznaczenie literowe (np. A, B, C...) określające, ile azotu masz w sobie po pierwszym nurkowaniu.',
                '<strong>Przerwę powierzchniową:</strong> Czas spędzony na powierzchni, podczas którego Twój organizm pozbywa się nadmiaru azotu (odsycanie). Im dłuższa przerwa, tym „czystszy” wchodzisz do wody ponownie.',
                '<strong>Czas dodatkowy:</strong> Karny czas, który musisz odjąć od limitu bezdekompresyjnego drugiego nurkowania, uwzględniając azot, który wciąż masz w organizmie.'
            ]
        },

        { type: 'header', level: 3, value: '8.2 Komputer Nurkowy' },
        { type: 'paragraph', value: 'To Twój osobisty asystent bezpieczeństwa. W przeciwieństwie do tabel, które zakładają, że cały czas byłeś na maksymalnej głębokości (profil prostokątny), komputer na bieżąco śledzi Twoją głębokość i czas (profil rzeczywisty). Dzięki temu „zauważa”, kiedy wypłycasz nurkowanie i wydłuża Twój dostępny czas bezdekompresyjny.' },
        { type: 'paragraph', value: 'Złote zasady używania komputera:' },
        {
            type: 'list', items: [
                '<strong>Własny komputer:</strong> Każdy nurek musi mieć własne urządzenie. Nie wolno polegać na komputerze partnera, ponieważ Wasze profile (głębokość, czas zanurzenia) nigdy nie są identyczne.',
                '<strong>Nie wyłączaj:</strong> Nie wyłączaj komputera między nurkowaniami i nie pożyczaj go innej osobie, jeśli sam planujesz jeszcze nurkować. Komputer „pamięta” Twoje nasycenie azotem.',
                '<strong>Konserwatyzm:</strong> Jeśli komputer ulegnie awarii, natychmiast przerwij nurkowanie, wykonaj przystanek bezpieczeństwa i wynurz się. Przed kolejnym nurkowaniem musisz odczekać 24 godziny (czas pełnego odsycania).',
                '<strong>Baterie:</strong> Zawsze sprawdzaj stan baterii przed wyjazdem.'
            ]
        },

        { type: 'header', level: 3, value: '8.3 Logbook (Książka Płetwonurka)' },
        { type: 'paragraph', value: 'Rejestrowanie nurkowań to nie tylko pamiątka. To dokument potwierdzający Twoje doświadczenie (wymagany przy zapisach na kursy zaawansowane) oraz baza danych dla Ciebie – zapisujesz tam ilość zużytego balastu, rodzaj skafandra i zużycie powietrza, co ułatwia dobór sprzętu na kolejne nurkowania.' },

        { type: 'paragraph', value: '<hr>' },

        // ROZDZIAŁ 9: PROCEDURY AWARYJNE I ROZWIĄZYWANIE PROBLEMÓW
        { type: 'header', level: 2, value: 'ROZDZIAŁ 9: PROCEDURY AWARYJNE I ROZWIĄZYWANIE PROBLEMÓW' },
        { type: 'paragraph', value: 'Wypadki w nurkowaniu są rzadkie i zazwyczaj wynikają z błędu ludzkiego lub paniki. Znajomość procedur pozwala opanować stres i rozwiązać problem pod wodą.' },

        { type: 'header', level: 3, value: '9.1 Zagubienie partnera' },
        { type: 'paragraph', value: 'Większość zagubień wynika z gapisiostwa lub słabej widoczności. Procedura:' },
        {
            type: 'list', ordered: true, items: [
                'Rozejrzyj się dookoła (360 stopni), spójrz w górę i w dół.',
                'Jeśli nie widzisz partnera ani jego bąbli w ciągu 1 minuty, rozpocznij kontrolowane wynurzanie na powierzchnię (z zachowaniem prędkości i przystanku bezpieczeństwa, jeśli to bezpieczne).',
                'Na powierzchni napompuj jacket, rozejrzyj się i czekaj. Twój partner powinien zrobić to samo. Spotkacie się na powierzchni. Nigdy nie szukaj partnera pod wodą „do skutku”, bo może on już być na górze i wzywać pomocy do Ciebie.'
            ]
        },

        { type: 'header', level: 3, value: '9.2 Brak powietrza' },
        { type: 'paragraph', value: 'Sytuacja krytyczna, której można uniknąć, często sprawdzając manometr. Jeśli jednak do niej dojdzie:' },
        { type: 'image', src: 'lectures/p1-theory/owd_9.png', alt: 'Procedura Braku Powietrza', caption: 'Radzenie Sobie z Brakiem Czynnika Oddechowego' },
        {
            type: 'list', items: [
                '<strong>Gdy partner jest blisko:</strong> Pokaż znak „Brak powietrza” (podcięcie gardła). Partner podaje Ci swoje alternatywne źródło (octopus). Wkładasz je do ust, przedmuchujesz, chwytacie się za uprzęże (kontakt fizyczny jest kluczowy dla uspokojenia) i wspólnie, powoli wynurzacie się.',
                '<strong>Gdy jesteś sam (ostateczność):</strong> Awaryjne wynurzenie kontrolowane. Płyniesz do powierzchni, nieustannie wydychając powietrze (mówiąc „aaaaa…”), aby nie doszło do urazu płuc. Nie zrzucaj balastu, chyba że nie jesteś w stanie wypłynąć.'
            ]
        },

        { type: 'header', level: 3, value: '9.3 Zaplątanie' },
        { type: 'paragraph', value: 'Zaplątanie w żyłki wędkarskie lub sieci to realne zagrożenie, zwłaszcza na wrakach i w roślinności.' },
        {
            type: 'list', items: [
                '<strong>Zatrzymaj się:</strong> Nie szarp się i nie obracaj – to tylko pogorszy sprawę.',
                '<strong>Cofnij się:</strong> Spróbuj delikatnie wycofać się tą samą drogą.',
                '<strong>Poproś o pomoc:</strong> Twój partner widzi lepiej, w co się zaplątałeś (np. zawór butli).',
                '<strong>Użyj noża:</strong> W ostateczności wytnij zaplątany element. Dlatego każdy nurek musi mieć narzędzie tnące (nóż lub sekator) w łatwo dostępnym miejscu (nie na łydce, lecz np. na klatce piersiowej lub pasie).'
            ]
        },

        { type: 'header', level: 3, value: '9.4 Skurcz mięśni' },
        { type: 'paragraph', value: 'Bolesny skurcz łydki lub uda zdarza się przy słabej kondycji, odwodnieniu lub zimnie. Procedura: Zatrzymaj się. Chwyć końcówkę płetwy bolącej nogi i przyciągnij ją do siebie, prostując nogę w kolanie (rozciąganie mięśnia). Jeśli nie dasz rady sam – poproś partnera. Po ustąpieniu bólu nie używaj tej nogi intensywnie.' },

        { type: 'paragraph', value: '<hr>' },

        // ROZDZIAŁ 10: PIERWSZA POMOC I RATOWNICTWO
        { type: 'header', level: 2, value: 'ROZDZIAŁ 10: PIERWSZA POMOC I RATOWNICTWO' },
        { type: 'paragraph', value: 'Jako nurek P1 nie jesteś ratownikiem zawodowym, ale musisz umieć zareagować w sytuacji zagrożenia życia.' },

        { type: 'header', level: 3, value: '10.1 Zmęczony nurek na powierzchni' },
        { type: 'paragraph', value: 'Jeśli po wynurzeniu Ty lub partner jesteście zbyt zmęczeni, by dopłynąć do brzegu:' },
        {
            type: 'list', ordered: true, items: [
                '<strong>Pływalność:</strong> Napompuj jacket swój i partnera (priorytet!).',
                '<strong>Odpoczynek:</strong> Połóż się na plecach, uspokój oddech.',
                '<strong>Holowanie:</strong> Jeśli partner nie ma siły, holuj go do brzegu (np. chwytem za zawór butli lub płynąc na plecach z jego płetwami na swoich ramionach), cały czas z nim rozmawiając.'
            ]
        },

        { type: 'header', level: 3, value: '10.2 Podstawowe Zabiegi Resuscytacyjne (BLS)' },
        { type: 'paragraph', value: 'W przypadku utonięcia lub nagłego zatrzymania krążenia, czas jest kluczowy. Algorytm (zgodny z wytycznymi ERC dla topielców):' },
        { type: 'image', src: 'lectures/p1-theory/owd_10.png', alt: 'Pierwsza Pomoc BLS', caption: 'Resuscytacja Krążeniowo-Oddechowa' },
        {
            type: 'list', ordered: true, items: [
                'Wyciągnij poszkodowanego na brzeg/łódź.',
                'Sprawdź przytomność. Jeśli nie reaguje – wołaj o pomoc.',
                'Udrożnij drogi oddechowe (odchyl głowę do tyłu).',
                'Sprawdź oddech (max 10 sek. – wzrok, słuch, dotyk).',
                'Jeśli brak oddechu:',
                'Wykonaj 5 oddechów ratowniczych (u topielców przyczyną jest niedotlenienie!).',
                'Rozpocznij uciśnięcia klatki piersiowej i oddechy w sekwencji 30 uciśnięć : 2 oddechy.',
                'Wezwij służby (112 lub w Polsce dedykowane numery np. nad wodą). Kontynuuj do przyjazdu karetki lub odzyskania przytomności.'
            ]
        },

        { type: 'header', level: 3, value: '10.3 Pierwsza pomoc tlenowa' },
        { type: 'paragraph', value: 'W przypadku podejrzenia choroby dekompresyjnej (DCS) lub urazu ciśnieniowego płuc, jedynym skutecznym działaniem na miejscu zdarzenia jest podanie 100% tlenu. Tlen przyspiesza wypłukiwanie azotu z organizmu i dotlenia uszkodzone tkanki. Jeśli baza nurkowa posiada zestaw tlenowy – należy go użyć niezwłocznie.' }
    ],
    quiz: [
        {
            question: "Maska nurkowa musi posiadać szybę wykonaną z:",
            options: [
                "Zwykłego szkła okiennego",
                "Szkła hartowanego (Tempered/Safety Glass)",
                "Przezroczystego plastiku",
                "Akrylu, który nie zaparowuje"
            ],
            correctAnswer: 1,
            explanation: "Szkło hartowane (Tempered) chroni przed groźnym skaleczeniem w razie pęknięcia pod wodą."
        },
        {
            question: "Dlaczego maska nurkowa musi posiadać tzw. kieszeń na nos?",
            options: [
                "Aby ładniej wyglądała",
                "Aby można było oddychać nosem pod wodą",
                "Aby umożliwić zaciśnięcie nosa w celu wyrównania ciśnienia w uszach i masce",
                "Aby woda omijała usta"
            ],
            correctAnswer: 2,
            explanation: "Kieszeń pozwala zamknąć nos podczas wyrównywania ciśnienia metodą Valsalvy."
        },
        {
            question: "Z jakimi butami używa się płetw paskowych z otwartą piętą?",
            options: [
                "Z butami neoprenowymi o twardej podeszwie",
                "Z cienkimi skarpetkami bawełnianymi",
                "Nosi się je wyłącznie na gołą stopę",
                "Z butami sportowymi"
            ],
            correctAnswer: 0,
            explanation: "Płetwy paskowe, ze względu na konstrukcję wymagają założenia butów neoprenowych chroniących stopę."
        },
        {
            question: "Fajkę (rurkę) montujemy do paska maski zawsze:",
            options: [
                "Po prawej stronie głowy",
                "Na potylicy",
                "Po lewej stronie głowy",
                "Nie ma to żadnego znaczenia"
            ],
            correctAnswer: 2,
            explanation: "Fajkę zawsze nosimy z lewej strony, by nie przeszkadzała w operowaniu wężami od automatu oddechowego po prawej."
        },
        {
            question: "Ciśnienie absolutne na głębokości 20 metrów w morzu wynosi:",
            options: [
                "2 bary",
                "3 bary",
                "4 bary",
                "20 barów"
            ],
            correctAnswer: 1,
            explanation: "1 bar na powierzchni + po 1 barze za każde 10m słupa wody (1+2=3)."
        },
        {
            question: "Zgodnie z prawem Boyle’a, w którym przedziale głębokości następuje największa (procentowa) zmiana objętości gazów?",
            options: [
                "Między 30 a 40 metrem",
                "Między 20 a 30 metrem",
                "Między 10 a 20 metrem",
                "Między powierzchnią a 10 metrem"
            ],
            correctAnswer: 3,
            explanation: "Największy procentowy skok (o równe 50%) uwięzionego gazu przypada na pierwsze 10 metrów podczas zanurzania ze strefy 1 bara."
        },
        {
            question: "Pływalność neutralna to stan, w którym:",
            options: [
                "Nurek opada na dno jak kamień",
                "Nurek unosi się na powierzchni wody",
                "Siła wyporu równoważy ciężar i nurek „zawiśnie” w toni",
                "Z jacketu wypuszczono całe powietrze"
            ],
            correctAnswer: 2,
            explanation: "Nieważkość tzw. Pływalność neutralna osiągana jest na określonej głębokości po starannym wyważeniu jacketu (dodając do niego czynnik wypornościowy - powietrze aby udźwignąć wagę nurka)."
        },
        {
            question: "Gęstość gazu, którym oddychasz ze wzrostem ciśnienia (głębokości):",
            options: [
                "Maleje",
                "Rośnie",
                "Pozostaje bez zmian",
                "Zmienia smak na słony"
            ],
            correctAnswer: 1,
            explanation: "Rośnie zagęszczenie porcji powietrza w automacie ze względu na kompresję przez gęstość wody (otoczenia)."
        },
        {
            question: "Najważniejsza, złota zasada nurkowania brzmi:",
            options: [
                "Pływaj najszybciej jak potrafisz",
                "Oddychaj ciągle i nigdy nie wstrzymuj oddechu",
                "Nigdy nie zdejmuj maski",
                "Zawsze noś nóż na łydce"
            ],
            correctAnswer: 1,
            explanation: "Ciągły oddech zabezpiecza zamknięto obszary organizmu (zwłaszcza płuca) przez urazami i destrukcją miąższową płuc podczas wznoszenia na podwyższonym ciśnieniu.  "
        },
        {
            question: "Do jakiego urazu może doprowadzić wstrzymanie oddechu podczas wynurzania?",
            options: [
                "Do choroby morskiej",
                "Do narkozy azotowej",
                "Do urazu ciśnieniowego płuc (rozerwania pęcherzyków)",
                "Do hipotermii"
            ],
            correctAnswer: 2,
            explanation: "Barotrauma układu oddechowego przy zablokowanych oknach drożności - powietrze zwiększy uwięzioną tam objętość niszcząc pecherzyki oraz uwalniając powietrze do układu krwionośnego."
        },
        {
            question: "Ból ucha podczas zanurzania oznacza, że:",
            options: [
                "Maska jest zbyt mocno dociśnięta",
                "Należy wstrzymać oddech",
                "Ciśnienie na zewnątrz jest wyższe i należy je wyrównać (np. metodą Valsalvy)",
                "Należy przyspieszyć zanurzanie"
            ],
            correctAnswer: 2,
            explanation: "Kujący ból oznacza tzw skłiz (wybrzeczenie do wewnątrz w kierunku mniejszego ciśnienia w kanale słuchowym cienkiej membrany). Konieczne jest wyrównanie wciskając powietrze we wnętrze z zaciśniętym nosem."
        },
        {
            question: "Euforia, lęk lub stan przypominający upojenie alkoholowe na głębokości poniżej 30m to objawy:",
            options: [
                "Toksyczności tlenowej",
                "Narkozy azotowej",
                "Hipotermii",
                "Zatoru gazowego"
            ],
            correctAnswer: 1,
            explanation: "Stan wywołany wysokim ciśnieniem parcjalnym par tlenu azotowych działających oszałamiająco po zejściu we głębokości (ok 30m) nosi nazwo tak zwanej Ecsatazy głębinowej a jej najskuteczniejszym lekarstwem jest ascensja do mniejszej partii wodnej."
        },
        {
            question: "Wynalezienie pierwszego bezpiecznego automatu \"Aqualung\" w 1943 roku przypisuje się:",
            options: [
                "J.Y. Cousteau i E. Gagnanowi",
                "Braciom Wright",
                "Leonardo da Vinci",
                "Archimedesowi"
            ],
            correctAnswer: 0,
            explanation: "System automatu dwustpniowego 'dozującego' wedle woli płuca został powołany do użytku w warunkach wojennych poprzez współpracę pary J.Y. Cousteau (żeglarza) oraz Émile Gagnana (inżyniera)."
        },
        {
            question: "Główną wadą klasycznych hełmów nurkowych z XIX wieku było:",
            options: [
                "To, że były zbyt lekkie",
                "Ograniczenie swobody ruchu poprzez wąż (pępowinę) zasilający z powierzchni",
                "Zbyt duża prędkość poruszania się nurka",
                "Wymóg używania nitroxu"
            ],
            correctAnswer: 1,
            explanation: "Sprzęty określane obecnie mianem \"Ciężkie\" wymagały nadzoru załogi z asortymentem pępowin i węży, pozbawiając użytkownika zalet płynących ze sprawnego sprzętu niezależnego - znanego z rozwiązań pod skrótem SCUBA."
        },
        {
            question: "Za początek zorganizowanego nurkowania swobodnego w Polsce uznaje się założenie komisji (obecnie KDP) w roku:",
            options: [
                "1920",
                "1943",
                "1956",
                "1999"
            ],
            correctAnswer: 2,
            explanation: "W historii sportu rodzimego rozwój płetwonurkowania masowego przypadł wraz z powstaniem w grudniu roku 1956 struktury PTTK noszącej ówczesnie nazwę Komisji Turystyki Podwodnej."
        },
        {
            question: "System SCUBA oznacza:",
            options: [
                "Komputerowy system planowania",
                "Autonomiczny aparat oddechowy, uniezależniający nurka od powierzchni",
                "Zespół ratownictwa wodnego",
                "Rodzaj skafandra suchego"
            ],
            correctAnswer: 1,
            explanation: "Akronim angielski: Self-Contained Underwater Breathing Apparatus rozkłada się dosłownie na formę polską aparatu bez zasilenia połączonego (Autonomiczny powiązany aparat tlenowo wybuchowy)."
        },
        {
            question: "Termoklina w polskim jeziorze w okresie letnim to:",
            options: [
                "Strefa, w której woda jest najcieplejsza",
                "Strefa gwałtownego spadku temperatury wraz z głębokością",
                "Wiatr wiejący od brzegu",
                "Rodzaj trującej rośliny"
            ],
            correctAnswer: 1,
            explanation: "W obszarze wód śródlądowych w miesiącach ciepłych ustala się pionowe rozwarstwienie (stratyfikacje); Gwałtowne (skokowe) zetknięcie wód nazywane jest w fizyce zbiorników jako Termoklina."
        },
        {
            question: "Jak załamanie światła przez maskę wpływa na widzenie pod wodą?",
            options: [
                "Obiekty wydają się mniejsze i dalsze",
                "Widzimy na czerwono",
                "Obiekty wydają się o 33% większe i 25% bliższe",
                "Obraz jest zawsze odwrócony"
            ],
            correctAnswer: 2,
            explanation: "Soczewka wodno-powietrzna powoduje znaczące oddziaływanie załamanym widmem wzroku tworząc optyczne przybliżenie środowiska a zarazem czyni obiekty wizualnie grubszym o wielkie procenty - średnio do 1/4 skali w powiększeniu."
        },
        {
            question: "Woda odbiera ciepło z organizmu człowieka:",
            options: [
                "Wolniej niż powietrze",
                "W tym samym tempie co powietrze",
                "Około 20-25 razy szybciej niż powietrze",
                "Wcale nie odbiera ciepła"
            ],
            correctAnswer: 2,
            explanation: "Wymiennik ciepłoty ustrojowej oddaje gwałtownie do cieczy zgromadzoną kalorię wskutek nieodporności a właściwości przewodni środowiska są tu kluczne - nawet 25 wielokrotnie prędkiej do wychłodzeń niż na otwartym lądowym placówce."
        },
        {
            question: "Dźwięk pod wodą rozchodzi się ok. 4 razy szybciej, co powoduje, że:",
            options: [
                "Słyszymy tylko bardzo wysokie tony",
                "Mamy duże trudności z określeniem kierunku, z którego dochodzi dźwięk",
                "Jesteśmy całkowicie głusi",
                "Dźwięk rozbija szkło maski"
            ],
            correctAnswer: 1,
            explanation: "Kierunkowanie w mózgu doznaje usterki logistycznej ponieważ drganie stymuluje kanały uszne w tym samym odstępie ułamka i nie zdradza pozycjonowanego źródła, dźwięk z silników dochodzi więc dla nurka rzekomo z góry lub każdej flanki symultanicznie."
        },
        {
            question: "Głównym zadaniem I (pierwszego) stopnia automatu oddechowego jest:",
            options: [
                "Dozowanie powietrza bezpośrednio do ust",
                "Redukcja wysokiego ciśnienia z butli (np. 200 bar) do ciśnienia średniego (ok. 10 bar)",
                "Pomiar głębokości",
                "Filtracja wody morskiej"
            ],
            correctAnswer: 1,
            explanation: "Pierwszy element przymocowany na bliskim wydechu zbiornika (I stopień wg. budowy automatów dwustopniowych ) redukuje skondensowanie pod ogromne ciśnienie parowe do ciśninienia tzw. Międzystopionwego."
        },
        {
            question: "Zapasowe źródło powietrza (Octopus) jest standardowo oznaczane kolorem:",
            options: [
                "Czarnym",
                "Białym",
                "Żółtym",
                "Niebieskim"
            ],
            correctAnswer: 2,
            explanation: "Barwa zapasowej obudowy to uniwersalne na skalę światową żółte elementy złączowe aby łatwo i szybko rozpoznać po stracie panowania na akwenie."
        },
        {
            question: "Przyrząd służący do odczytywania ilości (ciśnienia) gazu pozostałego w butli to:",
            options: [
                "Głębokościomierz",
                "Kompas",
                "Inflator",
                "Manometr"
            ],
            correctAnswer: 3,
            explanation: "Zewnętrzne urządzenie z wyjściem HP służące jako zegary informacyjne po podłączeniu u konsoli wycenia pozostałą objętość oddychania – to znany powszetnie przyrząd – Manometr."
        },
        {
            question: "BCD (Jacket) używamy pod wodą do:",
            options: [
                "Ogrzewania ciała",
                "Uzyskania i utrzymania pływalności neutralnej",
                "Magazynowania dodatkowego tlenu",
                "Ochrony przed drapieżnikami"
            ],
            correctAnswer: 1,
            explanation: "Pneumatycznie wspomagana kamizela pozwala wyrównać i niwelować spadki ciśnienia u nurków w celu zbalansowania lotu poziomego jako 'Neutralna'. Działanie potocznie oparte na inflacji powietrza lub redukcji zaworem nadmiarowym."
        },
        {
            question: "Maksymalna, bezpieczna prędkość wynurzania to:",
            options: [
                "20 metrów na minutę",
                "9-10 metrów na minutę",
                "Jak najszybciej, byle wypuścić powietrze",
                "30 metrów na minutę"
            ],
            correctAnswer: 1,
            explanation: "Brak pęcherzyków na stornkach naręcznych a tak samo tabele ostrzegające stawiają od lat ujednolicony margines szybkości na 9 do (najwyżej 10 m / minute wynorzenia się wertykalnie)."
        },
        {
            question: "Przystanek bezpieczeństwa po nurkowaniu rekreacyjnym standardowo wykonuje się:",
            options: [
                "Na 10 metrach przez 10 minut",
                "Na 5 metrach przez 3-5 minut",
                "Na 3 metrach przez 1 minutę",
                "Na powierzchni pływając na plecach"
            ],
            correctAnswer: 1,
            explanation: "Rekomendowany (a bywa że obowiązkowy) krok ostateczny redukcji sprawności to Safety-Stop; przeprowadzony klasycznie przez 3 chociażby 5 minutek na głębokości ok 5 m u celu dekompresji."
        },
        {
            question: "Po znaku \"Brak powietrza\" (przecięcie dłonią szyi), nurek dawca powinien:",
            options: [
                "Pokazać znak \"OK\" i odpłynąć",
                "Podać partnerowi swoje alternatywne źródło powietrza (octopus)",
                "Wystrzelić bojkę",
                "Rozpocząć reanimację pod wodą"
            ],
            correctAnswer: 1,
            explanation: "Ratownik odruchowe zdejmuje dodatkowy moduł dostępowy (Octopus ze złotej obudowy) powiązane dłonią z wężem długu i wciska partnerowi potrzebującemu odtlenowania (ratunek dzielenia z partnerem)."
        },
        {
            question: "Jak na powierzchni sprawdzamy, czy jesteśmy prawidłowo wyważeni?",
            options: [
                "Po opróżnieniu jacketu i wzięciu normalnego wdechu, woda powinna sięgać na wysokość oczu",
                "Nurek powinien natychmiast opadać na dno po wejściu do wody",
                "Woda powinna sięgać pasa",
                "Wyporność powinna wyrzucać nas do połowy klatki piersiowej z wody"
            ],
            correctAnswer: 0,
            explanation: "Mnoży się objętość wagowa tak zwanych odważników a sprawdzić ją najrozsądniej, pozbywając się z jacketu powietrza i trzymając połowę płuc objętymi tlenem, by linia wody równała się okularom twarzy."
        },
        {
            question: "Czas, w którym nurek może przebywać na danej głębokości bez konieczności robienia obowiązkowych przystanków dekompresyjnych to:",
            options: [
                "Czas denny",
                "Limit bezdekompresyjny (NDL)",
                "Przerwa powierzchniowa",
                "Czas zerowy"
            ],
            correctAnswer: 1,
            explanation: "Ustandaryzowany parametr No Decrompresion Limits (NDL) narzuca maksymalnie dostępny w minutkach przydział trwania po bezpiecznej trajektorii. Na ten czas wpływa m.in profil poprzedniej z nurkowań powtórzeniowych (z azotu powrtózenowym w obiegu tkanki)."
        },
        {
            question: "Czy można w trakcie dnia nurkowego dzielić się jednym komputerem nurkowym z partnerem?",
            options: [
                "Tak, jeśli nurkowaliśmy blisko siebie",
                "Nie, każdy nurek musi mieć własny komputer mierzący jego własny profil",
                "Tak, jeśli jest to komputer wielogazowy",
                "Tak, ale trzeba dodać 5 minut do czasu na dnie"
            ],
            correctAnswer: 1,
            explanation: "Urządzenia dedykowane (komputery) do monitorowana ciśnienia tkanek wchłanianego azotu obliczają go zgodnie m. in z unikalnym pozycjonowaniem i dynamiką osobistą (komputer nie może być dzielony bo zapamietał dawke azotu wlasiciela dla każdego kolejnego wejscia u powtórzeniowego scenariusza zanurzeń)."
        },
        {
            question: "Odsycanie, czyli pozbywanie się nadmiaru azotu z organizmu zachodzi głównie podczas:",
            options: [
                "Szybkiego zanurzania",
                "Pobytu na maksymalnej głębokości",
                "Wolnego wynurzania oraz podczas przerwy na powierzchni",
                "Snu w przeddzień nurkowania"
            ],
            correctAnswer: 2,
            explanation: "Organizm przetwarza i sprawnie wydala zalegające ciśnieniu parowe azotu od momentu kiedy ciśnienie na zewnątrz ustaleje i systematycznie pozwala uchodzi z tkanek ucieczki do płuc. Proces powysycenia dokonuje ujęcie objętości po zakończeniu cyklu."
        },
        {
            question: "Ile czasu zaleca się odczekać przed lotem samolotem po wielokrotnych nurkowaniach bezdekompresyjnych?",
            options: [
                "Nie ma obostrzeń",
                "Minimum 2 godziny",
                "Minimum 12 godzin",
                "Minimum 18 do 24 godzin"
            ],
            correctAnswer: 3,
            explanation: "Generalnie standardowe limity (wg tabel m.in DAN) nakładają bezpieczny restrykcyjny pobyt z min 18 do max 24 z brakiem jakiegokolwiek startu w rejsp po kilku dobowych podróżach."
        },
        {
            question: "Co należy zrobić po zorientowaniu się, że zgubiliśmy partnera pod wodą?",
            options: [
                "Czekać na dnie, aż po nas wróci",
                "Szukać go rozglądając się przez max. 1 minutę, a jeśli go nie widać, bezpiecznie wynurzyć się na powierzchnię",
                "Kontynuować nurkowanie samodzielnie",
                "Natychmiast odrzucić pas balastowy"
            ],
            correctAnswer: 1,
            explanation: "Odcięcie systematyczne i rozglądanie do tyłu bez przemieszaczania i poszukiwanie ewentualnych bąbelków z aparatów – max 60s poszukiwań i następuje kontrolowane i wertykalne zbliżanie ramiens do klatki wehikułu (płynięcie wynurzeniowe powłoczkowej odnalezienia z przerwą w wynurzeniu na procedury i partnera który postapi identycznie na wodzie ok)."
        },
        {
            question: "W przypadku skurczu łydki pod wodą należy:",
            options: [
                "Odpłynąć i wezwać pogotowie",
                "Płynąć dalej ignorując ból",
                "Zatrzymać się, chwycić koniec płetwy i przyciągnąć ją do siebie prostując nogę",
                "Szybko pompować jacket"
            ],
            correctAnswer: 2,
            explanation: "Najsprawniejsze postępowie ratowniczne/technicznie – naciągnięci do twarzy rzemyka nogavki w sztywności z mięśniowych przy jednoczyście naciskaniem nienaruszoną rąka – relaks na nogę w poślizg aż puści u ucisk bez wysiłku na dno łydki."
        },
        {
            question: "Jeśli zaplączesz się w starą sieć rybacką, pierwszą czynnością powinno być:",
            options: [
                "Zatrzymanie się, uspokojenie i powiadomienie partnera (nie szarpać się)",
                "Obrót o 360 stopni i gwałtowne ciągnięcie",
                "Zrzucenie butli",
                "Wyłączenie światła"
            ],
            correctAnswer: 0,
            explanation: "Błąd to obrót ciałem do linki (efekt mumi) – zastygamy a na palcach dajemy migowke koledze o poplatanych elementach. Asysta usadzi tnaće lub powili odprowadzi nogawe po uwolnienieu."
        },
        {
            question: "Awaryjne wynurzenie kontrolowane (CESA - płynięcie do powierzchni o własnych siłach przy braku powietrza) wymaga bezwzględnie:",
            options: [
                "Zamknięcia oczu",
                "Szybkiej pracy rąk",
                "Nieprzerwanego robienia wydechu (wydawania dźwięku np. \"aaaa\")",
                "Wstrzymania oddechu na cały czas płynięcia"
            ],
            correctAnswer: 2,
            explanation: "Pnęcie powietrza (rosne o objętość) podczas CESA nakłada bezdyskusyjne emitowanie bąbeli do ociągnięcia napięć aby chronić delikatne i napiete z barotamy komorki do wydech od samej dekompresje i uniknęcia ciśnieniowych po płuciu."
        },
        {
            question: "Najlepszą pierwszą pomocą specjalistyczną (poza BLS) na miejscu zdarzenia przy podejrzeniu choroby dekompresyjnej lub urazu płuc jest:",
            options: [
                "Podanie gorącej herbaty",
                "Rekompresja poszkodowanego w wodzie",
                "Podanie 100% tlenu medycznego",
                "Masaż bolących stawów"
            ],
            correctAnswer: 2,
            explanation: "Tlen powstrzymuje rozprastanie sie pęcherzyków azotwych wymieniając stany zapalne. (Zakaz ponownego wprowadzenia go do wody dla samo domowej 'Rekompresji)."
        },
        {
            question: "Zmęczonemu nurkowi na powierzchni wody w pierwszej kolejności należy:",
            options: [
                "Kazać płynąć kraulem",
                "Podać tlen",
                "Ustanowić mu dodatnią pływalność (napompować BCD, zrzucić balast)",
                "Zdjąć maskę"
            ],
            correctAnswer: 2,
            explanation: "Aby przerwać tonięcie albo ustać siły trzeba pomóc nadac wyporność (dodaj lub obniz ciezary - i do pompowanie skrzydła od reki), kładzenie dla ulgi na powierzchni, po tym reanimacyj do opieki powrto do akwenu z liną asstyki."
        },
        {
            question: "Jak różni się standardowe RKO (BLS) w przypadku osoby po utonięciu w porównaniu z nagłym zatrzymaniem krążenia na ulicy?",
            options: [
                "Nie używa się defibrylatora",
                "Rozpoczyna się od wykonania 5 oddechów ratowniczych przed uciskami",
                "Uciska się tylko brzuch",
                "Wykonuje się tylko masaż serca, bez oddechów"
            ],
            correctAnswer: 1,
            explanation: "U osób tonących reanimacji przystępuje w oparciu deficyty powietrza w płucię - a dopiero potem brak bicia jako skótek. Protokół stano od wstępu 5 oddechy dla utonięć aby dotlenić bezdechowca."
        },
        {
            question: "Głównym gazem wywołującym powstawanie pęcherzyków przy chorobie dekompresyjnej (DCS) u nurków rekreacyjnych jest:",
            options: [
                "Tlen",
                "Dwutlenek węgla",
                "Hel",
                "Azot"
            ],
            correctAnswer: 3,
            explanation: "Podstawowy obiwinniony, to azot – nierolniczy pod ciśnieniami atmosfer. Gromadzony się w tkankę (saturacja) do oddajania dekompresji - jego nierozwazny transport (przerywany) owocuje narzutem pęcherzy do dolegliwości typami jednych II DCS."
        }
    ]
};
