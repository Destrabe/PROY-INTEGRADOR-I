"use client";

import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useUserRole } from "@/app/Hooks/useUserRole";
import { useSolicitudes } from "@/app/Hooks/useSolicitudes";
import { usePostulacion } from "@/app/Hooks/usePostulacion";
import FeedSidebar from "@/components/Feed/FeedSidebar";
import FiltrosTags from "@/components/Feed/FiltrosTags";
import SolicitudCard from "@/components/Feed/SolicitudCard";
import SolicitudModal from "@/components/Feed/SolicitudModal";
import Link from "next/link";

const UMBRAL_ALTA_VALORACION = 4;

function filtrar(solicitudes, filtroActivo, busqueda) {
  return solicitudes.filter((sol) => {
    const filtroOk =
      filtroActivo === "Todos" ||
      (filtroActivo === "Alta valoración" && (sol.postulantes?.length ?? 0) >= UMBRAL_ALTA_VALORACION) ||
      (filtroActivo === "SJL" && sol.distrito === "San Juan de Lurigancho") ||
      sol.tags?.some((t) => t === filtroActivo);
    const q = busqueda.toLowerCase();
    const busquedaOk = busqueda === "" || sol.titulo?.toLowerCase().includes(q) || sol.descripcion?.toLowerCase().includes(q) || sol.tags?.some((t) => t.toLowerCase().includes(q));
    return filtroOk && busquedaOk;
  });
}

export default function FeedTrabajos() {
  const [user] = useAuthState(auth);
  const { rol } = useUserRole();
  const { solicitudes, loading, error } = useSolicitudes(rol === "cliente" ? user?.uid : undefined);
  const { estaPostulado, togglePostulacion, puedePostularse, loadingId } = usePostulacion(user?.uid, rol);

  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [modalSolicitud, setModalSolicitud] = useState(null);

  const solicitudesFiltradas = filtrar(solicitudes, filtroActivo, busqueda);
  const currentUserName = user?.displayName || user?.email?.split("@")[0] || "Usuario";

  const handleToggle = async (id, postulantes, propietarioId) => {
    await togglePostulacion(id, postulantes, propietarioId);
    // Actualizar modal si está abierto
    if (modalSolicitud?.id === id) {
      const actualizada = solicitudes.find(s => s.id === id);
      setModalSolicitud(actualizada);
    }
  };

  const handleCancelar = async (id) => {
    // Implementar cancelación de solicitud propia
    if (confirm("¿Cancelar esta solicitud? Esta acción es permanente.")) {
      // Llamar a función de Firebase (pendiente)
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-90px)] bg-[#0A0A0F] text-white">
      <FeedSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
          <div>
            <h1 className="font-syne font-extrabold text-3xl">Feed de trabajos</h1>
            <p className="text-[#888] text-sm">
              {rol === "trabajador" ? "Encuentra solicitudes que coincidan con tus habilidades" : "Publica tu solicitud y recibe postulantes"}
            </p>
          </div>
          <Link href={user ? "/NewRequest" : "/login"} className="inline-flex items-center gap-2 bg-[#500fe9] text-white rounded-lg px-4 py-2 text-sm font-bold">
            <span className="text-lg">+</span> Publicar solicitud
          </Link>
        </div>

        {!user && (
          <div className="bg-[#1e1a3a] border border-[#4a3aaa] rounded-lg p-3 mb-4 text-sm text-[#a78bfa] flex justify-between">
            <span>Inicia sesión para postularte o publicar trabajos</span>
            <a href="/login" className="font-bold">Ingresar →</a>
          </div>
        )}

        {user && rol === "trabajador" && (
          <div className="bg-[#0f2d1a] border border-[#166534] rounded-lg p-3 mb-4 text-sm text-[#4ade80]">
            ✓ Estás viendo el feed como <strong>trabajador</strong>. Puedes postularte a las solicitudes.
          </div>
        )}

        <FiltrosTags busqueda={busqueda} setBusqueda={setBusqueda} filtroActivo={filtroActivo} setFiltroActivo={setFiltroActivo} />
        <p className="text-[#666] text-sm mb-4">Mostrando <span className="text-white font-semibold">{solicitudesFiltradas.length} solicitudes</span> cerca de ti</p>

        {error && <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 mb-4">Error: {error}</div>}

        {loading ? (
          Array(3).fill().map((_, i) => <div key={i} className="bg-[#1a1a2e] h-40 rounded-xl mb-3 animate-pulse" />)
        ) : solicitudesFiltradas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#666]">No se encontraron solicitudes</p>
            <p className="text-[#444] text-sm">Intenta con otro filtro o término de búsqueda</p>
            {(!busqueda && filtroActivo === "Todos") && (
              <Link href={user ? "/NewRequest" : "/login"} className="inline-block mt-4 bg-[#500fe9] text-white rounded-lg px-5 py-2 text-sm">
                + Publicar primera solicitud
              </Link>
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
              onVerDetalle={setModalSolicitud}
              onCancelar={handleCancelar}
            />
          ))
        )}

        {modalSolicitud && (
          <SolicitudModal
            solicitud={modalSolicitud}
            onClose={() => setModalSolicitud(null)}
            currentUserId={user?.uid}
            currentUserNombre={currentUserName}
            rolUsuario={rol}
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