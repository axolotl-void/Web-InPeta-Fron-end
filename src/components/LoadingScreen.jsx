import { useState, useEffect, useCallback } from "react";
import "./LoadingScreen.css";

/**
 * LoadingScreen — Premium full-viewport loading overlay for InPETA.
 *
 * Props:
 *  - isLoading  (boolean)  : controls visibility; when false the screen fades out then unmounts.
 *  - onFinished (function) : optional callback fired after the exit animation completes.
 *  - duration   (number)   : minimum display time in ms (default 0 — follows isLoading).
 */
export default function LoadingScreen({ isLoading = true, onFinished, duration = 0 }) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const startExit = useCallback(() => {
    setLeaving(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onFinished?.();
    }, 620); // matches CSS transition duration (600ms + tiny buffer)
    return () => clearTimeout(timer);
  }, [onFinished]);

  useEffect(() => {
    if (!isLoading) {
      if (duration > 0) {
        const delay = setTimeout(startExit, duration);
        return () => clearTimeout(delay);
      }
      return startExit();
    }
    // reset if isLoading turns back on
    setVisible(true);
    setLeaving(false);
  }, [isLoading, duration, startExit]);

  if (!visible) return null;

  return (
    <div
      className={`loading-screen${leaving ? " is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat aplikasi InPETA"
    >
      {/* Ambient particles */}
      <span className="particle particle--1" aria-hidden="true" />
      <span className="particle particle--2" aria-hidden="true" />
      <span className="particle particle--3" aria-hidden="true" />
      <span className="particle particle--4" aria-hidden="true" />
      <span className="particle particle--5" aria-hidden="true" />

      {/* --- Main loader hub --- */}
      <div className="loader-hub">
        {/* Layer 1 — Radar/pulse rings */}
        <span className="radar-ring radar-ring--1" aria-hidden="true" />
        <span className="radar-ring radar-ring--2" aria-hidden="true" />
        <span className="radar-ring radar-ring--3" aria-hidden="true" />

        {/* Layer 2 — Spinning gradient ring + glow */}
        <span className="spinner-glow" aria-hidden="true" />
        <span className="spinner-ring" aria-hidden="true" />

        {/* Layer 3 — Center livestock icon */}
        <div className="center-icon" aria-hidden="true">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            {/* Minimalist cow head icon */}
            {/* Ears */}
            <ellipse cx="14" cy="18" rx="7" ry="5" transform="rotate(-25 14 18)" fill="#34d399" opacity="0.7" />
            <ellipse cx="50" cy="18" rx="7" ry="5" transform="rotate(25 50 18)" fill="#34d399" opacity="0.7" />
            {/* Inner ears */}
            <ellipse cx="14.5" cy="18" rx="4" ry="2.8" transform="rotate(-25 14.5 18)" fill="#059669" opacity="0.5" />
            <ellipse cx="49.5" cy="18" rx="4" ry="2.8" transform="rotate(25 49.5 18)" fill="#059669" opacity="0.5" />

            {/* Head */}
            <ellipse cx="32" cy="30" rx="18" ry="16" fill="#6ee7b7" />

            {/* Face detail — lighter patch */}
            <ellipse cx="32" cy="34" rx="10" ry="9" fill="#a7f3d0" />

            {/* Horns */}
            <path d="M20 14 Q17 4 22 6" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M44 14 Q47 4 42 6" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Eyes */}
            <circle cx="25" cy="27" r="3" fill="#064e3b" />
            <circle cx="39" cy="27" r="3" fill="#064e3b" />
            {/* Eye glints */}
            <circle cx="26" cy="26" r="1" fill="white" opacity="0.8" />
            <circle cx="40" cy="26" r="1" fill="white" opacity="0.8" />

            {/* Nostrils */}
            <ellipse cx="28" cy="37" rx="2" ry="1.5" fill="#047857" opacity="0.5" />
            <ellipse cx="36" cy="37" rx="2" ry="1.5" fill="#047857" opacity="0.5" />

            {/* Mouth — subtle smile */}
            <path d="M29 40 Q32 43 35 40" stroke="#047857" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />

            {/* Spots on head */}
            <circle cx="22" cy="22" r="3.5" fill="#34d399" opacity="0.4" />
            <circle cx="40" cy="20" r="2.5" fill="#34d399" opacity="0.35" />
          </svg>
        </div>
      </div>

      {/* --- Text --- */}
      <div className="loading-text-group">
        <p className="loading-title">Memuat Data InPETA...</p>
        <p className="loading-subtitle">Menyiapkan peta spasial peternakan...</p>

        {/* Animated dots */}
        <div className="loading-dots" aria-hidden="true">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
      </div>
    </div>
  );
}
