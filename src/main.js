import { AppUI } from './modules/ui/AppUI.js';
import { DivemasterUI } from './modules/ui/DivemasterUI.js';
import { LogbookUI } from './modules/ui/LogbookUI.js';
import { CalendarUI } from './modules/ui/CalendarUI.js';

// Initialize Application
// Initialize Application
const initApp = () => {
    console.log("Starting App Initialization...");
    AppUI.init();
    DivemasterUI.init();
    LogbookUI.init();
    CalendarUI.init();

    console.log("Uki's Dive Tools Initialized (Module System)");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
