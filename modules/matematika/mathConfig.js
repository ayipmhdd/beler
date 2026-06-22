import { state, DIFFICULTIES } from '../../core/state.js';

export function renderGameConfig() {
    const app = document.getElementById('app');
    let modeConfigHtml = '';
    
    if (state.gameMode === 'timed') {
        modeConfigHtml = `
            <div class="mb-8">
                <label class="block text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">Pilih Durasi Waktu</label>
                <div class="relative">
                    <select id="timerDurationSelect" class="block appearance-none w-full bg-[#161f30] border border-slate-700/60 text-slate-100 font-bold py-4 px-5 rounded-[1.2rem] leading-tight focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                        <option value="30" ${state.timerDuration === 30 ? 'selected' : ''}>30 Detik (Default)</option>
                        <option value="40" ${state.timerDuration === 40 ? 'selected' : ''}>40 Detik</option>
                        <option value="50" ${state.timerDuration === 50 ? 'selected' : ''}>50 Detik</option>
                        <option value="60" ${state.timerDuration === 60 ? 'selected' : ''}>1 Menit</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                        <svg class="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        `;
    } else {
        modeConfigHtml = `
            <div class="mb-8">
                <label class="block text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">Pilih Jumlah Soal</label>
                <div class="relative">
                    <select id="questionLimitSelect" class="block appearance-none w-full bg-[#161f30] border border-slate-700/60 text-slate-100 font-bold py-4 px-5 rounded-[1.2rem] leading-tight focus:outline-none focus:border-blue-500 transition-colors shadow-sm">
                        <option value="10" ${state.questionLimit === 10 ? 'selected' : ''}>10 Soal (Default)</option>
                        <option value="20" ${state.questionLimit === 20 ? 'selected' : ''}>20 Soal</option>
                        <option value="30" ${state.questionLimit === 30 ? 'selected' : ''}>30 Soal</option>
                        <option value="40" ${state.questionLimit === 40 ? 'selected' : ''}>40 Soal</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                        <svg class="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        `;
    }

    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 overflow-y-auto relative">
            <button onclick="goToModelSelection()" class="absolute top-6 left-6 p-3 rounded-2xl bg-[#161f30] border border-slate-700/60 text-slate-400 hover:text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_0_#0f172a] active:shadow-[0_2px_0_0_#0f172a] z-10" aria-label="Kembali ke Pilihan Model">
                <svg class="w-6 h-6 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            <div class="mb-10 mt-6 text-center">
                <div class="inline-flex justify-center items-center w-20 h-20 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-[1.5rem] mb-4 mt-6">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                </div>
                <h1 class="text-3xl font-black text-slate-100 tracking-tight">Konfigurasi</h1>
            </div>
            
            <h2 class="text-xs font-bold tracking-widest uppercase mb-3 text-slate-400">Tingkat Kesulitan</h2>
            <div class="flex flex-col gap-3 mb-8">
                ${Object.entries(DIFFICULTIES).map(([key, diff]) => {
                    const diffLabels = { mudah: 'Cupu (Easy)', sedang: 'Agak Mikir (Medium)', sulit: 'Sepuh (Hard)' };
                    return `
                    <button onclick="selectDifficulty('${key}')" class="py-4 px-5 flex items-center justify-between rounded-2xl border-2 transition-all duration-100 ${state.difficulty === key ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-[#161f30] border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'}">
                        <div class="font-bold text-base tracking-wide">${diffLabels[key] || diff.name}</div>
                        ${state.difficulty === key ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>' : '<div class="w-6 h-6 rounded-full border-2 border-slate-700"></div>'}
                    </button>
                `;}).join('')}
            </div>
            
            <h2 class="text-xs font-bold tracking-widest uppercase mb-3 text-slate-400">Tipe Game</h2>
            <div class="grid grid-cols-3 gap-3 mb-8">
                <button onclick="selectGameType('test')" class="py-4 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-100 ${state.gameType === 'test' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-[#161f30] border-slate-700/60 text-slate-400 hover:bg-slate-800'}">
                    <svg class="w-7 h-7 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <span class="font-bold text-sm">Test</span>
                </button>
                <button onclick="selectGameType('true_false')" class="py-4 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-100 ${state.gameType === 'true_false' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-[#161f30] border-slate-700/60 text-slate-400 hover:bg-slate-800'}">
                    <svg class="w-7 h-7 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span class="font-bold text-sm">True/False</span>
                </button>
                <button onclick="selectGameType('input')" class="py-4 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-100 ${state.gameType === 'input' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-[#161f30] border-slate-700/60 text-slate-400 hover:bg-slate-800'}">
                    <svg class="w-7 h-7 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                    <span class="font-bold text-sm">Input</span>
                </button>
            </div>

            <h2 class="text-xs font-bold tracking-widest uppercase mb-3 text-slate-400">Mode Permainan</h2>
            <div class="grid grid-cols-2 gap-3 mb-8">
                <button onclick="selectGameMode('timed')" class="py-4 px-2 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-100 ${state.gameMode === 'timed' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-[#161f30] border-slate-700/60 text-slate-400 hover:bg-slate-800'}">
                    <svg class="w-7 h-7 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span class="font-bold text-sm text-center">Speedrun<br/>(Pakai Timer)</span>
                </button>
                <button onclick="selectGameMode('fixed')" class="py-4 px-2 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-100 ${state.gameMode === 'fixed' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-[#161f30] border-slate-700/60 text-slate-400 hover:bg-slate-800'}">
                    <svg class="w-7 h-7 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    <span class="font-bold text-sm text-center">Santai<br/>(Tanpa Timer)</span>
                </button>
            </div>
            
            ${modeConfigHtml}

            <button onclick="startGame()" ${!state.difficulty ? 'disabled' : ''} class="mt-4 mb-4 w-full bg-blue-600 hover:bg-blue-500 border border-blue-400/20 text-white font-bold rounded-2xl py-5 shadow-[0_6px_0_0_#1d4ed8] active:translate-y-[3px] active:shadow-[0_3px_0_0_#1d4ed8] transition-all duration-100 disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0 disabled:bg-[#161f30] disabled:text-slate-500 disabled:border-slate-700 tracking-widest text-lg">
                MULAI BERMAIN
            </button>
        </div>
    `;
}
