
from backend.db import Base, engine
from backend.models import User, Movie, Review, Report

def create_tables():

    print("Tworzenie tabel w bazie danych...")
    
    Base.metadata.create_all(bind=engine)
    
    print("Tabele zostały utworzone pomyślnie!")
    print("\nUtworzono następujące tabele:")
    print("  - users (użytkownicy)")
    print("  - movies (filmy)")
    print("  - reviews (recenzje)")
    print("  - reports (zgłoszenia)")


if __name__ == "__main__":
    create_tables()
