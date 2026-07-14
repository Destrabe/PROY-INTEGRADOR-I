"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { useAuth } from "@/components/AuthContext";
import { useThemeStore } from "@/store/themeStore"; // Importamos tu store original
import { useSolicitudes } from "./Hooks/useSolicitudes";
import { usePostulacion } from "./Hooks/usePostulacion";
import { eliminarSolicitud } from "@/firebase/Solicitudes";
import { eliminarImagenesSolicitud } from "@/firebase/Storage";

import FiltrosTags from "@/components/Feed/FiltrosTags";
import SolicitudCard from "@/components/Feed/SolicitudCard";
import SolicitudModal from "@/components/Feed/SolicitudModal";
import Link from "next/link";

function normalizarRol(rol) {
  return String(rol || "").toLowerCase().trim();
}

function getPostulanteId(p) {
  return typeof p === "object" ? p.workerId || p.uid || p.userId : p;
}

function getAceptado(sol) {
  return (
    (sol.postulantes || []).find(
      (p) =>
        typeof p === "object" &&
        ["pago", "en_proceso", "finalizado"].includes(p.estado),
    ) || null
  );
}

function getEstadoSolicitud(sol) {
  const aceptado = getAceptado(sol);

  if (aceptado?.estado === "finalizado") return "finalizado";
  if (aceptado?.estado === "en_proceso") return "en_proceso";
  if (aceptado?.estado === "pago") return "aceptado";
  if ((sol.postulantes || []).length > 0) return "postulado";

  return "abierto";
}

function getMiPostulacion(sol, uid) {
  if (!uid) return null;
  return (sol.postulantes || []).find((p) => getPostulanteId(p) === uid) || null;
}

function filtrar(solicitudes, filtroActivo, busqueda, vista, user) {
  const uid = user?.uid;
  const rol = normalizarRol(user?.rol);
  const esTrabajador = rol === "trabajador" || rol === "worker";
  const esCliente = rol === "cliente" || rol === "client";
  const esAdmin = rol === "admin" || rol === "administrador";

  return solicitudes
    .filter((sol) => sol.tipo !== "solicitud_trabajador")
    .filter((sol) => {
      const estado = getEstadoSolicitud(sol);
      const miPostulacion = getMiPostulacion(sol, uid);

      if (vista === "Mis publicaciones") return sol.userId === uid;
      if (vista === "Mis postulaciones") return !!miPostulacion;
      if (vista === "En proceso") return estado === "aceptado" || estado === "en_proceso";
      if (vista === "Finalizados") return estado === "finalizado";

      if (vista === "Para ti" && esTrabajador) {
        return sol.userId !== uid && estado !== "finalizado";
      }

      if (vista === "Para ti" && esCliente) {
        return sol.userId === uid || estado !== "finalizado";
      }

      if (vista === "Para ti" && esAdmin) return true;

      return true;
    })
    .filter((sol) => {
      const filtroOk =
        filtroActivo === "Todos" ||
        filtroActivo === "Alta valoración" ||
        filtroActivo === "Alta valoraciÃ³n" ||
        (filtroActivo === "SJL" && sol.distrito === "San Juan de Lurigancho") ||
        sol.tags?.some((t) => t === filtroActivo);

      const q = busqueda.toLowerCase().trim();
      const busquedaOk =
        q === "" ||
        sol.titulo?.toLowerCase().includes(q) ||
        sol.descripcion?.toLowerCase().includes(q) ||
        sol.distrito?.toLowerCase().includes(q) ||
        sol.tags?.some((t) => t.toLowerCase().includes(q));

      return filtroOk && busquedaOk;
    });
}

// Recibe el tema actual para cambiar los colores de "slate" según sea claro u oscuro
function StatCard({ label, value, tone = "violet", theme, textColor }) {
  const tones = {
    violet: "border-[#6c63ff]/20 bg-[#6c63ff]/10 text-[#a9a4ff]",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    slate: theme === "dark" 
      ? "border-white/10 bg-white/[0.04] text-slate-300"
      : "border-black/10 bg-black/[0.04] text-slate-600",
  };

  return (
    <div className={`rounded-3xl border p-5 ${tones[tone]} transition-colors`}>
      <p 
        className="text-3xl font-black tracking-tight"
        style={{ color: tone === "slate" ? "inherit" : textColor[theme] }}
      >
        {value}
      </p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em]">
        {label}
      </p>
    </div>
  );
}

