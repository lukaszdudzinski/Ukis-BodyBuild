// wyglad: zar
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { ikona } from '../wyglad/ikony.js';
import { bezpiecznyHtml } from '../wyglad/bezpiecznyHtml.js';

// Dane użytkownika (tekst wiadomości, pseudonim) wchodzą do innerHTML tylko przez esc().
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const ChatUI = {
    init: () => {
        // Inject chat HTML into body if not present
        if (!document.getElementById('edward-chat-widget')) {
            const chatHtml = `
                <!-- Przycisk czatu: koło akcentu motywu nad paskiem dolnym (spec 6.2, .z-fab w components.css) -->
                <button type="button" id="edward-chat-toggle" class="z-ic z-ic-acc z-fab" aria-label="Czat z Edwardem"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V4M9 13h.01M15 13h.01"/></svg></button>

                <!-- Okno czatu: cały ekran (spec 8.3), style w styles/zar/ekrany/edward.css -->
                <div id="edward-chat-window" role="dialog" aria-label="Czat z Edwardem">
                    <header class="z-chat-head">
                        <span class="z-chat-ikona" aria-hidden="true">${ikona('bot', 24)}</span>
                        <div class="z-head-txt">
                            <h2 class="z-hd z-chat-tytul">Trener Edward</h2>
                            <p class="z-sub">Zawsze gotowy do pomocy</p>
                        </div>
                        <button type="button" id="edward-chat-close" class="z-ic z-card" aria-label="Zamknij czat">${ikona('x')}</button>
                    </header>

                    <div id="edward-chat-messages" class="z-chat-lista" aria-live="polite">
                        <div class="z-chat-msg z-chat-edward">
                            <div class="z-mut z-chat-autor">Edward</div>
                            <div class="z-chat-dymek z-card">Cześć! Jestem Edward, Twój wirtualny trener. Masz pytania o trening, dietę czy regenerację? Wal śmiało!</div>
                        </div>
                    </div>

                    <div class="z-chat-pole">
                        <input type="text" id="edward-chat-input" class="z-in z-chat-wejscie" placeholder="Napisz do Edwarda…" aria-label="Wiadomość do Edwarda" autocomplete="off">
                        <button type="button" id="edward-chat-send" class="z-ic z-ic-acc z-chat-wyslij" aria-label="Wyślij">${ikona('send', 22)}</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', chatHtml);
            ChatUI.bindEvents();
        }
    },

    bindEvents: () => {
        
        const toggleBtn = document.getElementById('edward-chat-toggle');
        
        // --- DRAGGABLE LOGIC ---
        let isDragging = false;
        let hasDragged = false;
        let startY, startX, initialBottom, initialRight;
        
        const onTouchStart = (e) => {
            isDragging = true;
            hasDragged = false;
            toggleBtn.style.transition = 'none';
            const touch = e.touches ? e.touches[0] : e;
            startY = touch.clientY;
            startX = touch.clientX;
            initialBottom = parseInt(window.getComputedStyle(toggleBtn).bottom, 10);
            initialRight = parseInt(window.getComputedStyle(toggleBtn).right, 10);
        };
        
        const onTouchMove = (e) => {
            if (!isDragging) return;
            const touch = e.touches ? e.touches[0] : e;
            const dy = startY - touch.clientY;
            const dx = startX - touch.clientX;
            
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                hasDragged = true;
                e.preventDefault(); // prevent scroll only when actually dragging
            }
            
            let newBottom = initialBottom + dy;
            let newRight = initialRight + dx;
            
            if (newBottom < 80) newBottom = 80;
            if (newRight < 10) newRight = 10;
            if (newRight > window.innerWidth - 70) newRight = window.innerWidth - 70;
            if (newBottom > window.innerHeight - 70) newBottom = window.innerHeight - 70;

            toggleBtn.style.bottom = newBottom + 'px';
            toggleBtn.style.right = newRight + 'px';
        };
        
        const onTouchEnd = (e) => {
            isDragging = false;
            toggleBtn.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        };

        if (toggleBtn) {
            toggleBtn.addEventListener('touchstart', onTouchStart, {passive: false});
            toggleBtn.addEventListener('touchmove', onTouchMove, {passive: false});
            toggleBtn.addEventListener('touchend', onTouchEnd);
            toggleBtn.addEventListener('mousedown', onTouchStart);
            window.addEventListener('mousemove', onTouchMove, {passive: false});
            window.addEventListener('mouseup', onTouchEnd);
            
            // Prevent click if dragged
            toggleBtn.addEventListener('click', (e) => {
                if (hasDragged) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
            });
        }
        // -----------------------
        

        const closeBtn = document.getElementById('edward-chat-close');
        const chatWindow = document.getElementById('edward-chat-window');
        const sendBtn = document.getElementById('edward-chat-send');
        const input = document.getElementById('edward-chat-input');

        toggleBtn.addEventListener('click', () => {
            if (window.PremiumUI && !window.PremiumUI.checkPremium()) {
                window.PremiumUI.showPremiumPaywall();
                return;
            }
            const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';
            chatWindow.style.display = isHidden ? 'flex' : 'none';
            document.body.classList.toggle('z-edward-otwarty', isHidden);
            if (isHidden) {
                input.focus();
                toggleBtn.style.display = 'none';
            }
        });

        const zamknij = () => {
            chatWindow.style.display = 'none';
            document.body.classList.remove('z-edward-otwarty');
            toggleBtn.style.display = 'flex';
        };
        closeBtn.addEventListener('click', zamknij);
        // Zmiana zakładki (także programowa: Strefa trenera, wyłączone sekcje) zamyka czat,
        // żeby klasa chowająca aplikację nie została przy ukrytym oknie.
        document.addEventListener('tabChanged', () => {
            if (document.body.classList.contains('z-edward-otwarty')) zamknij();
        });

        sendBtn.addEventListener('click', ChatUI.sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') ChatUI.sendMessage();
        });
    },

    showContextualBubble: (message, clickable = true) => {
        let bubble = document.getElementById('edward-contextual-bubble');
        if (bubble) bubble.remove();

        const toggleBtn = document.getElementById('edward-chat-toggle');
        // Jeśli okno czatu jest otwarte, nie pokazujemy dymka tylko wrzucamy wiadomość
        if (toggleBtn && toggleBtn.style.display === 'none') {
            ChatUI.appendMessage(message, 'edward');
            return;
        }
        if (!toggleBtn) {
            console.warn("ChatUI nie jest zainicjowany. Dymek zignorowany.");
            return;
        }

        const currentBottom = parseInt(window.getComputedStyle(toggleBtn).bottom, 10) || 90;
        const currentRight = parseInt(window.getComputedStyle(toggleBtn).right, 10) || 20;

        bubble = document.createElement('div');
        bubble.id = 'edward-contextual-bubble';
        bubble.className = 'z-card z-edward-dymek' + (clickable ? ' z-klik' : '');
        // Położenie nad przyciskiem (przycisk można przeciągać); reszta wyglądu w edward.css.
        bubble.style.bottom = (currentBottom + 75) + 'px';
        bubble.style.right = currentRight + 'px';

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = message;
        bubble.appendChild(contentDiv);
        document.body.appendChild(bubble);

        // Animacja wejścia (klasa .z-on; przy prefers-reduced-motion bez przejścia)
        requestAnimationFrame(() => bubble.classList.add('z-on'));

        const schowaj = () => {
            bubble.classList.remove('z-on');
            setTimeout(() => bubble.remove(), 400);
        };

        if (clickable) {
            bubble.addEventListener('click', () => {
                if (window.PremiumUI && !window.PremiumUI.checkPremium()) {
                    window.PremiumUI.showPremiumPaywall();
                    return;
                }
                schowaj();
                toggleBtn.click(); // Otwórz czat
                ChatUI.appendMessage(message, 'edward'); // Dodaj do historii
            });
        }

        // Automatyczne zniknięcie po 6 sekundach jeśli nie kliknięto
        setTimeout(() => {
            if (document.getElementById('edward-contextual-bubble')) {
                schowaj();
            }
        }, 6000);
    },

    appendMessage: (text, sender) => {
        const messagesDiv = document.getElementById('edward-chat-messages');
        if (!messagesDiv) return;
        const isUser = sender === 'user';
        
        // Użytkownik: tekst i pseudonim przez esc(); Edward: odpowiedź przez marked i bezpiecznyHtml.
        const autor = isUser ? (localStorage.getItem('userNick') || 'Ty') : 'Edward';
        const html = `
            <div class="z-chat-msg ${isUser ? 'z-chat-user' : 'z-chat-edward'}">
                <div class="z-mut z-chat-autor">${esc(autor)}</div>
                <div class="z-chat-dymek${isUser ? '' : ' z-card'}">${isUser ? esc(text) : bezpiecznyHtml(marked.parse(text))}</div>
            </div>
        `;

        messagesDiv.insertAdjacentHTML('beforeend', html);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    },

    showTyping: () => {
        const messagesDiv = document.getElementById('edward-chat-messages');
        const html = `
            <div id="edward-typing" class="z-chat-msg z-chat-edward">
                <div class="z-mut z-chat-autor">Edward</div>
                <div class="z-chat-dymek z-card z-chat-pisze"><span class="z-sr">Edward pisze</span><span class="z-chat-kropka" aria-hidden="true"></span><span class="z-chat-kropka" aria-hidden="true"></span><span class="z-chat-kropka" aria-hidden="true"></span></div>
            </div>
        `;
        messagesDiv.insertAdjacentHTML('beforeend', html);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    },

    removeTyping: () => {
        const typing = document.getElementById('edward-typing');
        if (typing) typing.remove();
    },

    sendMessage: async () => {
        const input = document.getElementById('edward-chat-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        ChatUI.appendMessage(text, 'user');
        
        // Ensure URL is configured or use default fallback
        let workerUrl = localStorage.getItem('dietWorkerUrl') || 'https://uki-dieta.lukasz-dudzinski.workers.dev';
        if (!workerUrl) {
            ChatUI.appendMessage("Musisz najpierw skonfigurować URL do chmury AI (Cloudflare Worker) w zakładce Profil i Ustawienia!", 'edward');
            return;
        }

        ChatUI.showTyping();

        try {
            // Wstrzyknięcie kontekstu najnowszej analizy AI (żeby Edward pamiętał co radził)
            let finalPrompt = text;
            try {
                if (window.DatabaseManager) {
                    const analyses = await window.DatabaseManager.getAiAnalyses();
                    if (analyses && analyses.length > 0) {
                        const lastAnalysis = analyses[0];
                        finalPrompt = '[Ukryty Systemowy Kontekst: Użytkownik otrzymał niedawno audyt AI (' + lastAnalysis.date + '), brzmiał on następująco (skrót): ' + lastAnalysis.content.substring(0, 400) + '...]\n\nPytanie użytkownika: ' + text;
                    }
                }
            } catch(e) { console.warn("Nie udało się pobrać historii analiz do kontekstu chatu."); }

            const response = await fetch(workerUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    images: [],
                    imageBase64: null,
                    contextText: finalPrompt,
                    action: "chat" // Tells worker to use Chat prompt
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                if (errorData.includes("exceeded your current quota") || errorData.includes("Quota exceeded") || response.status === 429) {
                    throw new Error("Darmowy limit zapytań AI został wyczerpany na dziś. Wróć i spróbuj ponownie jutro!");
                }
                throw new Error(errorData);
            }

            const data = await response.json();
            ChatUI.removeTyping();
            
            if (data.response) {
                ChatUI.appendMessage(data.response, 'edward');
            } else {
                ChatUI.appendMessage("Wybacz, zgubiłem wątek. Spróbuj jeszcze raz!", 'edward');
            }

        } catch (error) {
            console.error("Chat Error:", error);
            ChatUI.removeTyping();
            ChatUI.appendMessage("Ups! Błąd połączenia z serwerem. Upewnij się, że masz poprawny URL i zaktualizowanego Workera.", 'edward');
        }
    }
};

window.ChatUI = ChatUI;
