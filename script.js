const app = document.getElementById('app');

// Game Configuration
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
    // Prevent Chrome's default mini-infobar
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI if we are currently on the menu screen
    if (typeof state !== 'undefined' && state.screen === 'menu') {
        render(); 
    }
});

// Application State Management
let state = {
    screen: 'menu',
    operation: null,
    difficulty: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    answered: false,
    highScores: JSON.parse(localStorage.getItem('math_highscores')) || {}
};

// Utilities
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Logic: Generate 10 Questions
function generateQuestions() {
    state.questions = [];
    const diff = DIFFICULTIES[state.difficulty];
    for (let i = 0; i < 10; i++) {
        state.questions.push(createQuestion(state.operation, diff.range));
    }
}

function createQuestion(opKey, range) {
    let a, b, correctAnswer;
    let [min, max] = range;
    
    // Core Math Logic ensuring proper bounds and integers
    if (opKey === 'add') {
        a = getRandomInt(min, max);
        b = getRandomInt(min, max);
        correctAnswer = a + b;
    } else if (opKey === 'sub') {
        a = getRandomInt(min, max);
        b = getRandomInt(min, max);
        if (a < b) [a, b] = [b, a]; // Ensure non-negative result for simplicity
        correctAnswer = a - b;
    } else if (opKey === 'mul') {
        // Range tuning to prevent overly massive numbers on Hard
        let actualMax = opKey === 'mul' && max > 50 ? 50 : max;
        a = getRandomInt(min, actualMax);
        b = getRandomInt(min, actualMax);
        correctAnswer = a * b;
    } else if (opKey === 'div') {
        // Ensuring whole number results for division
        b = getRandomInt(min, max); // divisor
        if (b === 0) b = 1; 
        correctAnswer = getRandomInt(min, max); // quotient
        a = b * correctAnswer; // dividend
    }
    
    let optionsSet = new Set();
    optionsSet.add(correctAnswer);
    
    // Distractor Generation Logic
    while (optionsSet.size < 4) {
        let offset = getRandomInt(-5, 5);
        if (offset === 0) continue;
        
        let distractor = correctAnswer + offset;
        
        // Add some logical errors to make it tricky
        if (optionsSet.size === 1) {
             if (opKey === 'mul') distractor = correctAnswer + a; 
             else if (opKey === 'add') distractor = correctAnswer + 10;
        }
        
        // Fallback offset if negative or duplicate
        if (distractor >= 0 && !optionsSet.has(distractor)) {
             optionsSet.add(distractor);
        } else {
             let fbOffset = getRandomInt(1, 20);
             optionsSet.add(correctAnswer + fbOffset);
        }
    }
    
    let options = Array.from(optionsSet);
    options.sort(() => Math.random() - 0.5); // Shuffle options
    
    return {
        text: `${a} ${OPERATIONS[opKey].symbol} ${b}`,
        options: options,
        correctAnswer: correctAnswer
    };
}

// Global UI Renderer
function render() {
    if (state.screen === 'menu') renderMenu();
    else if (state.screen === 'game') renderGame();
    else if (state.screen === 'result') renderResult();
}

// ---------------------- SCREEN RENDERING ---------------------- //

