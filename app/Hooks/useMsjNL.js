"use client";
import { useEffect, useState } from "react";
import { escucharConversaciones } from "@/firebase/Mensajes";

export function useMensajesNoLeidos(uid) {
  const [totalNoLeidos, setTotalNoLeidos] = useState(0);

  useEffect(() => {
    if (!uid) {
      setTotalNoLeidos(0);
      return;
    }
    const unsubscribe = escucharConversaciones(uid, (conversaciones) => {
      const suma = conversaciones.reduce((acc, conv) => {
        return acc + (conv.noLeido?.[uid] || 0);
      }, 0);
      setTotalNoLeidos(suma);
    });
    return unsubscribe;
  }, [uid]);

  return totalNoLeidos;
}