export default function VerificacionTrabajadorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg-main)" }}>
      <div
        className="max-w-2xl w-full text-center rounded-3xl p-10 border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        <h1
          className="text-4xl font-extrabold mb-4"
          style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}
        >
          Solicitud Enviada
        </h1>

        <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
          Tu perfil profesional fue enviado correctamente. Nuestro equipo revisará tu información para activar tu cuenta como trabajador verificado.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-5 border"
            style={{ background: "var(--bg-hover)", borderColor: "var(--border-color)" }}
          >
            <h2 className="font-bold mb-2" style={{ color: "var(--text-main)" }}>Rol Profesional Activado</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Tu cuenta ya cuenta con acceso al panel de trabajador.</p>
          </div>
          <div
            className="rounded-2xl p-5 border"
            style={{ background: "var(--bg-hover)", borderColor: "var(--border-color)" }}
          >
            <h2 className="font-bold mb-2" style={{ color: "var(--text-main)" }}>Verificación en Proceso</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Revisaremos tu CV y experiencia para validar tu perfil.</p>
          </div>
        </div>
      </div>
    </div>
  );
}