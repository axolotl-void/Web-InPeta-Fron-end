import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, Search, X, Check, MapPin, Filter,
  Navigation, Building2, ShoppingCart, Crosshair
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import api from "../../api";
import { useToast } from "../../context/ToastContext";
import SummaryCard from "./SummaryCard";

// Fix default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const KATEGORI_OPTIONS = [
  { value: "PUSKESWAN", label: "Puskeswan", icon: Building2, color: "blue" },
  { value: "PASAR", label: "Pasar Hewan", icon: ShoppingCart, color: "amber" },
  { value: "KLINIK_HEWAN", label: "Klinik Hewan", icon: Building2, color: "teal" },
  { value: "RPH", label: "RPH", icon: Building2, color: "red" },
  { value: "LAHAN_GEMBALA", label: "Lahan Gembala", icon: Crosshair, color: "green" },
  { value: "KOORDINAT", label: "Koordinat Lain", icon: Crosshair, color: "violet" },
];

const getKategoriMeta = (val) =>
  KATEGORI_OPTIONS.find((k) => k.value === val) || KATEGORI_OPTIONS[2];

const colorMap = {
  blue: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-500/30", ring: "focus:ring-blue-500/20", accent: "border-l-blue-500" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-500/30", ring: "focus:ring-amber-500/20", accent: "border-l-amber-500" },
  violet: { bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-200 dark:border-violet-500/30", ring: "focus:ring-violet-500/20", accent: "border-l-violet-500" },
  teal: { bg: "bg-teal-50 dark:bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-500/30", ring: "focus:ring-teal-500/20", accent: "border-l-teal-500" },
  red: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-500/30", ring: "focus:ring-red-500/20", accent: "border-l-red-500" },
  green: { bg: "bg-green-50 dark:bg-green-500/10", text: "text-green-600 dark:text-green-400", border: "border-green-200 dark:border-green-500/30", ring: "focus:ring-green-500/20", accent: "border-l-green-500" },
};

