"use client";

import { useThemeStore } from "@/store/themeStore"; // Importamos tu store original

export default function FAQPage() {
  // Traemos el estado del store exacto
  const theme = useThemeStore((state) => state.theme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);

  // Configuración de colores internos condicionales
  const cardBg = theme === "dark" ? "#151520" : "#ffffff";
  const cardBorder = theme === "dark" ? "#2A2A38" : "#e4e4e7";
  const mutedText = theme === "dark" ? "#9090A8" : "#64748b";

  const faqData = [
    {
      question: "¿Qué es Nexora?",
      answer:
        "Nexora es una plataforma digital que conecta personas con profesionales independientes para realizar microservicios de manera rápida, segura y confiable.",
    },
    {
      question: "¿Qué tipo de servicios puedo encontrar?",
      answer:
        "Puedes encontrar servicios como desarrollo web, diseño UI/UX, edición de video, marketing digital, redacción, soporte técnico, electricidad, pintura y más.",
    },
    {
      question: "¿Cómo publico una solicitud?",
      answer:
        "Solo necesitas crear una cuenta, ingresar a la sección de publicar proyecto y describir el servicio que necesitas junto con tu presupuesto.",
    },
    {
      question: "¿Los trabajadores son verificados?",
      answer:
        "Sí. Nexora busca garantizar confianza y seguridad verificando perfiles y promoviendo valoraciones transparentes entre usuarios.",
    },
    {
      question: "¿Cuánto cuesta usar Nexora?",
      answer:
        "Crear una cuenta y explorar servicios es totalmente gratuito. Algunos servicios pueden incluir pagos acordados directamente con el trabajador.",
    },
    {
      question: "¿Cómo contacto a un profesional?",
      answer:
        "Puedes enviar mensajes directamente desde la plataforma utilizando el sistema de mensajería integrado.",
    },
    {
      question: "¿Puedo convertirme en trabajador?",
      answer:
        "Sí. Puedes registrarte como trabajador y comenzar a ofrecer tus servicios dentro de la plataforma.",
    },
    {
      question: "¿Nexora está disponible en todo Perú?",
      answer:
        "Actualmente el proyecto está enfocado principalmente en San Juan de Lurigancho, con planes de expansión futura.",
    },
  ];

  return (
    <main
      className="mt-12 min-h-screen w-full px-4 sm:px-6 md:px-8 py-20 transition-colors duration-300"
      style={{ background: background[theme], color: textColor[theme] }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 bg-[#6C63FF] text-white">
            Centro de Ayuda
          </div>

          <h1
            className="font-extrabold leading-tight mb-5 font-['Syne',sans-serif] text-[clamp(38px,5vw,64px)] tracking-[-2px]"
            style={{ color: textColor[theme] }}
          >
            Preguntas{" "}
            <span className="bg-[linear-gradient(135deg,#7c3aed,#6c63ff,#4f8ef7)] bg-clip-text text-transparent">
              Frecuentes
            </span>
          </h1>

          <p
            className="max-w-2xl mx-auto leading-relaxed text-[17px] font-['DM_Sans',sans-serif] transition-colors"
            style={{ color: mutedText }}
          >
            Encuentra respuestas rápidas sobre cómo funciona Nexora, publicación
            de proyectos, seguridad, trabajadores y más.
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="grid grid-cols-1 gap-5">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 border shadow-md"
              style={{
                backgroundColor: cardBg,
                borderColor: cardBorder,
                color: textColor[theme],
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[linear-gradient(135deg,#7c3aed,#6c63ff)] shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 15h.01M9.09 9a3 3 0 115.82 1c0 2-3 3-3 3" />
                  </svg>
                </div>

                {/* Content */}
                <div>
                  <h2
                    className="font-bold mb-2 font-['Syne',sans-serif] text-[18px]"
                    style={{ color: textColor[theme] }}
                  >
                    {faq.question}
                  </h2>

                  <p
                    className="leading-relaxed font-['DM_Sans',sans-serif] text-[15px] transition-colors"
                    style={{ color: mutedText }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-3xl p-8 text-center bg-[linear-gradient(135deg,#7c3aed,#6c63ff,#4f8ef7)] shadow-xl">
          <h2 className="font-extrabold mb-3 text-white font-['Syne',sans-serif] text-[30px]">
            ¿Aún tienes dudas?
          </h2>

          <p className="mb-6 text-[rgba(255,255,255,0.85)] font-['DM_Sans',sans-serif]">
            Nuestro equipo está listo para ayudarte a comenzar en Nexora.
          </p>

          <button className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.03] bg-black/25 border border-white/20">
            Contactar Soporte
          </button>
        </div>
      </div>
    </main>
  );
}
