import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PetaWilayah from "./pages/PetaWilayah";
import Puskeswan from "./pages/Puskeswan";
import Dashboard from "./pages/Dashboard"; // WAJIB ADA
import LoginPage from "./pages/LoginPage"; // WAJIB ADA
import BeritaPage from "./pages/BeritaPage";
import { ToastProvider } from "./context/ToastContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import Toast from "./components/Toast";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Simulasi loading — ganti dengan logika asli (fetch data, auth check, dll.)
    const timer = setTimeout(() => setAppReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DarkModeProvider>
      <ToastProvider>
        {/* Loading Screen — tampil saat appReady === false */}
        <LoadingScreen isLoading={!appReady} />

        <Toast />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/peta" element={<PetaWilayah />} />
            <Route path="/puskeswan" element={<Puskeswan />} />
            <Route path="/berita" element={<BeritaPage />} />
            
            {/* 👇 DUA BARIS INI YANG BIKIN LOGIN KAMU JALAN 👇 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </ToastProvider>
    </DarkModeProvider>
  );
}

export default App;