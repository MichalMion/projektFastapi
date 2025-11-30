import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os
from dotenv import load_dotenv

# Wczytanie konfiguracji
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

def verify_password(plain_password, hashed_password):
    """
    Weryfikuje hasło porównując je z hashem.
    """
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    """
    Hashuje hasło używając bcrypt.
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Tworzy token JWT
    Token zawiera payload (dane użytkownika) i podpis cyfrowy.
    """
    to_encode = data.copy()
    
    # Ustalenie czasu wygaśnięcia tokena
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Dodanie pola expiration do payloadu
    to_encode.update({"exp": expire})
    
    # Zakodowanie tokena przy użyciu sekretnego klucza i wybranego algorytmu
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """
    Dekoduje i weryfikuje token JWT.
    Jeśli podpis jest nieprawidłowy lub token wygasł zwraca None.
    """
    try:
        # Próba dekodowania tokena. Biblioteka jose automatycznie sprawdza
        # Czy podpis zgadza się z SECRET_KEY
        # Czy czas 'exp' nie minął
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
