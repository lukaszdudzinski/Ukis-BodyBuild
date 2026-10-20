(function () {
    'use strict';

    // Własny zakres service workera: katalog, w którym leży ten skrypt (wszystkie strony aplikacji są w katalogu głównym).
    var OWN_SCOPE = new URL('./', (document.currentScript && document.currentScript.src) || location.href).href;

    // Własne cache BodyBuild (także historyczne uki-bodybuild-v2026.8.x). Musi być identyczne z sw.js.
    var OWN_CACHE_PREFIXES = ['ukis-bodybuild-', 'uki-bodybuild-'];

    // Klucze localStorage usuwane przez "Pamięć podręczną".
    var RESETTABLE_KEYS = [
        'uki-bodybuild-theme',
        'uki-bodybuild-glass',
        'uki-bodybuild-wallpaper',
        'uki-bodybuild-avatar',
        'uki-bodybuild-gender',
        'uki-bodybuild-reminder',
        'uki-bodybuild-pwa-banner-dismissed',
        'uki-bodybuild-last-version',
        'uki-bodybuild-media-migrated-v2',
        'uki-experimental-numpad',
        'uki-ui-version',
        'uki-ui-welcome-seen',
        'uki_bodybuild_settings',
        'uki_backup_frequency',
        'uki_exercises_migrated',
        'tutorial_global',
        'tutorial_global_v21',
        'tutorial_global_v22',
        'tutorial_context_training',
        'tutorial_context_diet',
        'dietGoal',
        'dietActivity',
        'trainingExperience',
        'dietWorkerUrl',
        'errorTelemetryUrl'
    ];

    // Klucze, których nigdy nie usuwamy: uprawnienia (data instalacji, token PRO, ostatni paywall),
    // strażnik migracji kvvfs (uki_kvvfs_migrated), klucze współdzielone z innymi aplikacjami UKIS
    // w tej samej domenie (userNick, uki-avatar, uki-custom-wallpaper, theme, uki_error_logs)
    // oraz dane użytkownika (szablony, harmonogramy, ćwiczenia, osiągnięcia, szkice, kopie zapasowe, pseudonim).
    var PRESERVED_KEYS = [
        'uki_install_date',
        'uki_ai_premium_token',
        'uki_ai_paywall_last_shown',
        'uki_kvvfs_migrated',
        'userNick',
        'uki-avatar',
        'uki-custom-wallpaper',
        'theme',
        'uki_error_logs',
        'uki_workout_templates',
        'uki_workout_schedules',
        'uki_schedule_exceptions',
        'uki_custom_exercises',
        'uki_achievements',
        'uki_active_training_draft',
        'uki_last_ai_analysis',
        'uki_last_backup_date',
        'uki-nickname'
    ];

    // Prefiksy kluczy chronionych (baza sqlite w trybie kvvfs).
    var PRESERVED_PREFIXES = ['kvvfs-'];

    function isOwnCache(name) {
        if (typeof name !== 'string') return false;
        return OWN_CACHE_PREFIXES.some(function (prefix) { return name.indexOf(prefix) === 0; });
    }

    function getOwnRegistrations() {
        if (typeof navigator === 'undefined' || !navigator.serviceWorker || typeof navigator.serviceWorker.getRegistrations !== 'function') {
            return Promise.resolve([]);
        }
        return navigator.serviceWorker.getRegistrations().then(function (regs) {
            return regs.filter(function (r) { return r.scope === OWN_SCOPE; });
        }).catch(function () { return []; });
    }

    function unregisterOwn() {
        return getOwnRegistrations().then(function (regs) {
            return Promise.all(regs.map(function (r) {
                return r.unregister().then(function (ok) { return ok ? 1 : 0; }).catch(function () { return 0; });
            }));
        }).then(function (results) {
            return results.reduce(function (sum, n) { return sum + n; }, 0);
        });
    }

    function deleteOwnCaches() {
        if (typeof caches === 'undefined' || !caches || typeof caches.keys !== 'function') {
            return Promise.resolve([]);
        }
        return caches.keys().then(function (names) {
            var own = names.filter(isOwnCache);
            return Promise.all(own.map(function (n) {
                return caches.delete(n).then(function (ok) { return ok ? n : null; }).catch(function () { return null; });
            }));
        }).then(function (deleted) {
            return deleted.filter(function (n) { return n !== null; });
        }).catch(function () { return []; });
    }

    function isPreserved(key) {
        if (PRESERVED_KEYS.indexOf(key) !== -1) return true;
        return PRESERVED_PREFIXES.some(function (prefix) { return key.indexOf(prefix) === 0; });
    }

    function clearOwnLocalStorage() {
        var removed = [];
        RESETTABLE_KEYS.forEach(function (key) {
            if (isPreserved(key)) return;
            try {
                if (localStorage.getItem(key) !== null) {
                    localStorage.removeItem(key);
                    removed.push(key);
                }
            } catch (e) { /* localStorage niedostępny */ }
        });
        return removed;
    }

    window.UkiScope = {
        OWN_SCOPE: OWN_SCOPE,
        OWN_CACHE_PREFIXES: OWN_CACHE_PREFIXES,
        RESETTABLE_KEYS: RESETTABLE_KEYS,
        PRESERVED_KEYS: PRESERVED_KEYS,
        PRESERVED_PREFIXES: PRESERVED_PREFIXES,
        isOwnCache: isOwnCache,
        getOwnRegistrations: getOwnRegistrations,
        unregisterOwn: unregisterOwn,
        deleteOwnCaches: deleteOwnCaches,
        clearOwnLocalStorage: clearOwnLocalStorage
    };
})();
