<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Permohonan Surat</h1>
        <p class="text-sm text-slate-500 mt-0.5">Ajukan surat keterangan dari pengurus RT</p>
      </div>
      <button @click="showForm = !showForm"
        class="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajukan Surat
      </button>
    </div>

    <!-- Form permohonan surat -->
    <div v-if="showForm" class="card p-6 space-y-4">
      <h2 class="font-semibold text-slate-800">Permohonan Baru</h2>

      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jenis Surat</label>
        <select v-model="form.jenis" class="input-field">
          <option value="">Pilih jenis surat</option>
          <option value="domisili">Surat Keterangan Domisili</option>
          <option value="tidak_mampu">Surat Keterangan Tidak Mampu</option>
          <option value="usaha">Surat Keterangan Usaha</option>
          <option value="kelahiran">Surat Pengantar Kelahiran</option>
          <option value="kematian">Surat Pengantar Kematian</option>
          <option value="pindah">Surat Pengantar Pindah</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Keperluan / Tujuan</label>
        <textarea v-model="form.keperluan" rows="3"
          placeholder="Jelaskan keperluan surat ini..."
          class="input-field resize-none" />
      </div>

      <div class="flex gap-3 justify-end pt-1">
        <button @click="showForm = false"
          class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          Batal
        </button>
        <button @click="submitSurat" :disabled="submitting || !form.jenis || !form.keperluan"
          class="px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2">
          <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ submitting ? 'Mengirim...' : 'Kirim Permohonan' }}
        </button>
      </div>
    </div>

    <!-- Riwayat -->
    <div class="card overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100">
        <h2 class="font-semibold text-slate-800">Riwayat Permohonan</h2>
      </div>

      <div v-if="loading" class="flex justify-center py-16">
        <svg class="w-6 h-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>

      <div v-else-if="suratList.length === 0" class="flex flex-col items-center py-16 text-slate-400">
        <svg class="w-12 h-12 mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm">Belum ada permohonan surat.</p>
      </div>

      <div v-else class="divide-y divide-slate-100">
        <div v-for="item in suratList" :key="item.id" class="px-6 py-4 hover:bg-slate-50 transition-colors">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="font-semibold text-slate-800 text-sm">{{ jenisLabel(item.jenis) }}</p>
              <p class="text-xs text-slate-500 mt-0.5 line-clamp-2">{{ item.keperluan }}</p>
              <p class="text-xs text-slate-400 mt-1.5">{{ formatDate(item.created_at) }}</p>
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

interface Surat {
  id: string
  jenis: string
  keperluan: string
  status: 'menunggu' | 'diproses' | 'selesai' | 'ditolak'
  catatan_admin: string | null
  created_at: string
}

const authStore = useAuthStore()
const loading = ref(false)
const submitting = ref(false)
const showForm = ref(false)
const suratList = ref<Surat[]>([])
const form = ref({ jenis: '', keperluan: '' })

onMounted(loadSurat)

async function loadSurat() {
  loading.value = true
  try {
    const token = authStore.session?.access_token
    const res = await fetch('/api/warga/surat', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const { data } = await res.json()
      suratList.value = data ?? []
    }
  } finally {
    loading.value = false
  }
}

async function submitSurat() {
  submitting.value = true
  try {
    const token = authStore.session?.access_token
    const res = await fetch('/api/warga/surat', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (res.ok) {
      form.value = { jenis: '', keperluan: '' }
      showForm.value = false
      await loadSurat()
    }
  } finally {
    submitting.value = false
  }
}

const jenisLabels: Record<string, string> = {
  domisili: 'Surat Keterangan Domisili',
  tidak_mampu: 'Surat Keterangan Tidak Mampu',
  usaha: 'Surat Keterangan Usaha',
  kelahiran: 'Surat Pengantar Kelahiran',
  kematian: 'Surat Pengantar Kematian',
  pindah: 'Surat Pengantar Pindah',
  lainnya: 'Lainnya',
}

function jenisLabel(j: string) { return jenisLabels[j] ?? j }
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
