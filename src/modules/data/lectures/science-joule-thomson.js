export const jouleThomsonLecture = {
    id: 'science-joule-thomson',
    title: 'Prawo Joule’a-Thomsona',
    description: 'Zimno z Ciśnienia – Dlaczego Automaty Zamarzają? Termodynamika w służbie sprzętu.',
    readTime: '15 min',
    level: 'Advanced',
    icon: 'fa-snowflake',
    // image removed - moved to content
    audioSrc: 'lectures/science-joule-thomson/joule_audio.m4a',
    presentationSrc: 'lectures/science-joule-thomson/joule_presentation.pdf',
    content: [
        { type: 'header', level: 2, value: 'Prawo Joule’a-Thomsona – Zimno z Ciśnienia' },
        { type: 'paragraph', value: '<strong>Wstęp:</strong> Często słyszy się o zamarzających automatach w zimnych polskich wodach. Za to zjawisko odpowiada termodynamika, a konkretnie efekt Joule’a-Thomsona (często omawiany w parze z Prawami Charlesa/Gay-Lussaca dotyczącymi temperatury).' },

        { type: 'header', level: 3, value: 'Definicja Fizyczna' },
        { type: 'paragraph', value: 'Efekt ten opisuje zmianę temperatury gazu podczas jego rozprężania przez zawór (dławienie), gdy nie wymienia on ciepła z otoczeniem. <strong>Prosto: Gdy sprężony gaz gwałtownie się rozpręża (z bardzo wysokiego ciśnienia do niskiego), jego temperatura drastycznie spada.</strong>' },

        { type: 'header', level: 3, value: 'Zastosowanie w Nurkowaniu' },
        { type: 'paragraph', value: 'W I stopniu automatu oddechowego powietrze z butli (pod ciśnieniem np. 200 barów) jest redukowane do ciśnienia średniego (ok. 10 barów). To ogromny spadek ciśnienia w ułamku sekundy.' },
        {
            type: 'list', items: [
                '<strong>1. Gwałtowne chłodzenie:</strong> Zgodnie z efektem Joule’a-Thomsona, w miejscu rozprężania (wewnątrz automatu) temperatura spada tak bardzo, że może osiągnąć -30°C, nawet jeśli woda dookoła ma +4°C.',
                '<strong>2. Mechanizm zamarzania:</strong> Jeśli w powietrzu w butli jest wilgoć, skrapla się ona i natychmiast zamarza, tworząc kryształki lodu. Lód może zablokować tłok lub membranę w pozycji otwartej.',
                '<strong>3. Efekt:</strong> Automat się "wzbudza" – następuje niekontrolowany wypływ powietrza (free-flow).'
            ]
        },
        {
            type: 'image',
            src: 'lectures/science-joule-thomson/joule_infographic.png',
            alt: 'Infografika - Prawo Joule’a-Thomsona',
            caption: 'Zamarzanie automatu: spadek temperatury przy rozprężaniu gazu.'
        },

        { type: 'header', level: 3, value: 'Problemy i Zapobieganie' },
        { type: 'paragraph', value: 'Wzbudzenie automatu to niebezpieczna sytuacja, w której tracisz zapas powietrza w kilka minut.' },
        {
            type: 'list', items: [
                '<strong>Profilaktyka:</strong>',
                'W zimnych wodach unikaj szybkiego oddychania (duży przepływ = większe chłodzenie).',
                'Nie pompuj BCD i nie oddychaj jednocześnie podczas wchodzenia do zimnej wody.',
                'Używaj automatów przystosowanych do zimnych wód (z tzw. suchą komorą).'
            ]
        },
        { type: 'header', level: 2, value: 'Wykład Rozszerzony: Termodynamika Awarii' },
        { type: 'paragraph', value: 'Spadek ciśnienia gazu powoduje gwałtowny spadek temperatury (nawet o 0,17°C na każdy bar spadku ciśnienia dla powietrza). W I stopniu ciśnienie spada z 200 bar do ok. 10 bar. Wewnątrz automatu temperatura może spaść do -30°C.' },

        { type: 'header', level: 3, value: 'Mechanizm Zamarzania' },
        {
            type: 'list', items: [
                '<strong>I stopień:</strong> Jeśli woda dostanie się do komory sprężyny (w automatach tłokowych lub membranowych bez izolacji), lód zablokuje mechanizm w pozycji otwartej. Skutek: gwałtowny wzrost ciśnienia międzystopniowego i wzbudzenie II stopnia.<br><em>Rozwiązanie:</em> Sucha komora (wypełniona powietrzem lub olejem/glikolem), która izoluje mechanizm od wody.',
                '<strong>II stopień:</strong> Wilgoć z wydychanego powietrza skrapla się na dźwigni dozownika. Rozprężający się gaz zamraża tę wilgoć, blokując dźwignię w pozycji "wciśniętej" (otwartej). Skutek: Free-flow (stały wydatek).'
            ]
        },

        { type: 'header', level: 3, value: 'Czynniki sprzyjające zamarzaniu' },
        {
            type: 'list', items: [
                'Wilgoć w butli (zła jakość powietrza).',
                'Wysoki przepływ gazu: szybkie oddychanie, używanie inflatora i oddychanie w tym samym czasie, wciśnięcie przycisku by-pass (pucka) na powierzchni.',
                'Temperatura wody poniżej 10°C (norma EN250 dla automatów zimnowodnych).'
            ]
        },

        { type: 'header', level: 3, value: 'Postępowanie przy wzbudzeniu (Free-flow)' },
        {
            type: 'list', items: [
                '1. Nie zamykaj ustnika dłonią (ryzyko rozerwania płuc przez ciśnienie).',
                '2. Oddychaj z "syczącego" automatu, trzymając go lekko w ustach, pozwalając nadmiarowi gazu uciekać bokiem.',
                '3. Przejdź na zapasowe źródło powietrza (octopus/partner).',
                '4. Zakręć zawór zamarzniętej butli (jeśli masz twinset/sidemount lub robi to partner).',
                '5. Przerwij nurkowanie.'
            ]
        }
    ],
    quiz: [
        {
            question: "Efekt Joule’a-Thomsona dotyczy:",
            options: ["Zmiany temperatury gazu podczas jego swobodnego rozprężania.", "Wyporności.", "Toksyczności tlenowej.", "Rozpuszczalności gazów."],
            correctAnswer: 0
        },
        {
            question: "Podczas gwałtownego rozprężania powietrza z 200 bar do 10 bar temperatura gazu:",
            options: ["Rośnie.", "Drastycznie spada.", "Pozostaje bez zmian.", "Zależy od zasolenia wody."],
            correctAnswer: 1
        },
        {
            question: "Głównym skutkiem efektu Joule’a-Thomsona w nurkowaniu jest:",
            options: ["Przegrzanie butli przy ładowaniu.", "Zamarzanie I stopnia automatu oddechowego.", "Zaparowanie maski.", "Narkoza azotowa."],
            correctAnswer: 1
        },
        {
            question: "Co się dzieje, gdy automat zamarznie (zablokuje się w pozycji otwartej)?",
            options: ["Przestaje podawać powietrze.", "Następuje niekontrolowany wypływ powietrza (free-flow).", "Powietrze zmienia smak.", "Automat odpada od butli."],
            correctAnswer: 1
        },
        {
            question: "Co sprzyja zamarzaniu automatu?",
            options: ["Wilgoć w powietrzu w butli.", "Ciepła woda.", "Wolne oddychanie.", "Płytkie zanurzenie."],
            correctAnswer: 0
        },
        {
            question: "Jak nurek może zmniejszyć ryzyko zamarznięcia automatu?",
            options: ["Oddychając spokojnie i nie używając inflatora jednocześnie z wdechem.", "Oddychając bardzo szybko.", "Używając automatu bez serwisu.", "Smarując automat tłuszczem."],
            correctAnswer: 0
        },
        {
            question: "Temperatura wewnątrz I stopnia podczas pracy może spaść do:",
            options: ["0°C.", "-5°C.", "Nawet -30°C.", "Pozostaje równa temperaturze wody."],
            correctAnswer: 2
        },
        {
            question: "Automat „z suchą komorą” jest odporny na zamarzanie, ponieważ:",
            options: ["Mechanizm wodny jest odizolowany od wody otoczenia (która mogłaby zamarznąć).", "Podgrzewa powietrze elektrycznie.", "Jest wykonany z plastiku.", "Ma wbudowaną grzałkę."],
            correctAnswer: 0
        },
        {
            question: "Czy automat może zamarznąć w wodzie o temperaturze +10°C?",
            options: ["Tak, z powodu efektu Joule’a-Thomsona wewnątrz automatu.", "Nie, woda jest za ciepła.", "Tylko jeśli jest zepsuty.", "Tak, ale tylko w nocy."],
            correctAnswer: 0
        },
        {
            question: "Jeśli automat wzbudzi się pod wodą, należy:",
            options: ["Wypłynąć na wstrzymanym oddechu.", "Przejść na zapasowe źródło powietrza i zakończyć nurkowanie (zakręcając wzbudzoną butlę, jeśli to możliwe).", "Zatkać ustnik ręką.", "Czekać, aż przestane syczeć."],
            correctAnswer: 1
        },
        {
            question: "Podczas napełniania butli (sprężania gazu) temperatura butli:",
            options: ["Spada.", "Rośnie (odwrotność rozprężania).", "Nie zmienia się.", "Butla pęka."],
            correctAnswer: 1
        },
        {
            question: "Wilgotne powietrze w butli zwiększa ryzyko:",
            options: ["Zamarznięcia automatu (korki lodowe).", "Lepszego nawilżenia gardła.", "Dłuższego nurkowania.", "Poprawy smaku powietrza."],
            correctAnswer: 0
        },
        {
            question: "Przycisk dodawczy (inflator) w BCD również może zamarznąć przy szybkim pompowaniu:",
            options: ["Prawda.", "Fałsz."],
            correctAnswer: 0
        },
        {
            question: "Efekt Joule’a-Thomsona jest najbardziej widoczny przy:",
            options: ["Dużej różnicy ciśnień (wysokie ciśnienie w butli).", "Małej różnicy ciśnień.", "Pustej butli.", "Na powierzchni."],
            correctAnswer: 0
        },
        {
            question: "Czy oddychanie z automatu na powierzchni w mroźny dzień jest bezpieczne?",
            options: ["Tak.", "Nie, wilgoć z wydechu i niska temperatura powietrza mogą spowodować zamarznięcie II stopnia jeszcze przed wejściem do wody.", "Jest obojętne.", "Tak, to rozgrzewa automat."],
            correctAnswer: 1
        },
        {
            question: "Woda w butli nurkowej to wynik:",
            options: ["Złej pracy sprężarki (filtrów).", "Naturalnego procesu.", "Prawa Archimedesa.", "Działania słońca."],
            correctAnswer: 0
        },
        {
            question: "Jeśli widzisz kryształki lodu na I stopniu automatu pod wodą, oznacza to:",
            options: ["Że woda jest bardzo czysta.", "Że automat pracuje w ekstremalnie niskiej temperaturze i grozi zamarznięciem.", "Że jest uszkodzony.", "Nic, to normalne."],
            correctAnswer: 1
        },
        {
            question: "Dlaczego nie należy naciskać przycisku bypass (pucka) na II stopniu bez potrzeby w zimnej wodzie?",
            options: ["Powoduje to duży przepływ gazu i silne chłodzenie.", "Zużywa baterię.", "Płoszy ryby.", "Psuje membranę."],
            correctAnswer: 0
        },
        {
            question: "Kiedy ryzyko zamarznięcia jest największe?",
            options: ["Na początku nurkowania (wysokie ciśnienie w butli + duży przepływ przy pompowaniu BCD).", "Na końcu nurkowania.", "W połowie.", "Podczas przerwy na powierzchni."],
            correctAnswer: 0
        },
        {
            question: "Nazwa zjawiska fizycznego wyjaśniającego chłodzenie przy rozprężaniu to:",
            options: ["Prawo Daltona.", "Efekt Joule’a-Thomsona.", "Prawo Archimedesa.", "Efekt Dopplera."],
            correctAnswer: 1
        }
    ]
};