function renderMenu() {
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 overflow-y-auto animate-pop">
            <div class="mb-10 mt-6 text-center">
                <div class="inline-flex justify-center items-center w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-3xl mb-4 text-4xl shadow-inner">
                    <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V9H8v2H6v2h2v2h2v-2h2v-2zm-3.5 5h5v-2h-5v2zm7.5-3h-2v2h2v-2zm0-4h-2v2h2V9zM19 19H5V5h14v14z"/></svg>
                </div>
                <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">Asah Otak<br/>Matematika</h1>
            </div>
            
            <h2 class="text-lg font-semibold mb-3 text-slate-300">Pilih Operasi:</h2>
            <div class="grid grid-cols-2 gap-3 mb-8">
                ${Object.entries(OPERATIONS).map(([key, op]) => `
                    <button onclick="selectOperation('${key}')" class="flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${state.operation === key ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:bg-slate-800'}">
                        <div class="text-3xl font-black mb-1">${op.symbol}</div>
                        <div class="text-sm font-medium tracking-wide">${op.name}</div>
                    </button>
                `).join('')}
            </div>

            <h2 class="text-lg font-semibold mb-3 text-slate-300">Pilih Tingkat Kesulitan:</h2>
            <div class="grid grid-cols-3 gap-3 mb-auto">
                ${Object.entries(DIFFICULTIES).map(([key, diff]) => `
                    <button onclick="selectDifficulty('${key}')" class="py-3 rounded-xl border-2 transition-all duration-200 ${state.difficulty === key ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:bg-slate-800'}">
                        <div class="font-bold text-sm tracking-wide">${diff.name}</div>
                    </button>
                `).join('')}
            </div>

            <button onclick="startGame()" ${!(state.operation && state.difficulty) ? 'disabled' : ''} class="mt-8 w-full py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${state.operation && state.difficulty ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_4px_20px_rgba(99,102,241,0.4)] transform hover:scale-[1.02] active:scale-[0.98]' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-70'}">
                Mulai Bermain
            </button>
            
            ${deferredPrompt ? `
                <button onclick="installPWA()" class="mt-4 w-full py-3 rounded-2xl font-bold text-md text-emerald-100 bg-emerald-600/30 border border-emerald-500/50 hover:bg-emerald-600/50 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-emerald-900/30">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Install App (Bermain Offline)
                </button>
            ` : ''}
        </div>
    `;
}

window.installPWA = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install prompt outcome:', outcome);
        deferredPrompt = null;
        render(); // Hide the button after interaction
    }
};

// Window attachments for inline HTML onclick handlers
window.selectOperation = (op) => { state.operation = op; render(); };
window.selectDifficulty = (diff) => { state.difficulty = diff; render(); };

window.startGame = () => {
    if(!state.operation || !state.difficulty) return;
    generateQuestions();
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.screen = 'game';
    state.answered = false;
    render();
};

function renderGame() {
    const q = state.questions[state.currentQuestionIndex];
    
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 animate-pop">
            <!-- Header HUD -->
            <div class="flex justify-between items-center mb-8">
                <div class="px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center shadow-sm">
                    <span class="text-sm font-semibold text-slate-400">Soal</span>
                    <span class="ml-2 font-black text-indigo-400 text-lg">${state.currentQuestionIndex + 1}<span class="text-slate-500 text-sm font-semibold">/10</span></span>
                </div>
                <div class="px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center shadow-sm">
                    <span class="text-sm font-semibold text-slate-400">Skor</span>
                    <span id="score-display" class="ml-2 font-black text-emerald-400 text-lg">${state.score}</span>
                </div>
            </div>
            
            <!-- Question Area -->
            <div class="flex-1 flex flex-col justify-center mb-10 mt-4">
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
    
    const btn = document.getElementById(`opt-${index}`);
    
    // UI Feedback for answer
    if (isCorrect) {
        state.score += 10;
        btn.classList.replace('bg-slate-800', 'bg-emerald-500');
        btn.classList.replace('border-slate-900', 'border-emerald-700');
        btn.classList.replace('text-slate-200', 'text-white');
        btn.classList.add('shadow-[0_0_20px_rgba(16,185,129,0.5)]');
    } else {
        btn.classList.replace('bg-slate-800', 'bg-rose-500');
        btn.classList.replace('border-slate-900', 'border-rose-700');
        btn.classList.replace('text-slate-200', 'text-white');
        
        // Highlight correct answer if wrong
        const correctIndex = q.options.indexOf(q.correctAnswer);
        const correctBtn = document.getElementById(`opt-${correctIndex}`);
        correctBtn.classList.replace('bg-slate-800', 'bg-emerald-500');
        correctBtn.classList.replace('border-slate-900', 'border-emerald-700');
        correctBtn.classList.replace('text-slate-200', 'text-white');
    }
    
    document.getElementById('score-display').innerText = state.score;
    
    // Auto transition to next question
    setTimeout(() => {
        state.currentQuestionIndex++;
        if (state.currentQuestionIndex >= 10) {
            finishGame();
        } else {
            state.answered = false;
            render();
        }
    }, 1200);
};

function finishGame() {
    const key = `${state.operation}_${state.difficulty}`;
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
    const key = `${state.operation}_${state.difficulty}`;
    const highScore = state.highScores[key] || 0;
    const isPerfect = state.score === 100;
    
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 items-center justify-center animate-pop">
            <div class="mb-8 text-center mt-8">
                <div class="text-7xl mb-6 transform hover:scale-110 transition-transform duration-300 drop-shadow-xl">
                    ${isPerfect ? '🏆' : (state.score >= 50 ? '🎉' : '👍')}
                </div>
                <h1 class="text-3xl font-extrabold text-white mb-2 tracking-tight">Permainan Selesai!</h1>
                <p class="text-slate-400 font-medium">${OPERATIONS[state.operation].name} &bull; ${DIFFICULTIES[state.difficulty].name}</p>
            </div>
            
            <div class="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-8 w-full shadow-2xl mb-8 relative overflow-hidden backdrop-blur-sm">
                ${state.isNewHigh ? '<div class="absolute top-0 inset-x-0 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[10px] font-black text-center py-1.5 uppercase tracking-[0.2em] shadow-md">Skor Tertinggi Baru!</div>' : ''}
                
                <div class="text-center mt-4">
                    <div class="text-slate-400 text-xs font-bold mb-1 uppercase tracking-[0.1em]">Skor Anda</div>
                    <div class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-sm">
                        ${state.score}
                    </div>
                    <div class="text-slate-500 mt-3 font-medium text-sm">Benar <span class="text-slate-200 font-bold">${state.score/10}</span> dari 10 soal</div>
                </div>
                
                <div class="mt-8 pt-6 border-t border-slate-700/50 text-center">
                    <div class="text-slate-500 text-[10px] uppercase tracking-[0.15em] font-bold mb-1">Skor Tertinggi Mode Ini</div>
                    <div class="text-3xl font-black text-slate-300">${highScore}</div>
                </div>
            </div>

            <div class="w-full space-y-3 mt-auto mb-4">
                <button onclick="startGame()" class="w-full py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(99,102,241,0.4)]">
                    Main Lagi Mode Ini
                </button>
                <button onclick="backToMenu()" class="w-full py-4 rounded-2xl font-bold text-lg text-slate-300 bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 active:scale-[0.98] transition-all">
                    Menu Utama
                </button>
            </div>
        </div>
    `;
}

window.backToMenu = () => {
    state.screen = 'menu';
    render();
};

// Application Boot
render();
