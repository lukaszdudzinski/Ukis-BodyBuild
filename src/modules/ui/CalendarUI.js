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
            <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);">
                <button class="calendar-nav-btn" id="cal-prev-btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 12px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 600;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Poprzedni
                </button>
                <h3 style="margin: 0; color: #fff; font-size: 1.2em; font-weight: 700;">${monthNames[month]} ${year}</h3>
                <button class="calendar-nav-btn" id="cal-next-btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 8px 12px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 600;">
                    Następny
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
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

            const btnStyle = "flex:1; text-decoration: none; text-align: center; background: rgba(255,255,255,0.05); color: #fff; padding: 12px 4px; border-radius: 12px; font-size: 0.75em; transition: 0.2s; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;";

            eventsHtml += `
                <div class="dashboard-card" style="text-align: left; position: relative; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; background: rgba(255,255,255,0.03); backdrop-filter: blur(10px);">
                    
                    <div style="text-align: center; margin-bottom: 15px;">
                        <span style="font-size: 0.8em; padding: 4px 10px; border-radius: 8px; background: ${badgeColor}20; color: ${badgeColor}; border: 1px solid ${badgeColor}40; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${event.category}
                        </span>
                    </div>

                    <h3 style="margin-top: 0; margin-bottom: 10px; color: #fff; text-align: center; font-size: 1.25em;">${event.title}</h3>
                    
                    <div style="display: flex; align-items: center; justify-content: center; gap: 6px; color: #FF9800; font-size: 0.9em; margin-bottom: 15px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${event.location ? `<a href="${mapLink}" target="_blank" style="color: #FF9800; text-decoration: underline;">${event.location}</a>` : 'Brak lokalizacji'}
                    </div>
                    
                    <div style="font-size: 0.95em; color: #8E8E93; margin-bottom: 25px; text-align: center; line-height: 1.5;">
                        ${event.description || ''}
                    </div>
                    
                    <div style="display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; justify-content: space-between;">
                        <a href="tel:+48${phone}" class="modal-action-btn" style="${btnStyle}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            Zadzwoń
                        </a>
                        <a href="sms:+48${phone}?body=${smsBody}" class="modal-action-btn" style="${btnStyle}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            SMS
                        </a>
                        <a href="mailto:${email}?subject=${subject}&body=${emailBody}" class="modal-action-btn" style="${btnStyle}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            Email
                        </a>
                        <button class="modal-action-btn toggle-payment-btn" data-target="payment-${eventId}" style="${btnStyle}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
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
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(17,17,24,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; opacity: 0; transition: opacity 0.3s;';
        overlay.innerHTML = `
            <div class="calendar-modal" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 90%; max-width: 400px; padding: 25px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.5); backdrop-filter: blur(20px);">
                <button class="calendar-modal-close" style="position: absolute; right: 20px; top: 20px; background: rgba(255,255,255,0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 16px; font-size: 1.2em; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;">&times;</button>
                <h2 style="margin-top: 0; color: #FF9800; border-bottom: 1px solid rgba(255,152,0,0.3); padding-bottom: 15px; margin-bottom: 20px; text-align: center; font-size: 1.3em; font-weight: 600;">
                    Wydarzenia z dnia:<br>
                    <small style="color: #fff; font-size: 0.8em; font-weight: normal;">${dateStr}</small>
                </h2>
                <div class="calendar-modal-content" style="display: flex; flex-direction: column; gap: 15px;">
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
