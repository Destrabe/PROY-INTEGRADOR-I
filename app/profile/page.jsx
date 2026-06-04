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
  { label: "React", width: "w-20" },
  { label: "Node.js", width: "w-16" },
  { label: "TypeScript", width: "w-24" },
  { label: "UI Design", width: "w-20" },
  { label: "Figma", width: "w-14" },
  { label: "Python", width: "w-16" },
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
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Profile Header Card */}
        <div className="bg-[#1a1a1f] rounded-2xl p-5 border border-white/5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-violet-600 flex-shrink-0 flex items-center justify-center text-xl font-bold">
              JR
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-semibold">Juan Rodriguez</h1>
                <span className="flex items-center gap-1 bg-violet-600/20 text-violet-400 text-xs px-2 py-0.5 rounded-full border border-violet-500/30">
                  <Image
                    src="/svg/checkIcon.svg"
                    alt="check"
                    className="object-contain"
                    width={16}
                    height={16}
                  />{" "}
                  Verificado
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Image
                    src="/svg/locationIcon.svg"
                    alt="location"
                    className="object-contain"
                    width={16}
                    height={16}
                  />{" "}
                  S.J.L
                </span>
                <span className="flex items-center gap-1 text-green-400">
                  <Image
                    src="/svg/calendarIcon.svg"
                    alt="calendar"
                    className="object-contain"
                    width={16}
                    height={16}
                  />{" "}
                  Disponible ahora
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Image
                    src="/svg/starIcon.svg"
                    alt="star"
                    className="object-contain"
                    width={16}
                    height={16}
                  />{" "}
                  4.9
                </span>
                <span>31 reseñas</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Desarrollador fullstack con experiencia en productos digitales
                modernos.
              </p>
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors font-medium">
                <Image
                  src="/svg/plusIcon.svg"
                  alt="plus"
                  className="object-contain"
                  width={16}
                  height={16}
                />
                Contratar
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-[#252529] hover:bg-[#2e2e34] rounded-lg border border-white/5 transition-colors">
                <Image
                  src="/svg/messageIcon.svg"
                  alt="message"
                  className="object-contain"
                  width={16}
                  height={16}
                />{" "}
                Mensaje
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-[#252529] hover:bg-[#2e2e34] rounded-lg border border-white/5 transition-colors">
                <Image
                  src="/svg/shareIcon.svg"
                  alt="share"
                  className="object-contain"
                  width={16}
                  height={16}
                />{" "}
                Compartir
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { value: "48", label: "Trabajos" },
            { value: "4.9", label: "Valoración" },
            { value: "96%", label: "Éxito" },
            { value: "3 años", label: "En nexora" },
            { value: "s/ 85", label: "Tarifa estándar" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-[#1a1a1f] rounded-xl p-4 text-center border border-white/5"
            >
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left Sidebar */}
          <div className="space-y-4">
            {/* Info */}
            <div className="bg-[#1a1a1f] rounded-2xl p-4 border border-white/5">
              <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-3">
                Información
              </h2>
              <div className="space-y-2.5 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Image
                    src="/svg/clockIcon.svg"
                    alt="clock"
                    className="object-contain"
                    width={16}
                    height={16}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/svg/calendarIcon.svg"
                    alt="calendar"
                    className="object-contain"
                    width={16}
                    height={16}
                  />
                  <span>Miembro desde 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/svg/linkIcon.svg"
                    alt="link"
                    className="object-contain"
                    width={16}
                    height={16}
                  />
                  <a
                    href="#"
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    www.profile.com
                  </a>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-[#1a1a1f] rounded-2xl p-4 border border-white/5">
              <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-3">
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(({ label, width }) => (
                  <span
                    key={label}
                    className={`bg-violet-600/25 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-500/20 ${width}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Reputation */}
            <div className="bg-[#1a1a1f] rounded-2xl p-4 border border-white/5">
              <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-3">
                Reputación
              </h2>
              <div className="space-y-3">
                {reputationItems.map(({ label, score }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-white font-medium">{score}</span>
                    </div>
                    <div className="h-1.5 bg-[#2a2a30] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-[#1a1a1f] rounded-xl p-1 border border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-xs py-2 rounded-lg transition-all font-medium ${
                    activeTab === tab
                      ? "bg-violet-600 text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Job Cards */}
            {activeTab === "Trabajos" && (
              <div className="space-y-3">
                {jobs.map((job, i) => (
                  <div
                    key={i}
                    className="bg-[#1a1a1f] rounded-2xl p-4 border border-white/5 hover:border-violet-500/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-white">
                        {job.title}
                      </h3>
                      {job.amount && (
                        <span className="text-violet-400 text-xs font-medium whitespace-nowrap">
                          {job.amount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Image
                          src="/svg/calendarIcon.svg"
                          alt="calendar"
                          className="object-contain"
                          width={16}
                          height={16}
                        />{" "}
                        {job.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Image
                          src="/svg/clockIcon.svg"
                          alt="clock"
                          className="object-contain"
                          width={16}
                          height={16}
                        />{" "}
                        {job.duration}
                      </span>
                      {job.status && (
                        <span className="bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                          {job.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-3">
                      {job.description}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#252529] text-gray-400 text-xs px-2.5 py-1 rounded-lg border border-white/5"
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
              <div className="bg-[#1a1a1f] rounded-2xl p-8 border border-white/5 text-center text-gray-500 text-sm">
                No hay contenido disponible aún.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
