"use client";

import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";

const CATEGORIAS = [
  "Desarrollo Web",
  "Diseño UI/UX",
  "Marketing Digital",
  "Redacción",
  "Video Edición",
  "SEO",
  "Desarrollo Móvil",
  "Consultoría",
];

const CARDS = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Respuestas Rápidas",
    desc: "Obtén propuestas de profesionales en minutos, no días",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Profesionales Verificados",
    desc: "Todos los freelancers pasan por un proceso de verificación",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    title: "Calidad Premium",
    desc: "Servicios de alta calidad con garantía de satisfacción",
  },
];

const STATS = [
  { n: "10,000+", l: "Proyectos Completados" },
  { n: "5,000+", l: "Freelancers Activos" },
  { n: "98%", l: "Satisfacción Cliente" },
];

export default function Hero() {
  const [user, loading] = useAuthState(auth);

  return (
    <main>
      {/* HERO */}
      <section
        className="w-full min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-20 relative overflow-hidden"
        style={{ background: "var(--bg-main)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #6C63FF14 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff06 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-4xl mx-auto w-full">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7"
            style={{ background: "#6C63FF", border: "none", color: "#fff" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#fff" }}
            />
            Conecta con los mejores profesionales
          </div>

          {/* Título */}
          <h1
            className="font-extrabold leading-tight mb-5"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              letterSpacing: "-2px",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>Encuentra microservicios</span>{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed, #6c63ff, #4f8ef7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              rápidos, confiables y al instante
            </span>
          </h1>

          <p
            className="text-lg mb-10 mx-auto max-w-lg leading-relaxed"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 300,
            }}
          >
            Conecta con profesionales verificados y obtén servicios digitales de
            calidad premium en minutos
          </p>
          <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 h-px bg-[#2A2A38] my-16"></div>
          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
            <Link
              href="/FeedTrabajos"
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all w-full sm:w-auto hover:opacity-90"
              style={{
                background: "#6C63FF",
                color: "#fff",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Explorar Servicios →
            </Link>
            <Link
              href={!loading && user ? "/NewRequest" : "/register"}
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all w-full sm:w-auto hover:border-[#6C63FF] hover:text-white"
              style={{
                background: "transparent",
                border: "1px solid #363648",
                color: "var(--text-secondary)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Publicar Proyecto
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {CARDS.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl p-6 text-left"
                style={{ background: "#111118", border: "1px solid #2A2A38" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #6c63ff)",
                  }}
                >
                  {c.icon}
                </div>
                <h3
                  className="font-bold mb-2 text-white"
                  style={{ fontFamily: "Syne, sans-serif", fontSize: "15px" }}
                >
                  {c.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "var(--text-secondary)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 h-px bg-[#2A2A38] my-16"></div>
          {/* Categorías Populares */}
          <h2
            className="font-bold text-center mb-6"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "22px",
              color: "var(--text-main)",
            }}
          >
            Categorías Populares
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
            {CATEGORIAS.map((cat) => (
              <button
                type="button"
                key={cat}
                className="rounded-xl px-4 py-3 text-center text-sm font-medium transition-all duration-200"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  fontFamily: "DM Sans, sans-serif",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#6C63FF18";
                  e.currentTarget.style.borderColor = "#6C63FF55";
                  e.currentTarget.style.color = "#A8A3FF";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#111118";
                  e.currentTarget.style.borderColor = "#2A2A38";
                  e.currentTarget.style.color = "#9090A8";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={(e) => e.preventDefault()}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 h-px bg-[#2A2A38] my-16"></div>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div
                key={s.l}
                className="rounded-2xl p-6 text-center"
                style={{ background: "#111118", border: "1px solid #2A2A38" }}
              >
                <div
                  className="font-extrabold text-3xl mb-1"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    background:
                      "linear-gradient(135deg, #7c3aed, #6c63ff, #4f8ef7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {s.n}
                </div>
                <div
                  className="text-sm"
                  style={{
                    color: "var(--text-secondary)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* parte 1 - cómo funciona */}
        <section
          className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20"
          style={{ borderTop: "1px solid #2A2A38" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="font-bold mb-2"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "28px",
                  color: "var(--text-main)",
                  letterSpacing: "-0.5px",
                }}
              >
                ¿Cómo funciona Nexora?
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                Simple, rápido y seguro — en 3 pasos
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {[
                {
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6C63FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  ),
                  n: "01",
                  title: "Publica tu solicitud",
                  desc: "Describe el servicio que necesitas, tu presupuesto y dónde lo necesitas. Gratis y en menos de 2 minutos.",
                },
                {
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6C63FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                  n: "02",
                  title: "Recibe postulantes",
                  desc: "Los trabajadores independientes de tu zona ven tu solicitud y se postulan con su precio y experiencia.",
                },
                {
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6C63FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
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
                        color: "var(--text-main)",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* parte 2 - conectando talento */}
        <section
          className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20"
          style={{ borderTop: "1px solid #2A2A38" }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="font-bold mb-1"
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(22px, 4vw, 28px)",
                color: "var(--text-main)",
                letterSpacing: "-0.5px",
              }}
            >
              Conectando talento
            </h2>
            <h2
              className="font-bold mb-10 md:mb-12"
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(22px, 4vw, 28px)",
                color: "#6C63FF",
                letterSpacing: "-0.5px",
              }}
            >
              Construyendo confianza
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {[
                {
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6C63FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: "Seguridad ante todo",
                  desc: "Cada especialista pasa por un proceso de verificación de antecedentes y habilidades. Tu hogar merece lo mejor.",
                },
                {
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6C63FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20" />
                    </svg>
                  ),
                  title: "Impulso local",
                  desc: "Empoderamos a los trabajadores de San Juan de Lurigancho, brindándoles herramientas digitales para crecer.",
                },
                {
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6C63FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="6 3 18 3 22 9 12 21 2 9 6 3" />
                    </svg>
                  ),
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
                    style={{ fontFamily: "Syne, sans-serif", color: "var(--text-main)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* parte 3 - nuevo estándar */}
        <section
          className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20"
          style={{ borderTop: "1px solid #2A2A38" }}
        >
          <div
            className="max-w-5xl mx-auto rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center"
            style={{ background: "#6C63FF" }}
          >
            <img
              src="/images/persona-1.webp"
              alt="personas"
              className="rounded-2xl object-cover w-full md:w-72 shrink-0"
              style={{ height: "200px" }}
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
              <Link
                href="/register"
                className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:bg-black/40"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Únete como experto
              </Link>
            </div>
          </div>
        </section>

        {/* parte 4 - frase */}
        <section
          className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20"
          style={{ borderTop: "1px solid #2A2A38" }}
        >
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <img
              src="/images/tecnologia-1.webp"
              alt="Tecnología"
              className="w-full md:w-1/2 rounded-2xl object-cover shrink-0"
              style={{ height: "240px" }}
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
                  fontSize: "clamp(18px, 3vw, 22px)",
                  color: "var(--text-main)",
                }}
              >
                Nuestra meta es digitalizar el talento de San Juan de
                Lurigancho, brindando herramientas modernas a los trabajadores y
                tranquilidad a las familias del distrito.
              </p>
              <p className="font-bold text-sm" style={{ color: "var(--text-main)" }}>
                El equipo
              </p>
              <p className="text-sm mt-1" style={{ color: "#606078" }}>
                Estudiantes de la facultad de ingeniería de la Universidad
                Tecnológica del Perú
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
