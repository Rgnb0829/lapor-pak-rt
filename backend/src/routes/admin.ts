import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { supabaseAdmin } from '../config/supabase'

const router = Router()

// All admin routes require auth + admin role
router.use(requireAuth, requireAdmin)

/**
 * GET /api/admin/warga
 * Returns all warga (role=user) with their verification status.
 */
router.get('/warga', async (_req, res) => {
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, nik, phone_number, address_block, is_verified')
        .eq('role', 'user')
        .order('is_verified', { ascending: true })

    if (error) {
        res.status(500).json({ error: error.message })
        return
    }

    res.json({ data })
})

/**
 * PATCH /api/admin/warga/:id/verify
 * Sets is_verified = true for the given warga profile.
 */
router.patch('/warga/:id/verify', async (req, res) => {
    const { id } = req.params

    const { error } = await supabaseAdmin
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', id)
        .eq('role', 'user') // Safety: only update user-role profiles

    if (error) {
        res.status(500).json({ error: error.message })
        return
    }

    res.json({ success: true, message: `Warga ${id} berhasil diverifikasi.` })
})

/**
 * PATCH /api/admin/warga/:id/revoke
 * Sets is_verified = false (revoke verification).
 */
router.patch('/warga/:id/revoke', async (req, res) => {
    const { id } = req.params

    const { error } = await supabaseAdmin
        .from('profiles')
        .update({ is_verified: false })
        .eq('id', id)
        .eq('role', 'user')

    if (error) {
        res.status(500).json({ error: error.message })
        return
    }

    res.json({ success: true, message: `Verifikasi warga ${id} dicabut.` })
})

export default router
