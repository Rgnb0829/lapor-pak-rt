import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import routes from './routes'

const app = express()
const PORT = process.env.PORT ?? 3000

// ── Security middleware ────────────────────────────────────
app.use(helmet())
app.use(
    cors({
        origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
        credentials: true,
    }),
)
app.use(express.json())

// ── Routes ─────────────────────────────────────────────────
app.use('/api', routes)

// ── Health check ───────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// ── 404 ────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))

app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`)
})

export default app
