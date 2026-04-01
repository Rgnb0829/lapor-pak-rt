import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface Profile {
    id: string
    full_name: string
    nik: string | null
    phone_number: string | null
    address_block: string | null
    role: 'admin' | 'user'
    is_verified: boolean
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const session = ref<Session | null>(null)
    const profile = ref<Profile | null>(null)
    const loading = ref(false)
    const initialized = ref(false)

    const isAdmin = computed(() => profile.value?.role === 'admin')
    const isVerified = computed(() => profile.value?.is_verified === true)
    const isLoggedIn = computed(() => !!user.value)
    const needsOnboarding = computed(
        () => isLoggedIn.value && !isAdmin.value && !profile.value?.nik,
    )

    async function fetchProfile(userId: string): Promise<void> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) {
            console.error('[Auth] Failed to fetch profile:', error.message)
            return
        }
        profile.value = data as Profile
    }

    async function initialize(): Promise<void> {
        if (initialized.value) return
        loading.value = true

        try {
            const {
                data: { session: currentSession },
            } = await supabase.auth.getSession()

            session.value = currentSession
            user.value = currentSession?.user ?? null

            if (user.value) {
                await fetchProfile(user.value.id)
            }
        } finally {
            loading.value = false
            initialized.value = true
        }

        supabase.auth.onAuthStateChange(async (event, newSession) => {
            session.value = newSession
            user.value = newSession?.user ?? null

            if (user.value) {
                await fetchProfile(user.value.id)
            } else {
                profile.value = null
            }
        })
    }

    async function signOut(): Promise<void> {
        await supabase.auth.signOut()
        user.value = null
        session.value = null
        profile.value = null
    }

    return {
        user,
        session,
        profile,
        loading,
        initialized,
        isAdmin,
        isVerified,
        isLoggedIn,
        needsOnboarding,
        fetchProfile,
        initialize,
        signOut,
    }
})
