/**
 * StatCards.jsx — Komponen Kartu Statistik Ringkasan
 *
 * Layout Responsif (Mobile-First):
 * - 1 kolom di mobile (default)
 * - 2 kolom di tablet (sm breakpoint)
 * - 4 kolom di desktop (lg breakpoint)
 */

import { Beef, Egg, Stethoscope, MapPin, TrendingUp, Users } from "lucide-react";
import dummyData from "../data/dummyData.json";

const statConfig = [
  {
    label: "Total Ternak",
    value: dummyData.ringkasan.totalTernak,
    icon: Beef,
    gradient: "from-primary-500 to-primary-700",
    shadow: "shadow-primary-500/20",
    change: "+5.2%",
    desc: "Seluruh jenis ternak",
  },
  {
    label: "Total Sapi",
    value: dummyData.ringkasan.totalSapi,
    icon: Beef,
    gradient: "from-blue-500 to-blue-700",
    shadow: "shadow-blue-500/20",
    change: "+3.8%",
    desc: "Sapi potong & perah",
  },
  {
    label: "Total Kambing",
    value: dummyData.ringkasan.totalKambing,
    icon: Egg,
    gradient: "from-amber-500 to-amber-700",
    shadow: "shadow-amber-500/20",
    change: "+2.1%",
    desc: "Kambing & domba",
  },
  {
    label: "Total Ayam",
    value: dummyData.ringkasan.totalAyam,
    icon: Egg,
    gradient: "from-rose-500 to-rose-700",
    shadow: "shadow-rose-500/20",
    change: "+7.4%",
    desc: "Ayam pedaging & petelur",
  },
  {
    label: "Puskeswan",
    value: dummyData.ringkasan.totalPuskeswan,
    icon: Stethoscope,
    gradient: "from-cyan-500 to-cyan-700",
    shadow: "shadow-cyan-500/20",
    change: "+2 unit",
    desc: "Unit pelayanan",
  },
  {
    label: "Kabupaten",
    value: dummyData.ringkasan.totalKabupaten,
    icon: MapPin,
    gradient: "from-violet-500 to-violet-700",
    shadow: "shadow-violet-500/20",
    change: "23 kab/kota",
    desc: "Kabupaten/kota terlayani",
  },
  {
    label: "Petugas",
    value: dummyData.ringkasan.totalPetugas,
    icon: Users,
    gradient: "from-orange-500 to-orange-700",
    shadow: "shadow-orange-500/20",
    change: "+12 orang",
    desc: "Petugas lapangan",
  },
];

function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}

export default function StatCards() {
  return (
    <section aria-label="Statistik ringkasan peternakan">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfig.map((stat, index) => (
          <div
            key={stat.label}
            className="glass rounded-2xl p-5 hover:bg-white/[0.08] transition-all duration-300 cursor-default group animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-500/10 text-primary-400">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-semibold">{stat.change}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1 tracking-tight">
              {formatNumber(stat.value)}
            </p>
            <p className="text-sm font-medium text-surface-400">{stat.label}</p>
            <p className="text-xs text-surface-500 mt-0.5">{stat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
