export default function TermsPage() {
  return (
    <main
      className="min-h-screen px-6 py-12"
      style={{ background: "#0A0A0F" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-10">
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: "linear-gradient(135deg,#A855F7,#6366F1)",
            }}
          >
            <svg
              width="40"
              height="40"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <h1
            className="text-5xl font-extrabold text-white mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Términos y Condiciones
          </h1>

          <p className="text-lg text-gray-400">
            Conoce las reglas y responsabilidades para utilizar Nexora.
          </p>
        </div>

        {/* CARD */}
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: "#111118",
            border: "1px solid #2A2A38",
          }}
        >
          {/* INTRO */}
          <p className="text-gray-300 leading-8 mb-8">
            Bienvenido a Nexora. Al crear una cuenta y utilizar nuestra
            plataforma aceptas los siguientes términos y condiciones.
          </p>

          {/* USO */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M8 2v4M16 2v4" />
              </svg>

              <h2 className="text-2xl font-bold text-white">
                Uso de la plataforma
              </h2>
            </div>

            <p className="text-gray-400 leading-7">
              Nexora permite publicar, buscar y gestionar oportunidades
              laborales y servicios profesionales entre usuarios.
            </p>
          </div>

          {/* RESPONSABILIDAD */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>

              <h2 className="text-2xl font-bold text-white">
                Responsabilidad del usuario
              </h2>
            </div>

            <p className="text-gray-400 leading-7">
              Cada usuario es responsable de la información que comparte dentro
              de la plataforma y debe proporcionar datos reales y actualizados.
            </p>
          </div>

          {/* CONDUCTA */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="9" />
              </svg>

              <h2 className="text-2xl font-bold text-white">
                Conducta adecuada
              </h2>
            </div>

            <p className="text-gray-400 leading-7">
              Está prohibido publicar contenido ofensivo, engañoso,
              discriminatorio, ilegal o que vulnere derechos de terceros.
            </p>
          </div>

          {/* MODIFICACIONES */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>

              <h2 className="text-2xl font-bold text-white">
                Modificaciones
              </h2>
            </div>

            <p className="text-gray-400 leading-7">
              Nexora podrá actualizar estos términos para mejorar el servicio o
              adaptarse a nuevas obligaciones legales.
            </p>
          </div>

          {/* ACEPTACIÓN */}
          <div
            className="rounded-2xl p-6 mt-10"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.3)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="9" />
              </svg>

              <h2 className="text-xl font-bold text-white">
                Aceptación de los términos
              </h2>
            </div>

            <p className="text-gray-300 leading-7">
              Al registrarte y utilizar Nexora confirmas que has leído,
              comprendido y aceptado estos términos y condiciones.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}