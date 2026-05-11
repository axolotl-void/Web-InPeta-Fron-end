/**
 * LoginPage.jsx — Halaman Login Admin & Petugas Lapangan InPETA
 * Versi Super Advanced (Green Theme) + Backend Terhubung
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, 
  Loader2, CheckCircle2, UserCircle, MapPin, 
  Database, Server, RefreshCw, X, AlertCircle, Check
} from "lucide-react";

// 👇 IMPORT API UNTUK KONEKSI KE BACKEND
import api from "../api";

// =====================================================================
// MOCK ASSETS:
const logoImg = "";
const heroImg = "";
// import logoImg from "../assets/logo-inpeta.png";
// import heroImg from "../assets/hero.png";
// =====================================================================


/* ══════════════════════════════════════════════════════════
   1. KOMPONEN INTERNAL: PARTICLE BACKGROUND (SISI KIRI)
   ══════════════════════════════════════════════════════════ */
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 40 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: ["0%", "100%", "0%"],
            x: ["0%", "50%", "0%"],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          className="absolute rounded-full bg-emerald-500/20 blur-[30px]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
        />
      ))}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-green-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-teal-500/20 rounded-full blur-[100px]" />
    </div>
  );
};


/* ══════════════════════════════════════════════════════════
   2. KOMPONEN INTERNAL: CAROUSEL INFO (SISI KIRI)
   ══════════════════════════════════════════════════════════ */
const features = [
  {
    icon: Database,
    title: "Sistem Terpusat",
    desc: "Semua data peternakan dari 23 Kabupaten/Kota tersinkronisasi dalam satu pangkalan data yang aman dan terenkripsi."
  },
  {
    icon: MapPin,
    title: "Pemetaan Spasial",
    desc: "Akses alat pemetaan geospasial tingkat lanjut untuk menganalisis kepadatan ternak dan penyebaran penyakit secara real-time."
  },
  {
    icon: Server,
    title: "Infrastruktur Andal",
    desc: "Dibangun dengan arsitektur modern untuk memastikan uptime 99.9% demi pelayanan publik yang tidak terputus."
  }
];

const FeatureCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-12 h-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2">
            {React.createElement(features[currentIndex].icon, { className: "text-green-400 w-6 h-6" })}
          </div>
          <h3 className="text-xl font-bold text-white tracking-wide">
            {features[currentIndex].title}
          </h3>
          <p className="text-sm text-green-100/70 leading-relaxed max-w-sm">
            {features[currentIndex].desc}
          </p>
        </motion.div>
      </AnimatePresence>
      
      <div className="flex items-center gap-2 mt-6">
        {features.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentIndex ? "w-8 bg-green-400" : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};


/* ══════════════════════════════════════════════════════════
   3. KOMPONEN INTERNAL: MODAL LUPA PASSWORD
   ══════════════════════════════════════════════════════════ */
