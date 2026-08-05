import { AppUI } from './modules/ui/AppUI.js';
import { MeasurementsUI } from './modules/ui/MeasurementsUI.js';
import { TrainingUI } from './modules/ui/TrainingUI.js';
import { SettingsUI } from './modules/ui/SettingsUI.js';
import { HistoryUI } from './modules/ui/HistoryUI.js';
import { AnalyticsUI } from './modules/ui/AnalyticsUI.js';

// Initialize Application
const initApp = () => {
    console.log("Starting App Initialization...");
    AppUI.init();
    MeasurementsUI.init();
    TrainingUI.init();
    SettingsUI.init();
    HistoryUI.init();
    AnalyticsUI.init();

    console.log("Uki's BodyBuild Initialized (Module System)");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
