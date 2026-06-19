import { state, DIFFICULTIES } from '../../core/state.js';

export function renderGameConfig() {
    const app = document.getElementById('app');
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
