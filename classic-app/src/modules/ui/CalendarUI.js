import { CalendarDB } from '../data/CalendarDB.js';

export const CalendarUI = {
    currentDate: new Date(),
    events: [],

    async init() {
        console.log("Initializing Calendar UI...");
        try {
            this.events = await CalendarDB.getEvents();
        } catch (error) {
            console.error("Error fetching calendar events:", error);
            this.events = [];
            const listContainer = document.getElementById('calendar-entries');
            if (listContainer) {
                listContainer.innerHTML = `<div class="result-error" style="color:#ff3860;">Nie udało się wczytać kalendarza.</div>`;
            }
        }
        this.renderCalendar();
    },

    renderCalendar() {
        const container = document.getElementById('calendar-entries');
        if (!container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // 0 = Sunday, 1 = Monday. We want week to start on Monday.
        let startingDayOfWeek = firstDay.getDay(); 
        if (startingDayOfWeek === 0) startingDayOfWeek = 7;
        
        const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
        
        let html = `
            <div class="calendar-header">
                <button class="calendar-nav-btn" id="cal-prev-btn">&laquo; Poprzedni</button>
                <h3 style="margin: 0; color: #fff;">${monthNames[month]} ${year}</h3>
                <button class="calendar-nav-btn" id="cal-next-btn">Następny &raquo;</button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Pn</div>
                <div class="calendar-day-header">Wt</div>
                <div class="calendar-day-header">Śr</div>
                <div class="calendar-day-header">Cz</div>
                <div class="calendar-day-header">Pt</div>
                <div class="calendar-day-header">So</div>
                <div class="calendar-day-header">Nd</div>
        `;

        // Empty cells before the first day of the month
        for (let i = 1; i < startingDayOfWeek; i++) {
            html += `<div class="calendar-day empty"></div>`;
        }

        const today = new Date();

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = this.events.filter(e => e.date === dateStr);
            
            const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
            
            let classes = ['calendar-day'];
            if (isToday) classes.push('today');
            if (dayEvents.length > 0) classes.push('has-event');

            let indicatorsHtml = '<div class="event-indicators">';
            dayEvents.forEach(e => {
                let color = '#42b883'; // zielony
                if (e.category === 'wyjazd') color = '#D81B60'; // turkusowy
                if (e.category === 'nurkowanie') color = '#3273dc'; // niebieski
                indicatorsHtml += `<div class="event-dot" style="background-color: ${color};" title="${e.title}"></div>`;
            });
            indicatorsHtml += '</div>';

            html += `
                <div class="${classes.join(' ')}" data-date="${dateStr}">
                    <div class="day-number">${day}</div>
                    ${dayEvents.length > 0 ? indicatorsHtml : ''}
                </div>
            `;
        }

        html += `</div>`;
        container.innerHTML = html;

        // Attach event listeners
        document.getElementById('cal-prev-btn').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        document.getElementById('cal-next-btn').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Add click listeners to days with events
        const eventDays = container.querySelectorAll('.calendar-day.has-event');
        eventDays.forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const dateStr = dayEl.getAttribute('data-date');
                const dayEvents = this.events.filter(e => e.date === dateStr);
                this.showModal(dateStr, dayEvents);
            });
        });
    },

    showModal(dateStr, events) {
        // Remove existing modal if any
        const existingOverlay = document.querySelector('.calendar-modal-overlay');
        if (existingOverlay) existingOverlay.remove();

        const phone = '883929303';
        const email = 'nurkujniebiegaj@gmail.com';

        let eventsHtml = '';
        events.forEach((event, index) => {
            let badgeColor = '#42b883';
            if (event.category === 'wyjazd') badgeColor = '#D81B60';
            if (event.category === 'nurkowanie') badgeColor = '#3273dc';

            let smsTemplate = `Cześć. Poproszę o info dotyczące ${event.title} z dnia ${event.date}.`;
            if (event.category === 'nurkowanie') {
                smsTemplate = `Cześć. Poproszę o rezerwację miejsca na nurkowanie w dniu ${event.date}.`;
            } else if (event.category === 'szkolenie' || event.category === 'kurs') {
                smsTemplate = `Cześć. Poproszę o rezerwację miejsca na kurs ${event.title} w dniach ${event.date}.`;
            }
            const smsBody = encodeURIComponent(smsTemplate);
            const subject = encodeURIComponent(`Zapytanie o ${event.title} (${event.date})`);
            const emailBody = smsBody;

            const mapLink = event.location ? `https://maps.google.com/?q=${encodeURIComponent(event.location)}` : '#';
            const eventId = `event-${index}`;

            const btnStyle = "flex:1; text-decoration: none; text-align: center; background: rgba(255,255,255,0.1); color: #fff; padding: 10px 2px; border-radius: 6px; font-size: 0.75em; transition: 0.2s; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center;";

            eventsHtml += `
                <div class="dashboard-card" style="text-align: left; position: relative; padding: 20px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.1);">
                    
                    <div style="text-align: center; margin-bottom: 10px;">
                        <span style="font-size: 0.8em; padding: 4px 8px; border-radius: 4px; background: ${badgeColor}; color: #111; font-weight: bold; text-transform: uppercase;">
                            ${event.category}
                        </span>
                    </div>

                    <h3 style="margin-top: 0; margin-bottom: 5px; color: #fff; text-align: center;">${event.title}</h3>
                    
                    <p style="color: #D81B60; font-size: 0.95em; margin-bottom: 15px; text-align: center;">
                        📍 ${event.location ? `<a href="${mapLink}" target="_blank" style="color: #D81B60; text-decoration: underline;">${event.location}</a>` : 'Brak lokalizacji'}
                    </p>
                    
                    <div style="font-size: 0.9em; color: #ccc; margin-bottom: 20px; text-align: center;">
                        ${event.description || ''}
                    </div>
                    
                    <div style="display: flex; gap: 5px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; justify-content: space-between;">
                        <a href="tel:+48${phone}" class="modal-action-btn" style="${btnStyle}">
                            <div style="font-size: 1.4em; margin-bottom: 4px;">📞</div>
                            Zadzwoń
                        </a>
                        <a href="sms:+48${phone}?body=${smsBody}" class="modal-action-btn" style="${btnStyle}">
                            <div style="font-size: 1.4em; margin-bottom: 4px;">💬</div>
                            SMS
                        </a>
                        <a href="mailto:${email}?subject=${subject}&body=${emailBody}" class="modal-action-btn" style="${btnStyle}">
                            <div style="font-size: 1.4em; margin-bottom: 4px;">✉️</div>
                            Email
                        </a>
                        <button class="modal-action-btn toggle-payment-btn" data-target="payment-${eventId}" style="${btnStyle}">
                            <div style="font-size: 1.4em; margin-bottom: 4px;">💳</div>
                            Zaliczka
                        </button>
                    </div>

                    <div class="payment-details" id="payment-${eventId}">
                        <div class="payment-row">
                            <div>Odbiorca:<br><strong>Tomasz Biegaj</strong></div>
                            <button class="copy-btn" data-copy="Tomasz Biegaj">Kopiuj</button>
                        </div>
                        <div class="payment-row">
                            <div>Konto:<br><strong>12 3456 7890 0000 0000 0000 0000</strong></div>
                            <button class="copy-btn" data-copy="12345678900000000000000000">Kopiuj</button>
                        </div>
                        <div class="payment-row">
                            <div>Tytuł:<br><strong>Zaliczka na ${event.title}</strong></div>
                            <button class="copy-btn" data-copy="Zaliczka na ${event.title}">Kopiuj</button>
                        </div>
                        <div class="payment-row">
                            <div>BLIK:<br><strong>883 929 303</strong></div>
                            <button class="copy-btn" data-copy="883929303">Kopiuj</button>
                        </div>
                        <div style="margin-top: 10px; font-size: 0.8em; color: #ffdd57; text-align: center; line-height: 1.2;">
                            (Uwaga: Numer bankowy tylko do testów, nie wykonuj na niego przelewu!)
                        </div>
                    </div>

                </div>
            `;
        });

        const overlay = document.createElement('div');
        overlay.className = 'calendar-modal-overlay';
        overlay.innerHTML = `
            <div class="calendar-modal">
                <button class="calendar-modal-close">&times;</button>
                <h2 style="margin-top: 0; color: #D81B60; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 15px; text-align: center;">
                    Wydarzenia z dnia:<br>
                    <small style="color: #fff;">${dateStr}</small>
                </h2>
                <div class="calendar-modal-content">
                    ${eventsHtml}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Add hover effects for dynamically created buttons inside modal
        overlay.querySelectorAll('.modal-action-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(255,255,255,0.2)');
            btn.addEventListener('mouseleave', () => {
                if (!btn.classList.contains('active-payment-btn')) {
                    btn.style.background = 'rgba(255,255,255,0.1)';
                }
            });
        });

        // Payment toggle logic
        overlay.querySelectorAll('.toggle-payment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = btn.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.classList.toggle('active');
                    if (targetEl.classList.contains('active')) {
                        btn.classList.add('active-payment-btn');
                        btn.style.background = 'rgba(216, 27, 96, 0.3)';
                    } else {
                        btn.classList.remove('active-payment-btn');
                        btn.style.background = 'rgba(255,255,255,0.2)'; // hovered state since mouse is on it
                    }
                }
            });
        });

        // Copy logic
        overlay.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const textToCopy = btn.getAttribute('data-copy');
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        const originalText = btn.innerText;
                        btn.innerText = 'Skopiowano!';
                        btn.style.background = '#D81B60';
                        btn.style.color = '#111';
                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.style.background = '';
                            btn.style.color = '';
                        }, 2000);
                    });
                }
            });
        });

        // Trigger animation
        requestAnimationFrame(() => overlay.classList.add('active'));

        // Close logic
        const closeModal = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.querySelector('.calendar-modal-close').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }
};
