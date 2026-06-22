import { state, DIFFICULTIES } from '../../core/state.js';

export function renderResult() {
    const app = document.getElementById('app');
    const modeVal = state.gameMode === 'timed' ? state.timerDuration : state.questionLimit;
    const key = `mixed_${state.difficulty}_${state.gameMode}_${modeVal}`;
    const highScore = state.highScores[key] || 0;
    
    const modeLabel = state.gameMode === 'timed' ? `Waktu ${modeVal} Detik` : `Target ${modeVal} Soal`;
    const newHighHtml = (state.isNewHigh && state.score > 0) ? '<div class="absolute top-0 inset-x-0 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[10px] font-black text-center py-1.5 uppercase tracking-[0.2em] shadow-md">Skor Tertinggi Baru!</div>' : '';
    
    let commentaryText = "Beler parah lu, tidur gih \uD83D\uDCA4";
    if (state.score === 100) {
        commentaryText = "Gokil, ingfo sepuh mtk \uD83D\uDE80";
    } else if (state.score >= 50 && state.score < 100) {
        commentaryText = "Aman, sel-sel otak lu masih bekerja. \uD83C\uDF89";
    }
    
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 items-center justify-center animate-pop">
            <div class="mb-6 text-center mt-6">
                <div class="text-xl mb-4 font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 py-3 px-6 rounded-2xl inline-block shadow-sm">
                    ${commentaryText}
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
