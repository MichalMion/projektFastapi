// System powiadomień typu toast - nowoczesny design z Tailwind CSS

const toast = {
    // Główna funkcja wyświetlająca powiadomienie
    // message: tekst do wyświetlenia
    // type: typ powiadomienia ('success' lub 'error') - wpływa na kolor i ikonę
    show(message, type = 'success') {
        // Znajduje kontener na powiadomienia w HTML
        const container = document.getElementById('toast-container');
        if (!container) return; // Jeśli kontener nie istnieje, przerywa

        // Definiuje style w zależności od typu powiadomienia
        const styles = {
            success: {
                bg: 'bg-green-600',
                shadow: 'shadow-[0_8px_32px_rgba(16,185,129,0.3)]',
                border: 'border-l-4 border-green-400'
            },
            error: {
                bg: 'bg-red-600',
                shadow: 'shadow-[0_8px_32px_rgba(239,68,68,0.3)]',
                border: 'border-l-4 border-red-400'
            }
        };

        const style = styles[type] || styles.success;

        // Tworzy nowy element div dla powiadomienia
        const toastEl = document.createElement('div');
        toastEl.className = `
            ${style.bg} ${style.shadow} ${style.border}
            px-6 py-4 rounded-xl text-white font-semibold
            flex items-center gap-3 mb-3
            transform transition-all duration-300 ease-out
            translate-x-full opacity-0
            backdrop-blur-sm
            min-w-[300px] max-w-[500px]
        `.trim().replace(/\s+/g, ' ');

        // Ustawia treść powiadomienia
        toastEl.innerHTML = `
            <div class="text-sm leading-relaxed">
                ${message}
            </div>
        `;

        // Dodaje powiadomienie do kontenera
        container.appendChild(toastEl);

        // Animacja wejścia (slide in z prawej strony)
        setTimeout(() => {
            toastEl.classList.remove('translate-x-full', 'opacity-0');
            toastEl.classList.add('translate-x-0', 'opacity-100');
        }, 10);

        // Automatycznie usuwa powiadomienie po 3 sekundach
        setTimeout(() => {
            // Animacja wyjścia (fade out i slide out)
            toastEl.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                toastEl.remove();
            }, 300);
        }, 3000);
    },

    // Skrót do wyświetlenia powiadomienia o sukcesie (zielone)
    success(message) {
        this.show(message, 'success');
    },

    // Skrót do wyświetlenia powiadomienia o błędzie (czerwone)
    error(message) {
        this.show(message, 'error');
    }
};

