"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useThemeStore } from "@/store/themeStore"; // <-- Importamos tu store

function colorAvatar(iniciales = "") {
  const colores = [
    "#2d1a5e",
    "#0f2d1a",
    "#2d1a0a",
    "#0a1a2d",
    "#2d0a1a",
    "#1a0a2d",
    "#0a2d2d",
  ];
  let hash = 0;
  for (const c of iniciales) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colores[Math.abs(hash) % colores.length];
}

function titleCaseName(value = "") {
  const noEmail = String(value).includes("@")
    ? String(value).split("@")[0]
    : String(value);
  return noEmail
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
}

function truncar(texto = "", max = 130) {
  return texto.length > max ? texto.slice(0, max).trimEnd() + "..." : texto;
}

function normalizarRol(rol) {
  return String(rol || "")
    .toLowerCase()
    .trim();
}

function getPostulanteId(p) {
  return typeof p === "object" ? p.workerId || p.uid || p.userId : p;
}

function getPostulanteEstado(p) {
  return typeof p === "object" ? p.estado || "postulado" : "postulado";
}

function getMiPostulacion(postulantes = [], uid) {
  if (!uid) return null;
  return postulantes.find((p) => getPostulanteId(p) === uid) || null;
}

function getAceptado(postulantes = []) {
  return (
    postulantes.find(
      (p) =>
        typeof p === "object" &&
        ["pago", "en_proceso", "finalizado"].includes(p.estado),
    ) || null
  );
}

function getEstadoSolicitud(solicitud) {
  const aceptado = getAceptado(solicitud.postulantes || []);

  if (aceptado?.estado === "finalizado") return "finalizado";
  if (aceptado?.estado === "en_proceso") return "en_proceso";
  if (aceptado?.estado === "pago") return "pago";
  if ((solicitud.postulantes || []).length > 0) return "postulado";

  return "abierto";
}

function toSafeDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getStatusConfig(estado) {
  const map = {
    abierto: {
      label: "Abierto",
      className:
        "border-[#6c63ff]/25 bg-[#6c63ff]/10 text-[#6c63ff] dark:text-[#aaa5ff]", // Adaptado para modo claro/oscuro
      dot: "bg-[#6c63ff]",
    },
    postulado: {
      label: "Recibiendo propuestas",
      className:
        "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
      dot: "bg-blue-500 dark:bg-blue-400",
    },
    pago: {
      label: "Pendiente de pago",
      className:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500 dark:bg-amber-400",
    },
    en_proceso: {
      label: "En desarrollo",
      className:
        "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      dot: "bg-cyan-500 dark:bg-cyan-400",
    },
    finalizado: {
      label: "Finalizado",
      className:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500 dark:bg-emerald-400",
    },
  };

  return map[estado] || map.abierto;
}

