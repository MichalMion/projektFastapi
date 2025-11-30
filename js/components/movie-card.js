// Komponent generujący kartę filmu

function createMovieCard(movie) {
    return `
        <div class="bg-[rgba(30,39,64,0.6)] backdrop-blur-[10px] rounded-2xl overflow-hidden border border-white/10 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:border-[#6366f1]" onclick="router.navigate('/movie/${movie.id}')">
            <!-- Plakat filmu -->
            <img 
                src="${movie.poster_url || 'https://via.placeholder.com/300x400?text=Brak+plakatu'}" 
                alt="${movie.title}" 
                class="w-full h-[400px] object-cover bg-[#151b2e]"
            >
            
            <!-- Informacje o filmie -->
            <div class="p-6">
                <!-- Tytuł filmu -->
                <h3 class="text-xl font-bold mb-2">${movie.title}</h3>
                
                <!-- Rok wydania i gatunek -->
                <div class="flex gap-4 text-[#94a3b8] text-sm mb-4">
                    <span>${movie.release_year || 'N/A'}</span>
                    ${movie.genre ? `<span>• ${movie.genre}</span>` : ''}
                </div>
                
                <!-- Średnia ocena lub informacja o braku ocen -->
                ${movie.average_rating ? `
                    <div class="flex items-center gap-1 text-[#f59e0b] font-semibold before:content-['⭐']">${movie.average_rating.toFixed(1)}/10</div>
                ` : '<p class="text-[#94a3b8]">Brak ocen</p>'}
            </div>
        </div>
    `;
}
