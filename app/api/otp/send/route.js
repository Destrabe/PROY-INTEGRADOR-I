// app/api/otp/send/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/firebase/db";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/firebase/admin";

initAdmin();

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email requerido" },
        { status: 400 },
      );
    }

    // Verifica que el usuario exista en Firebase Auth
    try {
      await getAuth().getUserByEmail(email);
    } catch {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    // Rate limit: máximo 3 envíos por hora
    const otpRef = doc(db, "otps", email);
    const otpDoc = await getDoc(otpRef);
    if (otpDoc.exists()) {
      const data = otpDoc.data();
      const elapsed = Date.now() - data.createdAt;
      if (elapsed < 60 * 60 * 1000 && (data.attempts || 0) >= 3) {
        return NextResponse.json(
          { success: false, error: "Demasiadas solicitudes" },
          { status: 429 },
        );
      }
    }

    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos

    // Guarda en Firestore
    await setDoc(otpRef, {
      code,
      expiresAt,
      createdAt: Date.now(),
      attempts: 0,
      verified: false,
    });

    // Envía el email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Nexora" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Tu código de verificación — Nexora",
      html: `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#111118;color:#F0F0F8;border-radius:12px;padding:32px;border:1px solid #2A2A38">
      <h2 style="font-size:22px;font-weight:800;margin-bottom:4px;color:#F0F0F8">Nexora.</h2>
      <p style="color:#9090A8;margin-bottom:28px;font-size:14px">Recuperación de contraseña</p>
      <p style="margin-bottom:16px;font-size:15px">Tu código de verificación es:</p>
      <div style="background:#1a1a22;border:2px solid #635bff;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px">
        <span style="font-size:40px;font-weight:900;letter-spacing:14px;color:#F0F0F8">${code}</span>
      </div>
      <p style="color:#9090A8;font-size:13px">Este código expira en <strong style="color:#F0F0F8">10 minutos</strong>.</p>
      <p style="color:#9090A8;font-size:13px;margin-top:8px">Si no solicitaste esto, ignora este correo.</p>
    </div>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("send OTP error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
