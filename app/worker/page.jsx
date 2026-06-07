"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/db";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CATEGORIAS = [
  { id: "tecnologia", label: "Tecnología", tag: "Tecnología" },
  { id: "hogar", label: "Hogar", tag: "Hogar" },
  { id: "diseno", label: "Diseño", tag: "Diseño" },
  { id: "educacion", label: "Educación", tag: "Educación" },
  { id: "legal", label: "Legal", tag: "Legal" },
  { id: "transporte", label: "Transporte", tag: "Transporte" },
  { id: "salud", label: "Salud", tag: "Salud" },
  { id: "otro", label: "Otro", tag: "Otro" },
];

export default function WorkerPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profesion, setProfesion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [ambitos, setAmbitos] = useState([]);
  const [cvFile, setCvFile] = useState(null);
  const [fotosTrabajos, setFotosTrabajos] = useState([]);

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/login");
    }
  }, [user, loadingAuth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profesion.trim() || !descripcion.trim()) {
      setError("Completa los campos obligatorios.");
      return;
    }
    if (ambitos.length === 0) {
      setError("Selecciona al menos un ámbito de especialización.");
      return;
    }
    if (!cvFile) {
      setError("El CV en formato PDF es obligatorio.");
      return;
    }
    if (cvFile.type !== "application/pdf") {
      setError("El CV debe ser un archivo PDF válido.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const storage = getStorage();
      let cvUrl = null;
      if (cvFile) {
        const cvRef = ref(storage, `worker_applications/${user.uid}/cv_${Date.now()}.pdf`);
        await uploadBytes(cvRef, cvFile);
        cvUrl = await getDownloadURL(cvRef);
      }

      const fotosUrls = [];
      if (fotosTrabajos.length > 0) {
        for (const foto of fotosTrabajos) {
          const fotoRef = ref(storage, `worker_applications/${user.uid}/portfolio_${Date.now()}_${foto.name}`);
          await uploadBytes(fotoRef, foto);
          const url = await getDownloadURL(fotoRef);
          fotosUrls.push(url);
        }
      }

      await setDoc(doc(db, "worker_applications", user.uid), {
        userId: user.uid,
        profesion,
        descripcion,
        experiencia: experiencia ? parseInt(experiencia) : null,
        ambitos,
        cvUrl,
        fotosTrabajos: fotosUrls,
        estado: "pending",
        createdAt: serverTimestamp(),
      });

      router.push("/worker-pending");
    } catch (err) {
      console.error(err);
      setError("Error al enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="text-[var(--text-main)]">Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "var(--bg-main)", color: "var(--text-main)" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
          Únete como Trabajador
        </h1>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          Completa tu perfil profesional para empezar a recibir solicitudes. Tu solicitud será revisada por nuestro equipo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-2xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Profesión / Oficio *
            </label>
            <input
              type="text"
              required
              value={profesion}
              onChange={(e) => setProfesion(e.target.value)}
              placeholder="Ej: Técnico de laptops, Electricista, Pintor"
              className="w-full rounded-lg px-4 py-2 border outline-none"
              style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Descripción profesional *
            </label>
            <textarea
              rows={4}
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Cuéntanos sobre tu experiencia, especialidades y disponibilidad..."
              className="w-full rounded-lg px-4 py-2 border outline-none resize-vertical"
              style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Años de experiencia (opcional)
            </label>
            <input
              type="number"
              value={experiencia}
              onChange={(e) => setExperiencia(e.target.value)}
              placeholder="Ej: 3"
              className="w-full rounded-lg px-4 py-2 border outline-none"
              style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Ámbitos de especialización *
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (ambitos.includes(cat.tag)) {
                      setAmbitos(ambitos.filter((a) => a !== cat.tag));
                    } else {
                      setAmbitos([...ambitos, cat.tag]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    ambitos.includes(cat.tag) ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Selecciona los ámbitos en los que ofreces servicios. Recibirás solicitudes de esas categorías.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Subir CV (PDF) *
            </label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              required
              onChange={(e) => setCvFile(e.target.files[0] ?? null)}
              className="w-full text-sm"
            />
            {cvFile && (
              <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--success)" }}>
                ✓ {cvFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Fotos de trabajos (opcional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFotosTrabajos(Array.from(e.target.files))}
              className="w-full text-sm"
            />
            {fotosTrabajos.length > 0 && (
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {fotosTrabajos.length} archivos seleccionados
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "Enviando solicitud..." : "Enviar solicitud"}
          </button>
        </form>
      </div>
    </div>
  );
}