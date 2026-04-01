import type { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../config/supabase'
import type { User } from '@supabase/supabase-js'

// Extend Express Request to carry the authenticated user
declare global {
    namespace Express {
        interface Request {
            authUser?: User
            authProfile?: { role: string; is_verified: boolean }
        }
    }
}

/**
 * Verifies the Bearer JWT from Supabase Auth and attaches the user to req.authUser.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid Authorization header' })
        return
    }

    const token = header.slice(7)
    const { data, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !data.user) {
        res.status(401).json({ error: 'Invalid or expired token' })
        return
    }

    req.authUser = data.user
    next()
}

/**
 * Must be used after requireAuth.
 * Checks that the authenticated user has role === 'admin' in the profiles table.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.authUser) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', req.authUser.id)
        .single()

    if (error || profile?.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden — admin only' })
        return
    }

    next()
}
