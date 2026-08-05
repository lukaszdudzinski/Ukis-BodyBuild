export class DashboardPage {
    constructor(page) {
        this.page = page;
        this.trainingTile = page.locator('.dashboard-card', { hasText: 'Trening' });
    }

    async navigate() {
        await this.page.goto('/');
    }

    async goToTraining() {
        await this.trainingTile.click();
    }
}
