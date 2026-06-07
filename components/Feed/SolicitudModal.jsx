"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useUserRole } from "@/app/hooks/useUserRole";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/db";
import { obtenerOCrearConversacion } from "@/firebase/messages";
import { completarSolicitud } from "@/firebase/Solicitudes";
import ReseñaForm from "@/components/ReviewsForm";
import { yaExisteReseña } from "@/firebase/Reviews";

export default function SolicitudModal({
  solicitud,
  onClose,
  estaPostulado,
  puedePostularse,
  onToggle,
  loading,
  onCancelar,
}) {
  const [userAuth] = useAuthState(auth);
  const { rol, perfil } = useUserRole();
  const [imgIdx, setImgIdx] = useState(0);
  const [confirmando, setConfirmando] = useState(false);
  const [iniciandoChat, setIniciandoChat] = useState(false);
  const [mostrarReseña, setMostrarReseña] = useState(false);
  const [trabajadorData, setTrabajadorData] = useState(null);

  if (!solicitud) return null;

  const imagenes = solicitud.imageUrls?.filter(Boolean) || [];
  const tieneImagenes = imagenes.length > 0;
  const postulado = estaPostulado?.(solicitud.postulantes) ?? false;
  const totalPostulantes = solicitud.postulantes?.length || 0;
  const esPropietario = userAuth?.uid === solicitud.userId;
  const sinSesion = !userAuth?.uid;
  const puedeAccionTrabajador = puedePostularse?.(solicitud.userId) ?? (rol === "trabajador" && !esPropietario);
  const puedeContratar = !sinSesion && rol === "cliente" && !esPropietario;

  const urgenciaLabel = { hoy: "Hoy mismo", semana: "Esta semana", mes: "Este mes", acordar: "A coordinar" }[solicitud.urgencia] || "A coordinar";
  const currentUserNombre = perfil?.first_name ? `${perfil.first_name} ${perfil.last_name}`.trim() : userAuth?.displayName || userAuth?.email || "Usuario";

  const prevImg = (e) => { e.stopPropagation(); setImgIdx((i) => (i === 0 ? imagenes.length - 1 : i - 1)); };
  const nextImg = (e) => { e.stopPropagation(); setImgIdx((i) => (i === imagenes.length - 1 ? 0 : i + 1)); };

  const handleCancelar = (e) => {
    e.stopPropagation();
    if (!confirmando) { setConfirmando(true); return; }
    onCancelar(solicitud.id);
    setConfirmando(false);
  };

  const handleContactar = async (e) => {
    e.stopPropagation();
    if (!userAuth?.uid || !solicitud.userId) return;
    setIniciandoChat(true);
    try {
      const convId = await obtenerOCrearConversacion(
        userAuth.uid,
        solicitud.userId,
        solicitud.id,
        solicitud.titulo,
        { [userAuth.uid]: currentUserNombre, [solicitud.userId]: solicitud.nombre ?? "Usuario" }
      );
      window.location.href = `/messages?conv=${convId}`;
      onClose();
    } catch (err) {
      console.error(err);
      alert("No se pudo iniciar el chat.");
    } finally {
      setIniciandoChat(false);
    }
  };

  const handleContratar = async (e) => {
    e.stopPropagation();
    if (!userAuth?.uid) return;
    setIniciandoChat(true);
    try {
      const convId = await obtenerOCrearConversacion(
        userAuth.uid,
        solicitud.userId,
        solicitud.id,
        solicitud.titulo,
        { [userAuth.uid]: currentUserNombre, [solicitud.userId]: solicitud.nombre ?? "Usuario" }
      );
      window.location.href = `/messages?conv=${convId}`;
      onClose();
    } catch (err) {
      console.error(err);
      alert("No se pudo abrir el chat.");
    } finally {
      setIniciandoChat(false);
    }
  };

  const handleCompletar = async () => {
    const existe = await yaExisteReseña(solicitud.id, userAuth.uid);
    if (existe) {
      alert("Ya has dejado una reseña para este trabajo. No puedes enviar otra.");
      return;
    }
    const result = await completarSolicitud(solicitud.id, userAuth.uid);
    if (result.success) {
      setTrabajadorData({ id: solicitud.trabajadorId, nombre: solicitud.trabajadorNombre || "Trabajador" });
      setMostrarReseña(true);
    } else {
      alert(result.error.message);
    }
  };

  const handleReport = async () => {
    const motivo = prompt("Describe el motivo del reporte:");
    if (motivo?.trim()) {
      await addDoc(collection(db, "reports"), {
        solicitudId: solicitud.id,
        userId: userAuth?.uid,
        motivo: motivo.trim(),
        createdAt: serverTimestamp(),
        resuelto: false,
      });
      alert("Reporte enviado. Gracias por ayudarnos a mejorar.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 border border-[var(--border-color)] text-[var(--text-secondary)] flex items-center justify-center hover:bg-black/80 transition-colors" aria-label="Cerrar">✕</button>
          {tieneImagenes && (
            <div className="relative w-full bg-[var(--bg-hover)] rounded-t-2xl overflow-hidden">
              <img src={imagenes[imgIdx]} alt={`Imagen ${imgIdx+1}`} className="w-full h-60 object-cover" />
              {imagenes.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl hover:bg-black/70">‹</button>
                  <button onClick={nextImg} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl hover:bg-black/70">›</button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {imagenes.map((_, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); setImgIdx(i); }} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? "w-5 bg-[var(--accent)]" : "w-1.5 bg-white/30"}`} aria-label={`Imagen ${i+1}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-7">
            <div className="flex gap-1.5 flex-wrap mb-2.5">
              {solicitud.urgente && <span className="inline-block bg-[var(--error)] text-white text-xs rounded-full px-2.5 py-0.5">Urgente</span>}
              {esPropietario && <span className="inline-block bg-[var(--accent)] text-white text-xs rounded-full px-2.5 py-0.5">Mi solicitud</span>}
            </div>

            <h2 className="font-syne font-extrabold text-2xl text-[var(--text-main)] mb-1.5 leading-tight">{solicitud.titulo}</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-5">Publicado por <strong>{solicitud.nombre}</strong> · {solicitud.distrito} · {solicitud.modalidad}</p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 bg-[var(--bg-hover)] rounded-xl border border-[var(--border-color)] overflow-hidden mb-5">
              <div className="flex flex-col gap-1 p-3.5 border-r border-[var(--border-color)]">
                <span className="font-bold text-base text-[var(--text-main)]">{solicitud.precio}</span>
                <span className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Presupuesto</span>
              </div>
              <div className="flex flex-col gap-1 p-3.5 border-r border-[var(--border-color)]">
                <span className="font-bold text-base text-[var(--text-main)]">{totalPostulantes}</span>
                <span className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Postulantes</span>
              </div>
              <div className="flex flex-col gap-1 p-3.5 border-r border-[var(--border-color)]">
                <span className="font-bold text-base text-[var(--text-main)]">{urgenciaLabel}</span>
                <span className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Disponibilidad</span>
              </div>
              <div className="flex flex-col gap-1 p-3.5">
                <span className="font-bold text-base text-[var(--text-main)]">{solicitud.distrito}</span>
                <span className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Ubicación</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[var(--text-secondary)] mb-5 whitespace-pre-wrap">{solicitud.descripcion}</p>

            {solicitud.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {solicitud.tags.map(tag => <span key={tag} className="bg-[var(--bg-hover)] text-[var(--text-secondary)] text-xs px-2.5 py-1 rounded-md border border-[var(--border-color)]">{tag}</span>)}
              </div>
            )}

            <hr className="border-[var(--border-color)] mb-5" />

            <div className="flex flex-col gap-3">
              {sinSesion && (
                <a href="/login" className="block bg-[var(--accent)] text-white text-center font-bold rounded-xl py-3.5 no-underline">Inicia sesión para postularte</a>
              )}

              {esPropietario && (
                <div className="flex gap-2.5">
                  {solicitud.estado !== "completada" && solicitud.estado !== "cancelada" && (
                    <button onClick={handleCancelar} className="flex-1 bg-transparent text-[var(--error)] border border-[var(--error)] rounded-xl py-3.5 font-bold hover:bg-[var(--error)]/10 transition-colors">
                      {confirmando ? "¿Confirmar cancelación? (clic de nuevo)" : "Cancelar esta solicitud"}
                    </button>
                  )}
                  {solicitud.estado === "en_progreso" && (
                    <button onClick={handleCompletar} className="flex-1 bg-transparent text-[var(--success)] border border-[var(--success)] rounded-xl py-3.5 font-bold hover:bg-[var(--success)]/10 transition-colors">✓ Completar trabajo</button>
                  )}
                </div>
              )}

              {!esPropietario && !sinSesion && puedeAccionTrabajador && (
                <>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => onToggle(solicitud.id, solicitud.postulantes, solicitud.userId)}
                      disabled={loading}
                      className={`flex-1 rounded-xl py-3.5 font-bold transition-all ${loading ? "bg-[var(--bg-hover)] text-[var(--text-muted)] cursor-not-allowed" : postulado ? "bg-transparent text-[var(--success)] border border-[var(--success)]" : "bg-[var(--accent)] text-white"}`}
                    >
                      {loading ? "Procesando..." : (postulado ? "Cancelar" : "Postularme ahora")}
                    </button>
                    {postulado && (
                      <button onClick={handleContactar} disabled={iniciandoChat} className="flex-1 bg-transparent text-[var(--accent-secondary)] border border-[var(--accent-secondary)] rounded-xl py-3.5 font-bold hover:bg-[var(--accent-secondary)]/10 transition-colors disabled:opacity-50">
                        {iniciandoChat ? "Abriendo..." : "Contactar"}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-center text-[var(--text-muted)] mt-1">
                    {postulado ? "Ya estás postulado. Puedes contactar al cliente directamente." : `${totalPostulantes} persona${totalPostulantes !== 1 ? "s" : ""} ya se postularon a este trabajo.`}
                  </p>
                </>
              )}

              {!esPropietario && !sinSesion && puedeContratar && (
                <div className="flex gap-2.5">
                  <button onClick={handleContratar} disabled={iniciandoChat} className="flex-1 bg-transparent text-[var(--success)] border border-[var(--success)] rounded-xl py-3.5 font-bold hover:bg-[var(--success)]/10 transition-colors disabled:opacity-50">
                    {iniciandoChat ? "Abriendo..." : "📞 Contratar trabajador"}
                  </button>
                  <button onClick={handleContactar} disabled={iniciandoChat} className="flex-1 bg-transparent text-[var(--accent-secondary)] border border-[var(--accent-secondary)] rounded-xl py-3.5 font-bold hover:bg-[var(--accent-secondary)]/10 transition-colors disabled:opacity-50">
                    {iniciandoChat ? "Abriendo..." : "Contactar"}
                  </button>
                </div>
              )}
            </div>

            <button onClick={handleReport} className="mt-4 text-sm flex items-center gap-2 mx-auto text-[var(--text-muted)] hover:text-[var(--error)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
              Reportar
            </button>

            {confirmando && <p className="text-xs text-center text-[var(--error)] mt-2">Esta acción es permanente. Haz clic de nuevo para confirmar.</p>}
          </div>
        </div>
      </div>

      {mostrarReseña && (
        <ReseñaForm
          solicitudId={solicitud.id}
          trabajadorId={trabajadorData.id}
          trabajadorNombre={trabajadorData.nombre}
          clientId={userAuth?.uid}
          clienteNombre={currentUserNombre}
          onClose={() => setMostrarReseña(false)}
          onSuccess={() => setMostrarReseña(false)}
        />
      )}
    </>
  );
}