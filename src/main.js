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
import { ChangelogUI } from './modules/ui/ChangelogUI.js';
import { DiagnosticsUI } from './modules/ui/DiagnosticsUI.js';
window.ukiLogError = (msg, stack) => {
    let logs = [];
    try { logs = JSON.parse(localStorage.getItem('uki_error_logs') || '[]'); } catch(e) {}
    logs.unshift({ time: new Date().toISOString(), msg, stack });
    if(logs.length > 50) logs.length = 50;
    localStorage.setItem('uki_error_logs', JSON.stringify(logs));
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

// Initialize Application
const initApp = () => {
    console.log("Starting App Initialization...");
    AppUI.init();
    MeasurementsUI.init();
    TrainingUI.init();
    SettingsUI.init();
    HistoryUI.init();
    AnalyticsUI.init();
    DietUI.init();
    OnboardingUI.init();
    ChatUI.init();
    ChangelogUI.init();
    DiagnosticsUI.init();

    console.log("Uki's BodyBuild Initialized (Module System)");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
