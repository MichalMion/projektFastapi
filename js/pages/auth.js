// Obsługa stron logowania i rejestracji


// STRONA LOGOWANIA


// Inicjalizuje stronę logowania
function initLoginPage() {
    // Jeśli użytkownik jest już zalogowany, przekierowuje go na stronę główną
    if (auth.isAuthenticated()) {
        router.navigate('/');
        return;
    }

    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
            <div class="bg-[rgba(30,39,64,0.6)] backdrop-blur-[10px] rounded-2xl border border-white/10 p-8 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 max-w-[450px] w-full">
                <div class="text-center mb-8">
                    <h1 class="text-[2rem] font-bold mb-2 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">Zaloguj się</h1>
                    <p class="text-[#94a3b8]">Witaj ponownie!</p>
                </div>
                <form id="loginForm">
                    <div class="mb-6">
                        <label class="block mb-2 font-semibold text-[#cbd5e1]">Nazwa użytkownika</label>
                        <input 
                            type="text" 
                            class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" 
                            id="username" 
                            required 
                            autocomplete="username"
                        >
                    </div>
                    <div class="mb-6">
                        <label class="block mb-2 font-semibold text-[#cbd5e1]">Hasło</label>
                        <input 
                            type="password" 
                            class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" 
                            id="password" 
                            required 
                            autocomplete="current-password"
                        >
                    </div>
                    <button type="submit" class="w-full px-6 py-3 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">Zaloguj się</button>
                    <p class="text-center mt-8 text-[#94a3b8]">
                        Nie masz konta? 
                        <a onclick="router.navigate('/register')" class="text-[#6366f1] cursor-pointer">Zarejestruj się</a>
                    </p>
                </form>
            </div>
        </div>
    `;

    // Obsługa wysłania formularza logowania
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Zapobiega domyślnemu przeładowaniu strony

        // Pobiera wartości z pól formularza
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Wysyła żądanie logowania do API
            const response = await api.login({ username, password });

            // Zapisuje token JWT i dane użytkownika w localStorage
            auth.setToken(response.access_token);
            auth.setUser(response.user);

            // Pokazuje komunikat sukcesu i przekierowuje na stronę główną
            toast.success('Zalogowano pomyślnie!');
            router.navigate('/');
        } catch (error) {
            // W przypadku błędu pokazuje komunikat użytkownikowi
            toast.error(error.message || 'Błąd logowania');
        }
    });
}


// STRONA REJESTRACJI


// Inicjalizuje stronę rejestracji
function initRegisterPage() {
    // Jeśli użytkownik jest już zalogowany, przekierowuje go na stronę główną
    if (auth.isAuthenticated()) {
        router.navigate('/');
        return;
    }

    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
            <div class="bg-[rgba(30,39,64,0.6)] backdrop-blur-[10px] rounded-2xl border border-white/10 p-8 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 max-w-[450px] w-full">
                <div class="text-center mb-8">
                    <h1 class="text-[2rem] font-bold mb-2 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">Zarejestruj się</h1>
                    <p class="text-[#94a3b8]">Dołącz do społeczności Filmy</p>
                </div>
                <form id="registerForm">
                    <div class="mb-6">
                        <label class="block mb-2 font-semibold text-[#cbd5e1]">Nazwa użytkownika</label>
                        <input 
                            type="text" 
                            class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" 
                            id="regUsername" 
                            required 
                            autocomplete="username"
                            minlength="3"
                        >
                    </div>
                    <div class="mb-6">
                        <label class="block mb-2 font-semibold text-[#cbd5e1]">Email</label>
                        <input 
                            type="email" 
                            class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" 
                            id="regEmail" 
                            required 
                            autocomplete="email"
                        >
                    </div>
                    <div class="mb-6">
                        <label class="block mb-2 font-semibold text-[#cbd5e1]">Hasło</label>
                        <input 
                            type="password" 
                            class="w-full px-4 py-3.5 bg-[#151b2e] border-2 border-white/10 rounded-xl text-[#f8fafc] text-base transition-all duration-300 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" 
                            id="regPassword" 
                            required 
                            autocomplete="new-password"
                            minlength="6"
                        >
                    </div>
                    <button type="submit" class="w-full px-6 py-3 border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-0.5">Zarejestruj się</button>
                    <p class="text-center mt-8 text-[#94a3b8]">
                        Masz już konto? 
                        <a onclick="router.navigate('/login')" class="text-[#6366f1] cursor-pointer">Zaloguj się</a>
                    </p>
                </form>
            </div>
        </div>
    `;

    // Obsługa wysłania formularza rejestracji
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Zapobiega domyślnemu przeładowaniu strony

        // Pobiera wartości z pól formularza
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        try {
            // Wysyła żądanie rejestracji do API
            await api.register({ username, email, password });

            // Pokazuje komunikat sukcesu i przekierowuje do strony logowania
            toast.success('Rejestracja pomyślna! Możesz się teraz zalogować.');
            router.navigate('/login');
        } catch (error) {
            // W przypadku błędu (np. użytkownik już istnieje) pokazuje komunikat
            toast.error(error.message || 'Błąd rejestracji');
        }
    });
}
