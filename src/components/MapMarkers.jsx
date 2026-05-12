/**
 * MapMarkers.jsx — Komponen Marker Interaktif & Clustering
 *
 * Menampilkan marker fasilitas (Puskeswan, dll.) di atas peta Leaflet
 * dengan fitur:
 * - MarkerClusterGroup untuk auto-clustering saat zoom out
 * - Custom L.divIcon modern (dot indicator teal/hijau)
 * - Popup estetik dark-theme dengan detail fasilitas
 * - Animasi & micro-interactions
 *
 * Props:
 *   places — Array of { id, nama, lat, lng, alamat, kabupaten,
 *            kategori, status?, telepon?, jumlahDokterHewan? }
 *
 * Pustaka: react-leaflet, react-leaflet-cluster, leaflet
 */

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

/* =============================================
   Custom Marker Icon — Modern Dot Indicator
   =============================================
   Menggunakan L.divIcon dengan inline HTML/CSS agar
   tidak bergantung pada file gambar default Leaflet
   (yang sering error missing path di Vite/Webpack).
   ============================================= */
const createMarkerIcon = (kategori = "default") => {
  // Warna berdasarkan kategori
  const colorMap = {
    Puskeswan: { ring: "#0d9488", dot: "#5eead4", glow: "rgba(13,148,136,0.35)" },
    Rumah_Sakit: { ring: "#2563eb", dot: "#93c5fd", glow: "rgba(37,99,235,0.35)" },
    Pasar:      { ring: "#d97706", dot: "#fcd34d", glow: "rgba(217,119,6,0.35)" },
    default:     { ring: "#0d9488", dot: "#5eead4", glow: "rgba(13,148,136,0.35)" },
  };

  const c = colorMap[kategori] || colorMap.default;

  return L.divIcon({
    className: "inpeta-marker", // class kosong — styling lewat html
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
    html: `
      <div style="
        width: 28px;
        height: 28px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Glow ring -->
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: ${c.glow};
          animation: markerPulse 2.5s ease-in-out infinite;
        "></div>
        <!-- Outer ring -->
        <div style="
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${c.ring};
          border: 2.5px solid rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 2px ${c.glow};
          position: relative;
          z-index: 2;
        ">
          <!-- Inner dot -->
          <div style="
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: ${c.dot};
            box-shadow: 0 0 6px ${c.dot};
          "></div>
        </div>
      </div>
    `,
  });
};

/* =============================================
   Custom Cluster Icon
   =============================================
   Override default MarkerCluster icon agar sesuai
   dengan desain dark-theme InPETA.
   ============================================= */
