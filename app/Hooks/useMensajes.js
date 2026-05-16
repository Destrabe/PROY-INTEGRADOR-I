"use client";

import { useEffect, useState, useCallback } from "react";
import { escucharMensajes, marcarLeido } from "@/firebase/Mensajes";

function normalizarMensaje(msg) {
  return {
    id:             msg.id             ?? "",
    texto:          msg.texto          ?? "",
    autorId:        msg.autorId        ?? "",
    autorNombre:    msg.autorNombre    ?? "Usuario",
    autorIniciales: msg.autorIniciales ?? "U",
    hora:           msg.hora instanceof Date
                      ? msg.hora
                      : (msg.hora?.toDate?.() ?? new Date()),
  };
}

export function useMensajes(convId, uid) {
  const [mensajes, setMensajes] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!convId) {
      setMensajes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = escucharMensajes(convId, (msgs) => {
      setMensajes(msgs.map(normalizarMensaje));
      setLoading(false);
    });

    if (uid) {
      marcarLeido(convId, uid).catch((err) =>
        console.warn("[useMensajes] No se pudo marcar como leído:", err)
      );
    }

    return () => unsubscribe();
  }, [convId, uid]);

  return { mensajes, loading, error };
}

  