import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(morgan('dev'))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Neural Network Builder API v1',
    version: '2.0.0',
    endpoints: {
      models: '/api/v1/models',
      datasets: '/api/v1/datasets',
      templates: '/api/v1/templates',
      training: '/api/v1/training',
    },
  })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// Error Handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error', message: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 Neural Network Builder API running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API docs: http://localhost:${PORT}/api/v1`)
})
