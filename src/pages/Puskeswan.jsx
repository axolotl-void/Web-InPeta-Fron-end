/**
 * Puskeswan.jsx — Halaman Daftar Puskeswan (Placeholder)
 * Menampilkan daftar dan detail pusat kesehatan hewan (Puskeswan)
 * di seluruh Provinsi Aceh.
 */

import { Stethoscope, Phone, MapPin, UserCheck } from "lucide-react";
import dummyData from "../data/dummyData.json";

export default function Puskeswan() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Puskeswan
        </h1>
        <p className="text-sm text-surface-400 mt-1">
          Pusat Kesehatan Hewan di Provinsi Aceh
        </p>
      </header>

      {/* Grid kartu Puskeswan — responsif */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyData.puskeswan.map((item, i) => (
          <div
            key={item.id}
            className="glass rounded-2xl p-5 hover:bg-white/[0.08] transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Header kartu */}
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  item.status === "aktif"
                    ? "bg-primary-500/15 text-primary-400"
                    : "bg-rose-500/15 text-rose-400"
                }`}
              >
                {item.status === "aktif" ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            {/* Nama Puskeswan */}
            <h3 className="text-base font-semibold text-white mb-1">
              {item.nama}
            </h3>

            {/* Detail info */}
            <div className="space-y-2 mt-3 text-xs text-surface-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-surface-500 shrink-0" />
                <span className="truncate">{item.alamat}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-surface-500 shrink-0" />
                <span>{item.telepon}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-surface-500 shrink-0" />
                <span>{item.jumlahDokterHewan} Dokter Hewan</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
