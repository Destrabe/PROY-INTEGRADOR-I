export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12" style={{ background: "#0A0A0F" }}>
      {" "}
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
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>

          <h1
            className="text-5xl font-extrabold text-white mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Política de Privacidad
          </h1>

          <p className="text-lg text-gray-400">
            Tu información y seguridad son importantes para nosotros.
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
          <p className="text-gray-300 leading-8 mb-8">
            En Nexora valoramos y protegemos la privacidad de nuestros usuarios.
            Esta política explica cómo recopilamos, utilizamos y protegemos la
            información proporcionada dentro de la plataforma.
          </p>

          {/* INFORMACIÓN */}
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
                Información recopilada
              </h2>
            </div>

            <p className="text-gray-400 leading-7">
              Podemos recopilar información como nombre, correo electrónico,
              fotografía de perfil y otros datos necesarios para el correcto
              funcionamiento de la plataforma.
            </p>
          </div>

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
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-6" />
              </svg>

              <h2 className="text-2xl font-bold text-white">
                Uso de la información
              </h2>
            </div>

            <p className="text-gray-400 leading-7">
              Utilizamos la información para gestionar cuentas, mejorar la
              experiencia de usuario, personalizar funcionalidades y brindar
              soporte dentro de Nexora.
            </p>
          </div>

          {/* SEGURIDAD */}
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
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>

              <h2 className="text-2xl font-bold text-white">
                Protección de datos
              </h2>
            </div>

            <p className="text-gray-400 leading-7">
              Implementamos medidas de seguridad razonables para proteger la
              información almacenada contra accesos no autorizados, pérdida o
              alteración de datos.
            </p>
          </div>

          {/* COMPARTICIÓN */}
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
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 13.5l6.8 4" />
                <path d="M15.4 6.5l-6.8 4" />
              </svg>

              <h2 className="text-2xl font-bold text-white">
                Compartición de información
              </h2>
            </div>

            <p className="text-gray-400 leading-7">
              Nexora no vende ni comparte información personal con terceros,
              excepto cuando exista una obligación legal o sea necesario para la
              prestación del servicio.
            </p>
          </div>

          {/* DERECHOS */}
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
                Derechos del usuario
              </h2>
            </div>

            <p className="text-gray-400 leading-7">
              Los usuarios pueden solicitar la actualización, corrección o
              eliminación de su información personal conforme a las políticas de
              la plataforma.
            </p>
          </div>

          {/* CAMBIOS */}
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
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>

              <h2 className="text-xl font-bold text-white">
                Cambios en esta política
              </h2>
            </div>

            <p className="text-gray-300 leading-7">
              Esta política puede actualizarse periódicamente para reflejar
              mejoras en Nexora, nuevas funcionalidades o cambios legales.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
