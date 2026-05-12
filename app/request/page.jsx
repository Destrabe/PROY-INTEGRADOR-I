"use client";
import { useState, useRef } from "react";

export default function RequestPage() {
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
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

  const handleFiles = (files) => {
    const arr = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...arr]);
  };

  return (
    <>
      <div className="min-h-screen bg-[#0f0f1a] text-white px-6 py-10">
        <div className="max-w-[620px] mx-auto">
          {/* Volver */}
          <button
            onClick={() => window.history.back()}
            className="text-sm text-gray-400 hover:text-white mb-2 flex items-center gap-1 bg-transparent border-none cursor-pointer"
          >
            ← Volver
          </button>

          {/* Título */}
          <h1 className="text-3xl font-bold mb-5">Nueva solicitud</h1>

          {/* Stepper */}
          <div className="flex items-center mb-8">
            {["Categoría", "Descripción", "Detalles", "Publicar"].map(
              (step, i) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 text-sm ${i === 0 ? "text-white" : "text-gray-500"}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${i === 0 ? "bg-[#6c5ce7]" : "bg-[#2a2a3d]"}`}
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                  {i < 3 && <div className="w-8 h-px bg-[#333] mx-2" />}
                </div>
              ),
            )}
          </div>

          {/* Categorías */}
          <p className="text-base font-semibold mb-1">
            ¿Qué tipo de servicio necesitas?
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Elige la categoría que mejor describe tu solicitud
          </p>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => setCategory(cat)}
                className={`bg-[#1c1c2b] text-center py-3 px-2 rounded-xl text-sm cursor-pointer border transition-all
                  ${
                    category === cat
                      ? "border-[#6c5ce7] bg-[#2a2a3d]"
                      : "border-transparent hover:bg-[#2a2a3d]"
                  }`}
              >
                {cat}
              </div>
            ))}
          </div>

          {/* Formulario */}
          <div className="bg-[#1c1c2b] rounded-xl p-6 mb-5">
            <h3 className="text-base font-semibold mb-4">
              Describe tu solicitud
            </h3>

            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Título de la solicitud
              </label>
              <input
                className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg placeholder-gray-600 focus:outline-none focus:border-[#6c5ce7]"
                placeholder="Ej: Necesito técnico para instalar cámaras de seguridad en casa"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Descripción detallada
              </label>
              <textarea
                className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg placeholder-gray-600 focus:outline-none focus:border-[#6c5ce7] h-28 resize-y"
                placeholder="Cuéntanos qué necesitas exactamente, cuándo, dónde y cualquier detalle relevante que ayude a los trabajadores a entender el trabajo..."
              />
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Presupuesto (S/)
                </label>
                <input
                  className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg placeholder-gray-600 focus:outline-none focus:border-[#6c5ce7]"
                  placeholder="Ej: 100-200"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Modalidad
                </label>
                <select className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#6c5ce7]">
                  <option>Presencial</option>
                  <option>Virtual</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Ubicación
                </label>
                <input
                  className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg placeholder-gray-600 focus:outline-none focus:border-[#6c5ce7]"
                  placeholder="Distrito y referencia"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  ¿Cuándo lo necesitas?
                </label>
                <select className="w-full bg-[#111] border border-[#2a2a3d] text-white text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#6c5ce7]">
                  <option>Hoy mismo (urgente)</option>
                  <option>Esta semana</option>
                </select>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div
            className="border-2 border-dashed border-[#333] rounded-xl p-10 text-center mb-6 text-gray-500 text-sm"
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
              onChange={(e) => handleFiles(e.target.files)}
            />
            <p className="mb-1">Adjunta imágenes (opcional)</p>
            <p>
              Arrastra fotos del trabajo o{" "}
              <button
                onClick={() => inputRef.current.click()}
                className="text-[#6c5ce7] hover:underline bg-transparent border-none cursor-pointer p-0 text-sm"
              >
                selecciona archivos
              </button>
            </p>
            {images.length > 0 && (
              <div className="flex gap-2 mt-4 justify-center flex-wrap">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-between gap-3">
            <button className="px-5 py-2.5 rounded-lg border border-[#444] text-white text-sm bg-transparent hover:bg-[#1c1c2b] cursor-pointer">
              Cancelar
            </button>
            <button className="px-5 py-2.5 rounded-lg border border-[#333] text-white text-sm bg-[#1c1c2b] hover:bg-[#2a2a3d] cursor-pointer">
              Guardar Borrador
            </button>
            <button className="px-5 py-2.5 rounded-lg text-white text-sm bg-[#6c5ce7] hover:bg-[#5b4dc7] cursor-pointer border-none">
              Publicar solicitud
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
