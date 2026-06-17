/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import knowledgeRoutes from './routes/knowledge.js'
import equipmentRoutes from './routes/equipment.js'
import checklistRoutes from './routes/checklist.js'
import communityRoutes from './routes/community.js'
import simulatorRoutes from './routes/simulator.js'
import exchangeRoutes from './routes/exchange.js'
import { checkSensitiveContent } from './middleware/sensitiveFilter.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/knowledge', knowledgeRoutes)
app.use('/api/equipment', equipmentRoutes)
app.use('/api/checklist', checklistRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/simulator', simulatorRoutes)
app.use('/api/exchange', exchangeRoutes)

/**
 * Sensitive content check endpoint
 */
app.post('/api/sensitive-check', checkSensitiveContent)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
