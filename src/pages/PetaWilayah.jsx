import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, Marker, Tooltip, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  ArrowLeft, Search, Sun, Moon, Leaf, Beef, Egg, Bird, MapPin, 
  BarChart3, ChevronLeft, ChevronRight, X, Sparkles, Map as MapIcon, LocateFixed,
  Layers, Hexagon, Store, Home, Globe, ShieldAlert, CheckCircle2, 
  SquareDashed, BriefcaseMedical, Scissors, LayoutGrid
} from "lucide-react";

// 👇 Import API kita
import api from "../api";

import dataKabupaten from "../data/geomap/kabupaten.json";
import dataKecamatan from "../data/geomap/kecamatan.json";
import LogoInpeta from "../assets/logo-inpeta.png";

const formatNumber = (num) => new Intl.NumberFormat("id-ID").format(num);

const calcStats = () => ({
  totalSapi: 482300,
  totalKambing: 315700,
  totalAyam: 486500,
  totalPopulasi: 1284500,
});

const NEON_COLORS = [
  '#FF3131', '#39FF14', '#00FFFF', '#FF00FF', '#FFFF00', 
  '#1F51FF', '#FF8C00', '#FF1493', '#7DF9FF', '#9D00FF'
];

const getHashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
};

// =====================================================================
// 1. MAPPING KATEGORI DB → KEY FILTER PETA
// =====================================================================
// Backend menyimpan kategori sebagai string (misal: "Puskeswan", "Pasar Ternak", dll.)
// Kita petakan ke key yang dipakai di activeLayers
// Key = nilai 'kategori' yang tersimpan di DB (via Admin TabFasilitas)
// Value = key di state activeLayers (yang di-toggle user di LayerManager)
const KATEGORI_TO_LAYER_KEY = {
  'PUSKESWAN':     'puskeswan',
  'PASAR':         'pasarTernak',
  'KLINIK_HEWAN':  'klinikHewan',
  'RPH':           'rph',
  'LAHAN_GEMBALA': 'lahanGembala',
  'KOORDINAT':     'kordinat',
};

const createCustomIcon = (emoji, bgColor) => {
  if (!L.divIcon) return null;
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${bgColor};" class="w-8 h-8 flex items-center justify-center rounded-full shadow-lg border-2 border-white text-sm transform hover:scale-110 transition-transform">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const icons = {
  puskeswan: createCustomIcon("🏥", "#10b981"), 
  pasarTernak: createCustomIcon("🏪", "#f59e0b"),  
  klinikHewan: createCustomIcon("⚕️", "#3b82f6"),  
  rph: createCustomIcon("🥩", "#ef4444"),
  lahanGembala: createCustomIcon("🌾", "#84cc16"),
  populasiNonKugi: createCustomIcon("🐄", "#8b5cf6")
};

// =====================================================================
// 2. EXTRACTOR NAMA WILAYAH
// =====================================================================
const extractRegionName = (feature) => {
  const props = feature.properties;
  if (!props) return "Wilayah Tidak Diketahui";
  const possibleKeys = ["WADMKK", "NM_KAB", "KABUPATEN", "KAB_KOTA", "NAME_2", "NAME"];
  for (let pk of possibleKeys) {
    const match = Object.keys(props).find(k => k.toLowerCase() === pk.toLowerCase());
    if (match && props[match] && typeof props[match] === 'string') return props[match].trim();
  }
  return "Wilayah Tidak Diketahui";
};

const extractKecamatanName = (feature) => {
  const props = feature.properties;
  if (!props) return "Kecamatan Tidak Diketahui";
  return props.KECAMATAN || props.WADMKC || props.NM_KEC || props.name || "Kecamatan Tidak Diketahui";
};

// =====================================================================
// 3. KOMPONEN PENGENDALI PETA
// =====================================================================
const MapController = ({ centerData }) => {
  const map = useMap();
  useEffect(() => {
    if (centerData && centerData.lat && centerData.lng) {
      map.flyTo([centerData.lat, centerData.lng], centerData.zoom || 9, { animate: true, duration: 1.5 });
    }
  }, [centerData, map]);
  return null;
};

