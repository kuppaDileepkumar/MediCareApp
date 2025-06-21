import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./db/database.sqlite')

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    dosage TEXT,
    time TEXT,
    frequency TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`)
})

db.close()
