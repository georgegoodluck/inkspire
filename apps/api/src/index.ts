import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { requireAuth, requireRole } from './middleware/auth'
import type { AuthRequest } from './middleware/auth'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors({
  origin: process.env.WEB_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'inkspire-api', timestamp: new Date().toISOString() })
})

// Protected test route
app.get('/api/me', requireAuth, (req: AuthRequest, res) => {
  res.json({ user: req.user })
})

// Admin only test route
app.get('/api/admin', requireAuth, requireRole('ADMIN'), (req: AuthRequest, res) => {
  res.json({ message: 'Welcome admin', user: req.user })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 InkSpire API running on port ${PORT}`)
})

export default app