import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  increment,
  runTransaction,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/db";

const COL = "reseñas";

export const crearReseña = async (data) => {
  try {
    const { trabajadorId, clienteId, clienteNombre, solicitudId, calidad, puntualidad, precio, comunicacion, comentario } = data;
    if (!trabajadorId || !clienteId || !solicitudId) {
      throw new Error("Faltan campos obligatorios (trabajadorId, clienteId, solicitudId)");
    }
    for (const campo of [calidad, puntualidad, precio, comunicacion]) {
      if (campo < 1 || campo > 5) throw new Error("Las valoraciones deben estar entre 1 y 5");
    }

    await runTransaction(db, async (tx) => {
      const trabajadorRef = doc(db, "users", trabajadorId);
      const trabajadorSnap = await tx.get(trabajadorRef);

      if (!trabajadorSnap.exists()) {
        throw new Error("El trabajador no existe");
      }

      const perfil = trabajadorSnap.data();
      const totalActual = perfil.totalReseñas ?? 0;
      const promedioActual = perfil.valoracionPromedio ?? 0;
      const nuevaValoracion = (calidad + puntualidad + precio + comunicacion) / 4;
      const nuevoTotal = totalActual + 1;
      const nuevoPromedio = (promedioActual * totalActual + nuevaValoracion) / nuevoTotal;

      // Crear documento de reseña
      const reseñaRef = doc(collection(db, COL));
      tx.set(reseñaRef, {
        trabajadorId,
        clienteId,
        clienteNombre: clienteNombre ?? "Cliente",
        solicitudId,
        calidad,
        puntualidad,
        precio,
        comunicacion,
        comentario: comentario?.trim() ?? "",
        respuesta: null,
        creadoEn: serverTimestamp(),
      });

      tx.update(trabajadorRef, {
        valoracionPromedio: parseFloat(nuevoPromedio.toFixed(2)),
        totalReseñas: nuevoTotal,
        updatedAt: serverTimestamp(),
      });
    });

    return { success: true };
  } catch (error) {
    console.error("[crearReseña]", error);
    return { success: false, error };
  }
};

export const obtenerReseñasDeTrabajador = async (trabajadorId) => {
  try {
    const q = query(
      collection(db, COL),
      where("trabajadorId", "==", trabajadorId),
      orderBy("creadoEn", "desc")
    );
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      creadoEn: d.data().creadoEn?.toDate?.() ?? new Date(),
    }));
    return { success: true, data };
  } catch (error) {
    console.error("[obtenerReseñasDeTrabajador]", error);
    return { success: false, error };
  }
};


export const obtenerReseñasDeCliente = async (clienteId) => {
  try {
    const q = query(
      collection(db, COL),
      where("clienteId", "==", clienteId),
      orderBy("creadoEn", "desc")
    );
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      creadoEn: d.data().creadoEn?.toDate?.() ?? new Date(),
    }));
    return { success: true, data };
  } catch (error) {
    console.error("[obtenerReseñasDeCliente]", error);
    return { success: false, error };
  }
};

export const yaExisteReseña = async (solicitudId, clienteId) => {
  try {
    const q = query(
      collection(db, COL),
      where("solicitudId", "==", solicitudId),
      where("clienteId", "==", clienteId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error("[yaExisteReseña]", error);
    return false;
  }
};

export const responderReseña = async (reseñaId, respuesta) => {
  try {
    await updateDoc(doc(db, COL, reseñaId), {
      respuesta: respuesta?.trim() ?? "",
    });
    return { success: true };
  } catch (error) {
    console.error("[responderReseña]", error);
    return { success: false, error };
  }
};