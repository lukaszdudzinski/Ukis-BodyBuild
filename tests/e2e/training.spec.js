import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/DashboardPage.js';
import { TrainingPage } from './pages/TrainingPage.js';

test.describe('Training Workflow', () => {
    test('Should navigate to training and open session form', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const trainingPage = new TrainingPage(page);

        // Given I am on the home page
        await page.addInitScript(() => window.localStorage.setItem('tutorial_global_v22', 'true'));
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
        await expect(page).toHaveScreenshot('active-training-form.png', { maxDiffPixels: 100 });
    });
});
