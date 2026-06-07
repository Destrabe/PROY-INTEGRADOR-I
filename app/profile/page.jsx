"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/app/hooks/useUserRole";
import { useSolicitudes } from "@/app/hooks/useSolicitudes";
import { marcarTodasLeidas } from "@/firebase/Notificaciones";
import { obtenerReseñasDeCliente, obtenerReseñasDeTrabajador } from "@/firebase/Reviews";
import { obtenerMisPostulaciones } from "@/firebase/Solicitudes";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/db";
import Link from "next/link";
import Image from "next/image";
import { Stars, RepBar } from "@/components/profile/profileStats";
import { formatSeniority } from "./utils/formatSeniority";
import { calculateRevStats } from "./utils/calculateRevStats";

export default function ProfilePage() {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const { perfil, rol, loadingRol, refetch } = useUserRole();
  const [activeTab, setActiveTab] = useState("trabajos");

  const { solicitudes: solicitudesCliente, loading: loadingCliente } = useSolicitudes(
    rol === "cliente" && user?.uid ? user.uid : undefined
  );
  const [postulaciones, setPostulaciones] = useState([]);
  const [loadingPostulaciones, setLoadingPostulaciones] = useState(false);
  const [reseñasRecibidas, setReseñasRecibidas] = useState([]);
  const [reseñasEscritas, setReseñasEscritas] = useState([]);
  const [loadingReseñas, setLoadingReseñas] = useState(false);
  const [trabajosCompletados, setTrabajosCompletados] = useState(0);
  const [loadingCompletados, setLoadingCompletados] = useState(true);

  // cargar postulaciones si es trabajador
  useEffect(() => {
    if (rol === "trabajador" && user?.uid) {
      setLoadingPostulaciones(true);
      obtenerMisPostulaciones(user.uid).then(res => {
        if (res.success) {
          setPostulaciones(res.data);
        }
        setLoadingPostulaciones(false);
      });
    }
  }, [rol, user]);

  // cargar reseñas según rol
  useEffect(() => {
    if (!user?.uid) return;
    setLoadingReseñas(true);
    if (rol === "trabajador") {
      obtenerReseñasDeTrabajador(user.uid).then(res => {
        if (res.success) {
          setReseñasRecibidas(res.data);
        }
        setLoadingReseñas(false);
      });
    } else if (rol === "cliente") {
      obtenerReseñasDeCliente(user.uid).then(res => {
        if (res.success) {
          setReseñasEscritas(res.data);
        }
        setLoadingReseñas(false);
      });
    } else {
      setLoadingReseñas(false);
    }
  }, [rol, user]);

  useEffect(() => {
    if (!loadingAuth && !user) router.push("/login");
  }, [user, loadingAuth, router]);

  // marcar notificaciones como leídas
  useEffect(() => {
    if (user?.uid) marcarTodasLeidas(user.uid).catch(console.error);
  }, [user]);

  // contar trabajos completados (cliente o trabajador)
  useEffect(() => {
    if (!user?.uid || !rol) return;
    const fetchCompletados = async () => {
      setLoadingCompletados(true);
      try {
        let q;
        if (rol === "cliente") {
          q = query(
            collection(db, "solicitudes"),
            where("userId", "==", user.uid),
            where("estado", "==", "completada")
          );
        } else if (rol === "trabajador") {
          q = query(
            collection(db, "solicitudes"),
            where("trabajadorId", "==", user.uid),
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
  }, [user, rol]);

  const avatarUrl = perfil?.avatarUrl;
  const esTrabajador = rol === "trabajador";

  const nombreCompleto = useMemo(
    () => `${perfil?.first_name ?? ""} ${perfil?.last_name ?? ""}`.trim() || user?.email || "Usuario",
    [perfil?.first_name, perfil?.last_name, user?.email]
  );

  const iniciales = useMemo(
    () =>
      perfil?.iniciales ||
      `${perfil?.first_name?.[0] ?? ""}${perfil?.last_name?.[0] ?? ""}`.toUpperCase() ||
      user?.email?.[0]?.toUpperCase() ||
      "?",
    [perfil?.iniciales, perfil?.first_name, perfil?.last_name, user?.email]
  );

  const antiguedadTexto = useMemo(
    () => formatSeniority(perfil?.creadoEn),
    [perfil?.creadoEn]
  );

  const valoracionPromedio = perfil?.valoracionPromedio || 0;
  const porcentajeExito = perfil?.porcentajeExito || 0;
  const tarifaEstandar = perfil?.tarifaEstandar || 0;

  const listaTrabajos = esTrabajador ? postulaciones : solicitudesCliente;
  const loadingTrabajos = esTrabajador ? loadingPostulaciones : loadingCliente;
  const totalReseñas = esTrabajador ? reseñasRecibidas.length : reseñasEscritas.length;

  const { avgCalidad, avgComunicacion, avgPuntualidad, avgPrecio } = useMemo(
    () => calculateRevStats(reseñasRecibidas),
    [reseñasRecibidas]
  );

  if (loadingAuth || loadingRol) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="text-[var(--text-main)]">Cargando perfil...</div>
      </div>
    );
  }

  if (!rol) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--bg-main)] text-[var(--text-main)]">
        <h2 className="text-2xl font-bold mb-4">Perfil incompleto</h2>
        <p className="mb-6 text-[var(--text-secondary)]">Parece que tu cuenta aún no tiene un rol asignado. Por favor, completa tu registro.</p>
        <Link href="/register" className="btn-primary">Completar registro</Link>
      </div>
    );
  }

  const totalTrabajos = trabajosCompletados;

  return (
    <div className="min-h-screen font-sans bg-[var(--bg-main)] text-[var(--text-main)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
        {/* Header Card */}
        <div className="rounded-3xl p-5 sm:p-6 md:p-9 border border-[var(--border-color)] bg-[var(--bg-card)]">
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#6c63ff] shrink-0 flex items-center justify-center text-3xl md:text-4xl font-bold mx-auto md:mx-0">
              {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" /> : iniciales}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold break-words">{nombreCompleto}</h1>
                  {perfil?.verificado && (
                    <span className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border border-[var(--border-light)] bg-[var(--accent-bg)] text-[var(--accent-text)]">
                      <Image src="/svg/checkIcon.svg" alt="check" width={16} height={16} /> Verificado
                    </span>
                  )}
                </div>
                <div className="text-sm mt-1 text-[var(--text-secondary)] break-words">{perfil?.email}</div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 mt-3 text-sm text-[var(--text-secondary)]">
                  {perfil?.district && (
                    <span className="flex items-center gap-2">
                      <Image src="/svg/locationIcon.svg" alt="location" width={16} height={16} /> {perfil.district}
                    </span>
                  )}
                  {perfil?.disponible && (
                    <span className="flex items-center gap-2 text-green-400">
                      <Image src="/svg/calendarIcon.svg" alt="calendar" width={16} height={16} /> Disponible ahora
                    </span>
                  )}
                  {valoracionPromedio > 0 && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Image src="/svg/starIcon.svg" alt="star" width={16} height={16} /> {valoracionPromedio.toFixed(1)}
                    </span>
                  )}
                  {totalReseñas > 0 && <span>{totalReseñas} reseñas</span>}
                </div>
              </div>
              {perfil?.bio && (
                <div className="mt-4 text-center md:text-left">
                  <p className="text-sm leading-relaxed line-clamp-3 text-[var(--text-muted)]">{perfil.bio}</p>
                  {perfil.bio.length > 150 && (
                    <button onClick={() => setActiveTab("sobre")} className="text-xs hover:underline mt-1 text-[var(--accent)]">Ver más</button>
                  )}
                </div>
              )}
              {/* Botones en móvil */}
              <div className="mt-6 flex flex-col items-center gap-3 md:hidden">
                <div className="flex flex-row justify-center gap-3 w-full">
                  <button onClick={() => router.push("/profile/edit")} className="btn-primary flex items-center gap-2 justify-center text-sm flex-1 max-w-[160px]">
                    <Image src="/svg/plusIcon.svg" alt="edit" width={18} height={18} /> Editar perfil
                  </button>
                  <button onClick={() => router.push("/messages")} className="btn-secondary flex items-center gap-2 justify-center text-sm flex-1 max-w-[160px]">
                    <Image src="/svg/messageIcon.svg" alt="messages" width={18} height={18} /> Mensajes
                  </button>
                </div>
                <button onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/profile/${user?.uid}`); alert("Enlace copiado"); }} className="btn-secondary flex items-center gap-2 justify-center text-sm w-full max-w-[200px]">
                  <Image src="/svg/shareIcon.svg" alt="share" width={18} height={18} /> Compartir perfil
                </button>
              </div>
            </div>
            {/* Botones en desktop */}
            <div className="hidden md:flex flex-col gap-3 shrink-0 w-full md:w-auto">
              <button onClick={() => router.push("/profile/edit")} className="btn-primary flex items-center gap-2 justify-center text-sm">
                <Image src="/svg/plusIcon.svg" alt="edit" width={18} height={18} /> Editar perfil
              </button>
              <button onClick={() => router.push("/messages")} className="btn-secondary flex items-center gap-2 justify-center text-sm">
                <Image src="/svg/messageIcon.svg" alt="messages" width={18} height={18} /> Mensajes
              </button>
              <button onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/profile/${user?.uid}`); alert("Enlace copiado"); }} className="btn-secondary flex items-center gap-2 justify-center text-sm">
                <Image src="/svg/shareIcon.svg" alt="share" width={18} height={18} /> Compartir perfil
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {[
            { value: loadingCompletados ? "..." : totalTrabajos, label: "Trabajos" },
            { value: valoracionPromedio > 0 ? valoracionPromedio.toFixed(1) : "-", label: "Valoración" },
            { value: `${porcentajeExito}%`, label: "Éxito" },
            { value: antiguedadTexto || "-", label: "En Nexora" },
            { value: tarifaEstandar > 0 ? `S/${tarifaEstandar}` : "-", label: "Tarifa estándar" },
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
                {perfil?.disponibilidad && (
                  <div className="flex items-center gap-3">
                    <Image src="/svg/clockIcon.svg" alt="clock" width={18} height={18} />
                    <span>{perfil.disponibilidad}</span>
                  </div>
                )}
                {perfil?.creadoEn && (
                  <div className="flex items-center gap-3">
                    <Image src="/svg/calendarIcon.svg" alt="calendar" width={18} height={18} />
                    <span>Miembro desde {new Date(perfil.creadoEn).getFullYear()}</span>
                  </div>
                )}
                {perfil?.website && (
                  <div className="flex items-center gap-3">
                    <Image src="/svg/linkIcon.svg" alt="link" width={18} height={18} />
                    <a href={perfil.website} target="_blank" rel="noreferrer" className="hover:underline text-[var(--accent)]">{perfil.website.replace(/https?:\/\//, "")}</a>
                  </div>
                )}
              </div>
            </div>
            {perfil?.habilidades?.length > 0 && (
              <div className="rounded-2xl p-5 md:p-6 border border-[var(--border-color)] bg-[var(--bg-card)]">
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 text-[var(--text-muted)]">Habilidades</h2>
                <div className="flex flex-wrap gap-2">
                  {perfil.habilidades.map(h => (
                    <span key={h} className="badge bg-[var(--accent-bg)] text-[var(--accent-text)]">{h}</span>
                  ))}
                </div>
              </div>
            )}
            {esTrabajador && reseñasRecibidas.length > 0 && (
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

          {/* Contenido derecho */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-1 rounded-xl p-1.5 border border-[var(--border-color)] bg-[var(--bg-card)]">
              <button
                onClick={() => setActiveTab("trabajos")}
                className={`flex-1 text-xs sm:text-sm md:text-base py-2 rounded-lg transition-all font-medium ${
                  activeTab === "trabajos" ? "btn-primary" : "hover:bg-[var(--bg-hover)] bg-transparent text-[var(--text-secondary)]"
                }`}
              >
                {esTrabajador ? "Postulaciones" : "Mis solicitudes"}
              </button>
              <button
                onClick={() => setActiveTab("reseñas")}
                className={`flex-1 text-xs sm:text-sm md:text-base py-2 rounded-lg transition-all font-medium ${
                  activeTab === "reseñas" ? "btn-primary" : "hover:bg-[var(--bg-hover)] bg-transparent text-[var(--text-secondary)]"
                }`}
              >
                {esTrabajador ? "Reseñas recibidas" : "Reseñas escritas"}
              </button>
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
                {loadingTrabajos ? (
                  <div className="text-center py-10 text-[var(--text-muted)]">Cargando...</div>
                ) : listaTrabajos.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center border border-[var(--border-color)] bg-[var(--bg-card)]">
                    <p className="text-[var(--text-secondary)]">
                      {esTrabajador ? "Aún no te has postulado a ninguna solicitud." : "No has publicado ninguna solicitud."}
                    </p>
                    {!esTrabajador && <Link href="/NewRequest" className="btn-primary mt-4 inline-block">+ Nueva solicitud</Link>}
                  </div>
                ) : (
                  listaTrabajos.map(item => (
                    <div key={item.id} className="rounded-2xl p-4 sm:p-5 border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)] transition-all">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-[var(--text-main)] break-words flex-1">{item.titulo}</h3>
                        {item.precio && item.precio !== "A coordinar" && (
                          <span className="font-medium text-[var(--accent)] shrink-0">{item.precio}</span>
                        )}
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

            {activeTab === "reseñas" && (
              <div className="space-y-4">
                {loadingReseñas ? (
                  <div className="text-center py-10 text-[var(--text-muted)]">Cargando reseñas...</div>
                ) : esTrabajador ? (
                  reseñasRecibidas.length === 0 ? (
                    <div className="rounded-2xl p-8 text-center border border-[var(--border-color)] bg-[var(--bg-card)]">
                      <p className="text-[var(--text-secondary)]">No has recibido reseñas todavía.</p>
                    </div>
                  ) : (
                    reseñasRecibidas.map(r => (
                      <div key={r.id} className="rounded-2xl p-5 border border-[var(--border-color)] bg-[var(--bg-card)]">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                          <span className="font-semibold text-[var(--text-main)]">{r.clienteNombre || "Cliente"}</span>
                          <Stars value={(r.calidad + r.puntualidad + r.precio + r.comunicacion) / 4} />
                        </div>
                        <p className="text-sm mt-2 text-[var(--text-secondary)]">{r.comentario}</p>
                        {r.respuesta && (
                          <div className="mt-3 text-xs border-l-2 pl-2 border-[var(--accent)] text-[var(--accent)]">
                            Tu respuesta: {r.respuesta}
                          </div>
                        )}
                      </div>
                    ))
                  )
                ) : (
                  reseñasEscritas.length === 0 ? (
                    <div className="rounded-2xl p-8 text-center border border-[var(--border-color)] bg-[var(--bg-card)]">
                      <p className="text-[var(--text-secondary)]">No has escrito ninguna reseña.</p>
                    </div>
                  ) : (
                    reseñasEscritas.map(r => (
                      <div key={r.id} className="rounded-2xl p-5 border border-[var(--border-color)] bg-[var(--bg-card)]">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                          <span className="font-semibold text-[var(--text-main)]">Para: {r.trabajadorNombre || "Trabajador"}</span>
                          <Stars value={(r.calidad + r.puntualidad + r.precio + r.comunicacion) / 4} />
                        </div>
                        <p className="text-sm mt-2 text-[var(--text-secondary)]">{r.comentario}</p>
                      </div>
                    ))
                  )
                )}
              </div>
            )}

            {activeTab === "sobre" && (
              <div className="rounded-2xl p-6 border border-[var(--border-color)] bg-[var(--bg-card)]">
                {perfil?.bio ? (
                  <p className="leading-relaxed whitespace-pre-wrap text-[var(--text-secondary)]">{perfil.bio}</p>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[var(--text-muted)]">Aún no has añadido una biografía.</p>
                    <button onClick={() => router.push("/profile/edit")} className="btn-primary mt-4">+ Añadir biografía</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}