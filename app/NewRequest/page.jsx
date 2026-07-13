"use client";
import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { crearSolicitud } from "@/firebase/Solicitudes";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import Link from "next/link";
import Image from "next/image";
import { useThemeStore } from "@/store/themeStore";

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
const PALABRAS_PROHIBIDAS = [
  "mierda", "cabron", "cabrona", "pendejo", "pendeja", "idiota", "imbecil",
  "estupido", "estupida", "carajo", "coño", "joder", "gilipollas",
  "huevon", "webon", "conchesumadre", "ctm", "hijo de puta", "hdp",
  "malparido", "malparida", "puta", "puto",
  "porno", "pornografia", "follar", "verga", "polla", "pito",
  "zorra", "ramera", "prostituta", "orgasmo", "semen", "masturbar",
  "masturbacion",
  "maricon", "marica", "tortillera", "bollera", "feminazi", "sudaca",
  "panchito", "retrasado", "retrasada", "mongolico", "mongolo", "sidoso",
  "onlyfans", "gana dinero facil", "seguidores gratis",
];

const normalizarTexto = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const encontrarPalabraProhibida = (texto) => {
  const textoNormalizado = normalizarTexto(texto);
  for (const palabra of PALABRAS_PROHIBIDAS) {
    const palabraNormalizada = normalizarTexto(palabra);
    const regex = new RegExp(`\\b${palabraNormalizada}\\b`, "i");
    if (regex.test(textoNormalizado)) {
      return palabra;
    }
  }
  return null;
};

const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#13131f" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#13131f" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#888888" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a78bfa" }],
  },
  { featureType: "road", stylers: [{ color: "#1e1e30" }] },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#777777" }],
  },
  { featureType: "water", stylers: [{ color: "#0a0a0f" }] },
];

