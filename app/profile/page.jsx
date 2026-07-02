"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/components/AuthContext";
import { uploadProfilePhoto } from "@/firebase/uploadProfilePhoto";
import ProtectedRoute from "@/components/ProtectedRoute";
import { db } from "@/firebase/client";
import { doc, updateDoc, onSnapshot, collection, query, where } from "firebase/firestore";

// --- ICONOS SVG INLINE PROFESIONALES ---
const Icons = {
  Settings: () => (
    <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Star: ({ fill = "none" }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Calendar: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  Briefcase: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  ),
};

// --- COMPONENTE TOAST ---
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400";

  return (
    <div className={`fixed bottom-8 right-8 ${styles} border p-5 rounded-2xl flex items-center gap-4 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-2xl backdrop-blur-md`}>
      <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
      <p className="text-sm font-black uppercase tracking-widest">{message}</p>
    </div>
  );
}

export default function NexoraProfile() {
  const { user } = useAuth();
  
  // Datos Firebase
  const [userData, setUserData] = useState(null);
  const [rawTrabajos, setRawTrabajos] = useState([]);
  const [rawReseñas, setRawReseñas] = useState([]);
  const [rawPortfolio, setRawPortfolio] = useState([]);
  
  // UI
  const [activeTab, setActiveTab] = useState("Trabajos");
  const [showSettings, setShowSettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [tempPreview, setTempPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [toast, setToast] = useState(null);

  const [editData, setEditData] = useState({
    first_name: "", last_name: "", city: "", phone: "", birth_date: "", about_me: "", disponibilidad: true,
  });

  // --- ESCUCHA TIEMPO REAL (SIN ERRORES DE ÍNDICE) ---
  useEffect(() => {
    if (!user?.uid) return;

    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData(data);
        setEditData({
          first_name: data.first_name || "", last_name: data.last_name || "", city: data.city || "",
          phone: data.phone || "", birth_date: data.birth_date || "",
          about_me: data.about_me || "Desarrollador fullstack con experiencia en productos digitales modernos.",
          disponibilidad: data.disponibilidad ?? true,
        });
      }
    });

    const qTrabajos = query(collection(db, "solicitudes"), where("userId", "==", user.uid));
    const unsubTrabajos = onSnapshot(qTrabajos, (snap) => setRawTrabajos(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qReseñas = query(collection(db, "reviews"), where("targetUserId", "==", user.uid));
    const unsubReseñas = onSnapshot(qReseñas, (snap) => setRawReseñas(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qPortfolio = query(collection(db, "portfolio"), where("userId", "==", user.uid));
    const unsubPortfolio = onSnapshot(qPortfolio, (snap) => setRawPortfolio(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubUser(); unsubTrabajos(); unsubReseñas(); unsubPortfolio(); };
  }, [user?.uid]);

  // --- PROCESAMIENTO CLIENT-SIDE (EVITA ERRORES DE FIREBASE) ---
  const trabajos = useMemo(() => rawTrabajos.filter(t => t.estado === "Aprobado").sort((a, b) => (b.fecha?.seconds || 0) - (a.fecha?.seconds || 0)), [rawTrabajos]);
  const reseñas = useMemo(() => [...rawReseñas].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)), [rawReseñas]);
  const portfolio = useMemo(() => [...rawPortfolio].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)), [rawPortfolio]);
  
  const reputacion = useMemo(() => {
    if (reseñas.length === 0) return { score: "0.0", count: 0 };
    const sum = reseñas.reduce((acc, r) => acc + r.rating, 0);
    return { score: (sum / reseñas.length).toFixed(1), count: reseñas.length };
  }, [reseñas]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleSaveSettings = async () => {
    if (!user?.uid) return;
    try {
      setIsSaving(true);
      await updateDoc(doc(db, "users", user.uid), editData);
      showToast("Perfil actualizado");
      setShowSettings(false);
    } catch (e) { showToast("Error al guardar", "error"); }
    finally { setIsSaving(false); }
  };

  const createZoomedImage = useCallback(() => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 500; canvas.width = size; canvas.height = size;
        const scale = Math.max(size / img.width, size / img.height) * zoom;
        const width = img.width * scale; const height = img.height * scale;
        ctx.drawImage(img, (size - width) / 2, (size - height) / 2, width, height);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      };
      img.src = tempPreview;
    });
  }, [tempPreview, zoom]);

  const handleApplyImage = async () => {
    if (!selectedFile || !user?.uid) return;
    try {
      setUploading(true);
      const blob = await createZoomedImage();
      const photoURL = await uploadProfilePhoto(user.uid, blob);
      await updateDoc(doc(db, "users", user.uid), { photoURL });
      showToast("Foto actualizada");
      setShowEditModal(false);
    } catch (e) { showToast("Error al subir", "error"); }
    finally { setUploading(false); }
  };

  if (!userData) return <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen bg-[#0A0A0F] text-white font-sans selection:bg-[#6c63ff]/30">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <main className="max-w-7xl mx-auto px-6 pt-28 pb-20 space-y-10">
          
          {/* Perfil Header Card */}
          <div className="bg-[#111118] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-[#6c63ff] shrink-0 shadow-2xl border-4 border-white/5">
                {userData.photoURL ? (
                  <img src={userData.photoURL} alt="perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black uppercase">{userData.first_name?.[0]}{userData.last_name?.[0]}</div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <h1 className="text-4xl font-black tracking-tight">{userData.first_name} {userData.last_name}</h1>
                  <span className="flex items-center gap-2 bg-[#6c63ff]/10 text-[#6c63ff] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#6c63ff]/20">
                    <Icons.Check /> Verificado
                  </span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Icons.MapPin /> {userData.city || "Sin ciudad"}</span>
                  <span className={`flex items-center gap-2 ${userData.disponibilidad ? "text-emerald-400" : "text-red-400"}`}>
                    <div className={`w-2 h-2 rounded-full ${userData.disponibilidad ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}></div>
                    {userData.disponibilidad ? "Disponible ahora" : "No disponible"}
                  </span>
                  <span className="flex items-center gap-2 text-amber-400"><Icons.Star fill="currentColor" /> {reputacion.score} ({reputacion.count} reseñas)</span>
                </div>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium italic">
                  "{userData.about_me}"
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button className="bg-[#6c63ff] hover:bg-[#5a52d5] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#6c63ff]/20">Contratar</button>
                <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all">Mensaje</button>
              </div>
            </div>
          </div>

          {/* Stats Row (TARIFA ELIMINADA) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: trabajos.length, label: "Trabajos" },
              { value: reputacion.score, label: "Valoración" },
              { value: "100%", label: "Éxito" },
              { value: "Nuevo", label: "En Nexora" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-[#111118] rounded-4xl p-8 text-center border border-white/5 hover:border-[#6c63ff]/30 transition-all">
                <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-3">{label}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-8">
              <div className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/5">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2"><Icons.Briefcase /> Información</h2>
                <div className="space-y-6 text-sm font-bold">
                  <div className="flex justify-between text-slate-400 border-b border-white/3 pb-4"><span>Ciudad</span><span className="text-white font-black">{userData.city || "No especificada"}</span></div>
                  <div className="flex justify-between text-slate-400 border-b border-white/3 pb-4"><span>Teléfono</span><span className="text-white font-black">{userData.phone || "No especificado"}</span></div>
                  <div className="flex justify-between text-slate-400"><span>Rol</span><span className="text-[#6c63ff] uppercase font-black">{userData.rol || "Cliente"}</span></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="flex p-2 bg-[#111118] rounded-2xl border border-white/5 gap-2">
                {["Trabajos", "Reseñas", "Sobre mí", "Portfolio"].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? "bg-[#6c63ff] text-white shadow-xl" : "text-slate-500 hover:text-white"}`}>{tab}</button>
                ))}
              </div>

              <div className="min-h-[300px]">
                {activeTab === "Trabajos" && (
                  <div className="space-y-6">
                    {trabajos.length > 0 ? trabajos.map(job => (
                      <div key={job.id} className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/5 hover:border-[#6c63ff]/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-black text-white group-hover:text-[#6c63ff] transition-colors">{job.profesion}</h3>
                          <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-400/20 px-4 py-1.5 rounded-full bg-emerald-400/5">Completado</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed mb-6 italic">"{job.descripcion}"</p>
                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Icons.Calendar /> {new Date(job.fecha?.seconds * 1000).toLocaleDateString()}</div>
                      </div>
                    )) : <div className="bg-[#111118] rounded-[2.5rem] p-20 text-center border border-white/5 opacity-30 font-black uppercase tracking-[0.3em] text-[10px]">Sin trabajos aún</div>}
                  </div>
                )}

                {activeTab === "Reseñas" && (
                  <div className="space-y-6">
                    {reseñas.length > 0 ? reseñas.map(r => (
                      <div key={r.id} className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex text-amber-400 gap-1">{[...Array(5)].map((_, i) => <Icons.Star key={i} fill={i < r.rating ? "currentColor" : "none"} />)}</div>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Icons.Calendar /> {new Date(r.timestamp?.seconds * 1000).toLocaleDateString()}</span>
                        </div>
                        <p className="text-white text-lg font-medium italic mb-4">"{r.comment}"</p>
                        <p className="text-[10px] font-black text-[#6c63ff] uppercase tracking-widest">— {r.authorName || "Cliente"}</p>
                      </div>
                    )) : <div className="bg-[#111118] rounded-[2.5rem] p-20 text-center border border-white/5 opacity-30 font-black uppercase tracking-[0.3em] text-[10px]">Sin reseñas aún</div>}
                  </div>
                )}

                {activeTab === "Sobre mí" && (
                  <div className="bg-[#111118] rounded-[2.5rem] p-12 border border-white/5">
                    <h3 className="text-2xl font-black text-white mb-6">Biografía</h3>
                    <p className="text-slate-400 text-xl leading-relaxed italic font-medium">"{userData.about_me}"</p>
                  </div>
                )}

                {activeTab === "Portfolio" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolio.length > 0 ? portfolio.map(p => (
                      <div key={p.id} className="bg-[#111118] rounded-[2.5rem] overflow-hidden border border-white/5 group hover:border-[#6c63ff]/30 transition-all">
                        <div className="aspect-video bg-[#0A0A0F] overflow-hidden"><img src={p.imageUrl} alt="p" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                        <div className="p-8"><h4 className="text-lg font-black text-white uppercase tracking-widest">{p.title}</h4></div>
                      </div>
                    )) : <div className="col-span-full bg-[#111118] rounded-[2.5rem] p-20 text-center border border-white/5 opacity-30 font-black uppercase tracking-[0.3em] text-[10px]">Portfolio vacío</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Botón Configuración Flotante */}
        <button onClick={() => setShowSettings(true)} className="fixed bottom-10 right-10 bg-[#6c63ff] p-5 rounded-4xl shadow-2xl hover:scale-110 transition-all z-50 group"><Icons.Settings /></button>

        {/* Modal Configuración */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
            <div className="bg-[#111118] w-full max-w-2xl rounded-[3rem] p-12 border border-white/5 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button onClick={() => setShowSettings(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><Icons.X /></button>
              <h2 className="text-2xl font-black mb-10 uppercase tracking-widest">Configuración</h2>
              
              <div className="space-y-8">
                {/* Disponibilidad Toggle */}
                <div className="flex items-center justify-between p-6 bg-[#0A0A0F] rounded-2xl border border-white/5">
                  <p className="text-sm font-black text-white uppercase tracking-widest">Disponibilidad</p>
                  <button onClick={() => setEditData({...editData, disponibilidad: !editData.disponibilidad})} className={`w-12 h-7 rounded-full relative transition-all ${editData.disponibilidad ? "bg-emerald-500" : "bg-slate-800"}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${editData.disponibilidad ? "left-6" : "left-1"}`}></div></button>
                </div>

                <div className="flex flex-col items-center gap-6 pb-8 border-b border-white/3">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#6c63ff]">{userData.photoURL ? <img src={userData.photoURL} alt="p" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#6c63ff] flex items-center justify-center text-3xl font-black">{userData.first_name?.[0]}</div>}</div>
                  <label className="bg-[#6c63ff] hover:bg-[#5a52d5] text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] cursor-pointer transition-all">Cambiar Foto<input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if(file) { setTempPreview(URL.createObjectURL(file)); setSelectedFile(file); setShowEditModal(true); } }} /></label>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <input type="text" placeholder="Nombre" value={editData.first_name} onChange={e => setEditData({...editData, first_name: e.target.value})} className="bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-3 text-white font-bold" />
                  <input type="text" placeholder="Apellido" value={editData.last_name} onChange={e => setEditData({...editData, last_name: e.target.value})} className="bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-3 text-white font-bold" />
                </div>
                <input type="text" placeholder="Ciudad" value={editData.city} onChange={e => setEditData({...editData, city: e.target.value})} className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-3 text-white font-bold" />
                <input type="tel" placeholder="Teléfono" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-3 text-white font-bold" />
                <textarea rows="3" placeholder="Sobre mí..." value={editData.about_me} onChange={e => setEditData({...editData, about_me: e.target.value})} className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-3 text-white font-bold resize-none" />

                <div className="flex gap-4 pt-6">
                  <button onClick={() => setShowSettings(false)} className="flex-1 bg-white/5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10">Cancelar</button>
                  <button onClick={handleSaveSettings} disabled={isSaving} className="flex-1 bg-[#6c63ff] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#6c63ff]/20">{isSaving ? "Guardando..." : "Guardar Cambios"}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Recorte */}
        {showEditModal && tempPreview && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[200] p-6">
            <div className="bg-[#111118] w-full max-w-lg rounded-[3rem] p-10 border border-white/5 relative shadow-2xl">
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-center">Ajustar Foto</h2>
              <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-[#6c63ff] bg-[#0A0A0F] mb-8"><img src={tempPreview} alt="p" style={{ transform: `scale(${zoom})` }} className="w-full h-full object-cover transition-transform" /></div>
              <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#6c63ff] mb-8" />
              <div className="flex gap-4"><button onClick={() => setShowEditModal(false)} className="flex-1 bg-white/5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancelar</button><button onClick={handleApplyImage} disabled={uploading} className="flex-1 bg-[#6c63ff] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">{uploading ? "Subiendo..." : "Aplicar"}</button></div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
