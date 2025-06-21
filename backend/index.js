import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import medicationRoutes from './routes/medications.js'
import medsRoutes from './routes/medications.js'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/medications', medicationRoutes)
app.use('/api/medications', medsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
