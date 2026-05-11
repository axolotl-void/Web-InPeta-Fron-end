import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, Search, X, Check, Map, MapPin,
  Palette, ChevronDown, BarChart3
} from "lucide-react";
import api from "../../api";
import { useToast } from "../../context/ToastContext";
import SummaryCard from "./SummaryCard";

// =====================================================================
// KONFIGURASI
// =====================================================================
const LEVEL_OPTIONS = [
  { value: "KABUPATEN", label: "Kabupaten/Kota", color: "blue" },
  { value: "KECAMATAN", label: "Kecamatan", color: "teal" },
];

const levelColor = {
  KABUPATEN: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-500/30" },
  KECAMATAN: { bg: "bg-teal-50 dark:bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-500/30" },
};

const DEFAULT_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export default function TabWilayah({ refreshTrigger }) {
  const { showToast } = useToast();

  // --- Data State ---
  const [listWilayah, setListWilayah] = useState([]);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Modal State: Wilayah Create/Edit ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const emptyForm = { nama_wilayah: "", level: "KABUPATEN", warna_area: "#10b981" };
  const [form, setForm] = useState(emptyForm);

  // --- Modal State: Populasi Update ---
  const [isPopulasiModal, setIsPopulasiModal] = useState(false);
  const [selectedWilayah, setSelectedWilayah] = useState(null);
  const [populasiForm, setPopulasiForm] = useState({
    jml_sapi: 0, jml_kambing: 0, jml_ayam: 0, tahun: 2024,
  });

  // --- Delete Confirmation ---
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

  // =====================================================================
  // FETCH DATA
  // =====================================================================
  const fetchWilayah = useCallback(async () => {
    try {
      const res = await api.get("/wilayah", config);
      setListWilayah(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchWilayah();
  }, [refreshTrigger, fetchWilayah]);

  // =====================================================================
  // WILAYAH CRUD HANDLERS
  // =====================================================================
  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (w) => {
    setEditId(w.id);
    setForm({
      nama_wilayah: w.nama_wilayah,
      level: w.level || "KABUPATEN",
      warna_area: w.warna_area || "#10b981",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_wilayah.trim()) {
      return showToast("Nama wilayah wajib diisi!", "error");
    }
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/admin/wilayah/${editId}`, form, config);
        showToast("Wilayah berhasil diperbarui!", "success");
      } else {
        await api.post("/admin/wilayah", form, config);
        showToast("Wilayah berhasil ditambahkan!", "success");
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditId(null);
      fetchWilayah();
    } catch (err) {
      showToast("Gagal menyimpan: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/wilayah/${id}`, config);
      showToast("Wilayah berhasil dihapus!", "success");
      setDeleteConfirm(null);
      fetchWilayah();
    } catch (err) {
      showToast("Gagal menghapus: " + (err.response?.data?.error || err.message), "error");
    }
  };

  // =====================================================================
  // POPULASI HANDLERS
  // =====================================================================
  const openEditPopulasi = (w) => {
    setSelectedWilayah(w);
    setPopulasiForm({
      jml_sapi: 0, jml_kambing: 0, jml_ayam: 0, tahun: 2024,
    });
    setIsPopulasiModal(true);
  };

  const submitPopulasi = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/populasi/${selectedWilayah.id}`, populasiForm, config);
      setIsPopulasiModal(false);
      fetchWilayah();
      showToast("Data populasi berhasil diperbarui!", "success");
    } catch (err) {
      showToast("Gagal update populasi!", "error");
    }
  };

  // =====================================================================
  // FILTERED & STATS
  // =====================================================================
  const filtered = listWilayah.filter((w) => {
    const matchSearch = w.nama_wilayah.toLowerCase().includes(search.toLowerCase());
    const matchLevel = !filterLevel || w.level === filterLevel;
    return matchSearch && matchLevel;
  });

  const totalKab = listWilayah.filter((w) => w.level === "KABUPATEN").length;
  const totalKec = listWilayah.filter((w) => w.level === "KECAMATAN").length;

  // =====================================================================
  // RENDER
  // =====================================================================
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <SummaryCard
          icon={Map}
          count={listWilayah.length}
          label="Total Wilayah"
          color="green"
          index={0}
        />
        <SummaryCard
          icon={MapPin}
          count={totalKab}
          label="Kabupaten/Kota"
          color="blue"
          index={1}
        />
        <SummaryCard
          icon={MapPin}
          count={totalKec}
          label="Kecamatan"
          color="teal"
          index={2}
        />
      </div>

      {/* ── ACTION BAR ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text" placeholder="Cari wilayah..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500/20 outline-none font-medium text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="relative">
            <select
              value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}
              className="pl-10 pr-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold text-sm appearance-none cursor-pointer text-slate-900 dark:text-slate-100"
            >
              <option value="">Semua Level</option>
              {LEVEL_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95 text-sm shrink-0"
        >
          <Plus size={20} /> Tambah Wilayah
        </button>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[32px] shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Info Wilayah</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center">Level</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center">Warna</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-16 text-center">
                <Map className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="font-bold text-slate-400">Belum ada data wilayah</p>
                <p className="text-xs text-slate-400 mt-1">Klik tombol "Tambah Wilayah" untuk memulai.</p>
              </td></tr>
            )}
            {filtered.map((w) => {
              const lc = levelColor[w.level] || levelColor.KABUPATEN;
              return (
                <tr key={w.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0"
                        style={{ backgroundColor: w.warna_area || "#94a3b8" }}
                      >
                        {w.nama_wilayah?.[0] || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-white truncate">{w.nama_wilayah}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">ID: {w.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1.5 ${lc.bg} ${lc.text} text-[10px] font-black rounded-xl uppercase border ${lc.border}`}>
                      {w.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div
                        className="w-8 h-8 rounded-full border-4 border-white dark:border-slate-700 shadow-md"
                        style={{ backgroundColor: w.warna_area || "#e2e8f0" }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openEditPopulasi(w)} title="Update Populasi"
                        className="p-2.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-xl transition-all"
                      >
                        <BarChart3 size={16} />
                      </button>
                      <button onClick={() => openEdit(w)} title="Edit Wilayah"
                        className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirm(w.id)} title="Hapus Wilayah"
                        className="p-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                      >
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

      {/* ══════════════════════════════════════════════════════
          MODAL: DELETE CONFIRMATION
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Hapus Wilayah?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Semua data <strong>populasi</strong> dan <strong>fasilitas</strong> yang terkait juga akan dihapus.</p>
              <p className="text-xs text-red-400 font-bold mb-6">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >Batal</button>
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all"
                >Ya, Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          MODAL: CREATE / EDIT WILAYAH
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-[36px] shadow-2xl p-8 relative my-8"
            >
              <button onClick={() => { setIsModalOpen(false); setEditId(null); setForm(emptyForm); }}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                <X size={18} />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  {editId ? "Edit Wilayah" : "Tambah Wilayah Baru"}
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  {editId ? "Perbarui data wilayah yang dipilih." : "Isi formulir di bawah untuk menambah wilayah baru."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* NAMA WILAYAH */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Nama Wilayah</label>
                  <input
                    type="text" required value={form.nama_wilayah}
                    onChange={(e) => setForm({ ...form, nama_wilayah: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm"
                    placeholder="Contoh: KABUPATEN ACEH BESAR"
                  />
                </div>

                {/* LEVEL */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Level</label>
                  <select value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm appearance-none cursor-pointer"
                  >
                    {LEVEL_OPTIONS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>

                {/* WARNA AREA */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">
                    <Palette size={12} className="inline mr-1" /> Warna Area
                  </label>
                  <div className="flex items-center gap-3">
                    {/* Color Swatches */}
                    <div className="flex flex-wrap gap-2 flex-1">
                      {DEFAULT_COLORS.map((c) => (
                        <button key={c} type="button" onClick={() => setForm({ ...form, warna_area: c })}
                          className={`w-8 h-8 rounded-xl transition-all ${form.warna_area === c ? "ring-2 ring-offset-2 ring-green-500 scale-110" : "hover:scale-105"}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    {/* Custom Color Picker */}
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="color" value={form.warna_area}
                        onChange={(e) => setForm({ ...form, warna_area: e.target.value })}
                        className="w-10 h-10 rounded-xl border-2 border-slate-200 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-400 uppercase">{form.warna_area}</span>
                    </div>
                  </div>
                </div>

                {/* PREVIEW */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-md shrink-0"
                    style={{ backgroundColor: form.warna_area || "#94a3b8" }}
                  >
                    {form.nama_wilayah?.[0] || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate">
                      {form.nama_wilayah || "Nama Wilayah"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{form.level}</p>
                  </div>
                </div>

                {/* SUBMIT */}
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-base hover:bg-green-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-green-600/20"
                >
                  <Check size={22} /> {loading ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Simpan Wilayah"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          MODAL: UPDATE POPULASI
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isPopulasiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-[36px] shadow-2xl p-8 relative"
            >
              <button onClick={() => setIsPopulasiModal(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                <X size={18} />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Update Populasi</h3>
                <p className="text-sm text-slate-400 font-medium">
                  Wilayah: <span className="text-green-600 font-bold">{selectedWilayah?.nama_wilayah}</span>
                </p>
              </div>

              <form onSubmit={submitPopulasi} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Tahun</label>
                    <input type="number" required value={populasiForm.tahun}
                      onChange={(e) => setPopulasiForm({ ...populasiForm, tahun: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Jml Sapi</label>
                    <input type="number" required value={populasiForm.jml_sapi}
                      onChange={(e) => setPopulasiForm({ ...populasiForm, jml_sapi: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Jml Kambing</label>
                    <input type="number" required value={populasiForm.jml_kambing}
                      onChange={(e) => setPopulasiForm({ ...populasiForm, jml_kambing: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Jml Ayam</label>
                    <input type="number" required value={populasiForm.jml_ayam}
                      onChange={(e) => setPopulasiForm({ ...populasiForm, jml_ayam: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm"
                    />
                  </div>
                </div>
                <button type="submit"
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-base hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-600/20"
                >
                  <Check size={22} /> Simpan Populasi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}