"use client";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

function colorAvatar(iniciales = "") {
  const colores = ["#2d1a5e", "#0f2d1a", "#2d1a0a", "#0a1a2d", "#2d0a1a", "#1a0a2d", "#0a2d2d"];
  let hash = 0;
  for (const c of iniciales) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colores[Math.abs(hash) % colores.length];
}

const s = {
  card: {
    backgroundColor: "#13131f",
    border: "1px solid #1e1e30",
    borderRadius: "14px",
    padding: "20px 22px",
    marginBottom: "14px",
    transition: "border-color 0.2s",
    cursor: "pointer",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  meta: { display: "flex", alignItems: "center", gap: "10px" },
  metaName: { color: "#aaa", fontSize: "13px" },
  metaTime: { color: "#555" },
  cardRight: { textAlign: "right" },
  badgeUrgente: {
    display: "inline-block",
    backgroundColor: "#2d0a0a",
    color: "#f87171",
    border: "1px solid #5a1a1a",
    borderRadius: "20px",
    fontSize: "11px",
    padding: "3px 10px",
    marginBottom: "4px",
  },
  price: { display: "block", color: "#a78bfa", fontSize: "14px", fontWeight: 600 },
  title: {
    color: "#f0f0ff",
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "8px",
    fontFamily: "var(--font-syne), sans-serif",
  },
  desc: { color: "#777", fontSize: "13px", lineHeight: 1.6, marginBottom: "14px" },
  chips: { display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" },
  chip: {
    backgroundColor: "#1a1a2e",
    color: "#9a9ab0",
    borderRadius: "6px",
    fontSize: "12px",
    padding: "4px 10px",
  },
  bottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  stats: { display: "flex", gap: "20px", color: "#555", fontSize: "13px" },
  btnPostular: {
    backgroundColor: "#500fe9",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 18px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: 500,
    fontFamily: "var(--font-dm-sans), sans-serif",
    transition: "background-color 0.2s",
  },
  btnPostulado: {
    backgroundColor: "#1a2d1a",
    color: "#4ade80",
    border: "1px solid #166534",
    borderRadius: "8px",
    padding: "8px 18px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: 500,
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
  btnLoading: {
    opacity: 0.6,
    pointerEvents: "none",
    backgroundColor: "#2a2a3e",
    color: "#888",
    border: "none",
    borderRadius: "8px",
    padding: "8px 18px",
    fontSize: "13px",
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
};

export default function SolicitudCard({ solicitud, estaPostulado, onToggle, loading, onVerDetalle }) {
  const iniciales =
    solicitud.iniciales ??
    `${solicitud.nombre?.charAt(0) ?? ""}${solicitud.nombre?.split(" ")[1]?.charAt(0) ?? ""}`.toUpperCase();

  const tiempoRelativo = solicitud.creadoEn
    ? formatDistanceToNow(new Date(solicitud.creadoEn), { addSuffix: true, locale: es })
    : "hace un momento";

  const postulado = estaPostulado(solicitud.postulantes ?? []);
  const totalPostulantes = solicitud.postulantes?.length ?? 0;

  return (
    <div
      style={{ ...s.card, borderColor: postulado ? "#166534" : "#1e1e30" }}
      onClick={() => onVerDetalle(solicitud)}
    >
      <div style={s.cardTop}>
        <div style={s.meta}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: colorAvatar(iniciales),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 600,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {iniciales}
          </div>
          <span style={s.metaName}>
            {solicitud.nombre} · {solicitud.distrito} ·{" "}
            <span style={s.metaTime}>{tiempoRelativo}</span>
          </span>
        </div>
        <div style={s.cardRight}>
          {solicitud.urgente && <span style={s.badgeUrgente}>Urgente</span>}
          <span style={s.price}>{solicitud.precio}</span>
        </div>
      </div>

      <h2 style={s.title}>{solicitud.titulo}</h2>
      <p style={s.desc}>{solicitud.descripcion}</p>

      <div style={s.chips}>
        {(solicitud.tags ?? []).map((t) => (
          <span key={t} style={s.chip}>{t}</span>
        ))}
      </div>

      <div style={s.bottom}>
        <div style={s.stats}>
          <span>{totalPostulantes} postulantes</span>
          <span>{solicitud.distrito}</span>
        </div>
        <button
          style={loading ? s.btnLoading : postulado ? s.btnPostulado : s.btnPostular}
          onClick={(e) => {
            e.stopPropagation(); // no abrir modal al clicar el botón
            onToggle(solicitud.id, solicitud.postulantes ?? []);
          }}
          disabled={loading}
        >
          {loading ? "..." : postulado ? "✓ Postulado — Cancelar" : "Postularme"}
        </button>
      </div>
    </div>
  );
}