"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerOCrearConversacion } from "@/firebase/Mensajes";
import { completarSolicitud } from "@/firebase/Solicitudes";
import ReseñaForm from "@/components/ReviewsForm";
import { yaExisteReseña } from "@/firebase/Reviews";
const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    backgroundColor: "#13131f",
    border: "1px solid #2a2a3e",
    borderRadius: "20px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  gallery: {
    position: "relative",
    width: "100%",
    backgroundColor: "#0d0d18",
    borderRadius: "20px 20px 0 0",
    overflow: "hidden",
  },
  galleryImg: { width: "100%", height: "240px", objectFit: "cover", display: "block" },
  galleryNav: {
    position: "absolute",
    bottom: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "6px",
  },
  galleryDot: (active) => ({
    width: active ? "20px" : "6px",
    height: "6px",
    borderRadius: "3px",
    backgroundColor: active ? "#fff" : "rgba(255,255,255,0.3)",
    transition: "all 0.2s",
    cursor: "pointer",
  }),
  galleryArrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.5)",
    border: "none",
    color: "#fff",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: "28px 28px 24px" },
  close: {
    position: "absolute",
    top: "14px",
    right: "14px",
    background: "rgba(13,13,24,0.8)",
    border: "1px solid #2a2a3e",
    color: "#aaa",
    fontSize: "16px",
    cursor: "pointer",
    lineHeight: 1,
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  badges: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" },
  badgeUrgente: {
    display: "inline-block",
    backgroundColor: "#2d0a0a",
    color: "#f87171",
    border: "1px solid #5a1a1a",
    borderRadius: "20px",
    fontSize: "11px",
    padding: "3px 10px",
  },
  badgeMio: {
    display: "inline-block",
    backgroundColor: "#1e1a3a",
    color: "#a78bfa",
    border: "1px solid #4a3aaa",
    borderRadius: "20px",
    fontSize: "11px",
    padding: "3px 10px",
  },
  title: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800,
    fontSize: "22px",
    color: "#f0f0ff",
    marginBottom: "6px",
    lineHeight: 1.3,
  },
  meta: { color: "#555", fontSize: "13px", marginBottom: "20px" },
  infoRow: {
    display: "flex",
    marginBottom: "20px",
    backgroundColor: "#0d0d18",
    borderRadius: "12px",
    border: "1px solid #1a1a2e",
    overflow: "hidden",
  },
  infoItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "14px 16px",
    borderRight: "1px solid #1a1a2e",
  },
  infoItemLast: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "14px 16px",
  },
  infoVal: { color: "#f0f0ff", fontWeight: 700, fontSize: "15px" },
  infoLbl: { color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" },
  sectionLabel: {
    fontSize: "11px",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
    fontWeight: 600,
  },
  desc: {
    color: "#aaa",
    fontSize: "14px",
    lineHeight: 1.75,
    marginBottom: "20px",
    whiteSpace: "pre-wrap",
  },
  chips: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" },
  chip: { backgroundColor: "#1a1a2e", color: "#9a9ab0", borderRadius: "6px", fontSize: "12px", padding: "4px 10px" },
  divider: { height: "1px", backgroundColor: "#1a1a2e", marginBottom: "20px" },
  actionRow: { display: "flex", gap: "10px", flexDirection: "column" },
  actionRowButtons: { display: "flex", gap: "10px" },
  btnPostular: {
    flex: 1, backgroundColor: "#500fe9", color: "#fff", border: "none",
    borderRadius: "12px", padding: "14px", fontSize: "15px", cursor: "pointer",
    fontWeight: 700, fontFamily: "var(--font-dm-sans), sans-serif",
  },
  btnPostulado: {
    flex: 1, backgroundColor: "#1a2d1a", color: "#4ade80", border: "1px solid #166534",
    borderRadius: "12px", padding: "14px", fontSize: "15px", cursor: "pointer",
    fontWeight: 700, fontFamily: "var(--font-dm-sans), sans-serif",
  },
  btnLoading: {
    flex: 1, backgroundColor: "#2a2a3e", color: "#666", border: "none",
    borderRadius: "12px", padding: "14px", fontSize: "15px", cursor: "not-allowed",
    fontWeight: 700, fontFamily: "var(--font-dm-sans), sans-serif",
  },
  btnContactar: {
    flex: 1, backgroundColor: "#0f2d1a", color: "#4ade80", border: "1px solid #166534",
    borderRadius: "12px", padding: "14px", fontSize: "15px", cursor: "pointer",
    fontWeight: 700, fontFamily: "var(--font-dm-sans), sans-serif", textAlign: "center",
  },
  btnContratar: {
    flex: 1, backgroundColor: "#0f2a1a", color: "#22c55e", border: "1px solid #16a34a",
    borderRadius: "12px", padding: "14px", fontSize: "15px", cursor: "pointer",
    fontWeight: 700, fontFamily: "var(--font-dm-sans), sans-serif", textAlign: "center",
  },
  btnContactarLoading: {
    flex: 1, backgroundColor: "#2a2a3e", color: "#666", border: "none",
    borderRadius: "12px", padding: "14px", fontSize: "15px", cursor: "not-allowed",
    fontWeight: 700, fontFamily: "var(--font-dm-sans), sans-serif",
  },
  btnCancelarSolicitud: {
    flex: 1, backgroundColor: "transparent", color: "#f87171", border: "1px solid #5a1a1a",
    borderRadius: "12px", padding: "14px", fontSize: "15px", cursor: "pointer",
    fontWeight: 700, fontFamily: "var(--font-dm-sans), sans-serif",
  },
  nota: { color: "#444", fontSize: "12px", textAlign: "center", marginTop: "10px" },
};

