"use client";

import { useState, useMemo, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useUserRole } from "@/app/hooks/useUserRole";
import { useSolicitudes } from "@/app/hooks/useSolicitudes";
import { usePostulacion } from "@/app/hooks/usePostulacion";
import FeedSidebar from "@/components/Feed/FeedSidebar";
import FiltrosTags from "@/components/Feed/FiltrosTags";
import SolicitudCard from "@/components/Feed/SolicitudCard";
import SolicitudModal from "@/components/Feed/SolicitudModal";
import Link from "next/link";

const UMBRAL_ALTA_VALORACION = 4;

function filtrar(solicitudes, filtroActivo, busqueda, esTrabajador, ambitosTrabajador = []) {
  if (!solicitudes) return [];
  return solicitudes.filter((sol) => {
    let filtroOk = true;
    if (filtroActivo === "Alta valoración") {
      filtroOk = (sol.postulantes?.length ?? 0) >= UMBRAL_ALTA_VALORACION;
    } else if (filtroActivo === "SJL") {
      filtroOk = sol.distrito === "San Juan de Lurigancho";
    } else if (filtroActivo !== "Todos") {
      filtroOk = sol.tags?.some((t) => t === filtroActivo);
    }

    const q = busqueda.toLowerCase();
    const busquedaOk =
      busqueda === "" ||
      (sol.titulo || "").toLowerCase().includes(q) ||
      (sol.descripcion || "").toLowerCase().includes(q) ||
      sol.tags?.some((t) => t.toLowerCase().includes(q));

    let ambitosOk = true;
    if (esTrabajador && ambitosTrabajador.length > 0) {
      ambitosOk = sol.tags?.some((tag) => ambitosTrabajador.includes(tag));
    }

    return filtroOk && busquedaOk && ambitosOk;
  });
}

