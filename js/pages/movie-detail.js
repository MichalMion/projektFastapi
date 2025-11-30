// Strona szczegółów filmu i recenzji

// Inicjalizuje stronę szczegółów filmu
// id: ID filmu do wyświetlenia
async function initMovieDetailPage(id) {
    const app = document.getElementById('app');
    // Pokazuje spinner ładowania podczas pobierania danych
    app.innerHTML = '<div class="max-w-[1200px] mx-auto px-6"><div class="spinner"></div></div>';

    try {
        // Pobiera szczegóły filmu wraz z recenzjami z API
        const movie = await api.getMovie(id);

        // Sprawdza status autentykacji użytkownika
        const isAuth = auth.isAuthenticated();
        const currentUser = auth.getUser();

        // Sprawdza czy użytkownik już napisał recenzję tego filmu
        const userReview = isAuth && currentUser ? movie.reviews.find(r => r.user_id === currentUser.id) : null;

        app.innerHTML = `
            <div class="max-w-[1200px] mx-auto px-6">
                <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 mb-12">
                    <img src="${movie.poster_url || 'https://via.placeholder.com/300x400?text=Brak+plakatu'}" alt="${movie.title}" class="w-full rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <div>
                        <h1 class="text-[2.5rem] font-bold leading-tight mb-4">${movie.title}</h1>
                        <div class="flex gap-6 text-[#94a3b8] mb-6">
                            <span>${movie.release_year || 'N/A'}</span>
                            ${movie.genre ? `<span>• ${movie.genre}</span>` : ''}
                            ${movie.average_rating ? `<div class="flex items-center gap-1 text-[#f59e0b] font-semibold before:content-['⭐']">${movie.average_rating.toFixed(1)}/10</div>` : ''}
                        </div>
                        <p class="text-[#cbd5e1] leading-relaxed text-lg">${movie.description || 'Brak opisu'}</p>
                    </div>
                </div>

                ${isAuth && !userReview ? `
                    <div class="bg-[rgba(30,39,64,0.6)] backdrop-blur-[10px] rounded-2xl border border-white/10 p-8 mb-12">
                        <h3 class="text-[1.5rem] font-bold mb-6">Dodaj swoją opinię</h3>
                        <form id="reviewForm">
                            <div class="mb-6">
                                <label class="block mb-3 font-semibold text-[#cbd5e1]">Ocena (1-10)</label>
                                <div class="flex gap-2 text-4xl" id="ratingInput">
                                    ${[...Array(10)].map((_, i) => `<span class="rating-star inactive" data-rating="${i + 1}">⭐</span>`).join('')}
                                </div>
                                <div id="ratingDisplay" class="mt-3 text-[#6366f1] font-semibold min-h-[1.5rem]">Wybierz ocenę</div>
                                <input type="hidden" id="ratingValue" required>
                            </div>
                            <div class="mb-6">
                                <label class="block mb-2 font-semibold text-[#cbd5e1]">Treść opinii</label>
                                <textarea class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] resize-y min-h-[120px]" id="reviewContent" required placeholder="Podziel się swoją opinią o tym filmie..." minlength="10"></textarea>
                            </div>
                            <button type="submit" class="px-6 py-3 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">Dodaj opinię</button>
                        </form>
                    </div>
                ` : ''}

                ${!isAuth ? `
                    <div class="bg-[rgba(30,39,64,0.6)] backdrop-blur-[10px] rounded-2xl border border-white/10 p-8 mb-12 text-center">
                        <p class="mb-4 text-lg">Zaloguj się, aby dodać opinię</p>
                        <button class="px-6 py-3 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-0.5" onclick="router.navigate('/login')">Zaloguj się</button>
                    </div>
                ` : ''}

                <div class="mt-12 pt-12 border-t border-white/10">
                    <h2 class="text-[2rem] font-bold mb-8">Opinie (${movie.reviews.length})</h2>
                    ${movie.reviews.length > 0 ? movie.reviews.map(review => createReviewCard(review, currentUser)).join('') : '<p class="text-[#94a3b8] text-center text-lg">Brak opinii. Bądź pierwszym!</p>'}
                </div>
            </div>

            <!-- Edit Modal -->
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
                            <select class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1]" id="editReviewRating" required>
                                ${[...Array(10)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-6">
                            <label class="block mb-2 font-semibold text-[#cbd5e1]">Treść</label>
                            <textarea class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] resize-y min-h-[120px]" id="editReviewContent" required></textarea>
                        </div>
                        <div class="flex gap-4 mt-6">
                            <button type="button" class="flex-1 px-6 py-3 bg-[#1e2740] hover:bg-[rgba(30,39,64,0.8)] text-[#f8fafc] rounded-xl font-semibold transition-all duration-300 border border-white/10" onclick="closeEditModal()">Anuluj</button>
                            <button type="submit" class="flex-1 px-6 py-3 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">Zapisz</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Report Modal -->
            <div id="reportModal" class="fixed inset-0 z-[1000] hidden items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300">
                <div class="bg-[rgba(30,39,64,0.95)] backdrop-blur-xl rounded-2xl border border-white/10 p-8 w-full max-w-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform scale-95 transition-transform duration-300 max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                        <h2 class="text-2xl font-bold">Zgłoś opinię</h2>
                        <span class="text-[#94a3b8] text-4xl leading-none cursor-pointer transition-colors hover:text-[#f8fafc]" onclick="closeReportModal()">&times;</span>
                    </div>
                    <form id="reportForm">
                        <input type="hidden" id="reportReviewId">
                        <div class="mb-6">
                            <label class="block mb-2 font-semibold text-[#cbd5e1]">Powód zgłoszenia</label>
                            <textarea class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] resize-y min-h-[120px]" id="reportReason" required placeholder="Opisz dlaczego zgłaszasz tę opinię..."></textarea>
                        </div>
                        <div class="flex gap-4 mt-6">
                            <button type="button" class="flex-1 px-6 py-3 bg-[#1e2740] hover:bg-[rgba(30,39,64,0.8)] text-[#f8fafc] rounded-xl font-semibold transition-all duration-300 border border-white/10" onclick="closeReportModal()">Anuluj</button>
                            <button type="submit" class="flex-1 px-6 py-3 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">Wyślij zgłoszenie</button>
                        </div>
                    </form>
                </div>
            </div>
        `;


        // SYSTEM OCENIANIA GWIAZDKAMI

        // Interaktywny system wyboru oceny 1-10 za pomocą gwiazdek
        // Tylko dla zalogowanych użytkowników, którzy jeszcze nie dodali recenzji
        if (isAuth && !userReview) {
            // setTimeout zapewnia, że DOM jest już załadowany przed dodaniem event listenerów
            setTimeout(() => {
                const stars = document.querySelectorAll('.rating-star');
                const ratingValue = document.getElementById('ratingValue'); // Ukryte pole z wartością oceny
                const ratingDisplay = document.getElementById('ratingDisplay'); // Tekst pokazujący wybraną ocenę
                let selectedRating = 0; // Aktualnie wybrana ocena

                // Dodaje event listenery do każdej gwiazdki
                stars.forEach((star) => {
                    // Hover - podkreśla gwiazdki do tej, na którą najechano
                    star.addEventListener('mouseenter', function () {
                        const hoverRating = parseInt(this.dataset.rating);
                        stars.forEach((s, idx) => {
                            s.classList.toggle('active', idx < hoverRating);
                            s.classList.toggle('inactive', idx >= hoverRating);
                        });
                        ratingDisplay.textContent = `${hoverRating}/10`;
                    });

                    // Kliknięcie - zapisuje wybraną ocenę
                    star.addEventListener('click', function (e) {
                        e.preventDefault();
                        selectedRating = parseInt(this.dataset.rating);
                        ratingValue.value = selectedRating; // Zapisuje w ukrytym polu formularza
                        ratingDisplay.textContent = `Wybrano: ${selectedRating}/10`;
                    });
                });

                // Gdy mysz opuści obszar gwiazdek, powraca do wybranej oceny
                document.getElementById('ratingInput').addEventListener('mouseleave', () => {
                    if (selectedRating > 0) {
                        stars.forEach((s, idx) => {
                            s.classList.toggle('active', idx < selectedRating);
                            s.classList.toggle('inactive', idx >= selectedRating);
                        });
                        ratingDisplay.textContent = `Wybrano: ${selectedRating}/10`;
                    } else {
                        stars.forEach(s => s.classList.replace('active', 'inactive'));
                        ratingDisplay.textContent = 'Wybierz ocenę';
                    }
                });

                // Obsługa formularza dodawania recenzji
                document.getElementById('reviewForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const rating = parseFloat(ratingValue.value);
                    const content = document.getElementById('reviewContent').value;

                    // Walidacja - sprawdza czy użytkownik wybrał ocenę
                    if (!rating) {
                        toast.error('Proszę wybrać ocenę');
                        return;
                    }

                    try {
                        // Wysyła nową recenzję do API
                        await api.createReview({ movie_id: parseInt(id), rating, content });
                        toast.success('Opinia została dodana!');
                        router.handleRoute(); // Przeładowuje stronę aby pokazać nową recenzję
                    } catch (error) {
                        toast.error(error.message || 'Nie udało się dodać opinii');
                    }
                });
            }, 100);
        }

        // Edit form
        const editReviewForm = document.getElementById('editReviewForm');
        if (editReviewForm) {
            editReviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const reviewId = document.getElementById('editReviewId').value;
                const rating = parseFloat(document.getElementById('editReviewRating').value);
                const content = document.getElementById('editReviewContent').value;

                try {
                    await api.updateReview(reviewId, { rating, content });
                    toast.success('Opinia została zaktualizowana');
                    closeEditModal();
                    router.handleRoute();
                } catch (error) {
                    toast.error('Nie udało się zaktualizować opinii');
                }
            });
        }

        // Report form
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const reviewId = document.getElementById('reportReviewId').value;
                const reason = document.getElementById('reportReason').value;

                try {
                    await api.reportReview(parseInt(reviewId), reason);
                    toast.success('Zgłoszenie zostało wysłane');
                    closeReportModal();
                } catch (error) {
                    toast.error(error.message || 'Nie udało się wysłać zgłoszenia');
                }
            });
        }


        // Funkcja usuwania recenzji
        const deleteReview = async (reviewId) => {
            if (!confirm('Czy na pewno chcesz usunąć tę opinię?')) return;

            try {
                await api.deleteReview(reviewId);
                toast.success('Opinia została usunięta');
                router.handleRoute(); // Przeładowuje widok
            } catch (error) {
                toast.error('Nie udało się usunąć opinii');
                console.error(error);
            }
        };

        // OBSŁUGA PRZYCISKÓW W RECENZJACH

        // Dodaje event listenery do przycisków edycji, usuwania i zgłaszania recenzji

        // Przyciski edycji recenzji (tylko dla właściciela)
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const reviewId = parseInt(btn.dataset.id);
                const review = movie.reviews.find(r => r.id === reviewId);
                if (review) openEditModal(review); // Otwiera modal z danymi recenzji
            });
        });

        // Przyciski usuwania recenzji (tylko dla właściciela)
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const reviewId = parseInt(btn.dataset.id);
                deleteReview(reviewId); // Funkcja zdefiniowana poniżej
            });
        });

        // Przyciski zgłaszania recenzji (tylko dla innych użytkowników)
        document.querySelectorAll('.btn-report').forEach(btn => {
            btn.addEventListener('click', () => {
                const reviewId = parseInt(btn.dataset.id);
                openReportModal(reviewId); // Otwiera modal zgłoszenia
            });
        });

    } catch (error) {
        app.innerHTML = `
            <div class="max-w-[1200px] mx-auto px-6">
                <div class="bg-[rgba(30,39,64,0.6)] backdrop-blur-[10px] rounded-2xl border border-white/10 p-12 text-center">
                    <h2 class="text-2xl font-bold mb-4">Film nie znaleziony</h2>
                    <button class="px-6 py-3 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]" onclick="router.navigate('/')">Wróć do listy filmów</button>
                </div>
            </div>
        `;
    }
}
