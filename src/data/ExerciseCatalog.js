// Katalog ćwiczeń BodyBuild. Od 2026-11-27 główne są nazwy z materiałów właściciela
// („2.5. Rodzaje ćwiczeń – wzorce ruchowe”; transkrypcja w testach jednostkowych katalogu):
// polska nazwa (name), angielski odpowiednik (en) i wzorzec ruchowy (wzorzec, etykiety w movementPatterns.js).
// Dawne nazwy tego samego ćwiczenia zostają jako aliasy: zapisane treningi, szablony, Zeszyt, plany trenera
// i rekordy ich używają i nigdy nie są przepisywane. Ćwiczenia spoza materiałów zostają bez zmian.
// Ćwiczenia własne użytkownika (uki_custom_exercises) są poza katalogiem.
// bodyweight: część ciężaru ciała doliczana do tonażu (dotychczasowe współczynniki: pompki 0,65, podciąganie 1);
// bodyweightOnly: ćwiczenie z ciężarem ciała bez rekordu PR w sesji (jak dotąd: podciąganie, pompki; brzuch z kategorii).

export const ExerciseEntries = [
    // Klatka
    { name: 'Wyciskanie sztangi na ławce płaskiej', category: 'Klatka', en: 'Bench Press', wzorzec: 'upper_push', aliases: ['Klatka - Wyciskanie sztangi - Ławka płaska'] },
    { name: 'Wyciskanie sztangi na ławce skośnej', category: 'Klatka', en: 'Incline Bench Press', wzorzec: 'upper_push', aliases: ['Klatka - Wyciskanie sztangi - Skos dodatni'] },
    { name: 'Wyciskanie sztangi na ławce skośnej głową w dół', category: 'Klatka', en: 'Decline Bench Press', wzorzec: 'upper_push' },
    { name: 'Wyciskanie hantli na ławce płaskiej', category: 'Klatka', en: 'Dumbbell Bench Press', wzorzec: 'upper_push', aliases: ['Klatka - Wyciskanie hantli - Ławka płaska'] },
    { name: 'Wyciskanie hantli na ławce skośnej', category: 'Klatka', en: 'Dumbbell Incline Bench Press', wzorzec: 'upper_push', aliases: ['Klatka - Wyciskanie hantli - Skos dodatni'] },
    { name: 'Wyciskanie hantli na ławce skośnej głową w dół', category: 'Klatka', en: 'Dumbbell Decline Bench Press', wzorzec: 'upper_push' },
    { name: 'Rozpiętki', category: 'Klatka', en: 'Dumbbell Flyes', wzorzec: 'upper_push_accessory', aliases: ['Klatka - Rozpiętki - Hantle (ławka płaska)'] },
    { name: 'Rozpiętki na ławce skośnej', category: 'Klatka', en: 'Dumbbell Incline Flyes', wzorzec: 'upper_push_accessory' },
    { name: 'Rozpiętki na lince wyciągu', category: 'Klatka', en: 'Cable Chest Flyes', wzorzec: 'upper_push_accessory', aliases: ['Klatka - Rozpiętki - Brama (wyciągi górne)'] },
    { name: 'Pompki na poręczach', category: 'Klatka', en: 'Dips', wzorzec: 'upper_push', bodyweight: 0.65, bodyweightOnly: true, aliases: ['Klatka - Pompki na poręczach (Dipsy) - Wersja na klatkę'] },
    { name: 'Pompki', category: 'Klatka', en: 'Push Ups', wzorzec: 'upper_push', bodyweight: 0.65, bodyweightOnly: true },
    { name: 'Przenoszenie hantli nad głowę, leżąc w poprzek ławki', category: 'Klatka', en: 'Dumbbell Pullover', wzorzec: 'accessory' },
    { name: 'Klatka - Wznosy sztangielek hantlami- Siedząc', category: 'Klatka' },
    // Plecy
    // Decyzja właściciela 2026-11-27: Martwy ciąg w Plecach i widoczny też w „Nogi i Pośladki” (grupa mięśni z Pleców).
    { name: 'Martwy ciąg', category: 'Plecy', alsoIn: ['Nogi i Pośladki'], en: 'Deadlift', wzorzec: 'lower_pull_hinge', aliases: ['Plecy - Martwy ciąg - Klasyczny'] },
    { name: 'Podciąganie', category: 'Plecy', en: 'Pull Up', wzorzec: 'upper_pull', bodyweight: 1, bodyweightOnly: true, aliases: ['Plecy - Podciąganie na drążku - Nachwyt szeroki'] },
    { name: 'Podciąganie w podchwycie', category: 'Plecy', en: 'Chin Up', wzorzec: 'upper_pull', bodyweight: 1, bodyweightOnly: true, aliases: ['Plecy - Podciąganie na drążku - Podchwyt'] },
    { name: 'Wiosłowanie sztangą', category: 'Plecy', en: 'Bent Over Barbell Row', wzorzec: 'upper_pull', aliases: ['Plecy - Wiosłowanie sztangą - Opad tułowia'] },
    { name: 'Wiosłowanie hantlami w opadzie tułowia', category: 'Plecy', en: 'Bent Over Dumbbell Row', wzorzec: 'upper_pull' },
    { name: 'Wiosłowanie hantlą jednorącz', category: 'Plecy', en: 'One Arm Dumbbell Row', wzorzec: 'upper_pull_one_arm', aliases: ['Plecy - Wiosłowanie hantlem - Jednorącz w podporze'] },
    { name: 'Wiosłowanie hantlami na ławce skośnej', category: 'Plecy', en: 'Seal Row', wzorzec: 'upper_pull' },
    { name: 'Przyciąganie linki wyciągu do brzucha, siedząc', category: 'Plecy', en: 'Seated Cable Row', wzorzec: 'upper_pull', aliases: ['Plecy - Przyciąganie uchwytu wyciągu dolnego - Siedząc'] },
    { name: 'Przyciąganie linki wyciągu górnego do klatki piersiowej', category: 'Plecy', en: 'Lat Pull Down', wzorzec: 'upper_pull', aliases: ['Plecy - Ściąganie drążka wyciągu górnego - Szeroko'] },
    { name: 'Plecy - Podciąganie na drążku - Chwyt młotkowy', category: 'Plecy', bodyweight: 1, bodyweightOnly: true },
    { name: 'Plecy - Wiosłowanie sztangą leżąc - Ławka skos dodatni', category: 'Plecy' },
    { name: 'Plecy - Ściąganie drążka wyciągu górnego - Chwyt neutralny/wąski', category: 'Plecy' },
    // Nogi i Pośladki
    { name: 'Martwy ciąg sumo', category: 'Nogi i Pośladki', en: 'Sumo Deadlift', wzorzec: 'lower_pull_hinge' },
    { name: 'Rumuński martwy ciąg', category: 'Nogi i Pośladki', en: 'Romanian Deadlift', wzorzec: 'lower_pull_hinge', aliases: ['Pośladki - Martwy Ciąg na prostych nogach (RDL) - Sztanga/Hantle'] },
    { name: 'Martwy ciąg na jednej nodze', category: 'Nogi i Pośladki', en: 'One Leg Deadlift', wzorzec: 'lower_pull_hinge_one_leg' },
    { name: 'Wznosy bioder ze sztangą w oparciu o ławkę', category: 'Nogi i Pośladki', en: 'Hip Thrust', wzorzec: 'lower_pull_hip_ext', aliases: ['Pośladki - Hip Thrust - Ze sztangą'] },
    { name: 'Wznosy bioder w oparciu o ławkę jednonóż', category: 'Nogi i Pośladki', en: 'One Leg Hip Thrust', wzorzec: 'lower_pull_hip_ext_one_leg' },
    { name: 'Mostki biodrowe', category: 'Nogi i Pośladki', en: 'Glute Bridge', wzorzec: 'lower_pull_hip_ext' },
    { name: 'Wyprosty tułowia na ławce rzymskiej', category: 'Nogi i Pośladki', en: 'Hyperextension', wzorzec: 'lower_pull_accessory' },
    { name: 'Uginanie nóg na maszynie', category: 'Nogi i Pośladki', en: 'Machine Leg Curl', wzorzec: 'lower_pull_leg_curl' },
    { name: 'Przysiad ze sztangą z tyłu', category: 'Nogi i Pośladki', en: 'Back Squat', wzorzec: 'lower_push', aliases: ['Nogi - Przysiad ze sztangą - Tył (Back Squat)'] },
    { name: 'Przysiad ze sztangą z przodu', category: 'Nogi i Pośladki', en: 'Front Squat', wzorzec: 'lower_push' },
    { name: 'Przysiad z hantlą', category: 'Nogi i Pośladki', en: 'Goblet Squat', wzorzec: 'lower_push' },
    { name: 'Suwnica', category: 'Nogi i Pośladki', en: 'Leg Press', wzorzec: 'lower_push', aliases: ['Nogi - Suwnica - Wypychanie (szerokie ustawienie stóp)'] },
    { name: 'Suwnica Smitha', category: 'Nogi i Pośladki', en: 'Smith Machine', wzorzec: 'lower_push' },
    { name: 'Przysiad bułgarski', category: 'Nogi i Pośladki', en: 'Bulgarian Squat', wzorzec: 'lower_push', aliases: ['Nogi - Przysiad bułgarski - Z hantlami'] },
    { name: 'Wykroki', category: 'Nogi i Pośladki', en: 'Lunges', wzorzec: 'lower_push_one_leg', aliases: ['Nogi - Wykroki - Z hantlami'] },
    { name: 'Zakroki', category: 'Nogi i Pośladki', en: 'Reverse Lunges', wzorzec: 'lower_push_one_leg' },
    { name: 'Wykroki chodzone', category: 'Nogi i Pośladki', en: 'Walking Lunges', wzorzec: 'lower_push_one_leg' },
    { name: 'Wejście na box/step', category: 'Nogi i Pośladki', en: 'Step Up', wzorzec: 'lower_push_one_leg' },
    { name: 'Prostowanie nóg na maszynie', category: 'Nogi i Pośladki', en: 'Machine Leg Extension', wzorzec: 'lower_push_accessory', aliases: ['Nogi - Prostowanie nóg - Maszyna siedząc'] },
    { name: 'Odwodzenie nóg na maszynie', category: 'Nogi i Pośladki', en: 'Machine Hip Abduction', wzorzec: 'accessory' },
    { name: 'Przywodzenie nóg na maszynie', category: 'Nogi i Pośladki', en: 'Machine Hip Adduction', wzorzec: 'accessory' },
    { name: 'Wykopy na lince wyciągu', category: 'Nogi i Pośladki', en: 'Glute Cable Kickback', wzorzec: 'accessory' },
    { name: 'Wspięcia na palce', category: 'Nogi i Pośladki', en: 'Calf Raises', wzorzec: 'accessory', bodyweight: 1, aliases: ['Łydki - Wspięcia na palce - Stojąc'] },
    { name: 'Wspięcia na palce, siedząc', category: 'Nogi i Pośladki', en: 'Seated Calf Raises', wzorzec: 'accessory' },
    { name: 'Nogi - Przysiad maszyna - Tył (Back Squat)', category: 'Nogi i Pośladki' },
    { name: 'Pośladki - Wejścia -Gluten belt squa', category: 'Nogi i Pośladki' },
    { name: 'Łydki - Wspięcia na palce - Maszyna', category: 'Nogi i Pośladki' },
    { name: 'Łydki - Wspięcia na palce - Suwnica', category: 'Nogi i Pośladki' },
    // Barki
    { name: 'Wyciskanie siłowe nad głowę', category: 'Barki', en: 'Strict Press', wzorzec: 'upper_push', aliases: ['Barki - Wyciskanie sztangi (Żołnierskie) - Stojąc'] },
    { name: 'Wyciskanie siłowe hantlami nad głowę', category: 'Barki', en: 'Dumbbell Shoulder Press', wzorzec: 'upper_push' },
    { name: 'Wyciskanie siłowe hantlami nad głowę, siedząc', category: 'Barki', en: 'Seated Dumbbell Shoulder Press', wzorzec: 'upper_push', aliases: ['Barki - Wyciskanie hantli - Siedząc'] },
    { name: 'Wznosy hantli bokiem', category: 'Barki', en: 'Dumbbell Lateral Raises', wzorzec: 'accessory', aliases: ['Barki - Wznosy hantli bokiem - Stojąc'] },
    { name: 'Odwodzenie ramienia na lince wyciągu dolnego, stojąc', category: 'Barki', en: 'Cable Lateral Raises', wzorzec: 'accessory' },
    { name: 'Wznosy hantli przodem', category: 'Barki', en: 'Dumbbell Front Raises', wzorzec: 'upper_push_accessory', aliases: ['Barki - Wznosy hantli przodem - Stojąc'] },
    { name: 'Odwrotne rozpiętki, siedząc na maszynie', category: 'Barki', en: 'Pec Deck Reverse Flyes', wzorzec: 'upper_pull_accessory', aliases: ['Barki - Odwodzenie ramion - Maszyna (Reverse Peck-Deck)'] },
    { name: 'Odwrotne rozpiętki hantlami w opadzie tułowia', category: 'Barki', en: 'Dumbbell Reverse Flyes', wzorzec: 'upper_pull_accessory' },
    { name: 'Odwodzenie ramienia, leżąc bokiem na ławce skośnej', category: 'Barki', en: 'Powell Raises', wzorzec: 'upper_pull_accessory' },
    { name: 'Podciąganie sztangi wzdłuż tułowia', category: 'Barki', en: 'Barbell Upright Row', wzorzec: 'accessory' },
    { name: 'Przyciąganie linki wyciągu do czoła na sznurku z rotacją zewnętrzną', category: 'Barki', en: 'Face Pull', wzorzec: 'accessory', aliases: ['Barki - Face Pulls - Wyciąg górny z liną'] },
    { name: 'Barki - Wznosy hantli bokiem i przodem - Siedząc', category: 'Barki' },
    { name: 'Barki - Wznosy hantli tył i przód- Leżąc ławka skos dodatni', category: 'Barki' },
    { name: 'Barki (Mobilność) - Wall Slides - Bez obciążenia', category: 'Barki' },
    { name: 'Barki (Mobilność) - Banded Pass-Through - Guma oporowa', category: 'Barki' },
    { name: 'Barki - Face Pulls - Wyciąg górny z liną (Rotacja i prehab)', category: 'Barki' },
    // Triceps
    { name: 'Wyciskanie, leżąc na ławce płaskiej w wąskim chwycie', category: 'Triceps', en: 'Close Grip Bench Press', wzorzec: 'upper_push_accessory', aliases: ['Triceps - Wyciskanie wąsko - Sztanga płasko'] },
    { name: 'Prostowanie przedramion na lince wyciągu górnego', category: 'Triceps', en: 'Triceps Pushdown', wzorzec: 'upper_push_accessory', aliases: ['Triceps - Prostowanie ramion na wyciągu - Uchwyt prosty'] },
    { name: 'Prostowanie przedramion na lince wyciągu dolnego tyłem do wyciągu', category: 'Triceps', en: 'Standing Cable Triceps Overhead Extension', wzorzec: 'upper_push_accessory' },
    { name: 'Prostowanie przedramion, leżąc na gryfie łamanym', category: 'Triceps', en: 'EZ Bar Skull Crusher', wzorzec: 'upper_push_accessory', aliases: ['Triceps - Wyciskanie francuskie - Sztanga łamana (leżąc)'] },
    { name: 'Wyciskanie francuskie, siedząc', category: 'Triceps', en: 'Seated Dumbbell French Press', wzorzec: 'upper_push_accessory' },
    { name: 'Wyciskanie francuskie, leżąc, hantlami', category: 'Triceps', en: 'Lying Dumbbell French Press', wzorzec: 'upper_push_accessory' },
    { name: 'Prostowanie przedramion z hantlami, leżąc przodem na ławce skośnej', category: 'Triceps', en: 'Incline Dumbbell Triceps Kickback', wzorzec: 'upper_push_accessory' },
    { name: 'Prostowanie przedramion z hantlami w opadzie tułowia', category: 'Triceps', en: 'Dumbbell Triceps Kickback', wzorzec: 'upper_push_accessory' },
    { name: 'Triceps - Prostowanie ramion na wyciągu - Uchwyt łamany', category: 'Triceps' },
    { name: 'Triceps - Prostowanie ramion na wyciągu - Lina', category: 'Triceps' },
    { name: 'Triceps - Wyciskanie francuskie jednorącz - Hantel za głowę', category: 'Triceps' },
    // Biceps
    { name: 'Uginanie przedramion na sztandze', category: 'Biceps', en: 'Barbell Biceps Curl', wzorzec: 'upper_pull_accessory', aliases: ['Biceps - Uginanie ramion - Sztanga prosta'] },
    { name: 'Uginanie przedramion z hantlami', category: 'Biceps', en: 'Dumbbell Biceps Curl', wzorzec: 'upper_pull_accessory', aliases: ['Biceps - Uginanie ramion - Hantle'] },
    { name: 'Uginanie przedramion na lince wyciągu dolnego', category: 'Biceps', en: 'Cable Biceps Curl', wzorzec: 'upper_pull_accessory', aliases: ['Biceps - Uginanie ramion - Wyciąg dolny lina'] },
    { name: 'Uginanie przedramion, leżąc na ławce skośnej', category: 'Biceps', en: 'Incline Bench Dumbbell Biceps Curl', wzorzec: 'upper_pull_accessory' },
    { name: 'Uginanie przedramion jednorącz na lince wyciągu dolnego, pw. tyłem do wyciągu', category: 'Biceps', en: 'Long Head Cable Curl', wzorzec: 'upper_pull_one_arm_accessory', aliases: ['Uginanie przedramion jednorącz na lince wyciągu dolnego – pw. tyłem do wyciągu'] }, // w materiale „–” zamiast „,”
    { name: 'Uginanie przedramion na sztandze łamanej w nachwycie', category: 'Biceps', en: 'Reverse Grip EZ-Bar Curl', wzorzec: 'upper_pull_accessory' },
    { name: 'Uginanie przedramion hantlami w uchwycie młotkowym', category: 'Biceps', en: 'Dumbbell Hammer Curl', wzorzec: 'upper_pull_accessory', aliases: ['Biceps - Uginanie ramion chwytem młotkowym - Hantle'] },
    { name: 'Biceps - Uginanie ramion 54321 - Hantle', category: 'Biceps' },
    { name: 'Biceps - Uginanie ramion - Sztanga łamana', category: 'Biceps' },
    { name: 'Biceps - Uginanie ramion na modlitewniku - Sztanga/Maszyna', category: 'Biceps' },
    // Brzuch
    { name: 'Brzuch - Wznosy nóg - W zwisie na drążku', category: 'Brzuch', bodyweight: 1 },
    { name: 'Brzuch - Wznosy nóg - W leżeniu na płasko', category: 'Brzuch' },
    { name: 'Brzuch - Ławka skośna', category: 'Brzuch' },
    { name: 'Brzuch - Scyzoryki', category: 'Brzuch' },
    { name: 'Brzuch - Plank (Deska) - Z obciążeniem', category: 'Brzuch' },
    { name: 'Brzuch - Plank (Deska) - Masa ciała', category: 'Brzuch' },
    { name: 'Brzuch - Allahy - Spięcia na wyciągu górnym', category: 'Brzuch' },
    { name: 'Brzuch - Kółko (Ab Roller) - Z kolan', category: 'Brzuch' },
    // Cardio
    { name: 'Cardio - Bieżnia - Szybki marsz', category: 'Cardio' },
    { name: 'Cardio - Orbitrek', category: 'Cardio' },
    { name: 'Cardio - Rowerek stacjonarny', category: 'Cardio' },
    { name: 'Cardio - Schody (Stairmaster)', category: 'Cardio' },
    // Zajęcia zorganizowane
    { name: 'Zajęcia - Tabata', category: 'Zajęcia zorganizowane' },
    { name: 'Zajęcia - HYROX', category: 'Zajęcia zorganizowane' },
    { name: 'Zajęcia - Les Mills CORE', category: 'Zajęcia zorganizowane' },
    { name: 'Zajęcia - Pośladki i Brzuch', category: 'Zajęcia zorganizowane' },
    { name: 'Zajęcia - Rowery (Spinning)', category: 'Zajęcia zorganizowane' },
    { name: 'Zajęcia - Crossfit', category: 'Zajęcia zorganizowane' },
    { name: 'Zajęcia - Zumba', category: 'Zajęcia zorganizowane' },
];

