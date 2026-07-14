"use client";
import React, { useState, useEffect, Suspense } from "react";
import { io } from "socket.io-client";
import FirebaseAuthWatcher from "../authWatcher";
import { useThemeStore } from "@/store/themeStore";
import { useAuth } from "@/components/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

const obtenerIniciales = (nombre) => {
  if (!nombre) return null;
  const partes = nombre.trim().split(" ");
  const iniciales =
    `${partes[0]?.[0] || ""}${partes[1]?.[0] || ""}`.toUpperCase();
  return iniciales || null;
};

function MensajesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const workerId = searchParams.get("workerId");
  const jobId = searchParams.get("jobId");
  const [conversaciones, setConversaciones] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mostrarChat, setMostrarChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [usuariosOnline, setUsuariosOnline] = useState([]);

  const theme = useThemeStore((state) => state.theme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);

  const borderColor = theme === "dark" ? "border-[#2A2A38]" : "border-gray-200";
  const itemHoverBg =
    theme === "dark" ? "hover:bg-[#111118]" : "hover:bg-gray-100";
  const itemActiveBg = theme === "dark" ? "bg-[#111118]" : "bg-gray-50";
  const inputBg = theme === "dark" ? "bg-[#111118]" : "bg-white";

  const obtenerDatosOtroUsuario = (conv) => {
    if (conv.id === "nexora-bienvenida") {
      return { nombre: conv.nombre, iniciales: conv.iniciales };
    }
    if (conv.participants && user?.uid) {
      const otroUid = conv.id.split("_").find((id) => id !== user.uid);
      if (otroUid && conv.participants[otroUid]) {
        return conv.participants[otroUid];
      }
    }
    return {
      nombre: conv.nombre || "Usuario",
      iniciales: conv.iniciales || "??",
    };
  };

  useEffect(() => {
    const inicializarChatNuevo = async () => {
      if (workerId && user && !cargando) {
        const chatId = [user.uid, workerId].sort().join("_");
        const chatExistente = conversaciones.find((c) => c.id === chatId);

        if (chatExistente) {
          setSeleccionado(chatExistente);
          setMostrarChat(true);
        } else {
          const miNombre =
            user.displayName ||
            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
            "Usuario";
          const misIniciales = obtenerIniciales(miNombre);
          let nombreDestino = "Usuario";
          let inicialesDestino = "??";
          try {
            const userSnap = await getDoc(doc(db, "users", workerId));
            if (userSnap.exists()) {
              const uData = userSnap.data();
              nombreDestino =
                uData.displayName ||
                `${uData.first_name || ""} ${uData.last_name || ""}`.trim() ||
                "Usuario";
              inicialesDestino = obtenerIniciales(nombreDestino);
            }
          } catch (error) {
            console.error(error);
          }

          let tituloTrabajo = "Proyecto Nexora";
          let precioTrabajo = "A convenir";
          if (jobId) {
            try {
              const jobSnap = await getDoc(doc(db, "solicitudes", jobId));
              if (jobSnap.exists()) {
                const jData = jobSnap.data();
                tituloTrabajo = jData.titulo || tituloTrabajo;
                if (jData.precio) {
                  const precioLimpio = String(jData.precio)
                    .replace(/s\/\s*/i, "")
                    .trim();
                  precioTrabajo = `S/ ${precioLimpio}`;
                }
              }
            } catch (error) {
              console.error(error);
            }
          }

          setSeleccionado({
            id: chatId,
            jobId: jobId,
            jobTitle: tituloTrabajo,
            jobPrice: precioTrabajo,
            participants: {
              [user.uid]: { nombre: miNombre, iniciales: misIniciales },
              [workerId]: {
                nombre: nombreDestino,
                iniciales: inicialesDestino,
              },
            },
            mensajes: [],
            online: false,
            preview: "",
            hora: "",
            noLeido: false,
          });
          setMostrarChat(true);
        }
      }
    };

    inicializarChatNuevo();
  }, [workerId, jobId, conversaciones, user, cargando]);

  useEffect(() => {
    if (workerId && conversaciones.length > 0) {
      const existente = conversaciones.find((c) => c.id.includes(workerId));
      if (existente) {
        setSeleccionado(existente);
        setMostrarChat(true);
      } else {
        setSeleccionado({
          id: `chat_${user?.uid}_${workerId}`,
          nombre: "Nuevo chat",
          iniciales: "??",
          mensajes: [],
          online: true,
        });
        setMostrarChat(true);
      }
    }
  }, [workerId, conversaciones, user?.uid]);

  useEffect(() => {
    const nuevoSocket = io("https://nexora-backend-ija7.onrender.com");
    setSocket(nuevoSocket);

    nuevoSocket.on("usuariosOnline", (listaConectados) => {
      setUsuariosOnline(listaConectados);
    });

    nuevoSocket.on("cargarHistorial", (historialFirebase) => {
      const horaActual = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const chatNexora = {
        id: "nexora-bienvenida",
        iniciales: "NX",
        nombre: "Equipo Nexora",
        preview: "¡Bienvenido a tu bandeja de mensajes!",
        hora: horaActual,
        online: true,
        noLeido: true,
        mensajes: [
          {
            senderId: "sistema-nexora",
            senderName: "Equipo Nexora",
            senderInitials: "NX",
            texto:
              "¡Hola! Bienvenido al apartado de mensajes de Nexora. Por este medio, los trabajadores y profesionales con los que conectes se comunicarán contigo para coordinar detalles, presupuestos y horarios. ¡Empieza a explorar y conectar!",
            hora: horaActual,
          },
        ],
      };

      const existeNexora = historialFirebase.find(
        (c) => c.id === "nexora-bienvenida",
      );
      let historialFinal = historialFirebase;

      if (!existeNexora) {
        historialFinal = [chatNexora, ...historialFirebase];
      }

      setConversaciones(historialFinal);
      if (!workerId) {
        setSeleccionado(historialFinal[0]);
      }
      setCargando(false);
    });

    nuevoSocket.on("actualizarConversacion", (conversacionRecibida) => {
      setConversaciones((prev) => {
        const nuevas = [...prev];
        const index = nuevas.findIndex((c) => c.id === conversacionRecibida.id);
        if (index !== -1) {
          nuevas[index] = conversacionRecibida;
        } else {
          nuevas.push(conversacionRecibida);
        }
        return nuevas;
      });

      setSeleccionado((prev) =>
        prev && prev.id === conversacionRecibida.id
          ? conversacionRecibida
          : prev,
      );
    });

    return () => {
      nuevoSocket.disconnect();
    };
  }, [workerId]);

  useEffect(() => {
    if (socket && user?.uid) {
      socket.emit("registerUser", user.uid);
    }
  }, [socket, user?.uid]);

  const enviarMensaje = () => {
    if (mensaje.trim() && socket && seleccionado && user) {
      const horaActual = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const nombreUsuario =
        user.displayName ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        "Usuario";

      const inicialesUsuario = obtenerIniciales(nombreUsuario);

      const nuevoMsg = {
        senderId: user.uid,
        senderName: nombreUsuario,
        senderInitials: inicialesUsuario,
        texto: mensaje,
        hora: horaActual,
      };

      const conversacionActualizada = {
        ...seleccionado,
        preview: mensaje,
        hora: horaActual,
        mensajes: [...seleccionado.mensajes, nuevoMsg],
      };
      setSeleccionado(conversacionActualizada);
      setConversaciones((prev) => {
        const nuevas = [...prev];
        const idx = nuevas.findIndex((c) => c.id === seleccionado.id);
        if (idx !== -1) {
          nuevas[idx] = conversacionActualizada;
        } else {
          nuevas.unshift(conversacionActualizada);
        }
        return nuevas;
      });
      socket.emit("actualizarConversacion", conversacionActualizada);
      setMensaje("");
    }
  };

  if (cargando) {
    return (
      <div
        style={{ backgroundColor: background[theme], color: textColor[theme] }}
        className="min-h-screen flex items-center justify-center font-syne"
      >
        Cargando conversaciones...
      </div>
    );
  }

  return (
    <FirebaseAuthWatcher>
      <div
        style={{ backgroundColor: background[theme], color: textColor[theme] }}
        className="fixed top-22.5 inset-x-0 bottom-0 flex font-sans overflow-hidden transition-colors duration-200"
      >
        <div
          className={`${mostrarChat ? "hidden" : "flex"} md:flex w-full md:w-80 border-r ${borderColor} flex-col`}
        >
          <div className={`p-5 border-b ${borderColor}`}>
            <h2 className="text-xl font-extrabold mb-3 font-syne">Mensajes</h2>
            <input
              style={{ backgroundColor: inputBg, color: textColor[theme] }}
              className={`w-full px-3 py-2 rounded-lg border ${borderColor} text-sm outline-none focus:border-[#6C63FF] transition-all`}
              placeholder="Buscar conversación..."
            />
          </div>

          <div className="overflow-y-auto flex-1">
            {conversaciones.length === 0 ? (
              <div className="p-5 text-sm text-[#606078] text-center">
                Bandeja de entrada vacía
              </div>
            ) : (
              conversaciones.map((conv) => {
                const datosOtro = obtenerDatosOtroUsuario(conv);
                const otroUid = conv.id
                  .split("_")
                  .find((id) => id !== user?.uid);
                const isOnline =
                  conv.id === "nexora-bienvenida"
                    ? true
                    : usuariosOnline.includes(otroUid);

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSeleccionado(conv);
                      setMostrarChat(true);
                    }}
                    className={`flex items-center gap-3 px-5 py-4 cursor-pointer border-b ${
                      theme === "dark" ? "border-[#1a1a24]" : "border-gray-100"
                    } transition-all ${
                      seleccionado?.id === conv.id
                        ? `${itemActiveBg} border-l-4 border-l-[#6C63FF]`
                        : itemHoverBg
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-full bg-[#6c63ff22] flex items-center justify-center text-[#8B85FF] text-xs font-bold shrink-0 font-syne">
                      {datosOtro.iniciales}
                      {isOnline && (
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 ${
                            theme === "dark"
                              ? "border-[#0A0A0F]"
                              : "border-white"
                          }`}
                        ></span>
                      )}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div
                        className={`text-sm font-semibold ${theme === "dark" ? "text-[#F0F0F8]" : "text-gray-800"}`}
                      >
                        {datosOtro.nombre}
                      </div>
                      <div className="text-xs text-[#606078] truncate">
                        {conv.preview}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-xs text-[#606078]">{conv.hora}</div>
                      {conv.noLeido && (
                        <span className="w-2 h-2 rounded-full bg-[#6C63FF]"></span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div
          className={`${mostrarChat ? "flex" : "hidden"} md:flex flex-1 flex-col`}
        >
          {!seleccionado ? (
            <div className="flex-1 flex items-center justify-center text-[#606078] font-syne text-lg">
              Selecciona o inicia una conversación para empezar
            </div>
          ) : (
            <React.Fragment>
              <div
                className={`flex items-center gap-3 px-6 py-4 border-b ${borderColor}`}
              >
                <button
                  className="md:hidden mr-1 p-2 rounded-full transition-all cursor-pointer text-[#606078]"
                  onClick={() => setMostrarChat(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                {(() => {
                  const datosSeleccionado =
                    obtenerDatosOtroUsuario(seleccionado);
                  const otroUid = seleccionado.id
                    .split("_")
                    .find((id) => id !== user?.uid);
                  const isOnline =
                    seleccionado.id === "nexora-bienvenida"
                      ? true
                      : usuariosOnline.includes(otroUid);

                  return (
                    <React.Fragment>
                      <div className="relative w-10 h-10 rounded-full bg-[#6c63ff22] flex items-center justify-center text-[#8B85FF] text-xs font-bold shrink-0 font-syne">
                        {datosSeleccionado.iniciales}
                        {isOnline && (
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 ${
                              theme === "dark"
                                ? "border-[#0A0A0F]"
                                : "border-white"
                            }`}
                          ></span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-sm font-semibold ${theme === "dark" ? "text-[#F0F0F8]" : "text-gray-800"}`}
                        >
                          {datosSeleccionado.nombre}
                        </div>
                        <div
                          className={`text-xs ${isOnline ? "text-green-400" : "text-[#606078]"}`}
                        >
                          {isOnline ? "En línea ahora" : "Desconectado"}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })()}

                <div className="flex gap-2">
                  {seleccionado.id !== "nexora-bienvenida" && (
                    <button
                      onClick={() => {
                        const targetJobId = seleccionado.jobId || jobId;
                        if (targetJobId) {
                          router.push(`/job-flow?jobId=${targetJobId}`);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#22c55e18] text-[#22C55E] text-sm cursor-pointer hover:bg-green-600 hover:text-white transition-all font-black uppercase tracking-widest"
                    >
                      Ver postulacion
                    </button>
                  )}
                </div>
              </div>

              <div
                className={`px-6 py-2.5 border-b ${borderColor} text-sm ${
                  theme === "dark"
                    ? "bg-[#111118] text-[#9090A8]"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                {seleccionado.id === "nexora-bienvenida" ? (
                  <span>
                    Chat oficial de{" "}
                    <strong className="text-[#6C63FF]">Nexora</strong>
                  </span>
                ) : (
                  <React.Fragment>
                    Trabajo:{" "}
                    <strong className="text-[#6C63FF]">
                      {seleccionado.jobTitle || "Proyecto"}
                    </strong>{" "}
                    · {seleccionado.jobPrice || "A convenir"}
                  </React.Fragment>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
                {seleccionado.mensajes.map((msg, i) => {
                  const soyYo = msg.senderId === user?.uid;

                  return (
                    <div
                      key={i}
                      className={`flex items-end gap-2 ${soyYo ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className="w-7 h-7 rounded-full bg-[#6c63ff22] flex items-center justify-center text-[#8B85FF] text-[9px] font-semibold shrink-0 font-syne"
                        title={msg.senderName}
                      >
                        {msg.senderInitials ||
                          (soyYo ? "YO" : seleccionado.iniciales)}
                      </div>
                      <div>
                        {!soyYo && (
                          <div className="text-[10px] text-[#606078] ml-2 mb-1">
                            {msg.senderName}
                          </div>
                        )}
                        <div
                          className={`px-4 py-3 text-sm max-w-md leading-relaxed ${
                            soyYo
                              ? "bg-[#6C63FF] text-white rounded-2xl rounded-br-md"
                              : theme === "dark"
                                ? "bg-[#111118] border border-[#2A2A38] text-[#F0F0F8] rounded-2xl rounded-bl-md"
                                : "bg-gray-100 border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md"
                          }`}
                        >
                          {msg.texto}
                        </div>
                        <div
                          className={`text-xs text-[#606078] mt-1 ${soyYo ? "text-right" : ""}`}
                        >
                          {msg.hora}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`flex gap-3 px-6 py-4 border-t ${borderColor}`}>
                <textarea
                  style={{ backgroundColor: inputBg, color: textColor[theme] }}
                  className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} text-sm resize-none outline-none h-12 focus:border-[#6C63FF] transition-all`}
                  placeholder="Escribe un mensaje..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      enviarMensaje();
                    }
                  }}
                />
                <button
                  onClick={enviarMensaje}
                  className="w-12 h-12 rounded-xl bg-[#6C63FF] text-white text-lg cursor-pointer hover:bg-[#5a52e0] transition-all flex items-center justify-center"
                >
                  ➤
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </FirebaseAuthWatcher>
  );
}

export default function MessagesPageWrapper() {
  return (
    <Suspense>
      <MensajesContent />
    </Suspense>
  );
}
