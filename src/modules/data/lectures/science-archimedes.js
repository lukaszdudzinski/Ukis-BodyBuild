export const archimedesLecture = {
    id: 'science-archimedes',
    title: 'Prawo Archimedesa',
    description: 'Pływalność – Sztuka Latania w Wodzie. Klucz do idealnego wyważenia i trymu.',
    readTime: '15 min',
    level: 'Basic',
    icon: 'fa-anchor',
    // image removed - moved to content
    audioSrc: 'lectures/science-archimedes/archimedes_audio.m4a',
    presentationSrc: 'lectures/science-archimedes/archimedes_presentation.pdf',
    content: [
        { type: 'header', level: 2, value: 'Prawo Archimedesa – Pływalność' },
        { type: 'paragraph', value: '<strong>Wstęp:</strong> Prawo Archimedesa to ulubione prawo nurków. To dzięki niemu możemy czuć się jak w stanie nieważkości, „latać” nad rafą i nie opadać na dno jak kamień. Zrozumienie tego prawa to klucz do idealnego wyważenia (trymu).' },

        { type: 'header', level: 3, value: 'Definicja Fizyczna' },
        { type: 'paragraph', value: '<strong>Na ciało zanurzone w cieczy działa siła wyporu skierowana pionowo do góry, równa ciężarowi cieczy wypartej przez to ciało.</strong>' },

        { type: 'header', level: 3, value: 'Wzory i Zależności' },
        {
            type: 'list', items: [
                '<strong>Pływalność Ujemna (Toniesz):</strong> Obiekt waży więcej niż woda, którą wypiera.',
                '<strong>Pływalność Dodatnia (Pływasz):</strong> Obiekt waży mniej niż woda, którą wypiera.',
                '<strong>Pływalność Neutralna (Zavisasz):</strong> Obiekt waży dokładnie tyle samo, co wyparta woda. To cel każdego nurka!'
            ]
        },

        { type: 'header', level: 3, value: 'Praktyczne zastosowanie w nurkowaniu' },
        {
            type: 'list', items: [
                '<strong>1. Sprzęt (BCD):</strong> Kamizelka (BCD) to nic innego jak urządzenie do zmiany objętości nurka. Dmuchając w kamizelkę, zwiększasz swoją objętość (wypierasz więcej wody), więc siła wyporu rośnie – idziesz do góry. Wypuszczając powietrze, zmniejszasz objętość – opadasz.',
                '<strong>2. Balast:</strong> Ludzkie ciało i pianka neoprenowa mają zazwyczaj pływalność dodatnią. Ołów (balast) służy do zrównoważenia tej siły, abyś mógł się zanurzyć.',
                '<strong>3. Woda Słodka vs Słona:</strong> Woda słona jest gęstsza (cięższa) od słodkiej. Litr wody słonej waży ok. 1,03 kg, a słodkiej 1,00 kg. Dlatego w morzu (słona) siła wyporu jest większa i potrzebujesz więcej balastu (ok. 2-3 kg więcej) niż w jeziorze, aby się zanurzyć.'
            ]
        },
        {
            type: 'image',
            src: 'lectures/science-archimedes/archimedes_infographic.png',
            alt: 'Infografika - Prawo Archimedesa',
            caption: 'Praktyczne zastosowanie prawa Archimedesa w nurkowaniu: BCD, balast i różnica zasolenia.'
        },

        { type: 'header', level: 2, value: 'Wykład Rozszerzony: Balast i Trym' },
        { type: 'paragraph', value: 'Prawo Archimedesa determinuje, czy toniemy, czy pływamy. Kluczem jest gęstość: woda słona (1,03 kg/l) wypiera mocniej niż słodka (1,00 kg/l), co wymaga dołożenia balastu w morzu.' },

        { type: 'header', level: 3, value: 'Prawidłowe Wyważenie (Procedura)' },
        { type: 'paragraph', value: 'Nurek jest prawidłowo wyważony, gdy w pełnym sprzęcie, z pustym jacketem i normalnym wdechem, unosi się na powierzchni z linią wody na wysokości oczu. Po zrobieniu wydechu powinien powoli zatonąć.' },
        { type: 'paragraph', value: '<strong>Korekta na zużycie gazu:</strong> Pod koniec nurkowania butla jest lżejsza o ciężar zużytego powietrza (ok. 2-3 kg dla standardowej butli). Nurek musi być wyważony tak, aby utrzymać przystanek bezpieczeństwa na 5 metrach mając w butli tylko 50 bar (rezerwę). Jeśli na początku jesteś wyważony "na styk", na końcu wyrzuci Cię na powierzchnię.' },

        { type: 'header', level: 3, value: 'Rozmieszczenie Balastu (Trym)' },
        { type: 'paragraph', value: 'Nie chodzi tylko o ilość, ale o miejsce:' },
        {
            type: 'list', items: [
                '<strong>Balast zintegrowany:</strong> Wygodny, ale obciąża biodra.',
                '<strong>V-weight / P-weight (Twinset):</strong> Balast między butlami, poprawia trym, ale jest niezrzucalny.',
                '<strong>Trym:</strong> Prawidłowy trym to pozycja pozioma. Jeśli nogi opadają – przesuń balast wyżej (w stronę głowy). Jeśli głowa opada – przesuń balast niżej (na pas biodrowy).',
                '<strong>Skutki przeważenia:</strong> Zwiększone zużycie powietrza (duży opór czołowy, bo nurek płynie "pod górę"), niszczenie dna, ryzyko niekontrolowanego opadania.'
            ]
        }
    ],
    quiz: [
        {
            question: "Prawo Archimedesa opisuje:",
            options: ["Siłę wyporu działającą na ciało zanurzone.", "Rozpuszczalność gazów.", "Zmianę ciśnienia.", "Przewodnictwo cieplne."],
            correctAnswer: 0
        },
        {
            question: "Jeśli ciało waży mniej niż woda, którą wypiera, to:",
            options: ["Zatonie.", "Będzie unosić się na powierzchni (pływalność dodatnia).", "Zawiśnie w toni.", "Wybuchnie."],
            correctAnswer: 1
        },
        {
            question: "Pływalność neutralna oznacza, że:",
            options: ["Nurek idzie do góry.", "Nurek opada na dno.", "Nurek nie zmienia głębokości (wisi w toni).", "Nurek nie ma na sobie sprzętu."],
            correctAnswer: 2
        },
        {
            question: "Woda słona jest:",
            options: ["Mniej gęsta od słodkiej.", "Tak samo gęsta jak słodka.", "Bardziej gęsta od słodkiej (daje większą wyporność).", "Nie nadaje się do nurkowania."],
            correctAnswer: 2
        },
        {
            question: "Przechodząc z jeziora (woda słodka) do morza (woda słona), nurek musi:",
            options: ["Zdjąć balast.", "Dodać balast.", "Nie zmieniać balastu.", "Zmienić płetwy."],
            correctAnswer: 1
        },
        {
            question: "Kamizelka BCD służy do:",
            options: ["Ogrzewania.", "Zmiany objętości nurka i kontrolowania pływalności.", "Oddychania.", "Ochrony przed rekinami."],
            correctAnswer: 1
        },
        {
            question: "Co się dzieje z pianką neoprenową na głębokości?",
            options: ["Rozszerza się i zwiększa wyporność.", "Kompresuje się (zgodnie z Prawem Boyle’a), wypiera mniej wody i traci wyporność.", "Nie zmienia właściwości.", "Staje się cięższa."],
            correctAnswer: 1
        },
        {
            question: "Aby się zanurzyć, nurek musi mieć pływalność:",
            options: ["Dodatnią.", "Ujemną.", "Neutralną.", "Zmienną."],
            correctAnswer: 1
        },
        {
            question: "Litr wody morskiej waży około:",
            options: ["1,00 kg.", "1,03 kg.", "0,9 kg.", "2,0 kg."],
            correctAnswer: 1
        },
        {
            question: "Wydech powietrza z płuc powoduje:",
            options: ["Zwiększenie wyporności (płynięcie w górę).", "Zmniejszenie objętości klatki piersiowej i zmniejszenie wyporności (opadanie).", "Brak zmiany.", "Zwiększenie ciśnienia."],
            correctAnswer: 1
        },
        {
            question: "Głównym celem wyważenia jest osiągnięcie:",
            options: ["Pływalności ujemnej na dnie.", "Pływalności neutralnej na przystanku bezpieczeństwa z pustą butlą (rezerwa 50 bar).", "Pływalności dodatniej na dnie.", "Maksymalnego obciążenia."],
            correctAnswer: 1
        },
        {
            question: "Zrzucenie pasa balastowego pod wodą spowoduje:",
            options: ["Natychmiastowe opadnięcie na dno.", "Gwałtowne uzyskanie dodatniej pływalności i niekontrolowane wynurzenie.", "Utratę automatu.", "Nic się nie stanie."],
            correctAnswer: 1
        },
        {
            question: "Obiekt o objętości 10 litrów i wadze 12 kg w wodzie słodkiej:",
            options: ["Zatonie (wypiera 10 kg wody, a waży 12 kg).", "Wypłynie.", "Będzie neutralny.", "Zmieni kolor."],
            correctAnswer: 0
        },
        {
            question: "Dlaczego butla aluminiowa pod koniec nurkowania może \"ciągnąć\" w górę?",
            options: ["Bo aluminium pęcznieje.", "Bo ubyło z niej powietrza (które ma swoją wagę), a objętość butli się nie zmieniła.", "Bo woda jest cieplejsza.", "To niemożliwe."],
            correctAnswer: 1
        },
        {
            question: "Idealna pozycja nurka pod wodą (trym) to:",
            options: ["Pionowa (konik morski).", "Pozioma.", "Głową w dół.", "Na plecach."],
            correctAnswer: 1
        },
        {
            question: "Siła wyporu działa:",
            options: ["W dół.", "Pionowo w górę.", "W bok.", "Losowo."],
            correctAnswer: 1
        },
        {
            question: "Co jest cięższe: 1 litr wody słodkiej czy 1 litr wody słonej?",
            options: ["Słodkiej.", "Słonej.", "Ważą tyle samo.", "Zależy od głębokości."],
            correctAnswer: 1
        },
        {
            question: "Jeśli nurek jest przeważony (za dużo ołowiu):",
            options: ["Musi dodawać dużo powietrza do BCD, co zwiększa opór wody (sylwetka staje się \"duża\").", "Nurkuje mu się łatwiej.", "Zużywa mniej powietrza.", "Jest bezpieczniejszy."],
            correctAnswer: 0
        },
        {
            question: "Pływalność dodatnia na powierzchni jest konieczna, aby:",
            options: ["Odpocząć i trzymać głowę nad wodą.", "Zanurzyć się.", "Zrobić przystanek bezpieczeństwa.", "Pływać szybciej."],
            correctAnswer: 0
        },
        {
            question: "Wyporność zależy od:",
            options: ["Ciężaru ciała zanurzonego.", "Objętości wypartej cieczy i jej gęstości.", "Głębokości.", "Koloru wody."],
            correctAnswer: 1
        }
    ]
};
