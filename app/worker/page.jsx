'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '@/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { fileToBase64 } from '@/firebase/uploadWorkerFiles'; // Nueva función de conversión

// --- LÍMITES DE ARCHIVOS ---
const MAX_CV_SIZE_MB = 5;
const MAX_IMAGE_SIZE_MB = 3;
const MAX_IMAGES = 4;

// --- ICONOS SVG INLINE ---
const Icons = {
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
  ),
  Image: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
};

// --- COMPONENTE TOAST (mismo diseño usado en profile y admin) ---
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400";

  return (
    <div className={`fixed bottom-8 right-8 ${styles} border p-5 rounded-2xl flex items-center gap-4 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-2xl backdrop-blur-md max-w-md`}>
      <div className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0"></div>
      <p className="text-sm font-black uppercase tracking-widest">{message}</p>
    </div>
  );
}

function TrabajadorPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cv, setCv] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [profesion, setProfesion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authLoading) {
      showToast('Cargando información de usuario. Por favor, inténtalo de nuevo.', 'error');
      return;
    }

    if (!user) {
      showToast('Debes iniciar sesión para enviar una solicitud.', 'error');
      return;
    }

    // Validación de campos requeridos
    if (!profesion.trim()) {
      showToast('La profesión es un campo requerido.', 'error');
      return;
    }
    if (!descripcion.trim()) {
      showToast('La descripción profesional es un campo requerido.', 'error');
      return;
    }
    const experienciaNum = parseInt(experiencia, 10);
    if (isNaN(experienciaNum) || experienciaNum < 0) {
      showToast('Los años de experiencia deben ser un número válido y positivo.', 'error');
      return;
    }
    if (!cv) {
      showToast('Debes subir tu Currículum Vitae (PDF).', 'error');
      return;
    }

    setLoading(true);
    try {
      // 1. Convertir CV a Base64
      const cvBase64 = await fileToBase64(cv);

      // 2. Convertir Imágenes a Base64
      const imagenesBase64 = await Promise.all(
        imagenes.map(img => fileToBase64(img))
      );

      const solicitudData = {
        userId: user.uid,
        nombre: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email || 'no-email@example.com',
        profesion,
        descripcion,
        experiencia: experienciaNum,
        estado: 'pendiente',
        fecha: serverTimestamp(),
        tipo: 'solicitud_trabajador',
        cvUrl: cvBase64, // Guardado como Base64
        imagenesUrls: imagenesBase64, // Array de Base64
      };

      await addDoc(collection(db, 'solicitudes'), solicitudData);

      showToast('Solicitud enviada con éxito. El administrador revisará tus datos.');

      // Redirigir después de un breve delay para mostrar el toast de éxito
      setTimeout(() => {
        router.push('/profile');
      }, 2000);

    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      showToast(`Hubo un error al enviar tu solicitud: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('El Currículum debe ser un archivo PDF.', 'error');
      e.target.value = '';
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_CV_SIZE_MB) {
      showToast(`El PDF pesa ${sizeMB.toFixed(1)}MB y supera el límite de ${MAX_CV_SIZE_MB}MB.`, 'error');
      e.target.value = '';
      return;
    }

    setCv(file);
    e.target.value = ''; // permite volver a seleccionar el mismo archivo si se elimina y se vuelve a subir
  };

  const handleRemoveCv = () => {
    setCv(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length + imagenes.length > MAX_IMAGES) {
      showToast(`Máximo ${MAX_IMAGES} imágenes permitidas.`, 'error');
      e.target.value = '';
      return;
    }

    const validFiles = [];
    const oversized = [];

    files.forEach((file) => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_IMAGE_SIZE_MB) {
        oversized.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (oversized.length > 0) {
      const label = oversized.length === 1 ? 'imagen supera' : 'imágenes superan';
      showToast(`${oversized.length} ${label} el límite de ${MAX_IMAGE_SIZE_MB}MB: ${oversized.join(', ')}`, 'error');
    }

    if (validFiles.length > 0) {
      setImagenes(prev => [...prev, ...validFiles]);
    }

    e.target.value = '';
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] text-white font-sans selection:bg-[#6c63ff]/30">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        
        {/* Cabecera */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">Únete como <span className="text-[#6c63ff]">Trabajador</span></h1>
          <p className="text-slate-500 text-lg font-bold">Completa tu perfil profesional para que el administrador valide tu cuenta.</p>
        </div>

        {/* Formulario Premium */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-[#111118] p-10 rounded-[3rem] border border-white/[0.05] shadow-2xl">
          
          <div className="space-y-6">
            {/* Profesión */}
            <div className="space-y-3">
              <label htmlFor="profesion" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Profesión o Especialidad</label>
              <input 
                id="profesion"
                type="text" 
                required 
                placeholder="Ej: Técnico de laptops / Desarrollador" 
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#6c63ff] outline-none transition-all placeholder:text-slate-700"
                value={profesion}
                onChange={(e) => setProfesion(e.target.value)}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-3">
              <label htmlFor="descripcion" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Descripción profesional</label>
              <textarea 
                id="descripcion"
                rows={4} 
                required
                placeholder="Cuéntanos sobre tu experiencia y habilidades..." 
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#6c63ff] outline-none transition-all placeholder:text-slate-700 resize-none"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {/* Experiencia */}
            <div className="space-y-3">
              <label htmlFor="experiencia" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Años de experiencia</label>
              <input 
                id="experiencia"
                type="number" 
                required 
                min="0"
                placeholder="3" 
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#6c63ff] outline-none transition-all placeholder:text-slate-700"
                value={experiencia}
                onChange={(e) => setExperiencia(e.target.value)}
              />
            </div>

            {/* Subida de CV */}
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-2 mr-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Currículum Vitae (PDF)</label>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Máx. {MAX_CV_SIZE_MB}MB</span>
              </div>

              {cv ? (
                <div className="flex items-center justify-between w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[#6c63ff] shrink-0"><Icons.FileText /></span>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-widest text-white truncate">{cv.name}</p>
                      <p className="text-[10px] font-bold text-slate-600 mt-0.5">{(cv.size / (1024 * 1024)).toFixed(1)}MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCv}
                    className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2.5 rounded-xl transition-colors shrink-0 ml-4"
                    aria-label="Eliminar CV"
                  >
                    <Icons.X />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".pdf,application/pdf" 
                    onChange={handleCvChange}
                    className="hidden" 
                    id="cv-upload"
                  />
                  <label htmlFor="cv-upload" className="flex items-center justify-center w-full bg-[#0A0A0F] border-2 border-dashed border-white/10 rounded-2xl px-6 py-8 cursor-pointer hover:border-[#6c63ff]/50 transition-all group">
                    <div className="text-center flex flex-col items-center gap-2">
                      <span className="text-slate-600 group-hover:text-[#6c63ff] group-hover:scale-110 transition-all"><Icons.FileText /></span>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-[#6c63ff] transition-colors">
                        Seleccionar PDF
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Fotos de Trabajos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-2 mr-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fotos de tus trabajos</label>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Máx. {MAX_IMAGE_SIZE_MB}MB c/u · hasta {MAX_IMAGES}</span>
              </div>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden" 
                id="img-upload"
              />
              <label htmlFor="img-upload" className={`flex items-center justify-center w-full bg-[#0A0A0F] border-2 border-dashed rounded-2xl px-6 py-8 transition-all group ${imagenes.length >= MAX_IMAGES ? "border-white/5 opacity-40 cursor-not-allowed" : "border-white/10 cursor-pointer hover:border-[#6c63ff]/50"}`}>
                <div className="text-center flex flex-col items-center gap-2">
                  <span className="text-slate-600 group-hover:text-[#6c63ff] group-hover:scale-110 transition-all"><Icons.Image /></span>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-[#6c63ff] transition-colors">
                    {imagenes.length >= MAX_IMAGES ? "Límite alcanzado" : "Subir Imágenes"}
                  </p>
                </div>
              </label>
              
              {imagenes.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {imagenes.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                      <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setImagenes(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      ><Icons.X /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || authLoading}
            className="w-full bg-gradient-to-r from-[#6c63ff] to-[#4b45b2] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#6c63ff]/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? "Procesando archivos..." : "Enviar Solicitud de Verificación"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function TrabajadorPage() {
  return (
    <ProtectedRoute>
      <TrabajadorPageContent />
    </ProtectedRoute>
  );
}