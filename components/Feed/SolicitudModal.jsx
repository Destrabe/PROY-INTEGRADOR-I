"use client";

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
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
    padding: "32px",
    maxWidth: "560px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  close: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    color: "#555",
    fontSize: "20px",
    cursor: "pointer",
    lineHeight: 1,
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#2d0a0a",
    color: "#f87171",
    border: "1px solid #5a1a1a",
    borderRadius: "20px",
    fontSize: "11px",
    padding: "3px 10px",
    marginBottom: "12px",
  },
  title: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800,
    fontSize: "22px",
    color: "#f0f0ff",
    marginBottom: "8px",
  },
  meta: { color: "#666", fontSize: "13px", marginBottom: "20px" },
  label: {
    fontSize: "11px",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "6px",
  },
  desc: {
    color: "#999",
    fontSize: "14px",
    lineHeight: 1.7,
    marginBottom: "20px",
  },
  chips: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" },
  chip: {
    backgroundColor: "#1a1a2e",
    color: "#9a9ab0",
    borderRadius: "6px",
    fontSize: "12px",
    padding: "4px 10px",
  },
  infoRow: {
    display: "flex",
    gap: "24px",
    marginBottom: "28px",
    padding: "16px",
    backgroundColor: "#0d0d18",
    borderRadius: "12px",
    border: "1px solid #1a1a2e",
  },
  infoItem: { display: "flex", flexDirection: "column", gap: "4px" },
  infoVal: { color: "#f0f0ff", fontWeight: 600, fontSize: "16px" },
  infoLbl: { color: "#555", fontSize: "12px" },
  btnPostular: {
    width: "100%",
    backgroundColor: "#500fe9",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "var(--font-dm-sans), sans-serif",
    transition: "background-color 0.2s",
  },
  btnPostulado: {
    width: "100%",
    backgroundColor: "#1a2d1a",
    color: "#4ade80",
    border: "1px solid #166534",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
};

export default function SolicitudModal({ solicitud, onClose, estaPostulado, onToggle, loading }) {
  if (!solicitud) return null;

  const postulado = estaPostulado(solicitud.postulantes ?? []);
  const totalPostulantes = solicitud.postulantes?.length ?? 0;

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button style={s.close} onClick={onClose}>✕</button>

        {solicitud.urgente && <span style={s.badge}>Urgente</span>}
        <h2 style={s.title}>{solicitud.titulo}</h2>
        <p style={s.meta}>
          {solicitud.nombre} · {solicitud.distrito}
        </p>

        <p style={s.label}>Descripción</p>
        <p style={s.desc}>{solicitud.descripcion}</p>

        <div style={s.chips}>
          {(solicitud.tags ?? []).map((t) => (
            <span key={t} style={s.chip}>{t}</span>
          ))}
        </div>

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
            <span style={s.infoVal}>{solicitud.distrito}</span>
            <span style={s.infoLbl}>Distrito</span>
          </div>
        </div>

        <button
          style={postulado ? s.btnPostulado : s.btnPostular}
          onClick={() => onToggle(solicitud.id, solicitud.postulantes ?? [])}
          disabled={loading}
        >
          {loading
            ? "Procesando..."
            : postulado
            ? "✓ Postulado — Cancelar postulación"
            : "Postularme ahora"}
        </button>
      </div>
    </div>
  );
}