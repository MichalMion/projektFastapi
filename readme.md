# Filmy Api- Instrukcja Uruchomienia

## 📋 Pobierz

- Python 3.8+
- PostgreSQL 12+


### 1. Utwórz bazę danych

Utwórz bazę danych o nazwie ```filmyyyyy``` w PostgreSQL

### 2. Zainstaluj zależności

```
pip install -r backend/requirements.txt
```

### 3. Skonfiguruj połączenie z bazą

Edytuj plik `backend/.env` i zmień hasło na twoje:

```
DATABASE_URL=postgresql+psycopg2://postgres:TWOJE_HASŁO@localhost:5432/filmyyyyy
```

### 4. Utwórz tabele w bazie danych

```
python -m backend.create_tables
```

### 5. Utwórz przykładowych użytkowników w bazie danych

```
python -m backend.create_users
```
#### utworzy się konto admina:

login: admin

hasło: admin123

#### Konto użytkownika:

login: user

hasło user123

### 5. Uruchom backend

```
uvicorn backend.main:app --reload
```

Backend działa na: `http://localhost:8000`

### 6. Uruchom frontend (w nowym terminalu)

```
python server.py
```

Frontend działa na: `http://localhost:8080`

## Teraz wszystko powinno działać!

Otwórz przeglądarkę i wejdź na `http://localhost:5500`


## 📝 API Dokumentacja

- znajduje się pod adresem: `http://localhost:8000/docs`
## Funkcjonalności Aplikacji

### Zwykły Użytkownik

#### Konto
- **Rejestracja** - Utworzenie nowego konta (username, email, hasło)
- **Logowanie** - Zalogowanie się do systemu (zwraca token JWT)
- **Wylogowanie** - Bezpieczne wylogowanie z aplikacji

#### Przeglądanie
- **Lista filmów** - Przeglądanie wszystkich filmów w bazie
- **Szczegóły filmu** - Wyświetlanie informacji o filmie (tytuł, opis, rok, gatunek, plakat)
- **Lista recenzji** - Przeglądanie wszystkich recenzji dla danego filmu

#### Recenzje
- **Dodawanie recenzji** - Wystawienie oceny (1-10) i napisanie opinii
- **Edycja własnych recenzji** - Zmiana treści lub oceny swojej recenzji
- **Usuwanie własnych recenzji** - Usunięcie swojej recenzji
- **Profil użytkownika** - Przeglądanie wszystkich swoich recenzji

#### Zgłoszenia
- **Zgłaszanie recenzji** - Zgłoszenie nieodpowiedniej recenzji (spam, wulgaryzmy)
- **Ograniczenia**:
  - Nie może edytować/usuwać cudzych recenzji
  - Nie może dodawać filmów
  - Nie ma dostępu do panelu administratora

---

### Administrator

Administrator ma **wszystkie uprawnienia użytkownika** oraz dodatkowo:

#### Panel Administracyjny
- **Dashboard zgłoszeń** - Przeglądanie wszystkich zgłoszeń użytkowników
- **Zarządzanie zgłoszeniami** - Akceptacja/Odrzucenie zgłoszeń
- **Moderacja recenzji** - Usuwanie nieodpowiednich recenzji

#### Zarządzanie treścią
- **Dodawanie filmów** - Dodanie nowych filmów do bazy
- **Edycja filmów** - Zmiana informacji o filmach
- **Usuwanie filmów** - Usunięcie filmu z bazy (wraz z recenzjami)

#### Uprawnienia specjalne
- **Usuwanie dowolnych recenzji** - Bez ograniczeń (nawet cudzych)
- **Wgląd w zgłoszenia** - Pełna historia zgłoszeń
- **Dostęp do endpointów `/reports`** - Specjalne API tylko dla admina

---


## 🗄️ Struktura

```
projektFastapi-main/
│
├── backend/                          # Backend FastAPI
│   ├── .env                          # Zmienne środowiskowe (hasło DB, klucze)
│   ├── __init__.py                   # Inicjalizacja pakietu Python
│   │
│   ├── main.py                       # Główny plik aplikacji FastAPI
│   ├── db.py                         # Konfiguracja połączenia z PostgreSQL
│   ├── models.py                     # Modele SQLAlchemy (User, Movie, Review, Report)
│   ├── schemas.py                    # Schematy Pydantic do walidacji danych
│   │
│   ├── auth.py                       # Endpointy autoryzacji (login, register)
│   ├── auth_utils.py                 # JWT tokeny, hashowanie haseł
│   ├── movies.py                     # Endpointy filmów (CRUD)
│   ├── reviews.py                    # Endpointy recenzji (CRUD)
│   ├── reports.py                    # Endpointy zgłoszeń (admin)
│   │
│   ├── create_tables.py              # Skrypt tworzenia tabel w bazie
│   ├── create_users.py               # Skrypt tworzenia testowych użytkowników
│   └── requirements.txt              # Zależności Python (FastAPI, SQLAlchemy...)
│
├── js/                               # Frontend JavaScript
│   ├── app.js                        # Inicjalizacja aplikacji SPA
│   │
│   ├── components/                   # Komponenty UI wielokrotnego użytku
│   │   ├── modal.js                  # Komponenty modali
│   │   ├── movie-card.js             # Karta filmu
│   │   ├── navbar.js                 # Nawigacja
│   │   ├── review-card.js            # Karta recenzji
│   │   └── toast.js                  # Powiadomienia toast
│   │
│   ├── pages/                        # Logika poszczególnych stron
│   │   ├── admin.js                  # Panel administratora (zgłoszenia)
│   │   ├── auth.js                   #Strona logowania/rejestracji
│   │   ├── home.js                   # Strona główna z listą filmów
│   │   ├── movie-detail.js           # Szczegóły filmu + recenzje
│   │   └── profile.js                # Profil użytkownika
│   │
│   └── utils/                        # Funkcje pomocnicze
│       ├── api.js                    # Komunikacja z API backendu
│       ├── auth.js                   # Zarządzanie tokenem JWT
│       └── router.js                 # Routing SPA (hash-based)
│
├── index.html                        # Główny plik HTML aplikacji
├── spa_server.py                     # Prosty serwer HTTP do frontendu
└── README.md                         # Dokumentacja projektu
```

---

**Autor:** Michał Mionskowski, Adam Preś, Jakub Zawisza | **Na potrzeby:** projektu zaliczeniowego praktyki ZSE 2025
