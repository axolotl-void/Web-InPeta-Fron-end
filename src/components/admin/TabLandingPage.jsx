import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Plus,
  Save,
  Upload,
  CheckCircle,
  CornerDownRight,
  Type,
  Image as ImageIcon,
  BarChart3,
  Menu,
  X,
  Info,
  List,
  Star,
  Newspaper,
} from "lucide-react";
import api from "../../api";
import { useToast } from "../../context/ToastContext";

export default function TabLandingPage({ activeSubTab, refreshTrigger }) {
  const { showToast } = useToast();
  const [listHero, setListHero] = useState([]);
  const [listLogo, setListLogo] = useState([]);
  const [listStats, setListStats] = useState([]);
  const [listMenus, setListMenus] = useState([]);
  const [listTentang, setListTentang] = useState([]);
  const [listTentangPoints, setListTentangPoints] = useState([]);
  const [listFitur, setListFitur] = useState([]);
  const [listFaq, setListFaq] = useState([]);
  const [listBerita, setListBerita] = useState([]);
  const [listFooter, setListFooter] = useState([]);

  const [editHeroId, setEditHeroId] = useState(null);
  const [editStatId, setEditStatId] = useState(null);
  const [editMenuId, setEditMenuId] = useState(null);
  const [editTentangId, setEditTentangId] = useState(null);
  const [editPointId, setEditPointId] = useState(null);
  const [editFiturId, setEditFiturId] = useState(null);
  const [editFaqId, setEditFaqId] = useState(null);
  const [editBeritaId, setEditBeritaId] = useState(null);
  const [editFooterId, setEditFooterId] = useState(null);

  const [heroForm, setHeroForm] = useState({ main_title: "", description: "" });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [statForm, setStatForm] = useState({ stat_value: "", stat_label: "" });
  const [menuForm, setMenuForm] = useState({
    title: "",
    url: "",
    parent_id: "",
  });
  const [tentangForm, setTentangForm] = useState({
    title: "",
    description: "",
    image_url: "",
  });
  const [pointForm, setPointForm] = useState({ text: "", url: "" });
  const [fiturForm, setFiturForm] = useState({
    title: "",
    description: "",
    url: "",
  });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState("");
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });
  const [beritaForm, setBeritaForm] = useState({
    title: "",
    summary: "",
    source_url: "",
  });
  const [beritaImageFile, setBeritaImageFile] = useState(null);
  const [beritaImagePreview, setBeritaImagePreview] = useState("");
  const [footerForm, setFooterForm] = useState({
    description: "",
    alamat: "",
    email: "",
    telepon: "",
    copyright: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    youtube_url: "",
  });
  const [footerLogoFile, setFooterLogoFile] = useState(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState("");
  

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    fetchAllCms();
  }, [refreshTrigger]);

  const fetchAllCms = async () => {
    try {
      const [h, l, s, m, t, tp, f, faq, berita, footer] = await Promise.all([
        api.get("/admin/hero", config),
        api.get("/admin/logo", config),
        api.get("/admin/stats", config),
        api.get("/admin/menus", config),
        api.get("/admin/tentang", config),
        api.get("/admin/tentang-points", config),
        api.get("/admin/fitur-unggulan", config),
        api.get("/admin/faq", config),
        api.get("/admin/berita", config),
        api.get("/admin/footer", config),
      ]);
      setListHero(h.data);
      setListLogo(l.data);
      setListStats(s.data);
      setListMenus(m.data);
      setListTentang(t.data);
      setListTentangPoints(tp.data);
      setListFitur(f.data);
      setListFaq(faq.data);
      setListBerita(berita.data);
      setListFooter(footer.data);
    } catch (e) {
      console.error(e);
    }
  };

  // --- LOGIKA CRUD ---
  const handleSaveHero = async () => {
    if (!heroForm.main_title) return showToast("Judul wajib diisi!", "error");
    try {
      if (editHeroId)
        await api.put(`/admin/hero/${editHeroId}`, heroForm, config);
      else
        await api.post("/admin/hero", { ...heroForm, is_active: true }, config);
      showToast("Hero berhasil disimpan!", "success");
      setHeroForm({ main_title: "", description: "" });
      setEditHeroId(null);
      fetchAllCms();
    } catch (err) {
      showToast("Gagal menyimpan Hero: " + (err.response?.data?.error || err.message), "error");
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveLogo = async () => {
    if (!logoFile) return showToast("Pilih file logo!", "error");
    try {
      const fd = new FormData();
      fd.append("logo", logoFile);
      await api.post("/admin/logo", fd, config);
      showToast("Logo berhasil diunggah!", "success");
      setLogoFile(null);
      setLogoPreview("");
      fetchAllCms();
    } catch (err) {
      showToast("Gagal mengunggah Logo: " + (err.response?.data?.error || err.message), "error");
    }
  };

  const handleSaveStat = async () => {
    if (!statForm.stat_value || !statForm.stat_label)
      return showToast("Lengkapi data statistik!", "error");
    try {
      if (editStatId)
        await api.put(`/admin/stats/${editStatId}`, statForm, config);
      else await api.post("/admin/stats", statForm, config);
      showToast("Statistik berhasil disimpan!", "success");
      setStatForm({ stat_value: "", stat_label: "" });
      setEditStatId(null);
      fetchAllCms();
    } catch (err) {
      showToast("Gagal menyimpan Statistik: " + (err.response?.data?.error || err.message), "error");
    }
  };

  const handleSaveMenu = async () => {
    if (!menuForm.title || !menuForm.url)
      return showToast("Lengkapi judul dan URL menu!", "error");
    try {
      const payload = { ...menuForm, parent_id: menuForm.parent_id || null };
      if (editMenuId)
        await api.put(`/admin/menus/${editMenuId}`, payload, config);
      else await api.post("/admin/menus", payload, config);
      showToast("Menu berhasil disimpan!", "success");
      setMenuForm({ title: "", url: "", parent_id: "" });
      setEditMenuId(null);
      fetchAllCms();
    } catch (err) {
      showToast("Gagal menyimpan Menu: " + (err.response?.data?.error || err.message), "error");
    }
  };

  const deleteItem = async (type, id) => {
    try {
      await api.delete(`/admin/${type}/${id}`, config);
      showToast("Data berhasil dihapus!", "success");
      fetchAllCms();
    } catch (err) {
      showToast("Gagal menghapus data: " + (err.response?.data?.error || err.message), "error");
    }
  };

  const activateItem = async (type, id) => {
    await api.put(`/admin/${type}/${id}/activate`, {}, config);
    fetchAllCms();
  };

  // --- TENTANG CONTENT CRUD ---
  const handleSaveTentang = async () => {
    if (!tentangForm.title || !tentangForm.description)
      return showToast("Judul dan deskripsi wajib diisi!", "error");
    try {
      if (editTentangId)
        await api.put(`/admin/tentang/${editTentangId}`, tentangForm, config);
      else
        await api.post(
          "/admin/tentang",
          { ...tentangForm, is_active: true },
          config,
        );
      showToast("Konten Tentang berhasil disimpan!", "success");
      setTentangForm({ title: "", description: "", image_url: "" });
      setEditTentangId(null);
      fetchAllCms();
    } catch (err) {
      showToast("Gagal menyimpan Konten Tentang: " + (err.response?.data?.error || err.message), "error");
    }
  };

  // --- TENTANG POINTS CRUD ---
  const handleSavePoint = async () => {
    if (!pointForm.text) return showToast("Teks poin wajib diisi!", "error");
    try {
      if (editPointId)
        await api.put(`/admin/tentang-points/${editPointId}`, pointForm, config);
      else await api.post("/admin/tentang-points", pointForm, config);
      showToast("Poin berhasil disimpan!", "success");
      setPointForm({ text: "", url: "" });
      setEditPointId(null);
      fetchAllCms();
    } catch (err) {
      showToast("Gagal menyimpan Poin: " + (err.response?.data?.error || err.message), "error");
    }
  };

  // --- FITUR UNGGULAN CRUD ---
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveFitur = async () => {
    if (!fiturForm.title || !fiturForm.description) {
      return showToast("Judul dan deskripsi fitur wajib diisi!", "error");
    }

    if (!editFiturId && !iconFile) {
      return showToast("Pilih file ikon terlebih dahulu!", "error");
    }

    try {
      const fd = new FormData();
      fd.append("title", fiturForm.title);
      fd.append("description", fiturForm.description);
      fd.append("url", fiturForm.url || "");
      if (iconFile) fd.append("icon", iconFile);

      if (editFiturId) {
        await api.put(`/admin/fitur-unggulan/${editFiturId}`, fd, config);
      } else {
        await api.post("/admin/fitur-unggulan", fd, config);
      }

      showToast("Fitur Unggulan berhasil disimpan!", "success");
      setFiturForm({ title: "", description: "", url: "" });
      setIconFile(null);
      setIconPreview("");
      setEditFiturId(null);
      fetchAllCms();
    } catch (err) {
      showToast("Gagal menyimpan Fitur: " + (err.response?.data?.error || err.message), "error");
    }
  };

  // --- FAQ CRUD ---
  const handleSaveFaq = async () => {
    if (!faqForm.question || !faqForm.answer) {
      return showToast("Pertanyaan dan jawaban wajib diisi!", "error");
    }
    
    try {
      if (editFaqId) {
        await api.put(`/admin/faq/${editFaqId}`, faqForm, config);
      } else {
        await api.post("/admin/faq", faqForm, config);
      }
      showToast("FAQ berhasil disimpan!", "success");
      setFaqForm({ question: "", answer: "" });
      setEditFaqId(null);
      fetchAllCms();
    } catch (err) {
      showToast("Gagal menyimpan FAQ: " + (err.response?.data?.error || err.message), "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* 📍 TAB: CMS - HERO */}
      {activeSubTab === "cms-hero" && (
        <>
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 p-8 rounded-[40px] shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Type className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-black text-xl dark:text-white">
                  {editHeroId ? "Edit Konten Hero" : "Buat Konten Baru"}
                </h4>
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={heroForm.main_title}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, main_title: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                placeholder="Judul Utama"
              />
              <textarea
                rows="3"
                value={heroForm.description}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, description: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                placeholder="Deskripsi Singkat"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSaveHero}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  <Save size={20} />{" "}
                  {editHeroId ? "Simpan Perubahan" : "Simpan & Aktifkan"}
                </button>
                {editHeroId && (
                  <button
                    onClick={() => {
                      setEditHeroId(null);
                      setHeroForm({ main_title: "", description: "" });
                    }}
                    className="px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 rounded-[40px] shadow-sm overflow-hidden p-8">
            <h4 className="font-black text-lg mb-4 dark:text-white">Riwayat Konten Hero</h4>
            <div className="space-y-3">
              {listHero.map((h) => (
                <div
                  key={h.id}
                  className={`p-5 rounded-2xl border ${h.is_active ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"} flex items-center justify-between gap-4`}
                >
                  <div className="flex-1">
                    <h5
                      className={`font-bold ${h.is_active ? "text-blue-900" : "text-slate-700"}`}
                    >
                      {h.main_title}
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {h.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {h.is_active ? (
                      <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase">
                        Aktif
                      </span>
                    ) : (
                      <button
                        onClick={() => activateItem("hero", h.id)}
                        className="p-2.5 text-green-600 hover:bg-green-100 rounded-xl"
                        title="Aktifkan"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditHeroId(h.id);
                        setHeroForm({
                          main_title: h.main_title,
                          description: h.description,
                        });
                        window.scrollTo(0, 0);
                      }}
                      className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteItem("hero", h.id)}
                      className="p-2.5 text-red-500 hover:bg-red-100 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 📍 TAB: CMS - LOGO */}
      {activeSubTab === "cms-logo" && (
        <>
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 p-8 rounded-[40px] shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                <ImageIcon className="text-purple-500" />
              </div>
              <div>
                <h4 className="font-black text-xl dark:text-white">Upload Logo Baru</h4>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleLogoChange}
                  className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-purple-100 file:text-purple-700 bg-slate-50 cursor-pointer text-sm font-medium border border-slate-200"
                />
                <button
                  onClick={handleSaveLogo}
                  className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                >
                  <Upload size={20} /> Upload & Aktifkan
                </button>
              </div>
              {logoPreview && (
                <div className="w-48 h-48 border-2 border-dashed border-purple-300 rounded-3xl flex items-center justify-center bg-purple-50 shrink-0">
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="max-h-32 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 rounded-[40px] shadow-sm p-8">
            <h4 className="font-black text-lg mb-6 dark:text-white">Riwayat Logo Instansi</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {listLogo.map((l) => (
                <div
                  key={l.id}
                  className={`p-4 rounded-3xl border flex flex-col items-center justify-center gap-4 relative ${l.is_active ? "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-800" : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-purple-200 group"}`}
                >
                  <img
                    src={l.image_url}
                    alt="Logo"
                    className="h-16 object-contain"
                  />
                  {l.is_active ? (
                    <span className="px-3 py-1 bg-purple-600 text-white text-[10px] font-black rounded-lg uppercase">
                      Aktif
                    </span>
                  ) : (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                      <button
                        onClick={() => activateItem("logo", l.id)}
                        className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200"
                      >
                        Pakai Ini
                      </button>
                      <button
                        onClick={() => deleteItem("logo", l.id)}
                        className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 📍 TAB: CMS - STATS */}
      {activeSubTab === "cms-stats" && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 p-8 rounded-[40px] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
              <BarChart3 className="text-orange-500" />
            </div>
            <div>
              <h4 className="font-black text-xl dark:text-white">
                {editStatId ? "Edit Statistik" : "Tambah Statistik"}
              </h4>
            </div>
          </div>
          <div className="flex gap-3 items-center mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={statForm.stat_value}
              onChange={(e) =>
                setStatForm({ ...statForm, stat_value: e.target.value })
              }
              className="flex-1 px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-black shadow-sm"
              placeholder="Nilai (Contoh: 10K+)"
            />
            <input
              type="text"
              value={statForm.stat_label}
              onChange={(e) =>
                setStatForm({ ...statForm, stat_label: e.target.value })
              }
              className="flex-[2] px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
              placeholder="Label (Total Ternak)"
            />
            <button
              onClick={handleSaveStat}
              className="px-6 py-3.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 flex items-center gap-2"
            >
              {editStatId ? (
                <>
                  <Save size={18} /> Update
                </>
              ) : (
                <>
                  <Plus size={18} /> Tambah
                </>
              )}
            </button>
            {editStatId && (
              <button
                onClick={() => {
                  setEditStatId(null);
                  setStatForm({ stat_value: "", stat_label: "" });
                }}
                className="px-4 py-3.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-300"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {listStats.map((s) => (
              <div
                key={s.id}
                className="flex gap-4 items-center p-4 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:border-orange-200 transition-colors"
              >
                <div className="w-24 font-black text-lg text-slate-800 dark:text-white">
                  {s.stat_value}
                </div>
                <div className="flex-1 font-medium text-slate-500">
                  {s.stat_label}
                </div>
                <button
                  onClick={() => {
                    setEditStatId(s.id);
                    setStatForm({
                      stat_value: s.stat_value,
                      stat_label: s.stat_label,
                    });
                  }}
                  className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteItem("stats", s.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📍 TAB: CMS - MENUS */}
      {activeSubTab === "cms-menus" && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 p-8 rounded-[40px] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <Menu className="text-cyan-500" />
            </div>
            <div>
              <h4 className="font-black text-xl dark:text-white">
                {editMenuId ? "Edit Menu" : "Tambah Menu"}
              </h4>
              <p className="text-xs text-slate-400 font-bold">
                Pilih Induk Menu untuk membuat Sub-menu (Dropdown).
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
            <div className="flex gap-3 items-center">
              <select
                value={menuForm.parent_id}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, parent_id: e.target.value })
                }
                className="flex-1 px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-bold shadow-sm text-slate-600"
              >
                <option value="">-- Menu Utama --</option>
                {listMenus.map((m) => (
                  <option key={m.id} value={m.id}>
                    Jadikan Sub-Menu dari: {m.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={menuForm.title}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, title: e.target.value })
                }
                className="flex-1 px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-black shadow-sm"
                placeholder="Nama Label Menu"
              />
              <input
                type="text"
                value={menuForm.url}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, url: e.target.value })
                }
                className="flex-[1.5] px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
                placeholder="Tujuan URL (/puskeswan)"
              />
            </div>
            <div className="flex gap-3 justify-end">
              {editMenuId && (
                <button
                  onClick={() => {
                    setEditMenuId(null);
                    setMenuForm({ title: "", url: "", parent_id: "" });
                  }}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm"
                >
                  Batal Edit
                </button>
              )}
              <button
                onClick={handleSaveMenu}
                className="px-8 py-3 bg-cyan-500 text-white rounded-xl font-bold text-sm flex items-center gap-2"
              >
                {editMenuId ? (
                  <>
                    <Save size={18} /> Simpan Perubahan
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Buat Menu Baru
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {listMenus.map((m) => (
              <div key={m.id} className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:border-cyan-300 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-800 dark:text-white text-lg">
                      {m.title}
                    </span>
                    <span className="text-xs font-bold text-cyan-600 bg-cyan-50 w-fit px-2 py-1 rounded-md mt-1">
                      {m.url}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMenuId(m.id);
                        setMenuForm({
                          title: m.title,
                          url: m.url,
                          parent_id: "",
                        });
                        window.scrollTo(0, 0);
                      }}
                      className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteItem("menus", m.id)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {m.children && m.children.length > 0 && (
                  <div className="pl-12 space-y-2">
                    {m.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <CornerDownRight
                              size={16}
                              className="text-slate-400"
                            />{" "}
                            {child.title}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 pl-6">
                            {child.url}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditMenuId(child.id);
                              setMenuForm({
                                title: child.title,
                                url: child.url,
                                parent_id: m.id,
                              });
                              window.scrollTo(0, 0);
                            }}
                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem("menus", child.id)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📍 TAB: CMS - TENTANG CONTENT */}
      {activeSubTab === "cms-tentang" && (
        <>
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 p-8 rounded-[40px] shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
                <Info className="text-teal-500" />
              </div>
              <div>
                <h4 className="font-black text-xl dark:text-white">
                  {editTentangId
                    ? "Edit Konten Tentang"
                    : "Buat Konten Tentang"}
                </h4>
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={tentangForm.title}
                onChange={(e) =>
                  setTentangForm({ ...tentangForm, title: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 font-bold"
                placeholder="Judul Section Tentang"
              />
              <textarea
                rows="4"
                value={tentangForm.description}
                onChange={(e) =>
                  setTentangForm({
                    ...tentangForm,
                    description: e.target.value,
                  })
                }
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                placeholder="Deskripsi lengkap tentang platform..."
              />
              <input
                type="text"
                value={tentangForm.image_url}
                onChange={(e) =>
                  setTentangForm({ ...tentangForm, image_url: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                placeholder="URL Gambar (opsional)"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSaveTentang}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 shadow-lg shadow-teal-600/20"
                >
                  <Save size={20} />{" "}
                  {editTentangId ? "Simpan Perubahan" : "Simpan & Aktifkan"}
                </button>
                {editTentangId && (
                  <button
                    onClick={() => {
                      setEditTentangId(null);
                      setTentangForm({
                        title: "",
                        description: "",
                        image_url: "",
                      });
                    }}
                    className="px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 rounded-[40px] shadow-sm overflow-hidden p-8">
            <h4 className="font-black text-lg mb-4 dark:text-white">Riwayat Konten Tentang</h4>
            <div className="space-y-3">
              {listTentang.map((t) => (
                <div
                  key={t.id}
                  className={`p-5 rounded-2xl border ${t.is_active ? "bg-teal-50 border-teal-200" : "bg-slate-50 border-slate-200"} flex items-center justify-between gap-4`}
                >
                  <div className="flex-1">
                    <h5
                      className={`font-bold ${t.is_active ? "text-teal-900" : "text-slate-700"}`}
                    >
                      {t.title}
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {t.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {t.is_active ? (
                      <span className="px-4 py-2 bg-teal-600 text-white text-[10px] font-black rounded-xl uppercase">
                        Aktif
                      </span>
                    ) : (
                      <button
                        onClick={() => activateItem("tentang", t.id)}
                        className="p-2.5 text-green-600 hover:bg-green-100 rounded-xl"
                        title="Aktifkan"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditTentangId(t.id);
                        setTentangForm({
                          title: t.title,
                          description: t.description,
                          image_url: t.image_url || "",
                        });
                        window.scrollTo(0, 0);
                      }}
                      className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteItem("tentang", t.id)}
                      className="p-2.5 text-red-500 hover:bg-red-100 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 📍 TAB: CMS - TENTANG POINTS */}
      {activeSubTab === "cms-tentang-points" && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 p-8 rounded-[40px] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-lime-50 flex items-center justify-center">
              <List className="text-lime-600" />
            </div>
            <div>
              <h4 className="font-black text-xl dark:text-white">
                {editPointId ? "Edit Poin" : "Tambah Poin Tentang"}
              </h4>
            </div>
          </div>
          <div className="flex gap-3 items-center mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={pointForm.text}
              onChange={(e) =>
                setPointForm({ ...pointForm, text: e.target.value })
              }
              className="flex-[2] px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-bold shadow-sm"
              placeholder="Teks poin (contoh: Akses data real-time)"
            />
            <input
              type="text"
              value={pointForm.url}
              onChange={(e) =>
                setPointForm({ ...pointForm, url: e.target.value })
              }
              className="flex-1 px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
              placeholder="URL tujuan (opsional)"
            />
            <button
              onClick={handleSavePoint}
              className="px-6 py-3.5 bg-lime-600 text-white rounded-xl font-bold text-sm hover:bg-lime-700 flex items-center gap-2"
            >
              {editPointId ? (
                <>
                  <Save size={18} /> Update
                </>
              ) : (
                <>
                  <Plus size={18} /> Tambah
                </>
              )}
            </button>
            {editPointId && (
              <button
                onClick={() => {
                  setEditPointId(null);
                  setPointForm({ text: "", url: "" });
                }}
                className="px-4 py-3.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-300"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {listTentangPoints.map((p) => (
              <div
                key={p.id}
                className="flex gap-4 items-center p-4 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:border-lime-200 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-bold text-slate-800 dark:text-white">{p.text}</p>
                  {p.url && (
                    <span className="text-xs text-lime-600 font-medium">
                      {p.url}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setEditPointId(p.id);
                    setPointForm({ text: p.text, url: p.url || "" });
                  }}
                  className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteItem("tentang-points", p.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📍 TAB: CMS - FITUR UNGGULAN */}
      {activeSubTab === "cms-fitur" && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 p-8 rounded-[40px] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Star className="text-amber-500" />
            </div>
            <div>
              <h4 className="font-black text-xl dark:text-white">
                {editFiturId ? "Edit Fitur" : "Tambah Fitur Unggulan"}
              </h4>
              <p className="text-xs text-slate-400 font-bold">
                Isi nama ikon Lucide (contoh: Map, BarChart3, Stethoscope,
                FileText)
              </p>
            </div>
          </div>
          <div className="space-y-4 mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={fiturForm.title}
              onChange={(e) =>
                setFiturForm({ ...fiturForm, title: e.target.value })
              }
              className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-black shadow-sm"
              placeholder="Judul Fitur"
            />
            <textarea
              rows="2"
              value={fiturForm.description}
              onChange={(e) =>
                setFiturForm({ ...fiturForm, description: e.target.value })
              }
              className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
              placeholder="Deskripsi fitur..."
            />
            <input
              type="text"
              value={fiturForm.url}
              onChange={(e) =>
                setFiturForm({ ...fiturForm, url: e.target.value })
              }
              className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
              placeholder="URL tujuan, contoh: /peta (opsional)"
            />

            {/* File Upload Ikon */}
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-2">
                  File Ikon (JPG, PNG, SVG)
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/svg+xml"
                  onChange={handleIconChange}
                  className="w-full file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-100 file:text-amber-700 bg-white cursor-pointer text-sm font-medium rounded-xl border border-slate-200 shadow-sm"
                />
              </div>
              {(iconPreview ||
                (editFiturId &&
                  listFitur.find((f) => f.id === editFiturId)?.icon_url)) && (
                <div className="w-20 h-20 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-center bg-amber-50 shrink-0 overflow-hidden">
                  <img
                    src={
                      iconPreview ||
                      listFitur.find((f) => f.id === editFiturId)?.icon_url
                    }
                    alt="Preview"
                    className="max-h-14 max-w-14 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              {editFiturId && (
                <button
                  onClick={() => {
                    setEditFiturId(null);
                    setFiturForm({ title: "", description: "", url: "" });
                    setIconFile(null);
                    setIconPreview("");
                  }}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
              )}
              <button
                onClick={handleSaveFitur}
                className="px-8 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-amber-600"
              >
                {editFiturId ? (
                  <>
                    <Save size={18} /> Simpan
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Tambah Fitur
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {listFitur.map((f) => (
              <div
                key={f.id}
                className="flex gap-4 items-center p-5 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:border-amber-200 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={f.icon_url}
                    alt={f.title}
                    className="max-h-8 max-w-8 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-800 dark:text-white">{f.title}</h5>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {f.description}
                  </p>
                  {f.url && (
                    <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">
                      {f.url}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setEditFiturId(f.id);
                    setFiturForm({
                      title: f.title,
                      description: f.description,
                      url: f.url || "",
                    });
                    setIconFile(null);
                    setIconPreview("");
                    window.scrollTo(0, 0);
                  }}
                  className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteItem("fitur-unggulan", f.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📍 TAB: CMS - FAQ */}
      {activeSubTab === "cms-faq" && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 p-8 rounded-[40px] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Info className="text-indigo-500" />
            </div>
            <div>
              <h4 className="font-black text-xl dark:text-white">
                {editFaqId ? "Edit Pertanyaan" : "Tambah Pertanyaan Umum"}
              </h4>
              <p className="text-xs text-slate-400 font-bold">
                Daftar pertanyaan yang sering diajukan (FAQ)
              </p>
            </div>
          </div>
          
          <div className="space-y-4 mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={faqForm.question}
              onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
              className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-black shadow-sm"
              placeholder="Pertanyaan..."
            />
            <textarea
              rows="3"
              value={faqForm.answer}
              onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
              className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
              placeholder="Jawaban..."
            />
            <div className="flex gap-3 justify-end">
              {editFaqId && (
                <button
                  onClick={() => {
                    setEditFaqId(null);
                    setFaqForm({ question: "", answer: "" });
                  }}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
              )}
              <button
                onClick={handleSaveFaq}
                className="px-8 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-600"
              >
                {editFaqId ? (
                  <>
                    <Save size={18} /> Simpan
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Tambah FAQ
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {listFaq.map((f) => (
              <div
                key={f.id}
                className="flex gap-4 items-center p-5 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:border-indigo-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <span className="text-indigo-600 font-black text-sm">?</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-800 dark:text-white">{f.question}</h5>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {f.answer}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditFaqId(f.id);
                    setFaqForm({
                      question: f.question,
                      answer: f.answer,
                    });
                    window.scrollTo(0, 0);
                  }}
                  className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteItem("faq", f.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📍 TAB: CMS - BERITA */}
      {activeSubTab === "cms-berita" && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 p-8 rounded-[40px] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
              <Newspaper className="text-sky-500" />
            </div>
            <div>
              <h4 className="font-black text-xl dark:text-white">
                {editBeritaId ? "Edit Berita" : "Tambah Berita & Publikasi"}
              </h4>
              <p className="text-xs text-slate-400 font-bold">
                Agregator berita dari sumber eksternal
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={beritaForm.title}
              onChange={(e) => setBeritaForm({ ...beritaForm, title: e.target.value })}
              className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-black shadow-sm"
              placeholder="Judul berita..."
            />
            <textarea
              rows="3"
              value={beritaForm.summary}
              onChange={(e) => setBeritaForm({ ...beritaForm, summary: e.target.value })}
              className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
              placeholder="Ringkasan berita..."
            />
            <input
              type="text"
              value={beritaForm.source_url}
              onChange={(e) => setBeritaForm({ ...beritaForm, source_url: e.target.value })}
              className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
              placeholder="URL sumber berita (https://...)" 
            />
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Gambar Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setBeritaImageFile(file);
                    setBeritaImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition-all"
              />
              {beritaImagePreview && (
                <img src={beritaImagePreview} alt="Preview" className="mt-3 h-32 w-auto rounded-xl object-cover border border-slate-200" />
              )}
            </div>
            <div className="flex gap-3 justify-end">
              {editBeritaId && (
                <button
                  onClick={() => {
                    setEditBeritaId(null);
                    setBeritaForm({ title: "", summary: "", source_url: "" });
                    setBeritaImageFile(null);
                    setBeritaImagePreview("");
                  }}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
              )}
              <button
                onClick={async () => {
                  if (!beritaForm.title || !beritaForm.summary || !beritaForm.source_url) {
                    return showToast("Judul, ringkasan, dan URL sumber wajib diisi!", "error");
                  }
                  if (!editBeritaId && !beritaImageFile) {
                    return showToast("Pilih gambar thumbnail terlebih dahulu!", "error");
                  }
                  try {
                    const fd = new FormData();
                    fd.append("title", beritaForm.title);
                    fd.append("summary", beritaForm.summary);
                    fd.append("source_url", beritaForm.source_url);
                    if (beritaImageFile) fd.append("image", beritaImageFile);

                    if (editBeritaId) {
                      await api.put(`/admin/berita/${editBeritaId}`, fd, config);
                    } else {
                      await api.post("/admin/berita", fd, config);
                    }
                    showToast("Berita berhasil disimpan!", "success");
                    setBeritaForm({ title: "", summary: "", source_url: "" });
                    setBeritaImageFile(null);
                    setBeritaImagePreview("");
                    setEditBeritaId(null);
                    fetchAllCms();
                  } catch (err) {
                    showToast("Gagal menyimpan berita: " + (err.response?.data?.error || err.message), "error");
                  }
                }}
                className="px-8 py-3 bg-sky-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-sky-600 transition-colors"
              >
                {editBeritaId ? (
                  <><Save size={18} /> Simpan</>
                ) : (
                  <><Plus size={18} /> Tambah Berita</>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {listBerita.map((b) => (
              <div
                key={b.id}
                className="flex gap-4 items-center p-4 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:border-sky-200 transition-colors"
              >
                <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-800 dark:text-white line-clamp-1">{b.title}</h5>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{b.summary}</p>
                  <a href={b.source_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-sky-600 font-bold hover:underline mt-1 inline-block">
                    {b.source_url}
                  </a>
                </div>
                <button
                  onClick={() => {
                    setEditBeritaId(b.id);
                    setBeritaForm({
                      title: b.title,
                      summary: b.summary,
                      source_url: b.source_url,
                    });
                    setBeritaImageFile(null);
                    setBeritaImagePreview("");
                    window.scrollTo(0, 0);
                  }}
                  className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteItem("berita", b.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📍 TAB: CMS - FOOTER */}
      {activeSubTab === "cms-footer" && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 p-8 rounded-[40px] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <List className="text-emerald-500" />
            </div>
            <div>
              <h4 className="font-black text-xl dark:text-white">
                {editFooterId ? "Edit Konfigurasi Footer" : "Tambah Konfigurasi Footer"}
              </h4>
              <p className="text-xs text-slate-400 font-bold">
                Atur konten footer website publik
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Logo Footer</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFooterLogoFile(file);
                    setFooterLogoPreview(URL.createObjectURL(file));
                  }
                }}
                className="w-full text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100 transition-all"
              />
              {footerLogoPreview && (
                <img src={footerLogoPreview} alt="Preview" className="mt-3 h-12 w-auto rounded-lg bg-slate-800 p-2" />
              )}
            </div>

            <textarea
              rows="2"
              value={footerForm.description}
              onChange={(e) => setFooterForm({ ...footerForm, description: e.target.value })}
              className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
              placeholder="Deskripsi footer (tentang organisasi)..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={footerForm.alamat}
                onChange={(e) => setFooterForm({ ...footerForm, alamat: e.target.value })}
                className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
                placeholder="Alamat kantor..."
              />
              <input
                type="email"
                value={footerForm.email}
                onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
                placeholder="Email (contoh: info@email.com)"
              />
              <input
                type="text"
                value={footerForm.telepon}
                onChange={(e) => setFooterForm({ ...footerForm, telepon: e.target.value })}
                className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
                placeholder="Telepon (contoh: 0651-7551234)"
              />
              <input
                type="text"
                value={footerForm.copyright}
                onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
                className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
                placeholder="Teks copyright..."
              />
            </div>

            <p className="text-xs font-bold text-slate-400 mt-2">Sosial Media (Opsional)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="url"
                value={footerForm.facebook_url}
                onChange={(e) => setFooterForm({ ...footerForm, facebook_url: e.target.value })}
                className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
                placeholder="URL Facebook"
              />
              <input
                type="url"
                value={footerForm.instagram_url}
                onChange={(e) => setFooterForm({ ...footerForm, instagram_url: e.target.value })}
                className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
                placeholder="URL Instagram"
              />
              <input
                type="url"
                value={footerForm.twitter_url}
                onChange={(e) => setFooterForm({ ...footerForm, twitter_url: e.target.value })}
                className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
                placeholder="URL Twitter / X"
              />
              <input
                type="url"
                value={footerForm.youtube_url}
                onChange={(e) => setFooterForm({ ...footerForm, youtube_url: e.target.value })}
                className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none text-sm font-medium shadow-sm"
                placeholder="URL YouTube"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              {editFooterId && (
                <button
                  onClick={() => {
                    setEditFooterId(null);
                    setFooterForm({ description: "", alamat: "", email: "", telepon: "", copyright: "", facebook_url: "", instagram_url: "", twitter_url: "", youtube_url: "" });
                    setFooterLogoFile(null);
                    setFooterLogoPreview("");
                  }}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
              )}
              <button
                onClick={async () => {
                  if (!footerForm.description || !footerForm.alamat || !footerForm.email || !footerForm.telepon || !footerForm.copyright) {
                    return showToast("Deskripsi, alamat, email, telepon, dan copyright wajib diisi!", "error");
                  }
                  if (!editFooterId && !footerLogoFile) {
                    return showToast("Pilih logo footer terlebih dahulu!", "error");
                  }
                  try {
                    const fd = new FormData();
                    fd.append("description", footerForm.description);
                    fd.append("alamat", footerForm.alamat);
                    fd.append("email", footerForm.email);
                    fd.append("telepon", footerForm.telepon);
                    fd.append("copyright", footerForm.copyright);
                    fd.append("facebook_url", footerForm.facebook_url || "");
                    fd.append("instagram_url", footerForm.instagram_url || "");
                    fd.append("twitter_url", footerForm.twitter_url || "");
                    fd.append("youtube_url", footerForm.youtube_url || "");
                    if (footerLogoFile) fd.append("logo", footerLogoFile);

                    if (editFooterId) {
                      await api.put(`/admin/footer/${editFooterId}`, fd, config);
                    } else {
                      await api.post("/admin/footer", fd, config);
                    }
                    showToast("Footer berhasil disimpan!", "success");
                    setFooterForm({ description: "", alamat: "", email: "", telepon: "", copyright: "", facebook_url: "", instagram_url: "", twitter_url: "", youtube_url: "" });
                    setFooterLogoFile(null);
                    setFooterLogoPreview("");
                    setEditFooterId(null);
                    fetchAllCms();
                  } catch (err) {
                    showToast("Gagal menyimpan footer: " + (err.response?.data?.error || err.message), "error");
                  }
                }}
                className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                {editFooterId ? (
                  <><Save size={18} /> Simpan</>
                ) : (
                  <><Plus size={18} /> Tambah Footer</>
                )}
              </button>
            </div>
          </div>

          {/* Daftar Footer Config */}
          <div className="space-y-3">
            {listFooter.map((ft) => (
              <div
                key={ft.id}
                className={`p-5 rounded-2xl border shadow-sm transition-colors ${
                  ft.is_active
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-white border-slate-100 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {ft.is_active && (
                        <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-md">AKTIF</span>
                      )}
                      <h5 className="font-bold text-slate-800 dark:text-white truncate">{ft.copyright}</h5>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{ft.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{ft.alamat} | {ft.email} | {ft.telepon}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!ft.is_active && (
                      <button
                        onClick={() => activateItem("footer", ft.id)}
                        className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors text-xs font-bold"
                        title="Aktifkan"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditFooterId(ft.id);
                        setFooterForm({
                          description: ft.description,
                          alamat: ft.alamat,
                          email: ft.email,
                          telepon: ft.telepon,
                          copyright: ft.copyright,
                          facebook_url: ft.facebook_url || "",
                          instagram_url: ft.instagram_url || "",
                          twitter_url: ft.twitter_url || "",
                          youtube_url: ft.youtube_url || "",
                        });
                        setFooterLogoFile(null);
                        setFooterLogoPreview("");
                        window.scrollTo(0, 0);
                      }}
                      className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteItem("footer", ft.id)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
