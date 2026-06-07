"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { crearSolicitud } from "@/firebase/Solicitudes";
import { subirImagenesSolicitud } from "@/firebase/Storage";
import Link from "next/link";

const CATEGORIAS = [
  { id: "tecnologia", label: "Tecnología", icon: "💻", tag: "Tecnología" },
  { id: "hogar",      label: "Hogar",      icon: "🔧", tag: "Hogar"      },
  { id: "diseno",     label: "Diseño",     icon: "🎨", tag: "Diseño"     },
  { id: "educacion",  label: "Educación",  icon: "📚", tag: "Educación"  },
  { id: "legal",      label: "Legal",      icon: "⚖️",  tag: "Legal"     },
  { id: "transporte", label: "Transporte", icon: "🚗", tag: "Transporte" },
  { id: "salud",      label: "Salud",      icon: "🏥", tag: "Salud"      },
  { id: "otro",       label: "Otro",       icon: "✨", tag: "Otro"       },
];

const DISTRITOS = [
  "San Juan de Lurigancho", "Miraflores", "San Borja", "Surco",
  "La Molina", "San Miguel", "Barranco", "Jesús María", "Lince",
  "Pueblo Libre", "San Isidro", "Surquillo", "Otro",
];

const PASOS = ["Categoría", "Descripción", "Detalles", "Publicar"];
const MAX_IMAGENES = 4;

function obtenerIniciales(nombre) {
  const p = nombre.trim().split(" ");
  return (p[0][0] + (p[1]?.[0] ?? "")).toUpperCase();
}

