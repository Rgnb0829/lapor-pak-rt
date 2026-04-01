import { Router } from 'express'
import { verifyTurnstile } from '../middleware/turnstile'

const router = Router()

/**
 * POST /api/auth/verify-turnstile
 * Body: { token: string }
 *
 * Validates the Cloudflare Turnstile token.
 * Frontend calls this before initiating email auth or Google OAuth.
 */


router.post('/verify-turnstile', verifyTurnstile, (_req, res) => {
    res.json({ success: true })
})

export default router
