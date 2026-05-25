"use client";

import Link from "next/link";

const CATEGORIAS = [
  "Desarrollo Web", "Diseño UI/UX", "Marketing Digital", "Redacción",
  "Video Edición", "SEO", "Desarrollo Móvil", "Consultoría",
];

export default function Hero() {
  return (
    <main>
      {/* parte 1: HERO */}
      <section
        className="w-full min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-20 relative overflow-hidden"
        style={{ background: "#0A0A0F" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, #6C63FF14 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #ffffff06 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7" style={{ background: "#6C63FF", border: "none", color: "#fff" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#fff" }} />
            Marketplace local · San Juan de Lurigancho
          </div>

          <h1 className="font-extrabold leading-tight mb-5" style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(42px, 6vw, 72px)", letterSpacing: "-2px", color: "#F0F0F8" }}>
  Encuentra microservicios
  <br />
  <span style={{ background: "linear-gradient(135deg, #7c3aed, #6c63ff, #4f8ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>rápidos, confiables y al instante</span>
</h1>

          <p className="text-lg mb-10 mx-auto max-w-lg leading-relaxed" style={{ color: "#9090A8", fontFamily: "DM Sans, sans-serif", fontWeight: 300 }}>
            Conecta con profesionales verificados y obtén servicios digitales de calidad premium en minutos
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
            <Link href="/FeedTrabajos" className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all w-full sm:w-auto hover:opacity-90" style={{ background: "#6C63FF", color: "#fff", fontFamily: "DM Sans, sans-serif" }}>
              Explorar Servicios →
            </Link>
            <Link href="/register" className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all w-full sm:w-auto hover:border-[#6C63FF] hover:text-white" style={{ background: "transparent", border: "1px solid #363648", color: "#9090A8", fontFamily: "DM Sans, sans-serif" }}>
              Publicar Proyecto
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-6 sm:gap-10">
            {[
              { n: "⚡", l: "Respuestas en minutos" },
{ n: "✓", l: "Profesionales verificados" },
{ n: "🔒", l: "Pagos seguros" },
{ n: "⭐", l: "Calidad garantizada" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-extrabold text-2xl" style={{ fontFamily: "Syne, sans-serif", color: "#F0F0F8" }}>{s.n}</div>
                <div className="text-xs mt-1" style={{ color: "#606078" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORÍAS POPULARES */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20" style={{ background: "#0A0A0F", borderTop: "1px solid #2A2A38" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bold text-center mb-10" style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", color: "#F0F0F8", letterSpacing: "-0.5px" }}>
            Categorías Populares
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat}
                href="/FeedTrabajos"
                className="rounded-xl px-4 py-3 text-center text-sm font-medium transition-all duration-200"
                style={{ background: "#111118", border: "1px solid #2A2A38", color: "#9090A8", fontFamily: "DM Sans, sans-serif" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#6C63FF18";
                  e.currentTarget.style.borderColor = "#6C63FF55";
                  e.currentTarget.style.color = "#A8A3FF";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
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
        </div>
      </section>
    </main>
  );
}