export default function NuevaSolicitud() {
  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);
  const fileInputRef = useRef(null);
  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [publicado, setPublicado] = useState(false);
  const [errores, setErrores] = useState({});
  const [archivos, setArchivos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [subiendoPct, setSubiendoPct] = useState(null);

  const [form, setForm] = useState({
    categoria: null,
    titulo: "",
    descripcion: "",
    presupuesto: "",
    modalidad: "Presencial",
    distrito: "",
    fechaNecesidad: "",  
    urgente: false,
  });

  const setF = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const agregarArchivos = (nuevos) => {
    const validos = Array.from(nuevos)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_IMAGENES - archivos.length);
    if (validos.length === 0) return;
    validos.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((p) => [...p, e.target.result]);
      reader.readAsDataURL(file);
    });
    setArchivos((p) => [...p, ...validos]);
  };

  const quitarImagen = (idx) => {
    setArchivos((p) => p.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const validarPaso = () => {
    const e = {};
    if (paso === 1 && !form.categoria) e.categoria = "Selecciona una categoría";
    if (paso === 2) {
      if (!form.titulo.trim()) e.titulo = "El título es obligatorio";
      if (!form.descripcion.trim()) e.descripcion = "La descripción es obligatoria";
    }
    if (paso === 3 && !form.distrito) e.distrito = "Selecciona un distrito";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const avanzar = () => {
    if (validarPaso()) setPaso((p) => Math.min(p + 1, 4));
  };

  const publicar = async () => {
    if (!user) return;
    setEnviando(true);
    try {
      let imageUrls = [];
      if (archivos.length > 0) {
        setSubiendoPct(0);
        imageUrls = await subirImagenesSolicitud(archivos, user.uid, (pct) => setSubiendoPct(Math.round(pct)));
        setSubiendoPct(null);
      }
      const result = await crearSolicitud(
        {
          titulo: form.titulo.trim(),
          descripcion: form.descripcion.trim(),
          tags: [form.categoria.tag],
          precio: form.presupuesto ? `S/ ${form.presupuesto}` : "A coordinar",
          distrito: form.distrito,
          modalidad: form.modalidad,
          fechaNecesidad: form.fechaNecesidad ? new Date(form.fechaNecesidad) : null,
          urgente: form.urgente,
          nombre: user.displayName ?? user.email?.split("@")[0] ?? "Usuario",
          iniciales: obtenerIniciales(user.displayName ?? user.email ?? "U"),
          imageUrls,
        },
        user.uid
      );
      if (result.success) {
        setPublicado(true);
      } else {
        alert("Error al publicar. Intenta nuevamente.");
      }
    } catch (err) {
      console.error(err);
      alert("Error inesperado.");
    } finally {
      setEnviando(false);
    }
  };

  // Redirección si no está logueado
  if (!loadingAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-main)" }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
            Inicia sesión primero
          </h2>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Para publicar una solicitud necesitas una cuenta en Nexora.
          </p>
          <Link href="/login" className="btn-primary">Ingresar</Link>
        </div>
      </div>
    );
  }

  if (publicado) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-main)" }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
            ¡Solicitud publicada!
          </h2>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Los trabajadores de tu zona ya pueden postularse.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => router.push("/feedJobs")} className="btn-secondary">Ver el feed</button>
            <button
              onClick={() => {
                setPublicado(false);
                setPaso(1);
                setArchivos([]);
                setPreviews([]);
                setForm({
                  categoria: null,
                  titulo: "",
                  descripcion: "",
                  presupuesto: "",
                  modalidad: "Presencial",
                  distrito: "",
                  fechaNecesidad: "",
                  urgente: false,
                });
              }}
              className="btn-primary"
            >
              Publicar otra
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-main)" }}>
      <div className="max-w-3xl mx-auto px-4 py-8 pb-28">
        <h1 className="text-3xl font-extrabold text-center mb-8" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
          Nueva solicitud
        </h1>
        <div className="flex items-center justify-between mb-8">
          {PASOS.map((nombre, i) => {
            const n = i + 1;
            const active = paso === n;
            const done = paso > n;
            return (
              <div key={n} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      background: done || active ? "var(--accent)" : "var(--bg-card)",
                      color: done || active ? "white" : "var(--text-secondary)",
                      border: done || active ? "none" : `1px solid var(--border-color)`,
                    }}
                  >
                    {done ? "✓" : n}
                  </div>
                  <span className="text-sm whitespace-nowrap" style={{ color: done ? "var(--accent)" : active ? "var(--text-main)" : "var(--text-muted)" }}>
                    {nombre}
                  </span>
                </div>
                {i < PASOS.length - 1 && <div className="flex-1 h-px mx-4" style={{ background: done ? "var(--accent)" : "var(--border-color)" }} />}
              </div>
            );
          })}
        </div>

        {paso === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
              ¿Qué tipo de servicio necesitas?
            </h2>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>Elige la categoría que mejor describe tu solicitud</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setF("categoria", cat); setErrores({}); }}
                  className="p-5 rounded-xl border flex flex-col items-center gap-2 transition-all"
                  style={{
                    background: form.categoria?.id === cat.id ? "var(--accent-bg)" : "var(--bg-card)",
                    borderColor: form.categoria?.id === cat.id ? "var(--accent)" : "var(--border-color)",
                    color: form.categoria?.id === cat.id ? "var(--accent-text)" : "var(--text-secondary)",
                  }}
                >
                  <span className="text-2xl">{cat.icon || "📌"}</span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
            {errores.categoria && <p className="text-sm" style={{ color: "var(--error)" }}>{errores.categoria}</p>}
          </>
        )}

        {paso === 2 && (
          <div className="rounded-xl p-6 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
              Describe tu solicitud
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--text-muted)" }}>Título de la solicitud</label>
                <input
                  type="text"
                  placeholder="Ej. Necesito técnico para instalar cámaras de seguridad en casa"
                  value={form.titulo}
                  onChange={(e) => setF("titulo", e.target.value)}
                  className="w-full rounded-lg px-4 py-2 outline-none transition-all"
                  style={{ background: "var(--bg-input)", border: `1px solid ${errores.titulo ? "var(--error)" : "var(--border-color)"}`, color: "var(--text-main)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = errores.titulo ? "var(--error)" : "var(--border-color)")}
                />
                {errores.titulo && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errores.titulo}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--text-muted)" }}>Descripción detallada</label>
                <textarea
                  rows={4}
                  placeholder="Cuéntanos qué necesitas exactamente, cuándo, dónde y cualquier detalle relevante..."
                  value={form.descripcion}
                  onChange={(e) => setF("descripcion", e.target.value)}
                  className="w-full rounded-lg px-4 py-2 outline-none transition-all resize-vertical"
                  style={{ background: "var(--bg-input)", border: `1px solid ${errores.descripcion ? "var(--error)" : "var(--border-color)"}`, color: "var(--text-main)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = errores.descripcion ? "var(--error)" : "var(--border-color)")}
                />
                {errores.descripcion && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errores.descripcion}</p>}
              </div>

              {/* Subida de imágenes */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase mb-2" style={{ color: "var(--text-muted)" }}>Imágenes (opcional)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => agregarArchivos(e.target.files)}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl p-6 text-center cursor-pointer border border-dashed transition-all"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--border-color)"; }}
                  onDrop={(e) => { e.preventDefault(); agregarArchivos(e.dataTransfer.files); }}
                >
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Arrastra o haz clic para subir imágenes</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Máximo {MAX_IMAGENES} imágenes</p>
                </div>
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {previews.map((src, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border" style={{ borderColor: "var(--border-color)" }}>
                        <img src={src} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                        <button
                          onClick={() => quitarImagen(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="rounded-xl p-6 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
              Detalles del trabajo
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--text-muted)" }}>Presupuesto (S/)</label>
                  <input
                    type="text"
                    placeholder="Ej: 100-200"
                    value={form.presupuesto}
                    onChange={(e) => setF("presupuesto", e.target.value)}
                    className="w-full rounded-lg px-4 py-2 outline-none transition-all"
                    style={{ background: "var(--bg-input)", border: `1px solid var(--border-color)`, color: "var(--text-main)" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--text-muted)" }}>Modalidad</label>
                  <select
                    value={form.modalidad}
                    onChange={(e) => setF("modalidad", e.target.value)}
                    className="w-full rounded-lg px-4 py-2 outline-none transition-all appearance-none cursor-pointer"
                    style={{ background: "var(--bg-input)", border: `1px solid var(--border-color)`, color: "var(--text-main)" }}
                  >
                    <option>Presencial</option>
                    <option>Remoto</option>
                    <option>Híbrido</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--text-muted)" }}>Ubicación</label>
                <select
                  value={form.distrito}
                  onChange={(e) => { setF("distrito", e.target.value); setErrores({}); }}
                  className="w-full rounded-lg px-4 py-2 outline-none transition-all appearance-none cursor-pointer"
                  style={{ background: "var(--bg-input)", border: `1px solid ${errores.distrito ? "var(--error)" : "var(--border-color)"}`, color: "var(--text-main)" }}
                >
                  <option value="">Selecciona un distrito</option>
                  {DISTRITOS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errores.distrito && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errores.distrito}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--text-muted)" }}>Fecha en que necesitas el servicio</label>
                <input
                  type="date"
                  value={form.fechaNecesidad}
                  onChange={(e) => setF("fechaNecesidad", e.target.value)}
                  className="w-full rounded-lg px-4 py-2 outline-none transition-all"
                  style={{ background: "var(--bg-input)", border: `1px solid var(--border-color)`, color: "var(--text-main)" }}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)" }}>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Marcar como urgente</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.urgente}
                  aria-label="Marcar solicitud como urgente"
                  onClick={() => setF("urgente", !form.urgente)}
                  className="relative w-10 h-5 rounded-full transition-all"
                  style={{ background: form.urgente ? "var(--accent)" : "var(--border-color)" }}
                >
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: form.urgente ? "22px" : "2px" }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {paso === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
              Revisa tu solicitud
            </h2>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>Confirma que todo esté correcto antes de publicar</p>
            {subiendoPct !== null && (
              <div className="flex items-center gap-3 p-3 rounded-lg mb-4" style={{ background: "var(--bg-card)", border: `1px solid var(--border-color)` }}>
                <span className="text-sm" style={{ color: "var(--accent)" }}>Subiendo imágenes... {subiendoPct}%</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
                  <div className="h-full transition-all" style={{ width: `${subiendoPct}%`, background: "var(--accent)" }} />
                </div>
              </div>
            )}
            <div className="rounded-xl p-6 border mb-6" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
              {[
                { k: "Categoría", v: form.categoria?.label },
                { k: "Título", v: form.titulo },
                { k: "Descripción", v: form.descripcion },
                { k: "Presupuesto", v: form.presupuesto ? `S/ ${form.presupuesto}` : "A coordinar" },
                { k: "Modalidad", v: form.modalidad },
                { k: "Distrito", v: form.distrito },
                { k: "Fecha necesaria", v: form.fechaNecesidad ? new Date(form.fechaNecesidad).toLocaleDateString() : "No especificada" },
                { k: "Estado", v: form.urgente ? "⚠️ Urgente" : "Normal" },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--border-color)" }}>
                  <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{k}</span>
                  <span className="text-sm text-right" style={{ color: "var(--text-main)" }}>{v || "—"}</span>
                </div>
              ))}
              {previews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>Imágenes ({previews.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {previews.map((src, i) => (
                      <img key={i} src={src} alt="" className="w-16 h-16 object-cover rounded-md border" style={{ borderColor: "var(--border-color)" }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Botones fijos abajo */}
        <div className="sticky bottom-0 left-0 right-0 p-4 flex justify-center gap-4 backdrop-blur-md mt-8" style={{ background: "var(--bg-main)", borderTop: `1px solid var(--border-color)`, zIndex: 40 }}>
          <button onClick={() => router.push("/feedJobs")} className="btn-secondary">Cancelar</button>
          {paso > 1 && <button onClick={() => setPaso(p => p - 1)} className="btn-secondary">Atrás</button>}
          {paso < 4 ? (
            <button onClick={avanzar} className="btn-primary">Continuar</button>
          ) : (
            <button onClick={publicar} disabled={enviando} className="btn-primary">
              {enviando ? (subiendoPct !== null ? `Subiendo imágenes ${subiendoPct}%...` : "Publicando...") : "Publicar solicitud"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}