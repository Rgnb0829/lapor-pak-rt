<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Laporan Masuk</h1>
      <p class="text-sm text-slate-500 mt-0.5">Kelola laporan dan pengaduan dari warga</p>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
        :class="['px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors',
          activeFilter === f.value ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50']">
        {{ f.label }}
      </button>
    </div>

    <!-- Table card -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="w-6 h-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
      <div v-else-if="filtered.length === 0" class="flex flex-col items-center py-16 text-slate-400">
        <svg class="w-12 h-12 mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-sm">Tidak ada laporan dengan filter ini.</p>
      </div>
      <div v-else class="divide-y divide-slate-100">
        <div v-for="item in filtered" :key="item.id" class="px-6 py-4 hover:bg-slate-50 transition-colors">
          <div class="flex items-start gap-4 justify-between">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="font-semibold text-slate-900 text-sm">{{ item.judul }}</p>
                <span class="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">{{ item.kategori }}</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5 line-clamp-2">{{ item.deskripsi }}</p>
              <p class="text-xs text-slate-400 mt-1">
                oleh <span class="font-medium text-slate-600">{{ item.warga_name }}</span>
                · {{ formatDate(item.created_at) }}
              </p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <span :class="statusClass(item.status)" class="px-2.5 py-1 rounded-full text-xs font-semibold">
                {{ statusLabel(item.status) }}
              </span>
              <select :value="item.status" @change="updateStatus(item, ($event.target as HTMLSelectElement).value)"
                class="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white text-slate-700">
                <option value="menunggu">Menunggu</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
              </select>
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

interface Laporan {
  id: string; judul: string; deskripsi: string; kategori: string
  status: string; warga_name: string; created_at: string
}

const authStore = useAuthStore()
const loading = ref(false)
const list = ref<Laporan[]>([])
const activeFilter = ref('semua')

const filters = [
  { value: 'semua', label: 'Semua' },
  { value: 'menunggu', label: '⏳ Menunggu' },
  { value: 'diproses', label: '🔄 Diproses' },
  { value: 'selesai', label: '✅ Selesai' },
  { value: 'ditolak', label: '❌ Ditolak' },
]

const filtered = computed(() =>
  activeFilter.value === 'semua' ? list.value : list.value.filter(l => l.status === activeFilter.value)
)

onMounted(load)

async function load() {
  loading.value = true
  try {
    const token = authStore.session?.access_token
    const res = await fetch('/api/admin/laporan', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) { const { data } = await res.json(); list.value = data ?? [] }
  } finally { loading.value = false }
}

async function updateStatus(item: Laporan, status: string) {
  const token = authStore.session?.access_token
  const res = await fetch(`/api/admin/laporan/${item.id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (res.ok) { item.status = status }
}

function statusLabel(s: string) {
  return { menunggu: '⏳ Menunggu', diproses: '🔄 Diproses', selesai: '✅ Selesai', ditolak: '❌ Ditolak' }[s] ?? s
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
