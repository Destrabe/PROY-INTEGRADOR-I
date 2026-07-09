import { initializeApp, getApps, cert } from "firebase-admin/app";

export function initAdmin() {
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