/**
 * MainMap.jsx — Komponen Peta Interaktif Choropleth
 *
 * Menampilkan peta choropleth interaktif wilayah Aceh
 * menggunakan react-leaflet dengan fitur:
 * - Pewarnaan otomatis berdasarkan populasi ternak (gradasi hijau)
 * - Hover highlight & tooltip informatif
 * - Klik wilayah untuk filter data
 * - Custom legend & zoom controls
 *
 * Statistik ringkas (calcStats, formatNumber) di-export
 * untuk digunakan oleh komponen panel luar (PetaWilayah).
 *
 * Pustaka: react-leaflet, framer-motion, lucide-react
 */

import { useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight, Layers, ZoomIn, ZoomOut, LocateFixed } from "lucide-react";
import "leaflet/dist/leaflet.css";

import acehGeoJSON from "../data/aceh_kabupaten.json";
import dummyData from "../data/dummyData.json";
import MapMarkers from "./MapMarkers";
import { formatNumber } from "../utils/mapUtils";

/* =============================================
   Konfigurasi Peta
   ============================================= */
const MAP_CENTER = [4.1755, 96.7763];
const MAP_ZOOM = 7.5;
const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>';

/* =============================================
   Fungsi Pewarnaan Choropleth — Gradasi Emerald
   ============================================= */
function getColor(jumlah_ternak) {
  if (jumlah_ternak > 120000) return "#064e3b"; // primary-900
  if (jumlah_ternak > 100000) return "#065f46"; // primary-800
  if (jumlah_ternak > 80000) return "#047857";  // primary-700
  if (jumlah_ternak > 60000) return "#059669";  // primary-600
  if (jumlah_ternak > 40000) return "#10b981";  // primary-500
  if (jumlah_ternak > 20000) return "#34d399";  // primary-400
  if (jumlah_ternak > 10000) return "#6ee7b7";  // primary-300
  return "#a7f3d0";                               // primary-200
}

/* =============================================
   Legend Config
   ============================================= */
const LEGEND_ITEMS = [
  { min: "> 120rb", color: "#064e3b" },
  { min: "100–120rb", color: "#065f46" },
  { min: "80–100rb", color: "#047857" },
  { min: "60–80rb", color: "#059669" },
  { min: "40–60rb", color: "#10b981" },
  { min: "20–40rb", color: "#34d399" },
  { min: "10–20rb", color: "#6ee7b7" },
  { min: "< 10rb", color: "#a7f3d0" },
];

/* =============================================
   Komponen: Custom Zoom Control
   ============================================= */
function CustomZoomControl() {
  const map = useMap();

  return (
    <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 rounded-xl bg-white/90 dark:bg-surface-800/90 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-surface-700/90 hover:border-primary-500/30 transition-all duration-200 shadow-lg"
        aria-label="Zoom in"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 rounded-xl bg-white/90 dark:bg-surface-800/90 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-surface-700/90 hover:border-primary-500/30 transition-all duration-200 shadow-lg"
        aria-label="Zoom out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={() => map.setView(MAP_CENTER, MAP_ZOOM)}
        className="w-10 h-10 rounded-xl bg-white/90 dark:bg-surface-800/90 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-surface-700/90 hover:border-primary-500/30 transition-all duration-200 shadow-lg"
        aria-label="Reset view"
      >
        <LocateFixed className="w-4 h-4" />
      </button>
    </div>
  );
}


/* =============================================
   Komponen: Legend
   ============================================= */