export default function FeedTrabajos() {
  const { user: appUser, loading } = useAuth();
  const router = useRouter();

  // Llamamos a tu store de forma exacta
  const theme = useThemeStore((state) => state.theme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);

  const { solicitudes, loading: loadingSolicitudes, error } = useSolicitudes();
  const { estaPostulado, togglePostulacion, loadingId } = usePostulacion(appUser?.uid);

  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [vista, setVista] = useState("Para ti");
  const [modalSolicitud, setModalSolicitud] = useState(null);
  const [usuariosInfo, setUsuariosInfo] = useState({});

  useEffect(() => {
    if (!loading && !appUser) router.push("/login");
  }, [loading, appUser, router]);

  const rol = normalizarRol(appUser?.rol);
  const esTrabajador = rol === "trabajador" || rol === "worker";
  const esCliente = rol === "cliente" || rol === "client";
  const esAdmin = rol === "admin" || rol === "administrador";

  const solicitudesReales = useMemo(
    () => solicitudes.filter((sol) => sol.tipo !== "solicitud_trabajador"),
    [solicitudes],
  );

  useEffect(() => {
    if (!solicitudesReales.length) return;

    let active = true;

    const ids = [...new Set(solicitudesReales.map((sol) => sol.userId).filter(Boolean))];

    (async () => {
      const entries = await Promise.all(
        ids.map(async (id) => {
          const snap = await getDoc(doc(db, "users", id));
          return [id, snap.exists() ? snap.data() : null];
        }),
      );

      if (active) setUsuariosInfo(Object.fromEntries(entries));
    })();

    return () => {
      active = false;
    };
  }, [solicitudesReales]);

  const stats = useMemo(() => {
    const publicadas = solicitudesReales.filter((s) => s.userId === appUser?.uid).length;
    const postuladas = solicitudesReales.filter((s) => !!getMiPostulacion(s, appUser?.uid)).length;
    const enProceso = solicitudesReales.filter((s) =>
      ["aceptado", "en_proceso"].includes(getEstadoSolicitud(s)),
    ).length;
    const finalizadas = solicitudesReales.filter((s) => getEstadoSolicitud(s) === "finalizado").length;

    return { publicadas, postuladas, enProceso, finalizadas };
  }, [solicitudesReales, appUser?.uid]);

  const vistas = useMemo(() => {
    if (esAdmin) return ["Para ti", "En proceso", "Finalizados"];
    if (esTrabajador) return ["Para ti", "Mis postulaciones", "En proceso", "Finalizados"];
    return ["Para ti", "Mis publicaciones", "En proceso", "Finalizados"];
  }, [esAdmin, esTrabajador]);

  useEffect(() => {
    if (!vistas.includes(vista)) setVista(vistas[0] || "Para ti");
  }, [vistas, vista]);

  const solicitudesFiltradas = useMemo(
    () => filtrar(solicitudesReales, filtroActivo, busqueda, vista, appUser),
    [solicitudesReales, filtroActivo, busqueda, vista, appUser],
  );

  const handleCancelar = async (solicitudId) => {
    const sol = solicitudes.find((s) => s.id === solicitudId);
    if (!sol) return;

    const estado = getEstadoSolicitud(sol);
    if (["aceptado", "en_proceso", "finalizado"].includes(estado)) {
      alert("Esta solicitud ya está activa y no puede eliminarse desde el feed.");
      return;
    }

    const esPropietario = appUser?.uid === sol.userId;
    if (!esPropietario && !esAdmin) {
      alert("No tienes permiso para eliminar esta solicitud.");
      return;
    }

    const urlsDeStorage = (sol.imageUrls || []).filter(
      (url) => typeof url === "string" && !url.startsWith("data:"),
    );

    if (urlsDeStorage.length > 0) {
      try {
        await eliminarImagenesSolicitud(urlsDeStorage);
      } catch (err) {
        console.error("[handleCancelar] Error al eliminar imágenes:", err);
        // No bloquea la eliminación de la solicitud aunque falle borrar imágenes
      }
    }

    await eliminarSolicitud(solicitudId);
  };

  const handleToggle = async (solicitudId, postulantesActuales) => {
    if (!esTrabajador) {
      alert("Solo los trabajadores pueden postularse a una solicitud.");
      return;
    }

    await togglePostulacion(solicitudId, postulantesActuales);

    if (modalSolicitud?.id === solicitudId) {
      const actualizado = solicitudes.find((s) => s.id === solicitudId);
      if (actualizado) setModalSolicitud(actualizado);
    }
  };

  const abrirModal = (solicitud) => {
    const actual = solicitudes.find((s) => s.id === solicitud.id) ?? solicitud;
    setModalSolicitud(actual);
  };

  // Fondos y bordes dinámicos de los contenedores
  const cardBg = theme === "dark" ? "#111118" : "#f4f4f5";
  const cardBorder = theme === "dark" ? "rgba(255,255,255,0.1)" : "#e4e4e7";

  if (loading) {
    return (
      <div 
        className="min-h-[calc(100vh-90px)] flex items-center justify-center text-slate-500 text-sm font-bold transition-colors"
        style={{ background: background[theme] }}
      >
        Cargando...
      </div>
    );
  }

  if (!appUser) return null;

  return (
    <div 
      className="flex min-h-[calc(100vh-90px)] transition-colors"
      style={{ background: background[theme], color: textColor[theme] }}
    >

      <main className="flex-1 px-6 py-8 lg:px-10">
        <section 
          className="mb-8 overflow-hidden rounded-[2rem] border p-7 shadow-2xl transition-colors"
          style={{ background: cardBg, borderColor: cardBorder }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>

              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                Feed de trabajos
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-relaxed text-slate-500">
                Explora solicitudes, revisa postulaciones y continúa proyectos activos.
              </p>
            </div>

            {(esCliente || esAdmin) && (
              <Link
                href="/NewRequest"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6c63ff] px-6 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-xl shadow-[#6c63ff]/20 transition hover:scale-[1.01]"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">+</span>
                Publicar solicitud
              </Link>
            )}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Publicadas" value={stats.publicadas} theme={theme} textColor={textColor} />
            <StatCard label="Postulaciones" value={stats.postuladas} tone="slate" theme={theme} textColor={textColor} />
            <StatCard label="En proceso" value={stats.enProceso} tone="amber" theme={theme} textColor={textColor} />
            <StatCard label="Finalizados" value={stats.finalizadas} tone="emerald" theme={theme} textColor={textColor} />
          </div>
        </section>

        {esCliente && (
          <div className="mb-5 rounded-2xl border border-[#6c63ff]/20 bg-[#6c63ff]/10 px-5 py-4 text-sm font-bold text-[#6c63ff]">
            Estás como cliente: puedes publicar solicitudes y gestionar postulantes.
          </div>
        )}

        <div 
          className="mb-5 flex gap-2 overflow-x-auto rounded-2xl border p-2 transition-colors"
          style={{ background: cardBg, borderColor: cardBorder }}
        >
          {vistas.map((item) => (
            <button
              key={item}
              onClick={() => setVista(item)}
              className={`min-w-fit flex-1 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition ${
                vista === item
                  ? "bg-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/20"
                  : theme === "dark"
                    ? "text-slate-500 hover:bg-white/5 hover:text-white"
                    : "text-slate-500 hover:bg-black/5 hover:text-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <FiltrosTags
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroActivo={filtroActivo}
          setFiltroActivo={setFiltroActivo}
        />

        <p className="mb-4 mt-4 text-sm font-bold text-slate-500">
          Mostrando <span className="font-black" style={{ color: textColor[theme] }}>{solicitudesFiltradas.length} solicitudes</span> en {vista.toLowerCase()}
        </p>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-400">
            Error al cargar solicitudes: {error}
          </div>
        )}

        {loadingSolicitudes && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-56 animate-pulse rounded-[2rem] border transition-colors" 
                style={{ background: cardBg, borderColor: cardBorder }}
              />
            ))}
          </div>
        )}

        {!loadingSolicitudes && solicitudesFiltradas.length === 0 && (
          <div 
            className="rounded-[2rem] border p-16 text-center transition-colors"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <p className="text-lg font-black">No se encontraron solicitudes</p>
            <p className="mt-2 text-sm font-bold text-slate-500">
              Intenta cambiar filtros o publicar una nueva solicitud.
            </p>
          </div>
        )}

        {!loadingSolicitudes && (
          <div className="space-y-5">
            {solicitudesFiltradas.map((sol) => (
              <SolicitudCard
                key={sol.id}
                solicitud={sol}
                ownerInfo={usuariosInfo[sol.userId]}
                currentUserId={appUser.uid}
                currentUserRole={appUser?.rol}
                estaPostulado={estaPostulado}
                onToggle={handleToggle}
                loading={loadingId === sol.id}
                onVerDetalle={abrirModal}
                onCancelar={handleCancelar}
              />
            ))}
          </div>
        )}
      </main>

      <SolicitudModal
        solicitud={modalSolicitud}
        ownerInfo={modalSolicitud ? usuariosInfo[modalSolicitud.userId] : null}
        onClose={() => setModalSolicitud(null)}
        currentUserId={appUser.uid}
        currentUserRole={appUser?.rol}
        estaPostulado={estaPostulado}
        onToggle={handleToggle}
        loading={loadingId === modalSolicitud?.id}
        onCancelar={handleCancelar}
      />
    </div>
  );
}