import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "@/firebase/db";

const COL = "solicitudes";
const solicitudesRef = () => collection(db, COL);
const solicitudDoc  = (id) => doc(db, COL, id);

export const crearSolicitud = async (data, userId) => {
  try {
    if (!userId) throw new Error("Usuario no autenticado");
 
    const payload = {
  titulo:      data.titulo?.trim()      ?? "",
  descripcion: data.descripcion?.trim() ?? "",
  tags:        Array.isArray(data.tags) ? data.tags : [],
  precio:      data.precio?.trim()      ?? "A coordinar",
  distrito:    data.distrito            ?? "",
  urgente:     Boolean(data.urgente),
  modalidad:   data.modalidad           ?? "Presencial",
  urgencia:    data.urgencia            ?? "acordar",
  nombre:      data.nombre?.trim()      ?? "Usuario",
  iniciales:   data.iniciales?.trim()   ?? "U",
  imageUrls:   Array.isArray(data.imageUrls) ? data.imageUrls : [],
  userId,
  postulantes:            [],
  //postulacionesBloqueadas: false,
  trabajadorId:           null,
  trabajadorNombre:       null,
  estado: "activa",        
  creadoEn:  serverTimestamp(),
  updatedAt: serverTimestamp(),
};
 
    const ref = await addDoc(solicitudesRef(), payload);
    return { success: true, id: ref.id };
  } catch (error) {
    console.error("[crearSolicitud]", error);
    return { success: false, error };
  }
};
 
export const obtenerSolicitud = async (solicitudId) => {
  try {
    const snap = await getDoc(solicitudDoc(solicitudId));
    if (!snap.exists()) return { success: false, error: "No encontrada" };
    return {
      success: true,
      data: {
        id: snap.id,
        ...snap.data(),
        creadoEn: snap.data().creadoEn?.toDate?.() ?? new Date(),
      },
    };
  } catch (error) {
    console.error("[obtenerSolicitud]", error);
    return { success: false, error };
  }
};
 
export const obtenerSolicitudesDeUsuario = async (userId) => {
  try {
    const q = query(
      solicitudesRef(),
      where("userId", "==", userId),
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
    console.error("[obtenerSolicitudesDeUsuario]", error);
    return { success: false, error };
  }
};
 
export const obtenerMisPostulaciones = async (userId) => {
  try {
    const q = query(
      solicitudesRef(),
      where("postulantes", "array-contains", userId),
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
    console.error("[obtenerMisPostulaciones]", error);
    return { success: false, error };
  }
};
 
export const obtenerSolicitudesRecientes = async (cantidad = 20) => {
  try {
    const q = query(
      solicitudesRef(),
      orderBy("creadoEn", "desc"),
      limit(cantidad)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      creadoEn: d.data().creadoEn?.toDate?.() ?? new Date(),
    }));
    return { success: true, data };
  } catch (error) {
    console.error("[obtenerSolicitudesRecientes]", error);
    return { success: false, error };
  }
};
 
export const actualizarSolicitud = async (solicitudId, campos) => {
  try {
    // Nunca permitir sobreescribir campos de sistema desde el cliente
    const { userId, postulantes, creadoEn, ...camposPermitidos } = campos;
 
    await updateDoc(solicitudDoc(solicitudId), {
      ...camposPermitidos,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("[actualizarSolicitud]", error);
    return { success: false, error };
  }
};
 
export const postularse = async (solicitudId, userId) => {
  try {
    if (!userId) throw new Error("Usuario no autenticado");
    await updateDoc(solicitudDoc(solicitudId), {
      postulantes: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("[postularse]", error);
    return { success: false, error };
  }
};
 
export const cancelarPostulacion = async (solicitudId, userId) => {
  try {
    if (!userId) throw new Error("Usuario no autenticado");
    await updateDoc(solicitudDoc(solicitudId), {
      postulantes: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("[cancelarPostulacion]", error);
    return { success: false, error };
  }
};
 
export const togglePostulacion = async (solicitudId, postulantesActuales, userId) => {
  try {
    if (!userId) throw new Error("Usuario no autenticado");
 
    const yaPostulado = postulantesActuales.includes(userId);
 
    await updateDoc(solicitudDoc(solicitudId), {
      postulantes: yaPostulado ? arrayRemove(userId) : arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
 
    return { success: true, accion: yaPostulado ? "cancelado" : "postulado" };
  } catch (error) {
    console.error("[togglePostulacion]", error);
    return { success: false, error };
  }
};

export const eliminarSolicitud = async (solicitudId) => {
  try {
    await deleteDoc(solicitudDoc(solicitudId));
    return { success: true };
  } catch (error) {
    console.error("[eliminarSolicitud]", error);
    return { success: false, error };
  }
};

export const completarSolicitud = async (solicitudId, userId) => {
  try {
    const solicitudRef = doc(db, COL, solicitudId);
    const solicitudSnap = await getDoc(solicitudRef);
    if (!solicitudSnap.exists()) throw new Error("Solicitud no existe");
    const data = solicitudSnap.data();
    if (data.userId !== userId) throw new Error("Solo el cliente puede completar la solicitud");
    if (data.estado !== "en_progreso") throw new Error("La solicitud no está en progreso");

    await updateDoc(solicitudRef, {
      estado: "completada",
      completadoEn: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("[completarSolicitud]", error);
    return { success: false, error };
  }
};