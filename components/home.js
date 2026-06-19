export function renderHome() {
    const app = document.getElementById('app');
    
    // Check if installPWA function is available globally
    const installBtnHTML = window.deferredPrompt ? `
        <button onclick="installPWA()" class="mt-8 w-full py-3 rounded-2xl font-bold text-md text-emerald-100 bg-emerald-600/30 border border-emerald-500/50 hover:bg-emerald-600/50 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Install App (Bermain Offline)
        </button>
    ` : '';

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

            <button onclick="goToEngConfig()" class="w-full mt-4 relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(244,63,94,0.4)] transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_15px_50px_rgba(244,63,94,0.5)] active:scale-[0.97] text-left min-h-[180px] flex items-center justify-between border border-rose-400/30 group">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div class="text-3xl font-extrabold text-white z-10 drop-shadow-md pr-4 leading-tight">Belajar<br/>B. Inggris</div>
                <div class="z-10 bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-inner group-hover:bg-white/30 transition-colors duration-300">
                    <span class="text-4xl text-white drop-shadow-md">🇬🇧</span>
                </div>
                <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div class="absolute -left-8 -top-8 w-32 h-32 bg-rose-300 opacity-20 rounded-full blur-xl"></div>
            </button>
            
            ${installBtnHTML}
        </div>
    `;
}
