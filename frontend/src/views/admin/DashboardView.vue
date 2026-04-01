<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Manajemen Warga</h1>
        <button @click="loadWarga" :disabled="loading"
          class="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50">
          <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="card p-5 border-l-4 border-slate-300">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Warga</p>
          <p class="text-3xl font-bold text-slate-800">{{ stats.total }}</p>
        </div>
        <div class="card p-5 border-l-4 border-amber-400">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Pending Verifikasi</p>
          <p class="text-3xl font-bold text-amber-600">{{ stats.pending }}</p>
        </div>
        <div class="card p-5 border-l-4 border-primary-500">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Terverifikasi</p>
          <p class="text-3xl font-bold text-primary-600">{{ stats.verified }}</p>
        </div>
      </div>

      <!-- Filter tabs + Search -->
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <!-- Tabs -->
          <div class="flex rounded-xl bg-slate-100 p-1 w-fit">
            <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
              :class="[
                'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeTab === tab.key ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
              ]">
              {{ tab.label }}
              <span :class="[
                'ml-1.5 px-1.5 py-0.5 rounded-full text-xs',
                activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-slate-200 text-slate-500'
              ]">{{ tab.count }}</span>
            </button>
          </div>

          <!-- Search -->
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="search" type="text" placeholder="Cari nama atau NIK..."
              class="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white w-56" />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <svg class="w-7 h-7 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>

        <!-- Error -->
        <div v-else-if="errorMsg" class="flex flex-col items-center py-16 text-center px-6">
          <svg class="w-10 h-10 text-red-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-sm text-red-500 font-medium">{{ errorMsg }}</p>
          <p class="text-xs text-slate-400 mt-1">Pastikan backend berjalan dan service role key sudah diset.</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredWarga.length === 0" class="text-center py-16 text-slate-400">
          <svg class="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <p class="text-sm">
            {{ activeTab === 'pending' ? '🎉 Semua warga sudah terverifikasi!' : 'Tidak ada data warga.' }}
          </p>
        </div>

        <!-- Warga list -->
        <div v-else class="divide-y divide-slate-100">
          <div v-for="warga in filteredWarga" :key="warga.id"
            class="flex items-center justify-between px-6 py-4 hover:bg-slate-50/80 transition-colors gap-4">

            <!-- Avatar + Info -->
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-700 font-bold text-sm">
                {{ initials(warga.full_name) }}
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-slate-900 text-sm truncate">{{ warga.full_name }}</p>
                <p class="text-xs text-slate-500 mt-0.5">
                  NIK: {{ warga.nik ?? '—' }}
                  <span v-if="warga.address_block"> · Blok {{ warga.address_block }}</span>
                </p>
                <p class="text-xs text-slate-400">{{ warga.phone_number ?? 'No HP belum diisi' }}</p>
              </div>
            </div>

            <!-- Status + Action -->
            <div class="flex items-center gap-3 flex-shrink-0">
              <span :class="[
                'px-2.5 py-1 rounded-full text-xs font-semibold',
                warga.is_verified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              ]">
                {{ warga.is_verified ? '✓ Terverifikasi' : '⏳ Pending' }}
              </span>

              <!-- Verify -->
              <button v-if="!warga.is_verified"
                @click="verifyWarga(warga.id)"
                :disabled="actionId === warga.id"
                class="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
                <svg v-if="actionId === warga.id" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ actionId === warga.id ? '...' : 'Verifikasi' }}
              </button>

              <!-- Revoke -->
              <button v-else
                @click="revokeWarga(warga.id)"
                :disabled="actionId === warga.id"
                class="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 disabled:opacity-50 text-red-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
                <svg v-if="actionId === warga.id" class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ actionId === warga.id ? '...' : 'Cabut' }}
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface WargaProfile {
  id: string
  full_name: string
  nik: string | null
  phone_number: string | null
  address_block: string | null
  is_verified: boolean
}

const authStore = useAuthStore()

const loading = ref(false)
const actionId = ref<string | null>(null)
const errorMsg = ref('')
const allWarga = ref<WargaProfile[]>([])
const activeTab = ref<'all' | 'pending' | 'verified'>('pending')
const search = ref('')

const stats = reactive({ total: 0, pending: 0, verified: 0 })

const tabs = computed(() => [
  { key: 'all'      as const, label: 'Semua',          count: stats.total },
  { key: 'pending'  as const, label: 'Pending',         count: stats.pending },
  { key: 'verified' as const, label: 'Terverifikasi',   count: stats.verified },
])

const filteredWarga = computed(() => {
  let list = allWarga.value
  if (activeTab.value === 'pending')  list = list.filter(w => !w.is_verified)
  if (activeTab.value === 'verified') list = list.filter(w =>  w.is_verified)
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter(w =>
    w.full_name.toLowerCase().includes(q) ||
    (w.nik ?? '').toLowerCase().includes(q)
  )
  return list
})

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

onMounted(() => loadWarga())

async function loadWarga() {
  loading.value = true
  errorMsg.value = ''
  try {
    const token = authStore.session?.access_token
    const res = await fetch('/api/admin/warga', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      errorMsg.value = err.error ?? `Error ${res.status}`
      return
    }
    const { data } = await res.json()
    allWarga.value = data as WargaProfile[]
    stats.total    = data.length
    stats.pending  = data.filter((w: WargaProfile) => !w.is_verified).length
    stats.verified = data.filter((w: WargaProfile) =>  w.is_verified).length
  } catch (e) {
    errorMsg.value = 'Gagal terhubung ke backend. Pastikan backend sedang berjalan.'
  } finally {
    loading.value = false
  }
}

async function verifyWarga(id: string) {
  actionId.value = id
  try {
    const token = authStore.session?.access_token
    await fetch(`/api/admin/warga/${id}/verify`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    await loadWarga()
  } finally {
    actionId.value = null
  }
}

async function revokeWarga(id: string) {
  if (!confirm('Cabut verifikasi warga ini?')) return
  actionId.value = id
  try {
    const token = authStore.session?.access_token
    await fetch(`/api/admin/warga/${id}/revoke`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    await loadWarga()
  } finally {
    actionId.value = null
  }
}
</script>
