'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { db } from '@/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { fileToBase64 } from '@/firebase/uploadWorkerFiles'; // Nueva función de conversión


function TrabajadorPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cv, setCv] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [profesion, setProfesion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Limpiar mensajes de error/éxito al cambiar de campo
  useEffect(() => {
    setError('');
    setSuccessMessage('');
  }, [profesion, descripcion, experiencia, cv, imagenes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit ejecutado al inicio.');
    setError(''); // Limpiar errores previos
    setSuccessMessage('');

    if (authLoading) {
      setError('Cargando información de usuario. Por favor, inténtalo de nuevo.');
      return;
    }

    if (!user) {
      setError('Debes iniciar sesión para enviar una solicitud.');
      return;
    }

    // Validación de campos requeridos
    if (!profesion.trim()) {
      setError('La profesión es un campo requerido.');
      return;
    }
    if (!descripcion.trim()) {
      setError('La descripción profesional es un campo requerido.');
      return;
    }
    const experienciaNum = parseInt(experiencia);
    if (isNaN(experienciaNum) || experienciaNum < 0) {
      setError('Los años de experiencia deben ser un número válido y positivo.');
      return;
    }
    if (!cv) {
      setError('Debes subir tu Currículum Vitae (PDF).');
      return;
    }

    setLoading(true);
    try {
      console.log('Procesando archivos a Base64...');
      
      // 1. Convertir CV a Base64
      const cvBase64 = await fileToBase64(cv);
      
      // 2. Convertir Imágenes a Base64
      const imagenesBase64 = await Promise.all(
        imagenes.map(img => fileToBase64(img))
      );

      console.log('Archivos procesados. Guardando en Firestore...');

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
      console.log('Solicitud guardada con éxito.');
      
      setSuccessMessage("Solicitud enviada con éxito. El administrador revisará tus datos.");
      
      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push('/profile');
      }, 2000);

    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      setError(`Hubo un error al enviar tu solicitud: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagenes.length > 4) {
      setError('Máximo 4 imágenes permitidas');
      return;
    }
    setImagenes(prev => [...prev, ...files]);
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] text-white font-sans selection:bg-[#6c63ff]/30">
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        
        {/* Cabecera */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">Únete como <span className="text-[#6c63ff]">Trabajador</span></h1>
          <p className="text-slate-500 text-lg font-bold">Completa tu perfil profesional para que el administrador valide tu cuenta.</p>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6 text-center animate-pulse">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-xl mb-6 text-center">
            {successMessage}
          </div>
        )}

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
                placeholder="3" 
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#6c63ff] outline-none transition-all placeholder:text-slate-700"
                value={experiencia}
                onChange={(e) => setExperiencia(e.target.value)}
              />
            </div>

            {/* Subida de CV */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Currículum Vitae (PDF)</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf" 
                  required
                  onChange={(e) => setCv(e.target.files[0])}
                  className="hidden" 
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" className="flex items-center justify-center w-full bg-[#0A0A0F] border-2 border-dashed border-white/10 rounded-2xl px-6 py-8 cursor-pointer hover:border-[#6c63ff]/50 transition-all group">
                  <div className="text-center">
                    <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📄</span>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-[#6c63ff]">
                      {cv ? cv.name : "Seleccionar PDF"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Fotos de Trabajos */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Fotos de tus trabajos</label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden" 
                id="img-upload"
              />
              <label htmlFor="img-upload" className="flex items-center justify-center w-full bg-[#0A0A0F] border-2 border-dashed border-white/10 rounded-2xl px-6 py-8 cursor-pointer hover:border-[#6c63ff]/50 transition-all group">
                <div className="text-center">
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📸</span>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-[#6c63ff]">Subir Imágenes</p>
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
                        className="absolute top-1 right-1 bg-red-500 text-white text-[8px] p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >✕</button>
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
