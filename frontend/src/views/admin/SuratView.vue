<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Permohonan Surat</h1>
      <p class="text-sm text-slate-500 mt-0.5">Proses permohonan surat keterangan dari warga</p>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
        :class="['px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors',
          activeFilter === f.value ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50']">
        {{ f.label }}
      </button>
    </div>

    <!-- List -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="w-6 h-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
      <div v-else-if="filtered.length === 0" class="flex flex-col items-center py-16 text-slate-400">
        <svg class="w-12 h-12 mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm">Tidak ada permohonan dengan filter ini.</p>
      </div>
      <div v-else class="divide-y divide-slate-100">
        <div v-for="item in filtered" :key="item.id" class="px-6 py-4 hover:bg-slate-50 transition-colors">
          <div class="flex items-start gap-4 justify-between">
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-slate-900 text-sm">{{ jenisLabel(item.jenis) }}</p>
              <p class="text-xs text-slate-500 mt-0.5 line-clamp-2">{{ item.keperluan }}</p>
              <p class="text-xs text-slate-400 mt-1">
                oleh <span class="font-medium text-slate-600">{{ item.warga_name }}</span>
                · {{ formatDate(item.created_at) }}
              </p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <span :class="statusClass(item.status)" class="px-2.5 py-1 rounded-full text-xs font-semibold">
                {{ statusLabel(item.status) }}
              </span>
              <div class="flex gap-1.5">
                <button v-if="item.status === 'menunggu'" @click="updateStatus(item, 'selesai')"
                  class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                  Setujui
                </button>
                <button v-if="item.status === 'menunggu'" @click="updateStatus(item, 'ditolak')"
                  class="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg transition-colors">
                  Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Surat {
  id: string; jenis: string; keperluan: string
  status: string; warga_name: string; created_at: string
}

const authStore = useAuthStore()
const loading = ref(false)
const list = ref<Surat[]>([])
const activeFilter = ref('semua')

const filters = [
  { value: 'semua', label: 'Semua' },
  { value: 'menunggu', label: '⏳ Menunggu' },
  { value: 'selesai', label: '✅ Disetujui' },
  { value: 'ditolak', label: '❌ Ditolak' },
]

const filtered = computed(() =>
  activeFilter.value === 'semua' ? list.value : list.value.filter(s => s.status === activeFilter.value)
)

const jenisLabels: Record<string, string> = {
  domisili: 'Surat Keterangan Domisili', tidak_mampu: 'Surat Keterangan Tidak Mampu',
  usaha: 'Surat Keterangan Usaha', kelahiran: 'Surat Pengantar Kelahiran',
  kematian: 'Surat Pengantar Kematian', pindah: 'Surat Pengantar Pindah', lainnya: 'Lainnya',
}

onMounted(load)

async function load() {
  loading.value = true
  try {
    const token = authStore.session?.access_token
    const res = await fetch('/api/admin/surat', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) { const { data } = await res.json(); list.value = data ?? [] }
  } finally { loading.value = false }
}

async function updateStatus(item: Surat, status: string) {
  const token = authStore.session?.access_token
  const res = await fetch(`/api/admin/surat/${item.id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (res.ok) { item.status = status }
}

function jenisLabel(j: string) { return jenisLabels[j] ?? j }
function statusLabel(s: string) {
  return { menunggu: '⏳ Menunggu', diproses: '🔄 Diproses', selesai: '✅ Disetujui', ditolak: '❌ Ditolak' }[s] ?? s
}
function statusClass(s: string) {
  return {
    menunggu: 'bg-amber-100 text-amber-700', diproses: 'bg-blue-100 text-blue-700',
    selesai: 'bg-green-100 text-green-700', ditolak: 'bg-red-100 text-red-700',
  }[s] ?? 'bg-slate-100 text-slate-600'
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
