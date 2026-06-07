"use client";

import { useState } from "react";
import { crearReseña } from "@/firebase/Reviews";

function StarRating({ value, onChange, label }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex flex-col items-center gap-2 p-4" style={{ borderRight: "1px solid var(--border-color)" }}>
      <span className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="text-2xl cursor-pointer transition-all"
            style={{ color: (hover || value) >= i ? "#f59e0b" : "var(--border-color)" }}
            onClick={() => onChange(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>
      <span className="font-bold" style={{ color: "var(--text-main)" }}>{value}/5</span>
    </div>
  );
}

export default function ReseñaForm({
  solicitudId,
  trabajadorId,
  trabajadorNombre,
  clienteId,
  clienteNombre,
  onClose,
  onSuccess,
}) {
  const [calidad, setCalidad] = useState(5);
  const [puntualidad, setPuntualidad] = useState(5);
  const [precio, setPrecio] = useState(5);
  const [comunicacion, setComunicacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  const promedio = ((calidad + puntualidad + precio + comunicacion) / 4).toFixed(1);

  const handleSubmit = async () => {
    setEnviando(true);
    const result = await crearReseña({
      trabajadorId,
      clienteId,
      clienteNombre,
      solicitudId,
      calidad,
      puntualidad,
      precio,
      comunicacion,
      comentario,
    });
    setEnviando(false);
    if (result.success) {
      onSuccess?.();
      onClose();
    } else {
      alert("Error al guardar la reseña: " + (result.error?.message || "Intenta de nuevo"));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 border-b" style={{ borderColor: "var(--border-color)" }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: "rgba(13,13,24,0.8)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
          >
            ✕
          </button>
          <span className="inline-block mb-2 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "var(--accent-bg)", color: "var(--accent-text)" }}>
            Trabajo completado
          </span>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
            Califica a {trabajadorNombre}
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Tu opinión ayuda a otros clientes a elegir mejor</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>Valoración</p>
            <div className="grid grid-cols-2 rounded-xl overflow-hidden border" style={{ borderColor: "var(--border-color)" }}>
              <StarRating value={calidad} onChange={setCalidad} label="Calidad" />
              <StarRating value={puntualidad} onChange={setPuntualidad} label="Puntualidad" />
              <StarRating value={precio} onChange={setPrecio} label="Precio" />
              <StarRating value={comunicacion} onChange={setComunicacion} label="Comunicación" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-hover)", border: "1px solid var(--border-color)" }}>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Puntuación promedio</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xl">★</span>
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>{promedio}</span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>/5</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>Comentario <span className="normal-case text-xs" style={{ color: "var(--text-muted)" }}>(opcional)</span></p>
            <textarea
              rows={3}
              className="w-full rounded-xl p-3 text-sm outline-none transition-all"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}
              placeholder="¿Cómo fue tu experiencia trabajando con este profesional?"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleSubmit} disabled={enviando} className="btn-primary flex-1">
              {enviando ? "Enviando..." : "Publicar reseña"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}