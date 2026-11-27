import { AppUI, APP_VERSION } from './modules/ui/AppUI.js';
import { MeasurementsUI } from './modules/ui/MeasurementsUI.js';
import { TrainingUI } from './modules/ui/TrainingUI.js';
import { SettingsUI } from './modules/ui/SettingsUI.js';
import { HistoryUI } from './modules/ui/HistoryUI.js';
import { AnalyticsUI } from './modules/ui/AnalyticsUI.js';
import { DietUI } from './modules/ui/DietUI.js';
import { OnboardingUI } from './modules/ui/OnboardingUI.js';
import { ChatUI } from './modules/ui/ChatUI.js';
import { DatabaseManager } from './modules/db/DatabaseManager.js';
import { MediaManager } from './modules/db/MediaManager.js';
import { ChangelogUI } from './modules/ui/ChangelogUI.js';
import { DiagnosticsUI } from './modules/ui/DiagnosticsUI.js';
import { AchievementsSystem } from './modules/gamification/AchievementsSystem.js';
import { AiAnalyticsUI } from './modules/ui/AiAnalyticsUI.js';
import { TemplateBuilderUI } from './modules/ui/TemplateBuilderUI.js';
import { NumpadUI } from './modules/ui/NumpadUI.js';
import { BackupUI } from './modules/ui/BackupUI.js';
import { initSexConfirm } from './modules/body/sexConfirm.js';
import { NotebookUI } from './modules/notebook/NotebookUI.js';
import { TrainerUI } from './modules/trainer/ui/TrainerUI.js';
import { applyDefaultAvatar } from './modules/ui/defaultAvatar.js';
import { zastosujWyglad } from './modules/wyglad/tlo.js';
import { WygladUI } from './modules/wyglad/WygladUI.js';

// Motyw i kolor paska systemu przed budową interfejsu (migracja motywu Strefy w środku, spec rozdz. 10).
zastosujWyglad();

window.ukiLogError = (msg, stack) => {
    let logs = [];
    try { logs = JSON.parse(localStorage.getItem('uki_error_logs') || '[]'); } catch(e) {}
    const errorData = { time: new Date().toISOString(), msg, stack, version: window.APP_VERSION || 'Nieznana' };
    logs.unshift(errorData);
    if(logs.length > 50) logs.length = 50;
    localStorage.setItem('uki_error_logs', JSON.stringify(logs));

    // Opcjonalna telemetria w tle ala K8s
    const webhookUrl = localStorage.getItem('errorTelemetryUrl');
    if (webhookUrl) {
        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'AppError', user: localStorage.getItem('userNick') || 'Anon', data: errorData })
        }).catch(e => console.warn('Telemetry delivery failed', e));
    }
};

window.onerror = function(message, source, lineno, colno, error) {
    const stack = error ? error.stack : '';
    window.ukiLogError(`Global Error: ${message} at ${source}:${lineno}:${colno}`, stack);
    return false;
};

window.addEventListener('unhandledrejection', function(event) {
    const msg = event.reason ? event.reason.message || event.reason : 'Unhandled Promise Rejection';
    const stack = event.reason ? event.reason.stack || '' : '';
    window.ukiLogError(`Promise Rejection: ${msg}`, stack);
});

// Expose for E2E testing and PWA updater
window.DatabaseManager = DatabaseManager;
window.APP_VERSION = APP_VERSION;
window.AiAnalyticsUI = AiAnalyticsUI;
window.DietUI = DietUI;
window.NotebookUI = NotebookUI;
window.TrainerUI = TrainerUI;

// Initialize Application
const initApp = () => {
    console.log("Starting App Initialization...");
    DatabaseManager.migrateExercises();
    ChangelogUI.init();
    AppUI.init();

    // Ekran „Wygląd” (wejście z Profilu).
    WygladUI.init();
    
    // Domyślna sylwetka SVG (odświeżana po zmianie nicku); własne zdjęcie poniżej ma pierwszeństwo.
    applyDefaultAvatar();
    document.addEventListener('nickUpdated', () => applyDefaultAvatar());

    // Set dynamic avatar
    const base64Id = localStorage.getItem('uki-bodybuild-avatar') || localStorage.getItem('uki-avatar');
    if (base64Id) {
        MediaManager.getMediaUrl(base64Id).then(url => {
            if (url) {
                const img = document.getElementById('user-avatar-img');
                if (img) {
                    img.src = url;
                    img.dataset.avatarSource = 'photo';
                }
            }
        }).catch(e => console.warn('Avatar err', e));
    }
    
    MeasurementsUI.init();
    TrainingUI.init();
    NotebookUI.init();
    TrainerUI.init();
    window.SettingsUI = SettingsUI;
    SettingsUI.init();
    HistoryUI.init();
    AnalyticsUI.init();
    DietUI.init();
    initSexConfirm(); // jednorazowe potwierdzenie zapisanej płci (Pomiary, Dieta)
    OnboardingUI.init();
    ChatUI.init();
    DiagnosticsUI.init();
    NumpadUI.init();
    BackupUI.init();

    // AI Analytics — renders on tab open
    document.addEventListener('tabChanged', (e) => {
        if (e.detail && e.detail.tab === 'ai-analytics-dashboard') {
            const container = document.getElementById('ai-analytics-content');
            if (container) AiAnalyticsUI.render(container);
        }
    });

    console.log("Uki's BodyBuild Initialized (Module System)");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
