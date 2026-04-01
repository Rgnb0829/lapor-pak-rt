<template>
  <div>
    <!-- Content -->
    <div class="max-w-4xl mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900">Beranda Warga</h1>
        <p class="text-slate-500 text-sm mt-1">Selamat datang, {{ authStore.profile?.full_name }}!</p>
      </div>

      <!-- Quick stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="card p-5">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Pengumuman Baru</p>
          <p class="text-3xl font-bold text-primary-600">—</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Permohonan Surat</p>
          <p class="text-3xl font-bold text-blue-600">—</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Status Akun</p>
          <span class="inline-block mt-1 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
            ✓ Terverifikasi
          </span>
        </div>
      </div>

      <!-- Announcements placeholder -->
      <div class="card p-6">
        <h2 class="font-semibold text-slate-800 mb-4">📢 Pengumuman Terbaru</h2>
        <div class="text-center py-10 text-slate-400">
          <svg class="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <p class="text-sm">Belum ada pengumuman. <br />Fitur ini akan tersedia di Phase 3.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