const MAP_STYLES_LIGHT = [
  { elementType: "geometry", stylers: [{ color: "#f4f4f7" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b6b7a" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#1a1a2e" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6d28d9" }],
  },
  { featureType: "road", stylers: [{ color: "#e4e4ea" }] },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a99" }],
  },
  { featureType: "water", stylers: [{ color: "#dbe6fa" }] },
];

const PASOS = ["Categoría", "Descripción", "Detalles", "Publicar"];
const MAX_IMAGENES = 4;
const MAX_IMAGE_MB = 3;
const MAX_TITULO = 70;
const MAX_DESCRIPCION = 500;
const MAX_PRESUPUESTO_DIGITS = 6;

const resizeImageToBase64 = (file, maxDim = 1600, quality = 0.85) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height >= width && height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function NewRequestPage() {
  const router = useRouter();
  const [user, loadingAuth] = useAuthState(auth);
  const fileInputRef = useRef(null);

  const theme = useThemeStore((state) => state.theme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);
  const isDark = theme === "dark";

  const T = {
    pageBg: background?.[theme] ?? (isDark ? "#0a0a0f" : "#ffffff"),
    pageText: textColor?.[theme] ?? (isDark ? "#e2e8f0" : "#1a1a2e"),
    heading: isDark ? "#ffffff" : "#111118",
    cardBg: isDark ? "#13131f" : "#f4f4f5",
    cardBorder: isDark ? "#1e1e30" : "#e4e4e7",
    inputBg: isDark ? "#0d0d18" : "#ffffff",
    inputBorder: isDark ? "#2a2a3e" : "#d4d4d8",
    inputText: isDark ? "#e0e0f0" : "#1a1a2e",
    muted: isDark ? "#555555" : "#6b7280",
    mutedLight: isDark ? "#666666" : "#71717a",
    faint: isDark ? "#444444" : "#a1a1aa",
    divider: isDark ? "#1a1a2e" : "#e5e5ea",
    stepInactiveBg: isDark ? "#1a1a2e" : "#e5e5ea",
    stepInactiveBorder: isDark ? "#2a2a3e" : "#d4d4d8",
    stepInactiveText: isDark ? "#555555" : "#8a8a99",
    stepLine: isDark ? "#1a1a2e" : "#e5e5ea",
    dropzoneBg: isDark ? "#13131f" : "#f4f4f5",
    dropzoneBorder: isDark ? "#2a2a3e" : "#c7c7cf",
    dropzoneDragBg: isDark ? "#1a1a2e" : "#ece9fe",
    bottomBarBg: isDark ? "rgba(10,10,15,0.95)" : "rgba(255,255,255,0.95)",
    selectedBg: isDark ? "#1e1a3a" : "#ede9fe",
    selectedBorder: isDark ? "#4a3aaa" : "#8b5cf6",
    selectedText: isDark ? "#a78bfa" : "#6d28d9",
    urgentBg: isDark ? "#2d0a0a" : "#fee2e2",
    urgentBorder: isDark ? "#5a1a1a" : "#fecaca",
    urgentText: isDark ? "#f87171" : "#b91c1c",
    disabledBg: isDark ? "#2a2a3e" : "#e4e4e7",
    disabledText: isDark ? "#555555" : "#9ca3af",
    mapStyles: isDark ? MAP_STYLES : MAP_STYLES_LIGHT,
  };

  const centroSJL = useMemo(() => ({ lat: -11.9902, lng: -77.0142 }), []);
  
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [publicado, setPublicado] = useState(false);
  const [errores, setErrores] = useState({});
  const [dragging, setDragging] = useState(false);

  const [archivos, setArchivos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [procesandoImagenes, setProcesandoImagenes] = useState(false);

  const [form, setForm] = useState({
    categoria: null,
    titulo: "",
    descripcion: "",
    presupuesto: "",
    modalidad: "Presencial",
    distrito: "",
    urgente: false,
    fechaRequerida: "",
    horaRequerida: "",
    lat: -11.9902,
    lng: -77.0142,
  });

  const setF = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const cambiarCategoria = (cat) => {
    setForm((p) => ({
      ...p,
      categoria: cat,
      modalidad: cat.soloPresencial ? "Presencial" : p.modalidad,
    }));
    setErrores({});
  };

  const handlePresupuestoChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, MAX_PRESUPUESTO_DIGITS);
    setF("presupuesto", value);
  };

  const agregarArchivos = async (nuevos) => {
    const disponibles = MAX_IMAGENES - archivos.length;
    if (disponibles <= 0) return;

    const candidatos = Array.from(nuevos)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, disponibles);
    if (candidatos.length === 0) return;

    const oversized = candidatos.filter((f) => f.size / (1024 * 1024) > MAX_IMAGE_MB);
    const validos = candidatos.filter((f) => f.size / (1024 * 1024) <= MAX_IMAGE_MB);
    if (oversized.length > 0) {
      alert(
        `${oversized.length} imagen${oversized.length > 1 ? "es" : ""} supera${oversized.length > 1 ? "n" : ""} el límite de ${MAX_IMAGE_MB}MB y no se agregó: ${oversized.map((f) => f.name).join(", ")}`,
      );
    }

    if (validos.length === 0) return;

    setProcesandoImagenes(true);
    try {
      const base64s = await Promise.all(validos.map((f) => resizeImageToBase64(f)));
      setArchivos((p) => [...p, ...validos]);
      setPreviews((p) => [...p, ...base64s]);
    } catch {
      alert("No se pudo procesar una o más imágenes. Intenta con otro archivo.");
    } finally {
      setProcesandoImagenes(false);
    }
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

  const calcularUrgenciaTexto = (fechaStr) => {
    if (!fechaStr) return "A coordinar";
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaElegida = new Date(fechaStr + "T00:00:00");
    fechaElegida.setHours(0, 0, 0, 0);
    const diferenciaDias = Math.floor(
      (fechaElegida - hoy) / (1000 * 60 * 60 * 24),
    );
    if (diferenciaDias === 0) return "Hoy mismo (Urgente)";
    if (diferenciaDias > 0 && diferenciaDias <= 7) return "Esta semana";
    return "Este mes / Programado";
  };

  const obtenerUbicacionActual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((p) => ({
            ...p,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
        },
        () =>
          alert(
            "No pudimos acceder a tu ubicación actual automáticamente. Por favor arrastra el marcador manualmente.",
          ),
      );
    }
  };

  const manejarFinArrastreMarcador = (e) => {
    setForm((p) => ({
      ...p,
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }));
  };

  const validarPaso = () => {
    const e = {};
    if (paso === 1 && !form.categoria) e.categoria = "Selecciona una categoría";
    if (paso === 2) {
      if (!form.titulo.trim()) {
        e.titulo = "El título es obligatorio";
      } else {
        const malaPalabra = encontrarPalabraProhibida(form.titulo);
        if (malaPalabra) e.titulo = "El título contiene lenguaje no permitido";
      }

      if (!form.descripcion.trim()) {
        e.descripcion = "La descripción es obligatoria";
      } else {
        const malaPalabra = encontrarPalabraProhibida(form.descripcion);
        if (malaPalabra)
          e.descripcion = "La descripción contiene lenguaje no permitido";
      }
    }
    if (paso === 3) {
      if (!form.distrito) e.distrito = "Selecciona un distrito";
      if (!form.fechaRequerida)
        e.fechaRequerida = "Por favor selecciona una fecha en el calendario";
    }
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
      const urgenciaTexto = calcularUrgenciaTexto(form.fechaRequerida);
      const esHoymismo = urgenciaTexto.includes("Hoy mismo");
      const result = await crearSolicitud(
        {
          titulo: form.titulo.trim(),
          descripcion: form.descripcion.trim(),
          tags: [form.categoria.tag],
          precio: form.presupuesto ? `s/ ${form.presupuesto}` : "A coordinar",
          distrito: form.distrito,
          urgente: esHoymismo || form.urgente,
          modalidad: form.modalidad,
          urgencia: urgenciaTexto,
          fechaRequerida: form.fechaRequerida,
          horaRequerida: form.horaRequerida || "No especificada",
          coordenadas: { lat: form.lat, lng: form.lng },
          nombre: user.displayName ?? user.email?.split("@")[0] ?? "Usuario",
          iniciales: obtenerIniciales(user.displayName ?? user.email ?? "U"),
          imageUrls: previews,
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

  const arrowStroke = isDark ? "%23555" : "%238a8a99";
  const selectArrowBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${arrowStroke}' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`;

  if (!loadingAuth && !user) {
    return (
      <div
        className="min-h-screen pt-22.5 font-dm-sans flex flex-col"
        style={{ background: T.pageBg }}
      >
        <div className="max-w-190 mx-auto px-6 py-10 pb-32 w-full">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-5">
              <Image
                src="/svg/lockIcon.svg"
                alt="Iniciar sesión"
                width={100}
                height={100}
              />
            </div>
            <h2
              className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-2"
              style={{ color: T.heading }}
            >
              Inicia sesión primero
            </h2>
            <p
              className="text-[#666] text-sm md:text-base mb-8"
              style={{ color: T.mutedLight }}
            >
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
      <div
        className="min-h-screen pt-22.5 font-dm-sans flex flex-col"
        style={{ background: T.pageBg }}
      >
        <div className="max-w-190 mx-auto px-6 py-10 pb-32 w-full">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-5">
              <Image
                src="/svg/checkIcon.svg"
                alt="Solicitud publicada"
                width={100}
                height={100}
              />
            </div>
            <h2
              className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-2"
              style={{ color: T.heading }}
            >
              ¡Solicitud publicada!
            </h2>
            <p
              className="text-[#666] text-sm md:text-base mb-8"
              style={{ color: T.mutedLight }}
            >
              Los trabajadores de tu zona ya pueden postularse.
            </p>
            <div className="flex gap-3">
              <button
                className="bg-transparent border border-[#2a2a3e] text-[#888] rounded-xl px-7 py-3 text-sm font-medium cursor-pointer hover:text-white hover:border-[#4a3aaa] transition-colors"
                style={{ borderColor: T.inputBorder, color: T.mutedLight }}
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
                    urgente: false,
                    fechaRequerida: "",
                    horaRequerida: "",
                    lat: -11.9902,
                    lng: -77.0142,
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
    <div
      className="min-h-screen pt-22.5 font-dm-sans flex flex-col text-slate-200"
      style={{ background: T.pageBg, color: T.pageText }}
    >
      <div className="max-w-190 mx-auto px-6 py-10 pb-32 w-full">
        <div className="text-center w-full mb-8">
          <h1
            className="font-syne font-extrabold text-3xl md:text-4xl text-white m-0"
            style={{ color: T.heading }}
          >
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
                        : ""
                    }`}
                    style={
                      !(done || active)
                        ? {
                            background: T.stepInactiveBg,
                            color: T.stepInactiveText,
                            borderColor: T.stepInactiveBorder,
                          }
                        : undefined
                    }
                  >
                    {done ? "✓" : n}
                  </div>
                  <span
                    className={`text-xs md:text-sm whitespace-nowrap transition-colors duration-300 ${
                      done ? "text-[#a78bfa]" : active ? "font-semibold" : ""
                    }`}
                    style={{
                      color: done ? undefined : active ? T.heading : T.stepInactiveText,
                    }}
                  >
                    {nombre}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className={`flex-1 h-px mx-3 min-w-7.5 transition-colors duration-300 ${done ? "bg-[#500fe9]" : ""}`}
                    style={!done ? { background: T.stepLine } : undefined}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Paso 1: Categorías */}
        {paso === 1 && (
          <>
            <h2
              className="font-syne font-extrabold text-xl md:text-2xl text-[#f0f0ff] mb-2"
              style={{ color: T.heading }}
            >
              ¿Qué tipo de servicio necesitas?
            </h2>
            <p className="text-[#555] text-sm mb-6" style={{ color: T.muted }}>
              Elige la categoría que mejor describe tu solicitud
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {CATEGORIAS.map((cat) => {
                const sel = form.categoria?.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    className={`rounded-xl p-5 text-sm flex flex-col items-center gap-2 transition-all font-dm-sans cursor-pointer border ${
                      sel ? "font-semibold shadow-[0_0_0_1px_rgba(80,15,233,0.25)]" : ""
                    }`}
                    style={{
                      background: sel ? T.selectedBg : T.cardBg,
                      borderColor: sel ? T.selectedBorder : T.cardBorder,
                      color: sel ? T.selectedText : T.heading,
                    }}
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
          <div
            className="bg-[#13131f] border border-[#1e1e30] rounded-2xl p-7 pb-6 mb-4"
            style={{ background: T.cardBg, borderColor: T.cardBorder }}
          >
            <div
              className="font-syne font-bold text-lg text-[#f0f0ff] mb-5"
              style={{ color: T.heading }}
            >
              Describe tu solicitud
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[11px] font-bold tracking-wider text-[#555] uppercase"
                    style={{ color: T.muted }}
                  >
                    Título de la solicitud
                  </label>
                  <span
                    className="text-[10px] font-semibold text-[#555]"
                    style={{ color: T.muted }}
                  >
                    {form.titulo.length}/{MAX_TITULO}
                  </span>
                </div>
                <input
                  className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full box-border outline-none transition-all focus:border-[#500fe9] focus:shadow-[0_0_0_3px_rgba(80,15,233,0.15)]"
                  style={{ background: T.inputBg, borderColor: T.inputBorder, color: T.inputText }}
                  placeholder="Ej. Necesito técnico para instalar cámaras de seguridad en casa"
                  maxLength={MAX_TITULO}
                  value={form.titulo}
                  onChange={(e) => setF("titulo", e.target.value.slice(0, MAX_TITULO))}
                />
                {errores.titulo && (
                  <p className="text-[#f87171] text-xs mt-1">
                    {errores.titulo}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[11px] font-bold tracking-wider text-[#555] uppercase"
                    style={{ color: T.muted }}
                  >
                    Descripción detallada
                  </label>
                  <span
                    className="text-[10px] font-semibold text-[#555]"
                    style={{ color: T.muted }}
                  >
                    {form.descripcion.length}/{MAX_DESCRIPCION}
                  </span>
                </div>
                <textarea
                  className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full box-border outline-none transition-all focus:border-[#500fe9] resize-vertical min-h-30"
                  style={{ background: T.inputBg, borderColor: T.inputBorder, color: T.inputText }}
                  placeholder="Cuéntanos qué necesitas exactamente, cuándo, dónde y cualquier detalle relevante..."
                  maxLength={MAX_DESCRIPCION}
                  value={form.descripcion}
                  onChange={(e) => setF("descripcion", e.target.value.slice(0, MAX_DESCRIPCION))}
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
            <div
              className="bg-[#13131f] border border-[#1e1e30] rounded-2xl p-7 pb-6 mb-4"
              style={{ background: T.cardBg, borderColor: T.cardBorder }}
            >
              <div
                className="font-syne font-bold text-lg text-[#f0f0ff] mb-5"
                style={{ color: T.heading }}
              >
                Detalles del trabajo
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label
                      className="text-[11px] font-bold tracking-wider text-[#555] uppercase"
                      style={{ color: T.muted }}
                    >
                      Presupuesto (S/)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full box-border outline-none transition-all focus:border-[#500fe9] focus:shadow-[0_0_0_3px_rgba(80,15,233,0.15)]"
                      style={{ background: T.inputBg, borderColor: T.inputBorder, color: T.inputText }}
                      placeholder="Ej: 200"
                      maxLength={MAX_PRESUPUESTO_DIGITS}
                      value={form.presupuesto}
                      onChange={handlePresupuestoChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label
                      className="text-[11px] font-bold tracking-wider text-[#555] uppercase"
                      style={{ color: T.muted }}
                    >
                      Modalidad
                    </label>
                    <select
                      className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full outline-none cursor-pointer appearance-none bg-no-repeat pr-9 box-border disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundImage: selectArrowBg,
                        backgroundPosition: "right 12px center",
                        background: T.inputBg,
                        borderColor: T.inputBorder,
                        color: T.inputText,
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
                    <label
                      className="text-[11px] font-bold tracking-wider text-[#555] uppercase"
                      style={{ color: T.muted }}
                    >
                      Ubicación (Distrito)
                    </label>
                    <select
                      className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] w-full outline-none cursor-pointer appearance-none bg-no-repeat pr-9 box-border"
                      style={{
                        backgroundImage: selectArrowBg,
                        backgroundPosition: "right 12px center",
                        background: T.inputBg,
                        borderColor: T.inputBorder,
                        color: T.inputText,
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
                    <label
                      className="text-[11px] font-bold tracking-wider text-[#555] uppercase"
                      style={{ color: T.muted }}
                    >
                      ¿Para cuándo lo necesitas?
                    </label>
                    <div className="flex gap-2 w-full box-border">
                      <input
                        type="date"
                        className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] flex-2 box-border outline-none focus:border-[#500fe9]"
                        style={{
                          colorScheme: isDark ? "dark" : "light",
                          background: T.inputBg,
                          borderColor: T.inputBorder,
                          color: T.inputText,
                        }}
                        value={form.fechaRequerida}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setF("fechaRequerida", e.target.value)}
                      />
                      <input
                        type="time"
                        className="bg-[#0d0d18] border border-[#2a2a3e] rounded-xl p-3 text-sm text-[#e0e0f0] flex-1 box-border outline-none focus:border-[#500fe9]"
                        style={{
                          colorScheme: isDark ? "dark" : "light",
                          background: T.inputBg,
                          borderColor: T.inputBorder,
                          color: T.inputText,
                        }}
                        value={form.horaRequerida}
                        onChange={(e) => setF("horaRequerida", e.target.value)}
                      />
                    </div>
                    {form.fechaRequerida && (
                      <span className="text-[11px] text-[#a78bfa] font-semibold mt-1">
                        Prioridad detectada:{" "}
                        {calcularUrgenciaTexto ? calcularUrgenciaTexto(form.fechaRequerida) : calcularUrgenciaTexto(form.fechaRequerida)}
                      </span>
                    )}
                  </div>
                </div>

                {/* MÓDULO DE GOOGLE MAPS CON RESISTENCIA A ERRORES */}
                <div className="flex flex-col gap-2 mt-2 w-full">
                  <div className="flex items-center justify-between">
                    <label
                      className="text-[11px] font-bold tracking-wider text-[#555] uppercase"
                      style={{ color: T.muted }}
                    >
                      Fija tu ubicación exacta en el mapa
                    </label>
                    <button
                      type="button"
                      onClick={obtenerUbicacionActual}
                      className="text-xs font-semibold text-[#a78bfa] bg-[#1e1a3a] border border-[#4a3aaa] rounded-lg px-3 py-1.5 cursor-pointer hover:bg-[#252048] transition-colors"
                    >
                      <Image
                        src="/svg/locationIcon.svg"
                        width={14}
                        height={14}
                        alt="location"
                        className="inline-block"
                      />{" "}
                      Usar mi ubicación actual
                    </button>
                  </div>

                  <div
                    className="w-full h-65 rounded-xl overflow-hidden border border-[#2a2a3e] bg-[#13131f]"
                    style={{ background: T.cardBg, borderColor: T.cardBorder }}
                  >
                    {isLoaded && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={{ lat: form.lat, lng: form.lng }}
                        zoom={14}
                        options={{
                          styles: T.mapStyles,
                          disableDefaultUI: true,
                          zoomControl: true,
                        }}
                      >
                        <Marker
                          position={{ lat: form.lat, lng: form.lng }}
                          draggable={true}
                          onDragEnd={manejarFinArrastreMarcador}
                        />
                      </GoogleMap>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-sm text-slate-500 gap-1">
                        <span>📍 Visor de Google Maps no disponible</span>
                        {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                          <span className="text-xs text-amber-500/80">
                            (Falta configurar la API Key en el archivo .env.local)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-[#555]" style={{ color: T.muted }}>
                    Puedes arrastrar el marcador rojo directamente hacia tu calle o cuadra para guiar al trabajador.
                  </span>
                </div>

                <div
                  className="flex items-center justify-between p-3.5 bg-[#0d0d18] border border-[#2a2a3e] rounded-xl mt-2"
                  style={{ background: T.inputBg, borderColor: T.inputBorder }}
                >
                  <span className="text-[#ccc] text-sm" style={{ color: T.inputText }}>
                    Marcar como urgente
                  </span>
                  <div
                    className={`w-10 h-5.5 rounded-[11px] cursor-pointer relative transition-colors ${form.urgente || (form.fechaRequerida && calcularUrgenciaTexto(form.fechaRequerida).includes("Hoy mismo")) ? "bg-[#500fe9]" : ""}`}
                    style={
                      !(form.urgente || (form.fechaRequerida && calcularUrgenciaTexto(form.fechaRequerida).includes("Hoy mismo")))
                        ? { background: T.inputBorder }
                        : undefined
                    }
                    onClick={() => setF("urgente", !form.urgente)}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.75 transition-all ${form.urgente || (form.fechaRequerida && calcularUrgenciaTexto(form.fechaRequerida).includes("Hoy mismo")) ? "left-5.25" : "left-0.75"}`}
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
                    style={{ borderColor: T.cardBorder }}
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
                className={`border-[1.5px] border-dashed rounded-2xl p-9 text-center cursor-pointer transition-all mb-4 ${procesandoImagenes ? "opacity-60 pointer-events-none" : ""}`}
                style={{
                  background: dragging ? T.dropzoneDragBg : T.dropzoneBg,
                  borderColor: dragging ? "#500fe9" : T.dropzoneBorder,
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <p className="text-[#666] text-sm mb-1" style={{ color: T.mutedLight }}>
                  {procesandoImagenes
                    ? "Procesando imágenes..."
                    : previews.length === 0
                      ? "Arrastra fotos del trabajo aquí"
                      : `${previews.length} imagen${previews.length > 1 ? "es" : ""} seleccionada${previews.length > 1 ? "s" : ""}`}
                </p>
                {!procesandoImagenes && (
                  <p className="text-[#666] text-sm m-0" style={{ color: T.mutedLight }}>
                    o <span className="text-[#500fe9] font-semibold">selecciona archivos</span>
                  </p>
                )}
                <p className="text-[#444] text-xs mt-1.5 m-0" style={{ color: T.faint }}>
                  Máximo {MAX_IMAGENES} imágenes · JPG, PNG, WEBP · hasta {MAX_IMAGE_MB}MB c/u
                </p>
              </div>
            )}
          </>
        )}

        {/* Paso 4: Publicar */}
        {paso === 4 && (
          <>
            <h2
              className="font-syne font-extrabold text-xl md:text-2xl text-[#f0f0ff] mb-2"
              style={{ color: T.heading }}
            >
              Revisa tu solicitud
            </h2>
            <p className="text-[#555] text-sm mb-6" style={{ color: T.muted }}>
              Confirma que todo esté correcto antes de publicar
            </p>

            <div
              className="bg-[#13131f] border border-[#1e1e30] rounded-2xl p-7 mb-4"
              style={{ background: T.cardBg, borderColor: T.cardBorder }}
            >
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
                  v: form.presupuesto ? `s/ ${form.presupuesto}` : "A coordinar",
                },
                { k: "Modalidad", v: form.modalidad },
                { k: "Distrito", v: form.distrito },
                {
                  k: "Cuándo",
                  v: `${form.fechaRequerida} (${form.horaRequerida || "Todo el día"}) — [${calcularUrgenciaTexto(form.fechaRequerida)}]`,
                },
                {
                  k: "Geolocalización",
                  v: `Lat: ${form.lat.toFixed(4)}, Lng: ${form.lng.toFixed(4)}`,
                },
                {
                  k: "Estado",
                  v: form.urgente || calcularUrgenciaTexto(form.fechaRequerida).includes("Hoy mismo") ? (
                    <span
                      className="inline-block rounded-[20px] text-[11px] px-2.5 py-0.5 border"
                      style={{
                        background: T.urgentBg,
                        borderColor: T.urgentBorder,
                        color: T.urgentText,
                        }}
                    >
                      Urgente
                    </span>
                    ) : (
                      <span style={{ color: T.muted }}>Normal</span>
                    ),
                },
              ].map(({ k, v }, i) => (
                <div
                  key={k}
                  className={`flex justify-between py-2.5 text-sm ${i === 8 ? "border-none" : "border-b"}`}
                  style={{ borderColor: i === 8 ? undefined : T.divider }}
                >
                  <span className="text-[#555] font-medium shrink-0" style={{ color: T.muted }}>
                    {k}
                  </span>
                  <span
                    className="text-[#e0e0f0] text-right max-w-[60%] wrap-break-word"
                    style={{ color: T.inputText }}
                  >
                    {v}
                  </span>
                </div>
              ))}

              {previews.length > 0 && (
                <div className="flex flex-col gap-2 py-2.5 text-sm border-none">
                  <span className="text-[#555] font-medium" style={{ color: T.muted }}>
                    Imágenes ({previews.length})
                  </span>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {previews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-15 h-15 object-cover rounded-md border border-[#2a2a3e]"
                        style={{ borderColor: T.cardBorder }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-[#555] text-xs text-center" style={{ color: T.muted }}>
              Al publicar, tu solicitud estará visible para los trabajadores de tu zona inmediatamente.
            </p>
          </>
        )}
      </div>

      {/* Navegación Bottom Bar */}
      {!publicado && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/95 border-t border-[#1a1a2e] backdrop-blur-md px-6 py-4 flex justify-center gap-3 z-40"
          style={{ background: T.bottomBarBg, borderColor: T.cardBorder }}
        >
          <button
            className="bg-transparent border border-[#2a2a3e] text-[#888] rounded-xl px-7 py-3 text-sm font-medium cursor-pointer font-dm-sans hover:text-white hover:border-[#3a3a54] transition-colors"
            style={{ borderColor: T.inputBorder, color: T.mutedLight }}
            onClick={() => router.push("/FeedTrabajos")}
          >
            Cancelar
          </button>
          {paso > 1 && (
            <button
              className="bg-transparent border border-[#2a2a3e] text-[#ccc] rounded-xl px-7 py-3 text-sm font-medium cursor-pointer font-dm-sans hover:border-[#3a3a54] transition-colors"
              style={{ borderColor: T.inputBorder, color: T.inputText }}
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
              className={`border-none rounded-xl px-8 py-3 text-sm font-bold font-dm-sans transition-colors ${enviando ? "cursor-not-allowed" : "text-white cursor-pointer bg-[#500fe9] hover:bg-[#400bc4]"}`}
              style={enviando ? { background: T.disabledBg, color: T.disabledText } : undefined}
              onClick={publicar}
              disabled={enviando}
            >
              {enviando ? "Publicando..." : "Publicar solicitud"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}