// { kategoria: [nazwy] } i płaska lista nazw: dawny kształt eksportów, z którego korzysta reszta aplikacji.
export const ExerciseCategories = {};
for (const e of ExerciseEntries) (ExerciseCategories[e.category] ||= []).push(e.name);
// Druga partia (alsoIn): ta sama nazwa także na liście innej partii; płaska lista ma ją raz.
for (const e of ExerciseEntries) for (const c of e.alsoIn || []) (ExerciseCategories[c] ||= []).push(e.name);

export const ExerciseCatalog = ExerciseEntries.map((e) => e.name);

// Klucz porównania nazw: NFC, bez spacji na brzegach, pojedyncze spacje, półpauzy i pauzy jako „-”, małe litery.
export function exerciseKey(name) {
    return String(name ?? '').normalize('NFC').trim().replace(/\s+/g, ' ')
        .replace(/[\u2010-\u2015\u2212]/g, '-').toLowerCase();
}
const keyOf = exerciseKey;

// Kategoria katalogu → grupa mięśniowa (licznik serii w Strefie trenera, atlas regeneracji).
// Cardio i Zajęcia zorganizowane nie mają grupy.
export const CATEGORY_MUSCLE_GROUP = Object.freeze({
    'Klatka': 'klatka',
    'Plecy': 'plecy',
    'Nogi i Pośladki': 'nogi',
    'Barki': 'barki',
    'Triceps': 'triceps',
    'Biceps': 'biceps',
    'Brzuch': 'brzuch',
});

