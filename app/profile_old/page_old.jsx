"use client";
import { useState } from "react";
import Image from "next/image";

const tabs = ["Trabajos", "Reseñas", "Sobre mí", "Portfolio"];

const jobs = [
  {
    title: "Título del trabajo",
    date: "Feb 2025",
    duration: "3 semanas",
    status: "Completado",
    description:
      "Descripción del trabajo realizado con excelentes resultados para el cliente.",
    tags: ["Diseño", "UI/UX", "Figma"],
    amount: "s/ 9,500.00",
  },
  {
    title: "Descripcion",
    date: "Feb 2025",
    duration: "3 semanas",
    status: null,
    description:
      "Descripción del proyecto de desarrollo completado satisfactoriamente.",
    tags: ["React", "Node.js", "API"],
    amount: null,
  },
  {
    title: "Descripcion",
    date: "Feb 2025",
    duration: "3 semanas",
    status: null,
    description:
      "Descripción del trabajo con implementación de funcionalidades avanzadas.",
    tags: ["Python", "ML", "Data"],
    amount: null,
  },
];

const skills = [
  { label: "React" },
  { label: "Node.js" },
  { label: "TypeScript" },
  { label: "UI Design" },
  { label: "Figma" },
  { label: "Python" },
];

const reputationItems = [
  { label: "Calidad", score: 4.9 },
  { label: "Comunicación", score: 4.8 },
  { label: "Puntualidad", score: 5.0 },
  { label: "Precio", score: 4.7 },
];