// =====================================================================
// 4. KOMPONEN PETA UTAMA
// =====================================================================
const MainMap = ({ onSelectKabupaten, activeLayers, mapStyle, mapCenter, layerKey, fasilitasData }) => {
  const geoJsonRef = useRef(null);
  const geoJsonKecRef = useRef(null);

  const styleWilayah = (feature) => {
    const nama = extractRegionName(feature);
    const colorIndex = getHashCode(nama) % NEON_COLORS.length;
    return {
      color: NEON_COLORS[colorIndex],
      weight: 2,
      opacity: 0.8,
      fillColor: NEON_COLORS[colorIndex],
      fillOpacity: 0.05,
    };
  };

  /** Style khusus batas Kecamatan: tipis, dashed, warna terang */
  const styleKecamatan = () => ({
    color: '#94a3b8',       // slate-400
    weight: 1,
    opacity: 0.6,
    fillColor: 'transparent',
    fillOpacity: 0,
    dashArray: '4 4',
  });

  const onEachWilayah = (feature, layer) => {
    const namaKabupaten = extractRegionName(feature);
    const labelNama = namaKabupaten.toUpperCase().replace("KABUPATEN ", "KAB. ");
    
    if (layer.getBounds) {
      const center = layer.getBounds().getCenter();
      feature.properties._centerLat = center.lat;
      feature.properties._centerLng = center.lng;
    }
    
    if(layer.bindTooltip) {
      layer.bindTooltip(`<div class="font-bold text-white text-[10px] uppercase shadow-lg" style="text-shadow: 1px 1px 2px black;">${labelNama}</div>`, { 
        permanent: true, direction: 'center', className: '!bg-transparent !border-none !shadow-none' 
      });
    }

    if (layer.on) {
      layer.on({
        mouseover: (e) => { e.target.setStyle({ weight: 4, fillOpacity: 0.2 }); },
        mouseout: (e) => { if (geoJsonRef.current) geoJsonRef.current.resetStyle(e.target); },
        click: (e) => {
          // 👇 Cukup lempar namanya saja, sisanya diurus fungsi utama
          onSelectKabupaten(labelNama);
          if(e.target._map) e.target._map.fitBounds(e.target.getBounds(), { padding: [50, 50] });
        }
      });
    }
  };

  /** Event handler khusus kecamatan: hover tooltip + highlight */
  const onEachKecamatan = (feature, layer) => {
    const namaKec = extractKecamatanName(feature);
    const namaKab = feature.properties.Kabupaten || extractRegionName(feature);

    if (layer.bindTooltip) {
      layer.bindTooltip(
        `<div style="text-align:center;">
          <div style="font-weight:800;font-size:12px;color:#0f172a;margin-bottom:2px;">Kec. ${namaKec}</div>
          <div style="font-size:10px;color:#64748b;">${namaKab}</div>
        </div>`,
        { sticky: true, direction: 'top', className: 'leaflet-tooltip-kecamatan' }
      );
    }

    if (layer.on) {
      layer.on({
        mouseover: (e) => {
          e.target.setStyle({ weight: 2.5, color: '#facc15', opacity: 1, fillColor: '#facc15', fillOpacity: 0.1, dashArray: '' });
          e.target.bringToFront();
        },
        mouseout: (e) => {
          if (geoJsonKecRef.current) geoJsonKecRef.current.resetStyle(e.target);
        },
      });
    }
  };

  // 👇 Kelompokkan data fasilitas dari API berdasarkan layerKey-nya
  const fasilitasByLayer = useMemo(() => {
    const grouped = {};
    if (!fasilitasData || fasilitasData.length === 0) return grouped;
    fasilitasData.forEach(item => {
      const key = KATEGORI_TO_LAYER_KEY[item.kategori];
      if (key) {
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      }
    });
    return grouped;
  }, [fasilitasData]);

  // Render markers untuk satu kategori fasilitas
  const renderFasilitasMarkers = (layerKey, iconKey) => {
    if (!activeLayers[layerKey] || !fasilitasByLayer[layerKey]) return null;
    return fasilitasByLayer[layerKey].map(f => (
      <Marker key={f.id} position={[f.latitude, f.longitude]} icon={icons[iconKey] || icons.puskeswan}>
        <Popup className="inpeta-popup" closeButton={false} maxWidth={280} minWidth={220}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "4px 2px", minWidth: 200 }}>
            {/* Kategori Badge */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "3px 10px", borderRadius: 20,
              background: "rgba(13,148,136,0.15)", border: "1px solid rgba(13,148,136,0.25)",
              color: "#5eead4", fontSize: 10, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0d9488", display: "inline-block" }} />
              {f.kategori || "Fasilitas"}
            </span>

            {/* Nama */}
            <h3 style={{ margin: "10px 0 6px", fontSize: 15, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.3 }}>
              {f.nama_lokasi}
            </h3>

            {/* Alamat */}
            {f.alamat && (
              <p style={{ margin: "0 0 4px", fontSize: 11.5, color: "#94a3b8", lineHeight: 1.45 }}>
                {f.alamat}
              </p>
            )}

            {/* Wilayah */}
            {f.wilayah && (
              <p style={{ margin: "0 0 8px", fontSize: 11, color: "#64748b" }}>
                📍 {f.wilayah.nama_wilayah || f.wilayah}
              </p>
            )}

            {/* Divider + Petunjuk Arah Button */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const lat = f.latitude;
                const lng = f.longitude;
                if (lat == null || lng == null || !isFinite(lat) || !isFinite(lng)) {
                  console.warn(`[InPETA] Koordinat tidak valid untuk "${f.nama_lokasi}"`);
                  return;
                }
                const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: 6, width: "100%", padding: "8px 0", borderRadius: 8,
                border: "1px solid rgba(13,148,136,0.3)", background: "rgba(13,148,136,0.12)",
                color: "#5eead4", fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
                cursor: "pointer", transition: "all 0.2s ease",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(13,148,136,0.25)";
                e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(13,148,136,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(13,148,136,0.12)";
                e.currentTarget.style.borderColor = "rgba(13,148,136,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              title={`Buka rute ke ${f.nama_lokasi || "lokasi"} di Google Maps`}
            >
              🧭 Petunjuk Arah
            </button>
          </div>
        </Popup>
      </Marker>
    ));
  };

  return (
    <MapContainer center={[4.6951, 96.7494]} zoom={8} zoomControl={false} className="w-full h-full bg-slate-900 z-0">
      <MapController centerData={mapCenter} />
      
      {mapStyle === 'satellite' ? (
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" />
      ) : (
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
      )}
      
      {/* 👇 Layer Batas Kabupaten */}
      {activeLayers.kabupaten && dataKabupaten && (
        <GeoJSON key={"kab-" + layerKey} ref={geoJsonRef} data={dataKabupaten} style={styleWilayah} onEachFeature={onEachWilayah} />
      )}

      {/* 👇 Layer Batas Kecamatan */}
      {activeLayers.kecamatan && dataKecamatan && (
        <GeoJSON key={"kec-" + layerKey} ref={geoJsonKecRef} data={dataKecamatan} style={styleKecamatan} onEachFeature={onEachKecamatan} />
      )}
      
      {/* 👇 Layer Fasilitas — Data dari API (bukan dummy lagi) */}
      {renderFasilitasMarkers('puskeswan', 'puskeswan')}
      {renderFasilitasMarkers('pasarTernak', 'pasarTernak')}
      {renderFasilitasMarkers('klinikHewan', 'klinikHewan')}
      {renderFasilitasMarkers('rph', 'rph')}
      {renderFasilitasMarkers('lahanGembala', 'lahanGembala')}
      {renderFasilitasMarkers('kordinat', 'populasiNonKugi')}

      <ZoomControl position="bottomright" />
    </MapContainer>
  );
};


// =====================================================================
// 5. KOMPONEN LAYER MANAGER (INTERNAL)
// =====================================================================
const themeColors = {
  green: { cardActive: "border-green-400 bg-green-50/50 shadow-green-500/10 ring-2 ring-green-400/20", iconBg: "bg-green-50 dark:bg-green-900/30", iconColor: "text-green-500 dark:text-green-400" },
  orange: { cardActive: "border-orange-400 bg-orange-50/50 shadow-orange-500/10 ring-2 ring-orange-400/20", iconBg: "bg-orange-50 dark:bg-orange-900/30", iconColor: "text-orange-500 dark:text-orange-400" },
  blue: { cardActive: "border-blue-400 bg-blue-50/50 shadow-blue-500/10 ring-2 ring-blue-400/20", iconBg: "bg-blue-50 dark:bg-blue-900/30", iconColor: "text-blue-500 dark:text-blue-400" },
  indigo: { cardActive: "border-indigo-400 bg-indigo-50/50 shadow-indigo-500/10 ring-2 ring-indigo-400/20", iconBg: "bg-indigo-50 dark:bg-indigo-900/30", iconColor: "text-indigo-500 dark:text-indigo-400" },
  pink: { cardActive: "border-pink-400 bg-pink-50/50 shadow-pink-500/10 ring-2 ring-pink-400/20", iconBg: "bg-pink-50 dark:bg-pink-900/30", iconColor: "text-pink-500 dark:text-pink-400" },
  red: { cardActive: "border-red-400 bg-red-50/50 shadow-red-500/10 ring-2 ring-red-400/20", iconBg: "bg-red-50 dark:bg-red-900/30", iconColor: "text-red-500 dark:text-red-400" },
  purple: { cardActive: "border-purple-400 bg-purple-50/50 shadow-purple-500/10 ring-2 ring-purple-400/20", iconBg: "bg-purple-50 dark:bg-purple-900/30", iconColor: "text-purple-500 dark:text-purple-400" },
  teal: { cardActive: "border-teal-400 bg-teal-50/50 shadow-teal-500/10 ring-2 ring-teal-400/20", iconBg: "bg-teal-50 dark:bg-teal-900/30", iconColor: "text-teal-500 dark:text-teal-400" }
};

const StethoscopeIcon = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
    <circle cx="20" cy="10" r="2"/>
  </svg>
);

