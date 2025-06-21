import jwt from 'jsonwebtoken'

const SECRET = 'your_secret_key'

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
