"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { escucharConversaciones, enviarMensaje } from "@/firebase/Mensajes";
import { useMensajes } from "@/app/Hooks/useMensajes";
import { useUserRole } from "@/app/Hooks/useUserRole";
import { useContratar } from "@/app/Hooks/useContratar";

function formatHora(fecha) {
  if (!fecha) return "";
  const d = fecha instanceof Date ? fecha : new Date(fecha);
  return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

function getIniciales(nombre = "") {
  return nombre.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("");
}

function BotonContratar({ onConfirmar, contratando }) {
  const [confirmando, setConfirmando] = useState(false);

  if (contratando) {
    return <span style={btn.loading}>Contratando...</span>;
  }

  if (confirmando) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ color: "#9090A8", fontSize: "12px" }}>¿Confirmar?</span>
        <button
          style={btn.confirmar}
          onClick={() => { setConfirmando(false); onConfirmar(); }}
        >
          Sí, contratar
        </button>
        <button style={btn.cancelarConfirm} onClick={() => setConfirmando(false)}>
          No
        </button>
      </div>
    );
  }

  return (
    <button style={btn.contratar} onClick={() => setConfirmando(true)}>
      Contratar
    </button>
  );
}

const btn = {
  contratar: {
    padding: "6px 14px",
    borderRadius: "8px",
    backgroundColor: "#22c55e18",
    color: "#22C55E",
    border: "1px solid #16a34a",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
    transition: "background 0.2s",
  },
  confirmar: {
    padding: "5px 12px",
    borderRadius: "8px",
    backgroundColor: "#22c55e",
    color: "#fff",
    border: "none",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
  cancelarConfirm: {
    padding: "5px 10px",
    borderRadius: "8px",
    backgroundColor: "transparent",
    color: "#9090A8",
    border: "1px solid #2A2A38",
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
  },
  loading: {
    color: "#9090A8",
    fontSize: "12px",
    fontStyle: "italic",
  },
};

export default function MensajesPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const { rol, perfil }     = useUserRole();
  const router              = useRouter();
  const searchParams        = useSearchParams();
  const { contratar, contratando, errorContratar } = useContratar();

  const [conversaciones, setConversaciones] = useState([]);
  const [seleccionado,   setSeleccionado]   = useState(null);
  const [mensaje,        setMensaje]        = useState("");
  const [mostrarChat,    setMostrarChat]    = useState(false);
  const [enviando,       setEnviando]       = useState(false);
  const [contratados,    setContratados]    = useState({});
  const [convsCargadas,  setConvsCargadas]  = useState(false);

  const mensajesEndRef = useRef(null);
  const { mensajes } = useMensajes(seleccionado?.id, user?.uid);

  const miNombreCompleto = perfil?.first_name
    ? `${perfil.first_name} ${perfil.last_name}`.trim()
    : user?.displayName || user?.email || "Usuario";
  const miIniciales = perfil?.iniciales || getIniciales(miNombreCompleto);
  useEffect(() => {
    if (!loadingAuth && !user) router.push("/login");
  }, [user, loadingAuth, router]);

  useEffect(() => {
    if (!user) return;
    const unsub = escucharConversaciones(user.uid, (convs) => {
      setConversaciones(convs);

      const yaContratadosMap = {};
      convs.forEach((c) => {
        if (c.solicitudContratada && c.solicitudId) {
          yaContratadosMap[c.solicitudId] = true;
        }
      });
      setContratados((prev) => ({ ...prev, ...yaContratadosMap }));
      setConvsCargadas(true);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!convsCargadas || conversaciones.length === 0) return;
    const convIdParam = searchParams?.get("conv");
    if (convIdParam) {
      const target = conversaciones.find((c) => c.id === convIdParam);
      if (target) {
        setSeleccionado(target);
        setMostrarChat(true);
      }
      router.replace("/mensajes", { scroll: false });
    }
  }, [convsCargadas, conversaciones, searchParams, router]);

  useEffect(() => {
    if (!convsCargadas) return;
    const convIdParam = searchParams?.get("conv");
    if (!convIdParam && !seleccionado && conversaciones.length > 0) {
      setSeleccionado(conversaciones[0]);
    }
  }, [convsCargadas, conversaciones, seleccionado, searchParams]);

  useEffect(() => {
    if (!seleccionado) return;
    const actualizada = conversaciones.find((c) => c.id === seleccionado.id);
    if (actualizada && actualizada !== seleccionado) {
      setSeleccionado(actualizada);
    }
  }, [conversaciones, seleccionado]);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleEnviar = async () => {
    if (!mensaje.trim() || !seleccionado || !user || enviando) return;
    const texto = mensaje.trim();
    setMensaje("");
    setEnviando(true);
    const otroUid = seleccionado.participantes?.find((p) => p !== user.uid) ?? "";
    try {
      await enviarMensaje(seleccionado.id, {
        texto,
        autorId: user.uid,
        autorNombre: miNombreCompleto,
        autorIniciales: miIniciales,
        otroUid,
      });
    } catch (err) {
      console.error("[MensajesPage] Error al enviar:", err);
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEnviar(); }
  };

  const handleContratar = async () => {
    if (!seleccionado || !user) return;
    const otroUid    = seleccionado.participantes?.find((p) => p !== user.uid) ?? "";
    const otroNombre = seleccionado.nombresParticipantes?.[otroUid] ?? "Trabajador";
    const clienteNombre = miNombreCompleto;
    const result = await contratar({
      solicitudId: seleccionado.solicitudId,
      trabajadorId: otroUid,
      trabajadorNombre: otroNombre,
      clienteId: user.uid,
      clienteNombre,
      convId: seleccionado.id,
    });
    if (result.success) {
      setContratados((prev) => ({ ...prev, [seleccionado.solicitudId]: true }));
    }
  };

  const puedeContratar = (conv) => {
    if (!conv?.solicitudId) return false;
    if (rol !== "cliente") return false;
    if (contratados[conv.solicitudId]) return false;
    return true;
  };

  if (loadingAuth) {
    return (
      <div className="flex h-[calc(100vh-90px)] bg-[#0A0A0F] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#6C63FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-90px)] bg-[#0A0A0F] text-white font-sans overflow-hidden">
      {/* Lista de conversaciones */}
      <div className={`${mostrarChat ? "hidden" : "flex"} md:flex w-full md:w-80 border-r border-[#2A2A38] flex-col`}>
        <div className="p-5 border-b border-[#0c0c3e]">
          <h2 className="text-xl font-extrabold mb-3" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            Mensajes
          </h2>
          <input
            className="w-full px-3 py-2 rounded-lg bg-[#111118] border border-[#2A2A38] text-white text-sm outline-none focus:border-[#6C63FF] transition-all"
            placeholder="Buscar conversación..."
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {conversaciones.length === 0 && convsCargadas && (
            <div className="p-6 text-center text-[#555] text-sm">
              <p>No tienes conversaciones aún.</p>
              <p className="text-xs mt-1">
                Ve al{" "}
                <a href="/FeedTrabajos" className="text-[#6C63FF] underline">feed de trabajos</a>
                {" "}y usa el botón &ldquo;Contactar&rdquo; en una solicitud.
              </p>
            </div>
          )}

          {conversaciones.map((conv) => {
            const otroUid    = conv.participantes?.find((p) => p !== user?.uid);
            const otroNombre = conv.nombresParticipantes?.[otroUid] ?? "Usuario";
            const noLeido    = (conv.noLeido?.[user?.uid] ?? 0) > 0;
            const yaContratado = contratados[conv.solicitudId];

            return (
              <div
                key={conv.id}
                onClick={() => { setSeleccionado(conv); setMostrarChat(true); }}
                className={`flex items-center gap-3 px-5 py-4 cursor-pointer border-b border-[#1a1a24] transition-all ${
                  seleccionado?.id === conv.id
                    ? "bg-[#111118] border-l-4 border-l-[#6C63FF]"
                    : "hover:bg-[#111118]"
                }`}
              >
                <div className="relative w-10 h-10 rounded-full bg-[#6c63ff22] flex items-center justify-center text-[#8B85FF] text-xs font-bold shrink-0">
                  {getIniciales(otroNombre)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-semibold text-[#F0F0F8]">{otroNombre}</div>
                  <div className="text-xs text-[#606078] truncate">
                    {conv.ultimoMensaje || "Sin mensajes"}
                  </div>
                  {conv.solicitudTitulo && (
                    <div className="text-xs truncate" style={{ color: yaContratado ? "#22C55E" : "#4a3aaa" }}>
                      {yaContratado ? "✓ Contratado · " : ""}{conv.solicitudTitulo}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-[#606078]">{formatHora(conv.ultimaHora)}</div>
                  {noLeido && <span className="w-2 h-2 rounded-full bg-[#6C63FF]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel de chat */}
      <div className={`${mostrarChat ? "flex" : "hidden"} md:flex flex-1 flex-col`}>
        {!seleccionado ? (
          <div className="flex-1 flex items-center justify-center text-[#555] text-sm">
            Selecciona una conversación
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2A2A38]">
              <button
                className="md:hidden text-[#9090A8] mr-1 p-2 rounded-full hover:bg-[#1A1A28] active:bg-[#2A2A38] transition-all cursor-pointer"
                onClick={() => setMostrarChat(false)}
              >
                <ArrowLeft size={20} />
              </button>

              <div className="relative w-10 h-10 rounded-full bg-[#6c63ff22] flex items-center justify-center text-[#8B85FF] text-xs font-bold shrink-0">
                {getIniciales(
                  seleccionado.nombresParticipantes?.[
                    seleccionado.participantes?.find((p) => p !== user?.uid)
                  ] ?? "U"
                )}
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold text-[#F0F0F8]">
                  {seleccionado.nombresParticipantes?.[
                    seleccionado.participantes?.find((p) => p !== user?.uid)
                  ] ?? "Usuario"}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  className="px-3 py-1.5 rounded-lg border border-[#2A2A38] text-sm text-[#F0F0F8] bg-transparent cursor-pointer hover:bg-[#2A2A38] transition-all"
                  onClick={() => {
                    const otroUid = seleccionado.participantes?.find((p) => p !== user?.uid);
                    if (otroUid) router.push(`/perfil/${otroUid}`);
                  }}
                >
                  Ver perfil
                </button>

                {puedeContratar(seleccionado) && (
                  <BotonContratar onConfirmar={handleContratar} contratando={contratando} />
                )}

                {contratados[seleccionado.solicitudId] && (
                  <span style={{
                    padding: "5px 12px",
                    borderRadius: "8px",
                    backgroundColor: "#14532d",
                    color: "#4ade80",
                    border: "1px solid #16a34a",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}>
                    ✓ Contratado
                  </span>
                )}
              </div>
            </div>

            {errorContratar && (
              <div className="px-6 py-2 bg-[#2d0a0a] border-b border-[#5a1a1a] text-[#f87171] text-xs">
                {errorContratar}
              </div>
            )}

            {seleccionado.solicitudTitulo && (
              <div className="px-6 py-2.5 bg-[#111118] border-b border-[#2A2A38] text-sm text-[#9090A8] flex items-center justify-between">
                <span>
                  Trabajo:{" "}
                  <strong className="text-[#6C63FF]">{seleccionado.solicitudTitulo}</strong>
                </span>
                {contratados[seleccionado.solicitudId] && (
                  <span style={{
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "20px",
                    backgroundColor: "#14532d",
                    color: "#4ade80",
                    border: "1px solid #16a34a",
                    fontWeight: 600,
                  }}>
                    En progreso
                  </span>
                )}
              </div>
            )}

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
              {mensajes.map((msg) => {
                const esMio    = msg.autorId === user?.uid;
                const esSistema = msg.texto?.startsWith("🎉");

                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${esMio && !esSistema ? "flex-row-reverse" : ""}`}>
                    {esSistema ? (
                      <div className="w-full flex justify-center">
                        <div style={{
                          backgroundColor: "#0f2d1a",
                          border: "1px solid #166534",
                          borderRadius: "12px",
                          padding: "8px 16px",
                          color: "#4ade80",
                          fontSize: "13px",
                          maxWidth: "80%",
                          textAlign: "center",
                        }}>
                          {msg.texto}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-7 h-7 rounded-full bg-[#6c63ff22] flex items-center justify-center text-[#8B85FF] text-[9px] font-semibold shrink-0">
                          {esMio ? miIniciales : msg.autorIniciales}
                        </div>
                        <div>
                          <div className={`px-4 py-3 text-sm max-w-md leading-relaxed ${
                            esMio
                              ? "bg-[#6C63FF] text-white rounded-2xl rounded-br-md"
                              : "bg-[#111118] border border-[#2A2A38] text-[#F0F0F8] rounded-2xl rounded-bl-md"
                          }`}>
                            {msg.texto}
                          </div>
                          <div className={`text-xs text-[#606078] mt-1 ${esMio ? "text-right" : ""}`}>
                            {formatHora(msg.hora)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              <div ref={mensajesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-3 px-6 py-4 border-t border-[#2A2A38]">
              <textarea
                className="flex-1 px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38] text-white text-sm resize-none outline-none h-12 focus:border-[#6C63FF] transition-all"
                placeholder="Escribe un mensaje..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleEnviar}
                disabled={enviando || !mensaje.trim()}
                className="w-12 h-12 rounded-xl bg-[#6C63FF] text-white text-lg cursor-pointer hover:bg-[#5a52e0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➤
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}