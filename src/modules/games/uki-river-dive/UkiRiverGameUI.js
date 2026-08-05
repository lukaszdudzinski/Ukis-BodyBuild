import { RiverGame } from './UkiRiverGame.js';

export const UkiRiverGameUI = {
    gameInstance: null,
    container: null,
    canvas: null,

    init: () => {
        // Create Game Container if checks pass (logic usually handled in index.html, but let's grab it)
        UkiRiverGameUI.container = document.getElementById('river-dive-game');
        if (!UkiRiverGameUI.container) return;

        // Setup HTML structure inside container if empty
        if (UkiRiverGameUI.container.innerHTML.trim() === '') {
            UkiRiverGameUI.renderGameStructure();
        }

        // FULLSCREEN MOBILE LOGIC
        if (window.innerWidth < 800) {
            UkiRiverGameUI.container.classList.add('game-fullscreen');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        UkiRiverGameUI.canvas = document.getElementById('river-game-canvas');

        // Resize Canvas to fit container
        UkiRiverGameUI.resizeCanvas();
        window.addEventListener('resize', UkiRiverGameUI.resizeCanvas);

        // Controls
        UkiRiverGameUI.bindControls();
    },

    renderGameStructure: () => {
        UkiRiverGameUI.container.innerHTML = `
            <div class="game-ui-overlay" id="game-start-screen" style="cursor: pointer;">
                <!-- Exit Button in Top Right -->
                <button class="btn-exit-game icon-btn" id="game-exit-btn" title="Wyjdź z gry" style="position: absolute; top: 15px; right: 15px; z-index: 100;">✕</button>
            </div>
            
            <div class="game-ui-overlay" id="game-over-screen" style="display: none; background: rgba(0,0,0,0.85);">
                <div class="game-over-content" style="text-align: center;">
                    <h2 style="color: #ff4444; font-size: 2.5em; text-shadow: 0 0 10px rgba(255,0,0,0.5);">GAME OVER</h2>
                    <p style="font-size: 1.5em; margin: 10px 0;">Wynik: <span id="final-score" style="color: #00d1b2; font-weight: bold;">0</span></p>
                    
                    <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 30px; width: 250px;">
                        <button class="action-button" id="game-restart-btn">Zagraj Ponownie</button>
                        <button class="action-button secondary-btn" id="game-over-exit-btn" style="background: transparent; border: 1px solid #777;">Wróć do Narzędzi</button>
                    </div>
                </div>
            </div>

            <div class="game-hud" style="display: none;">
                <div class="hud-score">Wynik: <span id="live-score">0</span></div>
                <div class="hud-fuel">
                    <span>AIR:</span>
                    <div class="fuel-bar-container"><div class="fuel-bar" id="fuel-bar-fill"></div></div>
                </div>
            </div>

            <canvas id="river-game-canvas"></canvas>
            
            <!-- Visible Mobile Controls Overlay -->
            <div class="touch-zones" id="touch-controls" style="display: none;">
                <div class="control-btn left-btn" id="touch-left">⬅️</div>
                <div class="control-btn shoot-btn" id="touch-center">🎯</div>
                <div class="control-btn right-btn" id="touch-right">➡️</div>
            </div>
        `;

        // Listeners for Buttons
        document.getElementById('game-start-screen').addEventListener('click', (e) => {
            // Prevent starting if clicking EXIT button
            if (e.target.id === 'game-exit-btn') return;
            UkiRiverGameUI.startGame();
        });
        document.getElementById('game-restart-btn').addEventListener('click', UkiRiverGameUI.startGame);
        document.getElementById('game-exit-btn').addEventListener('click', UkiRiverGameUI.exitGame);
        document.getElementById('game-over-exit-btn').addEventListener('click', UkiRiverGameUI.exitGame);
    },

    resizeCanvas: () => {
        if (!UkiRiverGameUI.canvas) return;
        UkiRiverGameUI.canvas.width = window.innerWidth;
        UkiRiverGameUI.canvas.height = window.innerHeight;
    },

    startGame: () => {
        document.getElementById('game-start-screen').style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'none';
        document.querySelector('.game-hud').style.display = 'flex';

        // Show touch controls on mobile (simple check)
        const isMobile = window.innerWidth < 800; // Rough check
        if (isMobile) {
            document.getElementById('touch-controls').style.display = 'flex';
            // Force Fullscreen on Mobile
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) {
                docEl.requestFullscreen().catch(err => console.log('Fullscreen blocked', err));
            }
        }

        if (!UkiRiverGameUI.gameInstance) {
            UkiRiverGameUI.gameInstance = new RiverGame(UkiRiverGameUI.canvas, {
                onGameOver: UkiRiverGameUI.handleGameOver,
                onScoreUpdate: UkiRiverGameUI.updateHUD
            });
        }

        UkiRiverGameUI.gameInstance.start();
    },

    handleGameOver: (score) => {
        document.getElementById('game-over-screen').style.display = 'flex';
        document.getElementById('final-score').textContent = score;
        document.querySelector('.game-hud').style.display = 'none';
        document.getElementById('touch-controls').style.display = 'none';
    },

    updateHUD: (score, fuel) => {
        document.getElementById('live-score').textContent = score;
        document.getElementById('fuel-bar-fill').style.width = fuel + '%';
        if (fuel < 20) document.getElementById('fuel-bar-fill').style.backgroundColor = 'red';
        else document.getElementById('fuel-bar-fill').style.backgroundColor = '#00FFFF';
    },

    stopGame: () => {
        if (UkiRiverGameUI.gameInstance) {
            UkiRiverGameUI.gameInstance.stop();
        }
        // Exit Fullscreen Mode
        UkiRiverGameUI.container.classList.remove('game-fullscreen');
        document.body.style.overflow = ''; // Restore scrolling
    },

    exitGame: () => {
        UkiRiverGameUI.stopGame();
        // Return to main screen
        window.switchTab('welcome-screen');
    },

    bindControls: () => {
        const handleInput = (keys) => {
            if (UkiRiverGameUI.gameInstance) {
                UkiRiverGameUI.gameInstance.handleInput(keys);
            }
        };

        const keys = { left: false, right: false, shoot: false };

        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (UkiRiverGameUI.container.style.display === 'none') return;
            if (e.code === 'ArrowLeft') keys.left = true;
            if (e.code === 'ArrowRight') keys.right = true;
            if (e.code === 'Space') {
                if (UkiRiverGameUI.gameInstance) UkiRiverGameUI.gameInstance.shoot();
                keys.shoot = true;
            }
            handleInput(keys);
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft') keys.left = false;
            if (e.code === 'ArrowRight') keys.right = false;
            if (e.code === 'Space') keys.shoot = false;
            handleInput(keys);
        });

        // Touch Zones
        const touchLeft = document.getElementById('touch-left');
        const touchRight = document.getElementById('touch-right');
        const touchCenter = document.getElementById('touch-center');

        // Note: These elements are created in renderGameStructure. 
        // If init() is called before they exist, we must bind later.
        // We called renderGameStructure inside init, so we should be good IF container was empty.
        // Safer to delegate or re-query.

        // Re-query to be sure
        const leftZone = document.getElementById('touch-left');
        const rightZone = document.getElementById('touch-right');
        const centerZone = document.getElementById('touch-center');

        if (leftZone) {
            leftZone.addEventListener('touchstart', (e) => { e.preventDefault(); keys.left = true; handleInput(keys); });
            leftZone.addEventListener('touchend', (e) => { e.preventDefault(); keys.left = false; handleInput(keys); });

            rightZone.addEventListener('touchstart', (e) => { e.preventDefault(); keys.right = true; handleInput(keys); });
            rightZone.addEventListener('touchend', (e) => { e.preventDefault(); keys.right = false; handleInput(keys); });

            centerZone.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (UkiRiverGameUI.gameInstance) UkiRiverGameUI.gameInstance.shoot();
            });
        }
    }
};
