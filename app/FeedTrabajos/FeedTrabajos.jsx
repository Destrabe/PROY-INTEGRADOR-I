"use client";
import { useState, useMemo } from "react";
import { useUserRole } from "@/app/Hooks/useUserRole";
import { useSolicitudes } from "./Hooks/useSolicitudes";
import { usePostulacion } from "./Hooks/usePostulacion";
import { eliminarSolicitud } from "@/firebase/Solicitudes";
import { eliminarImagenesSolicitud } from "@/firebase/Storage";
import FeedSidebar from "@/components/Feed/FeedSidebar";
import FiltrosTags from "@/components/Feed/FiltrosTags";
import SolicitudCard from "@/components/Feed/SolicitudCard";
import SolicitudModal from "@/components/Feed/SolicitudModal";
import Link from "next/link";

const s = {
  layout: { display: "flex", backgroundColor: "#0a0a0f", minHeight: "calc(100vh - 90px)" },
  main: { flex: 1, padding: "30px 36px" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "4px",
  },
  title: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800,
    fontSize: "28px",
    color: "#fff",
    margin: 0,
  },
  publishBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#500fe9",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
    textDecoration: "none",
    flexShrink: 0,
  },
  publishBtnPlus: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    lineHeight: 1,
  },
  subtitle:  { color: "#888", fontSize: "14px", marginBottom: "20px" },
  count:     { color: "#666", fontSize: "13px", marginBottom: "16px" },
  countBold: { color: "#fff", fontWeight: 600 },
  emptyState:   { textAlign: "center", padding: "60px 20px" },
  emptyIcon:    { fontSize: "40px", marginBottom: "12px" },
  emptyText:    { fontSize: "16px", color: "#666", marginBottom: "6px" },
  emptySubtext: { fontSize: "13px", color: "#444", marginBottom: "24px" },
  emptyBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#500fe9",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
    textDecoration: "none",
  },
  skeleton: {
    backgroundColor: "#1a1a2e",
    borderRadius: "14px",
    height: "180px",
    marginBottom: "14px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  errorBox: {
    backgroundColor: "#2d0a0a",
    border: "1px solid #5a1a1a",
    borderRadius: "10px",
    padding: "16px",
    color: "#f87171",
    fontSize: "14px",
    marginBottom: "16px",
  },
  loginBanner: {
    backgroundColor: "#1e1a3a",
    border: "1px solid #4a3aaa",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#a78bfa",
    fontSize: "13px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  roleBanner: {
    backgroundColor: "#0f2d1a",
    border: "1px solid #166534",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#4ade80",
    fontSize: "13px",
    marginBottom: "16px",
  },
};

const UMBRAL_ALTA_VALORACION = 4;

function filtrar(solicitudes, filtroActivo, busqueda) {
  return solicitudes.filter((sol) => {
    const filtroOk =
      filtroActivo === "Todos" ||
      (filtroActivo === "Alta valoración" &&
        (sol.postulantes?.length ?? 0) >= UMBRAL_ALTA_VALORACION) ||
      (filtroActivo === "SJL" && sol.distrito === "San Juan de Lurigancho") ||
      sol.tags?.some((t) => t === filtroActivo);

    const q = busqueda.toLowerCase();
    const busquedaOk =
      busqueda === "" ||
      sol.titulo?.toLowerCase().includes(q) ||
      sol.descripcion?.toLowerCase().includes(q) ||
      sol.tags?.some((t) => t.toLowerCase().includes(q));

    return filtroOk && busquedaOk;
  });
}

