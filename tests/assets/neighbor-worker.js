// Zaślepka service workera „sąsiedniej” aplikacji UKIS w tej samej domenie.
// Nazwa celowo bez `sw.js`, a domyślny zakres (/tests/assets/) różni się od zakresu aplikacji.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
