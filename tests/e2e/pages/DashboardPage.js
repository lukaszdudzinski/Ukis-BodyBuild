export class DashboardPage {
    constructor(page) {
        this.page = page;
        this.measurementsTile = page.locator('a[data-tab="measurements-dashboard"]');
        this.trainingTile = page.locator('a[data-tab="training-dashboard"]');
        this.historyTile = page.locator('a[data-tab="history-dashboard"]');
    }

    async navigate() {
        await this.page.goto('/');
    }

    async goToTraining() {
        await this.trainingTile.click();
    }
}
