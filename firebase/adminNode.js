// firebase/adminNode.js
// SOLO SERVER-SIDE. No importar esto desde componentes "use client".
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const base64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;

  if (!base64) {
    throw new Error(
      "Falta FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 en las variables de entorno",
    );
  }

  const json = Buffer.from(base64, "base64").toString("utf-8");
  return JSON.parse(json);
}

if (!getApps().length) {
  initializeApp({
    credential: cert(getServiceAccount()),
  });
}

export const adminDb = getFirestore();