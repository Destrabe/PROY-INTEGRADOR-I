"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function normalizarRol(rol) {
  return String(rol || "")
    .toLowerCase()
    .trim();
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

function getStatusConfig(estado) {
  const map = {
    abierto: {
      label: "Abierto",
      className: "border-[#6c63ff]/25 bg-[#6c63ff]/10 text-[#aaa5ff]",
      text: "El cliente está recibiendo postulaciones.",
    },
    postulado: {
      label: "Recibiendo propuestas",
      className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
      text: "Hay trabajadores interesados. El cliente puede elegir uno para avanzar.",
    },
    pago: {
      label: "Pendiente de pago",
      className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
      text: "El trabajador fue aceptado. Falta confirmar el pago protegido.",
    },
    en_proceso: {
      label: "En desarrollo",
      className: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
      text: "El pago está retenido en escrow hasta que el cliente apruebe la entrega.",
    },
    finalizado: {
      label: "Finalizado",
      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      text: "El trabajo fue completado y el pago fue liberado.",
    },
  };

  return map[estado] || map.abierto;
}

function IconX() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg
      width="15"
      height="15"
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

function IconShield() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function SolicitudModal({
  solicitud,
  ownerInfo,
  onClose,
  currentUserId,
  currentUserRole,
  estaPostulado,
  onToggle,
  loading,
  onCancelar,
}) {
  const router = useRouter();
  const [imgIdx, setImgIdx] = useState(0);
  const [confirmando, setConfirmando] = useState(false);

  if (!solicitud) return null;

  const imagenes = solicitud.imageUrls || [];
  const tieneImagenes = imagenes.length > 0;
  const postulantes = solicitud.postulantes || [];
  const totalPostulantes = postulantes.length;

  const rol = normalizarRol(currentUserRole);
  const esTrabajador = rol === "trabajador" || rol === "worker";
  const esAdmin = rol === "admin" || rol === "administrador";
  const sinSesion = !currentUserId;
  const esPropietario = currentUserId && currentUserId === solicitud.userId;

  const miPostulacion = getMiPostulacion(postulantes, currentUserId);
  const aceptado = getAceptado(postulantes);
  const estado = getEstadoSolicitud(solicitud);
  const status = getStatusConfig(estado);

  const postulado = !!miPostulacion || estaPostulado?.(postulantes);
  const soyAceptado = aceptado && getPostulanteId(aceptado) === currentUserId;
  const miEstado = miPostulacion ? getPostulanteEstado(miPostulacion) : null;

  const puedeCancelar =
    (esPropietario || esAdmin) &&
    !["pago", "en_proceso", "finalizado"].includes(estado);

  const urgenciaLabel =
    {
      hoy: "Hoy mismo",
      semana: "Esta semana",
      mes: "Este mes",
      acordar: "A coordinar",
    }[solicitud.urgencia] || "A coordinar";

  const nombreCliente = titleCaseName(solicitud.nombre || "Cliente");

  const prevImg = (e) => {
    e.stopPropagation();
    setImgIdx((i) => (i === 0 ? imagenes.length - 1 : i - 1));
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setImgIdx((i) => (i === imagenes.length - 1 ? 0 : i + 1));
  };

  const irAFlujo = (e) => {
    e.stopPropagation();
    router.push(`/job-flow?jobId=${solicitud.id}`);
  };

  const handleCancelar = (e) => {
    e.stopPropagation();

    if (!puedeCancelar) return;

    if (!confirmando) {
      setConfirmando(true);
      return;
    }

    onCancelar(solicitud.id);
    setConfirmando(false);
  };

  const textoPrincipal = (() => {
    if (esPropietario) {
      if (estado === "finalizado") return "Ver cierre y reseñas";
      if (estado === "en_proceso") return "Revisar progreso";
      if (estado === "pago") return "Confirmar y pagar";
      return `Gestionar postulantes (${totalPostulantes})`;
    }

    if (soyAceptado) {
      if (estado === "finalizado") return "Ver cierre y reseñar";
      if (estado === "en_proceso") return "Ver proyecto en proceso";
      if (estado === "pago") return "Esperando pago del cliente";
      return "Ver estado";
    }

    if (postulado) {
      if (miEstado === "postulado") return "Ver postulación";
      return "Ver estado";
    }

    return "Postularme ahora";
  })();

  const mostrarNotaPostulantes =
    !esPropietario && !sinSesion && !esAdmin && esTrabajador;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 text-white backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#111118] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/50 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <IconX />
        </button>

        {tieneImagenes ? (
          <div className="relative h-80 overflow-hidden bg-[#0A0A0F]">
            <img
              src={imagenes[imgIdx]}
              alt={`Imagen ${imgIdx + 1}`}
              className="h-full w-full object-cover object-center"
            />

            {imagenes.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white"
                >
                  ‹
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white"
                >
                  ›
                </button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {imagenes.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIdx(i);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        i === imgIdx ? "w-8 bg-white" : "w-2 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-28 bg-gradient-to-r from-[#6c63ff]/20 via-[#111118] to-emerald-500/10" />
        )}

        <div className="overflow-y-auto p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ${status.className}`}
            >
              {status.label}
            </span>

            {solicitud.urgente && (
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
                Urgente
              </span>
            )}

            {esPropietario && (
              <span className="rounded-full border border-[#6c63ff]/20 bg-[#6c63ff]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#aaa5ff]">
                Mi solicitud
              </span>
            )}

            {postulado && !esPropietario && (
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                Ya postulado
              </span>
            )}
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
                {solicitud.titulo || "Solicitud sin título"}
              </h2>
              <div className="mt-3 flex items-center gap-3 text-sm font-bold text-slate-500">
                <div className="h-10 w-10 overflow-hidden rounded-2xl bg-[#6c63ff]">
                  {ownerInfo?.photoURL ? (
                    <img
                      src={ownerInfo.photoURL}
                      alt={nombreCliente}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xs font-black uppercase text-white">
                      {nombreCliente
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                </div>

                <div>
                  <p>
                    Publicado por{" "}
                    <span className="text-slate-300">{nombreCliente}</span>
                  </p>

                  <p className="text-xs text-slate-600">
                    {solicitud.distrito || "Sin distrito"}
                    {solicitud.modalidad && (
                      <>
                        {" · "}
                        {solicitud.modalidad}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#6c63ff]/20 bg-[#6c63ff]/10 px-5 py-4 text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#aaa5ff]">
                Presupuesto
              </p>
              <p className="text-2xl font-black text-white">
                {solicitud.precio || "A convenir"}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-3xl border border-white/10 bg-[#0A0A0F] p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <IconShield />
              </div>
              <div>
                <p className="font-black text-white">Estado del flujo</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-400">
                  {status.text}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Postulantes", totalPostulantes],
                ["Disponibilidad", urgenciaLabel],
                ["Ubicación", solicitud.distrito || "No especificada"],
                ["Modalidad", solicitud.modalidad || "A coordinar"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-black text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
              Descripción del trabajo
            </p>
            <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-300">
              {solicitud.descripcion || "Sin descripción"}
            </p>
          </div>

          {(solicitud.tags || []).length > 0 && (
            <div className="mb-7 flex flex-wrap gap-2">
              {(solicitud.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-white/5 pt-6 md:flex-row">
            {sinSesion && (
              <a
                href="/login"
                className="flex-1 rounded-2xl bg-[#6c63ff] px-5 py-4 text-center text-[10px] font-black uppercase tracking-[0.22em] text-white no-underline"
              >
                Inicia sesión para postularte
              </a>
            )}

            {!sinSesion && esAdmin && puedeCancelar && (
              <button
                onClick={handleCancelar}
                className="flex-1 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-amber-400 transition hover:bg-amber-500 hover:text-white"
              >
                {confirmando ? "Confirmar eliminación" : "Eliminar solicitud"}
              </button>
            )}

            {!sinSesion && !esAdmin && esPropietario && (
              <>
                <button
                  onClick={irAFlujo}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#6c63ff] px-5 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-lg shadow-[#6c63ff]/20"
                >
                  {textoPrincipal}
                  <IconArrow />
                </button>

                {puedeCancelar && (
                  <button
                    onClick={handleCancelar}
                    className="flex-1 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    {confirmando
                      ? "Confirmar cancelación"
                      : "Cancelar solicitud"}
                  </button>
                )}
              </>
            )}

            {!sinSesion && !esAdmin && !esPropietario && !esTrabajador && (
              <a
                href="/worker"
                className="flex-1 rounded-2xl bg-[#6c63ff] px-5 py-4 text-center text-[10px] font-black uppercase tracking-[0.22em] text-white no-underline"
              >
                Únete como trabajador
              </a>
            )}

            {!sinSesion && !esAdmin && !esPropietario && esTrabajador && (
              <button
                onClick={irAFlujo}
                disabled={loading || estado === "finalizado"}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#6c63ff] px-5 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-lg shadow-[#6c63ff]/20 transition hover:scale-[1.01] disabled:bg-white/10 disabled:text-slate-600 disabled:shadow-none"
              >
                {loading
                  ? "Procesando..."
                  : estado === "finalizado"
                    ? "Trabajo finalizado"
                    : textoPrincipal}
                {!loading && estado !== "finalizado" && <IconArrow />}
              </button>
            )}
          </div>

          {mostrarNotaPostulantes && (
            <p className="mt-4 text-center text-xs font-bold text-slate-600">
              {postulado
                ? "Ya estás postulado. Entra al flujo para seguir el estado de tu propuesta."
                : `${totalPostulantes} persona${totalPostulantes !== 1 ? "s" : ""} ya se postularon a este trabajo.`}
            </p>
          )}

          {["pago", "en_proceso", "finalizado"].includes(estado) && (
            <p className="mt-4 text-center text-xs font-bold text-emerald-400">
              Este proyecto está protegido por escrow de Nexora.
            </p>
          )}

          {confirmando && (
            <p className="mt-4 text-center text-xs font-bold text-red-400">
              Esta acción es permanente. Haz clic de nuevo para confirmar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
