"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/db";
import { obtenerOCrearConversacion } from "@/firebase/Mensajes";
import { marcarTodasLeidas } from "@/firebase/Notificaciones";
import { useUserRole } from "@/app/Hooks/useUserRole";
import { useContratar } from "@/app/Hooks/useContratar";
import { s } from "@/app/perfil/styles";      

function Stars({ value }) {
  const r = Math.round(value);
  const safeValue = isNaN(value) ? 0 : value;
  return (
    <div style={s.stars}>
      {"★".repeat(r)}{"☆".repeat(5 - r)}
      <span style={{ color: "#666", fontSize: "12px" }}> {safeValue.toFixed(1)}</span>
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

const getPromedioReseña = (r) => {
  const suma = (r.calidad || 0) + (r.puntualidad || 0) + (r.precio || 0) + (r.comunicacion || 0);
  const divisor = r.comunicacion ? 4 : 3;
  return suma / divisor;
};

export default function PerfilPublicoPage() {
  const params = useParams();
  const router = useRouter();
  const targetId = params?.userId;

  const { user, rol, perfil: perfilActual } = useUserRole();
  const { contratar, contratando } = useContratar();

  const [perfil, setPerfil] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactando, setContactando] = useState(false);
  const [tab, setTab] = useState("trabajos");
  const [convId, setConvId] = useState(null);
  const [contratado, setContratado] = useState(false);

  useEffect(() => {
    if (user?.uid && user.uid === targetId) {
      marcarTodasLeidas(user.uid).catch(console.error);
    }
  }, [user, targetId]);

  useEffect(() => {
    if (!targetId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "users", targetId));
        if (snap.exists()) setPerfil(snap.data());

        const qSol = query(collection(db, "solicitudes"), where("userId", "==", targetId), orderBy("creadoEn", "desc"));
        const snapSol = await getDocs(qSol);
        setSolicitudes(snapSol.docs.map((d) => ({ id: d.id, ...d.data(), creadoEn: d.data().creadoEn?.toDate?.() ?? new Date() })));

        const qRes = query(collection(db, "reseñas"), where("trabajadorId", "==", targetId), orderBy("creadoEn", "desc"));
        const snapRes = await getDocs(qRes);
        setReseñas(snapRes.docs.map((d) => ({ id: d.id, ...d.data(), creadoEn: d.data().creadoEn?.toDate?.() ?? new Date() })));
      } catch (err) {
        console.error("[PerfilPublico] Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [targetId]);

  const handleContactar = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.uid === targetId) return;
    setContactando(true);
    try {
      const clienteNombre = perfilActual?.first_name
        ? `${perfilActual.first_name} ${perfilActual.last_name}`.trim()
        : user.displayName || user.email || "Usuario";
      const trabajadorNombre = perfil
        ? `${perfil.first_name ?? ""} ${perfil.last_name ?? ""}`.trim()
        : "Trabajador";
      const id = await obtenerOCrearConversacion(
        user.uid, targetId, null, null,
        { [user.uid]: clienteNombre, [targetId]: trabajadorNombre }
      );
      setConvId(id);
      router.push(`/mensajes?conv=${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setContactando(false);
    }
  };

  const handleContratar = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.uid === targetId) return;
    if (convId) {
      router.push(`/mensajes?conv=${convId}`);
      return;
    }
    setContactando(true);
    try {
      const clienteNombre = perfilActual?.first_name
        ? `${perfilActual.first_name} ${perfilActual.last_name}`.trim()
        : user.displayName || user.email || "Usuario";
      const trabajadorNombre = perfil
        ? `${perfil.first_name ?? ""} ${perfil.last_name ?? ""}`.trim()
        : "Trabajador";
      const id = await obtenerOCrearConversacion(
        user.uid, targetId, null, null,
        { [user.uid]: clienteNombre, [targetId]: trabajadorNombre }
      );
      router.push(`/mensajes?conv=${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setContactando(false);
    }
  };

  if (loading) return <div style={s.loading}>Cargando perfil...</div>;
  if (!perfil) {
    return (
      <div style={s.notFound}>
        <span style={{ fontSize: "40px" }}>👤</span>
        <p>Este perfil no existe o fue eliminado.</p>
        <button onClick={() => router.back()} style={s.backBtn}>Volver</button>
      </div>
    );
  }

  const iniciales = perfil.iniciales || `${perfil.first_name?.[0] ?? ""}${perfil.last_name?.[0] ?? ""}`.toUpperCase() || "?";
  const nombreCompleto = `${perfil.first_name ?? ""} ${perfil.last_name ?? ""}`.trim();
  const creadoEn = perfil.creadoEn?.toDate?.();
  const añosEnNexora = creadoEn ? Math.max(1, new Date().getFullYear() - creadoEn.getFullYear()) : null;

  const avgCalidad = reseñas.length ? reseñas.reduce((a, r) => a + (r.calidad ?? 0), 0) / reseñas.length : null;
  const avgPuntualidad = reseñas.length ? reseñas.reduce((a, r) => a + (r.puntualidad ?? 0), 0) / reseñas.length : null;
  const avgPrecio = reseñas.length ? reseñas.reduce((a, r) => a + (r.precio ?? 0), 0) / reseñas.length : null;
  const avgComunicacion = reseñas.length ? reseñas.reduce((a, r) => a + (r.comunicacion ?? 0), 0) / reseñas.length : null;

  const esPropioPerfil = user?.uid === targetId;
  const puedeContratar = user && !esPropioPerfil && rol === "cliente" && !contratado;

  return (
    <div style={s.root}>
      <button style={s.backBtn} onClick={() => router.back()}>← Volver</button>

      <div style={s.headerCard}>
        <div style={s.avatarWrap}>
          {perfil.avatarUrl ? <img src={perfil.avatarUrl} alt="avatar" style={s.avatarImg} /> : iniciales}
        </div>
        <div style={s.headerMain}>
          <div style={s.nameRow}>
            <span style={s.name}>{nombreCompleto}</span>
            {perfil.verificado && <span style={s.verifiedBadge}>✓ Verificado</span>}
          </div>
          <div style={s.metaRow}>
            {perfil.district && <span style={s.metaItem}>📍 {perfil.district}</span>}
            {perfil.disponible && <span style={s.metaItem}><span style={s.dot} /> Disponible ahora</span>}
            {perfil.valoracionPromedio > 0 && <span style={s.metaItem}>⭐ {perfil.valoracionPromedio.toFixed(1)}</span>}
            {reseñas.length > 0 && <span style={{ color: "#666" }}>📝 {reseñas.length} reseñas</span>}
          </div>
          {perfil.bio && <p style={s.bioText}>{perfil.bio.length > 120 ? perfil.bio.slice(0, 120) + "..." : perfil.bio}</p>}
        </div>

        {user && !esPropioPerfil && (
          <div style={s.headerActions}>
            {puedeContratar && (
              <button style={contratando ? s.btnContratarLoading : s.btnContratar} onClick={handleContratar} disabled={contratando}>
                {contratando ? "Abriendo chat..." : "⊕ Contratar"}
              </button>
            )}
            {contratado && <span style={{ ...s.btnContratar, cursor: "default", opacity: 0.8 }}>✓ Contratado</span>}
            <button style={s.btnSecondary} onClick={handleContactar} disabled={contactando}>
              {contactando ? "Abriendo..." : "✉ Mensaje"}
            </button>
            <button style={s.btnSecondary} onClick={() => {
              navigator.share?.({ title: nombreCompleto, url: window.location.href })
                .catch(() => navigator.clipboard?.writeText(window.location.href));
            }}>
              ↗ Compartir
            </button>
          </div>
        )}
      </div>

      <div style={s.statsGrid}>
        <div style={s.statCard}><div style={s.statValue}>{perfil.totalTrabajos ?? 0}</div><div style={s.statLabel}>Trabajos</div></div>
        <div style={s.statCard}><div style={s.statValue}>{perfil.valoracionPromedio?.toFixed(1) ?? "—"}</div><div style={s.statLabel}>Valoración</div></div>
        <div style={s.statCard}><div style={s.statValue}>{perfil.porcentajeExito ?? 0}%</div><div style={s.statLabel}>Éxito</div></div>
        {añosEnNexora && <div style={s.statCard}><div style={s.statValue}>{añosEnNexora} {añosEnNexora === 1 ? "año" : "años"}</div><div style={s.statLabel}>En Nexora</div></div>}
        {perfil.tarifaEstandar > 0 && <div style={s.statCard}><div style={s.statValue}>S/ {perfil.tarifaEstandar}</div><div style={s.statLabel}>Tarifa estándar</div></div>}
      </div>

      <div style={s.columns}>
        <div style={s.leftCol}>
          <div style={s.section}>
            <div style={s.sectionTitle}>Información</div>
            {perfil.disponibilidad && <div style={s.infoRow}><span style={s.infoIcon}>⏰</span> {perfil.disponibilidad}</div>}
            {creadoEn && <div style={s.infoRow}><span style={s.infoIcon}>📅</span> Miembro desde {creadoEn.getFullYear()}</div>}
            {perfil.website && (
              <div style={s.infoRow}>
                <span style={s.infoIcon}>🌐</span>
                <a href={perfil.website} target="_blank" rel="noreferrer" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "13px" }}>
                  {perfil.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
          {(perfil.habilidades?.length ?? 0) > 0 && (
            <div style={s.section}>
              <div style={s.sectionTitle}>Habilidades</div>
              {perfil.habilidades.map((h) => <span key={h} style={s.chip}>{h}</span>)}
            </div>
          )}
          {reseñas.length > 0 && (
            <div style={s.section}>
              <div style={s.sectionTitle}>Reputación</div>
              <RepBar label="Calidad" value={avgCalidad} />
              <RepBar label="Comunicación" value={avgComunicacion} />
              <RepBar label="Puntualidad" value={avgPuntualidad} />
              <RepBar label="Precio" value={avgPrecio} />
            </div>
          )}
        </div>

        <div style={s.rightCol}>
          <div style={s.section}>
            <div style={s.tabs}>
              <button style={s.tab(tab === "trabajos")} onClick={() => setTab("trabajos")}>Trabajos {solicitudes.length > 0 && solicitudes.length}</button>
              <button style={s.tab(tab === "reseñas")} onClick={() => setTab("reseñas")}>Reseñas {reseñas.length > 0 && reseñas.length}</button>
              {perfil.bio && <button style={s.tab(tab === "sobre")} onClick={() => setTab("sobre")}>Sobre mí</button>}
            </div>

            {tab === "trabajos" && (
              solicitudes.length === 0
                ? <div style={s.emptyMsg}>Sin trabajos publicados aún.</div>
                : solicitudes.map((sol) => (
                  <div key={sol.id} style={s.workCard}>
                    <div style={s.workTopRow}>
                      <span style={s.workTitle}>{sol.titulo}</span>
                      {sol.presupuesto && <span style={s.workAmount}>S/ {sol.presupuesto?.toLocaleString()}</span>}
                    </div>
                    <div style={s.workMeta}>
                      {sol.creadoEn && <span>{sol.creadoEn.toLocaleDateString("es-PE", { month: "short", year: "numeric" })}</span>}
                      {sol.duracion && <span>⏱ {sol.duracion}</span>}
                      <span style={s.statusBadge(sol.estado ?? "activa")}>
                        {sol.estado === "completada" ? "Completado" : sol.estado === "en_progreso" ? "En progreso" : sol.estado === "cancelada" ? "Cancelado" : "Activo"}
                      </span>
                    </div>
                    {sol.descripcion && <div style={s.workDesc}>{sol.descripcion.length > 120 ? sol.descripcion.slice(0, 120) + "..." : sol.descripcion}</div>}
                    {(sol.habilidades?.length ?? 0) > 0 && (
                      <div style={s.tagRow}>{sol.habilidades.slice(0, 4).map((h) => <span key={h} style={s.tag}>{h}</span>)}</div>
                    )}
                  </div>
                ))
            )}

            {tab === "reseñas" && (
              reseñas.length === 0
                ? <div style={s.emptyMsg}>Este trabajador aún no tiene reseñas.</div>
                : reseñas.map((r, i) => (
                  <div key={r.id} style={i === reseñas.length - 1 ? { ...s.reviewCard, borderBottom: "none", marginBottom: 0 } : s.reviewCard}>
                    <div style={s.reviewHeader}>
                      <span style={s.reviewAuthor}>{r.clienteNombre ?? "Cliente"}</span>
                      <span style={s.reviewDate}>{r.creadoEn?.toLocaleDateString?.("es-PE", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <Stars value={getPromedioReseña(r)} />
                    <div style={s.reviewText}>{r.comentario}</div>
                    {r.respuesta && (
                      <div style={{ marginTop: "8px", borderLeft: "2px solid #4a3aaa", paddingLeft: "10px", color: "#666", fontSize: "12px" }}>
                        <strong style={{ color: "#a78bfa" }}>Respuesta:</strong> {r.respuesta}
                      </div>
                    )}
                  </div>
                ))
            )}

            {tab === "sobre" && <div style={s.bioText}>{perfil.bio}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}