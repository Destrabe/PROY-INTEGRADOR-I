"use client";

export default function TrabajadorPage() {
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

        <div className="grid gap-6">

          <div>
            <label className="block mb-2 font-semibold">
              Profesión
            </label>

            <input
              type="text"
              placeholder="Ej: Técnico de laptops"
              className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38] outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Descripción profesional
            </label>

            <textarea
              rows={5}
              placeholder="Cuéntanos sobre tu experiencia..."
              className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Años de experiencia
            </label>

            <input
              type="number"
              placeholder="3"
              className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38] outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Subir CV
            </label>

            <input
              type="file"
              className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38]"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Fotos de trabajos
            </label>

            <input
              type="file"
              multiple
              className="w-full px-4 py-3 rounded-xl bg-[#111118] border border-[#2A2A38]"
            />
          </div>

          <button
            className="mt-4 py-3 rounded-xl font-bold"
            style={{
              background:
                "linear-gradient(135deg, #A855F7, #6366F1)",
            }}
          >
            Enviar solicitud
          </button>
        </div>
      </div>
    </div>
  );
}