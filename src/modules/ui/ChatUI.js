import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

export const ChatUI = {
    init: () => {
        // Inject chat HTML into body if not present
        if (!document.getElementById('edward-chat-widget')) {
            const chatHtml = `
                <!-- Chat Toggle Button -->
                <button id="edward-chat-toggle" style="
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #00BFFF, #005fcc);
                    color: white;
                    border: none;
                    box-shadow: 0 4px 15px rgba(0, 191, 255, 0.4);
                    font-size: 28px;
                    cursor: pointer;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s;
                ">🤖</button>

                <!-- Chat Window -->
                <div id="edward-chat-window" style="
                    position: fixed;
                    bottom: 90px;
                    right: 20px;
                    width: 350px;
                    max-width: calc(100vw - 40px);
                    height: 500px;
                    max-height: calc(100vh - 120px);
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid #00BFFF;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    display: none;
                    flex-direction: column;
                    z-index: 1000;
                    overflow: hidden;
                ">
                    <!-- Header -->
                    <div style="
                        background: #00BFFF;
                        padding: 15px;
                        color: white;
                        font-weight: bold;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 1.5em;">🤖</span>
                            <div>
                                <div style="font-size: 1.1em;">Trener Edward</div>
                                <div style="font-size: 0.8em; color: rgba(255,255,255,0.8);">Zawsze gotowy do pomocy</div>
                            </div>
                        </div>
                        <button id="edward-chat-close" style="background: none; border: none; color: white; font-size: 1.5em; cursor: pointer;">&times;</button>
                    </div>

                    <!-- Messages Area -->
                    <div id="edward-chat-messages" style="
                        flex: 1;
                        padding: 15px;
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    ">
                        <!-- Welcome Message -->
                        <div style="align-self: flex-start; max-width: 85%;">
                            <div style="font-size: 0.8em; color: #888; margin-bottom: 2px;">Edward</div>
                            <div style="background: #333; padding: 10px 15px; border-radius: 15px; border-bottom-left-radius: 5px; color: white; font-size: 0.95em;">
                                Cześć! Jestem Edward, Twój wirtualny trener. Masz pytania o trening, dietę czy regenerację? Wal śmiało! 💪
                            </div>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div style="
                        padding: 15px;
                        background: rgba(0,0,0,0.5);
                        border-top: 1px solid #333;
                        display: flex;
                        gap: 10px;
                    ">
                        <input type="text" id="edward-chat-input" placeholder="Napisz do Edwarda..." style="
                            flex: 1;
                            padding: 10px 15px;
                            border-radius: 20px;
                            border: 1px solid #444;
                            background: #222;
                            color: white;
                            outline: none;
                            font-size: 16px;
                        ">
                        <button id="edward-chat-send" style="
                            background: #00BFFF;
                            color: white;
                            border: none;
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">➤</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', chatHtml);
            ChatUI.bindEvents();
        }
    },

    bindEvents: () => {
        const toggleBtn = document.getElementById('edward-chat-toggle');
        const closeBtn = document.getElementById('edward-chat-close');
        const chatWindow = document.getElementById('edward-chat-window');
        const sendBtn = document.getElementById('edward-chat-send');
        const input = document.getElementById('edward-chat-input');

        toggleBtn.addEventListener('click', () => {
            const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';
            chatWindow.style.display = isHidden ? 'flex' : 'none';
            if (isHidden) input.focus();
        });

        closeBtn.addEventListener('click', () => {
            chatWindow.style.display = 'none';
        });

        sendBtn.addEventListener('click', ChatUI.sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') ChatUI.sendMessage();
        });
    },

    appendMessage: (text, sender) => {
        const messagesDiv = document.getElementById('edward-chat-messages');
        const isUser = sender === 'user';
        
        const html = `
            <div style="align-self: ${isUser ? 'flex-end' : 'flex-start'}; max-width: 85%;">
                <div style="font-size: 0.8em; color: #888; margin-bottom: 2px; text-align: ${isUser ? 'right' : 'left'};">
                    ${isUser ? (localStorage.getItem('userNick') || 'Ty') : 'Edward'}
                </div>
                <div style="
                    background: ${isUser ? '#00BFFF' : '#333'}; 
                    padding: 10px 15px; 
                    border-radius: 15px; 
                    ${isUser ? 'border-bottom-right-radius: 5px;' : 'border-bottom-left-radius: 5px;'}
                    color: white; 
                    font-size: 0.95em;
                ">
                    ${isUser ? text : marked.parse(text)}
                </div>
            </div>
        `;
        
        messagesDiv.insertAdjacentHTML('beforeend', html);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    },

    showTyping: () => {
        const messagesDiv = document.getElementById('edward-chat-messages');
        const html = `
            <div id="edward-typing" style="align-self: flex-start; max-width: 85%;">
                <div style="font-size: 0.8em; color: #888; margin-bottom: 2px;">Edward</div>
                <div style="background: #333; padding: 10px 15px; border-radius: 15px; border-bottom-left-radius: 5px; color: #aaa; font-size: 0.9em; font-style: italic;">
                    Pisze...
                </div>
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
        
        // Ensure URL is configured
        let workerUrl = localStorage.getItem('dietWorkerUrl');
        if (!workerUrl) {
            ChatUI.appendMessage("Musisz najpierw skonfigurować URL do chmury AI (Cloudflare Worker) w zakładce Profil i Ustawienia!", 'edward');
            return;
        }

        ChatUI.showTyping();

        try {
            const response = await fetch(workerUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageBase64: null,
                    contextText: text,
                    action: "chat" // Tells worker to use Chat prompt
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
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
