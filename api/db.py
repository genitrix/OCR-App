import os
import sqlite3

DATABASE = 'main.db'

if os.path.exists(DATABASE):
    os.remove(DATABASE)
connection = sqlite3.connect(DATABASE)
cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Record (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    data TEXT NOT NULL
)
""")

connection.commit()
connection.close()
