/**
 * main.jsx — Entry Point Aplikasi InPETA
 *
 * File ini adalah titik masuk utama React.
 * Merender komponen App ke dalam elemen #root di index.html.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