export default function FeedPage() {
  const [user] = useAuthState(auth);
  const { rol, perfil } = useUserRole();
  const { solicitudes, loading, error } = useSolicitudes(
    rol === "cliente" ? user?.uid : undefined
  );
  const { estaPostulado, togglePostulacion, puedePostularse, loadingId } = usePostulacion(
    user?.uid,
    rol
  );

  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [modalSolicitudId, setModalSolicitudId] = useState(null);
  const ambitosTrabajador = useMemo(
    () => (rol === "trabajador" ? perfil?.ambitos || [] : []),
    [rol, perfil?.ambitos]
  );

  const solicitudesFiltradas = useMemo(() => {
    return filtrar(
      solicitudes,
      filtroActivo,
      busqueda,
      rol === "trabajador",
      ambitosTrabajador
    );
  }, [solicitudes, filtroActivo, busqueda, rol, ambitosTrabajador]);

  const modalSolicitud = useMemo(() => {
    if (!modalSolicitudId) return null;
    return solicitudes?.find((s) => s.id === modalSolicitudId) || null;
  }, [solicitudes, modalSolicitudId]);

  const puedePublicar = user && rol === "cliente";
  const handleToggle = useCallback(
    async (id, postulantes, propietarioId) => {
      await togglePostulacion(id, postulantes, propietarioId);
    },
    [togglePostulacion]
  );

  const handleCancelar = useCallback(async (id) => {
    if (confirm("¿Cancelar esta solicitud? Esta acción es permanente.")) {
      // Implementar cancelación si es necesario
    }
  }, []);

  if (loading && !solicitudes) {
    return (
      <div
        className="flex min-h-[calc(100vh-90px)] items-center justify-center"
        style={{ background: "var(--bg-main)" }}
      >
        <div style={{ color: "var(--text-main)" }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[calc(100vh-90px)]"
      style={{ background: "var(--bg-main)", color: "var(--text-main)" }}
    >
      <FeedSidebar />

      <main className="flex-1 p-4 md:p-10">
        <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
          <div>
            <h1 className="font-syne font-extrabold text-3xl">
              {rol === "cliente" ? "Mis solicitudes" : "Feed de trabajos"}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {rol === "trabajador"
                ? "Encuentra solicitudes que coincidan con tus ámbitos"
                : "Publica tu solicitud y recibe postulantes"}
            </p>
          </div>

          {puedePublicar && (
            <Link
              href="/NewRequest"
              className="btn-primary inline-flex items-center gap-2"
            >
              <span className="text-lg">+</span> Publicar solicitud
            </Link>
          )}
        </div>

        {!user && (
          <div
            className="rounded-lg p-3 mb-4 text-sm flex justify-between"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--accent)",
              color: "var(--accent)",
            }}
          >
            <span>Inicia sesión para postularte o publicar trabajos</span>
            <a href="/login" className="font-bold" style={{ color: "var(--accent)" }}>
              Ingresar →
            </a>
          </div>
        )}

        {user && rol === "trabajador" && (
          <div
            className="rounded-lg p-3 mb-4 text-sm"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--success)",
              color: "var(--success)",
            }}
          >
            ✓ Estás viendo el feed como <strong>trabajador</strong>.
            {ambitosTrabajador.length === 0 && (
              <span>
                {" "}
                Para ver solicitudes relevantes, actualiza tus{" "}
                <Link href="/profile/edit" className="underline">
                  ámbitos
                </Link>
                .
              </span>
            )}
          </div>
        )}

        <FiltrosTags
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroActivo={filtroActivo}
          setFiltroActivo={setFiltroActivo}
        />

        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Mostrando{" "}
          <span className="font-semibold" style={{ color: "var(--text-main)" }}>
            {solicitudesFiltradas.length} solicitudes
          </span>{" "}
          {rol === "cliente" ? "publicadas" : "cerca de ti"}
        </p>

        {error && (
          <div
            className="rounded-lg p-3 mb-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--error)",
              color: "var(--error)",
            }}
          >
            Error: {error}
          </div>
        )}

        {loading ? (
          <div role="status" aria-label="Cargando solicitudes...">
            <span className="sr-only">Cargando solicitudes...</span>
            {Array(3)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-xl mb-3 animate-pulse"
                  style={{ background: "var(--bg-card)" }}
                  aria-hidden="true"
                />
              ))}
          </div>
        ) : solicitudesFiltradas.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: "var(--text-secondary)" }}>
              No se encontraron solicitudes
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {rol === "trabajador" && ambitosTrabajador.length === 0
                ? "Actualiza tu perfil con tus ámbitos para ver solicitudes relevantes."
                : "Intenta con otro filtro o término de búsqueda"}
            </p>
            {!busqueda && filtroActivo === "Todos" && (
              <>
                {puedePublicar ? (
                  <Link
                    href="/NewRequest"
                    className="btn-primary inline-block mt-4"
                  >
                    + Publicar primera solicitud
                  </Link>
                ) : (
                  <p className="text-sm mt-4" style={{ color: "var(--text-muted)" }}>
                    {user
                      ? "No hay solicitudes disponibles."
                      : "Inicia sesión para publicar una solicitud."}
                  </p>
                )}
              </>
            )}
          </div>
        ) : (
          solicitudesFiltradas.map((sol) => (
            <SolicitudCard
              key={sol.id}
              solicitud={sol}
              currentUserId={user?.uid}
              currentUserRole={rol}
              estaPostulado={estaPostulado}
              puedePostularse={puedePostularse}
              onToggle={handleToggle}
              loading={loadingId === sol.id}
              onVerDetalle={(sol) => setModalSolicitudId(sol.id)}
              onCancelar={handleCancelar}
            />
          ))
        )}

        {modalSolicitud && (
          <SolicitudModal
            solicitud={modalSolicitud}
            onClose={() => setModalSolicitudId(null)}
            estaPostulado={estaPostulado}
            puedePostularse={puedePostularse}
            onToggle={handleToggle}
            loading={loadingId === modalSolicitud.id}
            onCancelar={handleCancelar}
          />
        )}
      </main>
    </div>
  );
}