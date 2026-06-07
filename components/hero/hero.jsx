"use client";

import Link from "next/link";
import Image from "next/image";
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Respuestas Rápidas",
    desc: "Obtén propuestas de profesionales en minutos, no días",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Profesionales Verificados",
    desc: "Todos los freelancers pasan por un proceso de verificación",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent) 0%, transparent 70%)",
            opacity: 0.15,
          }}
        />
        <div className="relative max-w-4xl mx-auto w-full">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-white" />
            Conecta con los mejores profesionales
          </div>

          {/* Título */}
          <h1
            className="font-extrabold leading-tight mb-5"
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              letterSpacing: "-2px",
              color: "var(--text-main)",
            }}
          >
            Encuentra microservicios{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              rápidos, confiables y al instante
            </span>
          </h1>

          <p
            className="text-lg mb-10 mx-auto max-w-lg leading-relaxed"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 300 }}
          >
            Conecta con profesionales verificados y obtén servicios digitales de calidad premium en minutos
          </p>

          <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 h-px my-16" style={{ background: "var(--border-color)" }} />

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
            <Link href="/feedJobs" className="btn-primary">
              Explorar Servicios →
            </Link>
            <Link href={!loading && user ? "/NewRequest" : "/register"} className="btn-cta">
              Publicar Proyecto
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {CARDS.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl p-6 text-left"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "var(--accent-bg)", color: "var(--accent-text)" }}
                >
                  {c.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "15px", color: "var(--text-main)" }}>
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 h-px my-16" style={{ background: "var(--border-color)" }} />

          {/* Categorías Populares */}
          <h2
            className="font-bold text-center mb-6"
            style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "22px", color: "var(--text-main)" }}
          >
            Categorías Populares
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                className="categoria-btn rounded-xl px-4 py-3 text-center text-sm font-medium transition-all duration-200"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 h-px my-16" style={{ background: "var(--border-color)" }} />

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div
                key={s.l}
                className="rounded-2xl p-6 text-center"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
              >
                <div
                  className="font-extrabold text-3xl mb-1"
                  style={{
                    fontFamily: "var(--font-syne), sans-serif",
                    background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {s.n}
                </div>
                <div className="text-sm" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Cómo funciona */}
        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20" style={{ borderTop: "1px solid var(--border-color)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-2" style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "28px", color: "var(--text-main)" }}>
                ¿Cómo funciona Nexora?
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Simple, rápido y seguro — en 3 pasos</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                  n: "03",
                  title: "Elige y coordina",
                  desc: "Revisa los perfiles, chatea con los candidatos y contrata al que mejor se adapte.",
                },
              ].map((item) => (
                <div key={item.title} className="relative rounded-2xl p-7 overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                  <div className="absolute top-0 right-4 font-extrabold leading-none select-none" style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "80px", color: "var(--border-color)" }}>
                    {item.n}
                  </div>
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--accent-bg)", color: "var(--accent-text)" }}>
                      {item.icon}
                    </div>
                    <h3 className="font-bold mb-2" style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "16px", color: "var(--text-main)" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección Conectando talento */}
        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20" style={{ borderTop: "1px solid var(--border-color)" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-bold mb-1" style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(22px, 4vw, 28px)", color: "var(--text-main)" }}>
              Conectando talento
            </h2>
            <h2 className="font-bold mb-10 md:mb-12" style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(22px, 4vw, 28px)", color: "var(--accent)" }}>
              Construyendo confianza
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: "Seguridad ante todo",
                  desc: "Cada especialista pasa por un proceso de verificación de antecedentes y habilidades. Tu hogar merece lo mejor.",
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="6 3 18 3 22 9 12 21 2 9 6 3" />
                    </svg>
                  ),
                  title: "Transparencia total",
                  desc: "Sin sorpresas ni costos ocultos. Cotiza, compara y paga solo cuando el trabajo esté terminado.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--accent-bg)", color: "var(--accent-text)" }}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección Nuevo estándar */}
        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20" style={{ borderTop: "1px solid var(--border-color)" }}>
          <div className="max-w-5xl mx-auto rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center" style={{ background: "var(--accent)" }}>
            <Image
              src="/images/persona-1.webp"
              alt="personas"
              width={288}
              height={200}
              className="rounded-2xl object-cover w-full md:w-72 shrink-0"
            />
            <div>
              <h3 className="font-bold text-lg mb-3 text-white" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                Un nuevo estándar para SJL
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.85)" }}>
                Estamos dando los primeros pasos para profesionalizar los microservicios en el distrito. Al centralizar la oferta de gasfitería, pintura y electricidad en un solo lugar, facilitamos la vida del vecino.
              </p>
              <Link href="/register" className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:bg-black/40" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)" }}>
                Únete como experto
              </Link>
            </div>
          </div>
        </section>

        {/* Sección Frase */}
        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20" style={{ borderTop: "1px solid var(--border-color)" }}>
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <Image
              src="/images/tecnologia-1.webp"
              alt="Tecnología"
              width={400}
              height={240}
              className="w-full md:w-1/2 rounded-2xl object-cover shrink-0"
            />
            <div>
              <p className="text-5xl mb-4" style={{ color: "var(--accent)", lineHeight: 1 }}>&quot;</p>
              <p className="font-bold leading-snug mb-6" style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "clamp(18px, 3vw, 22px)", color: "var(--text-main)" }}>
                Nuestra meta es digitalizar el talento de San Juan de Lurigancho, brindando herramientas modernas a los trabajadores y tranquilidad a las familias del distrito.
              </p>
              <p className="font-bold text-sm" style={{ color: "var(--text-main)" }}>El equipo</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Estudiantes de la facultad de ingeniería de la Universidad Tecnológica del Perú</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}