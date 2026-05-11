import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, ArrowRight, ChevronDown } from "lucide-react";
import logoFallback from "../assets/logo-inpeta.png";

/* ─── Hook: Dark Mode ─── */
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("inpeta-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("inpeta-theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
}

/* ─── Default nav links (fallback jika API belum ada data) ─── */
const defaultNavLinks = [
  { title: "Beranda", url: "#beranda" },
  { title: "Tentang", url: "#tentang" },
  { title: "Fitur", url: "#fitur" },
  { title: "FAQ", url: "#faq" },
];

export default function LandingNavbar({ logo, menus }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dark, toggleDark] = useDarkMode();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Gunakan data dari API, fallback ke default jika kosong
  const rawNavLinks = menus && menus.length > 0 ? menus : defaultNavLinks;
  // Override "Hubungi Kami" menu agar mengarah ke #kontak (footer)
  const navLinks = rawNavLinks.map((item) =>
    item.title?.toLowerCase() === "hubungi kami"
      ? { ...item, url: "#kontak" }
      : item
  );

  // Tentukan sumber logo
  const logoSrc = logo?.image_url || logoFallback;

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper: cek apakah link internal (#section) atau route
  const isInternalAnchor = (url) => url?.startsWith("#");

  // Smooth scroll ke section dengan offset navbar (agar tidak tertutup)
  const scrollToSection = (hash) => {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = 100; // tinggi navbar fixed + padding
      const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Render link yang tepat (anchor vs router Link)
  const NavLink = ({ url, children, className, onClick }) => {
    if (isInternalAnchor(url)) {
      return (
        <a
          href={url}
          className={className}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(url);
            if (onClick) onClick(e);
          }}
        >
          {children}
        </a>
      );
    }
    return <Link to={url} className={className} onClick={onClick}>{children}</Link>;
  };

  return (
    <>
      {/* Container Navbar Melayang */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-4 left-0 w-full z-50 px-4 md:px-8 flex justify-center pointer-events-none"
      >
        <nav className="pointer-events-auto w-full max-w-6xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border border-white/40 dark:border-surface-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full relative overflow-visible transition-colors duration-300">
          
          <div className="px-5 md:px-8">
            <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
              
              {/* Logo — Dinamis dari API */}
              <a 
                href="#beranda" 
                className="flex-shrink-0 relative z-20 group"
                onClick={(e) => { e.preventDefault(); scrollToSection("#beranda"); }}
              >
                <img 
                  src={logoSrc} 
                  alt="Logo InPETA" 
                  className="h-9 md:h-11 w-auto dark:brightness-110 drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = logoFallback; }}
                />
              </a>

              {/* Desktop Menu — Dinamis dari API */}
              <div className="hidden md:flex items-center gap-5 relative z-20" ref={dropdownRef}>
                {navLinks.map((item, index) => {
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <div key={item.url || index} className="relative">
                      {hasChildren ? (
                        /* Menu dengan Sub-menu (Dropdown) */
                        <>
                          <button
                            onMouseEnter={() => { setHoveredIndex(index); setOpenDropdown(index); }}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                            className="relative flex items-center gap-1 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors rounded-full"
                          >
                            {hoveredIndex === index && (
                              <motion.div
                                layoutId="nav-hover-pill"
                                className="absolute inset-0 bg-green-100 dark:bg-green-900/40 rounded-full -z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              />
                            )}
                            <span className="relative z-10">{item.title}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === index ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Dropdown Panel */}
                          <AnimatePresence>
                            {openDropdown === index && (
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                onMouseEnter={() => setOpenDropdown(index)}
                                onMouseLeave={() => setOpenDropdown(null)}
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-surface-700/60 shadow-xl rounded-2xl p-2 z-50"
                              >
                                {item.children.map((child) => (
                                  <NavLink
                                    key={child.id || child.url}
                                    url={child.url}
                                    className="block px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-surface-800 rounded-xl transition-colors"
                                  >
                                    {child.title}
                                  </NavLink>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        /* Menu Biasa (Tanpa Sub-menu) */
                        <NavLink 
                          url={item.url}
                          className="relative px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors rounded-full"
                        >
                          <span
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="relative z-10 block"
                          >
                            {hoveredIndex === index && (
                              <motion.div
                                layoutId="nav-hover-pill"
                                className="absolute inset-[-10px] bg-green-100 dark:bg-green-900/40 rounded-full -z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              />
                            )}
                            {item.title || item.label}
                          </span>
                        </NavLink>
                      )}
                    </div>
                  );
                })}
                
                <div className="w-px h-6 bg-gray-200 dark:bg-surface-700 mx-2" />

                {/* Dark Mode Toggle */}
                <button 
                  onClick={toggleDark} 
                  className="p-2.5 rounded-full text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-surface-800 hover:text-green-600 transition-all duration-300" 
                  aria-label="Toggle tema"
                >
                  {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                {/* Login Button */}
                <Link 
                  to="/login" 
                  className="ml-2 group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 border border-transparent rounded-full shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40 hover:-translate-y-0.5"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="flex items-center gap-2 md:hidden relative z-20">
                <button onClick={toggleDark} className="p-2 rounded-full text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors">
                  {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full bg-slate-50 dark:bg-surface-800 text-slate-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-surface-700 transition-colors">
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 🐄 ANIMASI HEWAN BERJALAN DI BAWAH NAVBAR 🐄 */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] opacity-80 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ x: ["-5vw", "105vw"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute bottom-0 text-green-500 dark:text-green-400"
            >
              {/* Custom SVG Siluet Sapi / Hewan Kecil */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="transform -translate-y-full ml-[-24px]">
                <path d="M20,10C18.9,10,17.8,9.6,16.9,8.9L16,8H9C7.9,8,7,8.9,7,10V11H5C3.9,11,3,11.9,3,13V17H5V20H7V17H13V20H15V17H17.5C18.3,17,19,16.3,19,15.5V11.5C19,10.7,18.3,10,17.5,10H20V10Z" />
              </svg>
            </motion.div>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Dropdown Panel — Dinamis */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            transition={{ duration: 0.2 }} 
            className="fixed top-24 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl border border-white/50 dark:border-surface-700 shadow-2xl rounded-3xl overflow-hidden p-4 space-y-2">
              {navLinks.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                
                return (
                  <div key={item.url || item.title}>
                    {hasChildren ? (
                      /* Mobile: Menu dengan sub-menu (Accordion) */
                      <MobileAccordionMenu 
                        item={item} 
                        onClose={() => setIsMobileMenuOpen(false)} 
                      />
                    ) : (
                      <NavLink 
                        url={item.url}
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="block px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-surface-800 rounded-2xl transition-colors"
                      >
                        {item.title || item.label}
                      </NavLink>
                    )}
                  </div>
                );
              })}
              <div className="pt-2 pb-1">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center justify-center gap-2 w-full px-5 py-3.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-2xl transition-colors shadow-md"
                >
                  <span>Login ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer agar konten tidak tertutup fixed navbar */}
      <div className="h-24 md:h-28" />
    </>
  );
}


/* ─── Sub-komponen: Accordion Menu untuk Mobile ─── */
function MobileAccordionMenu({ item, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  const isInternalAnchor = (url) => url?.startsWith("#");

  const scrollToSection = (hash) => {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const NavLink = ({ url, children, className, onClick }) => {
    if (isInternalAnchor(url)) {
      return (
        <a
          href={url}
          className={className}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(url);
            if (onClick) onClick(e);
          }}
        >
          {children}
        </a>
      );
    }
    return <Link to={url} className={className} onClick={onClick}>{children}</Link>;
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-surface-800 rounded-2xl transition-colors"
      >
        <span>{item.title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-4"
          >
            {item.children.map((child) => (
              <NavLink
                key={child.id || child.url}
                url={child.url}
                onClick={onClose}
                className="block px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50/50 dark:hover:bg-surface-800/50 rounded-xl transition-colors"
              >
                {child.title}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
