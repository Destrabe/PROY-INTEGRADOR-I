// app/api/otp/verify/route.js
import { NextResponse } from "next/server";
import { db } from "@/firebase/db";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Datos incompletos" }, { status: 400 });
    }

    const otpRef = doc(db, "otps", email);
    const otpDoc = await getDoc(otpRef);

    if (!otpDoc.exists()) {
      return NextResponse.json({ success: false, error: "Código no encontrado" }, { status: 404 });
    }

    const otp = otpDoc.data();

    // Expirado
    if (Date.now() > otp.expiresAt) {
      await deleteDoc(otpRef);
      return NextResponse.json({ success: false, error: "Código expirado" }, { status: 400 });
    }

    // Demasiados intentos fallidos
    if ((otp.attempts || 0) >= 5) {
      await deleteDoc(otpRef);
      return NextResponse.json({ success: false, error: "Demasiados intentos" }, { status: 429 });
    }

    // Código incorrecto
    if (otp.code !== code) {
      await updateDoc(otpRef, { attempts: (otp.attempts || 0) + 1 });
      return NextResponse.json({ success: false, error: "Código incorrecto" }, { status: 400 });
    }

    // Correcto — marca como verificado
    await updateDoc(otpRef, { verified: true });
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("verify OTP error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}