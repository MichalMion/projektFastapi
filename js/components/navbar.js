// Komponent paska nawigacji

function updateNav() {
    // Znajduje kontener z linkami nawigacyjnymi w HTML
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return; // Jeśli kontener nie istnieje, przerywa

    // Sprawdza status użytkownika
    const isAuth = auth.isAuthenticated(); // Czy użytkownik jest zalogowany?
    const isAdmin = auth.isAdmin();        // Czy użytkownik jest administratorem?

    // Klasy Tailwind CSS dla linków nawigacyjnych
    // Zawiera style dla hover, animacje podkreślenia gradientowego itp.
    const linkClass = 'text-[#cbd5e1] no-underline font-medium transition-colors duration-150 cursor-pointer relative after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#6366f1] after:to-[#8b5cf6] after:transition-all after:duration-300 hover:text-[#f8fafc] hover:after:w-full';

    // Zawsze pokazuje link do strony głównej z filmami
    let links = `<a class="${linkClass}" onclick="router.navigate('/')">Filmy</a>`;

    // Jeśli użytkownik jest zalogowany, pokazuje dodatkowe opcje
    if (isAuth) {
        // Link do profilu użytkownika (lista jego recenzji)
        links += `<a class="${linkClass}" onclick="router.navigate('/profile')">Moje opinie</a>`;

        // Jeśli użytkownik jest adminem, pokazuje panel administratora
        if (isAdmin) {
            links += `<a class="${linkClass}" onclick="router.navigate('/admin')">Admin</a>`;
        }

        // Przycisk wylogowania
        links += `<a class="${linkClass}" onclick="auth.logout()">Wyloguj</a>`;
    }
    // Jeśli użytkownik NIE jest zalogowany, pokazuje opcje logowania/rejestracji
    else {
        links += `<a class="${linkClass}" onclick="router.navigate('/login')">Zaloguj</a>`;
        links += `<a class="${linkClass}" onclick="router.navigate('/register')">Rejestracja</a>`;
    }

    // Wstawia wygenerowane linki do kontenera nawigacji
    navLinks.innerHTML = links;
}

// Udostępnia funkcję globalnie, aby mogła być wywołana z innych modułów
// (np. z routera po zmianie strony)
window.updateNav = updateNav;
