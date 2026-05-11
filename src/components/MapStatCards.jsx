import React from 'react';
import { Home, Award, Users, Store } from 'lucide-react';

export const MapStatCards = ({ data }) => {
  // Data default/mockup kalau prop data belum di-passing dari parent (misal dari API nanti)
  const defaultStats = [
    { title: 'Puskeswan', count: 109, icon: Home, color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'Sertifikat NKV', count: 17, icon: Award, color: 'text-amber-500', bg: 'bg-amber-100' },
    { title: 'Pedagang Ternak', count: 0, icon: Users, color: 'text-slate-500', bg: 'bg-slate-200' },
    { title: 'Rumah Potong', count: 17, icon: Store, color: 'text-rose-500', bg: 'bg-rose-100' },
  ];

  // Gunakan data dari props jika ada, kalau tidak pakai defaultStats
  const statsToRender = data || defaultStats;

  return (
    // overflow-x-auto & snap-x bikin kartu bisa di-swipe rapi di HP
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
      {statsToRender.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div 
            key={idx} 
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-4 min-w-[240px] md:min-w-0 md:flex-1 snap-start shrink-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default"
          >
            {/* Wrapper Icon */}
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <Icon size={24} strokeWidth={2} />
            </div>
            
            {/* Teks & Angka */}
            <div>
              <p className="text-xs md:text-sm text-slate-500 font-medium mb-0.5 tracking-wide">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-800 leading-none">
                {stat.count}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};


// =====================================================================
// DUMMY APP (HANYA UNTUK PREVIEW DI SINI)
// Di project VS Code kamu, JANGAN copy bagian bawah ini ya!
// Di file aslimu cukup ketik: export default MapStatCards;
// =====================================================================
export default function App() {
  return (
    <div className="h-screen bg-slate-50 p-4 md:p-8 flex flex-col font-sans">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Preview: Map Stat Cards</h2>
        <p className="text-slate-500 text-sm">Coba hover ke kartunya (di desktop) atau swipe ke kanan kiri (di mode mobile).</p>
      </div>
      
      {/* Container utama (simulasi lebar layar dashboard) */}
      <div className="w-full max-w-5xl bg-slate-100 p-4 rounded-2xl border border-dashed border-slate-300">
        <MapStatCards />
      </div>
    </div>
  );
}