export default function NexoraProfile() {
  const [activeTab, setActiveTab] = useState("Trabajos");

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "#111113", color: "#fff", colorScheme: "dark" }}
    >
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-[#1a1a1f] rounded-3xl p-9 border border-white/5">
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-[#6c63ff] flex-shrink-0 flex items-center justify-center text-4xl font-bold">
              JR
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-semibold">Juan Rodriguez</h1>
                <span className="flex items-center gap-1.5 bg-[#6c63ff]/20 text-[#6c63ff] text-base px-4 py-1 rounded-full border border-[#6c63ff]/30">
                  <Image
                    src="/svg/checkIcon.svg"
                    alt="check"
                    className="object-contain"
                    width={18}
                    height={18}
                  />
                  Verificado
                </span>
              </div>
              <div className="flex items-center gap-5 mt-3 text-base text-gray-400 flex-wrap">
                <span className="flex items-center gap-2">
                  <Image
                    src="/svg/locationIcon.svg"
                    alt="location"
                    className="object-contain"
                    width={18}
                    height={18}
                  />
                  S.J.L
                </span>
                <span className="flex items-center gap-2 text-green-400">
                  <Image
                    src="/svg/calendarIcon.svg"
                    alt="calendar"
                    className="object-contain"
                    width={18}
                    height={18}
                  />
                  Disponible ahora
                </span>
                <span className="flex items-center gap-2 text-yellow-400">
                  <Image
                    src="/svg/starIcon.svg"
                    alt="star"
                    className="object-contain"
                    width={18}
                    height={18}
                  />
                  4.9
                </span>
                <span>31 reseñas</span>
              </div>
              <p className="text-base text-gray-500 mt-4 leading-relaxed">
                Desarrollador fullstack con experiencia en productos digitales
                modernos.
              </p>
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-3 shrink-0">
              <button className="flex items-center gap-2 px-5 py-2.5 text-base bg-[#6c63ff] hover:bg-[#5a52e0] rounded-xl transition-colors font-medium">
                <Image
                  src="/svg/plusIcon.svg"
                  alt="plus"
                  className="object-contain"
                  width={18}
                  height={18}
                />
                Contratar
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 text-base bg-[#252529] hover:bg-[#2e2e34] rounded-xl border border-white/5 transition-colors">
                <Image
                  src="/svg/messageIcon.svg"
                  alt="message"
                  className="object-contain"
                  width={18}
                  height={18}
                />
                Mensaje
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 text-base bg-[#252529] hover:bg-[#2e2e34] rounded-xl border border-white/5 transition-colors">
                <Image
                  src="/svg/shareIcon.svg"
                  alt="share"
                  className="object-contain"
                  width={18}
                  height={18}
                />
                Compartir
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { value: "48", label: "Trabajos" },
            { value: "4.9", label: "Valoración" },
            { value: "96%", label: "Éxito" },
            { value: "3 años", label: "En nexora" },
            { value: "s/ 85", label: "Tarifa estándar" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-[#1a1a1f] rounded-2xl p-6 text-center border border-white/5"
            >
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-sm text-gray-500 mt-2">{label}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Info */}
            <div className="bg-[#1a1a1f] rounded-2xl p-6 border border-white/5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-5">
                Información
              </h2>
              <div className="space-y-4 text-base text-gray-400">
                <div className="flex items-center gap-3">
                  <Image
                    src="/svg/clockIcon.svg"
                    alt="clock"
                    className="object-contain"
                    width={18}
                    height={18}
                  />
                  <span>Tiempo completo</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/svg/calendarIcon.svg"
                    alt="calendar"
                    className="object-contain"
                    width={18}
                    height={18}
                  />
                  <span>Miembro desde 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/svg/linkIcon.svg"
                    alt="link"
                    className="object-contain"
                    width={18}
                    height={18}
                  />
                  <a
                    href="#"
                    className="hover:text-[#6c63ff] transition-colors"
                  >
                    www.profile.com
                  </a>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-[#1a1a1f] rounded-2xl p-6 border border-white/5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-5">
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {skills.map(({ label }) => (
                  <span
                    key={label}
                    className="bg-[#6c63ff]/25 text-[#6c63ff] text-sm px-4 py-2 rounded-full border border-[#6c63ff]/20"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Reputation */}
            <div className="bg-[#1a1a1f] rounded-2xl p-6 border border-white/5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-5">
                Reputación
              </h2>
              <div className="space-y-5">
                {reputationItems.map(({ label, score }) => (
                  <div key={label}>
                    <div className="flex justify-between text-base mb-2">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-white font-medium">{score}</span>
                    </div>
                    <div className="h-2.5 bg-[#2a2a30] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6c63ff] rounded-full"
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 bg-[#1a1a1f] rounded-xl p-2 border border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-base py-3 rounded-lg transition-all font-medium ${
                    activeTab === tab
                      ? "bg-[#6c63ff] text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Job Cards */}
            {activeTab === "Trabajos" && (
              <div className="space-y-4">
                {jobs.map((job, i) => (
                  <div
                    key={i}
                    className="bg-[#1a1a1f] rounded-2xl p-6 border border-white/5 hover:border-[#6c63ff]/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        {job.title}
                      </h3>
                      {job.amount && (
                        <span className="text-[#6c63ff] text-base font-medium whitespace-nowrap">
                          {job.amount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-5 text-base text-gray-500 mb-3">
                      <span className="flex items-center gap-2">
                        <Image
                          src="/svg/calendarIcon.svg"
                          alt="calendar"
                          className="object-contain"
                          width={16}
                          height={16}
                        />
                        {job.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Image
                          src="/svg/clockIcon.svg"
                          alt="clock"
                          className="object-contain"
                          width={16}
                          height={16}
                        />
                        {job.duration}
                      </span>
                      {job.status && (
                        <span className="bg-green-500/15 text-green-400 px-3 py-0.5 rounded-full border border-green-500/20 text-sm">
                          {job.status}
                        </span>
                      )}
                    </div>
                    <p className="text-base text-gray-400 mb-4 leading-relaxed">
                      {job.description}
                    </p>
                    <div className="flex gap-2.5 flex-wrap">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#252529] text-gray-400 text-sm px-4 py-1.5 rounded-lg border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab !== "Trabajos" && (
              <div className="bg-[#1a1a1f] rounded-2xl p-12 border border-white/5 text-center text-gray-500 text-base">
                No hay contenido disponible aún.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
