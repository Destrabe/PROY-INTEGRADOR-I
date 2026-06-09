"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { crearSolicitud } from "@/firebase/Solicitudes";
import { subirImagenesSolicitud } from "@/firebase/Storage";
import Link from "next/link";
import Image from "next/image";

const CATEGORIAS = [
  {
    id: "tecnologia",
    label: "Tecnología",
    icon: (
      <Image
        src="/svg/screenIcon.svg"
        alt="Tecnología"
        width={35}
        height={35}
      />
    ),
    tag: "Tecnología",
    soloPresencial: false,
  },
  {
    id: "hogar",
    label: "Hogar",
    icon: <Image src="/svg/toolIcon.svg" alt="Hogar" width={35} height={35} />,
    tag: "Hogar",
    soloPresencial: true,
  },
  {
    id: "diseno",
    label: "Diseño",
    icon: (
      <Image src="/svg/paletteIcon.svg" alt="Diseño" width={35} height={35} />
    ),
    tag: "Diseño",
    soloPresencial: false,
  },
  {
    id: "educacion",
    label: "Educación",
    icon: (
      <Image src="/svg/bookIcon.svg" alt="Educación" width={35} height={35} />
    ),
    tag: "Educación",
    soloPresencial: false,
  },
  {
    id: "legal",
    label: "Legal",
    icon: (
      <Image src="/svg/balanceIcon.svg" alt="Legal" width={35} height={35} />
    ),
    tag: "Legal",
    soloPresencial: false,
  },
  {
    id: "transporte",
    label: "Transporte",
    icon: (
      <Image src="/svg/carIcon.svg" alt="Transporte" width={35} height={35} />
    ),
    tag: "Transporte",
    soloPresencial: true,
  },
  {
    id: "salud",
    label: "Salud",
    icon: (
      <Image src="/svg/hospitalIcon.svg" alt="Salud" width={35} height={35} />
    ),
    tag: "Salud",
    soloPresencial: true,
  },
  {
    id: "otro",
    label: "Otro",
    icon: <Image src="/svg/otherIcon.svg" alt="Otro" width={35} height={35} />,
    tag: "Otro",
    soloPresencial: false,
  },
];

const DISTRITOS = ["San Juan de Lurigancho"];

const URGENCIA = [
  { value: "hoy", label: "Hoy mismo (urgente)" },
  { value: "mes", label: "Este mes" },
  { value: "acordar", label: "A coordinar" },
];

const PASOS = ["Categoría", "Descripción", "Detalles", "Publicar"];
const MAX_IMAGENES = 4;

