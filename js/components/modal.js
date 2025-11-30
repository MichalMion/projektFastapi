// System zarządzania oknami dialogowymi (modalami)

// Otwiera modal do edycji istniejącej recenzji
// review: obiekt recenzji z polami { id, rating, content }
function openEditModal(review) {
    const modal = document.getElementById('editModal');
    if (!modal) return; // Jeśli modal nie istnieje w HTML, przerywa

    // Wypełnia pola formularza danymi z recenzji
    document.getElementById('editReviewId').value = review.id;           // ID recenzji (ukryte pole)
    document.getElementById('editReviewRating').value = review.rating;   // Ocena (1-10)
    document.getElementById('editReviewContent').value = review.content; // Treść recenzji

    // Pokazuje modal z animacją
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    // Opóźnienie dla animacji opacity/scale
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const content = modal.querySelector('div'); // modal-content
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
    }, 10);
}

// Zamyka modal edycji recenzji
function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (!modal) return;

    // Dodaje klasę animacji (fade-out)
    modal.classList.add('opacity-0');
    const content = modal.querySelector('div');
    if (content) {
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
    }

    // Po zakończeniu animacji (300ms) ukrywa modal całkowicie
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}


// MODAL ZGŁASZANIA RECENZJI


// Otwiera modal do zgłoszenia nieodpowiedniej recenzji
// reviewId: ID recenzji do zgłoszenia
function openReportModal(reviewId) {
    const modal = document.getElementById('reportModal');
    if (!modal) return;

    // Ustawia ID recenzji w ukrytym polu formularza
    document.getElementById('reportReviewId').value = reviewId;
    // Czyści pole z powodem zgłoszenia (na wypadek poprzedniego użycia)
    document.getElementById('reportReason').value = '';

    // Pokazuje modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const content = modal.querySelector('div');
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
    }, 10);
}

// Zamyka modal zgłaszania recenzji
function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (!modal) return;

    // Usuwa klasę animacji
    modal.classList.add('opacity-0');
    const content = modal.querySelector('div');
    if (content) {
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
    }

    // Po zakończeniu animacji ukrywa modal
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}


// MODAL EDYCJI FILMU (TYLKO DLA ADMINA)


// Otwiera modal do edycji danych filmu
// movie: obiekt filmu z polami { id, title, description, release_year, poster_url, genre }
function openEditMovieModal(movie) {
    const modal = document.getElementById('editMovieModal');
    if (!modal) return;

    // Wypełnia formularz danymi filmu
    document.getElementById('editMovieId').value = movie.id;
    document.getElementById('editMovieTitle').value = movie.title;
    document.getElementById('editMovieDescription').value = movie.description || '';  // Używa pustego stringa jeśli brak
    document.getElementById('editMovieYear').value = movie.release_year || '';
    document.getElementById('editMoviePoster').value = movie.poster_url || '';
    document.getElementById('editMovieGenre').value = movie.genre || '';

    // Pokazuje modal z animacją
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const content = modal.querySelector('div');
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
    }, 10);
}

// Zamyka modal edycji filmu
function closeEditMovieModal() {
    const modal = document.getElementById('editMovieModal');
    if (!modal) return;

    // Usuwa klasę animacji
    modal.classList.add('opacity-0');
    const content = modal.querySelector('div');
    if (content) {
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
    }

    // Po zakończeniu animacji ukrywa modal
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}


// UDOSTĘPNIENIE FUNKCJI GLOBALNIE

// Wszystkie funkcje muszą być dostępne globalnie, ponieważ są wywoływane
// z atrybutów onclick w HTML (np. onclick="openEditModal(review)")

window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
window.openEditMovieModal = openEditMovieModal;
window.closeEditMovieModal = closeEditMovieModal;
