/**
 * Sidebar.jsx — Komponen Navigasi Samping (Side Navigation)
 *
 * Komponen ini menampilkan:
 * - Menu navigasi utama dengan ikon
 * - Indikator halaman aktif
 * - Footer sidebar dengan info versi
 *
 * Perilaku Mobile-First:
 * - Mobile (< md): Sidebar menjadi drawer overlay dari kiri,
 *   muncul saat hamburger ditekan, dengan backdrop gelap.
 * - Desktop (≥ md): Sidebar tetap tampil di sisi kiri.
 */

import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Stethoscope,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  ArrowLeft,
} from "lucide-react";

/**
 * Daftar menu navigasi utama
 * Setiap item berisi: label, path (untuk routing), dan icon
 */
const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Peta Wilayah", path: "/peta", icon: Map },
  { label: "Puskeswan", path: "/puskeswan", icon: Stethoscope },
  { label: "Statistik", path: "/statistik", icon: BarChart3 },
];

const bottomMenuItems = [
  { label: "Pengaturan", path: "/pengaturan", icon: Settings },
  { label: "Bantuan", path: "/bantuan", icon: HelpCircle },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* === Backdrop overlay — hanya tampil di mobile saat sidebar terbuka === */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* === Sidebar Panel === */}
      <aside
        id="sidebar"
        className={`
          fixed top-0 left-0 z-50 h-full w-52
          bg-surface-900/95 backdrop-blur-2xl
          border-r border-white/5
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto md:flex-shrink-0
          flex flex-col
        `}
      >
        {/* --- Header Sidebar (mobile close button) --- */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-white/5 md:hidden">
          <span className="text-xs font-semibold text-surface-200">
            Menu Navigasi
          </span>
          <button
            id="btn-close-sidebar"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5 text-surface-400" />
          </button>
        </div>

        {/* --- Menu Utama --- */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          <p className="px-2.5 mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-surface-500">
            Menu Utama
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-primary-500/15 text-primary-400 shadow-sm shadow-primary-500/5"
                    : "text-surface-400 hover:text-surface-200 hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-primary-400"
                        : "text-surface-500 group-hover:text-surface-300"
                    }`}
                  />
                  <span>{item.label}</span>
                  {/* Indikator aktif — garis vertikal hijau di kiri */}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* --- Menu Bawah (Pengaturan & Bantuan) --- */}
        <div className="px-2.5 py-3 border-t border-white/5 space-y-0.5">
          {bottomMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-primary-500/15 text-primary-400"
                    : "text-surface-400 hover:text-surface-200 hover:bg-white/5"
                }`
              }
            >
              <item.icon className="w-4 h-4 text-surface-500 group-hover:text-surface-300" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Tombol Kembali ke Beranda — escape hatch */}
          <Link
            to="/"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-surface-500 hover:text-surface-200 hover:bg-white/5 transition-all duration-200 group mt-1"
          >
            <ArrowLeft className="w-4 h-4 text-surface-600 group-hover:text-surface-300 transition-colors" />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Info versi aplikasi */}
          <div className="mt-3 px-2.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] text-surface-500 leading-relaxed">
              InPETA v1.0.0-beta
              <br />
              <span className="text-surface-600">
                © 2026 Dinas Peternakan Aceh
              </span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
