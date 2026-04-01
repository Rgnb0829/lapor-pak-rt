<template>
  <div class="min-h-screen flex">
    <!-- ── Left Panel (Branding) ───────────────────────────── -->
    <div
      class="hidden lg:flex lg:w-[45%] bg-rt-gradient relative overflow-hidden flex-col items-center justify-center p-12"
    >
      <!-- Decorative blobs -->
      <div
        class="absolute top-0 left-0 w-72 h-72 bg-primary-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"
      />
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"
      />

      <!-- Logo + tagline -->
      <div class="relative z-10 text-center">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-2xl border border-primary-500/30 mb-6 backdrop-blur-sm"
        >
          <!-- House icon -->
          <svg
            class="w-11 h-11 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-white mb-1">Portal Warga</h1>
        <p class="text-primary-300 font-medium text-lg">RT Rukun Mandiri</p>
        <p class="text-slate-400 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
          Sistem Informasi & Layanan Mandiri Warga Berbasis Digital
        </p>

        <!-- Feature bullets -->
        <div class="mt-10 space-y-3 text-left">
          <div
            v-for="feat in features"
            :key="feat"
            class="flex items-center gap-3 text-slate-300"
          >
            <span
              class="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-3 h-3 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span class="text-sm">{{ feat }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Right Panel (Form) ──────────────────────────────── -->
    <div class="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
      <div class="w-full max-w-md">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3"
          >
            <svg
              class="w-8 h-8 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h1 class="text-xl font-bold text-slate-900">Portal Warga RT</h1>
        </div>

        <!-- ── Card ─────────────────────────────────────────── -->
        <div class="card p-8">
          <!-- Tabs -->
          <div class="flex rounded-xl bg-slate-100 p-1 mb-7">
            <button
              id="tab-masuk"
              @click="mode = 'login'"
              :class="[
                'flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                mode === 'login' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700',
              ]"
            >
              Masuk
            </button>
            <button
              id="tab-daftar"
              @click="mode = 'register'"
              :class="[
                'flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                mode === 'register' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700',
              ]"
            >
              Daftar
            </button>
          </div>

          <!-- Error alert -->
          <div
            v-if="errorMsg"
            class="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2"
          >
            <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            {{ errorMsg }}
          </div>

          <!-- Form -->
          <form @submit.prevent="handleEmailAuth" class="space-y-4">
            <!-- Full name – register only -->
            <div v-if="mode === 'register'">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                id="full-name"
                v-model="form.fullName"
                type="text"
                placeholder="Masukkan nama lengkap"
                class="input-field"
                required
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="contoh@email.com"
                class="input-field"
                required
              />
            </div>

            <!-- Password -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-sm font-medium text-slate-700">Password</label>
                <a
                  v-if="mode === 'login'"
                  href="#"
                  class="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Lupa password?
                </a>
              </div>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Min. 8 karakter"
                  class="input-field pr-11"
                  required
                  minlength="8"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabindex="-1"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit -->
            <button
              id="btn-submit"
              type="submit"
              :disabled="!turnstileToken || submitting"
              class="btn-primary mt-2"
            >
              <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ submitting ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat Akun' }}
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white px-3 text-slate-400 font-medium tracking-wider">Atau</span>
            </div>
          </div>

          <!-- Google button -->
          <button
            id="btn-google"
            @click="handleGoogleAuth"
            :disabled="!turnstileToken || submitting"
            class="btn-google"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Lanjutkan dengan Google
          </button>

          <!-- Turnstile widget -->
          <div class="mt-5 flex flex-col items-center gap-2">
            <TurnstileWidget
              :sitekey="turnstileSiteKey"
              theme="light"
              @verified="onVerified"
              @expired="onExpired"
              @error="onExpired"
            />
            <p v-if="!turnstileToken" class="text-xs text-slate-400 text-center">
              Selesaikan verifikasi di atas untuk mengaktifkan tombol
            </p>
          </div>

          <!-- Footer -->
          <p class="mt-6 text-center text-xs text-slate-500">
            Butuh bantuan?
            <a href="mailto:rt@example.com" class="text-primary-600 hover:underline font-medium">
              Hubungi Pengurus RT
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import TurnstileWidget from '@/components/TurnstileWidget.vue'

const router = useRouter()
const authStore = useAuthStore()

const mode = ref<'login' | 'register'>('login')
const submitting = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)
// In DEV mode, auto-set token so the button is immediately clickable.
// Cloudflare test secret (1x000...AA) accepts any token value.
const isDev = import.meta.env.DEV
const turnstileToken = ref<string | null>(isDev ? 'dev-bypass' : null)
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

const form = reactive({ fullName: '', email: '', password: '' })

const features = [
  'Pengumuman & Informasi Warga',
  'Permohonan Surat Keterangan',
  'Profil & Data Kependudukan',
  'Verifikasi Digital oleh Pengurus RT',
]

// ── Turnstile callbacks ────────────────────────────────────
function onVerified(token: string) {
  turnstileToken.value = token
}
function onExpired() {
  turnstileToken.value = null
}

// ── Validate Turnstile with backend ───────────────────────
async function verifyTurnstile(): Promise<boolean> {
  // In DEV mode, skip backend check (test secret accepts any token)
  if (isDev) return true
  try {
    const res = await fetch('/api/auth/verify-turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: turnstileToken.value }),
    })
    const data = await res.json()
    return data.success === true
  } catch {
    return false
  }
}

// ── Email / Password auth ──────────────────────────────────
async function handleEmailAuth() {
  if (!turnstileToken.value) return
  errorMsg.value = ''
  submitting.value = true

  try {
    // Backend Turnstile validation
    const valid = await verifyTurnstile()
    if (!valid) {
      errorMsg.value = 'Verifikasi keamanan gagal. Coba lagi.'
      return
    }

    if (mode.value === 'register') {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName },
        },
      })
      if (error) throw error
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) throw error
    }

    // Give auth store time to update then navigate
    await authStore.initialize()
    await router.push(resolveHome())
  } catch (err: any) {
    errorMsg.value = mapError(err.message)
  } finally {
    submitting.value = false
    turnstileToken.value = null // Reset after each attempt
  }
}

// ── Google OAuth ───────────────────────────────────────────
async function handleGoogleAuth() {
  if (!turnstileToken.value) return
  errorMsg.value = ''
  submitting.value = true

  // Turnstile check (UI gate) – validate then initiate OAuth
  const valid = await verifyTurnstile()
  if (!valid) {
    errorMsg.value = 'Verifikasi keamanan gagal. Coba lagi.'
    submitting.value = false
    return
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth`,
    },
  })

  if (error) {
    errorMsg.value = mapError(error.message)
    submitting.value = false
  }
  // On success Supabase redirects to Google — page will reload
}

// ── Helpers ────────────────────────────────────────────────
function resolveHome() {
  if (authStore.isAdmin) return '/admin/dashboard'
  if (authStore.needsOnboarding) return '/warga/onboarding'
  if (!authStore.isVerified) return '/warga/pending-verification'
  return '/warga/home'
}

function mapError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email atau password salah.'
  if (msg.includes('Email not confirmed')) return 'Silakan konfirmasi email Anda terlebih dahulu.'
  if (msg.includes('User already registered')) return 'Email sudah terdaftar. Silakan masuk.'
  return msg
}
</script>
