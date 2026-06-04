"use client";
import { useState } from "react";
import { Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
});

const conversaciones = [
  {
    id: 1,
    iniciales: "YS",
    nombre: "Yadhira Saavedra",
    preview: "Anotado.Probablemente sea la...",
    hora: "2:34 PM",
    online: true,
    noLeido: true,
    mensajes: [
      {
        de: "ellos",
        texto:
          "Hola, vi tu solicitud de la laptop Dell. Tengo bastante experiencia con ese modelo exacto. ¿Cuándo puedo pasar a revisarla?",
        hora: "2:10 PM",
      },
      {
        de: "yo",
        texto:
          "Hola Yadhira! Me interesa. ¿Puedes venir hoy en la tarde, después de las 5pm?",
        hora: "2:18 PM",
      },
      {
        de: "ellos",
        texto:
          "Perfecto, a las 5:30pm me va bien. El diagnóstico de encendido también lo reviso sin costo adicional. Si necesito repuestos para la pantalla te aviso el precio antes de continuar.",
        hora: "2:24 PM",
      },
      {
        de: "yo",
        texto:
          "Genial! Te paso la dirección: AA.HH 28 de julio, SJL. Toca el timbre.",
        hora: "2:28 PM",
      },
      {
        de: "ellos",
        texto:
          "Anotado. Probablemente sea la batería o el adaptador. Nos vemos a las 5:30",
        hora: "2:34 PM",
      },
    ],
  },
  {
    id: 2,
    iniciales: "TS",
    nombre: "Tom Sarmiento",
    preview: "El diagnóstico es completamente gratis",
    hora: "1:20 PM",
    online: false,
    noLeido: false,
    mensajes: [
      {
        de: "ellos",
        texto: "El diagnóstico es completamente gratis.",
        hora: "1:20 PM",
      },
    ],
  },
  {
    id: 3,
    iniciales: "DH",
    nombre: "Dajhana Huaccha",
    preview: "¿Puedes enviarme más info sobre el diseño?",
    hora: "Ayer",
    online: false,
    noLeido: false,
    mensajes: [
      {
        de: "ellos",
        texto: "¿Puedes enviarme más info sobre el diseño?",
        hora: "Ayer",
      },
    ],
  },
  {
    id: 4,
    iniciales: "MV",
    nombre: "Marco Viera",
    preview: "Perfecto, confirma la dirección",
    hora: "Lun",
    online: false,
    noLeido: false,
    mensajes: [
      { de: "ellos", texto: "Perfecto, confirma la dirección", hora: "Lun" },
    ],
  },
];

export default function MensajesPage() {
  const [seleccionado, setSeleccionado] = useState(conversaciones[0]);
  const [mensaje, setMensaje] = useState("");
  const [mostrarChat, setMostrarChat] = useState(false);

  return (
    <div className="flex h-[calc(100vh-90px)] bg-[#0A0A0F] text-white font-sans overflow-hidden">
      {/* Lista izquierda */}
      <div
        className={`${mostrarChat ? "hidden" : "flex"} md:flex w-full md:w-80 border-r border-[#2A2A38] flex-col`}
      >
        <div className="p-5 border-b border-[#0c0c3e]">
          <h2
            className="text-xl font-extrabold mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Mensajes
          </h2>
          <input
            className="w-full px-3 py-2 rounded-lg bg-[#111118] border border-[#2A2A38] text-white text-sm outline-none focus:border-[#6C63FF] transition-all"
            placeholder="Buscar conversación..."
          />
        </div>
        <div className="overflow-y-auto flex-1">
          {conversaciones.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                setSeleccionado(conv);
                setMostrarChat(true);
              }}
              className={`flex items-center gap-3 px-5 py-4 cursor-pointer border-b border-[#1a1a24] transition-all ${seleccionado.id === conv.id ? "bg-[#111118] border-l-4 border-l-[#6C63FF]" : "hover:bg-[#111118]"}`}
            >
              <div
                className={`relative w-10 h-10 rounded-full bg-[#6c63ff22] flex items-center justify-center text-[#8B85FF] text-xs font-bold shrink-0 ${syne.className}`}
              >
                {conv.iniciales}
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0A0A0F]"></span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-semibold text-[#F0F0F8]">
                  {conv.nombre}
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
          ))}
        </div>
      </div>

      {/* Chat derecho */}
      <div
        className={`${mostrarChat ? "flex" : "hidden"} md:flex flex-1 flex-col`}
      >
        {/* Header chat */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2A2A38] ">
          <button
            className="md:hidden mr-1 p-2 rounded-full transition-all cursor-pointer"
            style={{
              color: "var(--text-secondary)",
            }}
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
          <div
            className={`relative w-10 h-10 rounded-full bg-[#6c63ff22] flex items-center justify-center text-[#8B85FF] text-xs font-bold shrink-0 ${syne.className}`}
          >
            {seleccionado.iniciales}
            {seleccionado.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0A0A0F]"></span>
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#F0F0F8]">
              {seleccionado.nombre}
            </div>
            <div className="text-xs text-green-400">
              {seleccionado.online ? "En línea ahora" : "Desconectado"}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-[#2A2A38] text-sm text-[#F0F0F8] bg-transparent cursor-pointer hover:bg-[#2A2A38] transition-all">
              Ver perfil
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[#22c55e18] text-[#22C55E] text-sm cursor-pointer hover:bg-green-600 transition-all">
              ✓ Contratar
            </button>
          </div>
        </div>

        {/* Banner */}
        <div className="px-6 py-2.5 bg-[#111118] border-b border-[#2A2A38] text-sm text-[#9090A8]">
          Trabajo:{" "}
          <strong className="text-[#6C63FF]">
            Técnico para reparar laptop con pantalla rota
          </strong>{" "}
          · S/ 80–150
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {seleccionado.mensajes.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${msg.de === "yo" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-full bg-[#6c63ff22] flex items-center justify-center text-[#8B85FF] text-[9px] font-semibold shrink-0 ${syne.className}`}
              >
                {msg.de === "yo" ? "LR" : seleccionado.iniciales}
              </div>
              <div>
                <div
                  className={`px-4 py-3 text-sm max-w-md leading-relaxed ${msg.de === "yo" ? "bg-[#6C63FF] text-white rounded-2xl rounded-br-md" : "bg-[#111118] border border-[#2A2A38] text-[#F0F0F8] rounded-2xl rounded-bl-md"}`}
                >
                  {msg.texto}
                </div>
                <div
                  className={`text-xs text-[#606078] mt-1 ${msg.de === "yo" ? "text-right" : ""}`}
                >
                  {msg.hora}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#2A2A38]">
          <textarea
            className="flex-1 px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38] text-white text-sm resize-none outline-none h-12 focus:border-[#6C63FF] transition-all"
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
          <button className="w-12 h-12 rounded-xl bg-[#6C63FF] text-white text-lg cursor-pointer hover:bg-[#5a52e0] transition-all">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
