// lib/mailer.js
// SOLO SERVER-SIDE.
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // sin NEXT_PUBLIC_
    pass: process.env.EMAIL_PASS, // sin NEXT_PUBLIC_
  },
});

export function buildVerificationEmail(code) {
  return {
    subject: "Tu código de verificación - Nexora",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #6c63ff;">Verifica tu cuenta en Nexora</h2>
        <p>Usa el siguiente código para confirmar tu correo electrónico:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #22222c;">
          ${code}
        </p>
        <p style="color: #606078; font-size: 13px;">
          Este código expira en 10 minutos. Si no solicitaste esto, ignora este correo.
        </p>
      </div>
    `,
  };
}