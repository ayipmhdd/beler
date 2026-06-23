import { state, DIFFICULTIES } from './core/state.js';
import { renderHome } from './components/home.js';
import { renderModelSelection } from './components/modelSelection.js';
import { renderGameConfig } from './modules/matematika/mathConfig.js';
import { renderGame, createMixedQuestion, stopTimer, finishGame, answerQuestion } from './modules/matematika/mathGame.js';
import { renderResult } from './modules/matematika/mathResult.js';
import { renderEngConfig } from './modules/english/engConfig.js';
import { renderEngGame } from './modules/english/engGame.js';

// Dynamic scroll policy: locked during game, open on menu screens
function applyScrollPolicy() {
    const appRoot = document.getElementById('app-root');
    if (state.screen === 'game') {
        document.body.style.overscrollBehaviorY = 'contain';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        if (appRoot) appRoot.style.overflow = 'hidden';
    } else {
        document.body.style.overscrollBehaviorY = 'auto';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (appRoot) appRoot.style.overflow = '';
    }
}

// Central Router
export function render() {
    applyScrollPolicy();
    if (state.screen === 'home') renderHome();
    else if (state.screen === 'model_selection') renderModelSelection();
    else if (state.screen === 'game_config') renderGameConfig();
    else if (state.screen === 'game') renderGame();
    else if (state.screen === 'result') renderResult();
    else if (state.screen === 'eng_config') renderEngConfig();
}

window.appRender = render;

// Global Navigation Handlers
window.goToModelSelection = () => {
    state.screen = 'model_selection';
    render();
};

window.goToEngConfig = () => {
    state.screen = 'eng_config';
    render();
};

window.goToHome = () => {
    state.screen = 'home';
    render();
};

window.goToGameConfig = () => {
    state.screen = 'game_config';
    render();
};

window.selectDifficulty = (diffKey) => {
    state.difficulty = diffKey;
    render();
};

window.selectGameMode = (mode) => {
    state.gameMode = mode;
    render();
};

window.selectGameType = (type) => {
    state.gameType = type;
    render();
};

window.startGame = () => {
    if(!state.difficulty) return;
    
    const durationEl = document.getElementById('timerDurationSelect');
    if (durationEl) state.timerDuration = parseInt(durationEl.value);
    
    const limitEl = document.getElementById('questionLimitSelect');
    if (limitEl) state.questionLimit = parseInt(limitEl.value);
    
    state.questions = [createMixedQuestion(DIFFICULTIES[state.difficulty].range)];
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.totalAnswered = 0;
    state.answered = false;
    state.currentInputAnswer = '';
    state.screen = 'game';
    
    if (state.gameMode === 'timed') {
        state.timeLeft = state.timerDuration;
        state.timerInterval = setInterval(() => {
            state.timeLeft--;
            const timerEl = document.getElementById('timer-display');
            if (timerEl) {
                timerEl.innerText = `${state.timeLeft}s`;
                if (state.timeLeft <= 5) timerEl.classList.add('text-rose-500', 'animate-pulse');
            }
            if (state.timeLeft <= 0) {
                finishGame();
            }
        }, 1000);
    }
    
    render();
};

window.quitGame = () => {
    stopTimer();
    goToGameConfig();
};

window.answerQuestion = answerQuestion;

import { answerTrueFalse, inputKeypad, submitInput } from './modules/matematika/mathGame.js';
window.answerTrueFalse = answerTrueFalse;
window.inputKeypad = inputKeypad;
window.submitInput = submitInput;

// Boot
render();

// PWA Install Logic
window.installPWA = async () => {
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        const { outcome } = await window.deferredPrompt.userChoice;
        window.deferredPrompt = null;
        render(); // Re-render to hide the button
    }
};

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    // Re-render immediately so install button appears without race condition
    if (typeof window.appRender === 'function') window.appRender();
});
