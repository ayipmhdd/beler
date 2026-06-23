export function renderHome() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 relative justify-center">
            
            <div class="mb-12 mt-4 flex flex-col items-center">
                <h1 class="text-6xl font-black text-slate-100 tracking-[0.2em] mb-2 uppercase drop-shadow-sm">Beler</h1>
                <p class="text-slate-400 text-sm font-bold tracking-widest uppercase">Pilih Modul Latihan</p>
            </div>
            
            <div class="flex flex-col gap-6 w-full max-w-sm mx-auto">
                <button onclick="goToModelSelection()" class="w-full relative overflow-hidden bg-[#161f30] border border-slate-700/60 rounded-[1.8rem] p-6 shadow-[0_8px_0_0_#0f172a] active:translate-y-[4px] active:shadow-[0_4px_0_0_#0f172a] transition-all duration-100 group flex items-center text-left">
                    <div class="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mr-5 text-blue-500 group-hover:scale-105 transition-transform">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </div>
                    <div class="flex flex-col">
                        <h2 class="text-xl font-black text-slate-100 mb-1 tracking-wide">Latihan Matematika</h2>
                        <p class="text-slate-400 text-sm font-medium">Biar otak lu agak sinkron dikit pas ngitung.</p>
                    </div>
                </button>
                
                <button onclick="goToEngConfig()" class="w-full relative overflow-hidden bg-[#161f30] border border-slate-700/60 rounded-[1.8rem] p-6 shadow-[0_8px_0_0_#0f172a] active:translate-y-[4px] active:shadow-[0_4px_0_0_#0f172a] transition-all duration-100 group flex items-center text-left">
                    <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mr-5 text-rose-500 group-hover:scale-105 transition-transform">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                    </div>
                    <div class="flex flex-col">
                        <h2 class="text-xl font-black text-slate-100 mb-1 tracking-wide">Belajar B. Inggris</h2>
                        <p class="text-slate-400 text-sm font-medium">Very well, minimal tau arti overthink lah.</p>
                    </div>
                </button>
            </div>
            
            <div class="mt-auto pt-10">
                ${window.deferredPrompt ? `
                <button onclick="installPWA()" class="w-full bg-emerald-600 border border-emerald-500 rounded-2xl py-3 font-bold text-white shadow-[0_4px_0_0_#065f46] active:translate-y-[2px] active:shadow-[0_2px_0_0_#065f46] transition-all mb-4 text-sm tracking-wide">
                    ✨ PASANG APLIKASI BELER
                </button>
                ` : ''}
                <p class="text-slate-600 text-xs font-bold tracking-[0.2em] text-center">VERSI 1.0.0</p>
            </div>
        </div>
    `;
}
