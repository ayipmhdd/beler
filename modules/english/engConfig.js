export function renderEngConfig() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="flex-1 flex flex-col p-6 items-center justify-center animate-pop relative">
            <button onclick="goToHome()" class="absolute top-6 left-6 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95 z-10 backdrop-blur-sm shadow-sm" aria-label="Kembali ke Beranda">
                <svg class="w-6 h-6 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div class="text-6xl mb-4">🇬🇧</div>
            <h1 class="text-2xl font-bold text-slate-300">Modul Bahasa Inggris</h1>
            <p class="text-slate-500 mt-2 text-center">Segera Hadir!</p>
        </div>
    `;
}
