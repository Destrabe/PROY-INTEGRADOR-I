"use client";
import { useState, useEffect } from "react";
import { escucharConversaciones } from "@/firebase/messages";

export function useConversaciones(uid) {
  const [conversaciones, setConversaciones] = useState([]);
  const [contratados, setContratados] = useState({});
  const [cargadas, setCargadas] = useState(false);

  useEffect(() => {
    if (!uid) return;
    let activo = true;

    const unsub = escucharConversaciones(uid, (convs) => {
      if (!activo) return;
      setConversaciones(convs);
      const mapa = {};
      convs.forEach((c) => {
        if (c.solicitudContratada && c.solicitudId) mapa[c.solicitudId] = true;
      });
      setContratados((prev) => ({ ...prev, ...mapa }));
      setCargadas(true);
    });

    return () => { activo = false; unsub(); };
  }, [uid]);

  return { conversaciones, contratados, setContratados, cargadas };
}