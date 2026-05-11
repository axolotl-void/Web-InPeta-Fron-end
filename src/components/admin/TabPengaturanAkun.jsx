/**
 * TabPengaturanAkun.jsx — Halaman Pengaturan Akun Premium
 * 
 * Fitur:
 *  - Glassmorphism card dengan green/teal accents
 *  - Framer Motion micro-animations
 *  - Edit profil (nama + email)
 *  - Upload avatar
 *  - Ubah password dengan strength meter
 *  - Info akun (role, status, created/updated timestamps)
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, Eye, EyeOff, Camera, Save,
  Shield, CalendarDays, CheckCircle2, AlertCircle,
  Loader2, Pencil, KeyRound, UserCircle, Sparkles,
  Clock, BadgeCheck, X
} from "lucide-react";
import api from "../../api";

// ══════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ══════════════════════════════════════════════════════
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const shimmer = {
  hidden: { x: "-100%" },
  visible: { x: "100%", transition: { repeat: Infinity, duration: 1.5, ease: "linear" } }
};

// ══════════════════════════════════════════════════════
// MINI COMPONENTS
// ══════════════════════════════════════════════════════

/** Inline toast alert (success/error) */
const StatusAlert = ({ message, type, onClose }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        className="overflow-hidden"
      >
        <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-semibold border ${
          type === "success"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-red-50 text-red-600 border-red-200"
        }`}>
          {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="flex-1">{message}</span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 transition-colors">
            <X size={14} />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/** Password strength bar */
const PasswordStrength = ({ password }) => {
  const getStrength = (p) => {
    let s = 0;
    if (!p) return 0;
    if (p.length > 6) s++;
    if (p.length > 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  };

  const score = getStrength(password);
  const labels = ["Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"];
  const colors = ["bg-slate-300", "bg-red-500", "bg-orange-400", "bg-green-500", "bg-emerald-500"];
  const textColors = ["text-slate-400", "text-red-500", "text-orange-500", "text-green-600", "text-emerald-600"];

  if (!password) return null;

  return (
    <div className="pt-2 space-y-1.5">
      <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: i < score ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: i * 0.05 }}
            className={`flex-1 origin-left rounded-full ${i < score ? colors[score] : "bg-transparent"}`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-bold ${textColors[score]}`}>
        Kekuatan: {labels[score]}
      </p>
    </div>
  );
};

