"use client";
import { useState } from "react";

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
  galleryImg: {
    width: "100%",
    height: "240px",
    objectFit: "cover",
    display: "block",
  },
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

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    gap: "12px",
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
    gap: "0",
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
  chip: {
    backgroundColor: "#1a1a2e",
    color: "#9a9ab0",
    borderRadius: "6px",
    fontSize: "12px",
    padding: "4px 10px",
  },

  divider: {
    height: "1px",
    backgroundColor: "#1a1a2e",
    marginBottom: "20px",
  },

  actionRow: {
    display: "flex",
    gap: "10px",
  },
  btnPostular: {
    flex: 1,
    backgroundColor: "#500fe9",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "var(--font-dm-sans), sans-serif",
    transition: "background-color 0.2s",
  },
  btnPostulado: {
    flex: 1,
    backgroundColor: "#1a2d1a",
    color: "#4ade80",
    border: "1px solid #166534",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
  btnLoading: {
    flex: 1,
    backgroundColor: "#2a2a3e",
    color: "#666",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "15px",
    cursor: "not-allowed",
    fontWeight: 700,
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
  btnCancelarSolicitud: {
    flex: 1,
    backgroundColor: "transparent",
    color: "#f87171",
    border: "1px solid #5a1a1a",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
  btnPropietario: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    color: "#555",
    border: "1px solid #2a2a3e",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "14px",
    cursor: "default",
    fontWeight: 500,
    fontFamily: "var(--font-dm-sans), sans-serif",
    textAlign: "center",
  },
  nota: {
    color: "#444",
    fontSize: "12px",
    textAlign: "center",
    marginTop: "10px",
  },
};

export default function SolicitudModal({
  solicitud,
  onClose,
  currentUserId,    // UID del usuario autenticado
  estaPostulado,
  onToggle,
  loading,
  onCancelar,       // callback para eliminar la solicitud (propietario)
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [confirmando, setConfirmando] = useState(false);

  if (!solicitud) return null;

  const imagenes       = solicitud.imageUrls ?? [];
  const tieneImagenes  = imagenes.length > 0;
  const postulado      = estaPostulado(solicitud.postulantes ?? []);
  const totalPostulantes = solicitud.postulantes?.length ?? 0;
  const esPropietario  = currentUserId && currentUserId === solicitud.userId;
  const sinSesion      = !currentUserId;

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
    if (!confirmando) {
      setConfirmando(true);
      return;
    }
    onCancelar(solicitud.id);
    setConfirmando(false);
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
            <img
              src={imagenes[imgIdx]}
              alt={`Imagen ${imgIdx + 1}`}
              style={s.galleryImg}
            />
            {imagenes.length > 1 && (
              <>
                <button style={{ ...s.galleryArrow, left: "10px" }} onClick={prevImg}>‹</button>
                <button style={{ ...s.galleryArrow, right: "10px" }} onClick={nextImg}>›</button>
                <div style={s.galleryNav}>
                  {imagenes.map((_, i) => (
                    <div
                      key={i}
                      style={s.galleryDot(i === imgIdx)}
                      onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div style={s.body}>

          <div style={s.badges}>
            {solicitud.urgente && <span style={s.badgeUrgente}>Urgente</span>}
            {esPropietario     && <span style={s.badgeMio}>Mi solicitud</span>}
          </div>

          <h2 style={s.title}>{solicitud.titulo}</h2>
          <p style={s.meta}>
            Publicado por <strong style={{ color: "#888" }}>{solicitud.nombre}</strong>
            {" · "}{solicitud.distrito}
            {solicitud.modalidad && <>{" · "}{solicitud.modalidad}</>}
          </p>

          <div style={s.infoRow}>
            <div style={s.infoItem}>
              <span style={s.infoVal}>{solicitud.precio}</span>
              <span style={s.infoLbl}>Presupuesto</span>
            </div>
            <div style={s.infoItem}>
              <span style={s.infoVal}>{totalPostulantes}</span>
              <span style={s.infoLbl}>Postulantes</span>
            </div>
            <div style={s.infoItem}>
              <span style={s.infoVal}>{urgenciaLabel}</span>
              <span style={s.infoLbl}>Disponibilidad</span>
            </div>
            <div style={s.infoItemLast}>
              <span style={s.infoVal}>{solicitud.distrito}</span>
              <span style={s.infoLbl}>Ubicación</span>
            </div>
          </div>

          <p style={s.sectionLabel}>Descripción del trabajo</p>
          <p style={s.desc}>{solicitud.descripcion}</p>

          <div style={s.chips}>
            {(solicitud.tags ?? []).map((t) => (
              <span key={t} style={s.chip}>{t}</span>
            ))}
          </div>

          <div style={s.divider} />
          <div style={s.actionRow}>

            {sinSesion && (
              <a
                href="/login"
                style={{ ...s.btnPostular, textAlign: "center", textDecoration: "none", display: "block" }}
              >
                Inicia sesión para postularte
              </a>
            )}
            {esPropietario && (
              <button
                style={s.btnCancelarSolicitud}
                onClick={handleCancelar}
              >
                {confirmando
                  ? "¿Confirmar cancelación? (clic de nuevo)"
                  : "Cancelar esta solicitud"}
              </button>
            )}
            {!esPropietario && !sinSesion && (
              <button
                style={loading ? s.btnLoading : postulado ? s.btnPostulado : s.btnPostular}
                onClick={() => onToggle(solicitud.id, solicitud.postulantes ?? [])}
                disabled={loading}
              >
                {loading
                  ? "Procesando..."
                  : postulado
                  ? "✓ Postulado — Cancelar postulación"
                  : "Postularme ahora"}
              </button>
            )}
          </div>
          {!esPropietario && !sinSesion && (
            <p style={s.nota}>
              {postulado
                ? "Ya estás postulado. El cliente verá tu perfil y te contactará."
                : `${totalPostulantes} persona${totalPostulantes !== 1 ? "s" : ""} ya se postularon a este trabajo.`}
            </p>
          )}
          {confirmando && (
            <p style={{ ...s.nota, color: "#f87171" }}>
              Esta acción es permanente. Haz clic de nuevo para confirmar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}