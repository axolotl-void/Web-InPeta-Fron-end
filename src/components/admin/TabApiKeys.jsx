import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key, Plus, Copy, Check, Trash2, ToggleLeft, ToggleRight,
  Shield, Download, FileSpreadsheet, AlertCircle, Search,
  Eye, EyeOff, Clock, X
} from "lucide-react";
import api from "../../api";
import { useToast } from "../../context/ToastContext";
import SummaryCard from "./SummaryCard";

export default function TabApiKeys({ refreshTrigger }) {
  const { showToast } = useToast();
  const [keys, setKeys] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [revealedIds, setRevealedIds] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [generating, setGenerating] = useState(false);

  const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/api-keys", config);
      setKeys(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (e) {
      console.error(e);
      showToast("Gagal memuat API Keys", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchKeys(); }, [refreshTrigger, fetchKeys]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!description.trim()) return showToast("Deskripsi wajib diisi!", "error");

    setGenerating(true);
    try {
      const res = await api.post("/admin/api-keys", { description: description.trim() }, config);
      showToast("API Key berhasil dibuat!", "success");
      setIsModalOpen(false);
      setDescription("");
      fetchKeys();
      // Auto-reveal the newly created key
      if (res.data?.data?.id) {
        setRevealedIds(prev => new Set(prev).add(res.data.data.id));
      }
    } catch (err) {
      showToast("Gagal membuat API Key: " + (err.response?.data?.error || err.message), "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async (key, id) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedId(id);
      showToast("API Key berhasil disalin ke clipboard!", "success");
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      showToast("Gagal menyalin. Coba manual.", "error");
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/admin/api-keys/${id}/toggle`, {}, config);
      showToast(res.data?.message || "Status berhasil diubah!", "success");
      fetchKeys();
    } catch (err) {
      showToast("Gagal mengubah status: " + (err.response?.data?.error || err.message), "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/api-keys/${id}`, config);
      showToast("API Key berhasil dihapus!", "success");
      setDeleteConfirm(null);
      fetchKeys();
    } catch (err) {
      showToast("Gagal menghapus: " + (err.response?.data?.error || err.message), "error");
    }
  };

  const toggleReveal = (id) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // --- CSV EXPORT HANDLERS ---
  const handleExportCsv = async (type) => {
    try {
      showToast(`Mengunduh data ${type}...`, "success");
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5000/api/export-${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Gagal mengunduh file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_inpeta_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast(`Data ${type} berhasil diunduh!`, "success");
    } catch (err) {
      showToast("Gagal mengunduh: " + err.message, "error");
    }
  };

  const maskKey = (key) => {
    if (!key) return "";
    return key.slice(0, 12) + "••••••••••••••••••••" + key.slice(-6);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filtered = keys.filter((k) =>
    k.description.toLowerCase().includes(search.toLowerCase()) ||
    k.key.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = keys.filter((k) => k.isActive).length;
  const inactiveCount = keys.filter((k) => !k.isActive).length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <SummaryCard icon={Key} count={keys.length} label="Total API Keys" color="blue" index={0} />
        <SummaryCard icon={Shield} count={activeCount} label="Aktif" color="green" index={1} />
        <SummaryCard icon={AlertCircle} count={inactiveCount} label="Nonaktif" color="red" index={2} />
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text" placeholder="Cari API Key..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500/20 outline-none font-medium text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          {/* CSV EXPORT BUTTONS */}
          <button onClick={() => handleExportCsv("fasilitas")}
            className="flex items-center gap-2 px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-sm transition-all active:scale-95 text-sm group"
          >
            <FileSpreadsheet size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline">Export Fasilitas</span>
            <span className="lg:hidden">CSV</span>
          </button>
          <button onClick={() => handleExportCsv("populasi")}
            className="flex items-center gap-2 px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:border-teal-300 dark:hover:border-teal-500/30 hover:text-teal-700 dark:hover:text-teal-400 shadow-sm transition-all active:scale-95 text-sm group"
          >
            <Download size={18} className="text-teal-500 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline">Export Populasi</span>
            <span className="lg:hidden">CSV</span>
          </button>
          {/* GENERATE KEY BUTTON */}
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95 text-sm"
          >
            <Plus size={20} /> Generate API Key
          </button>
        </div>
      </div>

      {/* API USAGE HINT */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/5 dark:to-indigo-500/5 border border-blue-200/60 dark:border-blue-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-blue-100 dark:bg-blue-500/15 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="text-blue-600 dark:text-blue-400" size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Cara Menggunakan API Key</p>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/70 leading-relaxed">
              Sertakan header <code className="bg-blue-100 dark:bg-blue-500/20 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">x-api-key: inpeta_xxx...</code> di setiap request ke endpoint publik
              (<code className="bg-blue-100 dark:bg-blue-500/20 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">/api/public/fasilitas</code>,
              <code className="bg-blue-100 dark:bg-blue-500/20 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">/api/public/populasi</code>).
            </p>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[32px] shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Deskripsi</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">API Key</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center hidden md:table-cell">Status</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center hidden lg:table-cell">Dibuat</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {loading && (
              <tr><td colSpan={5} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold text-slate-400">Memuat data...</p>
                </div>
              </td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-16 text-center">
                <Key className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={40} />
                <p className="font-bold text-slate-400 dark:text-slate-500">Belum ada API Key</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Klik tombol "Generate API Key" untuk membuat key baru.</p>
              </td></tr>
            )}
            {!loading && filtered.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all">
                {/* Description */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.isActive ? "bg-green-50 dark:bg-green-500/10" : "bg-slate-100 dark:bg-slate-700"}`}>
                      <Key className={item.isActive ? "text-green-600 dark:text-green-400" : "text-slate-400 dark:text-slate-500"} size={18} />
                    </div>
                    <p className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{item.description}</p>
                  </div>
                </td>
                {/* API Key (masked/revealed) */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 max-w-[280px] truncate select-all">
                      {revealedIds.has(item.id) ? item.key : maskKey(item.key)}
                    </code>
                    <button onClick={() => toggleReveal(item.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                      title={revealedIds.has(item.id) ? "Sembunyikan" : "Tampilkan"}
                    >
                      {revealedIds.has(item.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </td>
                {/* Status */}
                <td className="px-6 py-4 text-center hidden md:table-cell">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-xl uppercase border ${
                    item.isActive
                      ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30"
                      : "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border-red-200 dark:border-red-500/30"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? "bg-green-500" : "bg-red-500"}`} />
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                {/* Created Date */}
                <td className="px-6 py-4 text-center hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock size={12} />
                    <span className="font-medium">{formatDate(item.createdAt)}</span>
                  </div>
                </td>
                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => handleCopy(item.key, item.id)}
                      className={`p-2.5 rounded-xl transition-all ${
                        copiedId === item.id
                          ? "bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400"
                          : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      }`}
                      title="Salin Key"
                    >
                      {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button onClick={() => handleToggle(item.id)}
                      className={`p-2.5 rounded-xl transition-all ${
                        item.isActive
                          ? "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                          : "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10"
                      }`}
                      title={item.isActive ? "Nonaktifkan" : "Aktifkan"}
                    >
                      {item.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                    <button onClick={() => setDeleteConfirm(item.id)}
                      className="p-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Hapus API Key?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Key yang dihapus tidak dapat dikembalikan. Semua akses menggunakan key ini akan terputus.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">Batal</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all">Ya, Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GENERATE KEY MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-[36px] shadow-2xl p-8 relative"
            >
              <button onClick={() => { setIsModalOpen(false); setDescription(""); }}
                className="absolute top-6 right-6 p-2.5 bg-white/90 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-600 rounded-xl shadow-lg border border-slate-100 dark:border-slate-600 transition-all duration-300 z-[1050] group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                  <Key className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white text-center">Generate API Key Baru</h3>
                <p className="text-sm text-slate-400 font-medium mt-1 text-center">Key akan digenerate otomatis secara aman menggunakan crypto</p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Deskripsi / Pengguna</label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-sm border border-slate-200 dark:border-slate-700"
                    placeholder="Contoh: Aplikasi Mobile InPETA, Mitra Dinas Peternakan"
                    autoFocus
                  />
                </div>

                <div className="bg-amber-50/80 dark:bg-amber-500/5 border border-amber-200/60 dark:border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                      API Key hanya ditampilkan sekali setelah dibuat. Pastikan untuk menyalinnya ke tempat yang aman.
                    </p>
                  </div>
                </div>

                <button type="submit" disabled={generating}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-base hover:bg-green-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-green-600/20"
                >
                  <Key size={22} />
                  {generating ? "Generating..." : "Generate API Key"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
