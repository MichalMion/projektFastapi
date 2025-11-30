import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

# Wczytanie konfiguracji z pliku .env
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
DATABASE_URL = os.getenv('DATABASE_URL')

# Połączenie z bazą
engine = create_engine(DATABASE_URL)

# Inspektor służy do pobierania metadanych bazy (np. listy tabel)
inspector = inspect(engine)

# Pobranie nazw wszystkich tabel
tables = inspector.get_table_names()

print('Tabele w bazie danych:')
for table in tables:
    print(f'- {table}')

# Weryfikacja czy kluczowa tabela została utworzona
if 'users' in tables:
    print('\nTabela users istnieje.')
else:
    print('\nTabela users NIE istnieje.')