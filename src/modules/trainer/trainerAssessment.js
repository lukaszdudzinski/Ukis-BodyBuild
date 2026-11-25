// Ocena funkcjonalna (spec 9.4): 7 testów w skali 0-3 (0 = ból), wynik do 21 pkt.
// Opisy i kryteria są napisane własnymi słowami, krótko.

const bi = (id, label, how, criteria) => ({ id, label, bilateral: true, how, criteria });
const uni = (id, label, how, criteria) => ({ id, label, bilateral: false, how, criteria });

export const TESTS = [
    uni('ohs', 'OHS',
        'Stopy na szerokość barków, ręce wyprostowane nad głową. Wykonaj głęboki przysiad i wróć do pozycji stojącej.',
        { 0: 'Pojawia się ból.', 1: 'Nie schodzi nisko, pięty się unoszą lub tułów mocno się pochyla.', 2: 'Schodzi nisko, ale z kompensacjami (kolana do środka, ręce opadają).', 3: 'Czysty, głęboki przysiad: tułów prosto, ręce nad głową, pięty na ziemi.' }),
    uni('wall_angel', 'Wall Angel',
        'Plecami do ściany, łokcie i nadgarstki przy ścianie. Przesuwaj ręce w górę i w dół, nie odrywając pleców.',
        { 0: 'Pojawia się ból.', 1: 'Ręce nie utrzymują kontaktu ze ścianą, plecy mocno się wyginają.', 2: 'Większość ruchu przy ścianie, lekkie odklejanie łokci lub nadgarstków.', 3: 'Cały ruch przy ścianie, bez wyginania pleców.' }),
    bi('lunge', 'Wykrok w linii',
        'Stań na desce lub linii, drążek wzdłuż pleców. Zrób wykrok i opuść tylne kolano do podłoża, osobno na każdą stronę.',
        { 0: 'Pojawia się ból.', 1: 'Traci równowagę lub nie trafia kolanem w linię.', 2: 'Wykonuje ruch, ale z chwiejnością lub odchyleniem tułowia.', 3: 'Stabilny ruch w linii, drążek dotyka pleców, tułów prosto.' }),
    bi('aslr', 'Unoszenie prostej nogi',
        'Leżąc na plecach unieś wyprostowaną nogę, druga leży płasko. Oceń, dokąd sięga kostka względem kolana drugiej nogi.',
        { 0: 'Pojawia się ból.', 1: 'Kostka nie dochodzi do wysokości kolana drugiej nogi.', 2: 'Kostka mieści się między kolanem a połową uda.', 3: 'Kostka sięga ponad połowę uda, druga noga zostaje płasko.' }),
    bi('bird_dog', 'Bird dog',
        'W podporze na czworakach wyciągnij jednocześnie rękę i przeciwną nogę, potem zbliż łokieć do kolana. Powtórz na drugą stronę.',
        { 0: 'Pojawia się ból.', 1: 'Nie utrzymuje równowagi nawet z ruchem tylko ręką lub nogą.', 2: 'Wykonuje ruch przekątny, ale z przechyłem lub odginaniem pleców.', 3: 'Płynny ruch przekątny, tułów nieruchomy i poziomy.' }),
    uni('push_up', 'Pompka stabilizująca',
        'Z pozycji leżenia przodem zrób pompkę bez zapadania się w biodrach. Ręce na wysokości czoła, a przy trudności na wysokości brody.',
        { 0: 'Pojawia się ból.', 1: 'Nie potrafi wykonać pompki bez zapadania biodrami lub odginania pleców.', 2: 'Pompka z rękami przy brodzie, ciało pozostaje w jednej linii.', 3: 'Pompka z rękami przy czole, ciało w jednej linii.' }),
    bi('rotacja', 'Rotacja tułowia',
        'W podporze na czworakach połóż dłoń na karku, potem obróć łokieć w stronę drugiej ręki i w górę, osobno na każdą stronę.',
        { 0: 'Pojawia się ból.', 1: 'Łokieć ledwo się unosi, miednica ucieka do tyłu.', 2: 'Łokieć dociera w okolice drugiego łokcia, z niewielką kompensacją.', 3: 'Łokieć dotyka drugiego łokcia i unosi się wysoko, miednica stabilna.' }),
];

export const EXTRA_TESTS = [
    { id: 'ankle', label: 'Mobilność stawu skokowego', unit: 'cm', norm: 7,
      how: 'Przy ścianie przesuwaj stopę tak daleko, by kolano nadal dotykało ściany, a pięta zostawała na ziemi. Zmierz odległość palców od ściany.' },
    { id: 'thomas', label: 'Test Thomasa',
      how: 'Leżąc na brzegu leżanki przyciągnij jedno kolano do klatki. Opisz położenie opuszczonej nogi: czy udo i podudzie opadają swobodnie.' },
];

// Zwraca [wartości stron] albo null, gdy test nie ma kompletu wyników.
function sides(test, r) {
    if (!r) return null;
    if (!test.bilateral) return Number.isInteger(r.score) ? [r.score] : null;
    return Number.isInteger(r.left) && Number.isInteger(r.right) ? [r.left, r.right] : null;
}

export function scoreAssessment(results = {}) {
    let total = 0;
    let scored = 0;
    const pain = [];
    const asymmetry = [];
    for (const t of TESTS) {
        const r = results[t.id];
        const vals = sides(t, r);
        const known = r ? (t.bilateral ? [r.left, r.right] : [r.score]).filter(Number.isInteger) : [];
        if (known.includes(0)) pain.push(t.id);
        if (!vals) continue;
        scored += 1;
        total += Math.min(...vals);
        if (vals.length === 2 && vals[0] !== vals[1]) asymmetry.push(t.id);
    }
    return { total, max: 21, pain, asymmetry, complete: scored === TESTS.length };
}

export function compareAssessments(prev = {}, curr = {}) {
    const out = {};
    for (const t of TESTS) {
        const a = sides(t, prev[t.id]);
        const b = sides(t, curr[t.id]);
        if (!a || !b) continue;
        const x = Math.min(...a);
        const y = Math.min(...b);
        out[t.id] = y > x ? 'up' : y < x ? 'down' : 'same';
    }
    return out;
}
