"use client";
import { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/firebase/db";


export function usePostulacion(userId) {
  const [loadingId, setLoadingId] = useState(null); // solicitudId que está procesando
  const estaPostulado = (postulantes = []) => postulantes.includes(userId);
  const togglePostulacion = async (solicitudId, postulantesActuales = []) => {
    if (!userId) {
      alert("Debes iniciar sesión para postularte.");
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
      console.error("Error al actualizar postulación:", err);
      alert("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setLoadingId(null);
    }
  };

  return { estaPostulado, togglePostulacion, loadingId };
}