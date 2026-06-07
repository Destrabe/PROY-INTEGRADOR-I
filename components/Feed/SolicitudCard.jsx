"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

function colorAvatar(iniciales = "") {
  const colores = ["#2d1a5e", "#0f2d1a", "#2d1a0a", "#0a1a2d", "#2d0a1a", "#1a0a2d", "#0a2d2d"];
  let hash = 0;
  for (const c of iniciales) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colores[Math.abs(hash) % colores.length];
}

export default function SolicitudCard({
  solicitud,
  currentUserId,
  currentUserRole,
  estaPostulado,
  puedePostularse,
  onToggle,
  loading,
  onVerDetalle,
  onCancelar,
}) {
  const iniciales =
    solicitud.iniciales ||
    `${solicitud.nombre?.charAt(0) ?? ""}${solicitud.nombre?.split(" ")[1]?.charAt(0) ?? ""}`.toUpperCase() ||
    "U";

  const tiempoRelativo = solicitud.creadoEn
    ? formatDistanceToNow(new Date(solicitud.creadoEn), { addSuffix: true, locale: es })
    : "hace un momento";

  const postulado = estaPostulado?.(solicitud.postulantes ?? []) ?? false;
  const totalPostulantes = solicitud.postulantes?.length ?? 0;
  const esPropietario = currentUserId && currentUserId === solicitud.userId;
  const esTrabajador = currentUserRole === "trabajador";
  const puedeAccion = esTrabajador && !esPropietario && puedePostularse?.(solicitud.userId);
  const primerImagen = solicitud.imageUrls?.[0] ?? null;

  const truncate = (text, max = 120) => {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + "..." : text;
  };

  return (
    <div
      className="rounded-xl p-4 md:p-5 mb-3 cursor-pointer transition-all border"
      style={{
        background: "var(--bg-card)",
        borderColor: postulado
          ? "#166534"
          : esPropietario
          ? "var(--accent)"
          : "var(--border-color)",
      }}
      onClick={() => onVerDetalle(solicitud)}
    >
      {/* Header*/}
      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
        <div className="flex gap-3 items-center">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: colorAvatar(iniciales) }}
          >
            {iniciales}
          </div>
          <div>
            <span className="text-[var(--text-secondary)] text-sm font-medium">
              {solicitud.nombre} · {solicitud.distrito}
            </span>
            <br />
            <span className="text-[var(--text-muted)] text-xs">{tiempoRelativo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {solicitud.urgente && (
            <span className="badge" style={{ background: "var(--error)", color: "white", border: "none" }}>
              Urgente
            </span>
          )}
          {esPropietario && (
            <span className="badge" style={{ background: "var(--accent)", color: "white" }}>
              Mi solicitud
            </span>
          )}
          <span className="font-bold text-[var(--accent)]">{solicitud.precio}</span>
        </div>
      </div>

      {/* Imagen*/}
      {primerImagen && (
        <img
          src={primerImagen}
          alt="preview"
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      )}

      {/* Título y descripción */}
      <h2 className="font-bold text-base mb-1 text-[var(--text-main)]">{solicitud.titulo}</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-2">
        {truncate(solicitud.descripcion, 100)}
      </p>

      {/* Tags */}
      {solicitud.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 my-3">
          {solicitud.tags.map((t) => (
            <span key={t} className="badge text-xs">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Pie de card: estadísticas + botones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-2">
        <div className="flex gap-4 text-xs text-[var(--text-muted)]">
          <span>{totalPostulantes} postulantes</span>
          <span>{solicitud.distrito}</span>
          <span>{solicitud.modalidad}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Si es propietario y la solicitud no está completada/cancelada */}
          {esPropietario &&
            solicitud.estado !== "completada" &&
            solicitud.estado !== "cancelada" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelar(solicitud.id);
                }}
                className="btn-secondary text-sm px-3 py-1"
              >
                Cancelar
              </button>
            )}

          {/* Si no hay sesión */}
          {!currentUserId && (
            <a
              href="/login"
              onClick={(e) => e.stopPropagation()}
              className="btn-primary text-sm px-4 py-1.5"
            >
              Iniciar sesión
            </a>
          )}

          {/* Si es cliente sin rol de trabajador */}
          {currentUserId && !esPropietario && !esTrabajador && (
            <a
              href="/worker"
              onClick={(e) => e.stopPropagation()}
              className="btn-primary text-sm px-4 py-1.5"
            >
              Únete como trabajador
            </a>
          )}

          {/* Botón de postulación para trabajadores */}
          {puedeAccion && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(solicitud.id, solicitud.postulantes, solicitud.userId);
              }}
              disabled={loading}
              className={`text-sm px-4 py-1.5 rounded-lg font-bold transition-all ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : postulado
                  ? "bg-transparent text-[var(--success)] border border-[var(--success)]"
                  : "btn-primary"
              }`}
            >
              {loading ? "..." : postulado ? "Postulado — Cancelar" : "Postularme"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}