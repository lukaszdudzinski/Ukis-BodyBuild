const { test, expect } = require('@playwright/test');

test('Sprawdzenie poprawnego usuwania sesji treningowych z bazy PWA', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
    await page.goto('/');

  await page.waitForTimeout(1000); 

  // Wywołanie bezpośrednie do Database Managera aplikacji w kontekście przeglądarki
  const testId = await page.evaluate(async () => {
       const module = await import('./src/modules/db/DatabaseManager.js');
       const dm = module.DatabaseManager;
       await dm.init();
       const tr = await dm.addTraining({
           date: '2026-08-08',
           duration_seconds: 600,
           exercises: [],
           name: 'Automatyczny Test Usuwania'
       });
       return tr.id;
  });

  expect(testId).toBeDefined();

  const isDeleted = await page.evaluate(async (id) => {
       const module = await import('./src/modules/db/DatabaseManager.js');
       const dm = module.DatabaseManager;
       await dm.init();
       
       let trainings = await dm.getTrainings();
       const found = trainings.find(t => t.id === id);
       if(!found) return false;
       
       await dm.deleteTraining(id);
       
       trainings = await dm.getTrainings();
       const stillThere = trainings.find(t => t.id === id);
       return stillThere === undefined; 
  }, testId);

  expect(isDeleted).toBe(true);
});