export default function SolicitudModal({
  solicitud,
  onClose,
  currentUserId,
  currentUserNombre,
  rolUsuario,
  estaPostulado,
  puedePostularse,
  onToggle,
  loading,
  onCancelar,
}) {
  const router = useRouter();
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
  const esPropietario = currentUserId === solicitud.userId;
  const sinSesion = !currentUserId;

  const puedeAccionTrabajador = puedePostularse
    ? puedePostularse(solicitud.userId)
    : rolUsuario === "trabajador" && !esPropietario;
  const puedeContratar = !sinSesion && rolUsuario === "cliente" && !esPropietario;

  const prevImg = (e) => {
    e.stopPropagation();
    setImgIdx((i) => (i === 0 ? imagenes.length - 1 : i - 1));
  };
  const nextImg = (e) => {
    e.stopPropagation();
    setImgIdx((i) => (i === imagenes.length - 1 ? 0 : i + 1));
  };

  const handleCancelar = (e) => {
    e.stopPropagation();
    if (!confirmando) { setConfirmando(true); return; }
    onCancelar(solicitud.id);
    setConfirmando(false);
  };

  const handleContactar = async (e) => {
    e.stopPropagation();
    if (!currentUserId || !solicitud.userId) return;
    setIniciandoChat(true);
    try {
      const convId = await obtenerOCrearConversacion(
        currentUserId,
        solicitud.userId,
        solicitud.id,
        solicitud.titulo,
        {
          [currentUserId]: currentUserNombre ?? "Usuario",
          [solicitud.userId]: solicitud.nombre ?? "Usuario",
        }
      );
      router.push(`/mensajes?conv=${convId}`);
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
    if (!currentUserId) { router.push("/login"); return; }
    setIniciandoChat(true);
    try {
      const convId = await obtenerOCrearConversacion(
        currentUserId,
        solicitud.userId,
        solicitud.id,
        solicitud.titulo,
        {
          [currentUserId]: currentUserNombre ?? "Usuario",
          [solicitud.userId]: solicitud.nombre ?? "Usuario",
        }
      );
      router.push(`/mensajes?conv=${convId}`);
      onClose();
    } catch (err) {
      console.error(err);
      alert("No se pudo abrir el chat.");
    } finally {
      setIniciandoChat(false);
    }
  };

const handleCompletar = async () => {
  const existe = await yaExisteReseña(solicitud.id, currentUserId);
    if (existe) {
      alert("Ya has dejado una reseña para este trabajo. No puedes enviar otra.");
      return;
    }
  const result = await completarSolicitud(solicitud.id, currentUserId);
  if (result.success) {
    setTrabajadorData({
      id: solicitud.trabajadorId,
      nombre: solicitud.trabajadorNombre || "Trabajador",
    });
    setMostrarReseña(true);
  } else {
    alert(result.error.message);
  }
};

  const urgenciaLabel = {
    hoy: "Hoy mismo",
    semana: "Esta semana",
    mes: "Este mes",
    acordar: "A coordinar",
  }[solicitud.urgencia] ?? "A coordinar";

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button style={s.close} onClick={onClose}>✕</button>

        {tieneImagenes && (
          <div style={s.gallery}>
            <img src={imagenes[imgIdx]} alt={`Imagen ${imgIdx+1}`} style={s.galleryImg} />
            {imagenes.length > 1 && (
              <>
                <button style={{...s.galleryArrow, left: "10px"}} onClick={prevImg}>‹</button>
                <button style={{...s.galleryArrow, right: "10px"}} onClick={nextImg}>›</button>
                <div style={s.galleryNav}>
                  {imagenes.map((_, i) => (
                    <div key={i} style={s.galleryDot(i === imgIdx)} onClick={(e) => { e.stopPropagation(); setImgIdx(i); }} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div style={s.body}>
          <div style={s.badges}>
            {solicitud.urgente && <span style={s.badgeUrgente}>Urgente</span>}
            {esPropietario && <span style={s.badgeMio}>Mi solicitud</span>}
          </div>

          <h2 style={s.title}>{solicitud.titulo}</h2>
          <p style={s.meta}>
            Publicado por <strong>{solicitud.nombre}</strong>
            {" · "}{solicitud.distrito}
            {solicitud.modalidad && <>{" · "}{solicitud.modalidad}</>}
          </p>

          <div style={s.infoRow}>
            <div style={s.infoItem}><span style={s.infoVal}>{solicitud.precio}</span><span style={s.infoLbl}>Presupuesto</span></div>
            <div style={s.infoItem}><span style={s.infoVal}>{totalPostulantes}</span><span style={s.infoLbl}>Postulantes</span></div>
            <div style={s.infoItem}><span style={s.infoVal}>{urgenciaLabel}</span><span style={s.infoLbl}>Disponibilidad</span></div>
            <div style={s.infoItemLast}><span style={s.infoVal}>{solicitud.distrito}</span><span style={s.infoLbl}>Ubicación</span></div>
          </div>

          <p style={s.sectionLabel}>Descripción</p>
          <p style={s.desc}>{solicitud.descripcion}</p>

          {solicitud.tags?.length > 0 && (
            <div style={s.chips}>{solicitud.tags.map(t => <span key={t} style={s.chip}>{t}</span>)}</div>
          )}

          <div style={s.divider} />

          <div style={s.actionRow}>
            {sinSesion && <a href="/login" style={{...s.btnPostular, textAlign:"center", textDecoration:"none"}}>Inicia sesión para postularte</a>}

            {esPropietario && (
              <div style={s.actionRowButtons}>
                {solicitud.estado !== "completada" && solicitud.estado !== "cancelada" && (
                  <button style={s.btnCancelarSolicitud} onClick={handleCancelar}>
                    {confirmando
                      ? "¿Confirmar cancelación? (clic de nuevo)"
                      : "Cancelar esta solicitud"}
                  </button>
                )}
                {solicitud.estado === "en_progreso" && (
                  <button style={s.btnContratar} onClick={handleCompletar}>
                    ✓ Completar trabajo
                  </button>
                )}
              </div>
            )}

            {!esPropietario && !sinSesion && puedeAccionTrabajador && (
              <>
                <div style={s.actionRowButtons}>
                  <button
                    style={loading ? s.btnLoading : postulado ? s.btnPostulado : s.btnPostular}
                    onClick={() => onToggle(solicitud.id, solicitud.postulantes, solicitud.userId)}
                    disabled={loading}
                  >
                    {loading ? "Procesando..." : (postulado ? "Postulado — Cancelar" : "Postularme ahora")}
                  </button>
                  {postulado && (
                    <button style={iniciandoChat ? s.btnContactarLoading : s.btnContactar} onClick={handleContactar} disabled={iniciandoChat}>
                      {iniciandoChat ? "Abriendo chat..." : "Contactar"}
                    </button>
                  )}
                </div>
                <p style={s.nota}>
                  {postulado
                    ? "Ya estás postulado. Puedes contactar al cliente directamente."
                    : `${totalPostulantes} persona${totalPostulantes !== 1 ? "s" : ""} ya se postularon a este trabajo.`}
                </p>
              </>
            )}

            {!esPropietario && !sinSesion && puedeContratar && (
              <div style={s.actionRowButtons}>
                <button style={iniciandoChat ? s.btnContactarLoading : s.btnContratar} onClick={handleContratar} disabled={iniciandoChat}>
                  {iniciandoChat ? "Abriendo chat..." : "⊕ Contratar trabajador"}
                </button>
                <button style={iniciandoChat ? s.btnContactarLoading : s.btnContactar} onClick={handleContactar} disabled={iniciandoChat}>
                  {iniciandoChat ? "Abriendo chat..." : "Contactar"}
                </button>
              </div>
            )}
          </div>

          {confirmando && <p style={{...s.nota, color:"#f87171"}}>Esta acción es permanente. Haz clic de nuevo para confirmar.</p>}
        </div>
      </div>

    {
      mostrarReseña && (
        <ReseñaForm
          solicitudId={solicitud.id}
          trabajadorId={trabajadorData.id}
          trabajadorNombre={trabajadorData.nombre}
          clienteId={currentUserId}
          clienteNombre={currentUserNombre}
          onClose={() => setMostrarReseña(false)}
          onSuccess={() => {
            setMostrarReseña(false);
          }}
        />
      )
    }
    </div>
  );
}