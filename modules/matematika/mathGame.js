import { state, DIFFICULTIES, OPERATIONS } from '../../core/state.js';

// Utility for random integers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createMixedQuestion(range) {
    const operations = Object.keys(OPERATIONS);
    const opKey = operations[Math.floor(Math.random() * operations.length)];
    let a = getRandomInt(range[0], range[1]);
    let b = getRandomInt(range[0], range[1]);
    
    if (opKey === 'kurang' && a < b) {
        [a, b] = [b, a]; 
    } else if (opKey === 'bagi') {
        b = getRandomInt(1, 10);
        a = b * getRandomInt(1, 15);
    } else if (opKey === 'kali') {
        a = getRandomInt(1, 15);
        b = getRandomInt(1, 15);
    }
    
    const correctAnswer = OPERATIONS[opKey].fn(a, b);
    let options = [];
    let displayedAnswer = null;

    if (state.gameType === 'true_false') {
        const isTrue = Math.random() > 0.5;
        if (isTrue) {
            displayedAnswer = correctAnswer;
        } else {
            let offset = getRandomInt(-5, 5);
            if(offset === 0) offset = 1;
            displayedAnswer = correctAnswer + offset;
            if (displayedAnswer < 0) displayedAnswer = Math.abs(displayedAnswer) + 1;
        }
    } else if (state.gameType === 'test') {
        let optionsSet = new Set();
        optionsSet.add(correctAnswer);
        
        while(optionsSet.size < 4) {
            if (opKey === 'bagi' || opKey === 'kali') {
                 let offset = getRandomInt(-5, 5);
                 if(offset === 0) offset = 1;
                 let wrongAnswer = correctAnswer + offset;
                 if (wrongAnswer >= 0) optionsSet.add(wrongAnswer);
            } else {
                 let fbOffset = getRandomInt(1, 20);
                 optionsSet.add(correctAnswer + fbOffset);
            }
        }
        
        options = Array.from(optionsSet);
        options.sort(() => Math.random() - 0.5); 
    }

    return {
        text: `${a} ${OPERATIONS[opKey].symbol} ${b}`,
        options: options,
        correctAnswer: correctAnswer,
        displayedAnswer: displayedAnswer
    };
}

export function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

export function finishGame() {
    stopTimer();
    
    let isNewHigh = false;
    let oldHigh = state.highScores[state.difficulty] || 0;
    if (state.score > oldHigh) {
        state.highScores[state.difficulty] = state.score;
        localStorage.setItem('mathHighScores', JSON.stringify(state.highScores));
        isNewHigh = true;
    }
    state.isNewHigh = isNewHigh;
    
    state.screen = 'result';
    window.appRender();
}

export function nextQuestion() {
    state.questions.push(createMixedQuestion(DIFFICULTIES[state.difficulty].range));
    state.currentQuestionIndex++;
    state.answered = false;
    state.currentInputAnswer = '';
    window.appRender();
}

function showFeedbackToast(isCorrect) {
    const toast = document.getElementById('feedback-toast');
    const inner = document.getElementById('feedback-toast-inner');
    if (!toast || !inner) return;

    inner.style.backgroundColor = isCorrect ? '#10b981' : '#f43f5e';
    inner.innerHTML = isCorrect
        ? '<svg style="width:22px;height:22px;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>BENAR! 🚀</span>'
        : '<svg style="width:22px;height:22px;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg><span>SALAH! 💤</span>';

    // Clear any lingering timeout
    if (toast._hideTimeout) clearTimeout(toast._hideTimeout);
    toast.classList.remove('toast-visible');

    // Force reflow to restart transition cleanly
    void toast.offsetWidth;
    toast.classList.add('toast-visible');

    toast._hideTimeout = setTimeout(() => {
        toast.classList.remove('toast-visible');
    }, 600);
}

export function answerQuestion(selectedAnswer, optionIndex) {
    if(state.answered) return;
    state.answered = true;
    
    const q = state.questions[state.currentQuestionIndex];
    const isCorrect = selectedAnswer === q.correctAnswer;
    showFeedbackToast(isCorrect);
    
    if (isCorrect) {
        state.score += 10;
    }
    
    state.totalAnswered++;
    if (state.screen !== 'game') return;
    
    if (state.gameMode === 'fixed') {
        if (state.currentQuestionIndex + 1 >= state.questionLimit) {
            finishGame();
        } else {
            nextQuestion();
        }
    } else {
        nextQuestion();
    }
}

