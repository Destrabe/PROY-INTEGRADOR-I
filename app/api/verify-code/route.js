import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/adminNode";

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const ref = adminDb.collection("verificationCodes").doc(normalizedEmail);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "No se encontró un código para este correo. Solicita uno nuevo." },
        { status: 404 },
      );
    }

    const data = snap.data();

    if (Date.now() > data.expiresAt) {
      await ref.delete();
      return NextResponse.json(
        { error: "El código expiró. Solicita uno nuevo." },
        { status: 410 },
      );
    }

    if (data.attempts >= 5) {
      await ref.delete();
      return NextResponse.json(
        { error: "Demasiados intentos fallidos. Solicita un nuevo código." },
        { status: 429 },
      );
    }

    if (data.code !== String(code).trim()) {
      await ref.update({ attempts: data.attempts + 1 });
      return NextResponse.json({ error: "Código incorrecto" }, { status: 401 });
    }

    await ref.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("VERIFY CODE ERROR:", error);
    return NextResponse.json(
      { error: "No se pudo verificar el código" },
      { status: 500 },
    );
  }
}