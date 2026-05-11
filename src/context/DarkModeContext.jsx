/**
 * DarkModeContext.jsx — Global dark mode state manager
 * 
 * Reads initial preference from localStorage (set at login),
 * applies `dark` class to <html>, and syncs changes to backend.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";

const DarkModeContext = createContext(null);

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Read from localStorage first for instant paint
    const stored = localStorage.getItem("dark_mode");
    if (stored !== null) return stored === "true";
    // Fallback: check user object
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return !!user.dark_mode;
    } catch { return false; }
  });

  // Apply class to <html> whenever isDark changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("dark_mode", String(isDark));
  }, [isDark]);

  const toggleDarkMode = useCallback(async () => {
    const next = !isDark;
    setIsDark(next);
    // Persist to backend silently
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await api.put("/admin/settings", { dark_mode: next }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn("Failed to sync dark mode:", err);
    }
  }, [isDark]);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used within DarkModeProvider");
  return ctx;
}
