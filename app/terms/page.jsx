"use client";

import { useThemeStore } from "@/store/themeStore";

export default function TermsPage() {
  const theme = useThemeStore((state) => state.theme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);

  // Colores dinámicos para las tarjetas y textos secundarios
  const cardBg = theme === "dark" ? "#111118" : "#ffffff";
  const cardBorder = theme === "dark" ? "#2A2A38" : "#e4e4e7";
  const mutedText = theme === "dark" ? "#9ca3af" : "#64748b";

  return (
    <main 
      className="mt-12 min-h-screen px-6 py-12 transition-colors duration-300"
      style={{ backgroundColor: background[theme] }}
    >
      <div className="max-w-4xl mx-auto">
        {/* HERO */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-[linear-gradient(135deg,#A855F7,#6366F1)] mb-5">
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
            className="font-syne text-5xl font-extrabold mb-3 transition-colors"
            style={{ color: textColor[theme] }}
          >
            Términos y Condiciones
          </h1>

          <p className="text-lg transition-colors" style={{ color: mutedText }}>
            Conoce las reglas y responsabilidades para utilizar Nexora.
          </p>
        </div>

        {/* CARD */}
        <div 
          className="border rounded-3xl p-8 md:p-10 transition-colors"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          {/* INTRO */}
          <p className="leading-8 mb-8 transition-colors" style={{ color: mutedText }}>
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

              <h2 
                className="text-2xl font-bold transition-colors"
                style={{ color: textColor[theme] }}
              >
                Uso de la plataforma
              </h2>
            </div>

            <p className="leading-7 transition-colors" style={{ color: mutedText }}>
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

              <h2 
                className="text-2xl font-bold transition-colors"
                style={{ color: textColor[theme] }}
              >
                Responsabilidad del usuario
              </h2>
            </div>

            <p className="leading-7 transition-colors" style={{ color: mutedText }}>
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

              <h2 
                className="text-2xl font-bold transition-colors"
                style={{ color: textColor[theme] }}
              >
                Conducta adecuada
              </h2>
            </div>

            <p className="leading-7 transition-colors" style={{ color: mutedText }}>
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

              <h2 
                className="text-2xl font-bold transition-colors"
                style={{ color: textColor[theme] }}
              >
                Modificaciones
              </h2>
            </div>

            <p className="leading-7 transition-colors" style={{ color: mutedText }}>
              Nexora podrá actualizar estos términos para mejorar el servicio o
              adaptarse a nuevas obligaciones legales.
            </p>
          </div>

          {/* ACEPTACIÓN */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 mt-10 transition-colors">
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

              <h2 
                className="text-xl font-bold transition-colors"
                style={{ color: textColor[theme] }}
              >
                Aceptación de los términos
              </h2>
            </div>

            <p className="leading-7 transition-colors" style={{ color: mutedText }}>
              Al registrarte y utilizar Nexora confirmas que has leído,
              comprendido y aceptado estos términos y condiciones.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}