import React, { useState } from 'react';
import { 
  Map, 
  MapPin, 
  Layers, 
  Info, 
  ChevronDown, 
  ChevronRight, 
  CheckSquare, 
  Square,
  Circle,
  CheckCircle2,
  X,
  Filter
} from 'lucide-react';

// =====================================================================
// 1. KOMPONEN ACCORDION (Menu Lipat)
// =====================================================================
export const FilterAccordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 transition-colors text-white"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-slate-300" />}
          <span className="font-medium text-sm tracking-wide">{title}</span>
        </div>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-3 bg-white space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// 2. KOMPONEN UTAMA SIDEBAR
// =====================================================================
export const MapFilterSidebar = ({ filters, setFilters, isMobileOpen, setIsMobileOpen }) => {
  
  // Logika toggle checkbox biasa (bisa centang banyak)
  const toggleCheckbox = (category, item) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category][item]
      }
    }));
  };

  // Logika toggle radio (hanya bisa pilih satu di kategori Polygon)
  const setRadio = (category, item) => {
    setFilters(prev => ({
      ...prev,
      [category]: item
    }));
  };

  // Sub-komponen UI untuk item Checkbox
  const CheckboxItem = ({ label, checked, onClick, icon }) => (
    <div className="flex items-center justify-between cursor-pointer p-1.5 hover:bg-slate-50 rounded-md transition-colors" onClick={onClick}>
      <div className="flex items-center gap-2">
        {checked ? <CheckSquare size={18} className="text-emerald-600" /> : <Square size={18} className="text-slate-400" />}
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      {icon && <span className="text-slate-500">{icon}</span>}
    </div>
  );

  // Sub-komponen UI untuk item Radio
  const RadioItem = ({ label, checked, onClick }) => (
    <div className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-md transition-colors" onClick={onClick}>
      {checked ? <CheckCircle2 size={18} className="text-blue-600" /> : <Circle size={18} className="text-slate-400" />}
      <span className="text-sm text-slate-700">{label}</span>
    </div>
  );

  return (
    <>
      {/* Background Overlay saat sidebar terbuka di HP */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Kontainer Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-50 shadow-2xl lg:shadow-none border-r border-slate-200
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header Khusus Mobile (Biar ada tombol Close) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <Filter size={18} /> Filter Peta
          </span>
          <button onClick={() => setIsMobileOpen(false)} className="p-1 text-slate-500 hover:bg-slate-100 rounded-md">
            <X size={20} />
          </button>
        </div>

        {/* Konten Menu Accordion */}
        <div className="flex-1 overflow-y-auto">
          
          <FilterAccordion title="Batas Wilayah" icon={Map} defaultOpen={true}>
            <CheckboxItem 
              label="Kabupaten" 
              checked={filters.batas.kabupaten} 
              onClick={() => toggleCheckbox('batas', 'kabupaten')} 
              icon={<MapPin size={14}/>}
            />
            <CheckboxItem 
              label="Kecamatan" 
              checked={filters.batas.kecamatan} 
              onClick={() => toggleCheckbox('batas', 'kecamatan')} 
              icon={<MapPin size={14}/>}
            />
          </FilterAccordion>

          <FilterAccordion title="Koordinat" icon={MapPin} defaultOpen={true}>
            <CheckboxItem label="Puskeswan" checked={filters.koordinat.puskeswan} onClick={() => toggleCheckbox('koordinat', 'puskeswan')} />
            <CheckboxItem label="Pos Cekpoin" checked={filters.koordinat.posCekpoin} onClick={() => toggleCheckbox('koordinat', 'posCekpoin')} />
            <CheckboxItem label="Pasar Ternak" checked={filters.koordinat.pasarTernak} onClick={() => toggleCheckbox('koordinat', 'pasarTernak')} />
            <CheckboxItem label="Penerima Sertifikat NKV" checked={filters.koordinat.nkv} onClick={() => toggleCheckbox('koordinat', 'nkv')} />
            <CheckboxItem label="Klinik Hewan" checked={filters.koordinat.klinik} onClick={() => toggleCheckbox('koordinat', 'klinik')} />
            <CheckboxItem label="RPH" checked={filters.koordinat.rph} onClick={() => toggleCheckbox('koordinat', 'rph')} />
          </FilterAccordion>

          <FilterAccordion title="Geospasial" icon={Layers}>
            <CheckboxItem label="Lahan Pengembalaan" checked={filters.geospasial.lahan} onClick={() => toggleCheckbox('geospasial', 'lahan')} />
            <CheckboxItem label="Populasi Ternak Non Kugi" checked={filters.geospasial.populasi} onClick={() => toggleCheckbox('geospasial', 'populasi')} />
          </FilterAccordion>

          <FilterAccordion title="Polygon" icon={Map}>
             <RadioItem label="Reset" checked={filters.polygon === 'reset'} onClick={() => setRadio('polygon', 'reset')} />
             <RadioItem label="Puskeswan" checked={filters.polygon === 'puskeswan'} onClick={() => setRadio('polygon', 'puskeswan')} />
             <RadioItem label="Pos Cekpoin" checked={filters.polygon === 'posCekpoin'} onClick={() => setRadio('polygon', 'posCekpoin')} />
             <RadioItem label="Pasar Ternak" checked={filters.polygon === 'pasarTernak'} onClick={() => setRadio('polygon', 'pasarTernak')} />
             <RadioItem label="Penerima Sertifikat Nkv" checked={filters.polygon === 'nkv'} onClick={() => setRadio('polygon', 'nkv')} />
             <RadioItem label="Klinik Hewan" checked={filters.polygon === 'klinik'} onClick={() => setRadio('polygon', 'klinik')} />
             <RadioItem label="Rph" checked={filters.polygon === 'rph'} onClick={() => setRadio('polygon', 'rph')} />
          </FilterAccordion>

          <FilterAccordion title="Informasi" icon={Info}>
            <p className="text-xs text-slate-500 p-2 text-justify">
              Data ini disajikan oleh Dinas Peternakan Aceh. Gunakan filter di atas untuk menampilkan lapisan data pada peta.
            </p>
          </FilterAccordion>

        </div>
      </div>
    </>
  );
};


// =====================================================================
// DUMMY APP (HANYA UNTUK PREVIEW DI SINI)
// Di project VS Code kamu, jangan copy bagian bawah ini ya!
// Di file aslimu cukup ketik: export default MapFilterSidebar;
// =====================================================================
export default function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    batas: { kabupaten: true, kecamatan: false },
    koordinat: { puskeswan: true, posCekpoin: true, pasarTernak: true, nkv: true, klinik: false, rph: false },
    geospasial: { lahan: false, populasi: false },
    polygon: 'reset'
  });

  return (
    <div className="h-screen bg-slate-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden h-[600px] border border-slate-300">
         <MapFilterSidebar 
            filters={activeFilters} 
            setFilters={setActiveFilters} 
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
         />
      </div>
    </div>
  );
}
