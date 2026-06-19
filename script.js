const app = document.getElementById('app');

const OPERATIONS = {
    add: { symbol: '+', name: 'Penjumlahan' },
    sub: { symbol: '-', name: 'Pengurangan' },
    mul: { symbol: '×', name: 'Perkalian' },
    div: { symbol: '÷', name: 'Pembagian' }
};

const DIFFICULTIES = {
    easy: { name: 'Mudah', range: [1, 10] },
    medium: { name: 'Sedang', range: [10, 50] },
    hard: { name: 'Sulit', range: [50, 100] }
};

// PWA Install Prompt State
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (typeof state !== 'undefined' && state.screen === 'home') {
        render(); 
    }
});

// Application State Management
let state = {
    screen: 'home',
    difficulty: null,
    gameMode: 'timed', // 'timed' or 'fixed'
    timerDuration: 30, // seconds
    questionLimit: 10, // count
    timerInterval: null,
    timeLeft: 0,
    totalAnswered: 0,
    questions: [], // used as history or just storing current
    currentQuestionIndex: 0, // 0-indexed count of answered
    score: 0,
    answered: false,
    highScores: JSON.parse(localStorage.getItem('math_highscores')) || {}
};

// Utilities
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

// Logic: Generate Question
function createMixedQuestion(range) {
    const ops = ['add', 'sub', 'mul', 'div'];
    const opKey = ops[Math.floor(Math.random() * ops.length)];
    
    let a, b, correctAnswer;
    let [min, max] = range;
    
    if (opKey === 'add') {
        a = getRandomInt(min, max);
        b = getRandomInt(min, max);
        correctAnswer = a + b;
    } else if (opKey === 'sub') {
        a = getRandomInt(min, max);
        b = getRandomInt(min, max);
        if (a < b) [a, b] = [b, a]; 
        correctAnswer = a - b;
    } else if (opKey === 'mul') {
        let actualMax = max > 50 ? 50 : max;
        a = getRandomInt(min, actualMax);
        b = getRandomInt(min, actualMax);
        correctAnswer = a * b;
    } else if (opKey === 'div') {
        b = getRandomInt(min, max);
        if (b === 0) b = 1; 
        correctAnswer = getRandomInt(min, max);
        a = b * correctAnswer;
    }
    
    let optionsSet = new Set();
    optionsSet.add(correctAnswer);
    
    while (optionsSet.size < 4) {
        let offset = getRandomInt(-5, 5);
        if (offset === 0) continue;
        
        let distractor = correctAnswer + offset;
        
        if (optionsSet.size === 1) {
             if (opKey === 'mul') distractor = correctAnswer + a; 
             else if (opKey === 'add') distractor = correctAnswer + 10;
        }
        
        if (distractor >= 0 && !optionsSet.has(distractor)) {
             optionsSet.add(distractor);
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

// Global UI Renderer
function render() {
    if (state.screen === 'home') renderHome();
    else if (state.screen === 'model_selection') renderModelSelection();
    else if (state.screen === 'game_config') renderGameConfig();
    else if (state.screen === 'game') renderGame();
    else if (state.screen === 'result') renderResult();
}

// ---------------------- SCREEN RENDERING ---------------------- //

function renderHome() {
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 items-center justify-center animate-pop">
            <button onclick="goToModelSelection()" class="w-full relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_15px_50px_rgba(59,130,246,0.5)] active:scale-[0.97] text-left min-h-[180px] flex items-center justify-between border border-blue-400/30 group">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div class="text-3xl font-extrabold text-white z-10 drop-shadow-md pr-4 leading-tight">Latihan<br/>Matematika</div>
                <div class="z-10 bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-inner group-hover:bg-white/30 transition-colors duration-300">
                    <svg class="w-12 h-12 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                </div>
                <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div class="absolute -left-8 -top-8 w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-xl"></div>
            </button>
            
            ${deferredPrompt ? `
                <button onclick="installPWA()" class="mt-8 w-full py-3 rounded-2xl font-bold text-md text-emerald-100 bg-emerald-600/30 border border-emerald-500/50 hover:bg-emerald-600/50 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-emerald-900/30">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Install App (Bermain Offline)
                </button>
            ` : ''}
        </div>
    `;
}

function renderModelSelection() {
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 overflow-y-auto animate-pop relative">
            <button onclick="goToHome()" class="absolute top-6 left-6 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95 z-10 backdrop-blur-sm shadow-sm" aria-label="Kembali ke Beranda">
                <svg class="w-6 h-6 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            <div class="mb-10 mt-6 text-center">
                <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight mt-12">Pilih Model<br/>Latihan</h1>
            </div>
            
            <button onclick="goToGameConfig()" class="w-full relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-left flex items-center justify-between border border-indigo-400/30 group mb-4">
                <div class="text-2xl font-extrabold text-white z-10 drop-shadow-md leading-tight">Operasi Dasar<br/>Matematika</div>
                <div class="z-10 bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-inner group-hover:bg-white/30 transition-colors duration-300">
                    <svg class="w-10 h-10 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
                </div>
                <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            </button>
        </div>
    `;
}

function renderGameConfig() {
    let modeConfigHtml = '';
    if (state.gameMode === 'timed') {
        modeConfigHtml = `
            <div class="mb-auto animate-pop">
                <label class="block text-sm font-medium text-slate-400 mb-2">Pilih Durasi Waktu</label>
                <div class="relative">
                    <select id="timerDurationSelect" onchange="state.timerDuration = parseInt(this.value)" class="block appearance-none w-full bg-slate-800 border border-slate-700 text-white font-semibold py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-slate-700 focus:border-indigo-500 transition-colors shadow-inner">
                        <option value="30" ${state.timerDuration === 30 ? 'selected' : ''}>30 Detik (Default)</option>
                        <option value="40" ${state.timerDuration === 40 ? 'selected' : ''}>40 Detik</option>
                        <option value="50" ${state.timerDuration === 50 ? 'selected' : ''}>50 Detik</option>
                        <option value="60" ${state.timerDuration === 60 ? 'selected' : ''}>1 Menit</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        `;
    } else {
        modeConfigHtml = `
            <div class="mb-auto animate-pop">
                <label class="block text-sm font-medium text-slate-400 mb-2">Pilih Jumlah Soal</label>
                <div class="relative">
                    <select id="questionLimitSelect" onchange="state.questionLimit = parseInt(this.value)" class="block appearance-none w-full bg-slate-800 border border-slate-700 text-white font-semibold py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-slate-700 focus:border-indigo-500 transition-colors shadow-inner">
                        <option value="10" ${state.questionLimit === 10 ? 'selected' : ''}>10 Soal (Default)</option>
                        <option value="20" ${state.questionLimit === 20 ? 'selected' : ''}>20 Soal</option>
                        <option value="30" ${state.questionLimit === 30 ? 'selected' : ''}>30 Soal</option>
                        <option value="40" ${state.questionLimit === 40 ? 'selected' : ''}>40 Soal</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        `;
    }

    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 overflow-y-auto animate-pop relative">
            <button onclick="goToModelSelection()" class="absolute top-6 left-6 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95 z-10 backdrop-blur-sm shadow-sm" aria-label="Kembali ke Pilihan Model">
                <svg class="w-6 h-6 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            <div class="mb-8 mt-6 text-center">
                <div class="inline-flex justify-center items-center w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-3xl mb-3 text-3xl shadow-inner mt-4">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V9H8v2H6v2h2v2h2v-2h2v-2zm-3.5 5h5v-2h-5v2zm7.5-3h-2v2h2v-2zm0-4h-2v2h2V9zM19 19H5V5h14v14z"/></svg>
                </div>
                <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">Konfigurasi Game</h1>
            </div>
            
            <h2 class="text-md font-semibold mb-3 text-slate-300">Tingkat Kesulitan</h2>
            <div class="grid grid-cols-3 gap-2 mb-6">
                ${Object.entries(DIFFICULTIES).map(([key, diff]) => `
                    <button onclick="selectDifficulty('${key}')" class="py-3 rounded-xl border-2 transition-all duration-200 ${state.difficulty === key ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:bg-slate-800'}">
                        <div class="font-bold text-sm tracking-wide">${diff.name}</div>
                    </button>
                `).join('')}
            </div>

            <h2 class="text-md font-semibold mb-3 text-slate-300">Mode Permainan</h2>
            <div class="grid grid-cols-2 gap-2 mb-4">
                <button onclick="selectGameMode('timed')" class="py-3 px-2 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 ${state.gameMode === 'timed' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:bg-slate-800'}">
                    <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span class="font-bold text-sm">Pakai Timer</span>
                </button>
                <button onclick="selectGameMode('fixed')" class="py-3 px-2 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 ${state.gameMode === 'fixed' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:bg-slate-800'}">
                    <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    <span class="font-bold text-sm">Tanpa Timer</span>
                </button>
            </div>
            
            ${modeConfigHtml}

            <button onclick="startGame()" ${!state.difficulty ? 'disabled' : ''} class="mt-8 w-full py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${state.difficulty ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_4px_20px_rgba(16,185,129,0.4)] transform hover:scale-[1.02] active:scale-[0.98]' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-70'}">
                Mulai Bermain
            </button>
        </div>
    `;
}

window.installPWA = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        render();
    }
};

window.goToHome = () => { state.screen = 'home'; render(); };
window.goToModelSelection = () => { state.screen = 'model_selection'; render(); };
window.goToGameConfig = () => { state.screen = 'game_config'; render(); };
window.selectDifficulty = (diff) => { state.difficulty = diff; render(); };
window.selectGameMode = (mode) => { state.gameMode = mode; render(); };

// --- GAME LOGIC ---

window.startGame = () => {
    if(!state.difficulty) return;
    
    stopTimer(); // Ensure any existing timer is stopped
    
    state.questions = [createMixedQuestion(DIFFICULTIES[state.difficulty].range)];
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.totalAnswered = 0;
    state.answered = false;
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

function renderGame() {
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

window.answerQuestion = (selected, index) => {
    if(state.answered) return;
    state.answered = true;
    
    const q = state.questions[state.currentQuestionIndex];
    const isCorrect = selected === q.correctAnswer;
    
    if (isCorrect) {
        state.score += 10;
    }
    
    state.totalAnswered++;
    
    // Double check in case game ended while waiting (e.g. timer hit 0 at exact same moment)
    if (state.screen !== 'game') return;
    
    if (state.gameMode === 'fixed') {
        if (state.currentQuestionIndex + 1 >= state.questionLimit) {
            finishGame();
        } else {
            nextQuestion();
        }
    } else {
        // Timed mode: Infinite questions
        nextQuestion();
    }
};

function nextQuestion() {
    state.questions.push(createMixedQuestion(DIFFICULTIES[state.difficulty].range));
    state.currentQuestionIndex++;
    state.answered = false;
    render();
}

function finishGame() {
    stopTimer();
    
    const modeVal = state.gameMode === 'timed' ? state.timerDuration : state.questionLimit;
    const key = `mixed_${state.difficulty}_${state.gameMode}_${modeVal}`;
    const currentHigh = state.highScores[key] || 0;
    let isNewHigh = false;
    
    if (state.score > currentHigh) {
        state.highScores[key] = state.score;
        localStorage.setItem('math_highscores', JSON.stringify(state.highScores));
        isNewHigh = true;
    }
    
    state.isNewHigh = isNewHigh;
    state.screen = 'result';
    render();
}

function renderResult() {
    const modeVal = state.gameMode === 'timed' ? state.timerDuration : state.questionLimit;
    const key = `mixed_${state.difficulty}_${state.gameMode}_${modeVal}`;
    const highScore = state.highScores[key] || 0;
    
    const modeLabel = state.gameMode === 'timed' ? `Waktu ${modeVal} Detik` : `Target ${modeVal} Soal`;
    const newHighHtml = (state.isNewHigh && state.score > 0) ? '<div class="absolute top-0 inset-x-0 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[10px] font-black text-center py-1.5 uppercase tracking-[0.2em] shadow-md">Skor Tertinggi Baru!</div>' : '';
    
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 items-center justify-center animate-pop">
            <div class="mb-6 text-center mt-6">
                <div class="text-7xl mb-4 transform hover:scale-110 transition-transform duration-300 drop-shadow-xl">
                    ${state.score > 0 ? '🎉' : '👍'}
                </div>
                <h1 class="text-3xl font-extrabold text-white mb-2 tracking-tight">Permainan Selesai!</h1>
                <p class="text-slate-400 font-medium text-sm">Campuran &bull; ${DIFFICULTIES[state.difficulty].name} &bull; ${modeLabel}</p>
            </div>
            
            <div class="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-8 w-full shadow-2xl mb-8 relative overflow-hidden backdrop-blur-sm">
                ${newHighHtml}
                
                <div class="text-center mt-2">
                    <div class="text-slate-400 text-xs font-bold mb-1 uppercase tracking-[0.1em]">Skor Anda</div>
                    <div class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-sm">
                        ${state.score}
                    </div>
                    <div class="text-slate-500 mt-3 font-medium text-sm">
                        Benar <span class="text-slate-200 font-bold">${state.score/10}</span> dari <span class="text-slate-200">${state.totalAnswered}</span> terjawab
                    </div>
                </div>
                
                <div class="mt-8 pt-6 border-t border-slate-700/50 text-center">
                    <div class="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Skor Tertinggi Mode Ini</div>
                    <div class="text-3xl font-black text-slate-300">${highScore}</div>
                </div>
            </div>

            <div class="w-full space-y-3 mt-auto mb-2">
                <button onclick="startGame()" class="w-full py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(99,102,241,0.4)]">
                    Main Lagi Mode Ini
                </button>
                <button onclick="goToGameConfig()" class="w-full py-4 rounded-2xl font-bold text-lg text-slate-300 bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 active:scale-[0.98] transition-all">
                    Konfigurasi Ulang
                </button>
            </div>
        </div>
    `;
}

// Application Boot
render();
