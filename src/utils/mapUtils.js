/**
 * mapUtils.js — Utilitas untuk kalkulasi data peta
 *
 * Berisi fungsi-fungsi helper yang digunakan oleh
 * MainMap dan PetaWilayah untuk menghitung dan
 * memformat data statistik peternakan.
 */

import acehGeoJSON from "../data/aceh_kabupaten.json";

/**
 * Format angka ke format Indonesia (titik sebagai pemisah ribuan)
 * @param {number} num - Angka yang akan diformat
 * @returns {string} Angka yang sudah diformat
 */
export function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Kalkulasi statistik ringkas dari data GeoJSON Aceh
 * @returns {{ totalSapi: number, totalKambing: number, totalAyam: number, totalPopulasi: number }}
 */
export function calcStats() {
  let totalSapi = 0;
  let totalKambing = 0;
  let totalAyam = 0;
  let totalPopulasi = 0;

  acehGeoJSON.features.forEach((f) => {
    const p = f.properties;
    totalSapi += p.sapi || 0;
    totalKambing += p.kambing || 0;
    totalAyam += p.ayam || 0;
    totalPopulasi += p.populasi || 0;
  });

  return { totalSapi, totalKambing, totalAyam, totalPopulasi };
}
