// Komponent generujący kartę recenzji

function createReviewCard(review, currentUser = null) {
    // Sprawdza czy aktualny użytkownik jest autorem tej recenzji
    const isOwner = currentUser && review.user_id === currentUser.id;

    // Sprawdza czy użytkownik może zgłosić tę recenzję (tylko cudze recenzje)
    const canReport = currentUser && review.user_id !== currentUser.id;

    return `
        <div class="bg-[#151b2e] rounded-xl p-6 mb-6 border border-white/5">
            <!-- Nagłówek recenzji: autor, ocena, data i przyciski akcji -->
            <div class="flex justify-between items-center mb-4">
                <div>
                    <!-- Nazwa użytkownika który napisał recenzję -->
                    <span class="font-semibold text-[#6366f1]">${review.username}</span>
                    
                    <!-- Ocena z gwiazdką -->
                    <div class="flex items-center gap-1 text-[#f59e0b] font-semibold mt-1 before:content-['⭐']">${review.rating}/10</div>
                </div>
                
                <!-- Prawa strona: data i przyciski akcji -->
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <!-- Data utworzenia recenzji w formacie polskim -->
                    <span class="text-[#94a3b8] text-sm">${new Date(review.created_at).toLocaleDateString('pl-PL')}</span>
                    
                    <!-- Jeśli użytkownik jest właścicielem, pokazuje przyciski edycji i usuwania -->
                    ${isOwner ? `
                        <button class="px-4 py-2 bg-[#1e2740] hover:bg-[rgba(30,39,64,0.8)] text-[#cbd5e1] rounded-xl text-sm font-medium transition-all duration-300 btn-edit" data-id="${review.id}">Edytuj</button>
                        <button class="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-sm font-medium transition-all duration-300 btn-delete" data-id="${review.id}">Usuń</button>
                    ` : ''}
                    
                    <!-- Jeśli użytkownik NIE jest właścicielem, pokazuje przycisk zgłaszania -->
                    ${canReport ? `
                        <button class="px-4 py-2 bg-[#1e2740] hover:bg-[rgba(30,39,64,0.8)] text-[#cbd5e1] rounded-xl text-sm font-medium transition-all duration-300 btn-report" data-id="${review.id}">Zgłoś</button>
                    ` : ''}
                </div>
            </div>
            
            <!-- Treść recenzji -->
            <p class="text-[#cbd5e1] leading-relaxed">${review.content}</p>
        </div>
    `;
}
