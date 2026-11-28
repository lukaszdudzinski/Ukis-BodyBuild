const CACHE_NAME = 'ukis-bodybuild-v2026.11.28.04'; // deployed: 2026-08-27T00:01
const OWN_CACHE_PREFIXES = ['ukis-bodybuild-', 'uki-bodybuild-']; // własne cache (także historyczne uki-bodybuild-v2026.8.x); cudze cache w domenie zostają
// Core assets that MUST be cached immediately
const CORE_ASSETS = [
    './',
    './index.html',
    './app-start.js',
    './ukis-scope.js',
    './pwa-updater.js',
    './style.css',
    './styles/base.css',
    './styles/layout.css',
    './styles/components/forms.css',
    './styles/components/modals.css',
    './styles/components/pwa.css',
    './styles/lightbox.css',
    './classic.html',
    './img/logo.png',
    './img/landing/logo.webp',
    './img/landing/silownia.webp',
    './img/landing/menu.webp',
    './img/landing/trening.webp',
    './img/landing/dieta.webp',
    './img/landing/sila.webp',
    './img/landing/sylwetka.webp',
    './manifest.json',
    './src/main.js',
    './src/version_check.js',
    './src/utils/ShareUtils.js',
    './src/data/ExerciseCatalog.js',
    './src/data/movementPatterns.js',
    './src/data/exerciseTraits.js',
    './src/components/TrainingComponent.js',
    './src/components/MeasurementsComponent.js',
    './src/components/NotebookComponent.js',
    './src/modules/notebook/NotebookUI.js',
    './src/modules/notebook/notebookModel.js',
    './src/modules/notebook/notebookSettings.js',
    './src/modules/trainer/trainerCrypto.js',
    './src/modules/trainer/trainerCode.js',
    './src/modules/trainer/trainerAccess.js',
    './src/modules/trainer/trainerVault.js',
    './src/modules/trainer/trainerLock.js',
    './src/modules/trainer/trainerQuestionnaire.js',
    './src/modules/trainer/trainerModel.js',
    './src/modules/trainer/trainerAssessment.js',
    './src/modules/trainer/trainerMeasurements.js',
    './src/modules/trainer/trainerSections.js',
    './src/modules/wyglad/wygladModel.js',
    './src/modules/wyglad/tapeta.js',
    './src/modules/wyglad/tapety.js',
    './img/tapety/czerwien.webp',
    './img/tapety/sepia.webp',
    './img/tapety/szara.webp',
    './img/tapety/silownia.webp',
    './src/modules/wyglad/tlo.js',
    './src/modules/wyglad/WygladUI.js',
    './src/modules/wyglad/naglowek.js',
    './src/modules/wyglad/ikony.js',
    './src/modules/wyglad/menuTrening.js',
    './src/modules/wyglad/harmonogram.js',
    './src/modules/wyglad/bezpiecznyHtml.js',
    './src/modules/wyglad/komunikatKlasyczny.js',
    './src/modules/trainer/trainerBackup.js',
    './src/modules/trainer/trainerPlan.js',
    './src/modules/trainer/trainerSession.js',
    './src/modules/trainer/trainerProgress.js',
    './src/modules/trainer/trainerPlanFile.js',
    './src/modules/trainer/trainerPlanImport.js',
    './src/modules/trainer/trainerAudio.js',
    './src/modules/trainer/trainerPhotos.js',
    './src/modules/trainer/ui/dom.js',
    './src/modules/trainer/ui/gateScreens.js',
    './src/modules/trainer/ui/vaultScreens.js',
    './src/modules/trainer/ui/clientScreens.js',
    './src/modules/trainer/ui/interviewScreen.js',
    './src/modules/trainer/ui/interviewNotes.js',
    './src/modules/trainer/ui/measurementPhotos.js',
    './src/modules/trainer/ui/assessmentScreen.js',
    './src/modules/trainer/ui/measurementsScreen.js',
    './src/modules/trainer/ui/settingsScreen.js',
    './src/modules/trainer/ui/issueScreen.js',
    './src/modules/trainer/ui/exercisePicker.js',
    './src/modules/trainer/ui/planScreens.js',
    './src/modules/trainer/ui/planEditScreen.js',
    './src/modules/trainer/ui/planExportScreen.js',
    './src/modules/trainer/ui/sessionScreen.js',
    './src/modules/trainer/ui/chart.js',
    './src/modules/trainer/ui/progressScreen.js',
    './src/modules/trainer/ui/TrainerUI.js',
    './styles/trainer.css',
    './styles/zar/tokens.css',
    './styles/zar/fonts.css',
    './styles/zar/base.css',
    './styles/zar/components.css',
    './styles/zar/ekrany/menu.css',
    './styles/zar/ekrany/wyglad.css',
    './styles/zar/ekrany/trening-kalendarz.css',
    './styles/zar/ekrany/trening-sesja.css',
    './styles/zar/ekrany/trening-numpad.css',
    './styles/zar/ekrany/trening-katalog.css',
    './styles/zar/ekrany/trening-szablony.css',
    './styles/zar/ekrany/trening-kreator.css',
    './styles/zar/ekrany/import-planu.css',
    './styles/zar/ekrany/zeszyt.css',
    './styles/zar/ekrany/historia.css',
    './styles/zar/ekrany/pomiary.css',
    './styles/zar/ekrany/dieta.css',
    './styles/zar/ekrany/analiza.css',
    './styles/zar/ekrany/ai.css',
    './styles/zar/ekrany/edward.css',
    './styles/zar/ekrany/pro.css',
    './styles/zar/ekrany/profil.css',
    './styles/zar/ekrany/serwis.css',
    './styles/zar/ekrany/powitanie.css',
    './styles/zar/ekrany/komunikat.css',
    './styles/zar/ekrany/landing.css',
    './libs/fonts/barlow-latin-500-normal.woff2',
    './libs/fonts/barlow-latin-ext-500-normal.woff2',
    './libs/fonts/barlow-latin-600-italic.woff2',
    './libs/fonts/barlow-latin-ext-600-italic.woff2',
    './libs/fonts/barlow-latin-700-italic.woff2',
    './libs/fonts/barlow-latin-ext-700-italic.woff2',
    './libs/fonts/inter-latin-400-normal.woff2',
    './libs/fonts/inter-latin-ext-400-normal.woff2',
    './libs/fonts/inter-latin-500-normal.woff2',
    './libs/fonts/inter-latin-ext-500-normal.woff2',
    './libs/fonts/inter-latin-600-normal.woff2',
    './libs/fonts/inter-latin-ext-600-normal.woff2',
    './src/modules/notebook/exerciseSuggest.js',
    './src/modules/ui/ChangelogUI.js',
    './src/modules/ui/AiAnalyticsUI.js',
    './src/modules/ui/HistoryUI.js',
    './src/modules/ui/DiagnosticsUI.js',
    './src/modules/ui/MeasurementsUI.js',
    './src/modules/ui/SettingsUI.js',
    './src/modules/ui/TrainingUI.js',
    './src/modules/ui/PlanImportUI.js',
    './src/modules/ui/DietUI.js',
    './src/modules/ui/AnalyticsUI.js',
    './src/modules/ui/AppUI.js',
    './src/modules/ui/OnboardingUI.js',
    './src/modules/ui/defaultAvatar.js',
    './src/modules/ui/ChatUI.js',
    './src/modules/ui/PremiumUI.js',
    './src/modules/ui/TemplateBuilderUI.js',
    './src/modules/ui/NumpadUI.js',
    './src/modules/ui/BackupUI.js',
    './src/modules/gamification/AchievementsSystem.js',
    './src/modules/diet/DietAIEngine.js',
    './src/modules/diet/kcalGoal.js',
    './src/modules/diet/macroTargets.js',
    './src/modules/body/bodyMetrics.js',
    './src/modules/body/sexConfirm.js',
    './src/modules/ai/AiAnalyticsEngine.js',
    './src/modules/db/DatabaseManager.js',
    './src/modules/db/dbWorker.js',
    './src/modules/db/MediaManager.js',
    './src/modules/data/LogbookDB.js',
    './src/modules/data/CalendarDB.js',
    './libs/sqlite/sqlite3.mjs',
    './libs/sqlite/sqlite3-worker1-promiser.js',
    './libs/sqlite/sqlite3-worker1.js',
    './libs/sqlite/sqlite3.js',
    './libs/sqlite/sqlite3.wasm'
];