/** Glassmorphism section card */
const SectionCard = ({ children, className = "" }) => (
  <motion.div
    variants={itemVariants}
    className={`relative overflow-hidden bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-700/50 rounded-[28px] p-7 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
  >
    {/* Subtle gradient shimmer on top */}
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
    {children}
  </motion.div>
);

/** Section title with icon */
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-4 mb-6">
    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-0.5">{subtitle}</p>
    </div>
  </div>
);

/** Labeled input field */
const InputField = ({ label, icon: Icon, type = "text", value, onChange, placeholder, disabled, id }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-1.5">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon size={17} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-emerald-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  </div>
);

/** Password input with toggle */
const PasswordField = ({ label, value, onChange, placeholder, id }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-bold text-slate-600 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Lock size={17} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
        </div>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-11 pr-12 py-3.5 bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-emerald-500/10 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Toggle visibility"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
};

// Skeleton loader
const SkeletonLoader = () => (
  <div className="space-y-6 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white border border-slate-100 rounded-[28px] p-7">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-slate-200" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded-lg w-32" />
            <div className="h-3 bg-slate-100 rounded-lg w-48" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-slate-100 rounded-2xl" />
          <div className="h-12 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    ))}
  </div>
);


// ══════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════
export default function TabPengaturanAkun({ refreshTrigger }) {
  // --- State ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });

  // Avatar
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState({ text: "", type: "" });
  const fileInputRef = useRef(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // --- Fetch user data ---
  const fetchAccount = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/account", { headers });
      const u = res.data.data;
      setUser(u);
      setNamaLengkap(u.nama_lengkap);
      setEmail(u.email);
    } catch (err) {
      console.error("Gagal memuat data akun:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccount(); }, [refreshTrigger]);

  // --- Handlers ---
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ text: "", type: "" });
    try {
      const res = await api.put("/admin/account/profile", { nama_lengkap: namaLengkap, email }, { headers });
      setUser(res.data.data);
      // Update local storage agar sidebar/header terbaru
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.nama = res.data.data.nama_lengkap;
      stored.email = res.data.data.email;
      localStorage.setItem("user", JSON.stringify(stored));
      window.dispatchEvent(new Event("user-updated"));
      
      setProfileMsg({ text: res.data.message, type: "success" });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.error || "Gagal menyimpan profil", type: "error" });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarSaving(true);
    setAvatarMsg({ text: "", type: "" });
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.put("/admin/account/avatar", formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      setUser(res.data.data);
      
      // Update local storage & trigger header refresh
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.avatar_url = res.data.data.avatar_url;
      localStorage.setItem("user", JSON.stringify(stored));
      window.dispatchEvent(new Event("user-updated"));

      setAvatarMsg({ text: res.data.message, type: "success" });
    } catch (err) {
      setAvatarMsg({ text: err.response?.data?.error || "Gagal mengunggah avatar", type: "error" });
    } finally {
      setAvatarSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "Konfirmasi password tidak cocok!", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: "Password baru minimal 6 karakter!", type: "error" });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await api.put("/admin/account/password", {
        current_password: currentPassword,
        new_password: newPassword,
      }, { headers });
      setPasswordMsg({ text: res.data.message, type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg({ text: err.response?.data?.error || "Gagal mengubah password", type: "error" });
    } finally {
      setPasswordSaving(false);
    }
  };

  // --- Format date helper ---
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  // Initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  // --- Loading state ---
  if (loading) return <SkeletonLoader />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-6 pb-10"
    >

      {/* ═══════════════════════════════════════
          SECTION 1: AVATAR & IDENTITY CARD
          ═══════════════════════════════════════ */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-28 h-28 rounded-[28px] overflow-hidden border-[3px] border-emerald-200 shadow-lg shadow-emerald-500/10 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                  <span className="text-3xl font-black text-white tracking-tighter">
                    {getInitials(user?.nama_lengkap)}
                  </span>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                {avatarSaving ? (
                  <Loader2 size={24} className="text-white animate-spin" />
                ) : (
                  <Camera size={24} className="text-white" />
                )}
              </div>
            </motion.div>

            {/* Verified badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg border border-emerald-100">
              <BadgeCheck size={18} className="text-emerald-500" />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
              id="avatar-upload"
            />
          </div>

          {/* Identity text */}
          <div className="flex-1 text-center sm:text-left">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-black text-slate-800 tracking-tight"
            >
              {user?.nama_lengkap}
            </motion.h2>
            <p className="text-sm text-slate-400 font-medium mt-1">{user?.email}</p>
            
            <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20">
                <Shield size={12} />
                {user?.role}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                user?.is_active
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-red-50 text-red-500 border-red-200"
              }`}>
                <span className={`w-2 h-2 rounded-full ${user?.is_active ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
                {user?.is_active ? "Aktif" : "Non-aktif"}
              </span>
            </div>
          </div>
        </div>

        {/* Avatar alert */}
        <div className="mt-4">
          <StatusAlert message={avatarMsg.text} type={avatarMsg.type} onClose={() => setAvatarMsg({ text: "", type: "" })} />
        </div>
      </SectionCard>

      {/* ═══════════════════════════════════════
          SECTION 2: EDIT PROFIL
          ═══════════════════════════════════════ */}
      <SectionCard>
        <SectionHeader icon={Pencil} title="Informasi Profil" subtitle="Ubah nama dan alamat email Anda" />

        <StatusAlert message={profileMsg.text} type={profileMsg.type} onClose={() => setProfileMsg({ text: "", type: "" })} />

        <form onSubmit={handleProfileSave} className="space-y-5 mt-4">
          <InputField
            id="input-nama"
            label="Nama Lengkap"
            icon={User}
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            placeholder="Masukkan nama lengkap..."
          />
          <InputField
            id="input-email"
            label="Alamat Email"
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@domain.com"
          />

          <motion.button
            type="submit"
            disabled={profileSaving}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {profileSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} />
                Simpan Perubahan
              </>
            )}
          </motion.button>
        </form>
      </SectionCard>

      {/* ═══════════════════════════════════════
          SECTION 3: UBAH PASSWORD
          ═══════════════════════════════════════ */}
      <SectionCard>
        <SectionHeader icon={KeyRound} title="Keamanan Akun" subtitle="Ubah kata sandi untuk menjaga keamanan" />

        <StatusAlert message={passwordMsg.text} type={passwordMsg.type} onClose={() => setPasswordMsg({ text: "", type: "" })} />

        <form onSubmit={handlePasswordChange} className="space-y-5 mt-4">
          <PasswordField
            id="input-current-pw"
            label="Password Saat Ini"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Masukkan password lama..."
          />
          <div>
            <PasswordField
              id="input-new-pw"
              label="Password Baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter..."
            />
            <PasswordStrength password={newPassword} />
          </div>
          <PasswordField
            id="input-confirm-pw"
            label="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ketik ulang password baru..."
          />

          {/* Match indicator */}
          <AnimatePresence>
            {confirmPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className={`flex items-center gap-2 text-xs font-bold ml-1 ${
                  newPassword === confirmPassword ? "text-emerald-600" : "text-red-500"
                }`}>
                  {newPassword === confirmPassword ? (
                    <><CheckCircle2 size={14} /> Password cocok</>
                  ) : (
                    <><AlertCircle size={14} /> Password belum cocok</>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-800/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {passwordSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Mengubah Password...
              </>
            ) : (
              <>
                <KeyRound size={18} />
                Ubah Password
              </>
            )}
          </motion.button>
        </form>
      </SectionCard>

      {/* ═══════════════════════════════════════
          SECTION 4: INFO AKUN (READ-ONLY)
          ═══════════════════════════════════════ */}
      <SectionCard>
        <SectionHeader icon={Sparkles} title="Informasi Akun" subtitle="Detail akun dan metadata sistem" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Role / Hak Akses", value: user?.role, icon: Shield, color: "emerald" },
            { label: "Status Akun", value: user?.is_active ? "Aktif" : "Non-aktif", icon: BadgeCheck, color: user?.is_active ? "emerald" : "red" },
            { label: "Terdaftar Sejak", value: formatDate(user?.createdAt), icon: CalendarDays, color: "blue" },
            { label: "Terakhir Diperbarui", value: formatDate(user?.updatedAt), icon: Clock, color: "violet" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-colors`}
            >
              <div className={`w-9 h-9 rounded-xl bg-${item.color}-100 flex items-center justify-center shrink-0`}>
                <item.icon size={16} className={`text-${item.color}-600`} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5 truncate">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>

    </motion.div>
  );
}
