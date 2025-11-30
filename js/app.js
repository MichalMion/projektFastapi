// Główny plik aplikacji inicjalizujący router

// Czeka aż cały HTML zostanie załadowany
document.addEventListener('DOMContentLoaded', () => {

    // REJESTRACJA TRAS (ROUTING)

    // Każda trasa (URL) jest powiązana z funkcją inicjalizującą odpowiednią stronę

    router.register('/', initHomePage);                  // Strona główna - lista filmów
    router.register('/login', initLoginPage);            // Strona logowania
    router.register('/register', initRegisterPage);      // Strona rejestracji
    router.register('/profile', initProfilePage);        // Profil użytkownika - jego recenzje
    router.register('/admin', initAdminPage);            // Panel administratora
    router.register('/movie/:id', initMovieDetailPage);  // Szczegóły filmu (dynamiczne ID)

    // Obsługuje początkową trasę (wyświetla stronę odpowiadającą aktualnemu URL)
    router.handleRoute();

    // Aktualizuje nawigację (pokazuje odpowiednie linki w zależności od stanu logowania)
    updateNav();
});