const LAYER_CATEGORIES = [
  { title: "Batas Wilayah", gridCols: "grid-cols-2", items: [{ key: "kabupaten", label: "Kabupaten", icon: MapIcon, color: "green" }, { key: "kecamatan", label: "Kecamatan", icon: SquareDashed, color: "green" }] },
  { title: "Lahan & Habitat", gridCols: "grid-cols-2", items: [{ key: "lahanGembala", label: "Gembala", icon: Leaf, color: "green" }, { key: "populasiNonKugi", label: "Non Kugi", icon: Beef, color: "orange" }] },
  { title: "Fasilitas & Lokasi", gridCols: "grid-cols-3", items: [{ key: "kordinat", label: "Kordinat", icon: MapPin, color: "blue" }, { key: "puskeswan", label: "Puskeswan", icon: StethoscopeIcon, color: "indigo" }, { key: "pasarTernak", label: "Pasar Ternak", icon: Store, color: "pink" }] },
  { title: "Layanan", gridCols: "grid-cols-3", items: [{ key: "rph", label: "RPH", icon: Home, color: "orange" }, { key: "klinikHewan", label: "Klinik Hewan", icon: BriefcaseMedical, color: "teal" }, { key: "potongHewan", label: "Potong Hewan", icon: Scissors, color: "red" }] },
  { title: "Lainnya", gridCols: "grid-cols-3", items: [{ key: "geospasial", label: "Geospasial", icon: Globe, color: "blue" }, { key: "poly1", label: "Polygon", icon: Hexagon, color: "purple" }, { key: "resetPeta", label: "Reset Peta", icon: MapIcon, color: "teal" }] }
];

