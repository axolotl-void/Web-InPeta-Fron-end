/**
 * EmptyState.jsx — Komponen Data Kosong
 * Ditampilkan ketika tidak ada data untuk wilayah yang dipilih.
 * Ikon besar hijau pastel dengan pesan informatif.
 */

import { MapOff } from "lucide-react";

export default function EmptyState({
  icon: Icon = MapOff,
  title = "Data belum tersedia",
  message = "Data belum tersedia untuk wilayah ini. Silakan pilih wilayah lain atau coba beberapa saat lagi.",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Ikon besar hijau pastel */}
      <div className="w-24 h-24 rounded-3xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-green-400 dark:text-green-500" />
      </div>

      {/* Judul */}
      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">
        {title}
      </h3>

      {/* Pesan */}
      <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm leading-relaxed">
        {message}
      </p>
    </div>
  );
}
