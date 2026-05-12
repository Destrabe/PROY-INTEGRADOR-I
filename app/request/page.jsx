"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/header";
import { createRequest } from "@/app/authService";

const categoryRules = {
  Tecnología: { modalidades: ["Presencial", "Virtual"] },
  Hogar: { modalidades: ["Presencial"] },
  Diseño: { modalidades: ["Presencial", "Virtual"] },
  Educación: { modalidades: ["Presencial", "Virtual"] },
  Legal: { modalidades: ["Presencial", "Virtual"] },
  Transporte: { modalidades: ["Presencial"] },
  Salud: { modalidades: ["Presencial"] },
  Otro: { modalidades: ["Presencial", "Virtual"] },
};

export default function RequestPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [modalidad, setModalidad] = useState("Presencial");
  const [ubicacion, setUbicacion] = useState("");
  const [urgencia, setUrgencia] = useState("Hoy mismo (urgente)");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step4Done, setStep4Done] = useState(false);
  const inputRef = useRef();

  const categories = [
    "Tecnología",
    "Hogar",
    "Diseño",
    "Educación",
    "Legal",
    "Transporte",
    "Salud",
    "Otro",
  ];

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const rules = categoryRules[cat];
    if (!rules.modalidades.includes(modalidad)) {
      setModalidad(rules.modalidades[0]);
    }
  };

  const getStep = () => {
    if (step4Done) return 4;
    if (presupuesto || ubicacion) return 3;
    if (titulo || descripcion) return 2;
    if (category) return 1;
    return 1;
  };

  const activeStep = getStep();
  const steps = ["Categoría", "Descripción", "Detalles", "Publicar"];

  const handleFiles = (files) => {
    const arr = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => {
      const existingNames = prev.map((img) => img.name);
      return [...prev, ...arr.filter((img) => !existingNames.includes(img.name))];
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (isDraft = false) => {
    if (!category || !titulo || !descripcion) {
      setError("Por favor completa categoría, título y descripción.");
      return;
    }
    setError("");
    setLoading(true);
    if (!isDraft) setStep4Done(true);
    const result = await createRequest({
      category, titulo, descripcion,
      presupuesto, modalidad, ubicacion, urgencia,
      estado: isDraft ? "borrador" : "publicada",
    });
    setLoading(false);
    if (result.success) router.push("/");
    else {
      setStep4Done(false);
      setError("Error al guardar. Intenta de nuevo.");
    }
  };

  const modalidadesDisponibles = category ? categoryRules[category].modalidades : ["Presencial", "Virtual"];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0f0f1a] text-white px-3 sm:px-6 py-10 pb-20">
        <div className="max-w-[620px] mx-auto">

          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-white mb-2 flex items-center gap-1 bg-transparent border-none cursor-pointer"
          >
            ← Volver
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold mb-5">Nueva solicitud</h1>

          {/* Stepper */}
          <div className="flex items-center mb-8">
            {steps.map((step, i) => {
              const stepNum = i + 1;
              const isActive = stepNum === activeStep && !step4Done;
              const isDone = stepNum < activeStep || (stepNum === 4 && step4Done);
              return (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center gap-1 sm:gap-2 text-sm transition-all ${isActive || isDone ? "text-white" : "text-gray-500"}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                      ${isDone ? "bg-green-500" : isActive ? "bg-[#6c5ce7]" : "bg-[#2a2a3d]"}`}>
                      {isDone ? "✓" : stepNum}
                    </span>
                    <span className="hidden sm:inline text-xs">{step}</span>
                  </div>
                  {i < 3 && (
                    <div className={`w-4 sm:w-8 h-px mx-1 sm:mx-2 transition-all ${isDone ? "bg-green-500" : "bg-[#333]"}`} />
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-base font-semibold mb-1">¿Qué tipo de servicio necesitas?</p>
          <p className="text-sm text-gray-400 mb-4">Elige la categoría que mejor describe tu solicitud</p>

          {/* Categorías */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`bg-[#1c1c2b] text-center py-3 px-2 rounded-xl text-sm cursor-pointer border transition-all
                  ${category === cat ? "border-[#6c5ce7] bg-[#2a2a3d]" : "border-transparent hover:bg-[#2a2a3d]"}`}
              >
                {cat}
              </div>
            ))}
          </div>

          {/* Formulario */}
          <div className="bg-[#1c1c2b] rounded-xl p-4 sm:p-6 mb-5">
            <h3 className="text-base font-semibold mb-4">Describe tu solicitud</h3>

            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Título de la solicitud
              </label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg placeholder-gray-600 focus:outline-none focus:border-[#6c5ce7]"
                placeholder="Ej: Necesito técnico para instalar cámaras de seguridad en casa"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Descripción detallada
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg placeholder-gray-600 focus:outline-none focus:border-[#6c5ce7] h-28 resize-y"
                placeholder="Cuéntanos qué necesitas exactamente..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Presupuesto (S/)
                </label>
                <input
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg placeholder-gray-600 focus:outline-none focus:border-[#6c5ce7]"
                  placeholder="Ej: 100-200"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Modalidad
                  {category && modalidadesDisponibles.length === 1 && (
                    <span className="ml-2 text-yellow-400 normal-case font-normal">
                      (solo {modalidadesDisponibles[0].toLowerCase()} para {category})
                    </span>
                  )}
                </label>
                <select
                  value={modalidad}
                  onChange={(e) => setModalidad(e.target.value)}
                  disabled={modalidadesDisponibles.length === 1}
                  className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#6c5ce7] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modalidadesDisponibles.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Ubicación
                </label>
                <input
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg placeholder-gray-600 focus:outline-none focus:border-[#6c5ce7]"
                  placeholder="Distrito y referencia"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  ¿Cuándo lo necesitas?
                </label>
                <select
                  value={urgencia}
                  onChange={(e) => setUrgencia(e.target.value)}
                  className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#6c5ce7]"
                >
                  <option>Hoy mismo (urgente)</option>
                  <option>Esta semana</option>
                </select>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div
            className="border-2 border-dashed border-[#333] rounded-xl p-6 sm:p-10 text-center mb-6 text-gray-500 text-sm"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
            />
            <p className="mb-1">Adjunta imágenes (opcional)</p>
            <p>
              Arrastra fotos del trabajo o{" "}
              <button onClick={() => inputRef.current.click()} className="text-[#6c5ce7] hover:underline bg-transparent border-none cursor-pointer p-0 text-sm">
                selecciona archivos
              </button>
            </p>
            {images.length > 0 && (
              <div className="flex gap-2 mt-4 justify-center flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={img.url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center border-none cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-lg border border-[#444] text-white text-sm bg-transparent hover:bg-[#1c1c2b] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border border-[#333] text-white text-sm bg-[#1c1c2b] hover:bg-[#2a2a3d] cursor-pointer disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Borrador"}
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg text-white text-sm bg-[#6c5ce7] hover:bg-[#5b4dc7] cursor-pointer border-none disabled:opacity-50"
            >
              {loading ? "Publicando..." : "Publicar solicitud"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
