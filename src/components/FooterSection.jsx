/**
 * FooterSection.jsx — Dynamic Footer Component
 * Menggunakan data dari CMS FooterConfig, dengan fallback ke data statis
 */
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, ExternalLink, Globe } from "lucide-react";
import logoImg from "../assets/logo-inpeta.png";

const defaultFooter = {
  description: "",
  alamat: "",
  email: "",
  telepon: "",
  copyright: "",
};

const quickLinks = [
  { l: "Dashboard", t: "/dashboard" },
  { l: "Peta Wilayah", t: "/peta" },
  { l: "Puskeswan", t: "/puskeswan" },
];

/* Inline SVG icons for social media (lucide-react v1 dropped brand icons) */
const SocialIcon = ({ type }) => {
  const icons = {
    facebook: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    ),
  };
  return icons[type] || null;
};

export default function FooterSection({ footerConfig, menus = [] }) {
  const ft = footerConfig || defaultFooter;
  const footerLogo = ft.logo_url || logoImg;

  const socialLinks = [
    { key: "facebook", url: ft.facebook_url },
    { key: "instagram", url: ft.instagram_url },
    { key: "twitter", url: ft.twitter_url },
    { key: "youtube", url: ft.youtube_url },
  ].filter((s) => s.url);

  return (
    <footer id="kontak" className="relative z-10 bg-green-950 dark:bg-surface-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Kolom 1: Logo + Deskripsi + Sosial */}
          <div>
            <img
              src={footerLogo}
              alt="Logo InPETA"
              className="h-10 w-auto mb-4 drop-shadow-md opacity-90"
              onError={(e) => { e.target.onerror = null; e.target.src = logoImg; }}
            />
            <p className="text-green-300/70 text-sm leading-relaxed">
              {ft.description}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-5">
                {socialLinks.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-green-900/50 hover:bg-green-800 flex items-center justify-center text-green-400 hover:text-white transition-all duration-300"
                    title={s.key.charAt(0).toUpperCase() + s.key.slice(1)}
                  >
                    <SocialIcon type={s.key} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Kolom 2: Link Cepat */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Link Cepat</h4>
            <ul className="space-y-3">
              {menus?.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.url}
                    className="flex items-center gap-2 text-sm text-green-400 hover:text-white hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Hubungi Kami */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm text-green-300/70">
              {ft.alamat && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
                  <span>{ft.alamat}</span>
                </li>
              )}
              {ft.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 flex-shrink-0 text-green-400" />
                  <a href={`mailto:${ft.email}`} className="hover:text-white transition-colors">
                    {ft.email}
                  </a>
                </li>
              )}
              {ft.telepon && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 flex-shrink-0 text-green-400" />
                  <a href={`tel:${ft.telepon}`} className="hover:text-white transition-colors">
                    {ft.telepon}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-green-800/50">
          <p className="text-xs text-white/60 text-center">
            {ft.copyright ? `© ${new Date().getFullYear()} ${ft.copyright}` : ""}
          </p>
        </div>
      </div>
    </footer>
  );
}