// Bez skipWaiting(): nowa wersja czeka, aż użytkownik sam kliknie „Zaktualizuj” (AGENTS.md, zasada 3).
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(CORE_ASSETS.map(url => fetch(new Request(url + '?_t=' + Date.now(), { cache: 'no-store' })).then(r => { if(!r.ok) throw new Error('Fetch failed'); return cache.put(new Request(url), r); })));
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME && OWN_CACHE_PREFIXES.some(p => key.startsWith(p))) {
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    // Only cache http/https requests
    if (!e.request.url.startsWith('http')) {
        return;
    }
    
    // Bypass cache completely for API requests (like Gemini AI)
    if (e.request.url.includes('generativelanguage.googleapis.com') || e.request.url.includes('workers.dev')) {
        e.respondWith(
            fetch(e.request).catch(err => {
                console.error('[SW] API Fetch Failed (Offline?):', err);
                return new Response(JSON.stringify({ error: "No internet connection" }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // sqlite3.wasm z cache instalacji (CORE_ASSETS, sprawdzony przy instalacji): worker serwuje zatwierdzoną wersję
    // (AGENTS.md, zasada 3) i baza działa offline. Sieć (bez dopisywania do cache w locie, bo błędna odpowiedź HTML
    // niszczy WebAssembly) tylko, gdy pliku w cache nie ma.
    if (e.request.url.endsWith('.wasm')) {
        e.respondWith(caches.match(e.request).then(r => r || fetch(e.request, { cache: 'no-store' })));
        return;
    }

    // Wyjątek dla sw.js - nigdy go nie cachuj
    if (e.request.url.endsWith('sw.js')) {
        e.respondWith(fetch(e.request, { cache: 'no-store' }));
        return;
    }

    e.respondWith(
        caches.match(e.request).then((response) => {
            if (response) {
                return response; // Hit cache
            }
            return fetch(e.request).then((fetchResponse) => {
                // Return if not valid
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return fetchResponse;
                }

                // NIE cachuj plików binarnych które mogą być błędnie zwrócone jako HTML
                const contentType = fetchResponse.headers.get('content-type') || '';
                if (contentType.includes('text/html') && e.request.url.match(/\.(wasm|js|json)$/)) {
                    console.warn('[SW] Suspicious response for', e.request.url, '- skipping cache');
                    return fetchResponse;
                }

                // Clone response to cache it dynamically
                const responseToCache = fetchResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, responseToCache);
                });

                return fetchResponse;
            }).catch(err => {
                console.error('[SW] Dynamic Fetch Failed:', err);
                // Can return an offline fallback page here if desired
            });
        })
    );
});

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
