const { test, expect } = require('@playwright/test');

test('Debug History Visibility', async ({ page }) => {
  await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.02'); });
  await page.goto('/');
  await page.waitForTimeout(1000);
  
  const uniqueName = "Trening z superserią test " + Date.now();
  await page.evaluate(async (name) => {
      const today = new Date().toISOString().split('T')[0];
      await window.DatabaseManager.addTraining({
          date: today, name: name, duration_seconds: 3600, type: "strength",
          exercises: [{
              id: "sup1", type: "superset", name: "",
              exercises: [
                  { id: "s1", type: "strength", name: "Biceps", sets: [{weight: 10, reps: 10}] }
              ]
          }]
      });
  }, uniqueName);
  await page.reload();
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.switchTab('history-dashboard'));
  await page.waitForSelector('#history-dashboard', { state: 'visible' });
  
  const el = page.locator('text=' + uniqueName).first();
  const visibility = await el.evaluate(e => {
     let cur = e;
     let path = [];
     while(cur) {
        let comp = window.getComputedStyle(cur);
        path.push({
           tag: cur.tagName,
           id: cur.id,
           className: cur.className,
           display: comp.display,
           visibility: comp.visibility,
           height: comp.height,
           width: comp.width,
           opacity: comp.opacity
        });
        if(cur.id === 'history-dashboard') break;
        cur = cur.parentElement;
     }
     return path;
  });
  
  console.log(JSON.stringify(visibility, null, 2));
});
