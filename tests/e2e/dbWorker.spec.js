const { test, expect } = require('@playwright/test');

test.describe('DatabaseManager & dbWorker (OPFS/Memory fallback)', () => {
    
    test.beforeEach(async ({ page }) => {
        // Mock standalone to bypass landing page
        await page.addInitScript(() => {
            Object.defineProperty(window.navigator, 'standalone', { value: true, configurable: true });
            window.matchMedia = function (query) {
                if (query === '(display-mode: standalone)') {
                    return { matches: true, media: query, onchange: null, addListener: () => {}, removeListener: () => {} };
                }
                return { matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {} };
            };
            window.localStorage.setItem('tutorial_global_v22', 'true');
        });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Powinien poprawnie zainicjalizować bazę danych i dodać pomiar przez Workera', async ({ page }) => {
        // Evaluate logic in browser context using the globally exposed DatabaseManager
        const measurementId = await page.evaluate(async () => {
            await window.DatabaseManager.init();
            const data = {
                date: '2026-08-25',
                weight: 85.5,
                chest: 110,
                biceps: 40
            };
            const result = await window.DatabaseManager.addMeasurement(data);
            return result.id;
        });

        expect(measurementId).toBeDefined();
        expect(typeof measurementId).toBe('number');

        // Verify it was saved
        const measurements = await page.evaluate(async () => {
            return await window.DatabaseManager.getMeasurements();
        });

        expect(measurements.length).toBeGreaterThan(0);
        expect(measurements[0].weight).toBe(85.5);
        expect(measurements[0].date).toBe('2026-08-25');
    });

    test('Powinien poprawnie wykonać zapytania masowe z użyciem transakcji w Workerze', async ({ page }) => {
        const importResult = await page.evaluate(async () => {
            await window.DatabaseManager.init();
            const dump = {
                measurements: [{ id: 999, date: '2026-01-01', weight: 80, created_at: new Date().toISOString() }],
                trainings: [],
                dietLogs: [],
                aiAnalyses: []
            };
            await window.DatabaseManager.importDatabase(JSON.stringify(dump));
            
            const m = await window.DatabaseManager.getMeasurements();
            return m;
        });

        expect(importResult.length).toBe(1);
        expect(importResult[0].id).toBe(999);
        expect(importResult[0].weight).toBe(80);
    });
});