const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();

  // Ukuran & warna berdasarkan jumlah markers
  let size = 40;
  let bg = "#0d9488";      // teal-600
  let ring = "rgba(13,148,136,0.3)";

  if (count >= 10) {
    size = 48;
    bg = "#047857";         // primary-700
    ring = "rgba(4,120,87,0.3)";
  }
  if (count >= 25) {
    size = 56;
    bg = "#065f46";         // primary-800
    ring = "rgba(6,95,70,0.3)";
  }

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <!-- Pulse ring -->
        <div style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: ${ring};
          animation: markerPulse 3s ease-in-out infinite;
        "></div>
        <!-- Main circle -->
        <div style="
          width: ${size - 4}px;
          height: ${size - 4}px;
          border-radius: 50%;
          background: ${bg};
          border: 2.5px solid rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          position: relative;
          z-index: 2;
        ">
          <span style="
            color: white;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 700;
            font-size: ${count >= 100 ? 11 : 13}px;
            line-height: 1;
            letter-spacing: -0.02em;
          ">${count}</span>
        </div>
      </div>
    `,
    className: "inpeta-cluster",
    iconSize: L.point(size, size),
  });
};

/* =============================================
   Helper: Open Google Maps Directions
   =============================================
   Constructs a Google Maps Directions URL using only
   the destination coordinate. By omitting the `origin`
   param, Google Maps will auto-detect the user's
   current GPS location as the starting point.

   URL format:
     https://www.google.com/maps/dir/?api=1&destination=LAT,LNG

   Opens in a new tab so the InPETA app stays open.
   ============================================= */
const handleGetDirections = (lat, lng, namaLokasi) => {
  if (lat == null || lng == null || !isFinite(lat) || !isFinite(lng)) {
    console.warn(
      `[InPETA] Koordinat tidak valid untuk "${namaLokasi || "lokasi"}": lat=${lat}, lng=${lng}`
    );
    return;
  }

  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

/* =============================================
   Komponen Utama: MapMarkers
   ============================================= */
export default function MapMarkers({ places = [] }) {
  if (!places || places.length === 0) return null;

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={60}
      spiderfyOnMaxZoom
      showCoverageOnHover={false}
      zoomToBoundsOnClick
      iconCreateFunction={createClusterIcon}
      animate
    >
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={createMarkerIcon(place.kategori)}
        >
          <Popup
            className="inpeta-popup"
            closeButton={false}
            maxWidth={280}
            minWidth={220}
          >
            {/* ─── Popup Content ─── */}
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              padding: "4px 2px",
              minWidth: 200,
            }}>
              {/* Header: Kategori Badge + Status */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}>
                {/* Kategori */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "rgba(13,148,136,0.15)",
                  border: "1px solid rgba(13,148,136,0.25)",
                  color: "#5eead4",
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#0d9488",
                    display: "inline-block",
                  }} />
                  {place.kategori || "Fasilitas"}
                </span>

                {/* Status Badge */}
                {place.status && (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 8px",
                    borderRadius: 20,
                    background: place.status === "aktif"
                      ? "rgba(16,185,129,0.12)"
                      : "rgba(239,68,68,0.12)",
                    border: `1px solid ${place.status === "aktif"
                      ? "rgba(16,185,129,0.25)"
                      : "rgba(239,68,68,0.25)"}`,
                    color: place.status === "aktif" ? "#34d399" : "#f87171",
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: place.status === "aktif" ? "#10b981" : "#ef4444",
                      display: "inline-block",
                      boxShadow: place.status === "aktif"
                        ? "0 0 6px rgba(16,185,129,0.5)"
                        : "0 0 6px rgba(239,68,68,0.5)",
                    }} />
                    {place.status}
                  </span>
                )}
              </div>

              {/* Nama Fasilitas */}
              <h3 style={{
                margin: "0 0 6px 0",
                fontSize: 15,
                fontWeight: 700,
                color: "#f1f5f9",
                lineHeight: 1.3,
              }}>
                {place.nama}
              </h3>

              {/* Alamat */}
              <p style={{
                margin: "0 0 4px 0",
                fontSize: 11.5,
                color: "#94a3b8",
                lineHeight: 1.45,
              }}>
                {place.alamat}
              </p>

              {/* Kabupaten */}
              {place.kabupaten && (
                <p style={{
                  margin: "0 0 10px 0",
                  fontSize: 11,
                  color: "#64748b",
                }}>
                  📍 {place.kabupaten}
                </p>
              )}

              {/* Divider */}
              <div style={{
                height: 1,
                background: "rgba(255,255,255,0.08)",
                margin: "8px 0",
              }} />

              {/* Detail Row */}
              <div style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}>
                {place.telepon && (
                  <div style={{ flex: "1 1 auto" }}>
                    <p style={{
                      margin: 0, fontSize: 9.5, color: "#64748b",
                      textTransform: "uppercase", fontWeight: 600,
                      letterSpacing: "0.06em", marginBottom: 2,
                    }}>Telepon</p>
                    <p style={{
                      margin: 0, fontSize: 12, color: "#cbd5e1",
                      fontWeight: 500,
                    }}>{place.telepon}</p>
                  </div>
                )}
                {place.jumlahDokterHewan != null && (
                  <div style={{ flex: "0 0 auto" }}>
                    <p style={{
                      margin: 0, fontSize: 9.5, color: "#64748b",
                      textTransform: "uppercase", fontWeight: 600,
                      letterSpacing: "0.06em", marginBottom: 2,
                    }}>Dokter Hewan</p>
                    <p style={{
                      margin: 0, fontSize: 12, color: "#cbd5e1",
                      fontWeight: 600,
                    }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 22, height: 22,
                        borderRadius: 6,
                        background: "rgba(13,148,136,0.15)",
                        color: "#5eead4",
                        fontSize: 12,
                        fontWeight: 700,
                        marginRight: 4,
                      }}>{place.jumlahDokterHewan}</span>
                      orang
                    </p>
                  </div>
                )}
              </div>

              {/* ─── Petunjuk Arah Button ─── */}
              <div style={{
                height: 1,
                background: "rgba(255,255,255,0.08)",
                margin: "10px 0 8px 0",
              }} />
              <button
                type="button"
                onClick={() => handleGetDirections(place.lat, place.lng, place.nama)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  width: "100%",
                  padding: "8px 0",
                  borderRadius: 8,
                  border: "1px solid rgba(13,148,136,0.3)",
                  background: "rgba(13,148,136,0.12)",
                  color: "#5eead4",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(13,148,136,0.25)";
                  e.currentTarget.style.borderColor = "rgba(13,148,136,0.5)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(13,148,136,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(13,148,136,0.12)";
                  e.currentTarget.style.borderColor = "rgba(13,148,136,0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                title={`Buka rute ke ${place.nama || "lokasi"} di Google Maps`}
              >
                🧭 Petunjuk Arah
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
