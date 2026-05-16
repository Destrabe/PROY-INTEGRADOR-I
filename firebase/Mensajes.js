import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,   
} from "firebase/firestore";
import { db } from "@/firebase/db";

export async function obtenerOCrearConversacion(uid1, uid2, solicitudId = null, solicitudTitulo = null, nombresParticipantes = {}) {
  const participantes = [uid1, uid2].sort();

  // Buscar conversación existente para esta solicitud específica
  let q;
  if (solicitudId) {
    q = query(
      collection(db, "conversaciones"),
      where("participantes", "==", participantes),
      where("solicitudId", "==", solicitudId)
    );
  } else {
    q = query(
      collection(db, "conversaciones"),
      where("participantes", "==", participantes)
    );
  }

  const snap = await getDocs(q);
  if (!snap.empty) {
    // Si ya existe una conversación para esta solicitud, la devolvemos
    return snap.docs[0].id;
  }

  // Crear nueva conversación
  const ref = await addDoc(collection(db, "conversaciones"), {
    participantes,
    nombresParticipantes,
    solicitudId: solicitudId ?? null,
    solicitudTitulo: solicitudTitulo ?? null,
    ultimoMensaje: "",
    ultimaHora: serverTimestamp(),
    noLeido: { [uid1]: 0, [uid2]: 0 },
  });

  return ref.id;
}

export async function enviarMensaje(conversacionId, mensaje) {
  const { autorId, autorNombre, autorIniciales, texto, otroUid } = mensaje;

  await addDoc(collection(db, "conversaciones", conversacionId, "mensajes"), {
    texto,
    autorId,
    autorNombre,
    autorIniciales,
    hora: serverTimestamp(),
  });

  await updateDoc(doc(db, "conversaciones", conversacionId), {
    ultimoMensaje: texto,
    ultimaHora: serverTimestamp(),
    [`noLeido.${otroUid}`]: increment(1),   
  });
}

export async function marcarLeido(conversacionId, uid) {
  await updateDoc(doc(db, "conversaciones", conversacionId), {
    [`noLeido.${uid}`]: 0,
  });
}

export function escucharConversaciones(uid, callback) {
  const q = query(
    collection(db, "conversaciones"),
    where("participantes", "array-contains", uid),
    orderBy("ultimaHora", "desc")
  );

  return onSnapshot(q, (snap) => {
    const conversaciones = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      ultimaHora: d.data().ultimaHora?.toDate?.() ?? new Date(),
    }));
    callback(conversaciones);
  });
}

export function escucharMensajes(conversacionId, callback) {
  const q = query(
    collection(db, "conversaciones", conversacionId, "mensajes"),
    orderBy("hora", "asc")
  );

  return onSnapshot(q, (snap) => {
    const mensajes = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      hora: d.data().hora?.toDate?.() ?? new Date(),
    }));
    callback(mensajes);
  });
}

export async function marcarTodasConversacionesLeidas(uid) {
  try {
    const q = query(
      collection(db, "conversaciones"),
      where("participantes", "array-contains", uid)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach((doc) => {
      batch.update(doc.ref, { [`noLeido.${uid}`]: 0 });
    });
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("[marcarTodasConversacionesLeidas]", error);
    return { success: false, error };
  }
}