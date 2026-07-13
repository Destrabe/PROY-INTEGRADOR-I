"use server";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import nodemailer from "nodemailer";

function _initAdminSync() {
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

_initAdminSync();

const adminAuth = getAuth();
const adminDb = getFirestore();

// Wrapper async exportado: los archivos "use server" solo pueden exportar
// funciones async. Lo usan tus rutas API de OTP (app/api/otp/*).
export async function initAdmin() {
  _initAdminSync();
}

// ---------------------------------------------------------------------
// Eliminación de usuarios (usado en app/admin/page.jsx)
// ---------------------------------------------------------------------

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

// ---------------------------------------------------------------------
// Verificación de correo por código (usado en RegisterPage / verify-email)
// ---------------------------------------------------------------------

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function enviarCodigoVerificacion(uid, email, nombre = "") {
  const codigo = generarCodigo();
  const expiresAt = Date.now() + 15 * 60 * 1000;

  await adminDb.doc(`emailVerifications/${uid}`).set({
    codigo,
    email,
    expiresAt,
    intentos: 0,
  });

  await transporter.sendMail({
    from: `"Nexora" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Tu código de verificación de Nexora",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>¡Hola${nombre ? " " + nombre : ""}!</h2>
        <p>Usa este código para verificar tu cuenta en Nexora:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${codigo}</p>
        <p>Este código expira en 15 minutos.</p>
      </div>
    `,
  });

  return { success: true };
}

export async function verificarCodigoEmail(uid, codigoIngresado) {
  const ref = adminDb.doc(`emailVerifications/${uid}`);
  const snap = await ref.get();

  if (!snap.exists) {
    throw new Error("No se encontró un código para este usuario. Solicita uno nuevo.");
  }

  const data = snap.data();

  if (Date.now() > data.expiresAt) {
    throw new Error("El código expiró. Solicita uno nuevo.");
  }

  if (data.intentos >= 5) {
    throw new Error("Demasiados intentos fallidos. Solicita un nuevo código.");
  }

  if (data.codigo !== codigoIngresado.trim()) {
    await ref.update({ intentos: (data.intentos || 0) + 1 });
    throw new Error("Código incorrecto.");
  }

  await adminAuth.updateUser(uid, { emailVerified: true });
  await adminDb.doc(`users/${uid}`).update({ emailVerified: true });
  await ref.delete();

  return { success: true };
}