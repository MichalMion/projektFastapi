// Strona profilu użytkownika z listą recenzji

// Inicjalizuje stronę profilu (asynchroniczna - pobiera dane z API)
async function initProfilePage() {
    // Jeśli użytkownik nie jest zalogowany, przekierowuje do logowania
    if (!auth.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    const app = document.getElementById('app');
    // Pokazuje spinner ładowania podczas pobierania danych
    app.innerHTML = '<div class="max-w-[1200px] mx-auto px-6"><div class="spinner"></div></div>';

    try {
        // Pobiera dane użytkownika z localStorage
        const user = auth.getUser();
        // Pobiera wszystkie recenzje użytkownika z API
        const reviews = await api.getMyReviews();

        app.innerHTML = `
            <div class="max-w-[1200px] mx-auto px-6">
                <div class="text-center mb-12 p-12 bg-[rgba(30,39,64,0.6)] backdrop-blur-[10px] rounded-2xl border border-white/10">
                    <h1 class="text-[2rem] font-bold bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-2">${user.username}</h1>
                    <p class="text-[#94a3b8]">Liczba opinii: ${reviews.length}</p>
                </div>

                <h2 class="text-[2rem] font-bold mb-8">Moje opinie</h2>
                ${reviews.length > 0 ? `
                    <div id="reviewsList">
                        ${reviews.map(review => `
                            <div class="bg-[#151b2e] rounded-xl p-6 mb-6 border border-white/5">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <h3><a onclick="router.navigate('/movie/${review.movie_id}')" class="text-xl font-bold text-[#6366f1] hover:text-[#7c7ff5] cursor-pointer transition-colors">${review.movie_title || 'Film'}</a></h3>
                                        <div class="flex items-center gap-1 text-[#f59e0b] font-semibold mt-2 before:content-['⭐']">${review.rating}/10</div>
                                    </div>
                                    <div class="flex gap-2">
                                        <button class="px-4 py-2 bg-[#1e2740] hover:bg-[rgba(30,39,64,0.8)] text-[#cbd5e1] rounded-xl text-sm font-medium transition-all duration-300" onclick="profileEditReview(${review.id})">Edytuj</button>
                                        <button class="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-sm font-medium transition-all duration-300" onclick="profileDeleteReview(${review.id})">Usuń</button>
                                    </div>
                                </div>
                                <p class="text-[#cbd5e1] leading-relaxed">${review.content}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-[#94a3b8] text-center">Nie masz jeszcze żadnych opinii.</p>'}
            </div>

            <!-- Edit Review Modal -->
            <div id="editModal" class="fixed inset-0 z-[1000] hidden items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300">
                <div class="bg-[rgba(30,39,64,0.95)] backdrop-blur-xl rounded-2xl border border-white/10 p-8 w-full max-w-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform scale-95 transition-transform duration-300 max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                        <h2 class="text-2xl font-bold">Edytuj opinię</h2>
                        <span class="text-[#94a3b8] text-4xl leading-none cursor-pointer transition-colors hover:text-[#f8fafc]" onclick="closeEditModal()">&times;</span>
                    </div>
                    <form id="editReviewForm">
                        <input type="hidden" id="editReviewId">
                        <div class="mb-6">
                            <label class="block mb-2 font-semibold text-[#cbd5e1]">Ocena</label>
                            <input type="number" class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" id="editReviewRating" min="1" max="10" step="0.1" required>
                        </div>
                        <div class="mb-6">
                            <label class="block mb-2 font-semibold text-[#cbd5e1]">Treść opinii</label>
                            <textarea class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] resize-y min-h-[120px]" id="editReviewContent" required></textarea>
                        </div>
                        <div class="flex gap-4 mt-6">
                            <button type="button" class="flex-1 px-6 py-3 bg-[#1e2740] hover:bg-[rgba(30,39,64,0.8)] text-[#f8fafc] rounded-xl font-semibold transition-all duration-300 border border-white/10" onclick="closeEditModal()">Anuluj</button>
                            <button type="submit" class="flex-1 px-6 py-3 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">Zapisz</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Obsługa formularza edycji recenzji
        const editReviewForm = document.getElementById('editReviewForm');
        if (editReviewForm) {
            editReviewForm.addEventListener('submit', async (e) => {
                e.preventDefault(); // Zapobiega przeładowaniu strony

                // Pobiera wartości z formularza
                const id = document.getElementById('editReviewId').value;
                const rating = parseFloat(document.getElementById('editReviewRating').value);
                const content = document.getElementById('editReviewContent').value;

                try {
                    // Wysyła zaktualizowaną recenzję do API
                    await api.updateReview(id, { rating, content });
                    toast.success('Opinia została zaktualizowana');
                    closeEditModal(); // Zamyka modal
                    router.handleRoute(); // Przeładowuje stronę aby pokazać zmiany
                } catch (error) {
                    toast.error('Nie udało się zaktualizować opinii');
                }
            });
        }

    } catch (error) {
        // W przypadku błędu pokazuje komunikat
        console.error('Profile error:', error);
        app.innerHTML = `<div class="max-w-[1200px] mx-auto px-6"><p class="text-[#ef4444]">Błąd podczas ładowania profilu: ${error.message}</p></div>`;
        toast.error('Nie udało się załadować profilu');
    }
}


// FUNKCJE GLOBALNE DLA PRZYCISKÓW (onclick)

// Te funkcje muszą być globalne, ponieważ są wywoływane z atrybutów onclick w HTML

// Otwiera modal edycji recenzji
window.profileEditReview = async function (id) {
    try {
        // Pobiera wszystkie recenzje użytkownika
        const reviews = await api.getMyReviews();
        // Znajduje recenzję o podanym ID
        const review = reviews.find(r => r.id === id);
        // Otwiera modal z danymi recenzji
        if (review) openEditModal(review);
    } catch (error) {
        toast.error('Nie udało się pobrać danych opinii');
    }
};

// Usuwa recenzję
window.profileDeleteReview = async function (id) {
    // Prosi użytkownika o potwierdzenie usunięcia
    if (!confirm('Czy na pewno chcesz usunąć tę opinię?')) {
        return; // Użytkownik anulował - przerywa
    }

    try {
        // Wysyła żądanie usunięcia do API
        await api.deleteReview(id);

        // Pokazuje komunikat sukcesu i przeładowuje stronę
        toast.success('Opinia została usunięta');
        router.handleRoute(); // Przeładowuje stronę aby zaktualizować listę
    } catch (error) {
        // W przypadku błędu pokazuje szczegółowy komunikat
        console.error('Error deleting review:', error);
        toast.error('Nie udało się usunąć opinii: ' + error.message);
    }
};