const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [resetEmail, setResetEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setResetEmail("");
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 z-10"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
              <X size={18} />
            </button>

            {!isSuccess ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 border border-green-200 dark:border-green-800/50">
                  <RefreshCw className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Lupa Kata Sandi?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Masukkan email atau NIP yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Masukkan email..."
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !resetEmail}
                    className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kirim Tautan Reset"}
                  </button>
                </form>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Tautan Terkirim!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Silakan periksa kotak masuk email Anda untuk instruksi selanjutnya.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


/* ══════════════════════════════════════════════════════════
   4. KOMPONEN UTAMA: LOGIN PAGE
   ══════════════════════════════════════════════════════════ */
export default function LoginPage() {
  // State Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginRole, setLoginRole] = useState("admin"); 
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // State untuk Setup Admin (tombol tersembunyi)
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupMsg, setSetupMsg] = useState({ text: "", type: "" });

  // 👇 1. NAVIGATE SUDAH DIHIDUPKAN
  const navigate = useNavigate();

  // 👇 FUNGSI SETUP ADMIN (Buat akun pertama kali)
  const handleSetupAdmin = async () => {
    setSetupLoading(true);
    setSetupMsg({ text: "", type: "" });
    try {
      const res = await api.post("/setup-admin", {
        email: "yogi@inpeta.com",
        password: "password123",
        nama_lengkap: "Yogi Admin",
      });
      setSetupMsg({ text: res.data.pesan || "Admin berhasil dibuat!", type: "success" });
    } catch (error) {
      const msg = error.response?.data?.error || "Gagal membuat akun admin.";
      setSetupMsg({ text: msg, type: "error" });
    } finally {
      setSetupLoading(false);
    }
  };

  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 6) score += 1;
    if (pass.length > 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(score, 4);
  };
  
  const strengthScore = calculateStrength(password);
  const strengthLabels = ["Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"];
  const strengthColors = ["bg-slate-200", "bg-red-500", "bg-orange-500", "bg-green-500", "bg-emerald-500"];

  // 👇 2. FUNGSI HANDLE LOGIN KE BACKEND
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi format email & panjang password
    if (!email.includes("@") && email.length < 5) {
      setErrorMsg("Format Email atau NIP tidak valid.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Kata sandi harus minimal 6 karakter.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Tembak API Login di Backend
      const response = await api.post("/login", { email, password });
      
      // Simpan Token dan Data User ke Local Storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Otomatis pindah ke halaman Dashboard
      navigate("/dashboard");
    } catch (error) {
      // Tampilkan error (Misal: "Password salah!" dari server)
      if (error.response && error.response.data.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Gagal terhubung ke server. Pastikan Backend menyala.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-green-500/30 text-slate-800 dark:text-slate-200">
      
      <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />

      <div className="hidden lg:flex relative w-[45%] xl:w-1/2 bg-slate-950 overflow-hidden flex-col justify-between p-12">
        <FloatingParticles />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity">
            {logoImg ? (
              <img src={logoImg} alt="Logo InPETA" className="h-10 w-auto brightness-0 invert" />
            ) : (
              <div className="text-3xl font-black tracking-tighter text-white">In<span className="text-green-500">PETA</span></div>
            )}
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-md mb-6">
              <ShieldCheck size={16} className="text-green-400" />
              <span className="text-xs font-extrabold text-green-400 uppercase tracking-[0.15em]">Secure Portal</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.15] mb-6 tracking-tight">
              Akses Sentral <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Data Peternakan
              </span>
            </h1>
            
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              Area khusus pengelola sistem, dokter hewan, dan petugas lapangan Dinas Peternakan Provinsi Aceh.
            </p>
          </motion.div>

          <FeatureCarousel />
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} Dinas Peternakan Provinsi Aceh. Dilindungi Undang-Undang.
        </div>
      </div>

      <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col justify-center px-6 sm:px-16 xl:px-24 relative overflow-y-auto">
        <div className="absolute top-6 left-6 lg:hidden z-20">
          <Link to="/" className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300">
            <ArrowLeft size={20} />
          </Link>
        </div>

        <div className="absolute top-[-10%] right-[-10%] w-[20rem] h-[20rem] bg-green-500/10 rounded-full blur-[80px] lg:hidden pointer-events-none" />

        <div className="w-full max-w-md mx-auto relative z-10">
          <Link to="/" className="hidden lg:inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-12 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Portal Publik
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Selamat Datang
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Silakan pilih peran dan masukkan kredensial Anda untuk melanjutkan ke dashboard InPETA.
            </p>
          </motion.div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm font-medium">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onSubmit={handleLogin} 
            className="space-y-6"
          >
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setLoginRole("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                  loginRole === "admin" 
                    ? "bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <ShieldCheck size={16} /> Admin
              </button>
              <button
                type="button"
                onClick={() => setLoginRole("petugas")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                  loginRole === "petugas" 
                    ? "bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <UserCircle size={16} /> Petugas Lapangan
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                {loginRole === "admin" ? "Email Admin" : "NIP / NIK Petugas"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type={loginRole === "admin" ? "email" : "text"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={loginRole === "admin" ? "admin@acehprov.go.id" : "198012122005011002"}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Kata Sandi
                </label>
                <button 
                  type="button" 
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                >
                  Lupa sandi?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {password && (
                <div className="pt-1.5 px-1">
                  <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-full flex-1 transition-colors duration-300 ${
                          i < strengthScore ? strengthColors[strengthScore] : "bg-transparent"
                        }`} 
                      />
                    ))}
                  </div>
                  <p className={`text-[10px] font-bold mt-1.5 ${strengthScore > 2 ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                    Kekuatan Sandi: {strengthLabels[strengthScore]}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 group-hover:border-green-500 transition-colors">
                  <input type="checkbox" className="peer sr-only" />
                  <Check size={14} strokeWidth={4} className="text-white opacity-0 peer-checked:opacity-100 absolute" />
                  <div className="absolute inset-0 bg-green-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform -z-10" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Ingat saya di perangkat ini
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-black text-[15px] tracking-wide shadow-xl shadow-green-500/20 hover:shadow-green-500/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Memverifikasi Akses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowLeft size={18} className="rotate-180" />
                  </>
                )}
              </button>
            </div>
            
          </motion.form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Atau Masuk Dengan</p>
            <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">
              <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">A</div>
              SSO AcehProv
            </button>
          </motion.div>

          {/* 🔧 TOMBOL SETUP ADMIN — Hapus setelah akun pertama dibuat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-6 text-center"
          >
            <button
              type="button"
              onClick={handleSetupAdmin}
              disabled={setupLoading}
              className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-green-400 dark:hover:border-green-600 rounded-2xl text-xs font-bold text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-all disabled:opacity-50"
            >
              {setupLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Membuat Akun...
                </span>
              ) : (
                "⚙️ Setup Admin Pertama (Dev Only)"
              )}
            </button>
            <AnimatePresence>
              {setupMsg.text && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-3 text-xs font-bold ${
                    setupMsg.type === "success"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {setupMsg.type === "success" ? <CheckCircle2 size={14} className="inline mr-1" /> : <AlertCircle size={14} className="inline mr-1" />}
                  {setupMsg.text}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

    </div>
  );
}