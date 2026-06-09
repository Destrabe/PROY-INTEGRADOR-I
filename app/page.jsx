"use client";

import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useThemeStore } from "@/store/themeStore";
import Image from "next/image";

function HomePage() {
  const [user, loading] = useAuthState(auth);

  const theme = useThemeStore((state) => state.theme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);

  return (
    <main>
      <div
        style={{
          background: background[theme],
          color: textColor[theme],
        }}
        className=" w-full min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#6C63FF14_0%,transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative max-w-4xl mx-auto sw-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7 bg-[#6C63FF] border-none text-white">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-white" />
            Conecta con los mejores profesionales
          </div>

          <h1 className="font-syne text-[clamp(36px,5vw,64px)] tracking-[-2px] font-extrabold leading-tight mb-5">
            <span className="">Encuentra microservicios&nbsp;</span>
            <span className="bg-[linear-gradient(135deg,#7c3aed,#6c63ff,#4f8ef7)] bg-clip-text text-transparent">
              rápidos, confiables y al instante
            </span>
          </h1>

          <p className="font-sans text-[#9090a8] font-light text-lg mb-10 mx-auto max-w-lg leading-relaxed">
            Conecta con profesionales verificados y obtén servicios digitales de
            calidad premium en minutos
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
            <Link
              href="/FeedTrabajos"
              className="font-sans text-white bg-[#6C63FF] flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all w-full sm:w-auto hover:opacity-90"
            >
              Explorar Servicios →
            </Link>
            <Link
              href={!loading && user ? "/NewRequest" : "/register"}
              className="font-sans text-[#9090a8] bg-transparent border border-[#363648] flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all w-full sm:w-auto hover:border-[#6C63FF] hover:text-white"
            >
              Publicar Proyecto
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            <div
              style={{ background: theme === "dark" ? "#111118" : "lightgray" }}
              className="rounded-2xl p-6 text-left  border border-[#2A2A38]"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[linear-gradient(135deg,#7c3aed,#6c63ff)]">
                <Image
                  src="/svg/lightning.svg"
                  alt="Respuestas rápidas"
                  width={22}
                  height={22}
                />
              </div>
              <h3 className="font-syne font-bold text-[15px] mb-2">
                Respuestas Rápidas
              </h3>
              <p className="font-sans text-sm leading-relaxed text-[#9090a8]">
                Obtén propuestas de profesionales en minutos, no días
              </p>
            </div>

            <div
              style={{ background: theme === "dark" ? "#111118" : "lightgray" }}
              className="rounded-2xl p-6 text-left  border border-[#2A2A38]"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[linear-gradient(135deg,#7c3aed,#6c63ff)]">
                <Image
                  src="/svg/shield.svg"
                  alt="Profesionales verificados"
                  width={22}
                  height={22}
                />
              </div>
              <h3 className="font-syne font-bold text-[15px] mb-2 ">
                Profesionales Verificados
              </h3>
              <p className="font-sans text-sm leading-relaxed text-[#9090a8]">
                Todos los freelancers pasan por un proceso de verificación
              </p>
            </div>

            <div
              style={{ background: theme === "dark" ? "#111118" : "lightgray" }}
              className="rounded-2xl p-6 text-left  border border-[#2A2A38]"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[linear-gradient(135deg,#7c3aed,#6c63ff)]">
                <Image
                  src="/svg/premium.svg"
                  alt="Calidad premium"
                  width={22}
                  height={22}
                />
              </div>
              <h3 className="font-syne font-bold text-[15px] mb-2 ">
                Calidad Premium
              </h3>
              <p className="font-sans text-sm leading-relaxed text-[#9090a8]">
                Servicios de alta calidad con garantía de satisfacción
              </p>
            </div>
          </div>

          <h2 className="font-syne font-bold text-center mb-6 text-[22px] ">
            Categorías Populares
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
            {[
              "Desarrollo Web",
              "Diseño UI/UX",
              "Marketing Digital",
              "Redacción",
              "Video Edición",
              "SEO",
              "Desarrollo Móvil",
              "Consultoría",
            ].map((cat) => (
              <button
                style={{
                  background: theme === "dark" ? "#111118" : "lightgray",
                }}
                key={cat}
                type="button"
                className="font-sans rounded-xl px-4 py-3 text-center text-sm font-medium cursor-default  border border-[#2A2A38]  transition-all duration-200 hover:bg-[#6C63FF18] hover:border-[#6C63FF55] hover:text-[#A8A3FF] hover:-translate-y-0.5"
                onClick={(e) => e.preventDefault()}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              style={{ background: theme === "dark" ? "#111118" : "lightgray" }}
              className="rounded-2xl p-6 text-center border border-[#2A2A38]"
            >
              <div className="font-syne font-extrabold text-3xl mb-1 bg-gradient-to-br from-[#7c3aed] via-[#6c63ff] to-[#4f8ef7] bg-clip-text text-transparent">
                10,000+
              </div>
              <div className="font-sans text-sm text-[#9090a8]">
                Proyectos Completados
              </div>
            </div>

            <div
              style={{ background: theme === "dark" ? "#111118" : "lightgray" }}
              className="rounded-2xl p-6 text-center  border border-[#2A2A38]"
            >
              <div className="font-syne font-extrabold text-3xl mb-1 bg-gradient-to-br from-[#7c3aed] via-[#6c63ff] to-[#4f8ef7] bg-clip-text text-transparent">
                5,000+
              </div>
              <div className="font-sans text-sm text-[#9090a8]">
                Freelancers Activos
              </div>
            </div>

            <div
              style={{ background: theme === "dark" ? "#111118" : "lightgray" }}
              className="rounded-2xl  p-6 text-center border border-[#2A2A38]"
            >
              <div className="font-syne font-extrabold text-3xl mb-1 bg-gradient-to-br from-[#7c3aed] via-[#6c63ff] to-[#4f8ef7] bg-clip-text text-transparent">
                98%
              </div>
              <div className="font-sans text-sm text-[#9090a8]">
                Satisfacción Cliente
              </div>
            </div>
          </div>
        </div>

        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20  mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-syne font-bold mb-2 text-[28px] tracking-[-0.5px]">
                ¿Cómo funciona Nexora?
              </h2>
              <p className="text-[#9090a8] text-sm">
                Simple, rápido y seguro — en 3 pasos
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              <div
                style={{
                  background: theme === "dark" ? "#111118" : "lightgray",
                }}
                className="relative rounded-2xl p-7 overflow-hidden  border border-[#2A2A38]"
              >
                <div className="font-syne text-[80px] text-[#2A2A38] absolute top-0 right-4 font-extrabold leading-none select-none">
                  01
                </div>
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[#6C63FF22]">
                    <Image
                      src="/svg/field.svg"
                      alt="Publica tu solicitud"
                      width={22}
                      height={22}
                    />
                  </div>
                  <h3 className="font-syne font-bold mb-2  text-base">
                    Publica tu solicitud
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9090a8]">
                    Describe el servicio que necesitas, tu presupuesto y dónde
                    lo necesitas. Gratis y en menos de 2 minutos.
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: theme === "dark" ? "#111118" : "lightgray",
                }}
                className="relative rounded-2xl p-7 overflow-hidden border border-[#2A2A38]"
              >
                <div className="font-syne text-[80px] text-[#2A2A38] absolute top-0 right-4 font-extrabold leading-none select-none">
                  02
                </div>
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[#6C63FF22]">
                    <Image
                      src="/svg/group.svg"
                      alt="Recibe postulantes"
                      width={22}
                      height={22}
                    />
                  </div>
                  <h3 className="font-syne font-bold mb-2 text-base">
                    Recibe postulantes
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9090a8]">
                    Los trabajadores independientes de tu zona ven tu solicitud
                    y se postulan con su precio y experiencia.
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: theme === "dark" ? "#111118" : "lightgray",
                }}
                className="relative rounded-2xl p-7 overflow-hidden  border border-[#2A2A38]"
              >
                <div className="font-syne text-[80px] text-[#2A2A38] absolute top-0 right-4 font-extrabold leading-none select-none">
                  03
                </div>
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[#6C63FF22]">
                    <Image
                      src="/svg/verification.svg"
                      alt="Elige y coordina"
                      width={22}
                      height={22}
                    />
                  </div>
                  <h3 className="font-syne font-bold mb-2 s text-base">
                    Elige y coordina
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9090a8]">
                    Revisa los perfiles, chatea con los candidatos and contrata
                    al que mejor se adapte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-syne font-bold mb-1 text-[clamp(22px,4vw,28px)] tracking-[-0.5px]">
              Conectando talento
            </h2>
            <h2 className="font-syne font-bold mb-10 md:mb-12 text-[#6C63FF] text-[clamp(22px,4vw,28px)] tracking-[-0.5px]">
              Construyendo confianza
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              <div
                style={{
                  background: theme === "dark" ? "#111118" : "lightgray",
                }}
                className="rounded-2xl p-6   border border-[#2A2A38]"
              >
                <div className="bg-[#6C63FF22] w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  <Image
                    src="/svg/shield.svg"
                    alt="Seguridad ante todo"
                    width={22}
                    height={22}
                  />
                </div>
                <h3 className="font-syne font-bold text-sm mb-2">
                  Seguridad ante todo
                </h3>
                <p className="text-sm leading-relaxed text-[#9090a8]">
                  Cada especialista pasa por un proceso de verificación de
                  antecedentes y habilidades. Tu hogar merece lo mejor.
                </p>
              </div>

              <div
                style={{
                  background: theme === "dark" ? "#111118" : "lightgray",
                }}
                className="rounded-2xl p-6 border border-[#2A2A38]"
              >
                <div className="bg-[#6C63FF22] w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  <Image
                    src="/svg/network.svg"
                    alt="Seguridad ante todo"
                    width={22}
                    height={22}
                  />
                </div>
                <h3 className="font-syne font-bold text-sm mb-2">
                  Impulso local
                </h3>
                <p className="text-sm leading-relaxed text-[#9090a8]">
                  Empoderamos a los trabajadores de San Juan de Lurigancho,
                  brindándoles herramientas digitales para crecer.
                </p>
              </div>

              <div
                style={{
                  background: theme === "dark" ? "#111118" : "lightgray",
                }}
                className="rounded-2xl p-6 border border-[#2A2A38]"
              >
                <div className="bg-[#6C63FF22] w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  <Image
                    src="/svg/transparency.svg"
                    alt="Transparencia total"
                    width={22}
                    height={22}
                  />
                </div>
                <h3 className="font-syne font-bold text-sm mb-2">
                  Transparencia total
                </h3>
                <p className="text-sm leading-relaxed text-[#9090a8]">
                  Sin sorpresas ni costos ocultos. Cotiza, compara y paga solo
                  cuando el trabajo esté terminado.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20">
          <div className="bg-[#6c63ff] max-w-5xl mx-auto rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            <img
              src="/images/persona-1.webp"
              alt="personas"
              className="h-[200px] rounded-2xl object-cover w-full md:w-72 shrink-0"
            />
            <div>
              <h3 className="font-syne font-bold text-lg mb-3 text-white">
                Un nuevo estándar para SJL
              </h3>
              <p className="text-sm leading-relaxed mb-5 text-white/[0.85]">
                Estamos dando los primeros pasos para profesionalizar los
                microservicios en el distrito. Al centralizar la oferta de
                gasfitería, pintura y electricidad en un solo lugar, facilitamos
                la vida del vecino.
              </p>
              <Link
                href="/register"
                className="bg-black/30 border border-white/20 inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:bg-black/40"
              >
                Únete como experto
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full px-4 sm:px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <img
              src="/images/tecnologia.webp"
              alt="Tecnología"
              className="h-60 w-full md:w-1/2 rounded-2xl object-cover shrink-0"
            />
            <div>
              <p className="text-5xl mb-4 text-[#6C63FF] leading-none">"</p>
              <p className="font-syne font-bold leading-snug mb-6 text-[clamp(18px,3vw,22px)]">
                Nuestra meta es digitalizar el talento de San Juan de
                Lurigancho, brindando herramientas modernas a los trabajadores y
                tranquilidad a las familias del distrito.
              </p>
              <div className="font-bold text-sm">El equipo</div>
              <p className="text-sm mt-1 text-[#606078]">
                Estudiantes de la facultad de ingeniería de la Universidad
                Tecnológica del Perú
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomePage;
