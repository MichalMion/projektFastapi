// Router po stronie klienta (SPA)

const router = {
    // Obiekt przechowujący wszystkie zarejestrowane trasy
    // Klucz: ścieżka URL (np. '/login')
    // Wartość: funkcja obsługująca tę trasę (handler)
    routes: {},


    // REJESTRACJA TRAS


    // Rejestruje nową trasę w aplikacji
    // path: ścieżka URL (np. '/login', '/movie/:id')
    // handler: funkcja wywoływana gdy użytkownik przechodzi na tę ścieżkę
    register(path, handler) {
        this.routes[path] = handler;
    },


    // NAWIGACJA


    // Przechodzi do nowej strony bez przeładowywania całej aplikacji
    // path: docelowa ścieżka URL
    navigate(path) {
        // Dodaje nowy wpis do historii przeglądarki (zmienia URL w pasku adresu)
        history.pushState({}, '', path);
        // Obsługuje nową trasę (wyświetla odpowiednią stronę)
        this.handleRoute();
    },


    // OBSŁUGA TRAS


    // Obsługuje aktualną trasę - wywołuje odpowiedni handler na podstawie URL
    handleRoute() {
        // Pobiera aktualną ścieżkę z paska adresu przeglądarki
        const path = window.location.pathname;

        // Dopasowuje ścieżkę do zarejestrowanych tras i wywołuje odpowiedni handler

        // Strona główna - lista filmów i wyszukiwarka
        if (path === '/' || path === '') {
            this.routes['/']();
        }
        // Strona logowania
        else if (path === '/login') {
            this.routes['/login']();
        }
        // Strona rejestracji
        else if (path === '/register') {
            this.routes['/register']();
        }
        // Profil użytkownika - lista jego recenzji
        else if (path === '/profile') {
            this.routes['/profile']();
        }
        // Panel administratora - zarządzanie zgłoszeniami
        else if (path === '/admin') {
            this.routes['/admin']();
        }
        // Szczegóły filmu - dynamiczna trasa z ID filmu
        else if (path.startsWith('/movie/')) {
            // Wyciąga ID filmu z URL (np. '/movie/123' -> '123')
            const id = path.split('/')[2];
            // Wywołuje handler z ID jako parametrem
            this.routes['/movie/:id'](id);
        }
        // Nieznana trasa - przekierowuje na stronę główną
        else {
            this.routes['/']();
        }

        // Aktualizuje nawigację (podświetla aktywny link w menu)
        // Funkcja updateNav() jest zdefiniowana w komponencie navbar
        if (window.updateNav) {
            window.updateNav();
        }
    }
};


// OBSŁUGA PRZYCISKÓW WSTECZ/DALEJ PRZEGLĄDARKI

// Nasłuchuje na zdarzenie 'popstate' - wywoływane gdy użytkownik
// klika przycisk wstecz lub dalej w przeglądarce
window.addEventListener('popstate', () => {
    router.handleRoute(); // Obsługuje nową trasę po zmianie historii
});
