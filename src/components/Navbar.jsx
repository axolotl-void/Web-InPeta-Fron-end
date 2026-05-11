/**
 * Navbar.jsx — Komponen Navigasi Atas (Top Navigation Bar)
 *
 * Komponen ini menampilkan:
 * - Logo & nama aplikasi InPETA
 * - Tombol hamburger (hanya terlihat di mobile)
 * - Search bar (tersembunyi di mobile, muncul di desktop)
 * - Ikon notifikasi & profil
 *
 * Menggunakan pendekatan Mobile-First:
 * - Default (mobile): layout ringkas, hamburger menu tampil
 * - md ke atas (desktop): hamburger disembunyikan, search bar muncul
 */

import { Menu, Search, Bell, User, Leaf } from "lucide-react";

export default function Navbar({ onToggleSidebar }) {
  return (
    <nav className="flex-shrink-0 z-50 glass-strong border-b border-white/10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* === Bagian Kiri: Hamburger + Logo === */}
        <div className="flex items-center gap-3">
          {/* Tombol hamburger — hanya tampil di mobile (< md) */}
          <button
            id="btn-hamburger"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors md:hidden"
            aria-label="Toggle navigasi"
          >
            <Menu className="w-5 h-5 text-surface-300" />
          </button>

          {/* Logo InPETA */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wide text-white leading-tight">
                InPETA
              </span>
              <span className="text-[10px] text-surface-400 leading-tight hidden sm:block">
                Peternakan Terintegrasi Aceh
              </span>
            </div>
          </div>
        </div>

        {/* === Bagian Tengah: Search Bar (hanya desktop) === */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              id="input-search"
              type="text"
              placeholder="Cari data kabupaten, puskeswan..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
            />
          </div>
        </div>

        {/* === Bagian Kanan: Notifikasi & Profil === */}
        <div className="flex items-center gap-2">
          {/* Tombol search di mobile */}
          <button
            id="btn-search-mobile"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors md:hidden"
            aria-label="Cari"
          >
            <Search className="w-5 h-5 text-surface-300" />
          </button>

          {/* Notifikasi */}
          <button
            id="btn-notifikasi"
            className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5 text-surface-300" />
            {/* Badge notifikasi */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full ring-2 ring-surface-900"></span>
          </button>

          {/* Avatar profil */}
          <button
            id="btn-profil"
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Profil pengguna"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            {/* Nama user — hanya tampil di layar besar */}
            <span className="text-sm font-medium text-surface-200 hidden lg:block">
              Admin
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