export default function NewRequestPage() {
  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);
  const fileInputRef = useRef(null);

  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [publicado, setPublicado] = useState(false);
  const [errores, setErrores] = useState({});
  const [dragging, setDragging] = useState(false);

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
    urgencia: "acordar",
    urgente: false,
  });

  const setF = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  // Cambiar categoría y validar si reseteamos la modalidad a Presencial
  const cambiarCategoria = (cat) => {
    setForm((p) => ({
      ...p,
      categoria: cat,
      modalidad: cat.soloPresencial ? "Presencial" : p.modalidad,
    }));
    setErrores({});
  };

  const agregarArchivos = (nuevos) => {
    const validos = Array.from(nuevos)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_IMAGENES - archivos.length);

    if (validos.length === 0) return;

    validos.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((p) => [...p, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setArchivos((p) => [...p, ...validos]);
  };

  const quitarImagen = (idx) => {
    setArchivos((p) => p.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    agregarArchivos(e.dataTransfer.files);
  };

  const validarPaso = () => {
    const e = {};
    if (paso === 1 && !form.categoria) e.categoria = "Selecciona una categoría";
    if (paso === 2) {
      if (!form.titulo.trim()) e.titulo = "El título es obligatorio";
      if (!form.descripcion.trim())
        e.descripcion = "La descripción es obligatoria";
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
        imageUrls = await subirImagenesSolicitud(archivos, user.uid, (pct) =>
          setSubiendoPct(Math.round(pct)),
        );
        setSubiendoPct(null);
      }

      const urgente = form.urgencia === "hoy" || form.urgente;
      const result = await crearSolicitud(
        {
          titulo: form.titulo.trim(),
          descripcion: form.descripcion.trim(),
          tags: [form.categoria.tag],
          precio: form.presupuesto ? `s/ ${form.presupuesto}` : "A coordinar",
          distrito: form.distrito,
          urgente,
          modalidad: form.modalidad,
          urgencia: form.urgencia,
          nombre: user.displayName ?? user.email?.split("@")[0] ?? "Usuario",
          iniciales: obtenerIniciales(user.displayName ?? user.email ?? "U"),
          imageUrls,
        },
        user.uid,
      );

      if (result.success) {
        setPublicado(true);
      } else {
        alert("Error al publicar. Intenta nuevamente.");
      }
    } catch (err) {
      console.error(err);
      alert("Error inesperado. Revisa la consola.");
    } finally {
      setEnviando(false);
    }
  };

  function obtenerIniciales(nombre) {
    const p = nombre.trim().split(" ");
    return (p[0][0] + (p[1]?.[0] ?? "")).toUpperCase();
  }

  function formatUrgencia(u) {
    return URGENCIA.find((x) => x.value === u)?.label ?? u;
  }

  if (!loadingAuth && !user) {
    return (
      <div className="min-h-[calc(100vh-90px)] bg-[#0a0a0f] font-dm-sans flex flex-col">
        <div className="max-w-[760px] mx-auto px-6 py-10 pb-32 w-full">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-5">
              <Image
                src="/svg/lockIcon.svg"
                alt="Iniciar sesión"
                width={100}
                height={100}
              />
            </div>
            <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-2">
              Inicia sesión primero
            </h2>
            <p className="text-[#666] text-sm md:text-base mb-8">
              Para publicar una solicitud necesitas una cuenta en Nexora.
            </p>
            <Link
              href="/login"
              className="bg-[#500fe9] text-white border-none rounded-xl px-8 py-3.5 text-base font-bold cursor-pointer hover:bg-[#400bc4] transition-colors decoration-none"
            >
              Ingresar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (publicado) {
    return (
      <div className="min-h-[calc(100vh-90px)] bg-[#0a0a0f] font-dm-sans flex flex-col">
        <div className="max-w-[760px] mx-auto px-6 py-10 pb-32 w-full">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-5">🎉</div>
            <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-2">
              ¡Solicitud publicada!
            </h2>
            <p className="text-[#666] text-sm md:text-base mb-8">
              Los trabajadores de tu zona ya pueden postularse.
            </p>
            <div className="flex gap-3">
              <button
                className="bg-transparent border border-[#2a2a3e] text-[#888] rounded-xl px-7 py-3 text-sm font-medium cursor-pointer hover:text-white hover:border-[#4a3aaa] transition-colors"
                onClick={() => router.push("/FeedTrabajos")}
              >
                Ver el feed
              </button>
              <button
                className="bg-[#500fe9] text-white border-none rounded-xl px-8 py-3 text-sm font-bold cursor-pointer hover:bg-[#400bc4] transition-colors"
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
                    urgencia: "acordar",
                    urgente: false,
                  });
                }}
              >
                Publicar otra
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-90px)] bg-[#0a0a0f] font-dm-sans flex flex-col text-slate-200">
      <div className="max-w-[760px] mx-auto px-6 py-10 pb-32 w-full">
        <div className="text-center w-full mb-8">
          <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-white m-0">
            Nueva solicitud
          </h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-10 w-full overflow-x-auto py-2">
          {PASOS.map((nombre, i) => {
            const n = i + 1;
            const active = paso === n;
            const done = paso > n;
            return (
              <div
                key={n}
                className={`flex items-center ${i < 3 ? "flex-1" : "flex-initial"}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border transition-all duration-300 ${
                      done || active
                        ? "bg-[#500fe9] text-white border-transparent"
                        : "bg-[#1a1a2e] text-[#555] border-[#2a2a3e]"
                    }`}
                  >
                    {done ? "✓" : n}
                  </div>
                  <span
                    className={`text-xs md:text-sm whitespace-nowrap transition-colors duration-300 ${
                      done
                        ? "text-[#a78bfa]"
                        : active
                          ? "text-white font-semibold"
                          : "text-[#555]"
                    }`}
                  >
                    {nombre}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className={`flex-1 h-[1px] mx-3 min-w-[30px] transition-colors duration-300 ${
                      done ? "bg-[#500fe9]" : "bg-[#1a1a2e]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Paso 1: Categorías */}
        {paso === 1 && (
          <>
            <h2 className="font-syne font-extrabold text-xl md:text-2xl text-[#f0f0ff] mb-2">
              ¿Qué tipo de servicio necesitas?
            </h2>
            <p className="text-[#555] text-sm mb-6">
              Elige la categoría que mejor describe tu solicitud
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {CATEGORIAS.map((cat) => {
                const sel = form.categoria?.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    className={`rounded-xl p-5 text-sm flex flex-col items-center gap-2 transition-all font-dm-sans cursor-pointer ${
                      sel
                        ? "bg-[#1e1a3a] border border-[#4a3aaa] text-[#a78bfa] font-semibold shadow-[0_0_0_1px_rgba(80,15,233,0.25)]"
                        : "bg-[#13131f] border border-[#1e1e30] text-[#fff] hover:border-[#2a2a3e]"
                    }`}
                    onClick={() => cambiarCategoria(cat)}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    {cat.label}
                  </button>
                );
              })}
            </div>
            {errores.categoria && (
              <p className="text-[#f87171] text-xs mt-1">{errores.categoria}</p>
            )}
          </>
        )}

        {/* Paso 2: Descripción */}
        {paso === 2 && (
          <div className="bg-[#13131f] border border-[#1e1e30] rounded-2xl p-7 pb-6 mb-4">
            <div className="font-syne font-bold text-lg text-[#f0f0ff] mb-5">
              Describe tu solicitud
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[11px] font-bold tracking-wider text-[#555] uppercase">
                  Título de la solicitud
                </label>
                <input
                  className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full box-border outline-none transition-all focus:border-[#500fe9] focus:shadow-[0_0_0_3px_rgba(80,15,233,0.15)]"
                  placeholder="Ej. Necesito técnico para instalar cámaras de seguridad en casa"
                  value={form.titulo}
                  onChange={(e) => setF("titulo", e.target.value)}
                />
                {errores.titulo && (
                  <p className="text-[#f87171] text-xs mt-1">
                    {errores.titulo}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[11px] font-bold tracking-wider text-[#555] uppercase">
                  Descripción detallada
                </label>
                <textarea
                  className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full box-border outline-none transition-all focus:border-[#500fe9] resize-vertical min-h-[120px]"
                  placeholder="Cuéntanos qué necesitas exactamente, cuándo, dónde y cualquier detalle relevante..."
                  value={form.descripcion}
                  onChange={(e) => setF("descripcion", e.target.value)}
                />
                {errores.descripcion && (
                  <p className="text-[#f87171] text-xs mt-1">
                    {errores.descripcion}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Detalles */}
        {paso === 3 && (
          <>
            <div className="bg-[#13131f] border border-[#1e1e30] rounded-2xl p-7 pb-6 mb-4">
              <div className="font-syne font-bold text-lg text-[#f0f0ff] mb-5">
                Detalles del trabajo
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[11px] font-bold tracking-wider text-[#555] uppercase">
                      Presupuesto (S/)
                    </label>
                    <input
                      className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full box-border outline-none transition-all focus:border-[#500fe9] focus:shadow-[0_0_0_3px_rgba(80,15,233,0.15)]"
                      placeholder="Ej: 100-200"
                      value={form.presupuesto}
                      onChange={(e) => setF("presupuesto", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[11px] font-bold tracking-wider text-[#555] uppercase">
                      Modalidad
                    </label>
                    <select
                      className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full outline-none cursor-pointer appearance-none bg-no-repeat pr-9 box-border disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 12px center",
                      }}
                      value={form.modalidad}
                      onChange={(e) => setF("modalidad", e.target.value)}
                      disabled={form.categoria?.soloPresencial}
                    >
                      <option value="Presencial">Presencial</option>
                      {!form.categoria?.soloPresencial && (
                        <>
                          <option value="Remoto">Remoto</option>
                          <option value="Híbrido">Híbrido</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[11px] font-bold tracking-wider text-[#555] uppercase">
                      Ubicación
                    </label>
                    <select
                      className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full outline-none cursor-pointer appearance-none bg-no-repeat pr-9 box-border"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 12px center",
                      }}
                      value={form.distrito}
                      onChange={(e) => {
                        setF("distrito", e.target.value);
                        setErrores({});
                      }}
                    >
                      <option value="">Selecciona un distrito</option>
                      {DISTRITOS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {errores.distrito && (
                      <p className="text-[#f87171] text-xs mt-1">
                        {errores.distrito}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[11px] font-bold tracking-wider text-[#555] uppercase">
                      ¿Cuándo lo necesitas?
                    </label>
                    <select
                      className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full outline-none cursor-pointer appearance-none bg-no-repeat pr-9 box-border"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 12px center",
                      }}
                      value={form.urgencia}
                      onChange={(e) => setF("urgencia", e.target.value)}
                    >
                      {URGENCIA.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#0d0d18] border border-[#2a2a3e] rounded-xl">
                  <span className="text-[#ccc] text-sm">
                    Marcar como urgente
                  </span>
                  <div
                    className={`w-10 h-[22px] rounded-[11px] cursor-pointer relative transition-colors ${form.urgente ? "bg-[#500fe9]" : "bg-[#2a2a3e]"}`}
                    onClick={() => setF("urgente", !form.urgente)}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-[3px] transition-all ${form.urgente ? "left-[21px]" : "left-[3px]"}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => agregarArchivos(e.target.files)}
            />

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2.5 mb-4">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden border border-[#2a2a3e] aspect-square"
                  >
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-full h-full object-cover block"
                    />
                    <button
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white border-none cursor-pointer text-xs flex items-center justify-center hover:bg-black"
                      onClick={() => quitarImagen(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone */}
            {archivos.length < MAX_IMAGENES && (
              <div
                className={`border-[1.5px] border-dashed rounded-2xl p-9 text-center cursor-pointer transition-all mb-4 ${
                  dragging
                    ? "bg-[#1a1a2e] border-[#500fe9]"
                    : "bg-[#13131f] border-[#2a2a3e] hover:border-[#3a3a54]"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <p className="text-[#666] text-sm mb-1">
                  {previews.length === 0
                    ? "Arrastra fotos del trabajo aquí"
                    : `${previews.length} imagen${previews.length > 1 ? "es" : ""} seleccionada${previews.length > 1 ? "s" : ""}`}
                </p>
                <p className="text-[#666] text-sm m-0">
                  o{" "}
                  <span className="text-[#500fe9] font-semibold">
                    selecciona archivos
                  </span>
                </p>
                <p className="text-[#444] text-xs mt-1.5 m-0">
                  Máximo {MAX_IMAGENES} imágenes · JPG, PNG, WEBP
                </p>
              </div>
            )}
          </>
        )}

        {/* Paso 4: Publicar */}
        {paso === 4 && (
          <>
            <h2 className="font-syne font-extrabold text-xl md:text-2xl text-[#f0f0ff] mb-2">
              Revisa tu solicitud
            </h2>
            <p className="text-[#555] text-sm mb-6">
              Confirma que todo esté correcto antes de publicar
            </p>

            {subiendoPct !== null && (
              <div className="flex items-center gap-2.5 p-3 bg-[#0d0d18] rounded-xl border border-[#2a2a3e] text-[#a78bfa] text-xs mb-2">
                <span>Subiendo imágenes... {subiendoPct}%</span>
                <div className="flex-1 h-1 bg-[#1a1a2e] rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-[#500fe9] rounded-sm transition-all duration-300"
                    style={{ width: `${subiendoPct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="bg-[#13131f] border border-[#1e1e30] rounded-2xl p-7 mb-4">
              {[
                {
                  k: "Categoría",
                  v: (
                    <>
                      {form.categoria?.icon} {form.categoria?.label}
                    </>
                  ),
                },
                { k: "Título", v: form.titulo },
                { k: "Descripción", v: form.descripcion },
                {
                  k: "Presupuesto",
                  v: form.presupuesto
                    ? `s/ ${form.presupuesto}`
                    : "A coordinar",
                },
                { k: "Modalidad", v: form.modalidad },
                { k: "Distrito", v: form.distrito },
                { k: "Cuándo", v: formatUrgencia(form.urgencia) },
                {
                  k: "Estado",
                  v:
                    form.urgente || form.urgencia === "hoy" ? (
                      <span className="inline-block bg-[#2d0a0a] text-[#f87171] border border-[#5a1a1a] rounded-[20px] text-[11px] px-2.5 py-0.5">
                        Urgente
                      </span>
                    ) : (
                      <span className="text-[#555]">Normal</span>
                    ),
                },
              ].map(({ k, v }, i) => (
                <div
                  key={k}
                  className={`flex justify-between py-2.5 text-sm ${i === 7 ? "border-none" : "border-b border-[#1a1a2e]"}`}
                >
                  <span className="text-[#555] font-medium shrink-0">{k}</span>
                  <span className="text-[#e0e0f0] text-right max-w-[60%] break-words">
                    {v}
                  </span>
                </div>
              ))}

              {previews.length > 0 && (
                <div className="flex flex-col gap-2 py-2.5 text-sm border-none">
                  <span className="text-[#555] font-medium">
                    Imágenes ({previews.length})
                  </span>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {previews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-[60px] h-[60px] object-cover rounded-md border border-[#2a2a3e]"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-[#555] text-xs text-center">
              Al publicar, tu solicitud estará visible para los trabajadores de
              tu zona inmediatamente.
            </p>
          </>
        )}
      </div>

      {/* Navegación Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/95 border-t border-[#1a1a2e] backdrop-blur-md px-6 py-4 flex justify-center gap-3 z-40">
        <button
          className="bg-transparent border border-[#2a2a3e] text-[#888] rounded-xl px-7 py-3 text-sm font-medium cursor-pointer font-dm-sans hover:text-white hover:border-[#3a3a54] transition-colors"
          onClick={() => router.push("/FeedTrabajos")}
        >
          Cancelar
        </button>
        {paso > 1 && (
          <button
            className="bg-transparent border border-[#2a2a3e] text-[#ccc] rounded-xl px-7 py-3 text-sm font-medium cursor-pointer font-dm-sans hover:border-[#3a3a54] transition-colors"
            onClick={() => setPaso((p) => p - 1)}
          >
            Atrás
          </button>
        )}
        {paso < 4 ? (
          <button
            className="bg-[#500fe9] border-none text-white rounded-xl px-8 py-3 text-sm font-bold cursor-pointer font-dm-sans hover:bg-[#400bc4] transition-colors"
            onClick={avanzar}
          >
            Continuar
          </button>
        ) : (
          <button
            className={`border-none text-white rounded-xl px-8 py-3 text-sm font-bold font-dm-sans transition-colors ${
              enviando
                ? "bg-[#2a2a3e] text-[#555] cursor-not-allowed"
                : "bg-[#500fe9] cursor-pointer hover:bg-[#400bc4]"
            }`}
            onClick={publicar}
            disabled={enviando}
          >
            {enviando
              ? subiendoPct !== null
                ? `Subiendo imágenes ${subiendoPct}%...`
                : "Publicando..."
              : "Publicar solicitud"}
          </button>
        )}
      </div>
    </div>
  );
}
