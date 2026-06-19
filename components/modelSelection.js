export function renderModelSelection() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 overflow-y-auto animate-pop relative">
            <div class="flex items-center justify-center mb-8 mt-2 relative">
                <button onclick="goToHome()" class="absolute left-0 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95 z-10 backdrop-blur-sm shadow-sm" aria-label="Kembali ke Beranda">
                    <svg class="w-6 h-6 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight text-center">Pilih Model Latihan</h1>
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
