"use client";
import { useState } from "react";
import { crearReseña } from "@/firebase/Reviews";

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    backgroundColor: "#13131f",
    border: "1px solid #2a2a3e",
    borderRadius: "20px",
    maxWidth: "480px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "28px 28px 20px",
    borderBottom: "1px solid #1a1a2e",
    position: "relative",
  },
  closeBtn: {
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
    transition: "border-color 0.2s, color 0.2s",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#1e1a3a",
    color: "#a78bfa",
    border: "1px solid #4a3aaa",
    borderRadius: "20px",
    fontSize: "11px",
    padding: "3px 10px",
    marginBottom: "10px",
    fontFamily: "var(--font-dm-sans), sans-serif",
    fontWeight: 600,
    letterSpacing: "0.03em",
  },
  title: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800,
    fontSize: "20px",
    color: "#f0f0ff",
    margin: 0,
    lineHeight: 1.3,
  },
  subtitle: {
    color: "#555",
    fontSize: "13px",
    marginTop: "4px",
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
  body: {
    padding: "24px 28px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
    metricsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // 2 columnas
    gridTemplateRows: "auto auto", 
    gap: "1px",                     
    backgroundColor: "#0d0d18",
    borderRadius: "12px",
    border: "1px solid #1a1a2e",
    overflow: "hidden",
    },
  metricItem: (last) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "18px 10px",
    borderRight: last ? "none" : "1px solid #1a1a2e",
  }),
  metricLabel: {
    fontSize: "11px",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
  starsRow: {
    display: "flex",
    gap: "4px",
  },
  star: (active) => ({
    fontSize: "22px",
    cursor: "pointer",
    color: active ? "#f59e0b" : "#2a2a3e",
    transition: "color 0.15s, transform 0.1s",
    userSelect: "none",
    lineHeight: 1,
  }),
  metricValue: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 700,
    fontSize: "16px",
    color: "#f0f0ff",
  },
  sectionLabel: {
    fontSize: "11px",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
    fontWeight: 600,
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
  textarea: {
    width: "100%",
    backgroundColor: "#0d0d18",
    border: "1px solid #2a2a3e",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#f0f0ff",
    fontSize: "14px",
    fontFamily: "var(--font-dm-sans), sans-serif",
    lineHeight: 1.6,
    resize: "vertical",
    minHeight: "90px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: "transparent",
    color: "#9090a8",
    border: "1px solid #2a2a3e",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "var(--font-dm-sans), sans-serif",
    transition: "border-color 0.2s",
  },
  btnEnviar: (disabled) => ({
    flex: 2,
    backgroundColor: disabled ? "#2a2a3e" : "#500fe9",
    color: disabled ? "#555" : "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "14px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700,
    fontFamily: "var(--font-dm-sans), sans-serif",
    transition: "background-color 0.2s",
  }),
  promedioRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#0d0d18",
    border: "1px solid #1a1a2e",
    borderRadius: "12px",
    padding: "12px 16px",
  },
  promedioLabel: {
    fontSize: "12px",
    color: "#555",
    fontFamily: "var(--font-dm-sans), sans-serif",
    flex: 1,
  },
  promedioVal: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800,
    fontSize: "18px",
    color: "#f59e0b",
  },
};

function StarRating({ value, onChange, label }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={s.metricItem(false)}>
      <span style={s.metricLabel}>{label}</span>
      <div style={s.starsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={s.star((hover || value) >= i)}
            onClick={() => onChange(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>
      <span style={s.metricValue}>{value}/5</span>
    </div>
  );
}

export default function ReseñaForm({
  solicitudId,
  trabajadorId,
  trabajadorNombre,
  clienteId,
  clienteNombre,
  onClose,
  onSuccess,
}) {
  const [calidad, setCalidad] = useState(5);
  const [puntualidad, setPuntualidad] = useState(5);
  const [precio, setPrecio] = useState(5);
  const [comunicacion, setComunicacion] = useState(5); 
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  const promedio = ((calidad + puntualidad + precio + comunicacion) / 4).toFixed(1);

  const handleSubmit = async () => {
    setEnviando(true);
    const result = await crearReseña({
      trabajadorId,
      clienteId,
      clienteNombre,
      solicitudId,
      calidad,
      puntualidad,
      precio,
      comunicacion,  
      comentario,
    });
    setEnviando(false);
    if (result.success) {
      onSuccess?.();
      onClose();
    } else {
      alert("Error al guardar la reseña: " + (result.error?.message || "Intenta de nuevo"));
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>

        <div style={s.header}>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
          <span style={s.badge}>Trabajo completado</span>
          <h2 style={s.title}>Califica a {trabajadorNombre}</h2>
          <p style={s.subtitle}>Tu opinión ayuda a otros clientes a elegir mejor</p>
        </div>

        <div style={s.body}>
          <div>
            <p style={s.sectionLabel}>Valoración</p>
            <div style={s.metricsGrid}>
              <StarRating value={calidad} onChange={setCalidad} label="Calidad" />
              <StarRating value={puntualidad} onChange={setPuntualidad} label="Puntualidad" />
              <StarRating value={precio} onChange={setPrecio} label="Precio" />
              <StarRating value={comunicacion} onChange={setComunicacion} label="Comunicación" />
            </div>
          </div>

          <div style={s.promedioRow}>
            <span style={s.promedioLabel}>Puntuación promedio</span>
            <span style={{ fontSize: "20px", color: "#f59e0b" }}>★</span>
            <span style={s.promedioVal}>{promedio}</span>
            <span style={{ color: "#555", fontSize: "13px" }}>/5</span>
          </div>

          <div>
            <p style={s.sectionLabel}>Comentario <span style={{ color: "#444", textTransform: "none", letterSpacing: 0 }}>(opcional)</span></p>
            <textarea
              style={s.textarea}
              placeholder="¿Cómo fue tu experiencia trabajando con este profesional?"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
            />
          </div>

          <div style={s.actionRow}>
            <button style={s.btnCancelar} onClick={onClose}>Cancelar</button>
            <button style={s.btnEnviar(enviando)} onClick={handleSubmit} disabled={enviando}>
              {enviando ? "Enviando..." : "Publicar reseña"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}