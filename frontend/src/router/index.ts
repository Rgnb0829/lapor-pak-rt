import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/auth' },

        {
            path: '/auth',
            name: 'auth',
            component: () => import('@/views/auth/AuthView.vue'),
            meta: { requiresGuest: true },
        },

        // ── Warga section ─────────────────────────────────────
        {
            path: '/warga',
            component: () => import('@/components/layout/AppLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', redirect: '/warga/home' },
                {
                    path: 'home',
                    name: 'warga-home',
                    component: () => import('@/views/warga/HomeView.vue'),
                },
                {
                    path: 'pending-verification',
                    name: 'warga-pending',
                    component: () => import('@/views/warga/PendingVerificationView.vue'),
                },
                {
                    path: 'onboarding',
                    name: 'warga-onboarding',
                    component: () => import('@/views/warga/OnboardingView.vue'),
                },
                {
                    path: 'laporan',
                    name: 'warga-laporan',
                    component: () => import('@/views/warga/LaporanView.vue'),
                },
                {
                    path: 'surat',
                    name: 'warga-surat',
                    component: () => import('@/views/warga/SuratView.vue'),
                },
                {
                    path: 'profil',
                    name: 'warga-profil',
                    component: () => import('@/views/warga/ProfilView.vue'),
                },
            ],
        },

        // ── Admin section ──────────────────────────────────────
        {
            path: '/admin',
            component: () => import('@/components/layout/AppLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', redirect: '/admin/dashboard' },
                {
                    path: 'dashboard',
                    name: 'admin-dashboard',
                    component: () => import('@/views/admin/DashboardView.vue'),
                },
                {
                    path: 'pengumuman',
                    name: 'admin-pengumuman',
                    component: () => import('@/views/admin/PengumumanView.vue'),
                },
                {
                    path: 'laporan',
                    name: 'admin-laporan',
                    component: () => import('@/views/admin/LaporanView.vue'),
                },
                {
                    path: 'surat',
                    name: 'admin-surat',
                    component: () => import('@/views/admin/SuratView.vue'),
                },
            ],
        },

        { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
})

// ── Navigation Guard ───────────────────────────────────────
router.beforeEach(async (to) => {
    const auth = useAuthStore()

    // Wait for auth init on first load
    if (!auth.initialized) {
        await auth.initialize()
    }

    const { isLoggedIn, isAdmin, isVerified, needsOnboarding } = auth

    // 1. Logged-in user hitting guest-only page → redirect home
    if (to.meta.requiresGuest && isLoggedIn) return resolveHome(auth)

    // 2. Guest hitting protected page → login
    if (to.meta.requiresAuth && !isLoggedIn) return { name: 'auth' }

    if (isLoggedIn) {
        // 3. Admin must stay in /admin
        if (isAdmin && to.path.startsWith('/warga')) return { name: 'admin-dashboard' }

        // 4. Warga must stay in /warga
        if (!isAdmin && to.path.startsWith('/admin')) return { name: 'warga-home' }

        // 5. Warga needs onboarding first (Google signup, missing NIK)
        if (!isAdmin && needsOnboarding && to.name !== 'warga-onboarding')
            return { name: 'warga-onboarding' }

        // 6. Not verified → pending page
        if (!isAdmin && !needsOnboarding && !isVerified && to.name === 'warga-home')
            return { name: 'warga-pending' }

        // 7. Verified → don't show pending page
        if (!isAdmin && !needsOnboarding && isVerified && to.name === 'warga-pending')
            return { name: 'warga-home' }
    }
})

function resolveHome(auth: ReturnType<typeof useAuthStore>) {
    if (auth.isAdmin) return { name: 'admin-dashboard' }
    if (auth.needsOnboarding) return { name: 'warga-onboarding' }
    if (!auth.isVerified) return { name: 'warga-pending' }
    return { name: 'warga-home' }
}

export default router
