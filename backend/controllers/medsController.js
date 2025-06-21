import sqlite3 from 'sqlite3'
const db = new sqlite3.Database('./db/database.sqlite')

export const getMedications = (req, res) => {
  db.all('SELECT * FROM medications WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
}

export const addMedication = (req, res) => {
  const { name, dosage, time } = req.body
  db.run(
    'INSERT INTO medications (user_id, name, dosage, time) VALUES (?, ?, ?, ?)',
    [req.user.id, name, dosage, time],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ id: this.lastID, name, dosage, time })
    }
  )
}

export const deleteMedication = (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM medications WHERE id = ? AND user_id = ?', [id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ success: true })
  })
}

export const updateMedication = (req, res) => {
  const { id } = req.params
  const { name, dosage, frequency } = req.body

  const query = `
    UPDATE medications 
    SET name = ?, dosage = ?, frequency = ? 
    WHERE id = ? AND user_id = ?
  `

  db.run(query, [name, dosage, frequency, id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: 'Medication updated', changes: this.changes })
  })
}
