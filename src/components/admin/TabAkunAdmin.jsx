import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, Search, X, Check, Users, Shield,
  Mail, Lock, Eye, EyeOff, UserPlus, Loader2, AlertCircle, User
} from "lucide-react";
import api from "../../api";
import { useToast } from "../../context/ToastContext";
import SummaryCard from "./SummaryCard";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "STAFF", label: "Staff" },
];

const roleBadge = {
  SUPER_ADMIN: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  ADMIN: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  STAFF: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
};

export default function TabAkunAdmin({ refreshTrigger }) {
  const { showToast } = useToast();

  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ nama_lengkap: "", email: "", password: "", role: "STAFF" });
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/admin/users", config);
      setUsersList(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [refreshTrigger, fetchUsers]);

  const openCreate = () => {
    setEditUser(null);
    setForm({ nama_lengkap: "", email: "", password: "", role: "STAFF" });
    setShowPassword(false);
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({ nama_lengkap: u.nama_lengkap, email: u.email, password: "", role: u.role });
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
    setForm({ nama_lengkap: "", email: "", password: "", role: "STAFF" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_lengkap.trim() || !form.email.trim())
      return showToast("Nama dan email wajib diisi!", "error");
    if (!editUser && !form.password)
      return showToast("Password wajib diisi!", "error");
    if (form.password && form.password.length < 6)
      return showToast("Password minimal 6 karakter!", "error");

    setSaving(true);
    try {
      if (editUser) {
        const payload = { nama_lengkap: form.nama_lengkap, email: form.email, role: form.role };
        await api.put(`/admin/users/${editUser.id}`, payload, config);
        showToast("Data admin berhasil diperbarui!", "success");
      } else {
        await api.post("/admin/users", form, config);
        showToast("Admin baru berhasil ditambahkan!", "success");
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || "Gagal menyimpan data", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`, config);
      showToast("Akun admin berhasil dihapus!", "success");
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || "Gagal menghapus", "error");
    }
  };

  const toggleStatus = async (u) => {
    try {
      await api.put(`/admin/users/${u.id}`, { is_active: !u.is_active }, config);
      showToast(`Status berhasil diubah!`, "success");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || "Gagal mengubah status", "error");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const filtered = usersList.filter(u =>
    u.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const isSelf = (u) => u.email === currentUser.email;

  // Skeleton
  if (isLoading) return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between"><div className="h-12 bg-slate-200 rounded-2xl w-80" /><div className="h-12 bg-slate-200 rounded-2xl w-48" /></div>
      {[1,2,3].map(i => <div key={i} className="h-20 bg-white border border-slate-100 rounded-3xl" />)}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <SummaryCard
          icon={Users}
          count={usersList.length}
          label="Total Admin"
          color="green"
          index={0}
        />
        <SummaryCard
          icon={Shield}
          count={usersList.filter(u => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length}
          label="Admin"
          color="emerald"
          index={1}
        />
        <SummaryCard
          icon={User}
          count={usersList.filter(u => u.role === "STAFF").length}
          label="Staff"
          color="blue"
          index={2}
        />
      </div>

      {/* ── ACTION BAR ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 sm:w-80 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Cari admin..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-500/20 outline-none font-medium text-sm text-slate-900 dark:text-slate-100" />
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95 text-sm shrink-0">
          <Plus size={20} /> Tambah Admin Baru
        </button>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[32px] shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Info Admin</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center">Role</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center">Status</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center">Tanggal Dibuat</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-16 text-center">
                <Users className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="font-bold text-slate-400">Belum ada data admin</p>
                <p className="text-xs text-slate-400 mt-1">Klik "Tambah Admin Baru" untuk memulai.</p>
              </td></tr>
            )}
            {filtered.map((u) => {
              const badge = roleBadge[u.role] || roleBadge.STAFF;
              const self = isSelf(u);
              return (
                <tr key={u.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                          {getInitials(u.nama_lengkap)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-white truncate">
                          {u.nama_lengkap}
                          {self && <span className="ml-2 text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-lg font-black">ANDA</span>}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1.5 text-[10px] font-black rounded-xl uppercase border ${badge}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => !self && toggleStatus(u)} disabled={self}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all ${
                        u.is_active
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                          : "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                      } ${self ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                      <span className={`w-2 h-2 rounded-full ${u.is_active ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
                      {u.is_active ? "Aktif" : "Non-aktif"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{formatDate(u.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openEdit(u)} title="Edit Admin" disabled={self}
                        className={`p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all ${self ? "opacity-30 cursor-not-allowed" : ""}`}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => !self && setDeleteConfirm(u.id)} title="Hapus Admin" disabled={self}
                        className={`p-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all ${self ? "opacity-30 cursor-not-allowed" : ""}`}>
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

      {/* ══ MODAL: DELETE CONFIRMATION ══ */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="text-red-500" size={28} /></div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Hapus Akun Admin?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Akun ini akan dihapus secara permanen dari sistem.</p>
              <p className="text-xs text-red-400 font-bold mb-6">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">Batal</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all">Ya, Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ MODAL: CREATE / EDIT ADMIN ══ */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl rounded-[36px] shadow-2xl p-8 relative my-8 border border-white/20 dark:border-slate-700/50">
              {/* Subtle gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent rounded-t-[36px]" />

              <button onClick={closeModal}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                <X size={18} />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                  <UserPlus size={22} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  {editUser ? "Edit Admin" : "Tambah Admin Baru"}
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  {editUser ? "Perbarui data admin yang dipilih." : "Isi formulir di bawah untuk membuat akun admin baru."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* NAMA */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" required value={form.nama_lengkap}
                      onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="Contoh: Ahmad Fauzi" />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Email</label>
                  <div className="relative">
                    <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      placeholder="admin@inpeta.com" />
                  </div>
                </div>

                {/* PASSWORD (only for create) */}
                {!editUser && (
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Password</label>
                    <div className="relative">
                      <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type={showPassword ? "text" : "password"} required value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        placeholder="Minimal 6 karakter" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    {form.password && form.password.length < 6 && (
                      <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 flex items-center gap-1"><AlertCircle size={12} /> Minimal 6 karakter</p>
                    )}
                  </div>
                )}

                {/* ROLE */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Role / Hak Akses</label>
                  <div className="relative">
                    <Shield size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer">
                      {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* SUBMIT */}
                <button type="submit" disabled={saving}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-base hover:bg-green-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-green-600/20">
                  {saving ? <><Loader2 size={22} className="animate-spin" /> Menyimpan...</> : <><Check size={22} /> {editUser ? "Simpan Perubahan" : "Tambah Admin"}</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
