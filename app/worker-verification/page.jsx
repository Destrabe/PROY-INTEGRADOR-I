export default function VerificacionTrabajadorPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center border border-[#2A2A38] bg-[#111118] rounded-3xl p-10">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A855F7] to-[#6366F1] flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        <h1
          className="text-4xl font-extrabold mb-4"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Solicitud Enviada
        </h1>

        <p className="text-[#9090A8] text-lg leading-relaxed mb-8">
          Tu perfil profesional fue enviado correctamente.
          Nuestro equipo revisará tu información para activar tu cuenta como trabajador verificado.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[#151520] border border-[#2A2A38] rounded-2xl p-5">
            <h2 className="font-bold mb-2">
              Rol Profesional Activado
            </h2>

            <p className="text-sm text-[#9090A8]">
              Tu cuenta ya cuenta con acceso al panel de trabajador.
            </p>
          </div>

          <div className="bg-[#151520] border border-[#2A2A38] rounded-2xl p-5">
            <h2 className="font-bold mb-2">
              Verificación en Proceso
            </h2>

            <p className="text-sm text-[#9090A8]">
              Revisaremos tu CV y experiencia para validar tu perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}