// --- MAP CLICK HANDLER ---
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// --- FLY TO LOCATION ---
function FlyToLocation({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 14, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

// --- COORDINATE PICKER MAP ---
function CoordinatePickerMap({ latitude, longitude, onLocationSelect }) {
  const center = latitude && longitude ? [latitude, longitude] : [4.7, 96.75];
  const zoom = latitude && longitude ? 14 : 8;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 flex items-center gap-2">
        <Navigation size={14} className="text-white" />
        <span className="text-xs font-bold text-white tracking-wide">
          KLIK PETA UNTUK MEMILIH KOORDINAT
        </span>
      </div>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "280px", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {latitude && longitude && (
          <>
            <Marker position={[latitude, longitude]} />
            <FlyToLocation lat={latitude} lng={longitude} />
          </>
        )}
      </MapContainer>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function TabFasilitas({ refreshTrigger }) {
  const { showToast } = useToast();
  const [list, setList] = useState([]);
  const [listWilayah, setListWilayah] = useState([]);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    nama_lokasi: "", kategori: "PUSKESWAN", latitude: "", longitude: "",
    alamat: "", wilayah_id: "",
  };
  const [form, setForm] = useState(emptyForm);

  const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

  const fetchData = useCallback(async () => {
    try {
      const [fas, wil] = await Promise.all([
        api.get("/admin/fasilitas", config),
        api.get("/wilayah", config),
      ]);
      setList(Array.isArray(fas.data) ? fas.data : []);
      setListWilayah(Array.isArray(wil.data?.data) ? wil.data.data : []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchData(); }, [refreshTrigger, fetchData]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      nama_lokasi: item.nama_lokasi,
      kategori: item.kategori,
      latitude: item.latitude,
      longitude: item.longitude,
      alamat: item.alamat || "",
      wilayah_id: item.wilayah_id,
    });
    setIsModalOpen(true);
  };

  const handleMapClick = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_lokasi || !form.kategori || !form.latitude || !form.longitude || !form.wilayah_id) {
      return showToast("Lengkapi semua field wajib!", "error");
    }
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/admin/fasilitas/${editId}`, form, config);
        showToast("Fasilitas berhasil diperbarui!", "success");
      } else {
        await api.post("/admin/fasilitas", form, config);
        showToast("Fasilitas berhasil ditambahkan!", "success");
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditId(null);
      fetchData();
    } catch (err) {
      showToast("Gagal menyimpan: " + (err.response?.data?.error || err.message), "error");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/fasilitas/${id}`, config);
      showToast("Fasilitas berhasil dihapus!", "success");
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      showToast("Gagal menghapus: " + (err.response?.data?.error || err.message), "error");
    }
  };

  // Filtered list
  const filtered = list.filter((item) => {
    const matchSearch = item.nama_lokasi.toLowerCase().includes(search.toLowerCase()) ||
      (item.alamat || "").toLowerCase().includes(search.toLowerCase());
    const matchKat = !filterKategori || item.kategori === filterKategori;
    return matchSearch && matchKat;
  });

  // Stats
  const stats = KATEGORI_OPTIONS.map((k) => ({
    ...k,
    count: list.filter((i) => i.kategori === k.value).length,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map((s, idx) => (
          <SummaryCard
            key={s.value}
            icon={s.icon}
            count={s.count}
            label={s.label}
            color={s.color}
            index={idx}
          />
        ))}
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text" placeholder="Cari fasilitas..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500/20 outline-none font-medium text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="relative">
            <select
              value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}
              className="pl-10 pr-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold text-sm appearance-none cursor-pointer text-slate-900 dark:text-slate-100"
            >
              <option value="">Semua</option>
              {KATEGORI_OPTIONS.map((k) => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </select>
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95 text-sm shrink-0"
        >
          <Plus size={20} /> Tambah Fasilitas
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[32px] shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Nama Lokasi</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center">Kategori</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center hidden md:table-cell">Wilayah</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center hidden lg:table-cell">Koordinat</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-16 text-center">
                <MapPin className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="font-bold text-slate-400">Belum ada data fasilitas</p>
                <p className="text-xs text-slate-400 mt-1">Klik tombol "Tambah Fasilitas" untuk memulai.</p>
              </td></tr>
            )}
            {filtered.map((item) => {
              const meta = getKategoriMeta(item.kategori);
              const c = colorMap[meta.color];
              return (
                <tr key={item.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                        <meta.icon className={c.text} size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-white truncate">{item.nama_lokasi}</p>
                        {item.alamat && <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[240px]">{item.alamat}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1.5 ${c.bg} ${c.text} text-[10px] font-black rounded-xl uppercase border ${c.border}`}>
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center hidden md:table-cell">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {item.wilayah?.nama_wilayah || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center hidden lg:table-cell">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openEdit(item)} className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirm(item.id)} className="p-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Hapus Fasilitas?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">Batal</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all">Ya, Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CREATE/EDIT */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-[36px] shadow-2xl p-8 relative m-auto shrink-0"
            >
              <button onClick={() => { setIsModalOpen(false); setEditId(null); setForm(emptyForm); }}
                className="absolute top-6 right-6 p-2.5 bg-white/90 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-600 rounded-xl shadow-lg border border-slate-100 dark:border-slate-600 transition-all duration-300 z-[1050] group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  {editId ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  {editId ? "Perbarui data fasilitas yang dipilih." : "Klik peta di bawah untuk memilih lokasi koordinat."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* MAP PICKER */}
                <CoordinatePickerMap
                  latitude={form.latitude ? parseFloat(form.latitude) : null}
                  longitude={form.longitude ? parseFloat(form.longitude) : null}
                  onLocationSelect={handleMapClick}
                />

                {/* LAT / LNG DISPLAY */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Latitude</label>
                    <input type="number" step="any" required value={form.latitude}
                      onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-mono text-sm"
                      placeholder="4.695135"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Longitude</label>
                    <input type="number" step="any" required value={form.longitude}
                      onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-mono text-sm"
                      placeholder="96.749397"
                    />
                  </div>
                </div>

                {/* NAMA LOKASI */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Nama Lokasi</label>
                  <input type="text" required value={form.nama_lokasi}
                    onChange={(e) => setForm({ ...form, nama_lokasi: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm"
                    placeholder="Contoh: Puskeswan Banda Aceh"
                  />
                </div>

                {/* KATEGORI & WILAYAH */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Kategori</label>
                    <select value={form.kategori}
                      onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm appearance-none cursor-pointer"
                    >
                      {KATEGORI_OPTIONS.map((k) => (
                        <option key={k.value} value={k.value}>{k.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Wilayah</label>
                    <select required value={form.wilayah_id}
                      onChange={(e) => setForm({ ...form, wilayah_id: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm appearance-none cursor-pointer"
                    >
                      <option value="">-- Pilih Wilayah --</option>
                      {listWilayah.map((wilayah) => (
                        <option key={wilayah.id} value={wilayah.id}>{wilayah.nama_wilayah}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ALAMAT */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Alamat (Opsional)</label>
                  <textarea rows="2" value={form.alamat}
                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-medium text-sm resize-none"
                    placeholder="Jl. Contoh No. 123, Kecamatan ..."
                  />
                </div>

                {/* SUBMIT */}
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-base hover:bg-green-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-green-600/20"
                >
                  <Check size={22} /> {loading ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Simpan Fasilitas"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
