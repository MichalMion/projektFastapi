from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from backend.db import Base  # Importujemy bazowy model declarative z pliku konfiguracyjnego bazy
import datetime  # Potrzebne do automatycznego ustawiania czasu utworzenia wpisów

# model uzytkownika

class User(Base):
    """
    Reprezentuje tabelę użytkowników w systemie.
    Przechowuje dane logowania oraz status administratora.
    """
    __tablename__ = "users"  # Nazwa tabeli w bazie danych PostgreSQL

    # Podstawowe kolumny
    id = Column(Integer, primary_key=True, index=True)  # Unikalny identyfikator uzytkownika
    username = Column(String(50), unique=True, index=True, nullable=False)  # Nazwa uzytkownika
    email = Column(String(120), unique=True, index=True, nullable=False)  # Adres email
    hashed_password = Column(String, nullable=False)  # Hasło w formie zaszyfrowanej
    
    # Uprawnienia
    is_admin = Column(Boolean, default=False)  # Czy użytkownik jest administratorem

    # Relacje
    # Relacja jeden-do-wielu: Jeden użytkownik może mieć wiele opinii.
    reviews = relationship("Review", back_populates="user")



# model filmy

class Movie(Base):
    """
    Reprezentuje tabelę filmów dodawanych przez administratora.
    """
    __tablename__ = "movies"  # Nazwa tabeli w bazie danych

    # Podstawowe dane filmu
    id = Column(Integer, primary_key=True, index=True)  # Unikalny identyfikator filmu
    title = Column(String(200), nullable=False)  # Tytuł filmu
    description = Column(Text)  # Dłuższy opis fabuły
    release_year = Column(Integer)  # Rok premiery
    poster_url = Column(String(300))  # Link do obrazka/plakatu filmu
    genre = Column(String(100))  # Gatunek filmu (np. Dramat, Komedia)

    # Relacje
    # Relacja jeden-do-wielu: Jeden film może mieć wiele opinii..
    reviews = relationship("Review", back_populates="movie")



# model opini

class Review(Base):
    """
    Reprezentuje opinię/recenzję wystawioną przez użytkownika do filmu.
    Jest to tabela łącząca użytkownika z filmem.
    """
    __tablename__ = "reviews"  # Nazwa tabeli

    id = Column(Integer, primary_key=True, index=True)  # ID opinii

    # Klucze obce
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # ID autora opinii
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=False)  # ID ocenianego

    # Tresc recenzji
    rating = Column(Float, nullable=False)  # Ocena liczbowa (np. 4.5)
    content = Column(Text, nullable=False)  # Tresc tekstowa opinii
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # Data dodania

    # Relacje ORM (Obiektowe)
    # Pozwalają odwoływać się do obiektów zamiast ID (np. review.user.username)
    user = relationship("User", back_populates="reviews")
    movie = relationship("Movie", back_populates="reviews")

    # Właściwości pomocnicze
    # Ułatwiają dostęp do danych w API/szablonach bez zagłębiania się w strukturę
    @property
    def username(self):
        """Zwraca nazwę autora recenzji"""
        return self.user.username

    @property
    def movie_title(self):
        """Zwraca tytuł ocenianego filmu"""
        return self.movie.title



# model zgloszen

class Report(Base):
    """
    System zgłaszania nadużyć (np. wulgarnych opinii).
    Tabela łączy zgłaszającego, zgłoszoną opinię i administratora rozpatrującego sprawę.
    """
    __tablename__ = "reports"  # Nazwa tabeli

    id = Column(Integer, primary_key=True, index=True)  # ID zgłoszenia

    # Klucze obce
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=True)  # Której opinii dotyczy zgłoszenie
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Kto zgłosił
    
    # Dane zgłoszenia
    reason = Column(Text, nullable=False)  # Powód zgłoszenia
    status = Column(String(20), default="pending")  # Status: pending, approved, rejected
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # Data wysłania zgłoszenia

    # Obsługa przez administratora
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # ID administratora, który rozpatrzył zgłoszenie
    reviewed_at = Column(DateTime, nullable=True)  # Data rozpatrzenia zgłoszenia

    # Relacje ORM
    review = relationship("Review")  # Dostęp do obiektu zgłoszonej opinii
    
    # przez 2 klucze obce w tabeli users trzeba wskazac który klucz odpowiada za którą relację
    reporter = relationship("User", foreign_keys=[reporter_id])  # Obiekt użytkownika zgłaszającego
    reviewer = relationship("User", foreign_keys=[reviewed_by])  # Obiekt administratora sprawdzającego

    # Właściwości pomocnicze dla Admin Panelu
    @property
    def reporter_username(self):
        """Zwraca nazwę użytkownika, który wysłał zgłoszenie"""
        return self.reporter.username if self.reporter else "Unknown"
    
    @property
    def review_content(self):
        """Zwraca treść zgłoszonej opinii (bezpiecznie, nawet jak opinia zniknie)"""
        return self.review.content if self.review else "[Opinia usunięta]"
    
    @property
    def review_author(self):
        """Zwraca autora zgłoszonej opinii"""
        return self.review.user.username if self.review and self.review.user else "[Użytkownik usunięty]"
