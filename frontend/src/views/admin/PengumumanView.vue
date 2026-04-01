<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Pengumuman</h1>
        <p class="text-sm text-slate-500 mt-0.5">Kelola pengumuman untuk seluruh warga RT</p>
      </div>
      <button @click="openForm()"
        class="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Buat Pengumuman
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="card p-6 space-y-4">
      <h2 class="font-semibold text-slate-800">{{ editingId ? 'Edit Pengumuman' : 'Pengumuman Baru' }}</h2>
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Judul</label>
        <input v-model="form.judul" type="text" placeholder="Judul pengumuman..." class="input-field" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Isi Pengumuman</label>
        <textarea v-model="form.isi" rows="5" placeholder="Tulis isi pengumuman..." class="input-field resize-none" />
      </div>
      <div class="flex gap-3 justify-end pt-1">
        <button @click="cancelForm"
          class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          Batal
        </button>
        <button @click="savePengumuman" :disabled="saving || !form.judul || !form.isi"
          class="px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2">
          <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ saving ? 'Menyimpan...' : (editingId ? 'Simpan' : 'Publikasikan') }}
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="w-6 h-6 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
      <div v-else-if="list.length === 0" class="flex flex-col items-center py-16 text-slate-400">
        <svg class="w-12 h-12 mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <p class="text-sm">Belum ada pengumuman.</p>
      </div>
      <div v-else class="divide-y divide-slate-100">
        <div v-for="item in list" :key="item.id" class="px-6 py-4 hover:bg-slate-50 transition-colors">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-slate-900 text-sm">{{ item.judul }}</p>
              <p class="text-xs text-slate-500 mt-1 line-clamp-2">{{ item.isi }}</p>
              <p class="text-xs text-slate-400 mt-1.5">{{ formatDate(item.created_at) }}</p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button @click="openForm(item)"
                class="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="deletePengumuman(item.id)"
                class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Pengumuman { id: string; judul: string; isi: string; created_at: string }

const authStore = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const showForm = ref(false)
const editingId = ref<string | null>(null)
const list = ref<Pengumuman[]>([])
const form = ref({ judul: '', isi: '' })

onMounted(load)

async function load() {
  loading.value = true
  try {
    const token = authStore.session?.access_token
    const res = await fetch('/api/admin/pengumuman', { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) { const { data } = await res.json(); list.value = data ?? [] }
  } finally { loading.value = false }
}

function openForm(item?: Pengumuman) {
  editingId.value = item?.id ?? null
  form.value = { judul: item?.judul ?? '', isi: item?.isi ?? '' }
  showForm.value = true
}

function cancelForm() { showForm.value = false; editingId.value = null; form.value = { judul: '', isi: '' } }

async function savePengumuman() {
  saving.value = true
  try {
    const token = authStore.session?.access_token
    const url = editingId.value ? `/api/admin/pengumuman/${editingId.value}` : '/api/admin/pengumuman'
    const method = editingId.value ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (res.ok) { cancelForm(); await load() }
  } finally { saving.value = false }
}

async function deletePengumuman(id: string) {
  if (!confirm('Hapus pengumuman ini?')) return
  const token = authStore.session?.access_token
  await fetch(`/api/admin/pengumuman/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  await load()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>
