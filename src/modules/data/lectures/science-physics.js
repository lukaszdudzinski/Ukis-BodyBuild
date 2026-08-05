export const sciencePhysicsLecture = {
    id: 'science-physics',
    title: 'Nauka w Nurkowaniu: Fizyka, Fizjologia, Środowisko',
    description: 'Kompleksowy wykład obejmujący fizykę nurkowania (prawa gazowe), fizjologię (urazy ciśnieniowe, toksyczność gazów), teorię dekompresji oraz środowisko wodne.',
    icon: 'fa-microscope',
    audioSrc: 'lectures/science-physics/Fizyka_nurkowania_na_głębokim_i_zimnym_wraku.m4a',
    duration: '25 min',
    content: [
        {
            type: 'header',
            level: 2,
            value: 'Część 1: Fizyka Nurkowania'
        },
        {
            type: 'paragraph',
            value: 'Fizyka jest fundamentem zrozumienia, jak środowisko wodne oddziałuje na organizm nurka i jego sprzęt. Bez tej wiedzy nie sposób bezpiecznie planować głębokich nurkowań czy zrozumieć mechanizmów urazów,.'
        },
        {
            type: 'header',
            level: 3,
            value: 'Ciśnienie i Prawa Gazowe'
        },
        {
            type: 'paragraph',
            value: 'Zrozumienie ciśnienia jest kluczowe. Na powierzchni, na poziomie morza, ciśnienie atmosferyczne wynosi 1 bar (lub 1 atm). W wodzie słonej ciśnienie wzrasta o 1 bar co każde 10 metrów głębokości (w wodzie słodkiej co 10,3 m, ale dla uproszczenia w SSI przyjmuje się 10 m = 1 bar).'
        },
        {
            type: 'paragraph',
            value: '<strong>Ciśnienie bezwzględne (całkowite):</strong> To suma ciśnienia atmosferycznego i hydrostatycznego (wody).'
        },
        {
            type: 'list',
            items: [
                'Na 0 m = 1 bar.',
                'Na 10 m = 2 bary.',
                'Na 30 m = 4 bary.'
            ]
        },
        {
            type: 'header',
            level: 4,
            value: 'Prawo Boyle’a-Mariotte’a (Objętość a Ciśnienie)'
        },
        {
            type: 'list',
            items: [
                '<strong>Definicja:</strong> W stałej temperaturze objętość danej masy gazu jest odwrotnie proporcjonalna do ciśnienia absolutnego.',
                '<strong>Zastosowanie:</strong> Wyjaśnia, dlaczego powietrze w płucach, BCD czy skafandrze rozpręża się przy wynurzaniu i kurczy przy zanurzaniu. Największe zmiany objętości zachodzą w przedziale 0–10 m (zmiana o 50%), co czyni tę strefę najbardziej krytyczną dla urazów ciśnieniowych płuc i problemów z wyrównywaniem ciśnienia,.',
                '<strong>Wzór:</strong> P1 × V1 = P2 × V2.'
            ]
        },
        {
            type: 'header',
            level: 4,
            value: 'Prawo Charlesa (Temperatura a Ciśnienie/Objętość)'
        },
        {
            type: 'list',
            items: [
                '<strong>Zastosowanie:</strong> W stałej objętości (butla nurkowa), wzrost temperatury powoduje wzrost ciśnienia, a spadek temperatury – spadek ciśnienia. Dlatego butla nagrzana na słońcu pokaże wyższe ciśnienie niż po wejściu do zimnej wody. Zmiana o 1°C powoduje zmianę ciśnienia o ok. 0,6 bara w pełnej butli.'
            ]
        },
        {
            type: 'header',
            level: 4,
            value: 'Prawo Daltona (Ciśnienia Parcjalne)'
        },
        {
            type: 'list',
            items: [
                '<strong>Definicja:</strong> Ciśnienie całkowite mieszaniny gazów jest sumą ciśnień parcjalnych poszczególnych składników.',
                '<strong>Zastosowanie:</strong> Kluczowe dla Nitroksu i Trimiksu. Pozwala obliczyć ryzyko toksyczności tlenowej (ppO2) i narkozy azotowej.',
                '<strong>Wzór:</strong> P_total = ppGas1 + ppGas2 + …',
                '<strong>Przykład:</strong> Powietrze na 30 m (4 bary): ppO2 = 0,21 × 4 = 0,84 bar; ppN2 = 0,79 × 4 = 3,16 bar,.'
            ]
        },
        {
            type: 'header',
            level: 4,
            value: 'Prawo Henry’ego (Rozpuszczalność gazów)'
        },
        {
            type: 'list',
            items: [
                '<strong>Definicja:</strong> Ilość gazu, która rozpuści się w cieczy, jest wprost proporcjonalna do ciśnienia parcjalnego tego gazu nad cieczą.',
                '<strong>Zastosowanie:</strong> To podstawa teorii dekompresji. Tłumaczy, dlaczego azot nasyca tkanki podczas nurkowania (wzrost ciśnienia) i uwalnia się podczas wynurzania (spadek ciśnienia). Zbyt szybkie wynurzenie powoduje, że gaz uwalnia się w postaci pęcherzyków (efekt butelki szampana), prowadząc do DCS.'
            ]
        },
        {
            type: 'header',
            level: 3,
            value: 'Prawo Archimedesa i Pływalność'
        },
        {
            type: 'list',
            items: [
                '<strong>Definicja:</strong> Na ciało zanurzone w cieczy działa siła wyporu skierowana ku górze, równa ciężarowi wypartej cieczy.',
                '<strong>Rodzaje pływalności:</strong> Dodatnia (obiekt lżejszy od wypartej wody), Ujemna (cięższy), Neutralna (waży tyle samo).',
                '<strong>Zastosowanie:</strong> Woda słona jest gęstsza od słodkiej (1,03 kg/l vs 1,0 kg/l), dlatego w morzu nurek potrzebuje więcej balastu niż w jeziorze,.'
            ]
        },
        {
            type: 'header',
            level: 3,
            value: 'Optyka i Akustyka'
        },
        {
            type: 'list',
            items: [
                '<strong>Światło:</strong> Woda pochłania światło (absorpcja). Najszybciej znika kolor czerwony (już na ok. 5 m), potem pomarańczowy i żółty. Obiekty pod wodą wydają się o 33% większe i o 25% bliższe (refrakcja).',
                '<strong>Dźwięk:</strong> Rozchodzi się w wodzie ok. 4 razy szybciej niż w powietrzu. Ludzki mózg nie potrafi określić kierunku dźwięku pod wodą (brak różnicy czasu dotarcia do uszu).'
            ]
        },
        { type: 'image', src: 'lectures/science-physics/Prawa fizyki.png', alt: 'Infografika: Prawa Fizyki w Nurkowaniu' },
        {
            type: 'html',
            value: '<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 40px 0;">'
        },
        {
            type: 'header',
            level: 2,
            value: 'Część 2: Fizjologia i Patofizjologia'
        },
        {
            type: 'paragraph',
            value: 'Zrozumienie reakcji organizmu na ciśnienie pozwala unikać zagrożeń.'
        },
        {
            type: 'header',
            level: 3,
            value: 'Układ Oddechowy i Krążenia'
        },
        {
            type: 'list',
            items: [
                '<strong>Przestrzeń martwa:</strong> Objętość powietrza w drogach oddechowych, która nie bierze udziału w wymianie gazowej. Fajka i automat zwiększają tę przestrzeń, co przy płytkim oddechu może prowadzić do gromadzenia się CO2. Należy oddychać głęboko i powoli.',
                '<strong>Odruch nurkowy ssaków:</strong> Kontakt twarzy z zimną wodą powoduje zwolnienie akcji serca (bradykardia) i obkurczenie naczyń obwodowych (blood shift) – mechanizm przetrwania widoczny zwłaszcza we freedivingu.'
            ]
        },
        {
            type: 'header',
            level: 3,
            value: 'Urazy Ciśnieniowe (Barotraumy)'
        },
        {
            type: 'paragraph',
            value: 'Wynikają z różnicy ciśnień między przestrzeniami gazowymi w ciele a otoczeniem, zgodnie z Prawem Boyle’a.'
        },
        {
            type: 'list',
            items: [
                '<strong>Przy zanurzaniu (Squeeze/Ucisk):</strong> Jeśli nie wyrównamy ciśnienia, malejąca objętość gazu powoduje wklęśnięcie błony bębenkowej (ucho), ból zatok lub ucisk maski (oczy).',
                '<strong>Przy wynurzaniu (Rozprężanie):</strong>'
            ]
        },
        {
            type: 'list',
            items: [
                '<strong>Uraz ciśnieniowy płuc (UCP):</strong> Najgroźniejszy. Wstrzymanie oddechu przy wynurzaniu powoduje rozerwanie pęcherzyków płucnych. Może prowadzić do Odmy (powietrze w jamie opłucnej), Odmy śródpiersiowej lub Zatoru Gazowego (AGE – pęcherzyki wchodzą do krwiobiegu i blokują przepływ krwi do mózgu). AGE daje objawy natychmiastowe (utrata przytomności, paraliż) i wymaga natychmiastowego podania tlenu i ewakuacji,.'
            ]
        },
        { type: 'image', src: 'lectures/science-physics/Fizjologia i patofizjologia 1.png', alt: 'Infografika: Fizjologia i Patofizjologia Nurkowania cz. 1' },
        {
            type: 'header',
            level: 3,
            value: 'Toksyczność Gazów'
        },
        {
            type: 'list',
            items: [
                '<strong>Narkoza Azotowa:</strong> Wpływ azotu na układ nerwowy pod ciśnieniem (Prawo Daltona). Objawy przypominają upojenie alkoholowe (euforia, spowolnienie reakcji, lęk). Zaczyna być odczuwalna zazwyczaj od 30 m. Ustępuje natychmiast po wypłyceniu,.',
                '<strong>Toksyczność Tlenowa (CNS):</strong> Tlen pod wysokim ciśnieniem parcjalnym (ppO2 >1,4 dla fazy dennej, 1,6 dla dekompresji) działa toksycznie na układ nerwowy. Główny objaw to drgawki (atak padaczkowy), co pod wodą grozi utonięciem. Inne objawy: zaburzenia wzroku (tunelowe), dzwonienie w uszach, nudności,.',
                '<strong>Zatrucie CO2 (Hiperkapnia):</strong> Wynika ze złej techniki oddechowej (zadyszka), dużej przestrzeni martwej lub zanieczyszczonego gazu. Objawy: ból głowy, duszność, panika. Należy zatrzymać się i uspokoić oddech.',
                '<strong>Zatrucie CO (Tlenek węgla):</strong> Gaz z zanieczyszczonej sprężarki. Blokuje hemoglobinę 200 razy mocniej niż tlen. Objawy: jaskrawoczerwone usta/paznokcie (rzadko widoczne pod wodą), ból głowy, utrata przytomności bez ostrzeżenia przy wynurzaniu (spadek ppO2).'
            ]
        },
        { type: 'image', src: 'lectures/science-physics/Fizjologia i patofizjologia 2.png', alt: 'Infografika: Fizjologia i Patofizjologia Nurkowania cz. 2' },
        {
            type: 'header',
            level: 3,
            value: 'Choroba Dekompresyjna (DCS)'
        },
        {
            type: 'paragraph',
            value: 'Wynika z wydzielania się pęcherzyków gazu obojętnego (azotu/helu) w tkankach (Prawo Henry’ego).'
        },
        {
            type: 'list',
            items: [
                '<strong>Typ I (Bólowy):</strong> Ból stawów, mięśni, objawy skórne (świąd, marmurkowatość).',
                '<strong>Typ II (Neurologiczny/Płucny):</strong> Poważny. Drętwienia, paraliż, utrata kontroli zwieraczy, duszność ("dławica").',
                '<strong>Czynniki ryzyka:</strong> Odwodnienie, otyłość, zimno, wysiłek po nurkowaniu, wiek, PFO (Przetrwały Otwór Owalny),.',
                '<strong>Pierwsza pomoc:</strong> 100% tlen, nawodnienie (jeśli przytomny), pozycja leżąca, transport do komory.'
            ]
        },
        {
            type: 'html',
            value: '<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 40px 0;">'
        },
        {
            type: 'header',
            level: 2,
            value: 'Część 3: Teoria Dekompresji i Sprzęt'
        },
        {
            type: 'header',
            level: 3,
            value: 'Teoria Dekompresji'
        },
        {
            type: 'list',
            items: [
                '<strong>Tkanki:</strong> Organizm modeluje się jako zestaw "przedziałów tkankowych" (szybkie – np. krew, mózg; wolne – np. kości, tłuszcz). Każda tkanka ma inny "Półokres nasycenia" (T 1/2) – czas, po którym nasyci się w 50%.',
                '<strong>Wartość M:</strong> Maksymalne dopuszczalne przesycenie, które tkanka może znieść bez tworzenia bąbelków przy wynurzaniu na daną głębokość. Przekroczenie linii M oznacza ryzyko DCS.',
                '<strong>Algorytmy:</strong> Większość komputerów rekreacyjnych używa modeli Haldanowskich (np. Bühlmann ZHL-16) lub pęcherzykowych (VPM, RGBM). Komputery śledzą nasycenie teoretycznych tkanek i wyliczają limit bezdekompresyjny (NDL),.',
                '<strong>Deep Stopy i Gradient Factors:</strong> Nowoczesne podejście (szczególnie w XR) sugeruje wykonywanie głębszych przystanków, aby kontrolować mikropęcherzyki, oraz używanie Gradient Factors do dodawania konserwatyzmu,.'
            ]
        },
        {
            type: 'header',
            level: 3,
            value: 'Sprzęt Nurkowy'
        },
        {
            type: 'list',
            items: [
                '<strong>Automaty:</strong> I stopień redukuje wysokie ciśnienie z butli (HP) do ciśnienia pośredniego (IP – ok. 9-10 bar powyżej otoczenia). II stopień redukuje IP do ciśnienia otoczenia.',
                '    ◦ Odciążone: Stałe opory oddechowe niezależnie od głębokości i ciśnienia w butli.',
                '    ◦ Zimna woda: Wymaga "suchych komór" lub wymienników ciepła, aby zapobiec zamarzaniu (efekt Joule’a-Thomsona – rozprężający się gaz gwałtownie się ochładza),.',
                '<strong>Butle:</strong> Oznaczenia, legalizacja, testy wizualne (co rok) i hydrostatyczne (co 2-5 lat w zależności od kraju, w Polsce UDT co 2 lub 5 lat dla różnych typów).'
            ]
        },
        { type: 'image', src: 'lectures/science-physics/Teoria dekompresji sprzet nurkowy.png', alt: 'Infografika: Teoria Dekompresji i Sprzęt Nurkowy' },
        {
            type: 'html',
            value: '<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 40px 0;">'
        },
        {
            type: 'header',
            level: 2,
            value: 'Część 4: Środowisko Wodne'
        },
        {
            type: 'list',
            items: [
                '<strong>Pływy i Prądy:</strong> Wywoływane przez grawitację Księżyca i Słońca. Nurkowanie najlepiej planować w czasie „wody stojącej” (między pływami). Prądy przybrzeżne (strugowe) mogą wyciągnąć nurka na morze – należy płynąć w bok, równolegle do brzegu, nie walczyć pod prąd.',
                '<strong>Ekologia:</strong> Odpowiedzialny nurek nie dotyka życia morskiego, kontroluje pływalność, by nie niszczyć raf, i rozumie łańcuchy pokarmowe,.'
            ]
        }
    ]
};
