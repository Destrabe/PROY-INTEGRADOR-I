"use client";

import Link from "next/link";

export default function WorkerPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-main)" }}>
      <div className="text-center p-8 max-w-md">
        <div className="w-20 h-20 mx-auto rounded-full bg-[var(--success)] flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif" }}>¡Solicitud enviada!</h1>
        <p style={{ color: "var(--text-secondary)" }} className="mb-6">
          Tu solicitud para convertirte en trabajador ha sido recibida. Nuestro equipo la revisará y te notificaremos por correo electrónico cuando sea aprobada.
        </p>
        <Link href="/feedJobs" className="btn-primary inline-block">Volver al inicio</Link>
      </div>
    </div>
  );
}