export function answerTrueFalse(selectedIsCorrect) {
    if(state.answered) return;
    state.answered = true;
    
    const q = state.questions[state.currentQuestionIndex];
    const actualIsCorrect = q.displayedAnswer === q.correctAnswer;
    const isCorrect = selectedIsCorrect === actualIsCorrect;
    showFeedbackToast(isCorrect);
    
    if (isCorrect) {
        state.score += 10;
    }
    
    state.totalAnswered++;
    if (state.screen !== 'game') return;
    
    if (state.gameMode === 'fixed') {
        if (state.currentQuestionIndex + 1 >= state.questionLimit) {
            finishGame();
        } else {
            nextQuestion();
        }
    } else {
        nextQuestion();
    }
}

export function inputKeypad(val) {
    if (val === 'clear') {
        state.currentInputAnswer = state.currentInputAnswer.slice(0, -1);
    } else {
        if (state.currentInputAnswer.length < 6) {
            state.currentInputAnswer += val;
        }
    }
    const el = document.getElementById('input-display-target');
    if (el) el.innerText = state.currentInputAnswer || '?';
}

export function submitInput() {
    if(state.answered) return;
    if(state.currentInputAnswer === '') return;
    state.answered = true;
    
    const q = state.questions[state.currentQuestionIndex];
    const isCorrect = parseInt(state.currentInputAnswer) === q.correctAnswer;
    showFeedbackToast(isCorrect);
    
    if (isCorrect) {
        state.score += 10;
    }
    
    state.totalAnswered++;
    state.currentInputAnswer = ''; // Reset for next
    
    if (state.screen !== 'game') return;
    
    if (state.gameMode === 'fixed') {
        if (state.currentQuestionIndex + 1 >= state.questionLimit) {
            finishGame();
        } else {
            nextQuestion();
        }
    } else {
        nextQuestion();
    }
}

