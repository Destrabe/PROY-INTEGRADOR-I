import { initializeApp, getApps, cert } from "firebase-admin/app";

export function initAdmin() {
  if (getApps().length > 0) return;

  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT,
    );

    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("Firebase Admin inicializado con éxito absoluto.");
  } catch (error) {
    console.error("Error al inicializar Firebase Admin:", error);
  }
}
