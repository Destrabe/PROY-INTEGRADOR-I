"use client";

function getIniciales(nombre = "") {
  return nombre.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("");
}

function formatHora(fecha) {
  if (!fecha) return "";
  const d = fecha instanceof Date ? fecha : new Date(fecha);
  return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

export default function ConversationList({ conversaciones, seleccionadoId, userId, onSelect }) {
  return (
    <div className="w-full md:w-80 flex-col border-r border-[var(--border-color)] flex">
      <div className="p-5 border-b border-[var(--border-light)]">
        <h2 className="text-xl font-extrabold mb-3 font-syne">Mensajes</h2>
        <label htmlFor="buscar-conversacion" className="sr-only">Buscar conversación</label>
        <input
          id="buscar-conversacion"
          type="text"
          placeholder="Buscar conversación..."
          className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)]"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversaciones.length === 0 && (
          <div className="p-6 text-center text-sm text-[var(--text-muted)]">
            <p>No tienes conversaciones aún.</p>
            <p className="text-xs mt-1">
              Ve al{" "}
              <a href="/feedJobs" className="underline text-[var(--accent)]">feed de trabajos</a>{" "}
              y usa el botón &quot;Contactar&quot;.
            </p>
          </div>
        )}
        {conversaciones.map((conv) => {
          const otroId = conv.participantes?.find((p) => p !== userId);
          const nombreOtro = conv.nombresParticipantes?.[otroId] || "Usuario";
          const noLeido = conv.noLeido?.[userId] > 0;
          const activa = seleccionadoId === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => onSelect(conv)}
              className={`flex items-center gap-3 px-5 py-4 cursor-pointer border-b transition-all ${
                activa
                  ? "bg-[var(--accent-bg)] border-l-4 border-l-[var(--accent)]"
                  : "hover:bg-[var(--bg-hover)]"
              }`}
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-[var(--accent-bg)] text-[var(--accent-text)]">
                {getIniciales(nombreOtro)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-semibold text-[var(--text-main)]">{nombreOtro}</div>
                <div className="text-xs truncate text-[var(--text-muted)]">
                  {conv.ultimoMensaje || "Sin mensajes"}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-xs text-[var(--text-muted)]">{formatHora(conv.ultimaHora)}</div>
                {noLeido && <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}