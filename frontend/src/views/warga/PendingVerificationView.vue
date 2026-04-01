<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
    <div class="card max-w-md w-full p-8 text-center">
      <!-- Animated clock icon -->
      <div class="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-5">
        <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 class="text-2xl font-bold text-slate-900 mb-2">Akun Menunggu Verifikasi</h1>
      <p class="text-slate-500 text-sm leading-relaxed mb-6">
        Pendaftaran kamu sudah berhasil. Pengurus RT sedang memverifikasi data kamu.
        Proses ini biasanya selesai dalam <strong class="text-slate-700">1×24 jam</strong>.
        Kamu akan mendapat notifikasi setelah akun diaktifkan.
      </p>

      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left space-y-2">
        <p class="text-sm font-semibold text-amber-800">Informasi akun kamu:</p>
        <p class="text-sm text-amber-700">
          📧 <span class="font-medium">{{ authStore.user?.email }}</span>
        </p>
        <p class="text-sm text-amber-700">
          👤 <span class="font-medium">{{ authStore.profile?.full_name }}</span>
        </p>
      </div>

      <button @click="handleRefresh" :disabled="refreshing" class="btn-primary mb-3">
        <svg v-if="refreshing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Cek Status Verifikasi
      </button>

      <button @click="authStore.signOut().then(() => router.push('/auth'))"
        class="w-full text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors py-2">
        Keluar dari Akun
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const refreshing = ref(false)

async function handleRefresh() {
  refreshing.value = true
  if (authStore.user) await authStore.fetchProfile(authStore.user.id)
  await new Promise(r => setTimeout(r, 600))
  refreshing.value = false
  if (authStore.isVerified) router.push('/warga/home')
}
</script>
