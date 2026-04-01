<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
    <div class="card max-w-lg w-full p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
          <svg class="w-9 h-9 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 mb-1">Lengkapi Profil Kamu</h1>
        <p class="text-slate-500 text-sm">
          Isi data kependudukan untuk melanjutkan proses verifikasi.
        </p>
      </div>

      <!-- Info banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-7 text-sm text-blue-700">
        💡 Data ini diperlukan oleh Pengurus RT untuk memverifikasi kamu sebagai warga.
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Full name (pre-filled, editable) -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
          <input v-model="form.fullName" type="text" class="input-field" required placeholder="Nama sesuai KTP" />
        </div>

        <!-- NIK -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">NIK (Nomor Induk Kependudukan)</label>
          <input v-model="form.nik" type="text" class="input-field" required
            placeholder="16 digit NIK sesuai KTP" maxlength="16" minlength="16"
            pattern="\d{16}" inputmode="numeric" />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">No. HP / WhatsApp</label>
          <input v-model="form.phone" type="tel" class="input-field" required
            placeholder="Contoh: 08123456789" />
        </div>

        <!-- Address block -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Blok / No. Rumah</label>
          <input v-model="form.block" type="text" class="input-field" required
            placeholder="Contoh: B-12" />
        </div>

        <button type="submit" :disabled="submitting" class="btn-primary mt-2">
          <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ submitting ? 'Menyimpan...' : 'Simpan & Lanjutkan' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabase'

const router = useRouter()
const authStore = useAuthStore()

const submitting = ref(false)
const errorMsg = ref('')
const form = reactive({ fullName: '', nik: '', phone: '', block: '' })

onMounted(() => {
  // Pre-fill name from OAuth provider data
  form.fullName = authStore.profile?.full_name ?? authStore.user?.user_metadata?.full_name ?? ''
})

async function handleSubmit() {
  if (!authStore.user) return
  errorMsg.value = ''
  submitting.value = true

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.fullName,
        nik: form.nik,
        phone_number: form.phone,
        address_block: form.block,
      })
      .eq('id', authStore.user.id)

    if (error) throw error

    await authStore.fetchProfile(authStore.user.id)
    router.push('/warga/pending-verification')
  } catch (err: any) {
    errorMsg.value = err.message ?? 'Gagal menyimpan. Coba lagi.'
  } finally {
    submitting.value = false
  }
}
</script>
