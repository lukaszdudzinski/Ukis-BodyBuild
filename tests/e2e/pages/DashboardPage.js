export class DashboardPage {
    constructor(page) {
        this.page = page;
        this.measurementsTile = page.locator('.glass-card[onclick="switchTab(\'measurements-dashboard\')"], .nav-btn[onclick="switchTab(\'measurements-dashboard\')"]').first();
        this.trainingTile = page.locator('.glass-card[onclick="switchTab(\'training-dashboard\')"], .nav-btn[onclick="switchTab(\'training-dashboard\')"]').first();
        this.historyTile = page.locator('.glass-card[onclick="switchTab(\'history-dashboard\')"], .nav-btn[onclick="switchTab(\'history-dashboard\')"]').first();
    }

    async navigate() {
        await this.page.goto('/'); await this.page.waitForTimeout(1000);
    }

    async goToTraining() {
        // Wait for it to be visible
        await this.trainingTile.waitFor({ state: 'visible' });
        await this.trainingTile.click();
    }
}
