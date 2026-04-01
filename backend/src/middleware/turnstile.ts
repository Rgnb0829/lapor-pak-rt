import type { Request, Response, NextFunction } from 'express'

const CF_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Validates a Cloudflare Turnstile token against Cloudflare's siteverify API.
 * Expects { token } in req.body.
 * On success, calls next(). On failure, responds with 400.
 */
export async function verifyTurnstile(req: Request, res: Response, next: NextFunction) {
    const { token } = req.body as { token?: string }

    if (!token) {
        res.status(400).json({ error: 'Missing Turnstile token' })
        return
    }

    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
    if (!secret) {
        console.error('[Turnstile] CLOUDFLARE_TURNSTILE_SECRET_KEY is not set')
        res.status(500).json({ error: 'Server misconfiguration' })
        return
    }

    try {
        const formData = new URLSearchParams()
        formData.append('secret', secret)
        formData.append('response', token)
        // Optional: forward user IP for extra verification
        const ip = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress
        if (ip) formData.append('remoteip', String(ip))

        const cfRes = await fetch(CF_VERIFY_URL, {
            method: 'POST',
            body: formData,
        })

        const cfData = (await cfRes.json()) as { success: boolean; 'error-codes'?: string[] }

        if (!cfData.success) {
            res.status(400).json({
                error: 'Turnstile verification failed',
                codes: cfData['error-codes'],
            })
            return
        }

        next()
    } catch (err) {
        console.error('[Turnstile] Verification error:', err)
        res.status(500).json({ error: 'Failed to verify Turnstile token' })
    }
}
