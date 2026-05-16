"use client";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/db";

function normalizarSolicitud(id, data) {
  return {
    id,
    titulo:       data.titulo       ?? "",
    descripcion:  data.descripcion  ?? "",
    precio:       data.precio       ?? "A coordinar",
    distrito:     data.distrito     ?? "",
    modalidad:    data.modalidad    ?? "Presencial",
    nombre:       data.nombre       ?? "Usuario",
    iniciales:    data.iniciales    ?? "U",
    urgencia:     data.urgencia     ?? "acordar",
    estado:       data.estado       ?? "activa",
    urgente:      Boolean(data.urgente),
    postulacionesBloqueadas: Boolean(data.postulacionesBloqueadas),
    tags:         Array.isArray(data.tags)        ? data.tags        : [],
    postulantes:  Array.isArray(data.postulantes) ? data.postulantes : [],
    imageUrls:    Array.isArray(data.imageUrls)   ? data.imageUrls   : [],
    habilidades:  Array.isArray(data.habilidades) ? data.habilidades : [],
    userId:          data.userId         ?? "",
    trabajadorId:    data.trabajadorId   ?? null,
    trabajadorNombre: data.trabajadorNombre ?? null,
    presupuesto:  data.presupuesto ?? null,
    duracion:     data.duracion    ?? null,
    creadoEn:     data.creadoEn?.toDate?.()       ?? new Date(),
    contratadoEn: data.contratadoEn?.toDate?.()   ?? null,
    updatedAt:    data.updatedAt?.toDate?.()       ?? null,
  };
}

export function useSolicitudes(uid) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const baseRef = collection(db, "solicitudes");
    const q = uid
      ? query(baseRef, where("userId", "==", uid), orderBy("creadoEn", "desc"))
      : query(baseRef, where("estado", "==", "activa"), orderBy("creadoEn", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let docs = snapshot.docs.map((d) => normalizarSolicitud(d.id, d.data()));
        if (!uid) docs = docs.filter((s) => !s.postulacionesBloqueadas);

        setSolicitudes(docs);
        setLoading(false);
      },
      (err) => {
        console.error("[useSolicitudes] Error:", err);
        setError(err.message ?? "Error al obtener solicitudes.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]); 

  return { solicitudes, loading, error };
}