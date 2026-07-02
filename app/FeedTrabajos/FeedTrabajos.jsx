"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
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
  layout: {
    display: "flex",
    backgroundColor: "#0a0a0f",
    minHeight: "calc(100vh - 90px)",
  },
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
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.18)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  subtitle: { color: "#888", fontSize: "14px", marginBottom: "20px" },
  count: { color: "#666", fontSize: "13px", marginBottom: "16px" },
  countBold: { color: "#fff", fontWeight: 600 },

  emptyState: { textAlign: "center", padding: "60px 20px" },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyText: { fontSize: "16px", color: "#666", marginBottom: "6px" },
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
  loadingPage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 90px)",
    color: "#888",
    fontSize: "14px",
  },
  restrictedBanner: {
    backgroundColor: "#1e1a3a",
    border: "1px solid #4a3aaa",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#a78bfa",
    fontSize: "13px",
    marginBottom: "16px",
  },
};

function filtrar(solicitudes, filtroActivo, busqueda) {
  return solicitudes.filter((sol) => {
    const filtroOk =
      filtroActivo === "Todos" ||
      filtroActivo === "Alta valoración" ||
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
  const { user: appUser, loading } = useAuth();
  const router = useRouter();

  // Explorar requiere sesión iniciada: si no hay usuario, se redirige a login
  useEffect(() => {
    if (!loading && !appUser) {
      router.push("/login");
    }
  }, [loading, appUser, router]);

  const esTrabajador = appUser?.rol === "trabajador";
  const esCliente = appUser?.rol === "cliente";

  const { solicitudes, loading: loadingSolicitudes, error } = useSolicitudes();
  const { estaPostulado, togglePostulacion, loadingId } = usePostulacion(
    appUser?.uid,
  );

  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [modalSolicitud, setModalSolicitud] = useState(null);

  const solicitudesFiltradas = useMemo(
    () => filtrar(solicitudes, filtroActivo, busqueda),
    [solicitudes, filtroActivo, busqueda],
  );

  const esAdmin = appUser?.rol === "admin";

  const handleCancelar = async (solicitudId) => {
    const sol = solicitudes.find((s) => s.id === solicitudId);
    if (!sol) return;

    const esPropietario = appUser?.uid === sol.userId;
    if (!esPropietario && !esAdmin) {
      alert("No tienes permiso para eliminar esta solicitud.");
      return;
    }

    if (sol.imageUrls?.length > 0) {
      await eliminarImagenesSolicitud(sol.imageUrls);
    }

    const result = await eliminarSolicitud(solicitudId);
  };

  const handleToggle = async (solicitudId, postulantesActuales) => {
    // Solo los usuarios con rol "trabajador" pueden postularse
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

  // Mientras se resuelve la sesión, o si aún no hay usuario (a punto de redirigir), no mostramos nada
  if (loading) {
    return <div style={s.loadingPage}>Cargando...</div>;
  }

  if (!appUser) {
    return null;
  }

  return (
    <div style={s.layout}>
      <FeedSidebar />

      <main style={s.main}>
        <div style={s.headerRow}>
          <div>
            <h1 style={s.title}>Feed de trabajos</h1>
            <p style={s.subtitle}>
              Encuentra solicitudes que coincidan con tus habilidades
            </p>
          </div>
          <Link href="/NewRequest" style={s.publishBtn}>
            <span style={s.publishBtnPlus}>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#fff" }}
              >
                <path d="M12 5V19" />
                <path d="M5 12H19" />
              </svg>
            </span>
            <span style={{ fontWeight: 700 }}>Publicar solicitud</span>
          </Link>
        </div>

        {esCliente && (
          <div style={s.restrictedBanner}>
            Estás registrado como cliente: puedes publicar solicitudes, pero
            no postularte a trabajos.
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
          <span style={s.countBold}>
            {solicitudesFiltradas.length} solicitudes
          </span>{" "}
          cerca de ti
        </p>

        {error && (
          <div style={s.errorBox}>Error al cargar solicitudes: {error}</div>
        )}

        {loadingSolicitudes &&
          [1, 2, 3].map((i) => <div key={i} style={s.skeleton} />)}

        {!loadingSolicitudes && solicitudesFiltradas.length === 0 && (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>🔍</div>
            <p style={s.emptyText}>No se encontraron solicitudes</p>
            <p style={s.emptySubtext}>
              {busqueda || filtroActivo !== "Todos"
                ? "Intenta con otro filtro o término de búsqueda"
                : "Sé el primero en publicar una solicitud en tu zona"}
            </p>
            {!busqueda && filtroActivo === "Todos" && (
              <Link href="/NewRequest" style={s.emptyBtn}>
                + Publicar la primera solicitud
              </Link>
            )}
          </div>
        )}

        {!loadingSolicitudes &&
          solicitudesFiltradas.map((sol) => (
            <SolicitudCard
              key={sol.id}
              solicitud={sol}
              currentUserId={appUser.uid}
              currentUserRole={appUser?.rol}
              estaPostulado={estaPostulado}
              onToggle={handleToggle}
              loading={loadingId === sol.id}
              onVerDetalle={abrirModal}
              onCancelar={handleCancelar}
            />
          ))}
      </main>

      <SolicitudModal
        solicitud={modalSolicitud}
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