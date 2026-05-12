import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Map, LogOut, Settings, ChevronRight, RefreshCw,
  MapPinned, ChevronDown, User, Users, Sun, Moon, Key,
  // Phase 1: Smart CMS sub-icons
  MonitorPlay, Palette, BarChart3, PanelTop, Info, ListChecks,
  Zap, HelpCircle, Newspaper, PanelBottom, Image as ImageIcon
} from "lucide-react";

import TabWilayah from "../components/admin/TabWilayah";
import TabLandingPage from "../components/admin/TabLandingPage";
import TabFasilitas from "../components/admin/TabFasilitas";
import TabPengaturanAkun from "../components/admin/TabPengaturanAkun";
import TabAkunAdmin from "../components/admin/TabAkunAdmin";
import TabApiKeys from "../components/admin/TabApiKeys";
import { useDarkMode } from "../context/DarkModeContext";

// CMS submenu config with context-aware icons
const CMS_SUBMENUS = [
  { key: "cms-hero", label: "Hero Content", icon: MonitorPlay },
  { key: "cms-logo", label: "Branding & Logo", icon: Palette },
  { key: "cms-stats", label: "Statistik Hero", icon: BarChart3 },
  { key: "cms-menus", label: "Struktur Navbar", icon: PanelTop },
  { key: "cms-tentang", label: "Konten Tentang", icon: Info },
  { key: "cms-tentang-points", label: "Poin Tentang", icon: ListChecks },
  { key: "cms-fitur", label: "Fitur Unggulan", icon: Zap },
  { key: "cms-faq", label: "FAQ", icon: HelpCircle },
  { key: "cms-berita", label: "Berita", icon: Newspaper },
  { key: "cms-footer", label: "Footer", icon: PanelBottom },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [userData, setUserData] = useState(null);

  const [activeTab, setActiveTab] = useState("wilayah");
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadUser = () => {
      const user = localStorage.getItem("user");
      if (!user) navigate("/login");
      else setUserData(JSON.parse(user));
    };
    loadUser();
    window.addEventListener("user-updated", loadUser);
    return () => window.removeEventListener("user-updated", loadUser);
  }, [navigate]);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };
  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const getHeaderTitle = () => {
    if (activeTab === "wilayah") return "Data Wilayah";
    if (activeTab === "fasilitas") return "Fasilitas & Lokasi";
    if (activeTab === "pengaturan") return "Pengaturan Akun";
    if (activeTab === "akun-admin") return "Manajemen Admin";
    if (activeTab === "api-keys") return "API Keys & Export Data";
    if (activeTab.startsWith("cms-")) return activeTab.replace("cms-", "Kelola ");
    return "Dashboard";
  };

  if (!userData) return null;

  // Reusable sidebar button class builder
  const sideBtn = (tab) =>
    `w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all ${
      activeTab === tab
        ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0F172A] font-sans overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* ══ SIDEBAR ══ */}
      <aside className="w-72 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-700/50 flex flex-col shrink-0 z-20 overflow-y-auto transition-colors duration-300">
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-green-600/30">
            <LayoutDashboard size={22} />
          </div>
          <span className="text-xl font-black tracking-tighter">INPETA <span className="text-green-600 dark:text-emerald-400">ADMIN</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Menu Utama</p>

          {/* 1️⃣ Data Wilayah */}
          <button onClick={() => setActiveTab("wilayah")} className={sideBtn("wilayah")}>
            <Map size={20}/> Data Wilayah
          </button>

          {/* 2️⃣ Landing Page (Dropdown) */}
          <div className="space-y-1">
            <button onClick={() => setIsCmsOpen(!isCmsOpen)} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold transition-all ${activeTab.startsWith('cms-') ? 'bg-green-50 dark:bg-emerald-500/10 text-green-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <div className="flex items-center gap-3"><ImageIcon size={20}/> Landing Page</div>
              <ChevronRight size={16} className={`transition-transform duration-300 ${isCmsOpen ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {isCmsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pl-5 pr-2 py-1 space-y-0.5">
                    {CMS_SUBMENUS.map(({ key, label, icon: Icon }) => (
                      <SubSidebarLink key={key} active={activeTab === key} onClick={() => setActiveTab(key)} label={label} icon={Icon} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3️⃣ Fasilitas & Lokasi */}
          <button onClick={() => setActiveTab("fasilitas")} className={sideBtn("fasilitas")}>
            <MapPinned size={20}/> Fasilitas & Lokasi
          </button>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 mt-4">
            <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Sistem</p>
            <button onClick={() => setActiveTab("pengaturan")} className={sideBtn("pengaturan")}><Settings size={20}/> Pengaturan Akun</button>
            <button onClick={() => setActiveTab("akun-admin")} className={`mt-1 ${sideBtn("akun-admin")}`}><Users size={20}/> Akun Admin</button>
            <button onClick={() => setActiveTab("api-keys")} className={`mt-1 ${sideBtn("api-keys")}`}><Key size={20}/> API Keys & Export</button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-bold transition-all mt-1">
              <LogOut size={20} /> Keluar
            </button>
          </div>
        </nav>
      </aside>

      {/* ══ KONTEN UTAMA ══ */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-24 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between px-10 shrink-0 sticky top-0 z-10 transition-colors duration-300">
          <div>
            <h2 className="text-2xl font-black tracking-tight capitalize text-slate-900 dark:text-white">
              {getHeaderTitle()}
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Pantau dan update data InPETA secara real-time.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Refresh */}
            <button onClick={triggerRefresh} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm" aria-label="Refresh Data">
              <RefreshCw size={20} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 pr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full hover:shadow-md transition-all focus:outline-none"
              >
                {userData.avatar_url ? (
                  <img src={userData.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-600" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-inner shadow-black/20">
                    {getInitials(userData.nama || userData.nama_lengkap)}
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none">Halo, {userData.nama?.split(" ")[0] || userData.nama_lengkap?.split(" ")[0] || "Admin"}</p>
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">{userData.role || "Administrator"}</p>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ml-1 ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{userData.nama || userData.nama_lengkap}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{userData.email}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => { setActiveTab("pengaturan"); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-emerald-400 hover:bg-green-50 dark:hover:bg-emerald-500/10 transition-colors"
                      >
                        <User size={18} /> Pengaturan Akun
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                      >
                        <LogOut size={18} className="group-hover:scale-110 transition-transform" /> Keluar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <AnimatePresence mode="wait">
            {activeTab === "wilayah" && <TabWilayah key="wilayah" refreshTrigger={refreshTrigger} />}
            {activeTab.startsWith("cms-") && <TabLandingPage key="landing-page" activeSubTab={activeTab} refreshTrigger={refreshTrigger} />}
            {activeTab === "fasilitas" && <TabFasilitas key="fasilitas" refreshTrigger={refreshTrigger} />}
            {activeTab === "pengaturan" && <TabPengaturanAkun key="pengaturan" refreshTrigger={refreshTrigger} />}
            {activeTab === "akun-admin" && <TabAkunAdmin key="akun-admin" refreshTrigger={refreshTrigger} />}
            {activeTab === "api-keys" && <TabApiKeys key="api-keys" refreshTrigger={refreshTrigger} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Sub-sidebar link with icon support
const SubSidebarLink = ({ active, onClick, label, icon: Icon }) => (
  <button onClick={onClick} className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${active ? 'bg-green-100 dark:bg-emerald-500/15 text-green-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
    <Icon size={16} className={active ? "text-green-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"} />
    {label}
  </button>
);