const FeatureCard = ({ item, isActive, onToggle }) => {
  const theme = themeColors[item.color] || themeColors.blue;
  const IconComponent = item.icon;
  return (
    <motion.button onClick={onToggle} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.88 }}
      className={`relative flex flex-col items-center justify-center p-3 h-24 rounded-2xl border transition-all duration-300 ease-out outline-none overflow-hidden ${isActive ? theme.cardActive : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-white/60 dark:border-slate-700/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600'}`}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className={`absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full ${theme.iconBg}`}>
            <CheckCircle2 size={10} className={theme.iconColor} strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300 ${theme.iconBg} ${isActive ? 'scale-110' : 'scale-100'}`}>
        <IconComponent size={22} className={theme.iconColor} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span className={`text-[10px] font-bold text-center leading-tight tracking-wide px-1 ${isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
        {item.label}
      </span>
    </motion.button>
  );
};

const LayerManager = ({ activeLayers, toggleLayer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const totalActive = Object.values(activeLayers).filter(Boolean).length;

  return (
    <div className="absolute top-5 left-4 md:top-6 md:left-6 z-[900] flex flex-col items-start">
      <AnimatePresence>
        {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[-1]" />}
      </AnimatePresence>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.92 }} onClick={() => setIsOpen(!isOpen)}
        className={`relative z-20 flex items-center gap-3 px-5 py-3.5 rounded-full backdrop-blur-xl shadow-xl border transition-all font-bold text-sm ${isOpen ? 'bg-slate-800/90 text-white border-slate-700/50 dark:bg-slate-100/90 dark:text-slate-900 dark:border-white/50' : 'bg-white/90 dark:bg-slate-900/90 border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-white/100'}`}
      >
        <Layers size={18} className={isOpen ? 'text-white dark:text-slate-900' : 'text-green-600'} />
        <span>Menu Fitur</span>
        <AnimatePresence>
          {totalActive > 0 && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black ml-1 ${isOpen ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900' : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'}`}>
              {totalActive}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(5px)" }} transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={`fixed md:absolute top-24 left-4 right-4 md:left-0 md:right-auto md:top-full md:mt-2 w-auto md:w-[350px] max-h-[calc(100vh-120px)] md:max-h-[75vh] flex flex-col bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] md:shadow-2xl border border-white/60 dark:border-slate-700/50 overflow-hidden z-10`}
          >
            <div className="flex items-center justify-between px-6 py-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md z-20 shrink-0 border-b border-white/30 dark:border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/70 dark:bg-slate-800/70 flex items-center justify-center shadow-sm"><LayoutGrid size={16} className="text-slate-600 dark:text-slate-300" /></div>
                <span className="font-extrabold text-[15px] text-slate-800 dark:text-white tracking-tight">Fitur Peta</span>
              </div>
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/70 dark:bg-slate-800/70 text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center shadow-sm">
                <ChevronLeft size={16} strokeWidth={3} />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-6 space-y-6">
              {LAYER_CATEGORIES.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h3 className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400">{group.title}</h3>
                  <div className={`grid ${group.gridCols} gap-3`}>
                    {group.items.map((item) => <FeatureCard key={item.key} item={item} isActive={activeLayers[item.key]} onToggle={() => toggleLayer(item.key)} />)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-t border-white/30 dark:border-slate-700/30 shrink-0">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm">
                Lihat Semua Data <LayoutGrid size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// =====================================================================
// 6. MAIN PAGE EXPORT (PetaWilayah)
// =====================================================================
const STAT_CARDS = [
  { key: "sapi", icon: Beef, label: "Sapi", field: "totalSapi", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", iconBg: "bg-blue-500" },
  { key: "kambing", icon: Egg, label: "Kambing", field: "totalKambing", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20", iconBg: "bg-amber-500" },
  { key: "ayam", icon: Bird, label: "Ayam", field: "totalAyam", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-100 dark:border-rose-500/20", iconBg: "bg-rose-500" },
];

export default function PetaWilayah() {
  const [selectedKab, setSelectedKab] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  
  // 👇 STATE BARU: Untuk menyimpan ID wilayah dari database biar kita tahu harus manggil ID berapa
  const [dbWilayahMap, setDbWilayahMap] = useState({});

  // 👇 STATE FASILITAS: Menyimpan data titik lokasi fasilitas dari API
  const [fasilitasData, setFasilitasData] = useState([]);
  
  const [activeLayers, setActiveLayers] = useState({
    kabupaten: true, kecamatan: false, puskeswan: false, pasarTernak: false, klinikHewan: false, 
    rph: false, lahanGembala: false, kordinat: false, poly1: false, poly2: false, info1: false
  });
  const [layerKey, setLayerKey] = useState(0);

  const [aiResponse, setAiResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mapStyle, setMapStyle] = useState('satellite');
  const [mapCenter, setMapCenter] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const stats = useMemo(() => calcStats(), []);

  // 👇 EFEK: Ambil semua data wilayah & fasilitas dari database di awal
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Ambil mapping wilayah
        const resWilayah = await api.get('/wilayah');
        const mapping = {};
        resWilayah.data.data.forEach(w => {
          mapping[w.nama_wilayah.toUpperCase()] = w.id;
        });
        setDbWilayahMap(mapping);

        // 2. Ambil semua fasilitas untuk marker peta
        const resFasilitas = await api.get('/fasilitas');
        setFasilitasData(resFasilitas.data.data || []);
      } catch (error) {
        console.error("Gagal menarik data awal dari API", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    if (!searchQuery.trim() || !dataKabupaten) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = dataKabupaten.features.filter(f => extractRegionName(f).toLowerCase().includes(query)).slice(0, 5);
    setSearchResults(results);
  }, [searchQuery]);

  // 👇 FUNGSI KLIK UTAMA YANG SUDAH DI-UPGRADE PAKAI API
  const handleSelectKabupaten = async (namaWilayah) => {
    setPanelOpen(true);
    setAiResponse(null);
    setIsAnalyzing(false);

    // Cocokkan nama wilayah yang diklik dengan ID di database
    const wilayahId = dbWilayahMap[namaWilayah.toUpperCase()];

    // Kalau ID-nya nggak ketemu di database (artinya admin belum nginput wilayah ini)
    if (!wilayahId) {
      setSelectedKab({
        name: namaWilayah,
        kosong: true, // Kasih tanda kalau datanya kosong
        sapi: 0, kambing: 0, ayam: 0, populasi: 0
      });
      return;
    }

    // Kalau ID ketemu, munculkan loading dulu
    setSelectedKab({ name: namaWilayah, isLoading: true });

    try {
      // Tarik populasinya dari API!
      const response = await api.get(`/populasi/${wilayahId}`);
      const popData = response.data.data;
      
      setSelectedKab({
        name: namaWilayah,
        isLoading: false,
        kosong: false,
        sapi: popData.jml_sapi,
        kambing: popData.jml_kambing,
        ayam: popData.jml_ayam,
        get populasi() { return this.sapi + this.kambing + this.ayam; }
      });
    } catch (error) {
      // Kalau ditarik tapi populasinya belum diisi admin
      console.error(error);
      setSelectedKab({
        name: namaWilayah,
        isLoading: false,
        kosong: true,
        sapi: 0, kambing: 0, ayam: 0, populasi: 0
      });
    }
  };

  const handleSearchSelect = (feature) => {
    const namaKab = extractRegionName(feature).toUpperCase().replace("KABUPATEN ", "KAB. ");
    // 👇 Lempar ke fungsi API kita
    handleSelectKabupaten(namaKab);

    if (feature.properties._centerLat && feature.properties._centerLng) {
      setMapCenter({ lat: feature.properties._centerLat, lng: feature.properties._centerLng, zoom: 10 });
    }

    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const toggleLayer = (key) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
    // Force GeoJSON re-render to avoid Leaflet mounting bugs
    if (key === 'kabupaten' || key === 'kecamatan') {
      setLayerKey(prev => prev + 1);
    }
  };

  const analyzeWithGemini = async (kabData) => {
    setIsAnalyzing(true);
    setAiResponse(null);
    const apiKey = ""; 
    
    if (!apiKey) {
      setTimeout(() => {
        setAiResponse("Silakan masukkan API Key Gemini pada source code untuk fitur AI.");
        setIsAnalyzing(false);
      }, 800);
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Buat 1 paragraf analisis potensi peternakan di ${kabData.name}, Aceh. Sapi: ${kabData.sapi}, Kambing: ${kabData.kambing}, Ayam: ${kabData.ayam}.` }] }] }),
      });
      const data = await response.json();
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal memuat analisis.");
    } catch {
      setAiResponse("Koneksi gagal. Periksa jaringan atau API Key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* ── NAVBAR ── */}
      <nav className="h-[72px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 z-[1000] px-4 md:px-8 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <a href="/" className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 hover:bg-white transition-all shadow-inner"><ArrowLeft size={20} className="text-slate-500" /></a>
          {LogoInpeta ? (
             <img src={LogoInpeta} alt="Logo" className="h-10 w-auto hidden sm:block" onError={(e) => { e.target.style.display = 'none'; }} />
          ) : null}
          <div className="sm:hidden flex flex-col"><span className="text-sm font-black text-slate-800 dark:text-white uppercase">InPETA</span></div>
        </div>
        
        {/* Pencarian Pintar */}
        <div className="flex-1 max-w-xl mx-8 hidden md:block relative z-[1050]">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors" size={18} />
            <input 
              ref={searchRef} type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Cari wilayah Kabupaten/Kota di Aceh..." 
              className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-green-500/30 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm text-slate-700 dark:text-slate-200" 
            />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><X className="w-3.5 h-3.5 text-slate-500" /></button>}
          </div>
          
          <AnimatePresence>
            {isSearchFocused && searchResults.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {searchResults.map((result, idx) => (
                  <button key={idx} onClick={() => handleSearchSelect(result)} className="w-full text-left px-5 py-3 hover:bg-green-50 dark:hover:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0 transition-colors">
                    <MapPin size={16} className="text-green-500" />{extractRegionName(result)}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-500 border border-slate-200/50 dark:border-white/5 hover:scale-105 transition-all">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* ── HYBRID LAYOUT ── */}
      <div className="flex-1 flex relative overflow-hidden bg-slate-200 dark:bg-slate-950">
        
        {/* AREA PETA */}
        <div className="flex-1 relative z-0">
          <MainMap onSelectKabupaten={handleSelectKabupaten} activeLayers={activeLayers} mapStyle={mapStyle} mapCenter={mapCenter} layerKey={layerKey} fasilitasData={fasilitasData} />

          {/* KOMPONEN LAYER MANAGER DI-EMBED DI SINI */}
          <LayerManager activeLayers={activeLayers} toggleLayer={toggleLayer} />

          {/* Kontrol Peta (Kiri Bawah) */}
          <div className="absolute bottom-8 left-4 z-[800] flex flex-col gap-3">
            <button onClick={() => setMapCenter({ lat: 4.6951, lng: 96.7494, zoom: 8 })} className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-700 dark:text-slate-300 shadow-xl border border-slate-200/50 dark:border-slate-700 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
              <LocateFixed size={20} />
            </button>
            <button onClick={() => setMapStyle(prev => prev === 'satellite' ? 'street' : 'satellite')} className={`w-12 h-12 rounded-2xl shadow-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 backdrop-blur-md ${mapStyle === 'street' ? 'bg-green-600 text-white border-green-600' : 'bg-white/95 dark:bg-slate-900/95 border-slate-200/50 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>
              <MapIcon size={20} />
            </button>
          </div>

          {/* MOBILE DASHBOARD TRIGGER */}
          {!panelOpen && (
            <button onClick={() => setPanelOpen(true)} className="lg:hidden absolute bottom-8 right-4 z-[800] flex items-center gap-3 px-6 py-4 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl font-black text-xs tracking-widest active:scale-95 transition-transform">
              <BarChart3 size={18} /> DATA
            </button>
          )}
        </div>

        {/* SIDEBAR PANEL (KANAN) */}
        <AnimatePresence>
          {panelOpen && (
            <motion.aside
              initial={{ x: window.innerWidth > 1024 ? 360 : 0, y: window.innerWidth > 1024 ? 0 : "100%" }}
              animate={{ x: 0, y: 0 }}
              exit={{ x: window.innerWidth > 1024 ? 360 : 0, y: window.innerWidth > 1024 ? 0 : "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className={`
                fixed bottom-0 left-0 right-0 z-[900]
                max-h-[60vh] rounded-t-[48px] 
                lg:relative lg:max-h-full lg:rounded-none lg:w-[360px] lg:z-10
                flex flex-col bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl
                border-t lg:border-t-0 lg:border-l border-slate-200/60 dark:border-white/5 
                shadow-[-15px_0_40px_rgba(0,0,0,0.1)]
                overflow-hidden
              `}
            >
              <div className="lg:hidden flex justify-center py-4"><div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" /></div>
              
              <div className="px-8 py-6 flex items-center justify-between shrink-0">
                <div><h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Wawasan Data</h2><p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Provinsi Aceh</p></div>
                <button onClick={() => setPanelOpen(false)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all active:rotate-90"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-6 no-scrollbar">
                <AnimatePresence mode="wait">
                  {selectedKab ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[32px] bg-gradient-to-br from-green-500 to-emerald-700 p-6 shadow-2xl shadow-green-500/30 text-white relative overflow-hidden">
                      <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full"><MapPin size={12} /><span className="text-[9px] font-black uppercase tracking-widest">Detail Wilayah</span></div>
                        <h4 className="text-xl font-black mb-6 leading-tight">{selectedKab.name}</h4>
                        
                        {/* 👇 Tampilan Berubah Tergantung Status Loading/Kosong */}
                        {selectedKab.isLoading ? (
                          <div className="flex flex-col items-center justify-center py-6">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
                            <p className="text-xs text-white/70">Menarik data dari server...</p>
                          </div>
                        ) : selectedKab.kosong ? (
                           <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-white/30 rounded-2xl bg-black/10">
                            <ShieldAlert size={28} className="text-white/60 mb-2" />
                            <p className="text-xs font-bold text-white/90">Data Belum Diinput</p>
                            <p className="text-[10px] text-white/60 mt-1">Admin belum memasukkan data untuk wilayah ini.</p>
                          </div>
                        ) : (
                          <div className="space-y-4 mb-8">
                            {[{ l: "Sapi", v: selectedKab.sapi, i: Beef }, { l: "Kambing", v: selectedKab.kambing, i: Egg }, { l: "Ayam", v: selectedKab.ayam, i: Bird }].map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center"><div className="flex items-center gap-3"><item.i size={16} className="text-white/60" /><span className="text-xs font-bold uppercase tracking-tighter">{item.l}</span></div><span className="font-black text-sm tabular-nums tracking-wide">{formatNumber(item.v)}</span></div>
                            ))}
                          </div>
                        )}

                        <button onClick={() => analyzeWithGemini(selectedKab)} disabled={isAnalyzing || selectedKab.isLoading || selectedKab.kosong} className="w-full mt-6 py-4 rounded-2xl bg-white text-green-700 font-black text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50">
                          {isAnalyzing ? <div className="animate-spin w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full" /> : <Sparkles size={16} />} ANALISIS POTENSI AI
                        </button>
                        {aiResponse && <div className="mt-4 p-4 rounded-2xl bg-black/10 backdrop-blur-md border border-white/10 text-[11px] text-white/90 leading-relaxed font-medium italic shadow-inner">{aiResponse.replace(/\*/g, '')}</div>}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="p-8 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center text-center opacity-60">
                      <MapPin size={32} className="text-slate-300 mb-4" />
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Pilih wilayah di peta untuk rincian data</p>
                    </div>
                  )}
                </AnimatePresence>

                <div className="space-y-4 pt-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-2">Populasi Provinsi</h5>
                  {STAT_CARDS.map(card => (
                    <div key={card.key} className={`rounded-[32px] border p-6 shadow-sm group ${card.bg} ${card.border}`}>
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}><card.icon size={28} className="text-white" /></div>
                        <div className="flex flex-col"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{card.label}</span><span className={`text-2xl font-black tabular-nums ${card.color}`}>{formatNumber(stats[card.field])}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* TOGGLE SIDEBAR (DESKTOP) */}
        <motion.button onClick={() => setPanelOpen(!panelOpen)} initial={false} animate={{ right: panelOpen ? 360 : 0 }} className="hidden lg:flex absolute top-1/2 -translate-y-1/2 z-[950] items-center justify-center w-8 h-24 rounded-l-3xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-[-10px_0_30px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-white/5 border-r-0 text-slate-400 hover:text-slate-900 transition-all cursor-pointer">
          {panelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </motion.button>

      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .leaflet-container { background: #0f172a !important; }
        .leaflet-control-zoom { border: none !important; margin-bottom: 2rem !important; margin-right: 1rem !important; }
        .leaflet-control-zoom a { background: rgba(255,255,255,0.9) !important; color: #334155 !important; border: 1px solid #e2e8f0 !important; border-radius: 12px !important; margin-bottom: 5px !important; width: 36px !important; height: 36px !important; line-height: 36px !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important; }
        .leaflet-tooltip-kecamatan { background: rgba(255,255,255,0.95) !important; border: 1px solid #e2e8f0 !important; border-radius: 10px !important; padding: 6px 10px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; font-family: inherit !important; }
        .leaflet-tooltip-kecamatan::before { border-top-color: rgba(255,255,255,0.95) !important; }
      `}</style>
    </div>
  );
}