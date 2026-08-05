export class TrainingPage {
    constructor(page) {
        this.page = page;
        this.startNewSessionBtn = page.locator('#start-new-session-btn');
        this.trainingNameInput = page.locator('#training-name-input');
        this.addExerciseBtn = page.locator('#add-exercise-to-plan-btn');
        this.finishTrainingBtn = page.locator('#finish-training-btn');
        this.pauseBtn = page.locator('#pause-training-btn');
    }

    async selectDay(dayNumber) {
        // Find a day cell in the calendar with the text
        const dayCell = this.page.locator(`.calendar-day:not(.empty)`, { hasText: new RegExp(`^${dayNumber}$`) });
        await dayCell.click();
    }

    async startNewSession() {
        await this.startNewSessionBtn.click();
    }

    async setTrainingName(name) {
        await this.trainingNameInput.fill(name);
    }
}
