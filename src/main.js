import { AppUI } from './modules/ui/AppUI.js';
// import { CalendarUI } from './modules/ui/CalendarUI.js';
import { MeasurementsUI } from './modules/ui/MeasurementsUI.js';

// Initialize Application
const initApp = () => {
    console.log("Starting App Initialization...");
    AppUI.init();
    MeasurementsUI.init();
    // CalendarUI.init();

    console.log("Uki's BodyBuild Initialized (Module System)");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
