const fs = require('fs');
let code = fs.readFileSync('src/modules/ui/AnalyticsUI.js', 'utf8');
code = code.replace(/^import .*;$/gm, '');
code = code.replace(/^export const /gm, 'const ');

// Mock DOM & window
global.window = {};
global.document = {
  getElementById: () => ({ innerHTML: '', value: 'test' }),
  addEventListener: () => {}
};
global.Chart = function() { this.destroy = () => {}; };

eval(code);

try {
  AnalyticsUI.renderNewAnalytics({ innerHTML: '' }, [], []);
  console.log('Analytics rendered successfully with empty arrays.');
} catch (e) {
  console.log('Runtime ERROR empty arrays:', e.stack);
}
try {
  AnalyticsUI.renderNewAnalytics({ innerHTML: '' }, [{id:1, type:'strength', date:'2026-09-10', exercises: [{name: 'Wyciskanie', sets:[{weight:100, reps:5}]}]}], []);
  console.log('Analytics rendered successfully with mock data.');
} catch (e) {
  console.log('Runtime ERROR with data:', e.stack);
}
