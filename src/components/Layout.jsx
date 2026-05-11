/**
 * Layout.jsx — Komponen Layout Utama Aplikasi
 *
 * Komponen ini menggabungkan:
 * - Navbar (navigasi atas)
 * - Sidebar (navigasi samping)
 * - Area konten utama (Outlet dari React Router)
 *
 * Mengatur state terbuka/tertutup sidebar untuk mobile.
 *
 * Struktur Layout:
 * ┌──────────────────────────────┐
 * │           Navbar             │
 * ├──────────┬───────────────────┤
 * │          │                   │
 * │ Sidebar  │   Main Content    │
 * │          │   (Outlet)        │
 * │          │                   │
 * └──────────┴───────────────────┘
 */

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  // State untuk mengontrol sidebar di mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-900 text-surface-100">
      {/* Navbar — sticky di atas, tinggi tetap h-16 */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Container utama: Sidebar + Konten — mengisi sisa tinggi layar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — drawer di mobile, static di desktop */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Area konten utama — flex-1 agar menghisap seluruh sisa lebar */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5 lg:p-6">
          {/* Outlet akan merender halaman sesuai route aktif */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
