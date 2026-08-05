export const QuizUI = {
    state: {
        currentQuizData: [],
        currentQuestionIndex: 0,
        currentScore: 0,
        wrongAnswers: 0,
        isAnswered: false,
        currentLectureId: null,
        elementCACHE: {}
    },

    init: () => {
        // Cache elements
        QuizUI.state.elementCACHE = {
            quizModal: document.getElementById('quiz-modal'),
            quizBody: document.getElementById('quiz-body'),
            quizResultScreen: document.getElementById('quiz-result-screen'),
            quizScoreCircle: document.getElementById('quiz-score-circle'),
            quizResultMessage: document.getElementById('quiz-result-message'),
            closeBtn: document.querySelector('.close-quiz'),
            retryBtn: document.getElementById('restart-quiz-btn') || document.querySelector('.retry-button'),
            closeResultBtn: document.getElementById('close-quiz-result-btn') || document.querySelector('.pulse-button')
        };

        const els = QuizUI.state.elementCACHE;

        // Event Listeners
        // Note: Generic close button class found in init, might need specific ID if multiple
        const closeBtns = document.querySelectorAll('.quiz-close-btn, .close-quiz');
        closeBtns.forEach(btn => btn.addEventListener('click', QuizUI.closeQuiz));

        if (els.retryBtn) {
            // Avoid duplicate listeners if possible, but safe here strictly
            els.retryBtn.onclick = QuizUI.restartQuiz;
        }
        if (els.closeResultBtn) {
            els.closeResultBtn.onclick = QuizUI.closeQuiz;
        }

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === els.quizModal) {
                QuizUI.closeQuiz();
            }
        });

        window.handleQuizAnswer = QuizUI.handleAnswer;
        window.restartQuiz = QuizUI.restartQuiz; // Ensure global access for inline onclicks
        window.closeQuiz = QuizUI.closeQuiz;
    },

    startQuiz: (quizData, lectureId) => {
        if (!quizData || quizData.length === 0) {
            console.error("No quiz data provided");
            return;
        }

        // Determine First Run vs Random
        // Default to random if no ID provided (safety)
        let selectedQuestions;
        if (lectureId) {
            const isCompleted = localStorage.getItem('quiz_completed_' + lectureId);
            if (!isCompleted) {
                // First time: Standard 10 questions (first 10)
                selectedQuestions = quizData.slice(0, 10);
            } else {
                // Subsequent times: Random 10
                const shuffled = [...quizData].sort(() => 0.5 - Math.random());
                selectedQuestions = shuffled.slice(0, 10);
            }
        } else {
            // Fallback for logic without IDs
            const shuffled = [...quizData].sort(() => 0.5 - Math.random());
            selectedQuestions = shuffled.slice(0, 10);
        }

        QuizUI.state.currentLectureId = lectureId;
        QuizUI.state.currentQuizData = selectedQuestions;
        QuizUI.state.currentQuestionIndex = 0;
        QuizUI.state.currentScore = 0;
        QuizUI.state.wrongAnswers = 0;
        QuizUI.state.isAnswered = false;

        const els = QuizUI.state.elementCACHE;
        if (els.quizModal) els.quizModal.style.display = 'flex';
        if (els.quizBody) els.quizBody.style.display = 'block';
        if (els.quizResultScreen) els.quizResultScreen.style.display = 'none';

        // Reset UI specific to results
        if (els.quizScoreCircle) {
            els.quizScoreCircle.style.borderColor = "";
            els.quizScoreCircle.style.color = "";
        }
        if (els.quizResultMessage) els.quizResultMessage.style.color = "";

        // Hide any existing result image
        const existingImg = els.quizResultScreen.querySelector('.result-img');
        if (existingImg) existingImg.style.display = 'none';

        QuizUI.renderQuestion();
    },

    renderQuestion: () => {
        const { currentQuestionIndex, currentQuizData } = QuizUI.state;
        const els = QuizUI.state.elementCACHE;

        // FIX: Remove focus from previous element to prevent "sticky" hover/focus states on mobile
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        if (currentQuestionIndex < currentQuizData.length) {
            const questionData = currentQuizData[currentQuestionIndex];

            let html = `
                <div class="quiz-progress">Pytanie ${currentQuestionIndex + 1}/${currentQuizData.length}</div>
                <h3 class="quiz-question-text">${questionData.question}</h3>
                <div class="quiz-options-container">
            `;
            questionData.options.forEach((option, index) => {
                html += `<button class="quiz-option-btn" onclick="handleQuizAnswer(${index})">${option}</button>`;
            });
            html += `</div>
            <div class="quiz-feedback" id="quiz-feedback"></div>`;

            if (els.quizBody) els.quizBody.innerHTML = html;
            QuizUI.state.isAnswered = false;
        } else {
            QuizUI.showResult();
        }
    },

    handleAnswer: (selectedIndex) => {
        if (QuizUI.state.isAnswered) return;

        // Remove focus to prevent sticky styles on mobile
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        QuizUI.state.isAnswered = true;

        const { currentQuestionIndex, currentQuizData } = QuizUI.state;
        const correctAnswerIndex = currentQuizData[currentQuestionIndex].correctAnswer;

        const options = document.querySelectorAll('.quiz-option-btn');
        if (options[selectedIndex]) {
            if (selectedIndex === correctAnswerIndex) {
                QuizUI.state.currentScore++;
                options[selectedIndex].classList.add('correct');
            } else {
                options[selectedIndex].classList.add('wrong');
                if (options[correctAnswerIndex]) options[correctAnswerIndex].classList.add('correct');
                QuizUI.state.wrongAnswers++;
            }
        }

        // Delay to next question or Game Over
        setTimeout(() => {
            if (QuizUI.state.wrongAnswers >= 3) {
                QuizUI.showGameOver();
            } else {
                QuizUI.state.currentQuestionIndex++;
                QuizUI.renderQuestion();
            }
        }, 1500);
    },

    showGameOver: () => {
        const els = QuizUI.state.elementCACHE;
        if (els.quizBody) els.quizBody.style.display = 'none';

        const gameOverHtml = `
            <div class="game-over-container" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                padding: 0;
                box-sizing: border-box;
            ">
                <img src="img/logo.jpg" class="game-over-logo" alt="Game Over Logo" style="
                    width: 100px; 
                    height: 100px; 
                    border-radius: 50%; 
                    border: 3px solid #ff3860;
                    margin-bottom: 10px;
                    box-shadow: 0 0 15px rgba(255, 56, 96, 0.4);
                ">
                
                <h2 class="game-over-title" style="
                    color: #ff3860; 
                    font-size: 1.8em; 
                    margin: 5px 0 10px 0; 
                    text-transform: uppercase; 
                    text-shadow: 0 0 10px rgba(255, 56, 96, 0.5);
                ">GAME OVER !!!</h2>
                
                <p class="game-over-subtitle" style="
                    font-size: 1.1em; 
                    margin: 0 0 5px 0; 
                    color: #ccc;
                ">Trzy błędne odpowiedzi!</p>
                
                <p class="game-over-warning" style="
                    color: #ff3860; 
                    font-weight: bold; 
                    font-size: 1.2em; 
                    margin: 5px 0 15px 0;
                ">Nie wchodź do wody!!!</p>
                
                <div style="
                    display: flex; 
                    flex-direction: column; 
                    gap: 10px; 
                    width: 100%; 
                    max-width: 260px;
                ">
                    <button class="retry-button-gameover" onclick="restartQuiz()" style="
                        padding: 10px 20px; 
                        width: 100%; 
                        border-radius: 6px; 
                        cursor: pointer; 
                        background: rgba(0, 209, 178, 0.1); 
                        border: 1px solid #00d1b2; 
                        color: #00d1b2; 
                        font-size: 0.95em;
                        transition: all 0.3s ease;
                        box-shadow: 0 0 10px rgba(0, 209, 178, 0.2);
                    "
                    onmouseover="this.style.background='rgba(0, 209, 178, 0.3)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 20px rgba(0, 209, 178, 0.6)'"
                    onmouseout="this.style.background='rgba(0, 209, 178, 0.1)'; this.style.transform='translateY(0)'; this.style.boxShadow='0 0 10px rgba(0, 209, 178, 0.2)'"
                    >Spróbuj Ponownie</button>
                    
                    <button class="back-button-gameover" onclick="closeQuiz()" style="
                        padding: 10px 20px; 
                        width: 100%; 
                        border-radius: 6px; 
                        cursor: pointer; 
                        background: transparent; 
                        border: 1px solid #666; 
                        color: #ccc; 
                        font-size: 0.95em;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.borderColor='#fff'; this.style.color='#fff'; this.style.transform='translateY(-2px)'"
                    onmouseout="this.style.borderColor='#666'; this.style.color='#ccc'; this.style.transform='translateY(0)'"
                    >Zamknij</button>
                </div>
            </div>
        `;

        if (els.quizResultScreen) {
            els.quizResultScreen.innerHTML = gameOverHtml;
            els.quizResultScreen.style.display = 'block';
        }
    },

    showResult: () => {
        const { currentScore, currentQuizData } = QuizUI.state;
        const els = QuizUI.state.elementCACHE;
        const percentage = (currentScore / currentQuizData.length) * 100;

        let message = '';
        let showReward = false;

        // Mark this quiz ID as completed (attempted) so next time it randomizes
        if (QuizUI.state.currentLectureId) {
            localStorage.setItem('quiz_completed_' + QuizUI.state.currentLectureId, 'true');
        }

        if (percentage === 100) {
            message = 'Gratulacje! Perfekcyjny wynik!';
            showReward = true;
        } else if (percentage >= 70) {
            message = 'Świetna robota!';
        } else {
            message = 'Możesz poprawić wynik!';
        }

        let rewardHtml = '';
        if (showReward) {
            const rand = Math.floor(Math.random() * 5) + 1;
            rewardHtml = `
                <div class="reward-container" style="
                    margin: 10px 0; 
                    animation: fadeIn 1s ease-in-out; 
                    display: flex; 
                    justify-content: center;
                    width: 100%;
                ">
                    <img src="img/rewards/reward${rand}.jpg" 
                         class="result-img" 
                         alt="Nagroda"
                         style="
                            max-width: 90%; 
                            max-height: 25vh; 
                            border-radius: 12px; 
                            border: 2px solid #00d1b2; 
                            box-shadow: 0 0 20px rgba(0, 209, 178, 0.4); 
                            object-fit: contain;
                            transition: transform 0.3s ease;
                         "
                         onmouseover="this.style.transform='scale(1.02)'"
                         onmouseout="this.style.transform='scale(1.00)'"
                    >
                </div>
            `;
        }

        // ALWAYS Reset innerHTML to ensure no "ghost" text or old elements remain
        els.quizResultScreen.innerHTML = `
            <div class="result-content-wrapper">
                <div class="quiz-status-header" style="margin-bottom: 15px;">
                    <div class="quiz-score-circle" style="
                        width: 70px; 
                        height: 70px; 
                        line-height: 64px;
                        border-radius: 50%; 
                        border: 3px solid #00d1b2; 
                        font-size: 1.4em; 
                        font-weight: bold; 
                        color: #00d1b2;
                        margin: 0 auto 8px auto;
                        box-shadow: 0 0 10px rgba(0, 209, 178, 0.2);
                        background: rgba(0,0,0,0.3);
                    ">${currentScore}/${currentQuizData.length}</div>
                    
                    <h3 style="margin: 0; font-size: 1.2em; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${message}</h3>
                </div>
                
                ${rewardHtml}
                
                <div class="result-buttons">
                    <button class="retry-button" onclick="restartQuiz()" style="
                        padding: 10px 20px; 
                        font-size: 0.95em; 
                        width: 100%; 
                        border-radius: 6px; 
                        cursor: pointer;
                        background: rgba(0, 209, 178, 0.1);
                        border: 1px solid #00d1b2;
                        color: #00d1b2;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.background='rgba(0, 209, 178, 0.3)'; this.style.transform='translateY(-2px)'"
                    onmouseout="this.style.background='rgba(0, 209, 178, 0.1)'; this.style.transform='translateY(0)'"
                    >Spróbuj Ponownie</button>
                    
                    <button class="pulse-button" onclick="closeQuiz()" style="
                        padding: 10px 20px; 
                        font-size: 0.95em; 
                        width: 100%; 
                        border-radius: 6px;
                        cursor: pointer;
                        background: transparent;
                        border: 1px solid #666;
                        color: #ccc;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.borderColor='#fff'; this.style.color='#fff'; this.style.transform='translateY(-2px)'"
                    onmouseout="this.style.borderColor='#666'; this.style.color='#ccc'; this.style.transform='translateY(0)'"
                    >Zamknij</button>
                </div>
            </div>
        `;

        // Update cache references just in case
        els.quizScoreCircle = els.quizResultScreen.querySelector('.quiz-score-circle');
        els.quizResultMessage = els.quizResultScreen.querySelector('h3');

        if (els.quizBody) els.quizBody.style.display = 'none';
        if (els.quizResultScreen) els.quizResultScreen.style.display = 'block';
    },

    updateResultImage: (src, glowColor) => {
        // Deprecated helper, integrated into showResult/showGameOver
    },

    restartQuiz: () => {
        // Restart with the same full data set, but reshuffled logic in startQuiz matches this?
        // Actually startQuiz expects data. We need to store original source data if we want to re-shuffle from full pool.
        // For now, let's just re-use the current subset or re-call start if we had access to full set.
        // Since we don't have easy access to the full lecture object here, we'll just restart the *current* quiz subset 
        // OR better, we should probably keep a reference to the full set? 
        // Simpler: Just reset state and re-render. If we want new questions we'd need to pass full data set to state.

        QuizUI.state.currentQuestionIndex = 0;
        QuizUI.state.currentScore = 0;
        QuizUI.state.wrongAnswers = 0;
        QuizUI.state.isAnswered = false;

        // UI Reset
        const els = QuizUI.state.elementCACHE;
        if (els.quizBody) els.quizBody.style.display = 'block';
        if (els.quizResultScreen) els.quizResultScreen.style.display = 'none';
        if (els.quizScoreCircle) {
            els.quizScoreCircle.style.borderColor = "";
            els.quizScoreCircle.style.color = "";
        }

        QuizUI.renderQuestion();
    },

    closeQuiz: () => {
        const els = QuizUI.state.elementCACHE;
        if (els.quizModal) els.quizModal.style.display = 'none';
    }
};
