import sqlite3 from 'sqlite3'
import jwt from 'jsonwebtoken'
import { hashPassword, comparePassword } from '../utils/hash.js'

const db = new sqlite3.Database('./db/database.sqlite')
const SECRET = 'your_secret_key'

export const register = (req, res) => {
  const { username, password } = req.body

  hashPassword(password).then((hashedPassword) => {
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
      if (err) return res.status(400).json({ error: 'User already exists' })

      const token = jwt.sign({ id: this.lastID }, SECRET, { expiresIn: '1d' })
      res.json({ token })
    })
  })
}

export const login = (req, res) => {
  const { username, password } = req.body

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' })

    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1d' })
    res.json({ token })
  })
}