const BY_KEY = new Map();
for (const e of ExerciseEntries) {
    for (const n of [e.name, ...(e.aliases || [])]) BY_KEY.set(keyOf(n), e);
}

// Wpis katalogu po nazwie głównej albo dawnej (aliasie); null dla ćwiczeń własnych i nieznanych.
export function findExercise(name) {
    return BY_KEY.get(keyOf(name)) || null;
}

export function isCatalogExercise(name) {
    return BY_KEY.has(keyOf(name));
}

// Jedyne miejsce rozwiązywania aliasów: dawna nazwa → nazwa główna. Nazwa spoza katalogu wraca bez spacji na brzegach.
export function canonicalExerciseName(name) {
    const e = findExercise(name);
    return e ? e.name : String(name ?? '').trim();
}

// Grupa mięśniowa ćwiczenia z katalogu (także pod dawną nazwą); null dla własnych, cardio i zajęć.
export function exerciseMuscleGroup(name) {
    const e = findExercise(name);
    return (e && CATEGORY_MUSCLE_GROUP[e.category]) || null;
}

// Czy dwie zapisane nazwy to to samo ćwiczenie (także stara i nowa nazwa).
export function sameExercise(a, b) {
    return keyOf(canonicalExerciseName(a)) === keyOf(canonicalExerciseName(b));
}

// Teksty do wyszukiwania (nazwa, angielska nazwa, aliasy); wyświetla się zawsze tylko nazwa.
export function exerciseSearchTexts(name) {
    const e = findExercise(name);
    return e ? [e.name, ...(e.en ? [e.en] : []), ...(e.aliases || [])] : [String(name ?? '')];
}
