/**
 * useScrollytelling.js — Hook untuk animasi background berbasis scroll
 * Memuat 59 frame gambar dan memetakan posisi scroll ke indeks frame.
 */
import { useState, useEffect, useRef } from "react";

const TOTAL_FRAMES = 59;

// Bangun daftar URL frame menggunakan Vite glob import
const frameModules = import.meta.glob(
  "../assets/VIDEO_BACKGROUND_2/VIDEO_BACKGROUND_2_*.jpg",
  { eager: true, import: "default" }
);

// Urutkan berdasarkan nama file agar indeks benar (000–058)
const frameSources = Object.keys(frameModules)
  .sort()
  .map((key) => frameModules[key]);

export default function useScrollytelling() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const preloaded = useRef(false);

  // Preload semua gambar ke memori browser
  useEffect(() => {
    if (preloaded.current) return;
    preloaded.current = true;
    frameSources.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Dengarkan scroll dan petakan ke indeks frame
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.min(scrollTop / docHeight, 1);
      const idx = Math.min(Math.floor(pct * TOTAL_FRAMES), TOTAL_FRAMES - 1);
      setCurrentFrame(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { currentFrame, frameSrc: frameSources[currentFrame] || frameSources[0] };
}
