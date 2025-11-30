from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.db import SessionLocal
from backend.models import User
from backend.schemas import UserCreate, UserOut, Token
from backend.auth_utils import get_password_hash, verify_password, create_access_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
from typing import Optional
from sqlalchemy.exc import IntegrityError

# Tworzymy router dla ścieżek związanych z autoryzacją.
router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Zależność (Dependency) do pobierania sesji bazy danych.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Kluczowa funkcja zabezpieczająca endpointy
# Pobiera token z nagłówka Authorization
# Dekoduje go i wyciąga ID użytkownika
# Sprawdza czy taki użytkownik istnieje w bazie
# Jeśli cokolwiek pójdzie nie tak, rzuca błąd 401
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    from backend.auth_utils import decode_access_token
    
    # Dekodowanie tokena JWT
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Pobranie ID użytkownika z payloadu
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Pobranie użytkownika z bazy
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
        
    return user

# Endpoint rejestracji nowego użytkownika.
@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Haszowanie hasła przed zapisem
    hashed_password = get_password_hash(user.password)
    
    # Przygotowanie obiektu modelu
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    
    try:
        # Próba zapisu do bazy
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        # Obsługa błędu unikalności np. taki email już istnieje
        db.rollback()
        raise HTTPException(status_code=400, detail="Username or email already registered")
        
    return db_user

# Endpoint logowania
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Szukamy użytkownika po nazwie
    user = db.query(User).filter(User.username == form_data.username).first()
    
    # Weryfikacja czy użytkownik istnieje oraz czy hasło pasuje do hasza
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    # Generowanie tokena JWT z ID użytkownika jako sub
    access_token = create_access_token({"sub": str(user.id)})
    
    # Zwracamy token i obiekt użytkownika
    return {"access_token": access_token, "token_type": "bearer", "user": user}

# Endpoint testowy Kto jestem?.
# Zwraca dane aktualnie zalogowanego użytkownika.
@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
