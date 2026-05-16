"use client";

const FILTROS = [
  "Todos",
  "Tecnología",
  "Hogar",
  "Diseño",
  "Educación",
  "Legal",
  "Alta valoración",
  "SJL",
];

const s = {
  wrapper: { marginBottom: "16px" },
  searchRow: { display: "flex", gap: "10px", marginBottom: "14px" },
  search: {
    flex: 1,
    backgroundColor: "#13131f",
    border: "1px solid #2a2a3e",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "#ccc",
    fontSize: "14px",
    outline: "none",
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
  tagsRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tag: {
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    border: "1px solid #2a2a3e",
    color: "#888",
    cursor: "pointer",
    background: "transparent",
    fontFamily: "var(--font-dm-sans), sans-serif",
    transition: "all 0.2s",
  },
  tagActive: {
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    border: "1px solid #4a3aaa",
    color: "#a78bfa",
    backgroundColor: "#1e1a3a",
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
  },

  tagAltaValoracion: {
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    border: "1px solid #b45309",
    color: "#fbbf24",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
    transition: "all 0.2s",
  },
  tagAltaValoracionActive: {
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    border: "1px solid #b45309",
    color: "#fbbf24",
    backgroundColor: "#2d1a00",
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
};

export default function FiltrosTags({ busqueda, setBusqueda, filtroActivo, setFiltroActivo }) {
  return (
    <div style={s.wrapper}>
      <div style={s.searchRow}>
        <input
          style={s.search}
          placeholder="Buscar por tipo de trabajo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <div style={s.tagsRow}>
        {FILTROS.map((f) => {
          const isAltaValoracion = f === "Alta valoración";
          const isActive = f === filtroActivo;

          let style;
          if (isAltaValoracion) {
            style = isActive ? s.tagAltaValoracionActive : s.tagAltaValoracion;
          } else {
            style = isActive ? s.tagActive : s.tag;
          }

          return (
            <button
              key={f}
              style={style}
              onClick={() => setFiltroActivo(f)}
              title={isAltaValoracion ? "Muestra solicitudes con 4 o más postulantes" : undefined}
            >
              {isAltaValoracion ? "⭐ " : ""}{f}
            </button>
          );
        })}
      </div>
    </div>
  );
}