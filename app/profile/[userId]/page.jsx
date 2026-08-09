"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { obtenerReseñasDeTrabajador } from "@/firebase/Reviews";
import { obtenerMisPostulaciones } from "@/firebase/Solicitudes";
import { obtenerOCrearConversacion } from "@/firebase/messages";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/db";
import Link from "next/link";
import Image from "next/image";
import { Stars, RepBar } from "@/components/profile/profileStats";
import { formatSeniority } from "../utils/formatSeniority";
import { calculateRevStats } from "../utils/calculateRevStats";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const targetId = params?.userId;
  const [loggedUser, loadingAuth] = useAuthState(auth);
  const { perfil, loading: loadingPerfil, error: perfilError } = useUserProfile(targetId);

  // Estados
  const [activeTab, setActiveTab] = useState("trabajos");
  const [solicitudes, setSolicitudes] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [reseñas, setReseñas] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [contactando, setContactando] = useState(false);
  const [contratando, setContratando] = useState(false);
  const [trabajosCompletados, setTrabajosCompletados] = useState(0);
  const [loadingCompletados, setLoadingCompletados] = useState(true);

  const esMiPerfil = loggedUser?.uid === targetId;

  // Cargar contenido según rol del perfil visitado
  useEffect(() => {
    if (!targetId || !perfil?.rol) return;
    setLoadingContent(true);
    if (perfil.rol === "cliente") {
      import("@/firebase/Solicitudes").then(({ obtenerSolicitudesDeUsuario }) => {
        obtenerSolicitudesDeUsuario(targetId).then(res => {
          if (res.success) {
            setSolicitudes(res.data);
          }
          setLoadingContent(false);
        });
      });
    } else if (perfil.rol === "trabajador") {
      Promise.all([
        obtenerMisPostulaciones(targetId),
        obtenerReseñasDeTrabajador(targetId)
      ]).then(([postulacionesRes, reseñasRes]) => {
        if (postulacionesRes.success) {
          setPostulaciones(postulacionesRes.data);
        }
        if (reseñasRes.success) {
          setReseñas(reseñasRes.data);
        }
        setLoadingContent(false);
      });
    } else {
      setLoadingContent(false);
    }
  }, [targetId, perfil?.rol]);

  // Contar trabajos completados (cliente o trabajador)
  useEffect(() => {
    if (!targetId || !perfil?.rol) return;
    const fetchCompletados = async () => {
      setLoadingCompletados(true);
      try {
        let q;
        if (perfil.rol === "cliente") {
          q = query(
            collection(db, "solicitudes"),
            where("userId", "==", targetId),
            where("estado", "==", "completada")
          );
        } else if (perfil.rol === "trabajador") {
          q = query(
            collection(db, "solicitudes"),
            where("trabajadorId", "==", targetId),
            where("estado", "==", "completada")
          );
        } else {
          setTrabajosCompletados(0);
          setLoadingCompletados(false);
          return;
        }
        const snap = await getDocs(q);
        setTrabajosCompletados(snap.size);
      } catch (error) {
        console.error("Error al contar trabajos completados:", error);
        setTrabajosCompletados(0);
      } finally {
        setLoadingCompletados(false);
      }
    };
    fetchCompletados();
  }, [targetId, perfil?.rol]);

  const avatarUrl = perfil?.avatarUrl;
  const esTrabajadorVisto = perfil?.rol === "trabajador";
  const totalTrabajos = trabajosCompletados;
  const valoracionPromedio = perfil?.valoracionPromedio || 0;
  const tarifaEstandar = perfil?.tarifaEstandar || 0;
  const totalReseñas = reseñas.length;

  const nombreCompleto = useMemo(
    () => `${perfil?.first_name ?? ""} ${perfil?.last_name ?? ""}`.trim() || perfil?.email || "Usuario",
    [perfil?.first_name, perfil?.last_name, perfil?.email]
  );

  const iniciales = useMemo(
    () =>
      perfil?.iniciales ||
      `${perfil?.first_name?.[0] ?? ""}${perfil?.last_name?.[0] ?? ""}`.toUpperCase() ||
      perfil?.email?.[0]?.toUpperCase() ||
      "?",
    [perfil?.iniciales, perfil?.first_name, perfil?.last_name, perfil?.email]
  );

  const antiguedadTexto = useMemo(
    () => formatSeniority(perfil?.creadoEn),
    [perfil?.creadoEn]
  );

  const { avgCalidad, avgComunicacion, avgPuntualidad, avgPrecio } = useMemo(
    () => calculateRevStats(reseñas),
    [reseñas]
  );

  const listaTrabajos = esTrabajadorVisto ? postulaciones : solicitudes;

  const handleContactar = async () => {
    if (!loggedUser) {
      router.push("/login");
      return;
    }
    setContactando(true);
    try {
      const miNombre = loggedUser.displayName || loggedUser.email?.split("@")[0] || "Usuario";
      const suNombre = nombreCompleto;
      const convId = await obtenerOCrearConversacion(
        loggedUser.uid,
        targetId,
        null,
        null,
        { [loggedUser.uid]: miNombre, [targetId]: suNombre }
      );
      router.push(`/messages?conv=${convId}`);
    } catch (err) {
      console.error(err);
      alert("No se pudo iniciar el chat.");
    } finally {
      setContactando(false);
    }
  };

  const handleContratar = async () => {
    if (!loggedUser) {
      router.push("/login");
      return;
    }
    if (loggedUser.uid === targetId) {
      alert("No puedes contratarte a ti mismo.");
      return;
    }
    setContratando(true);
    try {
      alert("Funcionalidad de contratación: se abrirá un chat para coordinar el trabajo.");
      const convId = await obtenerOCrearConversacion(loggedUser.uid, targetId);
      router.push(`/messages?conv=${convId}`);
    } catch (err) {
      console.error(err);
      alert("Error al intentar contactar.");
    } finally {
      setContratando(false);
    }
  };

  if (!loadingPerfil && !perfil?.rol && !perfilError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--bg-main)] text-[var(--text-main)]">
        <h2 className="text-2xl font-bold mb-4 font-syne">Perfil no encontrado</h2>
        <p className="mb-6 text-[var(--text-secondary)]">El usuario que buscas no existe o no está disponible.</p>
        <button onClick={() => router.back()} className="btn-primary">Volver</button>
      </div>
    );
  }

  if (loadingPerfil || !perfil?.rol) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="text-[var(--text-main)]">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-[var(--bg-main)] text-[var(--text-main)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
        <div className="rounded-3xl p-5 sm:p-6 md:p-9 border border-[var(--border-color)] bg-[var(--bg-card)]">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#6c63ff] shrink-0 flex items-center justify-center text-3xl md:text-4xl font-bold mx-auto md:mx-0">
              {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" /> : iniciales}
            </div>
            <div className="flex-1 min-w-0 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold break-words font-syne">{nombreCompleto}</h1>
                {perfil.verificado && (
                  <span className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border border-[var(--border-light)] bg-[var(--accent-bg)] text-[var(--accent-text)]">
                    <Image src="/svg/checkIcon.svg" alt="check" width={16} height={16} /> Verificado
                  </span>
                )}
              </div>
              <div className="text-sm mt-1 text-[var(--text-secondary)] break-words">{perfil.email}</div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 mt-3 text-sm text-[var(--text-secondary)]">
                {perfil.district && <span className="flex items-center gap-2"><Image src="/svg/locationIcon.svg" alt="location" width={16} height={16} />{perfil.district}</span>}
                {perfil.disponible && <span className="flex items-center gap-2 text-green-400"><Image src="/svg/calendarIcon.svg" alt="calendar" width={16} height={16} />Disponible ahora</span>}
                {valoracionPromedio > 0 && <span className="flex items-center gap-1 text-yellow-400"><Image src="/svg/starIcon.svg" alt="star" width={16} height={16} />{valoracionPromedio.toFixed(1)}</span>}
                {totalReseñas > 0 && <span>{totalReseñas} reseñas</span>}
              </div>
              {perfil.bio && (
                <div className="mt-4">
                  <p className="text-sm leading-relaxed line-clamp-2 text-[var(--text-muted)]">{perfil.bio}</p>
                  {perfil.bio.length > 150 && (
                    <button onClick={() => setActiveTab("sobre")} className="text-xs hover:underline mt-1 text-[var(--accent)]">Ver más →</button>
                  )}
                </div>
              )}
            </div>
            {!esMiPerfil ? (
              <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto justify-center md:justify-start">
                {esTrabajadorVisto && (
                  <button onClick={handleContratar} disabled={contratando} className="btn-primary flex items-center gap-2 justify-center text-sm sm:text-base">
                    <Image src="/svg/plusIcon.svg" alt="contratar" width={18} height={18} />
                    {contratando ? "Contratando..." : "Contratar"}
                  </button>
                )}
                <button onClick={handleContactar} disabled={contactando} className="btn-secondary flex items-center gap-2 justify-center text-sm sm:text-base">
                  <Image src="/svg/messageIcon.svg" alt="mensaje" width={18} height={18} />
                  {contactando ? "Abriendo chat..." : "Enviar mensaje"}
                </button>
                <button onClick={() => { navigator.clipboard?.writeText(window.location.href); alert("Enlace copiado"); }} className="btn-secondary flex items-center gap-2 justify-center text-sm sm:text-base">
                  <Image src="/svg/shareIcon.svg" alt="share" width={18} height={18} /> Compartir perfil
                </button>
              </div>
            ) : (
              <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto justify-center md:justify-start">
                <button onClick={() => router.push("/profile/edit")} className="btn-primary flex items-center gap-2 justify-center text-sm sm:text-base">
                  <Image src="/svg/plusIcon.svg" alt="edit" width={18} height={18} /> Editar mi perfil
                </button>
                <button onClick={() => router.push("/messages")} className="btn-secondary flex items-center gap-2 justify-center text-sm sm:text-base">
                  <Image src="/svg/messageIcon.svg" alt="mensajes" width={18} height={18} /> Mis mensajes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {[
            { value: loadingCompletados ? "..." : totalTrabajos, label: "Trabajos" },
            { value: valoracionPromedio > 0 ? valoracionPromedio.toFixed(1) : "—", label: "Valoración" },
            { value: `${perfil.porcentajeExito || 0}%`, label: "Éxito" },
            { value: antiguedadTexto || "—", label: "En Nexora" },
            { value: tarifaEstandar > 0 ? `S/ ${tarifaEstandar}` : "—", label: "Tarifa estándar" }
          ].map((stat, idx) => (
            <div key={idx} className="rounded-2xl p-3 sm:p-4 md:p-6 text-center border border-[var(--border-color)] bg-[var(--bg-card)]">
              <p className="text-base sm:text-xl md:text-3xl font-bold text-[var(--text-main)]">{stat.value}</p>
              <p className="text-[10px] sm:text-xs md:text-sm mt-1 text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar izquierdo */}
          <div className="space-y-6">
            <div className="rounded-2xl p-5 md:p-6 border border-[var(--border-color)] bg-[var(--bg-card)]">
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 text-[var(--text-muted)]">Información</h2>
              <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                {perfil.disponibilidad && <div className="flex items-center gap-3"><Image src="/svg/clockIcon.svg" alt="clock" width={18} height={18} /><span>{perfil.disponibilidad}</span></div>}
                {perfil.creadoEn && (
                  <div className="flex items-center gap-3">
                    <Image src="/svg/calendarIcon.svg" alt="calendar" width={18} height={18} />
                    <span>Miembro desde {new Date(perfil.creadoEn?.toDate?.() ?? perfil.creadoEn).getFullYear()}</span>
                  </div>
                )}
                {perfil.website && <div className="flex items-center gap-3"><Image src="/svg/linkIcon.svg" alt="link" width={18} height={18} /><a href={perfil.website} target="_blank" rel="noreferrer" className="hover:underline text-[var(--accent)]">{perfil.website.replace(/^https?:\/\//, "")}</a></div>}
              </div>
            </div>
            {(perfil.habilidades?.length > 0) && (
              <div className="rounded-2xl p-5 md:p-6 border border-[var(--border-color)] bg-[var(--bg-card)]">
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 text-[var(--text-muted)]">Habilidades</h2>
                <div className="flex flex-wrap gap-2">
                  {perfil.habilidades.map(h => <span key={h} className="badge bg-[var(--accent-bg)] text-[var(--accent-text)]">{h}</span>)}
                </div>
              </div>
            )}
            {esTrabajadorVisto && reseñas.length > 0 && (
              <div className="rounded-2xl p-5 md:p-6 border border-[var(--border-color)] bg-[var(--bg-card)]">
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 text-[var(--text-muted)]">Reputación</h2>
                <div className="space-y-4">
                  <RepBar label="Calidad" score={avgCalidad} />
                  <RepBar label="Comunicación" score={avgComunicacion} />
                  <RepBar label="Puntualidad" score={avgPuntualidad} />
                  <RepBar label="Precio" score={avgPrecio} />
                </div>
              </div>
            )}
          </div>

          {/* Contenido derecho (pestañas, listas) */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-1 rounded-xl p-1.5 border border-[var(--border-color)] bg-[var(--bg-card)]">
              <button
                onClick={() => setActiveTab("trabajos")}
                className={`flex-1 text-xs sm:text-sm md:text-base py-2 rounded-lg transition-all font-medium ${
                  activeTab === "trabajos" ? "btn-primary" : "hover:bg-[var(--bg-hover)] bg-transparent text-[var(--text-secondary)]"
                }`}
              >
                {esTrabajadorVisto ? "Postulaciones" : "Solicitudes"}
              </button>
              {esTrabajadorVisto && (
                <button
                  onClick={() => setActiveTab("reseñas")}
                  className={`flex-1 text-xs sm:text-sm md:text-base py-2 rounded-lg transition-all font-medium ${
                    activeTab === "reseñas" ? "btn-primary" : "hover:bg-[var(--bg-hover)] bg-transparent text-[var(--text-secondary)]"
                  }`}
                >
                  Reseñas
                </button>
              )}
              <button
                onClick={() => setActiveTab("sobre")}
                className={`flex-1 text-xs sm:text-sm md:text-base py-2 rounded-lg transition-all font-medium ${
                  activeTab === "sobre" ? "btn-primary" : "hover:bg-[var(--bg-hover)] bg-transparent text-[var(--text-secondary)]"
                }`}
              >
                Sobre mí
              </button>
            </div>

            {activeTab === "trabajos" && (
              <div className="space-y-4">
                {loadingContent ? (
                  <div className="text-center py-10 text-[var(--text-muted)]">Cargando...</div>
                ) : listaTrabajos.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center border border-[var(--border-color)] bg-[var(--bg-card)]">
                    <p className="text-[var(--text-secondary)]">{esTrabajadorVisto ? "Este trabajador aún no se ha postulado a ninguna solicitud." : "Este cliente aún no ha publicado ninguna solicitud."}</p>
                  </div>
                ) : (
                  listaTrabajos.map(item => (
                    <div key={item.id} className="rounded-2xl p-4 sm:p-5 border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)] transition-all">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-[var(--text-main)] break-words flex-1">{item.titulo}</h3>
                        {item.precio && item.precio !== "A coordinar" && <span className="font-medium text-[var(--accent)] shrink-0">{item.precio}</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm mb-3 text-[var(--text-muted)]">
                        {item.creadoEn && (
                          <span className="flex items-center gap-1">
                            <Image src="/svg/calendarIcon.svg" alt="calendar" width={14} height={14} />
                            {new Date(item.creadoEn).toLocaleDateString("es-PE", { month: "short", year: "numeric" })}
                          </span>
                        )}
                        {item.duracion && (
                          <span className="flex items-center gap-1">
                            <Image src="/svg/clockIcon.svg" alt="clock" width={14} height={14} />
                            {item.duracion}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          item.estado === "completada"
                            ? "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20"
                            : item.estado === "en_progreso"
                            ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                            : "bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-color)]/50"
                        }`}>
                          {item.estado === "completada" ? "Completado" : item.estado === "en_progreso" ? "En progreso" : "Activo"}
                        </span>
                      </div>
                      <p className="text-sm mb-3 line-clamp-2 text-[var(--text-secondary)]">{item.descripcion}</p>
                      {item.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.tags.slice(0, 4).map(tag => <span key={tag} className="badge text-xs">{tag}</span>)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "reseñas" && esTrabajadorVisto && (
              <div className="space-y-4">
                {loadingContent ? (
                  <div className="text-center py-10 text-[var(--text-muted)]">Cargando reseñas...</div>
                ) : reseñas.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center border border-[var(--border-color)] bg-[var(--bg-card)]">
                    <p className="text-[var(--text-secondary)]">Este trabajador aún no tiene reseñas.</p>
                  </div>
                ) : (
                  reseñas.map(r => (
                    <div key={r.id} className="rounded-2xl p-5 border border-[var(--border-color)] bg-[var(--bg-card)]">
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                        <span className="font-semibold text-[var(--text-main)]">{r.clienteNombre || "Cliente"}</span>
                        <Stars value={(r.calidad + r.puntualidad + r.precio + r.comunicacion) / 4} />
                      </div>
                      <p className="text-sm mt-2 text-[var(--text-secondary)]">{r.comentario}</p>
                      {r.respuesta && (
                        <div className="mt-3 text-xs border-l-2 pl-2 border-[var(--accent)] text-[var(--accent)]">
                          Respuesta: {r.respuesta}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "sobre" && (
              <div className="rounded-2xl p-6 border border-[var(--border-color)] bg-[var(--bg-card)]">
                {perfil.bio ? (
                  <p className="leading-relaxed whitespace-pre-wrap text-[var(--text-secondary)]">{perfil.bio}</p>
                ) : (
                  <p className="text-center text-[var(--text-muted)]">Este usuario aún no ha escrito una biografía.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}