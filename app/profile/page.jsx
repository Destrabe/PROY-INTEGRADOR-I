
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/AuthContext';
import { uploadProfilePhoto } from '@/firebase/uploadProfilePhoto';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '@/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';

const tabs = ["Trabajos", "Reseñas", "Sobre mí", "Portfolio"];

const jobs = [
  {
    title: "Título del trabajo",
    date: "Feb 2025",
    duration: "3 semanas",
    status: "Completado",
    description: "Descripción del trabajo realizado con excelentes resultados para el cliente.",
    tags: ["Diseño", "UI/UX", "Figma"],
    amount: "s/ 9,500.00",
  },
  {
    title: "Descripcion",
    date: "Feb 2025",
    duration: "3 semanas",
    status: null,
    description: "Descripción del proyecto de desarrollo completado satisfactoriamente.",
    tags: ["React", "Node.js", "API"],
    amount: null,
  },
];

const reputationItems = [
  { label: "Calidad", score: 0 },
  { label: "Comunicación", score: 0 },
  { label: "Puntualidad", score: 0 },
  { label: "Precio", score: 0 },
];

export default function NexoraProfile() {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState("Trabajos");
  const [showSettings, setShowSettings] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tempPreview, setTempPreview] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  // Estado para la edición de configuración
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    city: '',
    phone: '',
    birth_date: ''
  });

  // Cargar datos del usuario al abrir configuración
  useEffect(() => {
    if (user) {
      setEditData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        city: user.city || '',
        phone: user.phone || '',
        birth_date: user.birth_date || ''
      });
    }
  }, [user, showSettings]);

  const handleSaveSettings = async () => {
    if (!user?.uid) return;
    try {
      setUploading(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, editData);
      updateUser(editData);
      setShowSettings(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar el perfil");
    } finally {
      setUploading(false);
    }
  };

  const createZoomedImage = useCallback(() => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 500;
        canvas.width = size;
        canvas.height = size;
        const scale = Math.max(size / img.width, size / img.height) * zoom;
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (size - width) / 2;
        const y = (size - height) / 2;
        ctx.drawImage(img, x, y, width, height);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      };
      img.src = tempPreview;
    });
  }, [tempPreview, zoom]);

  const handleApplyImage = async () => {
    if (!selectedFile || !user?.uid) return;
    try {
      setUploading(true);
      const zoomedFile = await createZoomedImage();
      const photoURL = await uploadProfilePhoto(user.uid, zoomedFile);
      setPreview(photoURL);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { photoURL });
      updateUser({ photoURL });
      setShowEditModal(false);
      setSelectedFile(null);
      setTempPreview(null);
      setZoom(1);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTempPreview(URL.createObjectURL(file));
    setSelectedFile(file);
    setShowUploadModal(false);
    setShowEditModal(true);
    e.target.value = "";
  };

  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen bg-[#0A0A0F] text-white font-sans selection:bg-[#6c63ff]/30">
        <main className="max-w-7xl mx-auto px-6 pt-28 pb-20 space-y-10">
          
          {/* Perfil Header Card */}
          <div className="bg-[#111118] rounded-[2.5rem] p-10 border border-white/[0.05] shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-[#6c63ff] flex-shrink-0 shadow-2xl border-4 border-white/[0.05]">
                {preview || user?.photoURL ? (
                  <img src={preview || user.photoURL} alt="perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black uppercase">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <h1 className="text-4xl font-black tracking-tight">{user?.first_name} {user?.last_name}</h1>
                  <span className="flex items-center gap-2 bg-[#6c63ff]/10 text-[#6c63ff] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#6c63ff]/20">
                    <Image src="/svg/checkIcon.svg" alt="check" width={14} height={14} />
                    Verificado
                  </span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-2">📍 {user?.city || "Sin ciudad"}</span>
                  <span className="flex items-center gap-2 text-emerald-400">🟢 Disponible ahora</span>
                  <span className="flex items-center gap-2 text-amber-400">⭐ 0.0 (0 reseñas)</span>
                </div>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">Desarrollador fullstack con experiencia en productos digitales modernos.</p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button className="bg-[#6c63ff] hover:bg-[#5a52d5] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#6c63ff]/20">Contratar</button>
                <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all">Mensaje</button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { value: "0", label: "Trabajos" },
              { value: "0.0", label: "Valoración" },
              { value: "0%", label: "Éxito" },
              { value: "Nuevo", label: "En Nexora" },
              { value: "S/ 0", label: "Tarifa" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-[#111118] rounded-[2rem] p-8 text-center border border-white/[0.05]">
                <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-3">{label}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-8">
              <div className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/[0.05]">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Información</h2>
                <div className="space-y-6 text-sm font-bold">
                  <div className="flex justify-between text-slate-400"><span>Ciudad</span><span className="text-white">{user?.city || 'No especificada'}</span></div>
                  <div className="flex justify-between text-slate-400"><span>Teléfono</span><span className="text-white">{user?.phone || 'No especificado'}</span></div>
                  <div className="flex justify-between text-slate-400"><span>Rol</span><span className="text-[#6c63ff] uppercase">{user?.rol}</span></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="flex p-2 bg-[#111118] rounded-2xl border border-white/[0.05] gap-2">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? "bg-[#6c63ff] text-white shadow-xl" : "text-slate-500 hover:text-white"}`}>{tab}</button>
                ))}
              </div>
              {activeTab === "Trabajos" ? (
                <div className="space-y-6">
                  {jobs.map((job, i) => (
                    <div key={i} className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/[0.05] hover:border-[#6c63ff]/30 transition-all group">
                      <div className="flex justify-between items-start mb-4"><h3 className="text-xl font-black text-white group-hover:text-[#6c63ff] transition-colors">{job.title}</h3>{job.amount && <span className="text-lg font-black text-white">{job.amount}</span>}</div>
                      <div className="flex gap-6 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6"><span>📅 {job.date}</span><span>⏱️ {job.duration}</span>{job.status && <span className="text-emerald-400">● {job.status}</span>}</div>
                      <p className="text-slate-400 leading-relaxed mb-8">{job.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#111118] rounded-[2.5rem] p-20 text-center border border-white/[0.05]">
                  <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">No hay contenido disponible aún</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Botón Configuración Flotante */}
        <button onClick={() => setShowSettings(true)} className="fixed bottom-10 right-10 bg-[#6c63ff] p-5 rounded-[2rem] shadow-2xl hover:scale-110 transition-all z-50 group">
          <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
        </button>

        {/* Modal de Configuración - TOTALMENTE FUNCIONAL */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
            <div className="bg-[#111118] w-full max-w-2xl rounded-[3rem] p-12 border border-white/[0.05] relative shadow-2xl max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowSettings(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white text-2xl">✕</button>
              <h2 className="text-2xl font-black mb-10 uppercase tracking-widest">Configuración del Perfil</h2>
              
              <div className="space-y-8">
                {/* Foto de Perfil */}
                <div className="flex flex-col items-center gap-6 pb-8 border-b border-white/[0.03]">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#6c63ff]">
                    {user?.photoURL ? <img src={user.photoURL} alt="perfil" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#6c63ff] flex items-center justify-center font-black text-2xl uppercase">{user?.first_name?.[0]}</div>}
                  </div>
                  <button onClick={() => setShowUploadModal(true)} className="text-[10px] font-black uppercase tracking-widest text-[#6c63ff] hover:text-white transition-colors">Cambiar Foto de Perfil</button>
                </div>

                {/* Formulario de Datos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nombre</label>
                    <input type="text" value={editData.first_name} onChange={(e) => setEditData({...editData, first_name: e.target.value})} className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#6c63ff] outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Apellido</label>
                    <input type="text" value={editData.last_name} onChange={(e) => setEditData({...editData, last_name: e.target.value})} className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#6c63ff] outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Ciudad</label>
                    <input type="text" value={editData.city} onChange={(e) => setEditData({...editData, city: e.target.value})} className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#6c63ff] outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Teléfono</label>
                    <input type="text" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#6c63ff] outline-none transition-all" />
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button onClick={() => setShowSettings(false)} className="flex-1 py-5 rounded-2xl bg-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Cancelar</button>
                  <button onClick={handleSaveSettings} disabled={uploading} className="flex-1 py-5 rounded-2xl bg-[#6c63ff] font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#6c63ff]/20 hover:bg-[#5a52d5] transition-all">
                    {uploading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modales de Imagen (Subida y Edición) */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[110] p-6">
            <div className="bg-[#111118] w-full max-w-lg rounded-[3rem] p-12 border border-white/[0.05] relative shadow-2xl">
              <button onClick={() => setShowUploadModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white text-2xl">✕</button>
              <h2 className="text-2xl font-black text-center mb-10 uppercase tracking-widest">Seleccionar Foto</h2>
              <label className="block border-4 border-dashed border-white/5 rounded-[2.5rem] p-16 text-center hover:border-[#6c63ff]/50 transition-all cursor-pointer bg-white/[0.01]">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <div className="bg-[#6c63ff]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#6c63ff] text-4xl">+</div>
                <p className="font-black uppercase tracking-widest text-xs">Subir desde dispositivo</p>
              </label>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[120] p-6">
            <div className="bg-[#111118] w-full max-w-xl rounded-[3rem] p-12 border border-white/[0.05] shadow-2xl">
              <h2 className="text-2xl font-black text-center mb-10 uppercase tracking-widest">Ajustar Imagen</h2>
              <div className="flex justify-center mb-12">
                <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-[#6c63ff] shadow-2xl shadow-[#6c63ff]/20">
                  <img src={tempPreview} alt="preview" className="w-full h-full object-cover" style={{ transform: `scale(${zoom})` }} />
                </div>
              </div>
              <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none accent-[#6c63ff] mb-12" />
              <div className="grid grid-cols-2 gap-6">
                <button onClick={() => { setShowEditModal(false); setTempPreview(null); }} className="py-5 rounded-2xl bg-white/5 font-black uppercase tracking-widest text-[10px]">Cancelar</button>
                <button onClick={handleApplyImage} disabled={uploading} className="py-5 rounded-2xl bg-[#6c63ff] font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#6c63ff]/20">
                  {uploading ? "Aplicando..." : "Aplicar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