export function renderGame() {
    const app = document.getElementById('app');
    const q = state.questions[state.currentQuestionIndex];
    
    let headerHudHtml = '';
    if (state.gameMode === 'timed') {
        headerHudHtml = `
            <div class="px-5 py-2.5 rounded-[1.2rem] bg-[#161f30] border border-slate-700/60 flex items-center shadow-sm">
                <svg class="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span id="timer-display" class="font-black text-slate-100 text-lg w-[40px] text-center">${state.timeLeft}s</span>
            </div>
        `;
    } else {
        headerHudHtml = `
            <div class="px-5 py-2.5 rounded-[1.2rem] bg-[#161f30] border border-slate-700/60 flex items-center shadow-sm">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Soal</span>
                <span class="font-black text-slate-100 text-lg">${state.currentQuestionIndex + 1}<span class="text-slate-500 text-sm">/${state.questionLimit}</span></span>
            </div>
        `;
    }
    
    let gameAreaHtml = '';
    
    if (state.gameType === 'test') {
        gameAreaHtml = `
            <div class="flex-1 flex flex-col justify-center mb-8 mt-4">
                <div class="bg-[#161f30] border border-slate-700/60 rounded-[1.8rem] p-10 flex items-center justify-center min-h-[180px] shadow-inner mb-6 relative">
                    <div class="text-5xl md:text-6xl font-black text-center text-slate-100 tracking-tight relative z-10">
                        ${q.text} = ?
                    </div>
                </div>
            </div>

            <!-- Options Grid -->
            <div class="grid grid-cols-2 gap-4 mt-auto mb-4">
                ${q.options.map((opt, i) => `
                    <button id="opt-${i}" onclick="answerQuestion(${opt}, ${i})" class="flex items-center justify-center py-6 rounded-[1.5rem] bg-[#1e293b] border border-slate-700/60 shadow-[0_6px_0_0_#0f172a] active:translate-y-[3px] active:shadow-[0_3px_0_0_#0f172a] text-3xl font-black text-slate-100 transition-all duration-100">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
    } else if (state.gameType === 'true_false') {
        gameAreaHtml = `
            <div class="flex-1 flex flex-col justify-center mb-8 mt-4">
                <div class="bg-[#161f30] border border-slate-700/60 rounded-[1.8rem] p-10 flex items-center justify-center min-h-[180px] shadow-inner mb-6 relative">
                    <div class="text-5xl md:text-6xl font-black text-center text-slate-100 tracking-tight relative z-10">
                        ${q.text} = <span class="text-blue-400">${q.displayedAnswer}</span>
                    </div>
                </div>
            </div>

            <!-- True/False Grid -->
            <div class="flex flex-col gap-4 mt-auto mb-4">
                <button onclick="answerTrueFalse(true)" class="flex items-center justify-center py-6 rounded-[1.5rem] bg-blue-600 hover:bg-blue-500 border border-blue-400/20 text-white shadow-[0_6px_0_0_#1d4ed8] active:translate-y-[3px] active:shadow-[0_3px_0_0_#1d4ed8] transition-all duration-100">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                </button>
                <button onclick="answerTrueFalse(false)" class="flex items-center justify-center py-6 rounded-[1.5rem] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 shadow-[0_6px_0_0_#0f172a] active:translate-y-[3px] active:shadow-[0_3px_0_0_#0f172a] transition-all duration-100">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        `;
    } else if (state.gameType === 'input') {
        gameAreaHtml = `
            <div class="flex-1 flex flex-col justify-center mt-2 mb-4">
                <div class="bg-[#161f30] border border-slate-700/60 rounded-[1.8rem] p-6 flex items-center justify-center min-h-[120px] mb-4 shadow-inner">
                    <div class="text-4xl md:text-5xl font-black text-center text-slate-100 tracking-tight">
                        ${q.text} = ?
                    </div>
                </div>
                
                <div class="bg-[#1e293b] border-2 border-slate-700/60 rounded-[1.5rem] p-4 flex items-center justify-center min-h-[80px] shadow-[0_4px_0_0_#0f172a]">
                    <span id="input-display-target" class="text-4xl font-black text-blue-400 tracking-widest">${state.currentInputAnswer || ''}</span>
                </div>
            </div>

            <!-- Input Keypad -->
            <div class="mt-auto mb-2">
                <div class="grid grid-cols-3 gap-3 mb-4">
                    ${[1,2,3,4,5,6,7,8,9].map(num => `
                        <button onclick="inputKeypad('${num}')" class="flex items-center justify-center py-5 rounded-[1.2rem] bg-[#161f30] border border-slate-700/60 shadow-[0_4px_0_0_#0f172a] active:translate-y-[3px] active:shadow-[0_1px_0_0_#0f172a] text-slate-200 text-2xl font-bold transition-all duration-100">
                            ${num}
                        </button>
                    `).join('')}
                    <button onclick="inputKeypad('0')" class="col-start-2 flex items-center justify-center py-5 rounded-[1.2rem] bg-[#161f30] border border-slate-700/60 shadow-[0_4px_0_0_#0f172a] active:translate-y-[3px] active:shadow-[0_1px_0_0_#0f172a] text-slate-200 text-2xl font-bold transition-all duration-100">
                        0
                    </button>
                    <button onclick="inputKeypad('clear')" class="flex items-center justify-center py-5 rounded-[1.2rem] bg-rose-500/20 border border-rose-500/30 shadow-[0_4px_0_0_#0f172a] active:translate-y-[3px] active:shadow-[0_1px_0_0_#0f172a] text-rose-400 transition-all duration-100">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"></path></svg>
                    </button>
                </div>
                <button onclick="submitInput()" class="w-full bg-blue-600 hover:bg-blue-500 border border-blue-400/20 text-white font-bold rounded-2xl py-4 shadow-[0_6px_0_0_#1d4ed8] active:translate-y-[3px] active:shadow-[0_3px_0_0_#1d4ed8] transition-all text-xl tracking-widest uppercase">
                    Submit
                </button>
            </div>
        `;
    }

    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 relative">
            
            <!-- Header HUD -->
            <div class="flex justify-between items-center mb-2 mt-2">
                <button onclick="quitGame()" class="p-3 rounded-2xl bg-[#161f30] border border-slate-700/60 text-slate-400 hover:text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_0_#0f172a] active:shadow-[0_2px_0_0_#0f172a] z-20" aria-label="Keluar Permainan">
                    <svg class="w-6 h-6 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                
                <div class="flex space-x-3">
                    ${headerHudHtml}
                    <div class="px-5 py-2.5 rounded-[1.2rem] bg-[#161f30] border border-slate-700/60 flex items-center shadow-sm">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Skor</span>
                        <span id="score-display" class="font-black text-blue-400 text-lg">${state.score}</span>
                    </div>
                </div>
            </div>
            
            ${gameAreaHtml}
        </div>
    `;
}
