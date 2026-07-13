import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/adminNode";
import { transporter, buildVerificationEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos

    await adminDb.collection("verificationCodes").doc(normalizedEmail).set({
      code,
      expiresAt,
      attempts: 0,
      createdAt: Date.now(),
    });

    const { subject, html } = buildVerificationEmail(code);

    await transporter.sendMail({
      from: `"Nexora" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("AQUI ESTA EL ERROR:", error.message);
    return NextResponse.json(
      { error: "DEBUG: " + error.message },
      { status: 500 },
    );
  }
}