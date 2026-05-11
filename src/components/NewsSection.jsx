/**
 * NewsSection.jsx — Premium Berita & Publikasi Section
 * Animasi: Row 1 slides dari kanan, Row 2 slides dari kiri (Spring physics)
 */
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Rss } from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, delay: 0.3, ease: "easeOut" },
  },
};

/* ─── Komponen Utama ─── */
export default function NewsSection({ berita = [] }) {
  if (berita.length === 0) return null;

  return (
    <section
      id="berita"
      className="relative z-10 py-24 md:py-32 overflow-hidden transition-colors duration-300"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-green-50/30 dark:from-surface-900 dark:via-surface-900/95 dark:to-surface-800/60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-200/20 dark:bg-green-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Section Header ─── */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16"
        >
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-5 backdrop-blur-sm border border-green-200/50 dark:border-green-800/30">
            <Rss className="w-3.5 h-3.5" />
            Berita & Publikasi
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-green-950 dark:text-white mb-5 tracking-tight">
            Berita{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Terkini
            </span>
          </h2>

          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Kumpulan berita dan publikasi terbaru seputar dunia peternakan di
            Provinsi Aceh.
          </p>

          {/* Decorative Line */}
          <motion.div
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 mx-auto h-[2px] w-24 bg-gradient-to-r from-transparent via-green-400 to-transparent origin-center"
          />
        </motion.div>

        {/* ─── Cards Grid ─── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-7"
        >
          {berita.slice(0, 3).map((item) => (
            <motion.a
              key={item.id}
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
              className="group relative block rounded-2xl overflow-hidden bg-white dark:bg-surface-800/80 border border-gray-200/60 dark:border-surface-700/60 shadow-sm hover:shadow-2xl hover:border-green-300/60 dark:hover:border-green-600/40 transition-all duration-400 backdrop-blur-sm"
            >
              {/* Gradient Glow (visible on hover) */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-green-400/0 via-emerald-400/0 to-teal-400/0 group-hover:from-green-400/10 group-hover:via-emerald-400/5 group-hover:to-teal-400/10 transition-all duration-500 pointer-events-none" />

              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Overlay Gradient */}
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
                <h3 className="font-bold text-[15px] text-gray-800 dark:text-white line-clamp-2 mb-2.5 leading-snug group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-5">
                  {item.summary}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold">
                  <span className="group-hover:tracking-wide transition-all duration-300">
                    Baca Selengkapnya
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-green-500 to-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* ─── Lihat Semua Berita Button ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <Link
            to="/berita"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-green-700 dark:text-green-400 bg-transparent border-2 border-green-500/30 dark:border-green-500/30 rounded-full overflow-hidden transition-all duration-300 hover:border-green-500 dark:hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          >
            {/* Hover Background */}
            <div className="absolute inset-0 bg-green-500/10 dark:bg-green-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            
            <span className="relative z-10">Lihat Semua Berita</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
