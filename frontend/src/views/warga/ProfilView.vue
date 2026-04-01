<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Profil Saya</h1>
      <p class="text-sm text-slate-500 mt-0.5">Kelola data diri dan informasi akun Anda</p>
    </div>

    <!-- Status badge -->
    <div class="card p-5 flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl flex-shrink-0">
        {{ initials }}
      </div>
      <div class="min-w-0">
        <p class="font-bold text-slate-900 text-base">{{ authStore.profile?.full_name }}</p>
        <p class="text-sm text-slate-500">{{ authStore.user?.email }}</p>
        <span class="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
          :class="authStore.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
          {{ authStore.isVerified ? '✓ Terverifikasi' : '⏳ Menunggu Verifikasi' }}
        </span>
      </div>
    </div>

    <!-- Edit form -->
    <div class="card p-6 space-y-4">
      <h2 class="font-semibold text-slate-800">Data Diri</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
          <input v-model="form.full_name" type="text" class="input-field" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">NIK</label>
          <input v-model="form.nik" type="text" maxlength="16" class="input-field" placeholder="16 digit NIK" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nomor HP</label>
          <input v-model="form.phone_number" type="tel" class="input-field" placeholder="08xx-xxxx-xxxx" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Blok Rumah</label>
          <input v-model="form.address_block" type="text" class="input-field" placeholder="Contoh: A1, B3" />
        </div>
      </div>

      <!-- Success/error msg -->
      <div v-if="successMsg" class="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ successMsg }}
      </div>
      <div v-if="errorMsg" class="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{{ errorMsg }}</div>

      <div class="flex justify-end pt-1">
        <button @click="saveProfile" :disabled="saving"
          class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2">
          <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const form = ref({
  full_name: '',
  nik: '',
  phone_number: '',
  address_block: '',
})

const initials = computed(() => {
  const name = authStore.profile?.full_name ?? ''
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
})

onMounted(() => {
  const p = authStore.profile
  if (p) {
    form.value = {
      full_name:     p.full_name ?? '',
      nik:           p.nik ?? '',
      phone_number:  p.phone_number ?? '',
      address_block: p.address_block ?? '',
    }
  }
})

async function saveProfile() {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const token = authStore.session?.access_token
    const res = await fetch('/api/warga/profil', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (res.ok) {
      successMsg.value = 'Profil berhasil diperbarui!'
      await authStore.fetchProfile(authStore.user!.id)
      setTimeout(() => successMsg.value = '', 3000)
    } else {
      const err = await res.json().catch(() => ({}))
      errorMsg.value = err.error ?? 'Gagal menyimpan perubahan.'
    }
  } catch {
    errorMsg.value = 'Gagal terhubung ke server.'
  } finally {
    saving.value = false
  }
}
</script>
