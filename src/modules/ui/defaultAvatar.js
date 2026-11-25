// Domyślny awatar: lokalna sylwetka SVG (bez zewnętrznych usług), kobieta lub mężczyzna.
// Płeć zgadujemy z imienia; użytkownik może ją ustawić ręcznie w Profilu.

export const AVATAR_CHOICE_KEY = 'ukis.bodybuild.avatar-sylwetka';
const CHOICES = ['auto', 'male', 'female'];

// Męskie imiona zakończone na „a”.
const MALE_EXCEPTIONS = new Set(['kuba', 'barnaba', 'bonawentura', 'kosma', 'jarema', 'saba', 'dyzma', 'zawisza']);

export function guessGender(nick) {
    const first = String(nick || '').trim().split(/\s+/)[0].toLocaleLowerCase('pl');
    if (first.endsWith('a') && !MALE_EXCEPTIONS.has(first)) return 'female';
    return 'male';
}

// Sylwetka w stylu Lucide: obrys 1.5, zaokrąglone końce, jasna kreska na ciemnym kole.
const HEAD_AND_SHOULDERS = '<circle cx="12" cy="9.5" r="3.3"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>';
// Dłuższe włosy: łuk nad głową opadający po bokach do ramion.
const LONG_HAIR = '<path d="M7.8 15.2V9.6a4.2 4.2 0 0 1 8.4 0v5.6"/>';

function svgFor(gender) {
    const figure = gender === 'female' ? LONG_HAIR + HEAD_AND_SHOULDERS : HEAD_AND_SHOULDERS;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">'
        + '<circle cx="12" cy="12" r="12" fill="#1c2230"/>'
        + '<g fill="none" stroke="#e6e9ef" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
        + figure
        + '</g></svg>';
}

// base64, bo zwykłe kodowanie zostawiłoby w adresie przestrzeń nazw SVG („http://www.w3.org…”).
export function avatarDataUri(gender) {
    return 'data:image/svg+xml;base64,' + btoa(svgFor(gender === 'female' ? 'female' : 'male'));
}

export function resolveGender(nick, choice) {
    if (choice === 'male' || choice === 'female') return choice;
    return guessGender(nick);
}

export function loadAvatarChoice(storage = localStorage) {
    try {
        const v = storage.getItem(AVATAR_CHOICE_KEY);
        return CHOICES.includes(v) ? v : 'auto';
    } catch (e) {
        return 'auto';
    }
}

export function saveAvatarChoice(choice, storage = localStorage) {
    try {
        storage.setItem(AVATAR_CHOICE_KEY, CHOICES.includes(choice) ? choice : 'auto');
    } catch (e) {}
}

// Ustawia sylwetkę w nagłówku Menu, chyba że jest tam już własne zdjęcie użytkownika
// (main.js i SettingsUI.applyProfileAvatar oznaczają je data-avatar-source="photo").
export function applyDefaultAvatar(doc = document, storage = localStorage) {
    const img = doc.getElementById('user-avatar-img');
    if (!img || img.dataset.avatarSource === 'photo') return;
    let nick = '';
    try { nick = storage.getItem('userNick') || ''; } catch (e) {}
    img.src = avatarDataUri(resolveGender(nick, loadAvatarChoice(storage)));
    img.dataset.avatarSource = 'default';
}
