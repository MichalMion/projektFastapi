// Panel administratora do zarządzania filmami i zgłoszeniami

// Inicjalizuje panel administratora
async function initAdminPage() {
    // Sprawdza czy użytkownik ma uprawnienia administratora
    if (!auth.isAdmin()) {
        router.navigate('/'); // Przekierowuje na stronę główną
        toast.error('Brak dostępu'); // Pokazuje komunikat o braku uprawnień
        return;
    }

    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="max-w-[1200px] mx-auto px-6">
            <div class="mb-8">
                <h1 class="text-[2.5rem] font-bold bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-6">Panel Administratora</h1>
                <div class="flex gap-4 border-b border-white/10 mt-6 mb-8">
                    <div class="px-6 py-3 font-semibold cursor-pointer border-b-2 border-[#6366f1] text-[#6366f1] transition-all duration-300" onclick="switchTab('add-movie')" id="tab-btn-add-movie">Dodaj film</div>
                    <div class="px-6 py-3 font-semibold cursor-pointer border-b-2 border-transparent text-[#94a3b8] transition-all duration-300 hover:text-[#cbd5e1]" onclick="switchTab('list-movies')" id="tab-btn-list-movies">Lista filmów</div>
                    <div class="px-6 py-3 font-semibold cursor-pointer border-b-2 border-transparent text-[#94a3b8] transition-all duration-300 hover:text-[#cbd5e1]" onclick="switchTab('reports')" id="tab-btn-reports">Zgłoszenia</div>
                </div>
            </div>

            <!-- Add Movie Tab -->
            <div id="tab-add-movie" class="tab-content">
                <div class="bg-[rgba(30,39,64,0.6)] backdrop-blur-[10px] rounded-2xl border border-white/10 p-8 mb-8">
                    <h3 class="text-[1.5rem] font-bold mb-6">Dodaj nowy film</h3>
                    <form id="addMovieForm">
                        <div class="mb-6">
                            <label class="block mb-2 font-semibold text-[#cbd5e1]">Tytuł</label>
                            <input type="text" class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" id="movieTitle" required>
                        </div>
                        <div class="mb-6">
                            <label class="block mb-2 font-semibold text-[#cbd5e1]">Opis</label>
                            <textarea class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] resize-y min-h-[120px]" id="movieDescription"></textarea>
                        </div>
                        <div class="mb-6">
                            <label class="block mb-2 font-semibold text-[#cbd5e1]">Rok produkcji</label>
                            <input type="number" class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1]" id="movieYear" min="1900" max="2025">
                        </div>
                        <div class="mb-6">
                            <label class="block mb-2 font-semibold text-[#cbd5e1]">URL Plakatu</label>
                            <input type="url" class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1]" id="moviePoster">
                        </div>
                        <div class="mb-6">
                            <label class="block mb-2 font-semibold text-[#cbd5e1]">Gatunek</label>
                            <input type="text" class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1]" id="movieGenre">
                        </div>
                        <button type="submit" class="px-6 py-3 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">Dodaj film</button>
                    </form>
                </div>
            </div>

            <!-- Movies List Tab -->
            <div id="tab-list-movies" class="tab-content hidden">
                <div id="moviesList"><div class="spinner"></div></div>
            </div>

            <!-- Reports Tab -->
            <div id="tab-reports" class="tab-content hidden">
                <div id="reportsContainer"><div class="spinner"></div></div>
            </div>
        </div>

        <!-- Edit Movie Modal -->
        <div id="editMovieModal" class="fixed inset-0 z-[1000] hidden items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300">
            <div class="bg-[rgba(30,39,64,0.95)] backdrop-blur-xl rounded-2xl border border-white/10 p-8 w-full max-w-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform scale-95 transition-transform duration-300 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                    <h2 class="text-2xl font-bold">Edytuj film</h2>
                    <span class="text-[#94a3b8] text-4xl leading-none cursor-pointer transition-colors hover:text-[#f8fafc]" onclick="closeEditMovieModal()">&times;</span>
                </div>
                <form id="editMovieForm">
                    <input type="hidden" id="editMovieId">
                    <div class="mb-6">
                        <label class="block mb-2 font-semibold text-[#cbd5e1]">Tytuł</label>
                        <input type="text" class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1]" id="editMovieTitle" required>
                    </div>
                    <div class="mb-6">
                        <label class="block mb-2 font-semibold text-[#cbd5e1]">Opis</label>
                        <textarea class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] resize-y min-h-[120px]" id="editMovieDescription"></textarea>
                    </div>
                    <div class="mb-6">
                        <label class="block mb-2 font-semibold text-[#cbd5e1]">Rok produkcji</label>
                        <input type="number" class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1]" id="editMovieYear">
                    </div>
                    <div class="mb-6">
                        <label class="block mb-2 font-semibold text-[#cbd5e1]">URL Plakatu</label>
                        <input type="url" class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1]" id="editMoviePoster">
                    </div>
                    <div class="mb-6">
                        <label class="block mb-2 font-semibold text-[#cbd5e1]">Gatunek</label>
                        <input type="text" class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1]" id="editMovieGenre">
                    </div>
                    <div class="flex gap-4 mt-6">
                        <button type="button" class="flex-1 px-6 py-3 bg-[#1e2740] hover:bg-[rgba(30,39,64,0.8)] text-[#f8fafc] rounded-xl font-semibold transition-all duration-300 border border-white/10" onclick="closeEditMovieModal()">Anuluj</button>
                        <button type="submit" class="flex-1 px-6 py-3 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">Zapisz</button>
                    </div>
                </form>
            </div>
        </div>
    `;


    // PRZEŁĄCZANIE ZAKAŁDEK (FILMY / ZGŁOSZENIA)

    window.switchTab = function (tabName) {
        // Resetuje style dla wszystkich zakładek
        const tabs = ['add-movie', 'list-movies', 'reports'];
        tabs.forEach(t => {
            const btn = document.getElementById(`tab-btn-${t}`);
            const content = document.getElementById(`tab-${t}`);

            if (btn) {
                btn.classList.remove('border-[#6366f1]', 'text-[#6366f1]');
                btn.classList.add('border-transparent', 'text-[#94a3b8]');
            }
            if (content) {
                content.classList.add('hidden');
            }
        });

        // Ustawia aktywny styl dla klikniętej zakładki
        const activeBtn = document.getElementById(`tab-btn-${tabName}`);
        const activeContent = document.getElementById(`tab-${tabName}`);

        if (activeBtn) {
            activeBtn.classList.remove('border-transparent', 'text-[#94a3b8]');
            activeBtn.classList.add('border-[#6366f1]', 'text-[#6366f1]');
        }
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        // Przeładowuje listę filmów jeśli przełączono na zakładkę listy
        if (tabName === 'list-movies') {
            loadAdminMovies();
        }
    };


    // ŁADOWANIE LISTY FILMÓW (DLA ADMINA)

    async function loadAdminMovies() {
        const container = document.getElementById('moviesList');
        if (!container) return;

        try {
            // Pobiera wszystkie filmy z bazy danych
            const movies = await api.getMovies();

            if (movies.length === 0) {
                container.innerHTML = '<p class="text-[#94a3b8]">Brak filmów w bazie</p>';
                return;
            }

            // Generuje HTML dla każdego filmu z przyciskami edycji i usuwania
            container.innerHTML = movies.map(movie => `
                <div class="bg-[#151b2e] rounded-xl p-6 mb-6 border border-white/5 flex justify-between items-center">
                    <div class="flex gap-4 items-center">
                        <img src="${movie.poster_url || 'https://via.placeholder.com/50'}" alt="${movie.title}" class="w-12 h-18 object-cover rounded">
                        <div>
                            <strong class="text-lg">${movie.title}</strong> <span class="text-[#94a3b8]">(${movie.release_year || 'brak roku'})</span><br>
                            <small class="text-[#94a3b8]">${movie.genre || 'brak gatunku'}</small>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="px-4 py-2 bg-[#1e2740] hover:bg-[rgba(30,39,64,0.8)] text-[#cbd5e1] rounded-xl text-sm font-medium transition-all duration-300" onclick="openEditMovieModal(${movie.id})">Edytuj</button>
                        <button class="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-sm font-medium transition-all duration-300" onclick="deleteMovie(${movie.id})">Usuń</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            container.innerHTML = '<p class="text-[#ef4444]">Błąd podczas ładowania filmów</p>';
            toast.error('Nie udało się załadować listy filmów');
        }
    }

    loadAdminMovies();

    // Obsługa formularza dodawania filmu
    document.getElementById('addMovieForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const movieData = {
            title: document.getElementById('movieTitle').value,
            description: document.getElementById('movieDescription').value || null,
            release_year: parseInt(document.getElementById('movieYear').value) || null,
            poster_url: document.getElementById('moviePoster').value || null,
            genre: document.getElementById('movieGenre').value || null
        };

        try {
            await api.createMovie(movieData);
            toast.success('Film został dodany!');
            document.getElementById('addMovieForm').reset();
            loadAdminMovies();
        } catch (error) {
            toast.error(error.message || 'Nie udało się dodać filmu');
        }
    });

    // Obsługa modala edycji filmu
    window.openEditMovieModal = async function (id) {
        try {
            const movie = await api.getMovie(id);
            document.getElementById('editMovieId').value = movie.id;
            document.getElementById('editMovieTitle').value = movie.title;
            document.getElementById('editMovieDescription').value = movie.description || '';
            document.getElementById('editMovieYear').value = movie.release_year || '';
            document.getElementById('editMoviePoster').value = movie.poster_url || '';
            document.getElementById('editMovieGenre').value = movie.genre || '';

            const modal = document.getElementById('editMovieModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => { modal.style.opacity = '1'; }, 10);
        } catch (error) {
            toast.error('Nie udało się pobrać danych filmu');
        }
    };

    window.closeEditMovieModal = function () {
        const modal = document.getElementById('editMovieModal');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    };

    document.getElementById('editMovieForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('editMovieId').value;
        const movieData = {
            title: document.getElementById('editMovieTitle').value,
            description: document.getElementById('editMovieDescription').value || null,
            release_year: parseInt(document.getElementById('editMovieYear').value) || null,
            poster_url: document.getElementById('editMoviePoster').value || null,
            genre: document.getElementById('editMovieGenre').value || null
        };

        try {
            await api.updateMovie(id, movieData);
            toast.success('Film został zaktualizowany');
            closeEditMovieModal();
            loadAdminMovies();
        } catch (error) {
            toast.error(error.message || 'Nie udało się zaktualizować filmu');
        }
    });


    // USUWANIE FILMU

    window.deleteMovie = async function (id) {
        // Prosi o potwierdzenie - usunięcie jest nieodwracalne
        if (!confirm('Czy na pewno chcesz usunąć ten film? Ta operacja jest nieodwracalna.')) return;

        try {
            await api.deleteMovie(id); // Wysyła żądanie usunięcia do API
            toast.success('Film został usunięty');
            loadAdminMovies(); // Przeładowuje listę filmów
        } catch (error) {
            toast.error('Nie udało się usunąć filmu');
        }
    };

    // Ładuje zgłoszenia
    async function loadReports() {
        const container = document.getElementById('reportsContainer');
        if (!container) return;

        try {
            const reports = await api.getReports();

            if (reports.length === 0) {
                container.innerHTML = '<p class="text-[#94a3b8]">Brak zgłoszeń</p>';
                return;
            }

            container.innerHTML = reports.map(report => `
                <div class="bg-[#151b2e] rounded-xl p-6 mb-6 border border-white/5">
                    <div class="mb-4">
                        <strong class="text-[#cbd5e1]">Zgłoszona opinia:</strong> 
                        <span class="text-[#94a3b8]">"${report.review_content}"</span>
                    </div>
                    <div class="mb-2 text-sm">
                        <strong class="text-[#cbd5e1]">Autor opinii:</strong> 
                        <span class="text-[#94a3b8]">${report.review_author}</span>
                    </div>
                    <div class="mb-2 text-sm">
                        <strong class="text-[#cbd5e1]">Zgłosił:</strong> 
                        <span class="text-[#94a3b8]">${report.reporter_username}</span>
                    </div>
                    <div class="mb-4">
                        <strong class="text-[#cbd5e1]">Powód:</strong> 
                        <span class="text-[#94a3b8]">${report.reason}</span>
                    </div>
                    <div class="mb-4 text-[#94a3b8] text-sm">
                        Zgłoszono: ${new Date(report.created_at).toLocaleString('pl-PL')}
                    </div>
                    <div class="flex gap-4">
                        <button class="px-6 py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl font-semibold transition-all duration-300" onclick="handleReport(${report.id}, 'approved')">Usuń opinię</button>
                        <button class="px-6 py-3 bg-[#1e2740] hover:bg-[rgba(30,39,64,0.8)] text-[#cbd5e1] rounded-xl font-semibold transition-all duration-300 border border-white/10" onclick="handleReport(${report.id}, 'rejected')">Odrzuć zgłoszenie</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            container.innerHTML = '<p class="text-[#ef4444]">Błąd podczas ładowania zgłoszeń</p>';
            toast.error('Nie udało się załadować zgłoszeń');
        }
    }

    loadReports();


    // OBSŁUGA ZGŁOSZENIA

    // Administrator może zatwierdzić zgłoszenie (usunąć recenzję) lub je odrzucić
    window.handleReport = async function (reportId, status) {
        try {
            // Wysyła decyzję do API (status: 'approved' lub 'rejected')
            await api.updateReport(reportId, status);

            // Pokazuje odpowiedni komunikat w zależności od decyzji
            if (status === 'approved') {
                toast.success('Opinia została usunięta');
            } else {
                toast.success('Zgłoszenie zostało odrzucone');
            }

            loadReports(); // Przeładowuje listę zgłoszeń
        } catch (error) {
            toast.error(error.message || 'Nie udało się przetworzyć zgłoszenia');
        }
    };
}
