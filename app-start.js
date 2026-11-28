/**
 * Uki's BodyBuild: start aplikacji (klasyczny skrypt w <head>, nie moduł).
 * Zastępuje dawny przełącznik wyglądów (spec 11 pkt 4): zostały tylko funkcje potrzebne oknom startowym.
 */
(function () {
    const UkiAppStart = {
        // Aplikacja uruchomiona jako zainstalowana (PWA z ekranu początkowego). W zwykłej karcie przeglądarki
        // index.html pokazuje stronę z instrukcją instalacji, więc okna startowe aplikacji się nie pokazują.
        // navigator.webdriver: testy automatyczne działają jak aplikacja (tak samo jak w index.html).
        isAppMode: function () {
            try {
                return window.matchMedia('(display-mode: standalone)').matches
                    || window.navigator.standalone === true
                    || navigator.webdriver === true
                    || document.referrer.indexOf('android-app://') === 0;
            } catch (e) {
                return true;
            }
        },

        // Nowa instalacja: nikt tu jeszcze nie przeszedł powitania Edwarda ani nie widział żadnej wersji.
        isFreshInstall: function () {
            try {
                return localStorage.getItem('tutorial_global_v22') !== 'true'
                    && localStorage.getItem('uki-bodybuild-last-version') === null;
            } catch (e) {
                return false;
            }
        },

        // Dawniej czekało na powitanie nowego wyglądu; tego okna już nie ma, więc cb biegnie od razu.
        whenWelcomeClosed: function (cb) {
            cb();
        }
    };

    window.UkiAppStart = UkiAppStart;
})();
