"use client";
import { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/firebase/db";

export function usePostulacion(userId, rol) {
  const [loadingId, setLoadingId] = useState(null);

  const estaPostulado = (postulantes = []) => 
    Array.isArray(postulantes) && postulantes.includes(userId);

  const puedePostularse = (propietarioId) => 
    Boolean(userId) && rol === "trabajador" && userId !== propietarioId;

  const togglePostulacion = async (solicitudId, postulantesActuales = [], propietarioId = "") => {
    if (!userId) {
      alert("Debes iniciar sesión para postularte.");
      return;
    }
    if (rol !== "trabajador") {
      console.warn("[usePostulacion] Solo los trabajadores pueden postularse.");
      return;
    }
    if (userId === propietarioId) {
      console.warn("[usePostulacion] No puedes postularte a tu propia solicitud.");
      return;
    }
    setLoadingId(solicitudId);
    const ref = doc(db, "solicitudes", solicitudId);
    try {
      if (estaPostulado(postulantesActuales)) {
        await updateDoc(ref, { postulantes: arrayRemove(userId) });
      } else {
        await updateDoc(ref, { postulantes: arrayUnion(userId) });
      }
    } catch (err) {
      console.error("[usePostulacion] Error al actualizar postulación:", err);
      alert("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setLoadingId(null);
    }
  };

  return { estaPostulado, togglePostulacion, puedePostularse, loadingId };
}