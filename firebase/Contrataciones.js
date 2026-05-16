import {
  doc,
  getDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/db";
import { crearNotificacion } from "@/firebase/Notificaciones";
import { enviarMensaje } from "@/firebase/Mensajes";

export async function contratarTrabajador({
  solicitudId,
  trabajadorId,
  trabajadorNombre,
  clienteId,
  clienteNombre,
  convId,
}) {
  try {
    if (!solicitudId || !trabajadorId || !clienteId || !convId) {
      throw new Error("Faltan campos obligatorios.");
    }

    // Verificar que la solicitud existe y no está ya contratada
    const solicitudRef = doc(db, "solicitudes", solicitudId);
    const solicitudSnap = await getDoc(solicitudRef);
    if (!solicitudSnap.exists()) throw new Error("La solicitud no existe.");
    const solicitudData = solicitudSnap.data();
    if (solicitudData.estado === "en_progreso" || solicitudData.trabajadorId) {
      throw new Error("Esta solicitud ya tiene un trabajador asignado.");
    }
    if (solicitudData.userId !== clienteId) {
      throw new Error("Solo el cliente propietario puede contratar.");
    }

    // Obtener el título de la solicitud
    const solicitudTitulo = solicitudData.titulo;

    // Transacción para actualizar la solicitud
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(solicitudRef);
      if (!snap.exists()) throw new Error("La solicitud no existe.");
      tx.update(solicitudRef, {
        trabajadorId,
        trabajadorNombre,
        estado: "en_progreso",
        postulacionesBloqueadas: true,
        contratadoEn: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    const convRef = doc(db, "conversaciones", convId);
    await updateDoc(convRef, {
      solicitudId: solicitudId,
      solicitudTitulo: solicitudTitulo,
      solicitudContratada: true,
    });

    await crearNotificacion({
      usuarioId: trabajadorId,
      tipo: "contratacion",
      titulo: "¡Te han contratado!",
      cuerpo: `${clienteNombre} te ha contratado para "${solicitudTitulo}".`,
      referenciaId: solicitudId,
    }).catch(console.warn);

    await enviarMensaje(convId, {
      texto: `${clienteNombre} te ha contratado para "${solicitudTitulo}". ¡Coordinen los detalles aquí!`,
      autorId: clienteId,
      autorNombre: clienteNombre,
      autorIniciales: clienteNombre.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2),
      otroUid: trabajadorId,
    }).catch(console.warn);

    return { success: true };
  } catch (error) {
    console.error("[contratarTrabajador]", error);
    return { success: false, error };
  }
}