import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, X, Map as MapIcon, Hexagon, 
  MapPin, Store, Home, 
  Leaf, Globe, ShieldAlert, CheckCircle2, 
  SquareDashed, Beef, BriefcaseMedical, Scissors,
  ChevronLeft, LayoutGrid
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   1. KONFIGURASI TEMA WARNA PASTEL (Sesuai Referensi Gambar)
   ══════════════════════════════════════════════════════════ */
// Objek pemetaan warna pastel yang lembut untuk background ikon dan teks
const themeColors = {
  green: {
    cardActive: "border-green-400 bg-green-50/50 shadow-green-500/10 ring-2 ring-green-400/20",
    iconBg: "bg-green-50 dark:bg-green-900/30",
    iconColor: "text-green-500 dark:text-green-400",
  },
  emerald: {
    cardActive: "border-emerald-400 bg-emerald-50/50 shadow-emerald-500/10 ring-2 ring-emerald-400/20",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  orange: {
    cardActive: "border-orange-400 bg-orange-50/50 shadow-orange-500/10 ring-2 ring-orange-400/20",
    iconBg: "bg-orange-50 dark:bg-orange-900/30",
    iconColor: "text-orange-500 dark:text-orange-400",
  },
  blue: {
    cardActive: "border-blue-400 bg-blue-50/50 shadow-blue-500/10 ring-2 ring-blue-400/20",
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  indigo: {
    cardActive: "border-indigo-400 bg-indigo-50/50 shadow-indigo-500/10 ring-2 ring-indigo-400/20",
    iconBg: "bg-indigo-50 dark:bg-indigo-900/30",
    iconColor: "text-indigo-500 dark:text-indigo-400",
  },
  pink: {
    cardActive: "border-pink-400 bg-pink-50/50 shadow-pink-500/10 ring-2 ring-pink-400/20",
    iconBg: "bg-pink-50 dark:bg-pink-900/30",
    iconColor: "text-pink-500 dark:text-pink-400",
  },
  red: {
    cardActive: "border-red-400 bg-red-50/50 shadow-red-500/10 ring-2 ring-red-400/20",
    iconBg: "bg-red-50 dark:bg-red-900/30",
    iconColor: "text-red-500 dark:text-red-400",
  },
  purple: {
    cardActive: "border-purple-400 bg-purple-50/50 shadow-purple-500/10 ring-2 ring-purple-400/20",
    iconBg: "bg-purple-50 dark:bg-purple-900/30",
    iconColor: "text-purple-500 dark:text-purple-400",
  },
  teal: {
    cardActive: "border-teal-400 bg-teal-50/50 shadow-teal-500/10 ring-2 ring-teal-400/20",
    iconBg: "bg-teal-50 dark:bg-teal-900/30",
    iconColor: "text-teal-500 dark:text-teal-400",
  }
};

/* ══════════════════════════════════════════════════════════
   2. CUSTOM ICONS (Untuk icon yang tidak ada di Lucide)
   ══════════════════════════════════════════════════════════ */
const StethoscopeIcon = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
    <circle cx="20" cy="10" r="2"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════
   3. DATA STRUKTUR BENTO GRID (Sesuai Screenshot Terbaru)
   ══════════════════════════════════════════════════════════ */
const LAYER_CATEGORIES = [
  {
    title: "Batas Wilayah",
    gridCols: "grid-cols-2", // Agar item membesar dan sejajar berdua
    items: [
      { key: "kabupaten", label: "Kabupaten", icon: MapIcon, color: "green" },
      { key: "kecamatan", label: "Kecamatan", icon: SquareDashed, color: "green" }
    ]
  },
  {
    title: "Lahan & Habitat",
    gridCols: "grid-cols-2", // Sejajar berdua
    items: [
      { key: "lahanGembala", label: "Gembala", icon: Leaf, color: "green" },
      { key: "populasiNonKugi", label: "Non Kugi", icon: Beef, color: "orange" }
    ]
  },
  {
    title: "Fasilitas & Lokasi",
    gridCols: "grid-cols-3", // Kotak-kotak kecil sejajar bertiga
    items: [
      { key: "kordinat", label: "Kordinat", icon: MapPin, color: "blue" },
      { key: "puskeswan", label: "Puskeswan", icon: StethoscopeIcon, color: "indigo" },
      { key: "pasarTernak", label: "Pasar Ternak", icon: Store, color: "pink" }
    ]
  },
  {
    title: "Layanan",
    gridCols: "grid-cols-3",
    items: [
      { key: "rph", label: "RPH", icon: Home, color: "orange" },
      { key: "klinikHewan", label: "Klinik Hewan", icon: BriefcaseMedical, color: "teal" },
      { key: "potongHewan", label: "Potong Hewan", icon: Scissors, color: "red" }
    ]
  },
  {
    title: "Lainnya",
    gridCols: "grid-cols-3",
    items: [
      { key: "geospasial", label: "Geospasial", icon: Globe, color: "blue" },
      { key: "poly1", label: "Polygon", icon: Hexagon, color: "purple" },
      { key: "resetPeta", label: "Reset Peta", icon: MapIcon, color: "teal" }
    ]
  }
];


/* ══════════════════════════════════════════════════════════
   4. KOMPONEN SUB-ITEM (GRID KOTAK / FEATURE CARD)
   ══════════════════════════════════════════════════════════ */
const FeatureCard = ({ item, isActive, onToggle }) => {
  const theme = themeColors[item.color] || themeColors.blue;
  const IconComponent = item.icon;

  return (
    <motion.button
      onClick={onToggle}
      // Efek squish yang memuaskan saat ditekan
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.88 }}
      className={`
        relative flex flex-col items-center justify-center p-3 h-24 
        rounded-2xl border transition-all duration-300 ease-out outline-none overflow-hidden
        ${isActive 
          ? theme.cardActive 
          : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-white/60 dark:border-slate-700/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600'
        }
      `}
    >
      {/* Indikator Aktif (Ceklis Kecil di Kanan Atas) */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full ${theme.iconBg}`}
          >
            <CheckCircle2 size={10} className={theme.iconColor} strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ikon dengan Background Pastel Bulat */}
      <div className={`
        w-10 h-10 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300
        ${theme.iconBg} ${isActive ? 'scale-110' : 'scale-100'}
      `}>
        <IconComponent size={22} className={theme.iconColor} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      
      {/* Teks Label di Bawah */}
      <span className={`
        text-[10px] font-bold text-center leading-tight tracking-wide px-1
        ${isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}
      `}>
        {item.label}
      </span>
    </motion.button>
  );
};


/* ══════════════════════════════════════════════════════════
   5. KOMPONEN UTAMA LAYER MANAGER
   ══════════════════════════════════════════════════════════ */
export default function LayerManager({ activeLayers, toggleLayer }) {
  const [isOpen, setIsOpen] = useState(false);

  // Mencegah body scroll di mobile saat panel drawer terbuka
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const totalActive = Object.values(activeLayers).filter(Boolean).length;

  return (
    <>
      {/* OVERLAY GELAP UNTUK MOBILE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[850]"
          />
        )}
      </AnimatePresence>

      {/* CONTAINER RELATIVE UTAMA */}
      <div className="absolute top-5 left-4 md:top-6 md:left-6 z-[900] flex flex-col items-start">
        
        {/* TOMBOL TRIGGER UTAMA (FAB Peta) */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative z-20 flex items-center gap-3 px-5 py-3.5 rounded-full backdrop-blur-xl shadow-xl border transition-all font-bold text-sm
            ${isOpen 
              ? 'bg-slate-800/90 text-white border-slate-700/50 dark:bg-slate-100/90 dark:text-slate-900 dark:border-white/50' 
              : 'bg-white/90 dark:bg-slate-900/90 border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-white/100'
            }
          `}
        >
          <Layers size={18} className={isOpen ? 'text-white dark:text-slate-900' : 'text-green-600'} />
          <span>Menu Fitur</span>
          
          <AnimatePresence>
            {totalActive > 0 && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`
                  flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black ml-1
                  ${isOpen 
                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900' 
                    : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                  }
                `}
              >
                {totalActive}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* PANEL APLIKASI (BENTO APP DRAWER) DENGAN EFEK GLASSMORPHISM */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(5px)" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className={`
                fixed md:absolute top-24 left-4 right-4 md:left-0 md:right-auto md:top-full md:mt-2
                w-auto md:w-[350px] max-h-[calc(100vh-120px)] md:max-h-[75vh] 
                flex flex-col 
                bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl 
                rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] md:shadow-2xl 
                border border-white/60 dark:border-slate-700/50 overflow-hidden z-10
              `}
            >
              {/* Header App Drawer */}
              <div className="flex items-center justify-between px-6 py-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md z-20 shrink-0 border-b border-white/30 dark:border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/70 dark:bg-slate-800/70 flex items-center justify-center shadow-sm">
                    <LayoutGrid size={16} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <span className="font-extrabold text-[15px] text-slate-800 dark:text-white tracking-tight">
                    Fitur Peta
                  </span>
                </div>
                
                <motion.button 
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setIsOpen(false)} 
                  className="w-8 h-8 rounded-full bg-white/70 dark:bg-slate-800/70 text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center shadow-sm"
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                </motion.button>
              </div>

              {/* Scrollable Content (Grid Grouping) */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-6 space-y-6">
                {LAYER_CATEGORIES.map((group) => (
                  <div key={group.title} className="space-y-3">
                    
                    {/* Judul Kategori */}
                    <h3 className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400">
                      {group.title}
                    </h3>
                    
                    {/* Bento Grid layout (dinamis 2 kolom atau 3 kolom) */}
                    <div className={`grid ${group.gridCols} gap-3`}>
                      {group.items.map((item) => (
                        <FeatureCard 
                          key={item.key}
                          item={item}
                          isActive={activeLayers[item.key]}
                          onToggle={() => toggleLayer(item.key)}
                        />
                      ))}
                    </div>

                  </div>
                ))}
              </div>

              {/* Sticky Footer Button */}
              <div className="p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-t border-white/30 dark:border-slate-700/30 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  Lihat Semua Data <LayoutGrid size={14} />
                </motion.button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}