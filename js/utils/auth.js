// Moduł zarządzania autentykacją użytkowników

const auth = {

    // ZARZĄDZANIE TOKENEM JWT


    // Pobiera token JWT z localStorage
    // Token jest używany do autoryzacji żądań API
    getToken() {
        return localStorage.getItem('token');
    },

    // Zapisuje token JWT w localStorage
    // Wywoływane po udanym logowaniu
    setToken(token) {
        localStorage.setItem('token', token);
    },

    // Usuwa token i dane użytkownika z localStorage
    // Wywoływane przy wylogowaniu lub gdy token jest nieprawidłowy
    removeToken() {
        localStorage.removeItem('token'); // Usuwa token JWT
        localStorage.removeItem('user');  // Usuwa dane użytkownika
    },


    // ZARZĄDZANIE DANYMI UŻYTKOWNIKA


    // Pobiera dane aktualnie zalogowanego użytkownika z localStorage
    // Zwraca obiekt użytkownika lub null jeśli nie jest zalogowany
    getUser() {
        const userStr = localStorage.getItem('user');
        // Parsuje JSON string do obiektu (jeśli istnieje)
        return userStr ? JSON.parse(userStr) : null;
    },

    // Zapisuje dane użytkownika w localStorage
    // user: obiekt z danymi użytkownika (id, username, email, is_admin)
    setUser(user) {
        // Konwertuje obiekt do JSON string przed zapisaniem
        localStorage.setItem('user', JSON.stringify(user));
    },


    // FUNKCJE POMOCNICZE


    // Sprawdza czy użytkownik jest zalogowany
    // Zwraca true jeśli token istnieje, false w przeciwnym razie
    isAuthenticated() {
        return !!this.getToken(); // Podwójne zaprzeczenie konwertuje do boolean
    },

    // Sprawdza czy zalogowany użytkownik ma uprawnienia administratora
    // Zwraca true jeśli użytkownik jest adminem, false w przeciwnym razie
    isAdmin() {
        const user = this.getUser();
        return user && user.is_admin; // Sprawdza czy user istnieje i ma flagę is_admin
    },

    // Wylogowuje użytkownika
    // Usuwa token i dane użytkownika, następnie przekierowuje na stronę główną
    logout() {
        this.removeToken(); // Czyści localStorage
        window.location.href = '/'; // Przekierowuje na stronę główną
    }
};
