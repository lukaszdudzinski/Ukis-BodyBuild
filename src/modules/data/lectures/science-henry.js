export const henryLecture = {
    id: 'science-henry',
    title: 'Prawo Henry’ego',
    description: 'Gazy w Twojej Krwi – Nasycanie i Dekompresja. Klucz do zrozumienia choroby dekompresyjnej i narkozy azotowej.',
    readTime: '15 min',
    level: 'Advanced',
    icon: 'fa-flask',
    // image removed - moved to content
    audioSrc: 'lectures/science-henry/henry_audio.m4a',
    presentationSrc: 'lectures/science-henry/henry_presentation.pdf',
    content: [
        { type: 'header', level: 2, value: 'Prawo Henry’ego – Gazy w Twojej Krwi' },
        { type: 'paragraph', value: '<strong>Wstęp:</strong> Prawo Henry’ego to klucz do zrozumienia choroby dekompresyjnej (DCS) i narkozy azotowej. O ile Prawo Boyle’a działa natychmiastowo (mechanicznie), Prawo Henry’ego działa w czasie – to procesy biochemiczne zachodzące w Twojej krwi i tkankach.' },

        { type: 'header', level: 3, value: 'Definicja Fizyczna' },
        { type: 'paragraph', value: '<strong>Ilość gazu, która rozpuści się w cieczy, jest wprost proporcjonalna do ciśnienia parcjalnego tego gazu nad cieczą (w stałej temperaturze).</strong>' },
        { type: 'paragraph', value: 'Wyobraź sobie butelkę wody gazowanej. Zanim ją odkręcisz, gaz jest "wciśnięty" w płyn pod ciśnieniem (nie widać bąbelków). Gdy odkręcasz nakrętkę (zmniejszasz ciśnienie), gaz gwałtownie ucieka w postaci bąbelków.' },

        { type: 'header', level: 3, value: 'Zastosowanie w Nurkowaniu' },
        {
            type: 'list', items: [
                '<strong>1. Saturacja (Nasycanie):</strong> Podczas nurkowania oddychasz powietrzem pod zwiększonym ciśnieniem. Azot (gaz obojętny) wnika do Twoich płuc, a stamtąd pod ciśnieniem jest "wpychany" do krwi i tkanek. Im głębiej i dłużej nurkujesz, tym więcej azotu rozpuszcza się w Twoim ciele.',
                '<strong>2. Desaturacja (Odsycanie):</strong> Podczas wynurzania ciśnienie spada. Rozpuszczony w tkankach azot chce się wydostać. Jeśli wynurzasz się powoli, azot bezpiecznie wraca krwią do płuc i jest wydychany.',
                '<strong>3. Choroba Dekompresyjna (Efekt butelki szampana):</strong> Jeśli wynurzysz się zbyt szybko (jak gwałtowne odkręcenie butelki), azot nie zdąży spokojnie opuścić tkanek i wydzieli się w postaci pęcherzyków bezpośrednio we krwi, stawach lub mózgu. To jest istota DCS.'
            ]
        },
        {
            type: 'image',
            src: 'lectures/science-henry/henry_infographic.png',
            alt: 'Infografika - Prawo Henry’ego',
            caption: 'Nasycanie (saturacja) i odsycanie (desaturacja) gazów w organizmie nurka.'
        },

        { type: 'header', level: 3, value: 'Wiązane problemy' },
        {
            type: 'list', items: [
                '<strong>Choroba Dekompresyjna (DCS):</strong> Pęcherzyki gazu blokują przepływ krwi lub uciskają nerwy.',
                '<strong>Narkoza Azotowa:</strong> Wysokie ciśnienie parcjalne azotu rozpuszczonego w tkankach nerwowych zakłóca przesyłanie sygnałów (efekt "pijanego nurka").'
            ]
        },

        { type: 'info-box', style: 'warning', title: 'Pamiętaj!', content: 'Przestrzegaj limitów bezdekompresyjnych i prędkości wynurzania. Wykonuj przystanek bezpieczeństwa (Safety Stop), aby dać organizmowi czas na "odgazowanie" przed ostatecznym wynurzeniem.' },

        { type: 'header', level: 2, value: 'Wykład Rozszerzony: Mechanizm Bąbelkowy' },
        { type: 'paragraph', value: 'Prawo Henry’ego mówi, że rozpuszczalność gazu zależy od ciśnienia parcjalnego. DCS (Decompression Sickness) to efekt zbyt szybkiego uwolnienia gazu (azotu), który zamiast zostać wydalony przez płuca (cicha desaturacja), tworzy pęcherzyki w tkankach.' },

        { type: 'header', level: 3, value: 'Mechanizm powstawania' },
        { type: 'paragraph', value: 'Podczas nurkowania tkanki nasycają się azotem (saturacja). Tkanki szybkie (krew, mózg) nasycają się i odsycaną szybko. Tkanki wolne (kości, tłuszcz, stawy) kumulują azot powoli, ale też powoli go oddają. DCS występuje, gdy nurek przekroczy limit (wartość M) i ciśnienie otoczenia spadnie zbyt gwałtownie.' },

        { type: 'header', level: 3, value: 'Typy DCS' },
        {
            type: 'list', items: [
                '<strong>Typ I (Łagodny):</strong> Ból stawów i mięśni (bark, łokieć, kolano) – pęcherzyki uciskają zakończenia nerwowe. Skóra: świąd, wysypka, marmurkowatość.',
                '<strong>Typ II (Ciężki - Neurologiczny/Płucny):</strong>',
                '— <em>Rdzeniowy:</em> Pęcherzyki w rdzeniu kręgowym. Objawy: drętwienie kończyn, paraliż, utrata kontroli nad zwieraczami.',
                '— <em>Mózgowy:</em> Zaburzenia widzenia, utrata przytomności.',
                '— <em>Płucny (Dławica/Chokes):</em> Zablokowanie krążenia płucnego przez masywne pęcherzyki. Objawy: duszność, ból w klatce, suchy kaszel.'
            ]
        },

        { type: 'header', level: 3, value: 'Czynniki Ryzyka (Predysponujące)' },
        { type: 'paragraph', value: 'Odwodnienie (zagęszcza krew, utrudnia eliminację gazu), zimno (gorsze ukrwienie obwodowe), otyłość (azot świetnie rozpuszcza się w tłuszczu), wysiłek fizyczny po nurkowaniu, wiek, PFO (przetrwały otwór owalny w sercu).' },

        { type: 'header', level: 3, value: 'Profilaktyka' },
        {
            type: 'list', items: [
                'Prędkość wynurzania max. 10 m/min.',
                'Przystanek bezpieczeństwa (3-5 min na 5 m).',
                'Nawadnianie organizmu.',
                'Unikanie profili "piłokształtnych" (jo-jo).'
            ]
        }
    ],
    quiz: [
        {
            question: "Prawo Henry’ego opisuje:",
            options: ["Zmianę objętości gazów.", "Rozpuszczalność gazów w cieczach w zależności od ciśnienia.", "Siłę wyporu.", "Zamarzanie automatów."],
            correctAnswer: 1
        },
        {
            question: "Co dzieje się z azotem w organizmie podczas zanurzania?",
            options: ["Jest wydalany.", "Rozpuszcza się w tkankach (saturacja).", "Zmienia się w tlen.", "Nie ma żadnego wpływu."],
            correctAnswer: 1
        },
        {
            question: "Nagłe otwarcie wstrząśniętej butelki z napojem gazowanym to analogia do:",
            options: ["Narkozy azotowej.", "Urazu ciśnieniowego ucha.", "Szybkiego wynurzania i choroby dekompresyjnej.", "Hipotermii."],
            correctAnswer: 2
        },
        {
            question: "Który gaz jest głównym winowajcą choroby dekompresyjnej przy nurkowaniu powietrznym?",
            options: ["Tlen.", "Dwutlenek węgla.", "Azot.", "Hel."],
            correctAnswer: 2
        },
        {
            question: "Aby uniknąć tworzenia się pęcherzyków gazu we krwi, należy:",
            options: ["Wynurzać się powoli (zgodnie z limitami).", "Wynurzać się jak najszybciej.", "Wstrzymać oddech.", "Pić mało wody."],
            correctAnswer: 0
        },
        {
            question: "Przystanek bezpieczeństwa (Safety Stop) służy do:",
            options: ["Podziwiania widoków.", "Umożliwienia wydalenia nadmiaru azotu przed wyjściem na powierzchnię.", "Sprawdzenia sprzętu.", "Ogrzania się."],
            correctAnswer: 1
        },
        {
            question: "Zjawisko narkozy azotowej wynika z:",
            options: ["Zwiększonej rozpuszczalności azotu w tkankach nerwowych pod ciśnieniem.", "Braku tlenu.", "Zbyt szybkiego wynurzania.", "Zimnej wody."],
            correctAnswer: 0
        },
        {
            question: "Im głębiej nurkujesz, tym:",
            options: ["Mniej gazu rozpuszcza się w tkankach.", "Więcej gazu rozpuszcza się w tkankach.", "Głębokość nie ma wpływu na nasycanie.", "Szybciej zużywasz tlen, ale nie azot."],
            correctAnswer: 1
        },
        {
            question: "Desaturacja to proces:",
            options: ["Wchłaniania gazu.", "Uwalniania gazu z tkanek podczas wynurzania i po nurkowaniu.", "Zamiany azotu w tlen.", "Sprężania gazu."],
            correctAnswer: 1
        },
        {
            question: "Czy po wyjściu z wody proces uwalniania azotu się kończy?",
            options: ["Tak, natychmiast.", "Nie, trwa jeszcze przez wiele godzin.", "Tak, po 5 minutach.", "Zależy od temperatury powietrza."],
            correctAnswer: 1
        },
        {
            question: "Prawo Henry’ego mówi, że ilość rozpuszczonego gazu zależy od:",
            options: ["Tylko temperatury.", "Ciśnienia parcjalnego gazu nad cieczą.", "Kształtu zbiornika.", "Koloru cieczy."],
            correctAnswer: 1
        },
        {
            question: "„Ciche pęcherzyki” (Silent bubbles) to:",
            options: ["Pęcherzyki, które nie dają objawów DCS, ale są obecne po nurkowaniu.", "Pęcherzyki w butli.", "Błąd sprzętowy.", "Pęcherzyki wydychane przez automat."],
            correctAnswer: 0
        },
        {
            question: "Dlaczego nie wolno latać samolotem zaraz po nurkowaniu?",
            options: ["Bo w samolocie jest niższe ciśnienie, co może wywołać chorobę dekompresyjną (zgodnie z prawem Henry’ego).", "Bo można uszkodzić słuch.", "Bo sprzęt nurkowy jest ciężki.", "Nie ma przeciwwskazań."],
            correctAnswer: 0
        },
        {
            question: "Co przyspiesza nasycanie tkanek azotem?",
            options: ["Głębokość i czas nurkowania.", "Tylko głębokość.", "Tylko czas.", "Kolor skafandra."],
            correctAnswer: 0
        },
        {
            question: "Która tkanka nasyca się najszybciej?",
            options: ["Kości.", "Tłuszcz.", "Krew.", "Chrząstki."],
            correctAnswer: 2
        },
        {
            question: "Choroba dekompresyjna typu I dotyczy głównie:",
            options: ["Układu nerwowego.", "Skóry i stawów (ból).", "Płuc.", "Oczu."],
            correctAnswer: 1
        },
        {
            question: "Co robić przy podejrzeniu DCS?",
            options: ["Podać tlen i wezwać pomoc.", "Wrócić pod wodę (rekompresja w wodzie).", "Podać alkohol.", "Kazać poszkodowanemu biegać."],
            correctAnswer: 0
        },
        {
            question: "Termin „czas bezdekompresyjny” oznacza:",
            options: ["Czas, po którym kończy się powietrze.", "Maksymalny czas na danej głębokości, po którym można wynurzyć się bezpośrednio na powierzchnię (z przystankiem bezpieczeństwa) bez obowiązkowych przystanków dekompresyjnych.", "Czas do zachodu słońca.", "Czas trwania całego nurkowania."],
            correctAnswer: 1
        },
        {
            question: "Współczynnik rozpuszczalności gazu zmienia się wraz z:",
            options: ["Temperaturą.", "Pora dnia.", "Ilością światła.", "Prądem wody."],
            correctAnswer: 0
        },
        {
            question: "Czy tlen również rozpuszcza się w krwi zgodnie z prawem Henry’ego?",
            options: ["Nie, tylko azot.", "Tak, ale jest zużywany w procesach metabolicznych.", "Tak, i to on powoduje DCS.", "Nie, tlen jest transportowany inaczej."],
            correctAnswer: 1
        }
    ]
};
