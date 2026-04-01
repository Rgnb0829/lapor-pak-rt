# Rencana Halaman & Menu — Smart RT App

## Kondisi Saat Ini ✅

| Route | File | Status |
|---|---|---|
| `/auth` | `AuthView.vue` | ✅ Selesai |
| `/warga/onboarding` | [OnboardingView.vue](file:///c:/Users/kiano/.gemini/antigravity/scratch/lapor-par-rt/frontend/src/views/warga/OnboardingView.vue) | ✅ Selesai |
| `/warga/pending-verification` | [PendingVerificationView.vue](file:///c:/Users/kiano/.gemini/antigravity/scratch/lapor-par-rt/frontend/src/views/warga/PendingVerificationView.vue) | ✅ Selesai |
| `/warga/home` | [HomeView.vue](file:///c:/Users/kiano/.gemini/antigravity/scratch/lapor-par-rt/frontend/src/views/warga/HomeView.vue) | ✅ Ada (placeholder) |
| `/admin/dashboard` | [DashboardView.vue](file:///c:/Users/kiano/.gemini/antigravity/scratch/lapor-par-rt/frontend/src/views/admin/DashboardView.vue) | ✅ Selesai |

---

## Struktur Menu yang Diusulkan

### 🏠 Portal Warga (`/warga/...`)

| Menu | Route | Ikon | Deskripsi |
|---|---|---|---|
| **Beranda** | `/warga/home` | 🏠 | Ringkasan & pengumuman terbaru |
| **Laporan** | `/warga/laporan` | 📢 | Buat & lihat status laporan/pengaduan |
| **Surat** | `/warga/surat` | 📄 | Permohonan surat keterangan |
| **Profil** | `/warga/profil` | 👤 | Edit data diri & ganti password |

### 🔒 Admin Panel (`/admin/...`)

| Menu | Route | Ikon | Deskripsi |
|---|---|---|---|
| **Manajemen Warga** | `/admin/dashboard` | 👥 | Verifikasi & lihat daftar warga |
| **Pengumuman** | `/admin/pengumuman` | 📢 | Buat & kelola pengumuman RT |
| **Laporan Masuk** | `/admin/laporan` | 📋 | Kelola laporan/pengaduan warga |
| **Permohonan Surat** | `/admin/surat` | 📄 | Proses permohonan surat warga |

---

## Arsitektur Layout

### Komponen Baru: `AppLayout.vue`

Daripada duplikasi navbar di tiap view, buat 1 layout komponen dengan:
- **Sidebar** (desktop ≥ 768px) — navigasi kiri vertical
- **Bottom nav** (mobile < 768px) — navigasi bawah 4-5 ikon
- **Slot** `<slot />` untuk konten halaman

```
views/
├── auth/
│   └── AuthView.vue (standalone, tanpa layout)
├── warga/
│   ├── HomeView.vue          ← update (sudah ada, tambah konten)
│   ├── LaporanView.vue       ← BARU
│   ├── SuratView.vue         ← BARU
│   └── ProfilView.vue        ← BARU
└── admin/
    ├── DashboardView.vue     ← sudah ada
    ├── PengumumanView.vue    ← BARU
    ├── LaporanView.vue       ← BARU
    └── SuratView.vue         ← BARU

components/
└── layout/
    ├── AppLayout.vue         ← BARU (wrapper dengan sidebar/bottom nav)
    ├── WargaNav.vue          ← BARU (menu items warga)
    └── AdminNav.vue          ← BARU (menu items admin)
```

---

## Router Update

```ts
// Warga — pakai AppLayout sebagai parent
{
  path: '/warga',
  component: () => import('@/components/layout/AppLayout.vue'),
  meta: { requiresAuth: true, role: 'warga' },
  children: [
    { path: 'home',    name: 'warga-home',    component: HomeView },
    { path: 'laporan', name: 'warga-laporan', component: LaporanView },  // BARU
    { path: 'surat',   name: 'warga-surat',   component: SuratView },    // BARU
    { path: 'profil',  name: 'warga-profil',  component: ProfilView },   // BARU
  ]
}

// Admin — pakai AppLayout sebagai parent
{
  path: '/admin',
  component: () => import('@/components/layout/AppLayout.vue'),
  meta: { requiresAuth: true, role: 'admin' },
  children: [
    { path: 'dashboard',  name: 'admin-dashboard',  component: DashboardView },
    { path: 'pengumuman', name: 'admin-pengumuman', component: PengumumanView }, // BARU
    { path: 'laporan',    name: 'admin-laporan',    component: LaporanView },    // BARU
    { path: 'surat',      name: 'admin-surat',      component: SuratView },      // BARU
  ]
}
```

---

## Urutan Pengerjaan (Build Order)

> [!IMPORTANT]
> Karena `AppLayout.vue` adalah fondasi semua halaman baru, ini harus dikerjakan pertama.

### Phase 1 — Layout & Navigasi
1. `AppLayout.vue` — sidebar desktop + bottom nav mobile
2. `WargaNav.vue` & `AdminNav.vue` — menu item list
3. Update [router/index.ts](file:///c:/Users/kiano/.gemini/antigravity/scratch/lapor-par-rt/frontend/src/router/index.ts) — nested routes dengan AppLayout

### Phase 2 — Halaman Warga
4. `ProfilView.vue` — edit data diri (NIK, nomor HP, blok)
5. `LaporanView.vue` — form buat laporan + list riwayat
6. `SuratView.vue` — form permohonan surat + list status

### Phase 3 — Halaman Admin
7. `PengumumanView.vue` — CRUD pengumuman
8. `LaporanView.vue` (admin) — tabel laporan masuk + tombol tindak lanjut
9. `SuratView.vue` (admin) — tabel permohonan + approve/reject

---

## Backend yang Perlu Dibuat

| Endpoint | Metode | Kebutuhan |
|---|---|---|
| `GET /api/warga/laporan` | GET | List laporan milik warga |
| `POST /api/warga/laporan` | POST | Buat laporan baru |
| `GET /api/warga/surat` | GET | List permohonan surat warga |
| `POST /api/warga/surat` | POST | Ajukan permohonan surat |
| `GET /api/admin/laporan` | GET | Semua laporan masuk |
| `PATCH /api/admin/laporan/:id` | PATCH | Update status laporan |
| `GET /api/admin/surat` | GET | Semua permohonan surat |
| `PATCH /api/admin/surat/:id` | PATCH | Approve/reject surat |
| `GET /api/admin/pengumuman` | GET | List pengumuman |
| `POST /api/admin/pengumuman` | POST | Buat pengumuman |
| `DELETE /api/admin/pengumuman/:id` | DELETE | Hapus pengumuman |

---

## Pertanyaan untuk Dikonfirmasi

1. **Mau mulai dari mana?** Phase 1 (AppLayout dulu) atau langsung ke halaman tertentu?
2. **Fitur Laporan** — apakah butuh upload foto/bukti, atau cukup teks?
3. **Fitur Surat** — jenis surat apa saja? (domisili, keterangan tidak mampu, dll.)
4. **Pengumuman** — apakah admin yang buat, atau warga bisa juga?
