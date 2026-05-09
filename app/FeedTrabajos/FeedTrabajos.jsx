"use client";
import { useState, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useSolicitudes } from "./Hooks/useSolicitudes";
import { usePostulacion } from "./Hooks/usePostulacion";
import FeedSidebar from "@/components/Feed/FeedSidebar";
import FiltrosTags from "@/components/Feed/FiltrosTags";
import SolicitudCard from "@/components/Feed/SolicitudCard";
import SolicitudModal from "@/components/Feed/SolicitudModal";

const s = {
  layout: { display: "flex", backgroundColor: "#0a0a0f", minHeight: "calc(100vh - 90px)" },
  main: { flex: 1, padding: "30px 36px" },
  title: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800,
    fontSize: "28px",
    color: "#fff",
    marginBottom: "4px",
  },
  subtitle: { color: "#888", fontSize: "14px", marginBottom: "20px" },
  count: { color: "#666", fontSize: "13px", marginBottom: "16px" },
  countBold: { color: "#fff", fontWeight: 600 },
  emptyState: { textAlign: "center", padding: "60px 20px", color: "#555" },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyText: { fontSize: "16px", color: "#666", marginBottom: "6px" },
  emptySubtext: { fontSize: "13px", color: "#444" },
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
};

function filtrarSolicitudes(solicitudes, filtroActivo, busqueda) {
  return solicitudes.filter((sol) => {
    const coincideFiltro =
      filtroActivo === "Todos" ||
      filtroActivo === "Alta valoración" ||
      (filtroActivo === "SJL" && sol.distrito === "SJL") ||
      sol.tags?.some((t) => t === filtroActivo);

    const q = busqueda.toLowerCase();
    const coincideBusqueda =
      busqueda === "" ||
      sol.titulo?.toLowerCase().includes(q) ||
      sol.descripcion?.toLowerCase().includes(q) ||
      sol.tags?.some((t) => t.toLowerCase().includes(q));

    return coincideFiltro && coincideBusqueda;
  });
}

export default function FeedTrabajos() {
  const [user] = useAuthState(auth);

  const { solicitudes, loading, error } = useSolicitudes();
  const { estaPostulado, togglePostulacion, loadingId } = usePostulacion(user?.uid);

  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [solicitudModal, setSolicitudModal] = useState(null); // solicitud seleccionada

  const solicitudesFiltradas = useMemo(
    () => filtrarSolicitudes(solicitudes, filtroActivo, busqueda),
    [solicitudes, filtroActivo, busqueda]
  );

  return (
    <div style={s.layout}>
      <FeedSidebar />

      <main style={s.main}>
        <h1 style={s.title}>Feed de trabajos</h1>
        <p style={s.subtitle}>Encuentra solicitudes que coincidan con tus habilidades</p>

        {/* Banner de login si el usuario no está autenticado */}
        {!user && (
          <div style={s.loginBanner}>
            <span>Inicia sesión para postularte a los trabajos</span>
            <a href="/login" style={{ color: "#a78bfa", fontWeight: 600 }}>
              Ingresar →
            </a>
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
          <span style={s.countBold}>{solicitudesFiltradas.length} solicitudes</span> cerca de ti
        </p>

        {error && (
          <div style={s.errorBox}>
            Error al cargar solicitudes: {error}
          </div>
        )}

        {loading && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} style={s.skeleton} />
            ))}
          </>
        )}

        {!loading && solicitudesFiltradas.length === 0 && (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>🔍</div>
            <p style={s.emptyText}>No se encontraron solicitudes</p>
            <p style={s.emptySubtext}>Intenta con otro filtro o término de búsqueda</p>
          </div>
        )}

        {!loading &&
          solicitudesFiltradas.map((sol) => (
            <SolicitudCard
              key={sol.id}
              solicitud={sol}
              estaPostulado={estaPostulado}
              onToggle={togglePostulacion}
              loading={loadingId === sol.id}
              onVerDetalle={setSolicitudModal}
            />
          ))}
      </main>

      <SolicitudModal
        solicitud={solicitudModal}
        onClose={() => setSolicitudModal(null)}
        estaPostulado={estaPostulado}
        onToggle={async (...args) => {
          await togglePostulacion(...args);
        }}
        loading={loadingId === solicitudModal?.id}
      />
    </div>
  );
}