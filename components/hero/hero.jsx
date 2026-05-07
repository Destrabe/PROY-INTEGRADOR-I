import { Shield, Globe, Gem, FileText, Users, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <main>
      {/* parte 1: HERO */}
      <section
        className="w-full min-h-screen flex flex-col items-center justify-center text-center px-8 py-20 relative overflow-hidden"
        style={{ background: "#0A0A0F" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #6C63FF14 0%, transparent 70%)",
          }}
        ></div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff06 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="relative max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7"
            style={{
              background: "#6C63FF22",
              border: "1px solid #6C63FF33",
              color: "#8B85FF",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#6C63FF" }}
            ></span>
            Marketplace local · San Juan de Lurigancho
          </div>

          <h1
            className="font-extrabold leading-tight mb-5"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(42px, 6vw, 72px)",
              letterSpacing: "-2px",
              color: "#F0F0F8",
            }}
          >
            Encuentra microservicios
            <br />
            <span style={{ color: "#6C63FF" }}>rápidos y confiables</span>
          </h1>

          <p
            className="text-lg mb-10 mx-auto max-w-lg leading-relaxed"
            style={{
              color: "#9090A8",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 300,
            }}
          >
            Conecta con los mejores trabajadores independientes de tu zona.
            Rápido, seguro y transparente.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <button
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: "#6C63FF",
                color: "#fff",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Necesito a alguien →
            </button>
            <button
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: "transparent",
                border: "1px solid #363648",
                color: "#9090A8",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Puedo ayudar a alguien
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {[
              { n: "1.2K+", l: "Trabajadores activos" },
              { n: "3.8K+", l: "Trabajos completados" },
              { n: "4.9★", l: "Valoración promedio" },
              { n: "15+", l: "Categorías" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div
                  className="font-extrabold text-2xl"
                  style={{ fontFamily: "Syne, sans-serif", color: "#F0F0F8" }}
                >
                  {s.n}
                </div>
                <div className="text-xs mt-1" style={{ color: "#606078" }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* parte 2 - cómo funciona */}
      <section
        className="w-full px-8 py-20"
        style={{ background: "#0A0A0F", borderTop: "1px solid #2A2A38" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="font-bold mb-2"
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "28px",
                color: "#F0F0F8",
                letterSpacing: "-0.5px",
              }}
            >
              ¿Cómo funciona Nexora?
            </h2>
            <p style={{ color: "#9090A8", fontSize: "14px" }}>
              Simple, rápido y seguro — en 3 pasos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <FileText size={22} color="#6C63FF" />,
                n: "01",
                title: "Publica tu solicitud",
                desc: "Describe el servicio que necesitas, tu presupuesto y dónde lo necesitas. Gratis y en menos de 2 minutos.",
              },
              {
                icon: <Users size={22} color="#6C63FF" />,
                n: "02",
                title: "Recibe postulantes",
                desc: "Los trabajadores independientes de tu zona ven tu solicitud y se postulan con su precio y experiencia.",
              },
              {
                icon: <CheckCircle size={22} color="#6C63FF" />,
                n: "03",
                title: "Elige y coordina",
                desc: "Revisa los perfiles, chatea con los candidatos y contrata al que mejor se adapte.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="relative rounded-2xl p-7 overflow-hidden"
                style={{ background: "#111118", border: "1px solid #2A2A38" }}
              >
                <div
                  className="absolute top-0 right-4 font-extrabold leading-none select-none"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "80px",
                    color: "#2A2A38",
                  }}
                >
                  {item.n}
                </div>
                <div className="relative">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "#6C63FF22" }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="font-bold mb-2"
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "16px",
                      color: "#F0F0F8",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#9090A8" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* parte 3 - conectando talento */}
      <section
        className="w-full px-8 py-20"
        style={{ background: "#0A0A0F", borderTop: "1px solid #2A2A38" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-bold mb-2"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "28px",
              color: "#F0F0F8",
              letterSpacing: "-0.5px",
            }}
          >
            Conectando talento
          </h2>
          <h2
            className="font-bold mb-12"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "28px",
              color: "#6C63FF",
              letterSpacing: "-0.5px",
            }}
          >
            Construyendo confianza
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Shield size={22} color="#6C63FF" />,
                title: "Seguridad ante todo",
                desc: "Cada especialista pasa por un proceso de verificación de antecedentes y habilidades. Tu hogar merece lo mejor.",
              },
              {
                icon: <Globe size={22} color="#6C63FF" />,
                title: "Impulso local",
                desc: "Empoderamos a los trabajadores de San Juan de Lurigancho, brindándoles herramientas digitales para crecer.",
              },
              {
                icon: <Gem size={22} color="#6C63FF" />,
                title: "Transparencia total",
                desc: "Sin sorpresas ni costos ocultos. Cotiza, compara y paga solo cuando el trabajo esté terminado.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-6"
                style={{ background: "#111118", border: "1px solid #2A2A38" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "#6C63FF22" }}
                >
                  {item.icon}
                </div>
                <h3
                  className="font-bold text-sm mb-2"
                  style={{ fontFamily: "Syne, sans-serif", color: "#F0F0F8" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#9090A8" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* parte 4 - nuevo estándar */}
      <section
        className="w-full px-8 py-20"
        style={{ background: "#0A0A0F", borderTop: "1px solid #2A2A38" }}
      >
        <div
          className="max-w-5xl mx-auto rounded-2xl p-10 flex flex-col md:flex-row gap-8 items-center"
          style={{ background: "#6C63FF" }}
        >
          <img
            src="images/persona-1.jpg"
            alt="personas"
            className="rounded-2xl object-cover shrink-0"
            style={{ width: "280px", height: "200px" }}
          />
          <div>
            <h3
              className="font-bold text-lg mb-3 text-white"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Un nuevo estándar para SJL
            </h3>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              Estamos dando los primeros pasos para profesionalizar los
              microservicios en el distrito. Al centralizar la oferta de
              gasfitería, pintura y electricidad en un solo lugar, facilitamos
              la vida del vecino.
            </p>
            <button
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Únete como experto
            </button>
          </div>
        </div>
      </section>

      {/* parte 5 - frase */}
      <section
        className="w-full px-8 py-20"
        style={{ background: "#0A0A0F", borderTop: "1px solid #2A2A38" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <img
            src="images/tecnologia-1.jpg"
            alt="Tecnología"
            className="w-full md:w-1/2 rounded-2xl object-cover shrink-0"
            style={{ height: "280px" }}
          />
          <div>
            <p
              className="text-5xl mb-4"
              style={{ color: "#6C63FF", lineHeight: 1 }}
            >
              "
            </p>
            <p
              className="font-bold leading-snug mb-6"
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "22px",
                color: "#F0F0F8",
              }}
            >
              Nuestra meta es digitalizar el talento de San Juan de Lurigancho,
              brindando herramientas modernas a los trabajadores y tranquilidad
              a las familias del distrito.
            </p>
            <p className="font-bold text-sm" style={{ color: "#F0F0F8" }}>
              El equipo
            </p>
            <p className="text-sm mt-1" style={{ color: "#606078" }}>
              Estudiantes de la facultad de ingeniería de la Universidad
              Tecnológica del Perú
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
