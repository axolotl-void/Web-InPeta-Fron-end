/**
 * LandingPage.jsx — Halaman Publik InPETA (Pro Re-engineering v3)
 * Fitur: Scrollytelling BG, Dark Mode, Framer Motion, Claymorphism, Redesign Tentang Section, Animasi Cuaca
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, ChevronDown,
  CheckCircle2, ArrowRight,
  Building2, Landmark, GraduationCap, HeartPulse, Leaf, Loader2,
} from "lucide-react";

import NewsSection from "../components/NewsSection";
import FooterSection from "../components/FooterSection";

import api from "../api";
import logoImg from "../assets/logo-inpeta.png";
import heroImg from "../assets/hero.png";
import mockupImg from "../assets/mockup-hp.png";
import imgMatahari from "../assets/matahari.png";
import imgBulan from "../assets/bulan.png";
import imgAwan1 from "../assets/awan1.png";
import imgAwan2 from "../assets/awan2.png";

import useScrollytelling from "../hooks/useScrollytelling";
import FeaturesSection from "../components/FeaturesSection";
import LandingNavbar from "../components/LandingNavbar";

/* ─── Animasi Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

/* ─── Data ─── */
const faqData = [
  { q: "Apa itu InPETA?", a: "InPETA (Informasi Peternakan Terintegrasi Aceh) adalah portal data digital oleh Dinas Peternakan Provinsi Aceh untuk menyajikan informasi peternakan secara terpusat, akurat, dan mudah diakses." },
  { q: "Siapa yang bisa mengakses InPETA?", a: "Portal ini bersifat publik untuk semua kalangan. Fitur input data memerlukan akun resmi dari Dinas Peternakan." },
  { q: "Apakah data yang ditampilkan akurat?", a: "Data diperbarui berkala dari 23 kabupaten/kota dan melewati proses verifikasi petugas lapangan sebelum dipublikasikan." },
  { q: "Bagaimana cara menggunakan Peta Interaktif?", a: 'Klik menu "Peta Wilayah" pada navigasi. Anda dapat melihat sebaran ternak, lokasi Puskeswan, serta filter berdasarkan jenis ternak.' },
];

const aboutPoints = [
  "Akses data peternakan real-time dari 23 kabupaten/kota",
  "Web-GIS interaktif untuk visualisasi sebaran ternak",
  "Desain Mobile-First — optimal di semua perangkat",
  "Open data untuk transparansi dan kolaborasi",
];

const defaultTentang = {
  title: "Pusat Komando Data Peternakan",
  description: "InPETA adalah portal digital terintegrasi yang mendobrak cara lama. Kami menyajikan akses data statistik, peta sebaran spasial, serta direktori fasilitas kesehatan hewan langsung ke genggaman Anda.",
};

const socialIcons = [Building2, Landmark, GraduationCap, HeartPulse, Leaf];

/* ════════════════════════════════════════════
   KOMPONEN UTAMA
   ════════════════════════════════════════════ */
