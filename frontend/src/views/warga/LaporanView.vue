<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Laporan & Pengaduan</h1>
        <p class="text-sm text-slate-500 mt-0.5">Sampaikan laporan atau pengaduan kepada pengurus RT</p>
      </div>
      <button @click="showForm = !showForm"
        class="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Buat Laporan
      </button>
    </div>

    <!-- Form buat laporan -->
    <div v-if="showForm" class="card p-6 space-y-4">
      <h2 class="font-semibold text-slate-800">Laporan Baru</h2>

      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Judul Laporan</label>
        <input v-model="form.judul" type="text" placeholder="Contoh: Lampu jalan mati di blok A"
          class="input-field" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
        <select v-model="form.kategori" class="input-field">
          <option value="">Pilih kategori</option>
          <option value="infrastruktur">Infrastruktur</option>
          <option value="keamanan">Keamanan</option>
          <option value="kebersihan">Kebersihan</option>
          <option value="kebisingan">Kebisingan</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi</label>
        <textarea v-model="form.deskripsi" rows="4"
          placeholder="Jelaskan laporan Anda dengan detail..."
          class="input-field resize-none" />
      </div>

      <div class="flex gap-3 justify-end pt-1">
        <button @click="showForm = false"
          class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
          Batal
        </button>
        <button @click="submitLaporan" :disabled="submitting || !form.judul || !form.kategori || !form.deskripsi"
          class="px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2">
          <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ submitting ? 'Mengirim...' : 'Kirim Laporan' }}
        </button>
      </div>
    </div>

    <!-- Riwayat Laporan -->
    <div class="card overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100">
        <h2 class="font-semibold text-slate-800">Riwayat Laporan</h2>
      </div>

      <div v-if="loading" class="flex justify-center py-16">
        <svg class="w-6 h-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>

      <div v-else-if="laporan.length === 0" class="flex flex-col items-center py-16 text-slate-400">
        <svg class="w-12 h-12 mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <p class="text-sm">Belum ada laporan. Klik "Buat Laporan" untuk memulai.</p>
      </div>

      <div v-else class="divide-y divide-slate-100">
        <div v-for="item in laporan" :key="item.id" class="px-6 py-4 hover:bg-slate-50 transition-colors">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="font-semibold text-slate-800 text-sm truncate">{{ item.judul }}</p>
              <p class="text-xs text-slate-500 mt-0.5 line-clamp-2">{{ item.deskripsi }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">
                  {{ item.kategori }}
                </span>
                <span class="text-xs text-slate-400">{{ formatDate(item.created_at) }}</span>
              </div>
            </div>
            <span :class="statusClass(item.status)"
              class="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0">
              {{ statusLabel(item.status) }}
            </span>
          </div>
          <p v-if="item.catatan_admin" class="mt-3 text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-100">
            💬 <span class="font-medium">Catatan admin:</span> {{ item.catatan_admin }}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Laporan {
  id: string
  judul: string
  deskripsi: string
  kategori: string
  status: 'menunggu' | 'diproses' | 'selesai' | 'ditolak'
  catatan_admin: string | null
  created_at: string
}

const authStore = useAuthStore()
const loading = ref(false)
const submitting = ref(false)
const showForm = ref(false)
const laporan = ref<Laporan[]>([])

const form = ref({ judul: '', kategori: '', deskripsi: '' })

onMounted(loadLaporan)

async function loadLaporan() {
  loading.value = true
  try {
    const token = authStore.session?.access_token
    const res = await fetch('/api/warga/laporan', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const { data } = await res.json()
      laporan.value = data ?? []
    }
  } finally {
    loading.value = false
  }
}

async function submitLaporan() {
  submitting.value = true
  try {
    const token = authStore.session?.access_token
    const res = await fetch('/api/warga/laporan', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (res.ok) {
      form.value = { judul: '', kategori: '', deskripsi: '' }
      showForm.value = false
      await loadLaporan()
    }
  } finally {
    submitting.value = false
  }
}

function statusLabel(s: string) {
  return { menunggu: '⏳ Menunggu', diproses: '🔄 Diproses', selesai: '✅ Selesai', ditolak: '❌ Ditolak' }[s] ?? s
}

function statusClass(s: string) {
  return {
    menunggu: 'bg-amber-100 text-amber-700',
    diproses: 'bg-blue-100 text-blue-700',
    selesai: 'bg-green-100 text-green-700',
    ditolak: 'bg-red-100 text-red-700',
  }[s] ?? 'bg-slate-100 text-slate-600'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