function MapLegend() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="absolute bottom-6 left-4 z-[1000]"
    >
      <div className="bg-white/90 dark:bg-surface-900/85 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-surface-200">Populasi Ternak</span>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-400 dark:text-surface-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
        </button>

        {/* Items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 pt-1 space-y-1.5">
                {LEGEND_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div
                      className="w-5 h-3.5 rounded-sm border border-slate-200 dark:border-white/10 shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] text-slate-500 dark:text-surface-400">{item.min}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* =============================================
   Komponen: Tooltip Info Wilayah
   ============================================= */
function RegionTooltip({ data, position }) {
  if (!data) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={data.name}
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[2000] pointer-events-none"
        style={{
          left: position.x + 16,
          top: position.y - 10,
        }}
      >
        <div className="bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/15 rounded-xl px-4 py-3 shadow-xl dark:shadow-2xl min-w-[200px]">
          {/* Nama Kabupaten */}
          <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-slate-100 dark:border-white/10">
            <MapPin className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">{data.name}</h4>
          </div>

          {/* Detail Populasi */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-surface-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Sapi
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-surface-200 tabular-nums">{formatNumber(data.sapi)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-surface-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Kambing
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-surface-200 tabular-nums">{formatNumber(data.kambing)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-surface-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                Ayam
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-surface-200 tabular-nums">{formatNumber(data.ayam)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-surface-500 font-medium">Total Populasi</span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 tabular-nums">{formatNumber(data.populasi)}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* =============================================
   Komponen Utama: MainMap
   ============================================= */
export default function MainMap({ onSelectKabupaten }) {
  const geoJsonRef = useRef(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedRegion, setSelectedRegion] = useState(null);

  /** Style default setiap feature GeoJSON */
  const mapStyle = useCallback((feature) => ({
    fillColor: getColor(feature.properties.populasi || 0),
    weight: 1.5,
    opacity: 1,
    color: "rgba(255, 255, 255, 0.6)",
    dashArray: "3",
    fillOpacity: 0.7,
  }), []);

  /** Highlight style saat hover */
  const highlightStyle = {
    weight: 3,
    color: "#fbbf24", // accent-400
    dashArray: "",
    fillOpacity: 0.85,
    opacity: 1,
  };

  /** Event handlers untuk setiap feature */
  const onEachFeature = useCallback((feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle(highlightStyle);
        target.bringToFront();
        setHoveredRegion(feature.properties);
      },
      mouseout: (e) => {
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target);
        }
        // Re-apply selected style if needed
        if (selectedRegion && feature.properties.id === selectedRegion.id) {
          e.target.setStyle({
            weight: 3,
            color: "#fbbf24",
            dashArray: "",
            fillOpacity: 0.9,
          });
        }
        setHoveredRegion(null);
      },
      mousemove: (e) => {
        setMousePos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
      },
      click: (e) => {
        const props = feature.properties;
        setSelectedRegion(props);

        // Callback ke parent jika ada
        if (onSelectKabupaten) {
          onSelectKabupaten(props);
        }
      },
    });
  }, [onSelectKabupaten, selectedRegion]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* === Peta Leaflet === */}
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: "#0f172a" }}
      >
        {/* CartoDB Voyager Tile */}
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

        {/* GeoJSON Layer — Choropleth */}
        <GeoJSON
          ref={geoJsonRef}
          data={acehGeoJSON}
          style={mapStyle}
          onEachFeature={onEachFeature}
        />

        {/* Marker Layer — Puskeswan dengan Clustering */}
        <MapMarkers
          places={dummyData.puskeswan.map((p) => ({
            ...p,
            kategori: p.kategori || "Puskeswan",
          }))}
        />

        {/* Custom Zoom Controls */}
        <CustomZoomControl />
      </MapContainer>

      {/* === Legend (Kiri Bawah) === */}
      <MapLegend />

      {/* === Tooltip Mengikuti Mouse === */}
      <RegionTooltip data={hoveredRegion} position={mousePos} />

      {/* === Selected Region Badge (Kanan Atas) === */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 z-[1000]"
          >
            <div className="bg-white/95 dark:bg-surface-900/85 backdrop-blur-xl border border-slate-200 dark:border-primary-500/20 rounded-2xl px-5 py-4 shadow-xl dark:shadow-2xl max-w-[240px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Dipilih</span>
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white mb-3">{selectedRegion.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 dark:text-surface-400">Sapi</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-white tabular-nums">{formatNumber(selectedRegion.sapi)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 dark:text-surface-400">Kambing</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-white tabular-nums">{formatNumber(selectedRegion.kambing)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 dark:text-surface-400">Ayam</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-white tabular-nums">{formatNumber(selectedRegion.ayam)}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/10 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 dark:text-surface-500 font-medium">Total</span>
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400 tabular-nums">{formatNumber(selectedRegion.populasi)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRegion(null)}
                className="mt-3 w-full text-[11px] font-medium text-slate-400 dark:text-surface-400 hover:text-slate-700 dark:hover:text-white py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200"
              >
                Hapus Seleksi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Map Overlay Gradient (Bawah) === */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100/40 dark:from-surface-900/40 to-transparent z-[500] pointer-events-none rounded-b-2xl" />
    </div>
  );
}
