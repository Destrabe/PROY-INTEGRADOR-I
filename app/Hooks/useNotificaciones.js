
"use client";

import { useEffect, useState, useMemo } from "react";
import { escucharNotificaciones } from "@/firebase/Notificaciones";

function normalizarNotif(notif) {
  return {
    id:           notif.id           ?? "",
    usuarioId:    notif.usuarioId    ?? "",
    tipo:         notif.tipo         ?? "",
    titulo:       notif.titulo       ?? "",
    cuerpo:       notif.cuerpo       ?? "",
    leida:        Boolean(notif.leida),
    referenciaId: notif.referenciaId ?? null,
    creadoEn:     notif.creadoEn instanceof Date
                    ? notif.creadoEn
                    : (notif.creadoEn?.toDate?.() ?? new Date()),
  };
}


export function useNotificaciones(uid) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState(null);

  useEffect(() => {
    if (!uid) {
      setNotificaciones([]);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = escucharNotificaciones(uid, (notifs) => {
      setNotificaciones(notifs.map(normalizarNotif));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const noLeidas = useMemo(
    () => notificaciones.filter((n) => !n.leida).length,
    [notificaciones]
  );

  return { notificaciones, noLeidas, loading, error };
}