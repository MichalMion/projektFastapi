// Moduł komunikacji z API backendu

// Bazowy adres URL serwera API
const API_BASE = 'http://localhost:8000';

const api = {

    // UNIWERSALNA FUNKCJA DO WYSYŁANIA ŻĄDAŃ HTTP

    // Ta funkcja jest używana przez wszystkie inne metody API.
    // Automatycznie dodaje token JWT do nagłówków i obsługuje błędy.
    async request(endpoint, options = {}) {
        // Pobiera token JWT z localStorage (jeśli użytkownik jest zalogowany)
        const token = auth.getToken();

        // Przygotowuje nagłówki HTTP - domyślnie JSON
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers // Pozwala na nadpisanie nagłówków w konkretnych przypadkach
        };

        // Jeśli użytkownik jest zalogowany, dodaje token do nagłówka Authorization
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            // Wysyła żądanie HTTP do serwera
            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers,
            });

            // Status 204 (No Content) oznacza sukces bez zwracania danych
            // Używane np. przy usuwaniu zasobów
            if (response.status === 204) {
                return null;
            }

            // Parsuje odpowiedź JSON z serwera
            const data = await response.json();

            // Jeśli odpowiedź nie jest OK (status 200-299)
            if (!response.ok) {
                // Status 401 (Unauthorized) - token wygasł lub jest nieprawidłowy
                if (response.status === 401) {
                    auth.removeToken(); // Usuwa nieprawidłowy token
                    window.location.href = '/login'; // Przekierowuje do logowania
                    return;
                }

                // Rzuca błąd z komunikatem z serwera lub ogólnym komunikatem
                throw new Error(data.detail || 'Request failed');
            }

            return data;
        } catch (error) {
            // Przekazuje błąd dalej, aby mógł być obsłużony w komponencie
            throw error;
        }
    },


    // ENDPOINTY AUTENTYKACJI


    // Rejestruje nowego użytkownika
    // userData: { username, email, password }
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // Loguje użytkownika
    // credentials: { username, password }
    // Zwraca token JWT, który jest zapisywany w localStorage
    async login(credentials) {
        // FastAPI OAuth2 wymaga formatu x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        return this.request('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
    },

    // Pobiera dane aktualnie zalogowanego użytkownika
    // Wymaga tokenu JWT w nagłówku
    async getMe() {
        return this.request('/auth/me');
    },


    // ENDPOINTY FILMÓW


    // Pobiera listę filmów z opcjonalnym wyszukiwaniem
    // search: opcjonalny parametr wyszukiwania (tytuł filmu)
    async getMovies(search = '') {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return this.request(`/movies${query}`);
    },

    // Pobiera szczegóły konkretnego filmu wraz z recenzjami
    // id: ID filmu w bazie danych
    async getMovie(id) {
        return this.request(`/movies/${id}`);
    },

    // Tworzy nowy film w bazie danych (importuje z TMDB)
    // movieData: { tmdb_id, title, poster_path, overview, release_date, vote_average }
    async createMovie(movieData) {
        return this.request('/movies', {
            method: 'POST',
            body: JSON.stringify(movieData)
        });
    },

    // Aktualizuje dane istniejącego filmu
    // id: ID filmu w bazie danych
    // movieData: obiekt z danymi do aktualizacji
    async updateMovie(id, movieData) {
        return this.request(`/movies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(movieData)
        });
    },

    // Usuwa film z bazy danych
    // id: ID filmu do usunięcia
    async deleteMovie(id) {
        return this.request(`/movies/${id}`, {
            method: 'DELETE'
        });
    },


    // ENDPOINTY RECENZJI


    // Tworzy nową recenzję filmu
    // reviewData: { movie_id, rating, comment }
    async createReview(reviewData) {
        return this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    },

    // Pobiera wszystkie recenzje aktualnie zalogowanego użytkownika
    async getMyReviews() {
        return this.request('/reviews/my');
    },

    // Alias dla getMyReviews() - dla spójności nazewnictwa
    async getUserReviews() {
        return this.getMyReviews();
    },

    // Aktualizuje istniejącą recenzję
    // id: ID recenzji do aktualizacji
    // reviewData: { rating, comment }
    async updateReview(id, reviewData) {
        return this.request(`/reviews/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData)
        });
    },

    // Usuwa recenzję
    // id: ID recenzji do usunięcia
    async deleteReview(id) {
        return this.request(`/reviews/${id}`, {
            method: 'DELETE'
        });
    },


    // ENDPOINTY RAPORTÓW (ZGŁOSZEŃ)


    // Zgłasza recenzję jako nieodpowiednią
    // reviewId: ID recenzji do zgłoszenia
    // reason: powód zgłoszenia (np. "spam", "obraźliwa treść")
    async reportReview(reviewId, reason) {
        return this.request('/reports/', {
            method: 'POST',
            body: JSON.stringify({ review_id: reviewId, reason })
        });
    },

    // Pobiera wszystkie zgłoszenia (tylko dla administratorów)
    async getReports() {
        return this.request('/reports/');
    },

    // Aktualizuje status zgłoszenia (tylko dla administratorów)
    // reportId: ID zgłoszenia
    // status: nowy status (np. "pending", "resolved", "rejected")
    async updateReport(reportId, status) {
        return this.request(`/reports/${reportId}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }
};
