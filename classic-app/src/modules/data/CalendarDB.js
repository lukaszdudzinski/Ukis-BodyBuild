export const CalendarDB = {
    async getEvents() {
        try {
            // Dodajemy znacznik czasu, aby ominąć cache na GitHub Pages
            const response = await fetch(`calendar_events.json?t=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error('Nie udało się pobrać kalendarza.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd pobierania wydarzeń kalendarza:', error);
            return [];
        }
    }
};
