"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

function colorAvatar(iniciales = "") {
  const colores = [
    "#2d1a5e", "#0f2d1a", "#2d1a0a",
    "#0a1a2d", "#2d0a1a", "#1a0a2d", "#0a2d2d",
  ];
  let hash = 0;
  for (const c of iniciales)
    hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colores[Math.abs(hash) % colores.length];
}

const s = {
  card: {
    backgroundColor: "#13131f",
    border: "1px solid #1e1e30",
    borderRadius: "14px",
    padding: "18px 20px",
    marginBottom: "14px",
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  meta: { display: "flex", alignItems: "center", gap: "10px" },
  metaName: { color: "#888", fontSize: "13px", fontWeight: 500 },
  metaTime: { color: "#555", fontSize: "12px" },
  cardRight: { display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 },
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
  price: { color: "#f0f0ff", fontWeight: 700, fontSize: "15px" },
  imgThumb: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "12px",
    display: "block",
  },
  title: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 700,
    fontSize: "16px",
    color: "#f0f0ff",
    marginBottom: "6px",
    lineHeight: 1.4,
  },
  desc: {
    color: "#666",
    fontSize: "13px",
    lineHeight: 1.6,
    marginBottom: "10px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
  },
  verMas: { color: "#500fe9", fontSize: "12px", cursor: "pointer" },
  chips: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" },
  chip: {
    backgroundColor: "#1a1a2e",
    color: "#9a9ab0",
    borderRadius: "6px",
    fontSize: "11px",
    padding: "3px 8px",
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  stats: { display: "flex", gap: "12px", color: "#555", fontSize: "12px" },
  btnPostular: {
    backgroundColor: "#500fe9",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "var(--font-dm-sans), sans-serif",
    flexShrink: 0,
  },
  btnPostulado: {
    backgroundColor: "#1a2d1a",
    color: "#4ade80",
    border: "1px solid #166534",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "var(--font-dm-sans), sans-serif",
    flexShrink: 0,
  },
  btnLoading: {
    backgroundColor: "#2a2a3e",
    color: "#666",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "not-allowed",
    fontWeight: 700,
    fontFamily: "var(--font-dm-sans), sans-serif",
    flexShrink: 0,
  },
  btnCancelar: {
    backgroundColor: "transparent",
    color: "#f87171",
    border: "1px solid #5a1a1a",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: 700,
    fontFamily: "var(--font-dm-sans), sans-serif",
    flexShrink: 0,
  },

    badgeCompletado: {
    display: "inline-block",
    backgroundColor: "#14532d",
    color: "#4ade80",
    border: "1px solid #16a34a",
    borderRadius: "20px",
    fontSize: "11px",
    padding: "3px 10px",
  },
};


export default function SolicitudCard({
  solicitud,
  currentUserId,
  rolUsuario,
  estaPostulado,
  puedePostularse,    
  onToggle,
  loading,
  onVerDetalle,
  onCancelar,
}) {
  
  const iniciales =
    solicitud.iniciales ||
    `${solicitud.nombre?.charAt(0) ?? ""}${
      solicitud.nombre?.split(" ")[1]?.charAt(0) ?? ""
    }`.toUpperCase() ||
    "U";

  const tiempoRelativo = solicitud.creadoEn
    ? formatDistanceToNow(new Date(solicitud.creadoEn), {
        addSuffix: true,
        locale: es,
      })
    : "hace un momento";

  const postulado         = estaPostulado(solicitud.postulantes);  
  const totalPostulantes  = solicitud.postulantes.length;
  const esPropietario     = Boolean(currentUserId && currentUserId === solicitud.userId);
  const descLarga         = solicitud.descripcion.length > 120;
  const primerImagen      = solicitud.imageUrls[0] ?? null;

  const puedeAccion = puedePostularse
    ? puedePostularse(solicitud.userId)
    : rolUsuario === "trabajador" && !esPropietario; 

  return (
    <div
      style={{
        ...s.card,
        borderColor: postulado
          ? "#166534"
          : esPropietario
          ? "#2e1a5e"
          : "#1e1e30",
      }}
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
          <div>
            <span style={s.metaName}>
              {solicitud.nombre} · {solicitud.distrito}
            </span>
            <br />
            <span style={s.metaTime}>{tiempoRelativo}</span>
          </div>
        </div>

        <div style={s.cardRight}>
          {solicitud.urgente && <span style={s.badgeUrgente}>Urgente</span>}
          {esPropietario && solicitud.estado === "activa" && <span style={s.badgeMio}>Mi solicitud</span>}
          {solicitud.estado === "en_progreso" && <span style={{...s.badgeMio, backgroundColor:"#0f2d1a", color:"#4ade80", border:"1px solid #16a34a"}}>En progreso</span>}
          {solicitud.estado === "completada" && <span style={s.badgeCompletado}>Completado</span>}
          {solicitud.estado === "cancelada" && <span style={{...s.badgeMio, backgroundColor:"#2d0a0a", color:"#f87171", border:"1px solid #5a1a1a"}}>Cancelada</span>}
          <span style={s.price}>{solicitud.precio}</span>
        </div>
      </div>

      {primerImagen && (
        <img
          src={primerImagen}
          alt="Foto de la solicitud"
          style={s.imgThumb}
          onClick={(e) => e.stopPropagation()}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      )}

      <h2 style={s.title}>{solicitud.titulo}</h2>
      <p style={s.desc}>{solicitud.descripcion}</p>
      {descLarga && (
        <span style={s.verMas}>Ver descripción completa →</span>
      )}

      <div style={s.chips}>
        {solicitud.tags.map((t) => (
          <span key={t} style={s.chip}>{t}</span>
        ))}
      </div>

      <div style={s.bottom}>
        <div style={s.stats}>
          <span>{totalPostulantes} postulantes</span>
          <span>{solicitud.distrito}</span>
          {solicitud.modalidad && <span>{solicitud.modalidad}</span>}
        </div>

        {/* Propietario: cancelar */}
          {esPropietario && solicitud.estado !== "completada" && solicitud.estado !== "cancelada" && (
            <button
              style={s.btnCancelar}
              onClick={(e) => {
                e.stopPropagation();
                onCancelar(solicitud.id);
              }}
            >
              Cancelar solicitud
            </button>
          )}
        {/* Trabajador ajeno: postularse */}
        {puedeAccion && (
          <button
            style={
              loading ? s.btnLoading : postulado ? s.btnPostulado : s.btnPostular
            }
            onClick={(e) => {
              e.stopPropagation();
              onToggle(solicitud.id, solicitud.postulantes, solicitud.userId);
            }}
            disabled={loading}
          >
            {loading
              ? "..."
              : postulado
              ? "✓ Postulado — Cancelar"
              : "Postularme"}
          </button>
        )}
      </div>
    </div>
  );
}