export default function FeedTrabajos() {
  const { user, rol, perfil, loadingAuth, loadingRol } = useUserRole();
  //const uidParaFeed = rol === "cliente" ? user?.uid : undefined;
  const uidParaFeed = rol === "trabajador" ? undefined : user?.uid;
  const { solicitudes, loading, error } = useSolicitudes(uidParaFeed);

  const { estaPostulado, togglePostulacion, puedePostularse, loadingId } =
    usePostulacion(user?.uid, rol);

  const [filtroActivo,   setFiltroActivo]   = useState("Todos");
  const [busqueda,       setBusqueda]       = useState("");
  const [modalSolicitud, setModalSolicitud] = useState(null);

  const solicitudesFiltradas = useMemo(
    () => filtrar(solicitudes, filtroActivo, busqueda),
    [solicitudes, filtroActivo, busqueda]
  );

  const handleCancelar = async (solicitudId) => {
    const sol = solicitudes.find((s) => s.id === solicitudId);
    if (sol?.imageUrls?.length > 0) {
      await eliminarImagenesSolicitud(sol.imageUrls);
    }
    await eliminarSolicitud(solicitudId);
  };

  const handleToggle = async (solicitudId, postulantesActuales, propietarioId) => {
    await togglePostulacion(solicitudId, postulantesActuales, propietarioId);
    if (modalSolicitud?.id === solicitudId) {
      const actualizado = solicitudes.find((s) => s.id === solicitudId);
      if (actualizado) setModalSolicitud(actualizado);
    }
  };

  const abrirModal = (solicitud) => {
    const actual = solicitudes.find((s) => s.id === solicitud.id) ?? solicitud;
    setModalSolicitud(actual);
  };

  const solicitudModalActualizada = modalSolicitud
    ? (solicitudes.find((s) => s.id === modalSolicitud.id) ?? modalSolicitud)
    : null;

  const currentUserNombre = perfil?.first_name
    ? `${perfil.first_name} ${perfil.last_name}`.trim()
    : user?.displayName || user?.email || "Usuario";

  const mostrarPublicar = !user || rol === "cliente";

  return (
    <div style={s.layout}>
      <FeedSidebar />

      <main style={s.main}>
        <div style={s.headerRow}>
          <div>
            <h1 style={s.title}>Feed de trabajos</h1>
            <p style={s.subtitle}>
              {rol === "trabajador"
                ? "Encuentra solicitudes que coincidan con tus habilidades"
                : "Publica tu solicitud y recibe postulantes"}
            </p>
          </div>
          {mostrarPublicar && (
            <Link
              href={user ? "/NewRequest" : "/login"}
              style={s.publishBtn}
            >
              <span style={s.publishBtnPlus}>+</span>
              Publicar solicitud
            </Link>
          )}
        </div>

        {/* Usuarios sin sesión */}
        {!user && (
          <div style={s.loginBanner}>
            <span>Inicia sesión para postularte o publicar trabajos</span>
            <a href="/login" style={{ color: "#a78bfa", fontWeight: 600 }}>
              Ingresar →
            </a>
          </div>
        )}

        {/* Banner de rol para trabajadores */}
        {user && rol === "trabajador" && (
          <div style={s.roleBanner}>
            ✓ Estás viendo el feed como <strong>trabajador</strong>. Puedes
            postularte a las solicitudes que te interesen.
          </div>
        )}

        <FiltrosTags
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroActivo={filtroActivo}
          setFiltroActivo={setFiltroActivo}
        />

        <p style={s.count}>
          Mostrando{" "}
          <span style={s.countBold}>{solicitudesFiltradas.length} solicitudes</span>{" "}
          cerca de ti
        </p>

        {error && (
          <div style={s.errorBox}>Error al cargar solicitudes: {error}</div>
        )}

        {loading && [1, 2, 3].map((i) => <div key={i} style={s.skeleton} />)}

        {!loading && solicitudesFiltradas.length === 0 && (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}></div>
            <p style={s.emptyText}>No hay solicitudes que coincidan</p>
            <p style={s.emptySubtext}>Intenta cambiar los filtros o la búsqueda</p>
            {mostrarPublicar && (
              <Link
                href={user ? "/NewRequest" : "/login"}
                style={s.emptyBtn}
              >
                <span>+</span> Publicar solicitud
              </Link>
            )}
          </div>
        )}

        {solicitudesFiltradas.map((sol) => {
          const solicitudActual = solicitudes.find((s) => s.id === sol.id) ?? sol;
          return (
            <SolicitudCard
              key={sol.id}
              solicitud={solicitudActual}
              currentUserId={user?.uid ?? null}
              rolUsuario={rol}
              estaPostulado={estaPostulado}
              puedePostularse={puedePostularse}
              onToggle={handleToggle}
              loading={loadingId === sol.id}
              onVerDetalle={abrirModal}
              onCancelar={handleCancelar}
            />
          );
        })}
      </main>

      {solicitudModalActualizada && (
        <SolicitudModal
          solicitud={solicitudModalActualizada}
          onClose={() => setModalSolicitud(null)}
          currentUserId={user?.uid ?? null}
          currentUserNombre={currentUserNombre}
          rolUsuario={rol}
          estaPostulado={estaPostulado}
          puedePostularse={puedePostularse}
          onToggle={handleToggle}
          loading={loadingId === solicitudModalActualizada.id}
          onCancelar={async (id) => {
            await handleCancelar(id);
            setModalSolicitud(null);
          }}
        />
      )}
    </div>
  );
}