/* ─── Fallback data jika API belum ada isi ─── */
const defaultHero = {
  main_title: "Modernisasi Informasi Peternakan Aceh",
  description: "Platform digital terintegrasi untuk mengakses data statistik, peta sebaran, dan informasi fasilitas peternakan di seluruh Provinsi Aceh.",
};
const defaultStats = [
  { stat_value: "1.5 Jt+", stat_label: "Populasi Ternak" },
  { stat_value: "23", stat_label: "Kabupaten/Kota" },
  { stat_value: "109", stat_label: "Puskeswan" },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const { frameSrc } = useScrollytelling();
  
  // State untuk mendeteksi perubahan dark mode
  const [isDark, setIsDark] = useState(false);
  // State untuk deteksi layar mobile (animasi sweep dari kanan ke kiri)
  const [isMobile, setIsMobile] = useState(false);

  // 👇 STATE UNTUK DATA DARI BACKEND
  const [landingData, setLandingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 👇 FETCH DATA LANDING DARI API
  useEffect(() => {
    api.get("/landing")
      .then((res) => setLandingData(res.data.data))
      .catch((err) => console.error("Gagal memuat data landing:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Ambil data dari API atau gunakan fallback
  const heroContent = landingData?.heroContent || defaultHero;
  const heroStats = landingData?.heroStats?.length > 0 ? landingData.heroStats : defaultStats;
  const logo = landingData?.logo || null;
  const menus = landingData?.menus || [];
  const tentangContent = landingData?.tentangContent || defaultTentang;
  const tentangPoints = landingData?.tentangPoints?.length > 0 ? landingData.tentangPoints : aboutPoints.map((t, i) => ({ id: i, text: t, url: null }));
  const fiturUnggulan = landingData?.fiturUnggulan || [];
  const faqs = landingData?.faqs?.length > 0 ? landingData.faqs : faqData.map((f, i) => ({ id: i, question: f.q, answer: f.a }));
  const berita = landingData?.berita || [];
  const footerConfig = landingData?.footerConfig || null;

  useEffect(() => {
    // Deteksi Theme
    const htmlEl = document.documentElement;
    setIsDark(htmlEl.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(htmlEl.classList.contains('dark'));
    });
    observer.observe(htmlEl, { attributes: true, attributeFilter: ['class'] });

    // Deteksi Ukuran Layar untuk Animasi Responsive
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Cek saat pertama load
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-surface-950 dark:to-surface-900 transition-colors duration-300">

      {/* ══ LOADING SKELETON ══ */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] bg-white dark:bg-surface-950 flex flex-col items-center justify-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-10 h-10 text-green-500" />
            </motion.div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wide">Memuat InPETA...</p>
            {/* Skeleton bars */}
            <div className="w-64 space-y-3 mt-4">
              <div className="h-3 bg-slate-200 dark:bg-surface-800 rounded-full animate-pulse" />
              <div className="h-3 bg-slate-200 dark:bg-surface-800 rounded-full animate-pulse w-4/5" />
              <div className="h-3 bg-slate-200 dark:bg-surface-800 rounded-full animate-pulse w-3/5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ SCROLLYTELLING BACKGROUND ══ */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        {frameSrc && (
          <img
            src={frameSrc}
            alt=""
            className="w-full h-full object-cover opacity-60 dark:opacity-30 mix-blend-multiply dark:mix-blend-overlay transition-opacity duration-150 filter brightness-90 contrast-125"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/30 dark:from-slate-950/80 dark:via-slate-900/50 dark:to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/40 to-white dark:via-surface-950/60 dark:to-surface-950" />
      </div>

      {/* ══ NAVBAR — Dinamis dari API ══ */}
      <LandingNavbar logo={logo} menus={menus} />

      {/* ══ HERO SECTION ══ */}
      <section id="beranda" className="relative z-10 overflow-hidden min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-green-200 dark:bg-green-900/30 rounded-full blur-3xl opacity-30 -translate-y-1/3 translate-x-1/4 z-[1]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-25 translate-y-1/3 -translate-x-1/4 z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* --- KIRI: TEKS HERO --- */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center lg:text-left order-2 lg:order-1 mt-10 lg:mt-0">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-200/60 dark:bg-green-800/40 text-green-800 dark:text-green-300 rounded-full text-xs font-bold mb-6 tracking-wide backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                PORTAL DATA PETERNAKAN ACEH
              </motion.div>

              {/* 👇 JUDUL HERO — Dinamis dari CMS */}
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-6 drop-shadow-sm">
                {heroContent.main_title?.split(" ").map((word, i, arr) => (
                  i === 0
                    ? <span key={i} className="text-green-600 dark:text-green-400">{word} </span>
                    : <span key={i}>{word}{i < arr.length - 1 ? " " : ""}</span>
                ))}
              </motion.h1>

              {/* 👇 DESKRIPSI HERO — Dinamis dari CMS */}
              <motion.p variants={fadeUp} custom={2} className="text-lg text-slate-700 dark:text-gray-300 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 drop-shadow-sm">
                {heroContent.description}
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <motion.div whileHover={{ scale: 1.05, y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <Link to="/peta" className="group flex items-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg shadow-green-600/40 hover:shadow-xl hover:shadow-green-400/50 transition-shadow duration-300">
                    Lihat Peta Data
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
                <a href="#tentang" className="flex items-center gap-2 px-8 py-4 text-sm font-semibold text-green-700 dark:text-green-300 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm hover:bg-green-50 dark:hover:bg-surface-700 border-2 border-green-200 dark:border-surface-600 rounded-full transition-all duration-300 hover:-translate-y-1">
                  Pelajari Lebih Lanjut
                </a>
              </motion.div>

              {/* 👇 STATISTIK HERO — Dinamis dari CMS */}
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-8 mt-10 justify-center lg:justify-start">
                {heroStats.map((s) => (
                  <div key={s.stat_label} className="text-center">
                    <p className="text-2xl font-extrabold text-green-700 dark:text-green-400 drop-shadow-sm">{s.stat_value}</p>
                    <p className="text-xs font-medium text-slate-600 dark:text-gray-300 mt-1">{s.stat_label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* --- KANAN: ANIMASI HERO 3D + CUACA --- */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 flex justify-center relative w-full lg:h-[500px] items-center"
            >
              
              {/* ANIMASI MATAHARI (Lebih Kecil & Lebih Tinggi, Sweep dari Kanan) */}
              <motion.div
                initial={false}
                animate={{ 
                  opacity: isDark ? 0 : 1, 
                  // Kalau mobile mulai lebih jauh dari kanan (150px) ke kiri (-50px)
                  x: isDark ? (isMobile ? 150 : 200) : (isMobile ? -50 : -80), 
                  // Lebih tinggi posisinya
                  y: isDark ? 150 : (isMobile ? -180 : -220), 
                  rotate: isDark ? -45 : 0,
                  scale: isDark ? 0.5 : 1
                }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
                className="absolute z-0 pointer-events-none"
              >
                <img src={imgMatahari} alt="Matahari" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]" />
              </motion.div>

              {/* ANIMASI BULAN (Lebih Kecil & Lebih Tinggi, Sweep dari Kanan) */}
              <motion.div
                initial={false}
                animate={{ 
                  opacity: isDark ? 1 : 0, 
                  // Dari kanan layar (150px) ke kiri (-60px) di mobile
                  x: isDark ? (isMobile ? -60 : -80) : (isMobile ? 150 : 200),  
                  // Lebih tinggi
                  y: isDark ? (isMobile ? -180 : -200) : 150,
                  rotate: isDark ? 0 : 45,
                  scale: isDark ? 1 : 0.5
                }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
                className="absolute z-0 pointer-events-none"
              >
                <img src={imgBulan} alt="Bulan" className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
              </motion.div>

              {/* AWAN 1 (KIRI) - Efek Melayang & Geser Kiri-Kanan */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0], 
                  x: [0, 30, -15, 0] // Tambahan pergerakan horizontal biar seperti ditiup angin
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-20 top-[0%] md:top-[5%] left-[2%] md:left-[5%] pointer-events-none opacity-80 dark:opacity-60"
              >
                <img src={imgAwan1} alt="Awan" className="w-32 md:w-44 object-contain drop-shadow-lg" />
              </motion.div>

              {/* AWAN 2 (KANAN) - Efek Melayang & Geser Kiri-Kanan */}
              <motion.div
                animate={{ 
                  y: [0, 15, 0], 
                  x: [0, -40, 20, 0] // Bergeser ke arah berlawanan
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute z-20 top-[15%] md:top-[20%] right-[0%] md:right-[5%] pointer-events-none opacity-90 dark:opacity-50"
              >
                <img src={imgAwan2} alt="Awan" className="w-24 md:w-32 object-contain drop-shadow-md" />
              </motion.div>

              {/* GUNUNG 3D HERO - Efek Bubble/Melayang Halus */}
              <motion.img
                src={heroImg}
                alt="Ilustrasi data peternakan Aceh"
                className="relative z-10 w-full max-w-[280px] sm:max-w-[400px] lg:max-w-lg mx-auto drop-shadow-[0_30px_35px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_30px_35px_rgba(0,0,0,0.6)] mt-8 md:mt-0"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ SOCIAL PROOF BAR ══ */}
      <section className="relative z-10 py-8 md:py-10 border-y border-green-100/50 dark:border-surface-700/30 bg-white/60 dark:bg-surface-900/60 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest mb-5">
            Dipercaya oleh instansi di 23 Kabupaten/Kota Aceh
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {socialIcons.map((Icon, i) => (
              <Icon key={i} className="w-8 h-8 text-gray-400 dark:text-slate-400 opacity-70 hover:opacity-100 hover:text-green-500 dark:hover:text-green-400 transition-all duration-300" />
            ))}
          </div>
        </div>
      </section>

      {/* ══ TENTANG (REDESIGN: GLOW & ORBIT) ══ */}
      <section id="tentang" className="relative z-10 py-20 md:py-28 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Kiri: Gambar dengan Efek Cincin & Glow */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative flex justify-center items-center py-10">
              
              {/* Efek Glow di Belakang */}
              <div className="absolute w-[140%] h-[140%] max-w-[500px] max-h-[500px] bg-green-400/20 dark:bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              {/* Lingkaran Orbit (Elemen Kosmetik) */}
              <div className="absolute w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full border border-green-500/20 dark:border-green-400/20" />
              <div className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full border border-green-500/30 dark:border-green-400/30 border-dashed animate-[spin_40s_linear_infinite]" />
              
              {/* Gambar HP Transparan */}
              <motion.img
                src={mockupImg}
                alt="Mockup InPETA"
                className="relative z-10 w-full max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-[0_25px_45px_rgba(16,185,129,0.25)] dark:drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)]"
                animate={{ y: [-12, 12, -12], rotateZ: [-1.5, 1.5, -1.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Elemen Kosmetik Melayang Tambahan */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-10 right-10 sm:right-20 z-20 bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-white/50 dark:border-surface-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase">Real-time</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Live Data</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Kanan: Teks & List Modern — Dinamis dari CMS */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Leaf className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Tentang Platform</p>
              </div>
              
              {/* 👇 JUDUL TENTANG — Dinamis dari CMS */}
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                {tentangContent.title?.split(" ").slice(0, 2).join(" ")} <br/> <span className="text-green-600 dark:text-green-400">{tentangContent.title?.split(" ").slice(2).join(" ")}</span>
              </h2>
              
              {/* 👇 DESKRIPSI TENTANG — Dinamis dari CMS */}
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">
                {tentangContent.description}
              </p>
              
              {/* 👇 POIN TENTANG — Dinamis dari CMS */}
              <div className="space-y-4">
                {tentangPoints.map((p) => (
                  <motion.div 
                    key={p.id} 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-white/50 dark:bg-surface-800/40 hover:bg-green-50 dark:hover:bg-surface-800 border border-transparent hover:border-green-100 dark:hover:border-surface-700 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    {p.url ? (
                      <a href={p.url} className="text-slate-700 dark:text-gray-200 font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors">{p.text}</a>
                    ) : (
                      <p className="text-slate-700 dark:text-gray-200 font-medium">{p.text}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ FITUR ══ */}
      <FeaturesSection fiturUnggulan={fiturUnggulan} />

      {/* ══ FAQ ══ */}
      <section id="faq" className="relative z-10 py-20 md:py-28 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-950 dark:text-white mb-4">Pertanyaan Umum</h2>
            <p className="text-gray-600 dark:text-gray-400">Berikut jawaban atas pertanyaan yang sering diajukan.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.id} className="bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-xl overflow-hidden hover:border-green-400 dark:hover:border-green-600 transition-all duration-300">
                <button id={`faq-btn-${faq.id}`} onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} className="flex items-center justify-between w-full px-6 py-4 text-left" aria-expanded={openFaq === faq.id}>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openFaq === faq.id ? "rotate-180 text-green-500" : "text-gray-400 dark:text-gray-500"}`} />
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-green-100 dark:border-surface-700 pt-4">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BERITA & PUBLIKASI ══ */}
      <NewsSection berita={berita} />

      {/* ══ FOOTER ══ */}
      <FooterSection footerConfig={footerConfig} menus={menus} />
    </div>
  );
}