function IconShield() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function SolicitudCard({
  solicitud,
  ownerInfo,
  currentUserId,
  currentUserRole,
  estaPostulado,
  onToggle,
  loading,
  onVerDetalle,
  onCancelar,
}) {
  const router = useRouter();

  // <-- Traemos el tema del store
  const theme = useThemeStore((state) => state.theme);
  const textColor = useThemeStore((state) => state.textColor);

  // Colores dinámicos basados en tu diseño
  const cardBg = theme === "dark" ? "#111118" : "#ffffff";
  const defaultBorder = theme === "dark" ? "rgba(255,255,255,0.1)" : "#e4e4e7";
  const mutedText = theme === "dark" ? "#94a3b8" : "#64748b"; // text-slate-400 / 500

  const rol = normalizarRol(currentUserRole);
  const esTrabajador = rol === "trabajador" || rol === "worker";
  const esAdmin = rol === "admin" || rol === "administrador";
  const esPropietario = currentUserId && currentUserId === solicitud.userId;

  const postulantes = solicitud.postulantes || [];
  const miPostulacion = getMiPostulacion(postulantes, currentUserId);
  const aceptado = getAceptado(postulantes);
  const estado = getEstadoSolicitud(solicitud);
  const status = getStatusConfig(estado);

  const postulado = !!miPostulacion || estaPostulado?.(postulantes);
  const miEstado = miPostulacion ? getPostulanteEstado(miPostulacion) : null;
  const soyAceptado = aceptado && getPostulanteId(aceptado) === currentUserId;

  const totalPostulantes = postulantes.length;
  const primerImagen = solicitud.imageUrls?.[0] || null;
  const nombreCliente = titleCaseName(solicitud.nombre || "Cliente");
  const iniciales =
    solicitud.iniciales ||
    `${nombreCliente?.charAt(0) || ""}${nombreCliente?.split(" ")[1]?.charAt(0) || ""}`.toUpperCase() ||
    "NX";

  const creadoEnDate = toSafeDate(
    solicitud.creadoEn || solicitud.fecha || solicitud.createdAt,
  );
  const tiempoRelativo = creadoEnDate
    ? formatDistanceToNow(creadoEnDate, { addSuffix: true, locale: es })
    : "hace un momento";

  const puedeCancelar =
    (esPropietario || esAdmin) &&
    !["pago", "en_proceso", "finalizado"].includes(estado);

  const irAFlujo = (e) => {
    e.stopPropagation();
    router.push(`/job-flow?jobId=${solicitud.id}`);
  };

  const textoPrincipal = (() => {
    if (esPropietario) {
      if (estado === "finalizado") return "Ver cierre y reseñas";
      if (estado === "en_proceso") return "Revisar progreso";
      if (estado === "pago") return "Confirmar pago";
      return `Gestionar (${totalPostulantes})`;
    }

    if (soyAceptado) {
      if (estado === "finalizado") return "Ver cierre y reseñar";
      if (estado === "en_proceso") return "Ver proyecto";
      if (estado === "pago") return "Esperando pago";
      return "Ver estado";
    }

    if (postulado) {
      if (miEstado === "postulado") return "Ver postulación";
      return "Ver estado";
    }

    return "Postularme";
  })();

  // Calculamos el borde condicional basado en el estado, pero considerando el tema base
  const dynamicBorder =
    estado === "finalizado"
      ? "rgba(16, 185, 129, 0.2)" // emerald-500/20
      : postulado || soyAceptado
        ? "rgba(108, 99, 255, 0.35)" // #6c63ff/35
        : defaultBorder;

  return (
    <article
      onClick={() => onVerDetalle(solicitud)}
      className="group relative cursor-pointer overflow-hidden rounded-4xl border p-5 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#6c63ff]/10 md:p-6"
      style={{
        background: cardBg,
        borderColor: dynamicBorder,
        color: textColor[theme],
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#6c63ff]/60 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl shadow-lg"
            style={{ backgroundColor: colorAvatar(iniciales) }}
          >
            {ownerInfo?.photoURL ? (
              <img
                src={ownerInfo.photoURL}
                alt={nombreCliente}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-sm font-black uppercase text-white">
                {iniciales}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className="text-sm font-black"
                style={{ color: textColor[theme] }}
              >
                {nombreCliente}
              </p>
              <span className="text-xs font-bold" style={{ color: mutedText }}>
                ·
              </span>
              <p className="text-xs font-bold" style={{ color: mutedText }}>
                {solicitud.distrito || "Sin distrito"}
              </p>
              <span className="text-xs font-bold" style={{ color: mutedText }}>
                ·
              </span>
              <p className="text-xs font-bold" style={{ color: mutedText }}>
                {tiempoRelativo}
              </p>
            </div>

            <h2
              className="mt-3 text-xl font-black tracking-tight transition group-hover:text-[#6c63ff]"
              style={{ color: textColor[theme] }}
            >
              {solicitud.titulo || "Solicitud sin título"}
            </h2>

            <p
              className="mt-2 max-w-3xl text-sm font-medium leading-relaxed"
              style={{ color: mutedText }}
            >
              {truncar(solicitud.descripcion || "Sin descripción")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${theme === "dark" ? "dark " : ""}${status.className}`}
          >
            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
            {status.label}
          </div>

          {solicitud.urgente && (
            <span
              className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${theme === "dark" ? "border-red-500/20 bg-red-500/10 text-red-400" : "border-red-500/20 bg-red-50 text-red-600"}`}
            >
              Urgente
            </span>
          )}

          {esPropietario && (
            <span
              className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${theme === "dark" ? "border-[#6c63ff]/20 bg-[#6c63ff]/10 text-[#aaa5ff]" : "border-[#6c63ff]/20 bg-[#6c63ff]/5 text-[#6c63ff]"}`}
            >
              Mi solicitud
            </span>
          )}

          <p
            className="text-2xl font-black"
            style={{ color: textColor[theme] }}
          >
            {solicitud.precio || "A convenir"}
          </p>
        </div>
      </div>

      {primerImagen && (
        <div
          className="mt-5 overflow-hidden rounded-3xl border"
          style={{
            borderColor: defaultBorder,
            background: theme === "dark" ? "#0A0A0F" : "#f1f5f9",
          }}
        >
          <img
            src={primerImagen}
            alt="Foto de la solicitud"
            onClick={(e) => e.stopPropagation()}
            className="h-72 w-full object-cover object-center transition duration-700 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {(solicitud.tags || []).slice(0, 6).map((tag) => (
          <span
            key={tag}
            className="rounded-xl border px-3 py-2 text-xs font-bold"
            style={{
              borderColor: defaultBorder,
              background:
                theme === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.03)",
              color: mutedText,
            }}
          >
            {tag}
          </span>
        ))}

        {solicitud.modalidad && (
          <span
            className={`rounded-xl border px-3 py-2 text-xs font-bold ${theme === "dark" ? "border-blue-500/20 bg-blue-500/10 text-blue-400" : "border-blue-200 bg-blue-50 text-blue-600"}`}
          >
            {solicitud.modalidad}
          </span>
        )}
      </div>

      <div
        className="mt-6 flex flex-col gap-4 border-t pt-5 lg:flex-row lg:items-center lg:justify-between"
        style={{ borderColor: defaultBorder }}
      >
        <div
          className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-[0.16em]"
          style={{ color: mutedText }}
        >
          <span>{totalPostulantes} postulantes</span>
          <span>{solicitud.distrito || "Sin ubicación"}</span>
          {["pago", "en_proceso", "finalizado"].includes(estado) && (
            <span
              className={`inline-flex items-center gap-1.5 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
            >
              <IconShield /> Escrow activo
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {esAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelar(solicitud.id);
              }}
              className={`rounded-xl border px-4 py-3 text-[10px] font-black uppercase tracking-widest transition ${theme === "dark" ? "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white" : "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white"}`}
            >
              Eliminar
            </button>
          )}

          {esPropietario || soyAceptado || postulado ? (
            <button
              onClick={irAFlujo}
              className="inline-flex items-center gap-2 rounded-xl bg-[#6c63ff] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#6c63ff]/20 transition hover:scale-[1.01]"
            >
              {textoPrincipal}
              <IconArrow />
            </button>
          ) : !currentUserId ? (
            <a
              href="/login"
              onClick={(e) => e.stopPropagation()}
              className="rounded-xl bg-[#6c63ff] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white no-underline"
            >
              Iniciar sesión
            </a>
          ) : esAdmin ? null : !esTrabajador ? (
            <a
              href="/worker"
              onClick={(e) => e.stopPropagation()}
              className="rounded-xl bg-[#6c63ff] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white no-underline"
            >
              Únete como trabajador
            </a>
          ) : (
            <button
              onClick={irAFlujo}
              disabled={loading || estado === "finalizado"}
              className={`inline-flex items-center gap-2 rounded-xl bg-[#6c63ff] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#6c63ff]/20 transition hover:scale-[1.01] ${theme === "dark" ? "disabled:bg-white/10 disabled:text-slate-600" : "disabled:bg-black/5 disabled:text-slate-400"} disabled:shadow-none`}
            >
              {loading
                ? "Cargando..."
                : estado === "finalizado"
                  ? "Finalizado"
                  : "Postularme"}
              {!loading && estado !== "finalizado" && <IconArrow />}
            </button>
          )}

          {puedeCancelar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelar(solicitud.id);
              }}
              className={`rounded-xl border px-4 py-3 text-[10px] font-black uppercase tracking-widest transition ${theme === "dark" ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white" : "border-red-200 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white"}`}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
