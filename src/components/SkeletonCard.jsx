/**
 * SkeletonCard.jsx — Komponen Loading State (Kerangka)
 * Menampilkan placeholder animasi pulse saat data sedang dimuat.
 * Warna adaptif untuk mode terang dan gelap.
 */

export default function SkeletonCard({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-6 bg-gray-100 dark:bg-surface-800 animate-pulse"
        >
          {/* Ikon placeholder */}
          <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-surface-700 mb-5" />

          {/* Judul placeholder */}
          <div className="h-5 w-3/4 rounded-lg bg-gray-200 dark:bg-surface-700 mb-3" />

          {/* Deskripsi placeholder — 3 baris */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-surface-700" />
            <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-surface-700" />
            <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-surface-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
