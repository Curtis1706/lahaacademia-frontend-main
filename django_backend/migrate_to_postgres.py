import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

import sqlite3
import psycopg2
from psycopg2.extras import execute_values

# Connexion SQLite
sqlite_conn = sqlite3.connect('db.sqlite3')
sqlite_cursor = sqlite_conn.cursor()

# Connexion PostgreSQL
pg_conn = psycopg2.connect(
    dbname='lahaacademia_db',
    user='lahaacademia_user',
    password='123456',
    host='localhost',
    port='5432'
)
pg_cursor = pg_conn.cursor()

# Obtenir toutes les tables
sqlite_cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = sqlite_cursor.fetchall()

for table in tables:
    table_name = table[0]
    if table_name.startswith('sqlite_') or table_name.startswith('django_'):
        continue  # Ignorer les tables système

    print(f"Migration de {table_name}...")

    # Obtenir les données
    sqlite_cursor.execute(f"SELECT * FROM {table_name}")
    rows = sqlite_cursor.fetchall()

    if rows:
        # Obtenir les colonnes
        sqlite_cursor.execute(f"PRAGMA table_info({table_name})")
        columns = [col[1] for col in sqlite_cursor.fetchall()]
        columns_str = ', '.join(columns)
        placeholders = ', '.join(['%s'] * len(columns))

        # Insérer dans PostgreSQL
        pg_cursor.executemany(f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders})", rows)

pg_conn.commit()
sqlite_conn.close()
pg_conn.close()
print("Migration terminée.")