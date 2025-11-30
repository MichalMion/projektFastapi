from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

from dotenv import load_dotenv

# Ładujemy zmienne z pliku .env, żeby nie trzymać haseł na wierzchu w kodzie
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

DATABASE_URL = os.getenv("DATABASE_URL")

from sqlalchemy import create_engine

# Tworzymy silnik bazy danych. 
engine = create_engine(DATABASE_URL, echo=True, future=True)

# To jest fabryka sesji - będziemy jej używać w każdym endpoincie do komunikacji z bazą.
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Klasa bazowa dla wszystkich naszych modeli (tabel). 
Base = declarative_base()
