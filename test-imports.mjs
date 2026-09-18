const modules = [
  './src/modules/ui/HistoryUI.js',
  './src/modules/ui/AnalyticsUI.js',
  './src/modules/ui/AiAnalyticsUI.js',
  './src/modules/ui/MeasurementsUI.js',
  './src/modules/ui/DietUI.js'
];

async function test() {
  for (const m of modules) {
    try {
      await import(m);
      console.log(`✅ ${m} imported successfully`);
    } catch (e) {
      console.error(`❌ Error importing ${m}:`, e);
    }
  }
}
test();
