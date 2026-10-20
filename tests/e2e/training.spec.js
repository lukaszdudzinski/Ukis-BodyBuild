import { test, expect } from '../fixtures.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { TrainingPage } from './pages/TrainingPage.js';

test.describe('Training Workflow', () => {
    test('Should navigate to training and open session form', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const trainingPage = new TrainingPage(page);

        // Given I am on the home page
        await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); });
        await dashboard.navigate();

        // When I click on Training tile
        await dashboard.goToTraining();

        // Then I should see the calendar
        await expect(page.locator('#training-calendar-view')).toBeVisible();

        // When I select day 15 (arbitrary day without training initially)
        await trainingPage.selectDay('15');

        // Then I should see the start new session button
        await expect(trainingPage.startNewSessionBtn).toBeVisible();

        // When I click start session
        await trainingPage.startNewSession();

        // Then I should see the active training view
        await expect(page.locator('#active-training-view')).toBeVisible();
        await expect(trainingPage.trainingNameInput).toBeVisible();
        
        // Take a snapshot to ensure the form looks correct (Visual Regression)
        await expect(page).toHaveScreenshot('active-training-form.png', { maxDiffPixels: 100, mask: [page.locator('#training-timer')] });
    });

    for (const variant of [
        { name: 'nowy wygląd', path: '/', classic: false },
        { name: 'klasyczny', path: '/classic.html', classic: true },
    ]) {
        test(`pole nazwy treningu ma tło inne niż kolor tekstu (${variant.name})`, async ({ page }) => {
            const trainingPage = new TrainingPage(page);

            await page.addInitScript((classic) => {
                window.localStorage.setItem('tutorial_global_v22', 'true');
                if (classic) window.localStorage.setItem('uki-ui-version', 'classic');
            }, variant.classic);
            await page.goto(variant.path);
            await page.waitForTimeout(1000);

            await page.evaluate(() => window.switchTab('training-dashboard'));
            await expect(page.locator('#training-calendar-view')).toBeVisible();
            await trainingPage.selectDay('15');
            await trainingPage.startNewSession();
            await expect(trainingPage.trainingNameInput).toBeVisible();
            await trainingPage.setTrainingName('Push A');

            const { backgroundColor, color } = await trainingPage.trainingNameInput.evaluate((el) => {
                const cs = getComputedStyle(el);
                return { backgroundColor: cs.backgroundColor, color: cs.color };
            });
            expect(backgroundColor).not.toBe(color);
            expect(backgroundColor).not.toBe('rgb(255, 255, 255)');
        });
    }
});
