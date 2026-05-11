import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Calendar, ArrowRight, Rss, ArrowLeft } from "lucide-react";

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

export default function BeritaPage() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/berita");
        setBerita(response.data.data || []);
      } catch (error) {
        console.error("Error fetching berita:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBerita();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-900 font-sans">
      {/* ─── Simple Header / Hero ─── */}
      <div className="relative bg-slate-900 dark:bg-surface-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          <Link 
            to="/"
            className="self-start md:absolute md:left-0 md:top-0 flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 font-medium mb-8 md:mb-0"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-4 border border-green-500/30">
              <Rss className="w-4 h-4" />
              Pusat Informasi
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
              Semua Berita & Publikasi
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Temukan berbagai informasi terbaru, artikel, dan publikasi seputar dunia peternakan di Provinsi Aceh.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── Content Section ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : berita.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-20">
            Belum ada berita yang diterbitkan.
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {berita.map((item) => (
              <motion.a
                key={item.id}
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardVariants}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                className="group relative block rounded-2xl overflow-hidden bg-white dark:bg-surface-800/80 border border-slate-200/60 dark:border-surface-700/60 shadow-sm hover:shadow-2xl hover:border-green-300/60 dark:hover:border-green-600/40 transition-all duration-400 backdrop-blur-sm"
              >
                {/* Gradient Glow */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-green-400/0 via-emerald-400/0 to-teal-400/0 group-hover:from-green-400/10 group-hover:via-emerald-400/5 group-hover:to-teal-400/10 transition-all duration-500 pointer-events-none" />

                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                  {/* Date Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white/95 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/10">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.published_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  {/* Source Badge */}
                  <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    Artikel
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="font-bold text-[15px] text-slate-800 dark:text-white line-clamp-2 mb-2.5 leading-snug group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-5">
                    {item.summary}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold">
                    <span className="group-hover:tracking-wide transition-all duration-300">
                      Baca Selengkapnya
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>

                  {/* Accent line */}
                  <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-green-500 to-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
