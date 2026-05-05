"use client";
import { useState } from "react";

const solicitudesIniciales = [
  {
    id: 1,
    iniciales: "YS",
    nombre: "Yadhira Saavedra",
    distrito: "SJL",
    tiempo: "hace 2 horas",
    titulo: "Necesito técnico para reparar laptop con pantalla rota",
    descripcion: "Mi laptop Dell 15 no enciende y la pantalla está rota (línea verde). Necesito alguien de confianza que pueda venir a domicilio o recibir el equipo. Garantía vencida",
    tags: ["Tecnología", "Hardware"],
    postulantes: 5,
    precio: "s/ 80 – 150",
    urgente: true,
  },
  {
    id: 2,
    iniciales: "TS",
    nombre: "Tom Sarmiento",
    distrito: "SJL",
    tiempo: "hace 2 horas",
    titulo: "Necesito diseñador para logo de empresa",
    descripcion: "Necesito un diseñador gráfico para crear el logo de mi empresa. Tengo referencias y colores definidos. El trabajo es remoto.",
    tags: ["Diseño", "Branding"],
    postulantes: 3,
    precio: "s/ 120 – 200",
    urgente: false,
  },
  {
    id: 3,
    iniciales: "DH",
    nombre: "Dajhana Huaccha",
    distrito: "SJL",
    tiempo: "hace 3 horas",
    titulo: "Necesito técnico para reparar laptop con pantalla rota",
    descripcion: "Mi laptop Dell 15 no enciende y la pantalla está rota (línea verde). Necesito alguien de confianza que pueda venir a domicilio o recibir el equipo. Garantía vencida",
    tags: ["Tecnología", "Hardware"],
    postulantes: 5,
    precio: "s/ 80 – 150",
    urgente: true,
  },
  {
    id: 4,
    iniciales: "MR",
    nombre: "Marco Rivera",
    distrito: "Miraflores",
    tiempo: "hace 1 hora",
    titulo: "Profesor de matemáticas para secundaria",
    descripcion: "Busco profesor para reforzamiento de álgebra y geometría para estudiante de 4to de secundaria. Clases presenciales 3 veces por semana.",
    tags: ["Educación"],
    postulantes: 7,
    precio: "s/ 50 – 80",
    urgente: false,
  },
  {
    id: 5,
    iniciales: "LP",
    nombre: "Lucía Paredes",
    distrito: "San Borja",
    tiempo: "hace 4 horas",
    titulo: "Necesito gasfitero urgente para fuga de agua",
    descripcion: "Tengo una fuga de agua en el baño principal. Necesito atención hoy mismo. El problema parece estar en la tubería bajo el lavatorio.",
    tags: ["Hogar"],
    postulantes: 2,
    precio: "s/ 60 – 100",
    urgente: true,
  },
];

const filtros = ["Todos", "Tecnología", "Hogar", "Diseño", "Educación", "Legal", "Alta valoración", "SJL"];

const avatarColores = {
  YS: "#2d1a5e",
  TS: "#0f2d1a",
  DH: "#2d1a0a",
  MR: "#0a1a2d",
  LP: "#2d0a1a",
};

