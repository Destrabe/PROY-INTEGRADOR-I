"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function TrabajadorPage() {
  const [cv, setCv] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-4xl font-extrabold mb-3"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Únete como Trabajador
        </h1>

        <p className="text-[#9090A8] mb-10">
          Completa tu perfil profesional para generar confianza.
        </p>

        <form
          className="grid gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/verificacion-trabajador");
          }}
        >
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21V19a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profesión
            </label>

            <input
              type="text"
              required
              placeholder="Ej: Técnico de laptops"
              className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38] outline-none transition-all duration-300 hover:border-[#A855F7] focus:border-[#A855F7]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Descripción profesional
            </label>

            <textarea
              rows={5}
              placeholder="Cuéntanos sobre tu experiencia..."
              className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38] outline-none resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
              Años de experiencia
            </label>

            <input
              type="number"
              required
              placeholder="3"
              className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38] outline-none transition-all duration-300 hover:border-[#A855F7] focus:border-[#A855F7]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Subir CV
            </label>

            <input
              type="file"
              required
              accept=".pdf,application/pdf"
              onChange={(e) => setCv(e.target.files[0])}
              className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38]
  file:mr-4
  file:px-4
  file:py-2
  file:rounded-lg
  file:border-0
  file:bg-[#A855F7]
  file:text-white
  file:cursor-pointer
  file:transition-all
  file:duration-300
  hover:file:scale-105
  hover:file:brightness-110
  file:content-['Seleccionar_archivo']"
            />

            <p className="text-sm text-[#9090A8] mt-2">Solo archivos PDF.</p>

            {cv && (
              <div className="mt-3 flex items-center justify-between bg-[#151520] border border-[#2A2A38] rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>

                  <span className="text-sm">{cv.name}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setCv(null)}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Quitar
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A855F7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Fotos de trabajos
            </label>

            <input
              type="file"
              required
              multiple
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => setImagenes(Array.from(e.target.files))}
              className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38]
  file:mr-4
  file:px-4
  file:py-2
  file:rounded-lg
  file:border-0
  file:bg-[#6366F1]
  file:text-white
  file:cursor-pointer
  file:transition-all
  file:duration-300
  hover:file:scale-105
  hover:file:brightness-110
  file:content-['Seleccionar_archivo']"
            />

            <p className="text-sm text-[#9090A8] mt-2">
              Solo imágenes JPG, PNG o WEBP.
            </p>

            {imagenes.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {imagenes.map((img, index) => (
                  <div
                    key={index}
                    className="relative border border-[#2A2A38] rounded-xl overflow-hidden bg-[#151520]"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-full h-32 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setImagenes(imagenes.filter((_, i) => i !== index))
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #A855F7, #6366F1)",
            }}
          >
            Enviar solicitud
          </button>
        </form>
      </div>
    </div>
  );
}
