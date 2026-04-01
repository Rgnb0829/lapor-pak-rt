<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">

    <!-- ── Sidebar (desktop ≥ 768px) ─────────────────────────── -->
    <aside class="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 shadow-sm flex-shrink-0">

      <!-- Brand -->
      <div class="px-5 py-5 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="font-bold text-slate-900 text-sm leading-tight">Smart RT</p>
            <p class="text-xs text-slate-400 truncate">{{ authStore.profile?.full_name }}</p>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <template v-if="authStore.isAdmin">
          <NavItem v-for="item in adminNav" :key="item.name" v-bind="item" />
        </template>
        <template v-else>
          <NavItem v-for="item in wargaNav" :key="item.name" v-bind="item" />
        </template>
      </nav>

      <!-- Sign Out -->
      <div class="p-3 border-t border-slate-100">
        <button @click="handleSignOut"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>

    <!-- ── Main content ───────────────────────────────────────── -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Mobile header -->
      <header class="md:hidden flex items-center justify-between bg-white border-b border-slate-100 px-4 py-3.5 flex-shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span class="font-bold text-slate-900 text-sm">Smart RT</span>
        </div>
        <span class="text-xs text-slate-400 truncate max-w-[160px]">{{ authStore.profile?.full_name }}</span>
      </header>

      <!-- Page slot -->
      <main class="flex-1 overflow-y-auto pb-20 md:pb-0">
        <router-view />
      </main>
    </div>

    <!-- ── Bottom nav (mobile < 768px) ───────────────────────── -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-20 safe-bottom">
      <div class="flex items-center" :class="authStore.isAdmin ? 'justify-around' : 'justify-around'">
        <template v-if="authStore.isAdmin">
          <BottomNavItem v-for="item in adminNav" :key="item.name" v-bind="item" />
        </template>
        <template v-else>
          <BottomNavItem v-for="item in wargaNav" :key="item.name" v-bind="item" />
        </template>
        <!-- Sign out mobile -->
        <button @click="handleSignOut"
          class="flex flex-col items-center gap-1 px-3 py-2.5 text-red-400 hover:text-red-600 transition-colors min-w-[56px]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="text-[10px] font-medium">Keluar</span>
        </button>
      </div>
    </nav>

  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NavItem from './NavItem.vue'
import BottomNavItem from './BottomNavItem.vue'

const router = useRouter()
const authStore = useAuthStore()

const wargaNav = [
  {
    name: 'Beranda',
    routeName: 'warga-home',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />`,
  },
  {
    name: 'Laporan',
    routeName: 'warga-laporan',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />`,
  },
  {
    name: 'Surat',
    routeName: 'warga-surat',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
  },
  {
    name: 'Profil',
    routeName: 'warga-profil',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />`,
  },
]

const adminNav = [
  {
    name: 'Warga',
    routeName: 'admin-dashboard',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />`,
  },
  {
    name: 'Pengumuman',
    routeName: 'admin-pengumuman',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />`,
  },
  {
    name: 'Laporan',
    routeName: 'admin-laporan',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />`,
  },
  {
    name: 'Surat',
    routeName: 'admin-surat',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
  },
]

async function handleSignOut() {
  await authStore.signOut()
  router.push('/auth')
}
</script>
