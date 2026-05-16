"use client";
import { useEffect, useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/db";

const PERFIL_VACIO = {
  // Identidad
  userId:             "",
  first_name:         "",
  last_name:          "",
  iniciales:          "",
  email:              "",
  rol:                null,          // "cliente" | "trabajador" | null
  avatarUrl:          "",

  // Info pública
  bio:                "",
  district:           "",
  disponibilidad:     "",
  website:            "",
  disponible:         false,

  // Estadísticas
  valoracionPromedio: 0,
  totalReseñas:       0,
  totalTrabajos:      0,
  porcentajeExito:    0,
  tarifaEstandar:     0,

  // Arrays
  habilidades:        [],

  // Flags
  verificado:         false,

  // Timestamps, el componente decide cómo formatearlos)
  creadoEn:           null,
  updatedAt:          null,
};

function normalizarPerfil(data = {}, uid = "") {
  return {
    userId:             data.userId             ?? uid,
    first_name:         data.first_name         ?? "",
    last_name:          data.last_name          ?? "",
    iniciales:          data.iniciales          ?? "",
    email:              data.email              ?? "",
    rol:                (data.rol === "cliente" || data.rol === "trabajador") ? data.rol  : null,
    avatarUrl:          data.avatarUrl          ?? "",
    bio:                data.bio                ?? "",
    district:           data.district           ?? "",
    disponibilidad:     data.disponibilidad     ?? "",
    website:            data.website            ?? "",
    disponible:         Boolean(data.disponible),
    valoracionPromedio: Number(data.valoracionPromedio) || 0,
    totalReseñas:       Number(data.totalReseñas)       || 0,
    totalTrabajos:      Number(data.totalTrabajos)       || 0,
    porcentajeExito:    Number(data.porcentajeExito)    || 0,
    tarifaEstandar:     Number(data.tarifaEstandar)     || 0,
    habilidades:        Array.isArray(data.habilidades) ? data.habilidades : [],
    verificado:         Boolean(data.verificado),
    creadoEn:           data.creadoEn?.toDate?.() ?? null,
    updatedAt:          data.updatedAt?.toDate?.() ?? null,
  };
}

export function useUserProfile(uid) {
  const [perfil,  setPerfil]  = useState(PERFIL_VACIO);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [revision, setRevision] = useState(0);

  const refetch = useCallback(() => setRevision((n) => n + 1), []);

  useEffect(() => {
    if (!uid) {
      setPerfil(PERFIL_VACIO);
      setLoading(false);
      setError(null);
      return;
    }

    let activo = true;
    setLoading(true);
    setError(null);

    getDoc(doc(db, "users", uid))
      .then((snap) => {
        if (!activo) return;
        if (snap.exists()) {
          setPerfil(normalizarPerfil(snap.data(), uid));
        } else {
          // Usuario en Auth pero sin documento (registro incompleto)
          setPerfil({ ...PERFIL_VACIO, userId: uid });
          setError("Perfil no encontrado en Firestore.");
        }
      })
      .catch((err) => {
        if (!activo) return;
        console.error("[useUserProfile] Error leyendo Firestore:", err);
        setError(err.message ?? "Error al cargar el perfil.");
        setPerfil(PERFIL_VACIO);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => { activo = false; };
  }, [uid, revision]);

  return { perfil, loading, error, refetch };
}