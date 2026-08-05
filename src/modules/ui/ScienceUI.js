
import { scienceContent } from '../data/ScienceData.js';
import { QuizUI } from './QuizUI.js';
import { nitroxQuiz } from '../data/lectures/nitrox-quiz.js';
import { getTankVolume } from '../data/TankData.js';

export const ScienceUI = {
    init: () => {
        ScienceUI.renderContent('sac');
        ScienceUI.renderContent('nitrox');
        ScienceUI.renderContent('gas');
        ScienceUI.renderContent('ballast');

        // Re-attach listeners after rendering
        ScienceUI.attachListeners();
    },

    renderContent: (key) => {
        const data = scienceContent[key];
        if (!data) return;

        const container = document.getElementById(data.id);
        if (container) {
            container.innerHTML = data.content;
        }

        // Specific logic for 'gas' content, if needed, or other calculations
        // This block is added based on the user's provided snippet,
        // assuming it's intended for a specific part of the UI that gets rendered.
        if (key === 'gas') { // Assuming these calculations are relevant to the 'gas' section
            try {
                const p1Input = document.getElementById('p1');
                const p2Input = document.getElementById('p2');
                const vbInput = document.getElementById('vb');
                const timeInput = document.getElementById('time');

                if (p1Input && p2Input && vbInput && timeInput) {
                    const p1 = parseFloat(p1Input.value);
                    const p2 = parseFloat(p2Input.value);

                    const vbId = vbInput.value;
                    const vb = getTankVolume(vbId); // Using the imported getTankVolume

                    const time = parseFloat(timeInput.value);
                    // Further calculations or display logic would go here
                    // For example, if there's an output element:
                    // const resultElement = document.getElementById('gas-calculation-result');
                    // if (resultElement) {
                    //     resultElement.textContent = `Calculated: P1=${p1}, P2=${p2}, VB=${vb}, Time=${time}`;
                    // }
                }
            } catch (error) {
                console.error("Error in gas calculations:", error);
            }
        }
    },

    attachListeners: () => {
        // Nitrox Quiz Button
        const nitroxQuizBtn = document.getElementById('start-nitrox-quiz-btn');
        if (nitroxQuizBtn) {
            nitroxQuizBtn.addEventListener('click', () => {
                QuizUI.startQuiz(nitroxQuiz, 'nitrox-science-quiz');
            });
        }
    }
};