const s = {
  layout: { display: "flex", backgroundColor: "#0a0a0f", minHeight: "calc(100vh - 90px)" },
  sidebar: { width: "180px", backgroundColor: "#0d0d18", borderRight: "1px solid #1a1a2e", padding: "24px 16px", flexShrink: 0 },
  sidebarLogo: { fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "22px", color: "#fff", display: "flex", marginBottom: "20px" },
  sidebarDot: { color: "#500fe9" },
  sidebarSection: { fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
  sidebarItem: { backgroundColor: "#1e1a3a", color: "#a78bfa", fontSize: "13px", fontWeight: 500, padding: "8px 12px", borderRadius: "8px", cursor: "pointer" },
  main: { flex: 1, padding: "30px 36px" },
  title: { fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "28px", color: "#fff", marginBottom: "4px" },
  subtitle: { color: "#888", fontSize: "14px", marginBottom: "20px" },
  searchRow: { display: "flex", gap: "10px", marginBottom: "16px" },
  search: { flex: 1, backgroundColor: "#13131f", border: "1px solid #2a2a3e", borderRadius: "10px", padding: "10px 16px", color: "#ccc", fontSize: "14px", outline: "none", fontFamily: "var(--font-dm-sans), sans-serif" },
  filterBtn: { backgroundColor: "#1a1a2e", border: "1px solid #2a2a3e", color: "#ccc", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif" },
  tagsRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" },
  tag: { padding: "5px 14px", borderRadius: "20px", fontSize: "13px", border: "1px solid #2a2a3e", color: "#888", cursor: "pointer", transition: "all 0.2s" },
  tagActive: { padding: "5px 14px", borderRadius: "20px", fontSize: "13px", border: "1px solid #4a3aaa", color: "#a78bfa", backgroundColor: "#1e1a3a", cursor: "pointer" },
  count: { color: "#666", fontSize: "13px", marginBottom: "16px" },
  countBold: { color: "#fff", fontWeight: 600 },
  card: { backgroundColor: "#13131f", border: "1px solid #1e1e30", borderRadius: "14px", padding: "20px 22px", marginBottom: "14px", transition: "border-color 0.2s" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  cardMeta: { display: "flex", alignItems: "center", gap: "10px" },
  metaName: { color: "#aaa", fontSize: "13px" },
  metaTime: { color: "#555" },
  cardRight: { textAlign: "right" },
  badgeUrgente: { display: "inline-block", backgroundColor: "#2d0a0a", color: "#f87171", border: "1px solid #5a1a1a", borderRadius: "20px", fontSize: "11px", padding: "3px 10px", marginBottom: "4px" },
  price: { display: "block", color: "#a78bfa", fontSize: "14px", fontWeight: 600 },
  cardTitle: { color: "#f0f0ff", fontSize: "16px", fontWeight: 600, marginBottom: "8px", fontFamily: "var(--font-syne), sans-serif" },
  cardDesc: { color: "#777", fontSize: "13px", lineHeight: 1.6, marginBottom: "14px" },
  chips: { display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" },
  chip: { backgroundColor: "#1a1a2e", color: "#9a9ab0", borderRadius: "6px", fontSize: "12px", padding: "4px 10px" },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardStats: { display: "flex", gap: "20px", color: "#555", fontSize: "13px" },
  applyBtn: { backgroundColor: "#500fe9", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 18px", fontSize: "13px", cursor: "pointer", fontWeight: 500, fontFamily: "var(--font-dm-sans), sans-serif", transition: "background-color 0.2s" },
  appliedBtn: { backgroundColor: "#1a2d1a", color: "#4ade80", border: "1px solid #166534", borderRadius: "8px", padding: "8px 18px", fontSize: "13px", cursor: "pointer", fontWeight: 500, fontFamily: "var(--font-dm-sans), sans-serif", transition: "all 0.2s" },
  emptyState: { textAlign: "center", padding: "60px 20px", color: "#555" },
  emptyIcon: { fontSize: "40px", marginBottom: "12px" },
  emptyText: { fontSize: "16px", color: "#666", marginBottom: "6px" },
  emptySubtext: { fontSize: "13px", color: "#444" },
};

export default function FeedTrabajos() {
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [postulados, setPostulados] = useState({});

  const togglePostulacion = (id) => {
    setPostulados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const solicitudesFiltradas = solicitudesIniciales.filter((sol) => {
    const coincideFiltro =
      filtroActivo === "Todos" ||
      filtroActivo === "Alta valoración" ||
      (filtroActivo === "SJL" && sol.distrito === "SJL") ||
      sol.tags.some((t) => t === filtroActivo);

    const coincideBusqueda =
      busqueda === "" ||
      sol.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      sol.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      sol.tags.some((t) => t.toLowerCase().includes(busqueda.toLowerCase()));

    return coincideFiltro && coincideBusqueda;
  });

  return (
    <div style={s.layout}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>
          Nexora<span style={s.sidebarDot}>.</span>
        </div>
        <p style={s.sidebarSection}>Explorar</p>
        <div style={s.sidebarItem}>Feed de trabajos</div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <h1 style={s.title}>Feed de trabajos</h1>
        <p style={s.subtitle}>Encuentra solicitudes que coincidan con tus habilidades</p>

        {/* Búsqueda */}
        <div style={s.searchRow}>
          <input
            style={s.search}
            placeholder="Buscar por tipo de trabajo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button style={s.filterBtn}>Filtros</button>
        </div>

        {/* Tags */}
        <div style={s.tagsRow}>
          {filtros.map((f) => (
            <span
              key={f}
              style={f === filtroActivo ? s.tagActive : s.tag}
              onClick={() => setFiltroActivo(f)}
            >
              {f}
            </span>
          ))}
        </div>

        <p style={s.count}>
          Mostrando <span style={s.countBold}>{solicitudesFiltradas.length} solicitudes</span> cerca de ti
        </p>

        {/* Tarjetas */}
        {solicitudesFiltradas.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>🔍</div>
            <p style={s.emptyText}>No se encontraron solicitudes</p>
            <p style={s.emptySubtext}>Intenta con otro filtro o término de búsqueda</p>
          </div>
        ) : (
          solicitudesFiltradas.map((sol) => (
            <div key={sol.id} style={{ ...s.card, borderColor: postulados[sol.id] ? "#166534" : "#1e1e30" }}>
              <div style={s.cardTop}>
                <div style={s.cardMeta}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: avatarColores[sol.iniciales] || "#2d1a5e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: "#fff", flexShrink: 0 }}>
                    {sol.iniciales}
                  </div>
                  <span style={s.metaName}>
                    {sol.nombre} · {sol.distrito} · <span style={s.metaTime}>{sol.tiempo}</span>
                  </span>
                </div>
                <div style={s.cardRight}>
                  {sol.urgente && <span style={s.badgeUrgente}>Urgente</span>}
                  <span style={s.price}>{sol.precio}</span>
                </div>
              </div>

              <h2 style={s.cardTitle}>{sol.titulo}</h2>
              <p style={s.cardDesc}>{sol.descripcion}</p>

              <div style={s.chips}>
                {sol.tags.map((t) => (
                  <span key={t} style={s.chip}>{t}</span>
                ))}
              </div>

              <div style={s.cardBottom}>
                <div style={s.cardStats}>
                  <span>{sol.postulantes + (postulados[sol.id] ? 1 : 0)} postulantes</span>
                  <span>{sol.distrito}</span>
                  <span>Hoy mismo</span>
                </div>
                <button
                  style={postulados[sol.id] ? s.appliedBtn : s.applyBtn}
                  onClick={() => togglePostulacion(sol.id)}
                >
                  {postulados[sol.id] ? "✓ Postulado — Cancelar" : "Postularme"}
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
