import { initializeApp, getApps, cert } from "firebase-admin/app";
import serviceAccount from "./firebase-admin-key.json";

export function initAdmin() {
  if (getApps().length > 0) return;

  try {
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("Firebase Admin inicializado con éxito absoluto.");
  } catch (error) {
    console.error("Error al inicializar Firebase Admin:", error);
  }
}