"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserRole } from "@/app/hooks/useUserRole";
import { useContratar } from "@/app/hooks/useContratar";
import { useConversaciones } from "@/app/hooks/useConversaciones";
import { useMensajes } from "@/app/hooks/useMensajes";
import { enviarMensaje } from "@/firebase/messages";
import ConversationList from "@/components/Messages/conversationList";

function formatHora(fecha) {
  if (!fecha) return "";
  const d = fecha instanceof Date ? fecha : new Date(fecha);
  return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

function ChatPanel({ conversacion, userId, perfil, rol, contratados, onContratar, onVolver, router }) {
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { mensajes } = useMensajes(conversacion?.id, userId);
  const mensajesEndRef = useRef(null);
  const miNombre = perfil?.first_name ? `${perfil.first_name} ${perfil.last_name}`.trim() : "";
  const misIniciales = perfil?.iniciales || miNombre.slice(0,2).toUpperCase() || "U";

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleEnviar = async () => {
    if (!mensaje.trim() || !conversacion || !userId || enviando) return;
    const texto = mensaje.trim();
    setMensaje("");
    setEnviando(true);
    const otroUid = conversacion.participantes?.find((p) => p !== userId) ?? "";
    try {
      await enviarMensaje(conversacion.id, {
        texto,
        autorId: userId,
        autorNombre: miNombre || "Usuario",
        autorIniciales: misIniciales,
        otroUid,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const puedeContratar = () => {
    if (!conversacion?.solicitudId) return false;
    if (rol !== "cliente") return false;
    if (contratados[conversacion.solicitudId]) return false;
    return true;
  };

  if (!conversacion) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)] p-4">
        Selecciona una conversación
      </div>
    );
  }

  const otroId = conversacion.participantes?.find((p) => p !== userId);
  const nombreOtro = conversacion.nombresParticipantes?.[otroId] || "Usuario";
  const inicialesOtro = nombreOtro.split(" ").slice(0,2).map(n=>n[0]?.toUpperCase()||"").join("") || "U";
  const estaContratado = contratados[conversacion.solicitudId];

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)]">
      {/* Header del chat */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
        <button onClick={onVolver} className="md:hidden p-2 -ml-2 rounded-full hover:bg-[var(--bg-hover)]" aria-label="Volver">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-[var(--accent-bg)] text-[var(--accent-text)]">
          {inicialesOtro}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[var(--text-main)] truncate">{nombreOtro}</div>
          {conversacion.solicitudTitulo && (
            <div className="text-xs text-[var(--text-muted)] truncate">{conversacion.solicitudTitulo}</div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button onClick={() => router.push(`/profile/${otroId}`)} className="btn-secondary text-sm py-1.5 px-3 whitespace-nowrap">
            Ver perfil
          </button>
          {puedeContratar() && !estaContratado && (
            <button onClick={() => onContratar(conversacion)} className="btn-secondary text-sm py-1.5 px-3 whitespace-nowrap">
              Contratar
            </button>
          )}
          {estaContratado && (
            <span className="btn-secondary text-sm py-1.5 px-3 text-[var(--success)] whitespace-nowrap">
              Contratado
            </span>
          )}
        </div>
      </div>

      {/* Mensajes con scroll suave */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {mensajes.map((msg) => {
          const esMio = msg.autorId === userId;
          const esSistema = msg.texto?.startsWith("<");
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${esMio && !esSistema ? "flex-row-reverse" : ""}`}>
              {esSistema ? (
                <div className="w-full flex justify-center">
                  <div className="text-xs px-3 py-1.5 rounded-full bg-[var(--bg-hover)] text-[var(--accent)]">
                    {msg.texto}
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0 bg-[var(--accent-bg)] text-[var(--accent-text)]">
                    {esMio ? misIniciales : (msg.autorIniciales || "U")}
                  </div>
                  <div className="max-w-[75%]">
                    <div className={`px-3 py-2 text-sm rounded-2xl ${esMio ? "rounded-br-md bg-[var(--accent)] text-white" : "rounded-bl-md bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)]"}`}>
                      {msg.texto}
                    </div>
                    <div className={`text-[10px] mt-1 ${esMio ? "text-right" : ""} text-[var(--text-muted)]`}>
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

      <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="flex gap-2">
          <textarea
            rows={1}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-3 py-2 rounded-xl text-sm resize-none outline-none h-10 max-h-32 transition-all bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)]"
          />
          <button onClick={handleEnviar} disabled={enviando} className="btn-primary px-4 flex items-center justify-center" aria-label="Enviar mensaje">
            {enviando ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MensajesContent() {
  const [user, loadingAuth] = useAuthState(auth);
  const { rol, perfil } = useUserRole();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { contratar, contratando, errorContratar } = useContratar();
  const { conversaciones, contratados, setContratados, cargadas } = useConversaciones(user?.uid);

  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarChat, setMostrarChat] = useState(false);
  const seleccionadoIdRef = useRef(null);

  const convIdParam = searchParams?.get("conv") ?? null;

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!loadingAuth && !user) router.push("/login");
  }, [user, loadingAuth, router]);

  // Seleccionar conversación por parámetro URL
  useEffect(() => {
    if (!cargadas || conversaciones.length === 0 || !convIdParam) return;
    const target = conversaciones.find((c) => c.id === convIdParam);
    if (target) {
      setSeleccionado(target);
      setMostrarChat(true);
      router.replace("/messages", { scroll: false });
    }
  }, [cargadas, conversaciones, convIdParam, router]);

  // Seleccionar primera conversación si no hay seleccionada
  useEffect(() => {
    if (!cargadas) return;
    if (!seleccionado && conversaciones.length > 0) {
      const primera = conversaciones[0];
      setSeleccionado(primera);
      seleccionadoIdRef.current = primera.id;
    } else if (seleccionado) {
      seleccionadoIdRef.current = seleccionado.id;
    }
  }, [cargadas, conversaciones, seleccionado]);

  // Actualizar conversación seleccionada si cambia la lista
  useEffect(() => {
    const currentId = seleccionadoIdRef.current;
    if (!currentId) return;
    const actualizada = conversaciones.find((c) => c.id === currentId);
    if (actualizada && actualizada !== seleccionado) {
      setSeleccionado(actualizada);
    }
  }, [conversaciones, seleccionado]);

  const handleContratarWrapper = useCallback(async (conv) => {
    if (!user || !conv) return;
    if (!confirm("¿Confirmas que deseas contratar a este trabajador?")) return;
    const otroUid = conv.participantes?.find((p) => p !== user.uid) ?? "";
    const otroNombre = conv.nombresParticipantes?.[otroUid] ?? "Trabajador";
    const miNombre = perfil?.first_name ? `${perfil.first_name} ${perfil.last_name}`.trim() : "Cliente";
    const result = await contratar({
      solicitudId: conv.solicitudId,
      trabajadorId: otroUid,
      trabajadorNombre: otroNombre,
      clientId: user.uid,
      clienteNombre: miNombre,
      convId: conv.id,
    });
    if (result.success) {
      setContratados((prev) => ({ ...prev, [conv.solicitudId]: true }));
    }
  }, [user, perfil, contratar, setContratados]);

  if (loadingAuth) {
    return (
      <div className="flex h-[calc(100vh-90px)] items-center justify-center bg-[var(--bg-main)]">
        <div className="w-8 h-8 rounded-full border-2 animate-spin border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-90px)] overflow-hidden bg-[var(--bg-main)]">
      <div className={`${mostrarChat ? "hidden" : "flex"} md:flex w-full md:w-80 flex-col border-r border-[var(--border-color)]`}>
        <ConversationList
          conversaciones={conversaciones}
          seleccionadoId={seleccionado?.id}
          userId={user?.uid}
          onSelect={(conv) => { setSeleccionado(conv); setMostrarChat(true); }}
        />
      </div>
      <div className={`${mostrarChat ? "flex" : "hidden"} md:flex flex-1 w-full`}>
        <ChatPanel
          conversacion={seleccionado}
          userId={user?.uid}
          perfil={perfil}
          rol={rol}
          contratados={contratados}
          onContratar={handleContratarWrapper}
          onVolver={() => setMostrarChat(false)}
          router={router}
        />
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex h-[calc(100vh-90px)] items-center justify-center bg-[var(--bg-main)]"><div className="text-white">Cargando chat...</div></div>}>
      <MensajesContent />
    </Suspense>
  );
}