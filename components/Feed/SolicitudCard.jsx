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
  const iniciales = solicitud.iniciales || `${solicitud.nombre?.charAt(0) ?? ""}${solicitud.nombre?.split(" ")[1]?.charAt(0) ?? ""}`.toUpperCase() || "U";
  const tiempoRelativo = solicitud.creadoEn ? formatDistanceToNow(new Date(solicitud.creadoEn), { addSuffix: true, locale: es }) : "hace un momento";
  const postulado = estaPostulado?.(solicitud.postulantes ?? []) ?? false;
  const totalPostulantes = solicitud.postulantes?.length ?? 0;
  const esPropietario = currentUserId && currentUserId === solicitud.userId;
  const esTrabajador = currentUserRole === "trabajador";
  const descLarga = (solicitud.descripcion ?? "").length > 120;
  const primerImagen = solicitud.imageUrls?.[0] ?? null;
  const puedeAccion = esTrabajador && !esPropietario && puedePostularse?.(solicitud.userId);

  return (
    <div
      className={`bg-[#13131f] border rounded-xl p-5 mb-3 cursor-pointer transition-all hover:border-[#4a3aaa] ${postulado ? "border-[#166534]" : esPropietario ? "border-[#2e1a5e]" : "border-[#1e1e30]"}`}
      onClick={() => onVerDetalle(solicitud)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: colorAvatar(iniciales) }}>
            {iniciales}
          </div>
          <div>
            <span className="text-[#888] text-sm font-medium">{solicitud.nombre} · {solicitud.distrito}</span><br />
            <span className="text-[#555] text-xs">{tiempoRelativo}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {solicitud.urgente && <span className="bg-[#2d0a0a] text-[#f87171] border border-[#5a1a1a] rounded-full text-xs px-2 py-1">Urgente</span>}
          {esPropietario && <span className="bg-[#1e1a3a] text-[#a78bfa] border border-[#4a3aaa] rounded-full text-xs px-2 py-1">Mi solicitud</span>}
          <span className="text-[#a78bfa] font-bold">{solicitud.precio}</span>
        </div>
      </div>

      {primerImagen && <img src={primerImagen} alt="preview" className="w-full h-40 object-cover rounded-lg mb-3" />}

      <h2 className="font-syne font-bold text-white text-base mb-1">{solicitud.titulo}</h2>
      <p className="text-[#777] text-sm line-clamp-2 mb-2">{solicitud.descripcion}</p>
      {descLarga && <span className="text-[#500fe9] text-xs">Ver descripción completa →</span>}

      <div className="flex flex-wrap gap-2 my-3">
        {solicitud.tags?.map((t) => <span key={t} className="bg-[#1a1a2e] text-[#9a9ab0] rounded-md text-xs px-2 py-1">{t}</span>)}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-3 text-[#555] text-xs">
          <span>{totalPostulantes} postulantes</span>
          <span>{solicitud.distrito}</span>
          <span>{solicitud.modalidad}</span>
        </div>

        {esPropietario && solicitud.estado !== "completada" && solicitud.estado !== "cancelada" && (
          <button onClick={(e) => { e.stopPropagation(); onCancelar(solicitud.id); }} className="bg-transparent text-[#f87171] border border-[#5a1a1a] rounded-lg px-3 py-1 text-xs font-bold">
            Cancelar
          </button>
        )}

        {!currentUserId && (
          <a href="/login" onClick={(e) => e.stopPropagation()} className="bg-[#500fe9] text-white rounded-lg px-4 py-1.5 text-xs font-bold">Iniciar sesión</a>
        )}

        {currentUserId && !esPropietario && !esTrabajador && (
          <a href="/worker" onClick={(e) => e.stopPropagation()} className="bg-[#500fe9] text-white rounded-lg px-4 py-1.5 text-xs font-bold">Únete como trabajador</a>
        )}

        {puedeAccion && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(solicitud.id, solicitud.postulantes, solicitud.userId); }}
            disabled={loading}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold ${loading ? "bg-[#2a2a3e] text-[#666] cursor-not-allowed" : postulado ? "bg-[#1a2d1a] text-[#4ade80] border border-[#166534]" : "bg-[#500fe9] text-white"}`}
          >
            {loading ? "..." : postulado ? "✓ Postulado — Cancelar" : "Postularme"}
          </button>
        )}
      </div>
    </div>
  );
}