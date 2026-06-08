// app/api/otp/reset/route.js
import { NextResponse } from "next/server";
import { db } from "@/firebase/db";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/firebase/admin";

initAdmin();

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ success: false, error: "Datos incompletos" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "Contraseña muy corta" }, { status: 400 });
    }

    // Verifica que el OTP haya sido validado
    const otpRef = doc(db, "otps", email);
    const otpDoc = await getDoc(otpRef);

    if (!otpDoc.exists() || !otpDoc.data().verified) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    // Cambia la contraseña con Firebase Admin SDK
    const user = await getAuth().getUserByEmail(email);
    await getAuth().updateUser(user.uid, { password: newPassword });

    // Limpia el OTP usado
    await deleteDoc(otpRef);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("reset password error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}