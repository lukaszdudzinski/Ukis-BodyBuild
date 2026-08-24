const CACHE_NAME = 'ukis-bodybuild-v2026.8.24.03';
// Core assets that MUST be cached immediately
const CORE_ASSETS = [
    './',
    './index.html',
    './style.css',
    './img/logo.png',
    './manifest.json',
    './src/main.js',
    './src/version_check.js',
    './src/utils/ShareUtils.js',
    './src/components/TrainingComponent.js',
    './src/components/MeasurementsComponent.js',
    './src/modules/ui/LogbookUI.js',
    './src/modules/ui/ChangelogUI.js',
    './src/modules/ui/CalendarUI.js',
    './src/modules/ui/AiAnalyticsUI.js',
    './src/modules/ui/HistoryUI.js',
    './src/modules/ui/DiagnosticsUI.js',
    './src/modules/ui/MeasurementsUI.js',
    './src/modules/ui/SettingsUI.js',
    './src/modules/ui/TrainingUI.js',
    './src/modules/ui/DietUI.js',
    './src/modules/ui/AnalyticsUI.js',
    './src/modules/ui/AppUI.js',
    './src/modules/ui/OnboardingUI.js',
    './src/modules/ui/ChatUI.js',
    './src/modules/gamification/AchievementsSystem.js',
    './src/modules/diet/DietAIEngine.js',
    './src/modules/ai/AiAnalyticsEngine.js',
    './src/modules/db/DatabaseManager.js',
    './src/modules/data/LogbookDB.js',
    './src/modules/data/CalendarDB.js'
];

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
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim(); // Take control of all clients immediately
});

self.addEventListener('fetch', (e) => {
    // Only cache http/https requests
    if (!e.request.url.startsWith('http')) {
        return;
    }
    
    // Bypass cache completely for API requests (like Gemini AI)
    if (e.request.url.includes('generativelanguage.googleapis.com')) {
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
