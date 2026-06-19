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
    
    // Logic specific to operation to ensure nice whole numbers
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
    
    let options = Array.from(optionsSet);
    options.sort(() => Math.random() - 0.5); 
    
    return {
        text: `${a} ${OPERATIONS[opKey].symbol} ${b}`,
        options: options,
        correctAnswer: correctAnswer
    };
}

export function renderGame() {
    const app = document.getElementById('app');
    const q = state.questions[state.currentQuestionIndex];
    
    let headerHudHtml = '';
    if (state.gameMode === 'timed') {
        headerHudHtml = `
            <div class="px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center shadow-sm">
                <svg class="w-4 h-4 text-amber-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span id="timer-display" class="font-black text-amber-400 text-lg ${state.timeLeft <= 5 ? 'text-rose-500 animate-pulse' : ''}">${state.timeLeft}s</span>
            </div>
        `;
    } else {
        headerHudHtml = `
            <div class="px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center shadow-sm">
                <span class="text-sm font-semibold text-slate-400">Soal</span>
                <span class="ml-2 font-black text-indigo-400 text-lg">${state.currentQuestionIndex + 1}<span class="text-slate-500 text-sm font-semibold">/${state.questionLimit}</span></span>
            </div>
        `;
    }

    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 animate-pop relative">
            <button onclick="quitGame()" class="absolute top-6 left-6 p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95 z-20 shadow-sm" aria-label="Keluar Permainan">
                <svg class="w-6 h-6 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            <!-- Header HUD -->
            <div class="flex justify-end items-center mb-8 mt-2 space-x-2">
                ${headerHudHtml}
                <div class="px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center shadow-sm">
                    <span class="text-sm font-semibold text-slate-400">Skor</span>
                    <span id="score-display" class="ml-2 font-black text-emerald-400 text-lg">${state.score}</span>
                </div>
            </div>
            
            <!-- Question Area -->
            <div class="flex-1 flex flex-col justify-center mb-10 mt-2">
                <div class="bg-slate-850 border border-slate-700/50 rounded-[2rem] p-8 shadow-inner relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4 opacity-5">
                        <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V9H8v2H6v2h2v2h2v-2h2v-2zm-3.5 5h5v-2h-5v2zm7.5-3h-2v2h2v-2zm0-4h-2v2h2V9zM19 19H5V5h14v14z"/></svg>
                    </div>
                    <div class="text-6xl md:text-7xl font-black text-center text-white tracking-tight drop-shadow-md relative z-10">
                        ${q.text}
                    </div>
                    <div class="text-3xl text-center text-slate-500 font-bold mt-4 relative z-10">
                        = ?
                    </div>
                </div>
            </div>

            <!-- Options Grid -->
            <div class="grid grid-cols-2 gap-4 mt-auto mb-2">
                ${q.options.map((opt, i) => `
                    <button id="opt-${i}" onclick="answerQuestion(${opt}, ${i})" class="option-btn flex items-center justify-center py-8 rounded-[1.5rem] bg-slate-800 border-b-4 border-slate-900 text-3xl font-black text-slate-200 active:translate-y-1 active:border-b-0 transition-all duration-150 shadow-md">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

export function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

export function nextQuestion() {
    state.questions.push(createMixedQuestion(DIFFICULTIES[state.difficulty].range));
    state.currentQuestionIndex++;
    state.answered = false;
    window.appRender();
}

export function finishGame() {
    stopTimer();
    
    const modeVal = state.gameMode === 'timed' ? state.timerDuration : state.questionLimit;
    const key = `mixed_${state.difficulty}_${state.gameMode}_${modeVal}`;
    const highScore = state.highScores[key] || 0;
    
    if (state.score > highScore) {
        state.highScores[key] = state.score;
        localStorage.setItem('mathHighScores', JSON.stringify(state.highScores));
        state.isNewHigh = true;
    } else {
        state.isNewHigh = false;
    }
    
    state.screen = 'result';
    window.appRender();
}

export function answerQuestion(selected, index) {
    if(state.answered) return;
    state.answered = true;
    
    const q = state.questions[state.currentQuestionIndex];
    const isCorrect = selected === q.correctAnswer;
    
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
