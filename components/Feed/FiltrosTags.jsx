"use client";

import { useThemeStore } from "@/store/themeStore";

export default function FiltrosTags({
  busqueda,
  setBusqueda,
  filtroActivo,
  setFiltroActivo,
}) {
  // 1. Traemos tu store original
  const theme = useThemeStore((state) => state.theme);
  const textColor = useThemeStore((state) => state.textColor);

  // 2. Definimos los filtros según tu imagen
  const filtros = [
    "Todos",
    "Tecnología",
    "Hogar",
    "Diseño",
    "Educación",
    "Legal",
    "Alta valoración",
    "SJL",
  ];

  // 3. Colores dinámicos para el input y los bordes
  const inputBg = theme === "dark" ? "#111118" : "#f4f4f5";
  const defaultBorder = theme === "dark" ? "rgba(255,255,255,0.1)" : "#e4e4e7";

  return (
    <div className="flex flex-col gap-4 mb-5">
      {/* Input de Búsqueda */}
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por tipo de trabajo..."
        className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
        style={{
          backgroundColor: inputBg,
          borderColor: defaultBorder,
          color: textColor[theme],
        }}
      />

      {/* Botones de Filtros (Tags) */}
      <div className="flex flex-wrap gap-2">
        {filtros.map((tag) => {
          const isActive = filtroActivo === tag;
          
          return (
            <button
              key={tag}
              onClick={() => setFiltroActivo(tag)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors border`}
              style={{
                // Si está activo, lo pintamos de morado. Si no, fondo transparente.
                backgroundColor: isActive ? "#2b1b54" : "transparent",
                // Si está activo el borde es morado, si no, usa el borde por defecto (claro u oscuro)
                borderColor: isActive ? "#6c63ff" : defaultBorder,
                // Si está activo la letra es morada clara, si no, usa el color de texto del tema
                color: isActive ? "#aaa5ff" : textColor[theme],
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}