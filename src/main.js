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

    console.log("Uki's BodyBuild Initialized (Module System)");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
