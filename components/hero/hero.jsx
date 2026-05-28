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
        style={{ background: "#0A0A0F" }}
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
              color: "#9090A8",
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
                color: "#9090A8",
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
                    color: "#9090A8",
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
              color: "#F0F0F8",
            }}
          >
            Categorías Populares
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat}
                href="/FeedTrabajos"
                className="rounded-xl px-4 py-3 text-center text-sm font-medium transition-all duration-200"
                style={{
                  background: "#111118",
                  border: "1px solid #2A2A38",
                  color: "#9090A8",
                  fontFamily: "DM Sans, sans-serif",
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
              >
                {cat}
              </Link>
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
                    color: "#9090A8",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
