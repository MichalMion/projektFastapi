// Strona główna wyświetlająca listę filmów

// Inicjalizuje stronę główną
function initHomePage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="max-w-[1200px] mx-auto px-6">
            <h1 class="text-center text-[2.5rem] font-bold leading-tight mb-4 mt-8">Odkryj najlepsze filmy</h1>
            <div class="mb-12">
                <input 
                    type="text" 
                    id="searchInput" 
                    class="w-full max-w-[600px] mx-auto block px-6 py-4 bg-[rgba(30,39,64,0.6)] backdrop-blur-[10px] border-2 border-white/10 rounded-3xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_30px_rgba(99,102,241,0.3)]" 
                    placeholder="Szukaj filmów..."
                >
            </div>
            <div id="movieGrid" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 py-12">
                <div class="spinner"></div>
            </div>
        </div>
    `;

    // Ładuje wszystkie filmy przy pierwszym otwarciu strony
    loadHomeMovies();

    // Nasłuchuje na zmiany w polu wyszukiwania
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value; // Pobiera wpisany tekst
        loadHomeMovies(query); // Przeładowuje listę filmów z filtrem wyszukiwania
    });
}

// Ładuje i wyświetla listę filmów
// search: opcjonalny parametr wyszukiwania (filtruje filmy po tytule)
async function loadHomeMovies(search = '') {
    const grid = document.getElementById('movieGrid');
    if (!grid) return; // Jeśli kontener nie istnieje, przerywa

    // Pokazuje spinner ładowania podczas pobierania danych
    grid.innerHTML = '<div class="spinner"></div>';

    try {
        // Pobiera filmy z API (z opcjonalnym filtrem wyszukiwania)
        const movies = await api.getMovies(search);

        // Jeśli nie znaleziono żadnych filmów, pokazuje odpowiedni komunikat
        if (movies.length === 0) {
            grid.innerHTML = '<p class="text-center text-[#94a3b8]">Nie znaleziono filmów</p>';
            return;
        }

        // Generuje HTML dla każdego filmu i wyświetla w siatce
        // createMovieCard() jest zdefiniowana w components/movie-card.js
        grid.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
    } catch (error) {
        // W przypadku błędu API pokazuje komunikat
        grid.innerHTML = '<p class="text-center">Błąd podczas ładowania filmów</p>';
        toast.error('Nie udało się załadować filmów');
    }
}
