"use server";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initAdmin() {
  if (getApps().length > 0) return;

  const rawBase64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;

  if (!rawBase64) {
    console.error("Falta FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 en .env.local");
    return;
  }

  try {
    const serviceAccount = JSON.parse(
      Buffer.from(rawBase64, "base64").toString("utf8"),
    );

    initializeApp({
      credential: cert(serviceAccount),
    });

    console.log("Firebase Admin inicializado con éxito.");
  } catch (error) {
    console.error("Error al inicializar Firebase Admin:", error);
  }
}

initAdmin();

const adminAuth = getAuth();
const adminDb = getFirestore();

// Server Action: borra el documento de Firestore e inhabilita la cuenta en Auth.
// Se llama directamente desde el cliente (page.jsx), sin necesidad de una API route.
export async function eliminarUsuarioAdmin(idToken, targetUserId) {
  const decoded = await adminAuth.verifyIdToken(idToken);
  const callerSnap = await adminDb.doc(`users/${decoded.uid}`).get();
  const callerRol = callerSnap.exists ? callerSnap.data().rol : null;

  if (callerRol !== "admin") {
    throw new Error("No autorizado");
  }
  if (targetUserId === decoded.uid) {
    throw new Error("No puedes eliminarte a ti mismo");
  }

  await adminAuth.updateUser(targetUserId, { disabled: true });
  await adminDb.doc(`users/${targetUserId}`).delete();

  return { success: true };
}