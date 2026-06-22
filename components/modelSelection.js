export function renderModelSelection() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 overflow-y-auto relative">
            <div class="flex items-center justify-center mb-8 mt-2 relative">
                <button onclick="goToHome()" class="absolute left-0 p-3 rounded-2xl bg-[#161f30] border border-slate-700/60 text-slate-400 hover:text-white transition-all active:translate-y-[2px] shadow-[0_4px_0_0_#0f172a] active:shadow-[0_2px_0_0_#0f172a] z-10" aria-label="Kembali ke Beranda">
                    <svg class="w-6 h-6 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 class="text-2xl font-black text-slate-100 tracking-tight text-center w-full">Model Latihan</h1>
            </div>
            
            <button onclick="goToGameConfig()" class="w-full relative overflow-hidden bg-[#161f30] border border-slate-700/60 rounded-[1.8rem] p-6 shadow-[0_8px_0_0_#0f172a] active:translate-y-[4px] active:shadow-[0_4px_0_0_#0f172a] transition-all duration-100 group flex items-center text-left mb-4 mt-4">
                <div class="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mr-5 text-blue-500 group-hover:scale-105 transition-transform">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
                </div>
                <div class="flex flex-col">
                    <h2 class="text-xl font-black text-slate-100 tracking-wide">Operasi Dasar<br/>Matematika</h2>
                </div>
            </button>
        </div>
    `;
}
