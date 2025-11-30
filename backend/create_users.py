from .db import SessionLocal
from .models import User
from .auth_utils import get_password_hash

# Funkcja pomocnicza, którą wywołujemy, żeby dodać pojedynczego użytkownika do bazy i czy ktos ma byc adminem
def create_user(username, email, password, is_admin=False):
    
    db = SessionLocal()
    
    print(f"Tworzę konto użytkownika: {username} (admin: {is_admin})")
    
    # Tworzymy obiekt użytkownika
    user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash(password),
        is_admin=is_admin
    )
    
    # zapis w sqlalchemy
    db.add(user)      
    db.commit()      
    db.refresh(user)  
    
    # Zamkniecie sesji
    db.close()
    print(f"Utworzono użytkownika: {username} (admin: {is_admin})")

# Ten blok wykona się tylko wtedy, gdy uruchomimy plik bezpośrednio (np. python init_db.py).
# Nie wykona się, jeśli ten plik zostanie zaimportowany gdzieś indziej.
if __name__ == "__main__":
    print("Tworzę konto użytkownika...")
    # Tworzenie uzytkownika do testu
    create_user("user", "user@example.com", "user123", is_admin=False)
    
    print("Tworzę konto administratora...")
    # Tworzenie administratora
    create_user("admin", "admin@example.com", "admin123", is_admin=True)
    
    print("Utworzono konto użytkownika i administratora.")