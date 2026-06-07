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

export default function FiltrosTags({ busqueda, setBusqueda, filtroActivo, setFiltroActivo }) {
  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Buscar por tipo de trabajo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 rounded-xl px-4 py-2 text-sm outline-none transition-all"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            color: "var(--text-main)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => {
          const isActive = f === filtroActivo;
          const isAltaValoracion = f === "Alta valoración";

          let buttonStyle = {
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "var(--font-dm-sans), sans-serif",
            background: isActive
              ? "var(--accent-bg)"
              : isAltaValoracion
              ? "transparent"
              : "transparent",
            color: isActive
              ? "var(--accent-text)"
              : isAltaValoracion
              ? "var(--warning)"
              : "var(--text-secondary)",
            border: isActive
              ? "none"
              : isAltaValoracion
              ? `1px solid var(--warning)`
              : `1px solid var(--border-color)`,
          };

          return (
            <button
              key={f}
              style={buttonStyle}
              onClick={() => setFiltroActivo(f)}
              title={isAltaValoracion ? "Muestra solicitudes con 4 o más postulantes" : undefined}
            >
              {isAltaValoracion ? "⭐ " : ""}
              {f}
            </button>
          );
        })}
      </div>
    </div>
  );
}