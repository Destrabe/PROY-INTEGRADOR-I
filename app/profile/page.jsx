"use client";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";
import { uploadProfilePhoto } from "@/firebase/uploadProfilePhoto";

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
  { label: "Calidad", score: 0 },
  { label: "Comunicación", score: 0 },
  { label: "Puntualidad", score: 0 },
  { label: "Precio", score: 0 },
];

export default function NexoraProfile() {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState("Trabajos");
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState("perfil");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tempPreview, setTempPreview] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [zoom, setZoom] = useState(1);

  const handleApplyImage = async () => {
    if (!selectedFile || !user?.uid) return;

    try {
      setUploading(true);

      const photoURL = await uploadProfilePhoto(user.uid, selectedFile);

      setPreview(photoURL);

      updateUser({
        photoURL,
      });

      setShowEditModal(false);
      setSelectedFile(null);
      setTempPreview(null);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setTempPreview(URL.createObjectURL(file));
  };

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
            <div className="w-32 h-32 rounded-full overflow-hidden bg-[#6c63ff] flex-shrink-0">
              {preview || user?.photoURL ? (
                <img
                  src={preview || user.photoURL}
                  alt="perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                  JR
                </div>
              )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-semibold">
                  {user?.first_name} {user?.last_name}
                </h1>
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
                  0.0
                </span>
                <span>0 reseñas</span>
              </div>
              <p className="text-base text-gray-500 mt-4 leading-relaxed">
                Desarrollador fullstack con experiencia en productos digitales
                modernos.
              </p>
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-3 flex-shrink-0">
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
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] rounded-xl shadow-lg transition-all z-50"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M4.93 19.07l1.41-1.41" />
            <path d="M17.66 6.34l1.41-1.41" />
          </svg>

          <span>Configuración</span>
        </button>
        {/* Actions */}
        {showSettings && (
          <div className="bg-[#1a1a1f] rounded-3xl p-8 border border-white/5">
            <h2 className="text-2xl font-bold mb-6">Configuración</h2>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setSettingsTab("perfil")}
                className={`px-4 py-2 rounded-xl ${
                  settingsTab === "perfil" ? "bg-[#6c63ff]" : "bg-[#252529]"
                }`}
              >
                Perfil
              </button>

              <button
                onClick={() => setSettingsTab("apariencia")}
                className={`px-4 py-2 rounded-xl ${
                  settingsTab === "apariencia" ? "bg-[#6c63ff]" : "bg-[#252529]"
                }`}
              >
                Apariencia
              </button>
            </div>

            {settingsTab === "perfil" && (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-[#252529] overflow-hidden border-4 border-[#6c63ff]">
                    {preview || user?.photoURL ? (
                      <img
                        src={preview || user.photoURL}
                        alt="perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-bold">JR</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="mt-4 px-5 py-2 rounded-xl bg-[#6c63ff] hover:bg-[#5a52d5]"
                  >
                    Cambiar foto
                  </button>
                </div>

                <div>
                  <p className="text-gray-400">Nombre</p>
                  <h3 className="text-xl font-semibold">
                    {user?.first_name} {user?.last_name}
                  </h3>
                </div>

                <div>
                  <p className="text-gray-400">Correo</p>
                  <h3>{user?.email}</h3>
                </div>

                <div>
                  <p className="text-gray-400">Rol</p>
                  <h3>{user?.rol}</h3>
                </div>
              </div>
            )}

            {settingsTab === "apariencia" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Apariencia</h3>

                <div className="flex gap-3">
                  <button className="px-5 py-3 rounded-xl bg-[#6c63ff]">
                    Claro
                  </button>

                  <button className="px-5 py-3 rounded-xl bg-[#252529]">
                    Oscuro
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { value: "0", label: "Trabajos" },
            { value: "0.0", label: "Valoración" },
            { value: "0%", label: "Éxito" },
            { value: "Nuevo", label: "En Nexora" },
            { value: "S/ 0", label: "Tarifa estándar" },
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
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
          <div className="w-[600px] bg-[#1a1a1f] rounded-3xl p-8 border border-white/10 relative">
            {/* Botón cerrar */}
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>

            {/* Título */}
            <h2 className="text-2xl font-semibold text-center mb-8">
              Selecciona una imagen
            </h2>

            {/* Área de subida */}
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleImageChange(e);
                  setShowUploadModal(false);
                  setShowEditModal(true);
                }}
              />

              <div className="h-56 border-2 border-dashed border-[#3a3a42] bg-[#252529] rounded-2xl flex flex-col items-center justify-center hover:border-[#6c63ff] hover:bg-[#2b2b31] transition-all">
                {/* Icono */}
                <div className="w-20 h-20 rounded-full bg-[#6c63ff]/20 flex items-center justify-center mb-4">
                  <span className="text-4xl text-[#6c63ff]">+</span>
                </div>

                <p className="text-lg font-medium text-white">Subir imagen</p>

                <p className="text-sm text-gray-400 mt-2">PNG, JPG o JPEG</p>
              </div>
            </label>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
          <div className="w-[650px] bg-[#1a1a1f] rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Editar Imagen
            </h2>

            <div className="flex justify-center mb-8">
              <div className="w-60 h-60 rounded-full overflow-hidden border-4 border-[#6c63ff]">
                {tempPreview && (
                  <img
                    src={tempPreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${zoom})`,
                    }}
                  />
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Pequeño</span>
                <span>Grande</span>
              </div>

              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#6c63ff]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setZoom(1)}
                className="py-3 rounded-xl bg-[#252529]"
              >
                Restablecer
              </button>

              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedFile(null);
                  setTempPreview(null);
                  setZoom(1);
                }}
                className="py-3 rounded-xl bg-red-500/20 text-red-400"
              >
                Cancelar
              </button>

              <button
                onClick={handleApplyImage}
                disabled={uploading}
                className="py-3 rounded-xl bg-[#6c63ff]"
              >
                {uploading ? "Aplicando..." : "Aplicar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
