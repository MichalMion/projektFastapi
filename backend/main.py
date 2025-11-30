from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importujemy routery z poszczególnych modułów
from backend.auth import router as auth_router
from backend.movies import router as movies_router
from backend.reviews import router as reviews_router
from backend.reports import router as reports_router

app = FastAPI()


# konfiguracje cors (Cross-Origin Resource Sharing)

app.add_middleware(
    CORSMiddleware,
    # allow_origins określa, kto może pytać nasze API. 
    allow_origins=["*"],
    
    # Pozwala na przesyłanie poświadczeń (cookies, nagłówki autoryzacyjne)
    allow_credentials=True,
    
    # Określa, jakie metody HTTP są dozwolone
    allow_methods=["*"],
    
    # Określa, jakie nagłówki mogą być przesyłane w zapytaniu
    allow_headers=["*"],
)


# rejestracja endpointow

app.include_router(auth_router)     # Ścieżki związane z logowaniem i rejestracją
app.include_router(movies_router)   # Ścieżki do zarządzania filmami (CRUD filmów)
app.include_router(reviews_router)  # Ścieżki do dodawania i czytania opinii
app.include_router(reports_router)  # Ścieżki dla admina do obsługi zgłoszeń


# testowy endpoint

@app.get("/")
def root():
    """
    Podstawowy endpoint, który pozwala szybko sprawdzić, czy API wstało.
    Dostępny pod adresem głównym (np. http://localhost:8000/).
    """
    return {"message": "Filmy API"}
