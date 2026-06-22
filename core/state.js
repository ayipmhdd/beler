export const state = {
    screen: 'home',
    operation: null,
    difficulty: null,
    gameMode: 'timed', // 'timed' | 'fixed'
    gameType: 'test', // 'test' | 'true_false' | 'input'
    timerDuration: 30, // seconds
    questionLimit: 10, // questions
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    timeLeft: 30,
    timerInterval: null,
    highScores: JSON.parse(localStorage.getItem('mathHighScores')) || {},
    isNewHigh: false,
    answered: false,
    totalAnswered: 0,
    currentInputAnswer: ''
};

export const DIFFICULTIES = {
    'mudah': { name: 'Mudah', range: [1, 20] },
    'sedang': { name: 'Sedang', range: [20, 100] },
    'sulit': { name: 'Sulit', range: [100, 500] }
};

export const OPERATIONS = {
    'tambah': { symbol: '+', fn: (a,b) => a+b },
    'kurang': { symbol: '-', fn: (a,b) => a-b },
    'kali': { symbol: '×', fn: (a,b) => a*b },
    'bagi': { symbol: '÷', fn: (a,b) => a/b }
};

// Expose state to window for debugging or global access if needed
window.appState = state;
