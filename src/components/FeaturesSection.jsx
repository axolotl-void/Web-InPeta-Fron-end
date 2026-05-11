import { motion } from "framer-motion";

// Kita tidak menggunakan Lucide icons lagi di bagian ini karena kita akan merender URL gambar dari backend
/* ─── Animasi Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = { 
  visible: { transition: { staggerChildren: 0.15 } } 
};

export default function FeaturesSection({ fiturUnggulan = [] }) {
  // Gunakan data dari API, abaikan fallback statis lama.
  // Data ini akan diisi ketika API landing dipanggil di LandingPage.jsx
  const features = fiturUnggulan;

  return (
    <section id="fitur" className="relative z-10 py-20 md:py-28 bg-green-50/80 dark:bg-surface-950/80 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">Fitur Unggulan</motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Apa yang Bisa Anda Lakukan?</motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">InPETA menyediakan berbagai fitur digital untuk memudahkan akses informasi peternakan di Provinsi Aceh.</motion.p>
        </motion.div>

        {/* Grid Cards — Dinamis dari CMS */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((f) => {
             // Cek apakah url ada, jika ya gunakan tag anchor
            const isClickable = Boolean(f.url);
            const CardWrapper = isClickable ? 'a' : 'div';
            const wrapperProps = isClickable ? { href: f.url } : {};

            return (
              <CardWrapper 
                {...wrapperProps}
                key={f.id} 
                className="group relative bg-white dark:bg-surface-800 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.12)] dark:shadow-none dark:border dark:border-surface-700 dark:hover:border-green-500/50 transition-all duration-300 cursor-pointer overflow-hidden block"
              >
                <motion.div variants={fadeUp} whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                    {/* Efek Glow di sudut saat hover */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-400/10 dark:bg-green-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-surface-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-green-200/50 dark:border-green-700/30">
                        {/* ⬇️ INI BAGIAN PENTING YANG DIUBAH: Menggunakan tag img untuk merender URL gambar */}
                        <img src={f.icon_url} alt={f.title} className="w-7 h-7 object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                        {f.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                        {f.description}
                    </p>
                </motion.div>
              </CardWrapper>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}