"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/db";
import { useRouter } from "next/navigation";
import { useUserRole }    from "@/app/Hooks/useUserRole";
import { useSolicitudes } from "@/app/FeedTrabajos/Hooks/useSolicitudes";
import { marcarTodasLeidas } from "@/firebase/Notificaciones";
import { obtenerReseñasDeCliente } from "@/firebase/Reviews";
import { s } from './styles';

function Stars({ value }) {
  const r = Math.round(value);
  const validValue = isNaN(value) ? 0 : value;
  return (
    <div style={s.stars}>
      {"★".repeat(r)}{"☆".repeat(5 - r)}
      {" "}<span style={{ color: "#666", fontSize: "12px" }}>({validValue.toFixed(1)})</span>
    </div>
  );
}

function RepBar({ label, value }) {
  if (!value) return null;
  return (
    <div style={s.repRow}>
      <span style={s.repLabel}>{label}</span>
      <div style={s.repBarBg}><div style={s.repBarFill((value / 5) * 100)} /></div>
      <span style={s.repValue}>{value.toFixed(1)}</span>
    </div>
  );
}

export default function PerfilPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const { perfil, rol, loadingRol } = useUserRole();
  const [tab, setTab] = useState("trabajos");
  const { solicitudes: solicitudesCliente, loading: loadingCliente } = useSolicitudes(
    rol === "cliente" && user?.uid ? user.uid : undefined
  );
  const [trabajosPostulado, setTrabajosPostulado] = useState([]);
  const [loadingPostulado,  setLoadingPostulado]  = useState(false);
  const [reseñasEscritas, setReseñasEscritas] = useState([]);
  const [loadingEscritas, setLoadingEscritas] = useState(false);

  useEffect(() => {
    if (rol !== "trabajador" || !user) return;
    setLoadingPostulado(true);
    const q = query(
      collection(db, "solicitudes"),
      where("postulantes", "array-contains", user.uid),
      orderBy("creadoEn", "desc")
    );
    getDocs(q)
      .then((snap) => {
        setTrabajosPostulado(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            creadoEn: d.data().creadoEn?.toDate?.() ?? new Date(),
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoadingPostulado(false));
  }, [rol, user]);

  useEffect(() => {
    if (rol !== "cliente" || !user) return;
    setLoadingEscritas(true);
    obtenerReseñasDeCliente(user.uid).then((result) => {
      if (result.success) setReseñasEscritas(result.data);
      setLoadingEscritas(false);
    }).catch(console.error);
  }, [rol, user]);

  // Reseñas recibidas 
  const [reseñas, setReseñas] = useState([]);
  useEffect(() => {
    if (rol !== "trabajador" || !user) return;
    const q = query(
      collection(db, "reseñas"),
      where("trabajadorId", "==", user.uid),
      orderBy("creadoEn", "desc")
    );
    getDocs(q)
      .then((snap) =>
        setReseñas(snap.docs.map((d) => ({
          id: d.id, ...d.data(),
          creadoEn: d.data().creadoEn?.toDate?.() ?? new Date(),
        })))
      )
      .catch(console.error);
  }, [rol, user]);

  useEffect(() => {
    if (!loadingAuth && !user) router.push("/login");
  }, [user, loadingAuth, router]);

  useEffect(() => {
    if (user?.uid) {
      marcarTodasLeidas(user.uid).catch(console.error);
    }
  }, [user]);

  if (loadingAuth || loadingRol) {
    return <div style={s.loading}>Cargando perfil...</div>;
  }

  const iniciales     = perfil.iniciales ||
    `${perfil.first_name?.[0] ?? ""}${perfil.last_name?.[0] ?? ""}`.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() || "?";
  const nombreCompleto = `${perfil.first_name} ${perfil.last_name}`.trim() || user?.email;
  const creadoEn       = perfil.creadoEn;
  const añosEnNexora   = creadoEn
    ? Math.max(1, new Date().getFullYear() - creadoEn.getFullYear())
    : null;

  const avg = (field) =>
    reseñas.length ? reseñas.reduce((a, r) => a + (r[field] ?? 0), 0) / reseñas.length : null;

  const esTrabajador   = rol === "trabajador";
  const listaTrabajos  = esTrabajador ? trabajosPostulado : solicitudesCliente;
  const loadingTrabajos = esTrabajador ? loadingPostulado  : loadingCliente;
  const getPromedioReseña = (r) => {
    const suma = (r.calidad || 0) + (r.puntualidad || 0) + (r.precio || 0) + (r.comunicacion || 0);
    const divisor = r.comunicacion ? 4 : 3;
    return suma / divisor;
  };

  return (
    <div style={s.root}>

      <div style={s.headerCard}>
        <div style={s.avatarWrap}>
          {perfil.avatarUrl
            ? <img src={perfil.avatarUrl} alt="avatar" style={s.avatarImg} />
            : iniciales}
        </div>

        <div style={s.headerMain}>
          <div style={s.nameRow}>
            <span style={s.name}>{nombreCompleto}</span>
            {perfil.verificado && <span style={s.verifiedBadge}>✓ Verificado</span>}
            {rol && (
              <span style={s.rolBadge(rol)}>
                {rol === "cliente" ? "Cliente" : "Trabajador"}
              </span>
            )}
          </div>
          <div style={s.email}>{user?.email}</div>
          <div style={s.metaRow}>
            {perfil.district && <span style={s.metaItem}>📍 {perfil.district}</span>}
            {perfil.disponible && (
              <span style={s.metaItem}><span style={s.dot} /> Disponible ahora</span>
            )}
            {perfil.valoracionPromedio > 0 && (
              <span style={s.metaItem}>⭐ {perfil.valoracionPromedio.toFixed(1)}</span>
            )}
            {reseñas.length > 0 && (
              <span style={{ color: "#666" }}>{reseñas.length} reseñas</span>
            )}
          </div>
        </div>

        <div style={s.headerActions}>
          <button style={s.btnPrimary} onClick={() => router.push("/perfil/editar")}>
            ✏ Editar perfil
          </button>
          <button style={s.btnSecondary} onClick={() => router.push(`/perfil/${user?.uid}`)}>
            👁 Vista pública
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={s.statValue}>{perfil.totalTrabajos}</div>
          <div style={s.statLabel}>Trabajos</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statValue}>
            {perfil.valoracionPromedio > 0 ? perfil.valoracionPromedio.toFixed(1) : "—"}
          </div>
          <div style={s.statLabel}>Valoración</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statValue}>{perfil.porcentajeExito}%</div>
          <div style={s.statLabel}>Éxito</div>
        </div>
        {añosEnNexora && (
          <div style={s.statCard}>
            <div style={s.statValue}>{añosEnNexora} {añosEnNexora === 1 ? "año" : "años"}</div>
            <div style={s.statLabel}>En Nexora</div>
          </div>
        )}
        {perfil.tarifaEstandar > 0 && (
          <div style={s.statCard}>
            <div style={s.statValue}>S/ {perfil.tarifaEstandar}</div>
            <div style={s.statLabel}>Tarifa estándar</div>
          </div>
        )}
      </div>

      <div style={s.columns}>

        {/* Columna izquierda */}
        <div style={s.leftCol}>
          <div style={s.section}>
            <div style={s.sectionTitle}>Información</div>
            {perfil.disponibilidad && (
              <div style={s.infoRow}><span style={s.infoIcon}>🗓</span>{perfil.disponibilidad}</div>
            )}
            {creadoEn && (
              <div style={s.infoRow}><span style={s.infoIcon}>📅</span>Miembro desde {creadoEn.getFullYear()}</div>
            )}
            {perfil.website && (
              <div style={s.infoRow}>
                <span style={s.infoIcon}>🔗</span>
                <a href={perfil.website} target="_blank" rel="noreferrer"
                  style={{ color: "#a78bfa", textDecoration: "none", fontSize: "13px" }}>
                  {perfil.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {!perfil.bio && (
              <button
                onClick={() => router.push("/perfil/editar")}
                style={{ ...s.btnSecondary, width: "100%", marginTop: "8px", fontSize: "12px", padding: "8px", justifyContent: "center" }}
              >
                + Completar perfil
              </button>
            )}
          </div>

          {perfil.habilidades.length > 0 ? (
            <div style={s.section}>
              <div style={s.sectionTitle}>Habilidades</div>
              {perfil.habilidades.map((h) => <span key={h} style={s.chip}>{h}</span>)}
            </div>
          ) : esTrabajador && (
            <div style={{ ...s.section, textAlign: "center" }}>
              <div style={s.sectionTitle}>Habilidades</div>
              <p style={{ color: "#444", fontSize: "13px", marginBottom: "12px" }}>
                Agrega tus habilidades para destacar.
              </p>
              <button onClick={() => router.push("/perfil/editar")}
                style={{ ...s.btnSecondary, fontSize: "12px", padding: "7px 14px" }}>
                + Agregar
              </button>
            </div>
          )}

          {esTrabajador && reseñas.length > 0 && (
            <div style={s.section}>
              <div style={s.sectionTitle}>Reputación</div>
              <RepBar label="Calidad"      value={avg("calidad")} />
              <RepBar label="Comunicación" value={avg("comunicacion")} />
              <RepBar label="Puntualidad"  value={avg("puntualidad")} />
              <RepBar label="Precio"       value={avg("precio")} />
            </div>
          )}
        </div>

        {/* Columna derecha */}
        <div style={s.rightCol}>
          <div style={s.section}>
            <div style={s.tabs}>
              <button style={s.tab(tab === "trabajos")} onClick={() => setTab("trabajos")}>
                {esTrabajador ? "Postulaciones" : "Mis solicitudes"}
                {listaTrabajos.length > 0 && ` ${listaTrabajos.length}`}
              </button>
              {esTrabajador && (
                <button style={s.tab(tab === "reseñas")} onClick={() => setTab("reseñas")}>
                  Reseñas recibidas {reseñas.length > 0 && reseñas.length}
                </button>
              )}
              <button style={s.tab(tab === "sobre")} onClick={() => setTab("sobre")}>
                Sobre mí
              </button>
              <button style={s.tab(tab === "reseñasEscritas")} onClick={() => setTab("reseñasEscritas")}>
                Mis reseñas {reseñasEscritas.length > 0 && `(${reseñasEscritas.length})`}
              </button>
            </div>

            {/* Tab trabajos/postulaciones */}
            {tab === "trabajos" && (
              loadingTrabajos ? (
                <div style={s.emptyMsg}>Cargando...</div>
              ) : listaTrabajos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  {esTrabajador ? (
                    <>
                      <p style={{ color: "#444", fontSize: "13px", marginBottom: "14px" }}>
                        Aún no te has postulado a ninguna solicitud.
                      </p>
                      <button style={s.btnPrimary} onClick={() => router.push("/FeedTrabajos")}>
                        Ver solicitudes disponibles
                      </button>
                    </>
                  ) : (
                    <>
                      <p style={{ color: "#444", fontSize: "13px", marginBottom: "14px" }}>
                        Aún no has publicado solicitudes.
                      </p>
                      <button style={s.btnPrimary} onClick={() => router.push("/NewRequest")}>
                        + Nueva solicitud
                      </button>
                    </>
                  )}
                </div>
              ) : (
                listaTrabajos.map((sol) => (
                  <div key={sol.id} style={s.workCard}>
                    <div style={s.workTopRow}>
                      <span style={s.workTitle}>{sol.titulo}</span>
                      {sol.precio && sol.precio !== "A coordinar" && (
                        <span style={s.workAmount}>{sol.precio}</span>
                      )}
                    </div>
                    <div style={s.workMeta}>
                      {sol.creadoEn && (
                        <span>📅 {sol.creadoEn.toLocaleDateString("es-PE", { month: "short", year: "numeric" })}</span>
                      )}
                      {sol.duracion && <span>⏱ {sol.duracion}</span>}
                      <span style={s.statusBadge(sol.estado ?? "activa")}>
                        {sol.estado === "completada" ? "Completado"
                          : sol.estado === "en_progreso" ? "En progreso"
                          : sol.estado === "cancelada" ? "Cancelado"
                          : "Activo"}
                      </span>
                      {esTrabajador && sol.trabajadorId === user?.uid && (
                        <span style={{ color: "#4ade80", fontSize: "11px", fontWeight: 700 }}>
                          ✓ Contratado
                        </span>
                      )}
                    </div>
                    {sol.descripcion && (
                      <div style={s.workDesc}>
                        {sol.descripcion.length > 120
                          ? sol.descripcion.slice(0, 120) + "…"
                          : sol.descripcion}
                      </div>
                    )}
                    {(sol.habilidades?.length ?? 0) > 0 && (
                      <div style={s.tagRow}>
                        {sol.habilidades.slice(0, 4).map((h) => (
                          <span key={h} style={s.tag}>{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )
            )}

            {/* Tab reseñas recibidas*/}
            {tab === "reseñas" && esTrabajador && (
              reseñas.length === 0 ? (
                <div style={s.emptyMsg}>Aún no tienes reseñas.</div>
              ) : (
                reseñas.map((r, i) => (
                  <div key={r.id} style={i === reseñas.length - 1
                    ? { ...s.reviewCard, borderBottom: "none", marginBottom: 0 }
                    : s.reviewCard}>
                    <div style={s.reviewHeader}>
                      <span style={s.reviewAuthor}>{r.clienteNombre ?? "Cliente"}</span>
                      <span style={s.reviewDate}>
                        {r.creadoEn?.toLocaleDateString?.("es-PE", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <Stars value={getPromedioReseña(r)} />
                    <div style={s.reviewText}>{r.comentario}</div>
                    {r.respuesta && (
                      <div style={{ marginTop: "8px", borderLeft: "2px solid #4a3aaa", paddingLeft: "10px", color: "#666", fontSize: "12px" }}>
                        <strong style={{ color: "#a78bfa" }}>Tu respuesta:</strong> {r.respuesta}
                      </div>
                    )}
                  </div>
                ))
              )
            )}

            {/* Tab reseñas escritas por el cliente */}
            {tab === "reseñasEscritas" && (
              loadingEscritas ? (
                <div style={s.emptyMsg}>Cargando...</div>
              ) : reseñasEscritas.length === 0 ? (
                <div style={s.emptyMsg}>Aún no has escrito reseñas.</div>
              ) : (
                reseñasEscritas.map((r, i) => (
                  <div key={r.id} style={i === reseñasEscritas.length - 1 ? { ...s.reviewCard, borderBottom: "none" } : s.reviewCard}>
                    <div style={s.reviewHeader}>
                      <span style={s.reviewAuthor}>Para: {r.trabajadorNombre ?? "Trabajador"}</span>
                      <span style={s.reviewDate}>{r.creadoEn?.toLocaleDateString?.()}</span>
                    </div>
                    <Stars value={getPromedioReseña(r)} />
                    <div style={s.reviewText}>{r.comentario}</div>
                  </div>
                ))
              )
            )}

            {/* Tab sobre mí */}
            {tab === "sobre" && (
              perfil.bio ? (
                <p style={s.bioText}>{perfil.bio}</p>
              ) : (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <p style={{ color: "#444", fontSize: "13px", marginBottom: "12px" }}>
                    {esTrabajador
                      ? "Cuéntale a tus clientes sobre ti y tu experiencia."
                      : "Agrega una descripción sobre ti."}
                  </p>
                  <button style={s.btnSecondary} onClick={() => router.push("/perfil/editar")}>
                    + Agregar bio
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}