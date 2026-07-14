"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { db } from "@/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { fileToBase64 } from "@/firebase/uploadWorkerFiles";
import { useThemeStore } from "@/store/themeStore"; // <-- Importado

const MAX_CV_SIZE_MB = 5;
const MAX_IMAGE_SIZE_MB = 3;
const MAX_IMAGES = 4;

const Icons = {
  FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>,
  Image: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
};

function Toast({ message, type, onClose, theme }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = type === "success"
    ? (theme === "dark" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600")
    : (theme === "dark" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-red-50 border-red-200 text-red-600");

  return (
    <div className={`fixed bottom-8 right-8 ${styles} border p-5 rounded-2xl flex items-center gap-4 z-200 shadow-2xl backdrop-blur-md max-w-md`}>
      <div className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
      <p className="text-sm font-black uppercase tracking-widest">{message}</p>
    </div>
  );
}

function TrabajadorPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);

  const [cv, setCv] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [profesion, setProfesion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  // Variables de estilo dinámicas
  const cardBg = theme === "dark" ? "#111118" : "#ffffff";
  const inputBg = theme === "dark" ? "#0A0A0F" : "#f4f4f5";
  const borderColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "#e4e4e7";
  const mutedText = theme === "dark" ? "#64748b" : "#94a3b8";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return showToast("Debes iniciar sesión.", "error");
    if (!cv) return showToast("Sube tu CV.", "error");
    
    setLoading(true);
    try {
      const cvBase64 = await fileToBase64(cv);
      const imagenesBase64 = await Promise.all(imagenes.map((img) => fileToBase64(img)));

      await addDoc(collection(db, "solicitudes"), {
        userId: user.uid,
        nombre: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        profesion,
        descripcion,
        experiencia: parseInt(experiencia, 10),
        estado: "pendiente",
        fecha: serverTimestamp(),
        tipo: "solicitud_trabajador",
        cvUrl: cvBase64,
        imagenesUrls: imagenesBase64,
      });

      showToast("Solicitud enviada con éxito.");
      setTimeout(() => router.push("/profile"), 2000);
    } catch (error) {
      showToast("Error al enviar solicitud.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen transition-colors duration-300" style={{ background: background[theme], color: textColor[theme] }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} theme={theme} />}

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            Únete como <span className="text-[#6c63ff]">Trabajador</span>
          </h1>
          <p className="text-lg font-bold" style={{ color: mutedText }}>
            Completa tu perfil profesional.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 rounded-[3rem] border transition-colors shadow-xl" style={{ backgroundColor: cardBg, borderColor }}>
          <div className="space-y-6">
            {["profesion", "descripcion", "experiencia"].map((field) => (
              <div key={field} className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2" style={{ color: mutedText }}>
                  {field === "profesion" ? "Profesión" : field === "descripcion" ? "Descripción profesional" : "Años de experiencia"}
                </label>
                {field === "descripcion" ? (
                  <textarea rows={4} className="w-full rounded-2xl px-6 py-4 text-sm outline-none border" style={{ backgroundColor: inputBg, borderColor, color: textColor[theme] }} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                ) : (
                  <input type={field === "experiencia" ? "number" : "text"} className="w-full rounded-2xl px-6 py-4 text-sm outline-none border" style={{ backgroundColor: inputBg, borderColor, color: textColor[theme] }} value={field === "profesion" ? profesion : experiencia} onChange={(e) => field === "profesion" ? setProfesion(e.target.value) : setExperiencia(e.target.value)} required />
                )}
              </div>
            ))}

            {/* Componente de subida adaptado */}
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2" style={{ color: mutedText }}>Currículum Vitae (PDF)</label>
                <input type="file" accept=".pdf" onChange={(e) => setCv(e.target.files[0])} className="hidden" id="cv-upload" />
                <label htmlFor="cv-upload" className="flex items-center justify-center w-full rounded-2xl px-6 py-8 cursor-pointer border-2 border-dashed" style={{ borderColor }}>
                    <span className="text-sm font-bold">{cv ? cv.name : "Seleccionar PDF"}</span>
                </label>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-8 bg-[#6c63ff] text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:scale-[1.02] transition-all">
            {loading ? "Procesando..." : "Enviar Solicitud"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function TrabajadorPage() {
  return <ProtectedRoute><TrabajadorPageContent /></ProtectedRoute>;
}