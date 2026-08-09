
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/db";

const COL = "notificaciones";

export async function crearNotificacion({ usuarioId, tipo, titulo, cuerpo, referenciaId }) {
  try {
    await addDoc(collection(db, COL), {
      usuarioId,
      tipo,
      titulo,
      cuerpo,
      leida: false,
      referenciaId: referenciaId ?? null,
      creadoEn: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("[crearNotificacion]", error);
    return { success: false, error };
  }
}

export function escucharNotificaciones(uid, callback) {
  const q = query(
    collection(db, COL),
    where("usuarioId", "==", uid),
    orderBy("creadoEn", "desc")
  );
  return onSnapshot(q, (snap) => {
    const notifs = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      creadoEn: d.data().creadoEn?.toDate?.() ?? new Date(),
    }));
    callback(notifs);
  });
}


export async function marcarLeida(notifId) {
  try {
    await updateDoc(doc(db, COL, notifId), { leida: true });
    return { success: true };
  } catch (error) {
    console.error("[marcarLeida]", error);
    return { success: false, error };
  }
}

export async function marcarTodasLeidas(uid) {
  try {
    const q = query(
      collection(db, COL),
      where("usuarioId", "==", uid),
      where("leida", "==", false)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.update(d.ref, { leida: true }));
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("[marcarTodasLeidas]", error);
    return { success: false, error };
  }
}