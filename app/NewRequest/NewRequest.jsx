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

const URGENCIA = [
  { value: "hoy",     label: "Hoy mismo (urgente)" },
  { value: "semana",  label: "Esta semana"          },
  { value: "mes",     label: "Este mes"             },
  { value: "acordar", label: "A coordinar"          },
];

const PASOS = ["Categoría", "Descripción", "Detalles", "Publicar"];
const MAX_IMAGENES = 4;
const s = {
  root: {
    minHeight: "calc(100vh - 90px)",
    backgroundColor: "#0a0a0f",
    fontFamily: "var(--font-dm-sans), sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  inner: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "40px 24px 120px",
    width: "100%",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "1px solid #2a2a3e",
    color: "#888",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "border-color 0.2s",
  },
  pageTitle: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800,
    fontSize: "32px",
    color: "#fff",
    margin: 0,
  },
  stepper: { display: "flex", alignItems: "center", marginBottom: "40px" },
  stepCircle: (active, done) => ({
    width: "28px", height: "28px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: 700, flexShrink: 0,
    backgroundColor: done || active ? "#500fe9" : "#1a1a2e",
    color: done || active ? "#fff" : "#555",
    border: done || active ? "none" : "1px solid #2a2a3e",
    transition: "all 0.3s",
  }),
  stepLabel: (active, done) => ({
    fontSize: "13px", whiteSpace: "nowrap",
    color: done ? "#a78bfa" : active ? "#fff" : "#555",
    fontWeight: active || done ? 600 : 400,
  }),
  stepLine: (done) => ({
    flex: 1, height: "1px", margin: "0 12px", minWidth: "40px",
    backgroundColor: done ? "#500fe9" : "#1a1a2e",
    transition: "background-color 0.3s",
  }),
  sectionTitle: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800, fontSize: "22px", color: "#f0f0ff", marginBottom: "8px",
  },
  sectionSub: { color: "#555", fontSize: "14px", marginBottom: "24px" },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px", marginBottom: "32px",
  },
  catBtn: (sel) => ({
    backgroundColor: sel ? "#1e1a3a" : "#13131f",
    border: sel ? "1px solid #4a3aaa" : "1px solid #1e1e30",
    borderRadius: "12px", padding: "20px 12px",
    color: sel ? "#a78bfa" : "#888",
    fontSize: "14px", fontWeight: sel ? 600 : 400,
    cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
    transition: "all 0.2s",
    boxShadow: sel ? "0 0 0 1px #500fe940" : "none",
  }),
  formCard: {
    backgroundColor: "#13131f", border: "1px solid #1e1e30",
    borderRadius: "16px", padding: "28px 28px 24px", marginBottom: "16px",
  },
  formCardTitle: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 700, fontSize: "18px", color: "#f0f0ff", marginBottom: "20px",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldRow: { display: "flex", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px", flex: 1 },
  label: {
    fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
    color: "#555", textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#0d0d18", border: "1px solid #2a2a3e",
    borderRadius: "10px", padding: "12px 14px", color: "#e0e0f0",
    fontSize: "14px", fontFamily: "var(--font-dm-sans), sans-serif",
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
    width: "100%", boxSizing: "border-box",
  },
  textarea: {
    backgroundColor: "#0d0d18", border: "1px solid #2a2a3e",
    borderRadius: "10px", padding: "12px 14px", color: "#e0e0f0",
    fontSize: "14px", fontFamily: "var(--font-dm-sans), sans-serif",
    outline: "none", transition: "border-color 0.2s",
    width: "100%", boxSizing: "border-box", resize: "vertical",
    minHeight: "120px", lineHeight: 1.6,
  },
  select: {
    backgroundColor: "#0d0d18", border: "1px solid #2a2a3e",
    borderRadius: "10px", padding: "12px 14px", color: "#e0e0f0",
    fontSize: "14px", fontFamily: "var(--font-dm-sans), sans-serif",
    outline: "none", width: "100%", cursor: "pointer", appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
    paddingRight: "36px", boxSizing: "border-box",
  },
  toggleRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px", backgroundColor: "#0d0d18",
    border: "1px solid #2a2a3e", borderRadius: "10px",
  },
  toggleLabel: { color: "#ccc", fontSize: "14px" },
  toggle: (on) => ({
    width: "40px", height: "22px", borderRadius: "11px",
    backgroundColor: on ? "#500fe9" : "#2a2a3e",
    cursor: "pointer", position: "relative", transition: "background-color 0.2s", flexShrink: 0,
  }),
  toggleDot: (on) => ({
    width: "16px", height: "16px", borderRadius: "50%",
    backgroundColor: "#fff", position: "absolute",
    top: "3px", left: on ? "21px" : "3px", transition: "left 0.2s",
  }),

  dropzone: (dragging) => ({
    backgroundColor: dragging ? "#1a1a2e" : "#13131f",
    border: `1.5px dashed ${dragging ? "#500fe9" : "#2a2a3e"}`,
    borderRadius: "16px", padding: "36px 24px",
    textAlign: "center", cursor: "pointer",
    transition: "all 0.2s", marginBottom: "16px",
  }),
  dropzoneIcon: { fontSize: "32px", marginBottom: "10px" },
  dropzoneText: { color: "#666", fontSize: "14px", marginBottom: "4px" },
  dropzoneLink: { color: "#500fe9", cursor: "pointer", fontWeight: 600 },
  dropzoneLimit: { color: "#444", fontSize: "12px", marginTop: "6px" },

  previews: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px", marginBottom: "16px",
  },
  previewItem: {
    position: "relative", borderRadius: "10px", overflow: "hidden",
    border: "1px solid #2a2a3e", aspectRatio: "1",
  },
  previewImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  previewRemove: {
    position: "absolute", top: "4px", right: "4px",
    width: "20px", height: "20px", borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.7)", color: "#fff",
    border: "none", cursor: "pointer", fontSize: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  uploadProgress: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 16px", backgroundColor: "#0d0d18",
    borderRadius: "10px", border: "1px solid #2a2a3e",
    color: "#a78bfa", fontSize: "13px", marginBottom: "8px",
  },
  progressBar: {
    flex: 1, height: "4px", backgroundColor: "#1a1a2e",
    borderRadius: "2px", overflow: "hidden",
  },
  progressFill: (pct) => ({
    height: "100%", backgroundColor: "#500fe9",
    width: `${pct}%`, transition: "width 0.3s",
    borderRadius: "2px",
  }),

  summaryCard: {
    backgroundColor: "#13131f", border: "1px solid #1e1e30",
    borderRadius: "16px", padding: "28px", marginBottom: "16px",
  },
  summaryRow: {
    display: "flex", justifyContent: "space-between",
    padding: "10px 0", borderBottom: "1px solid #1a1a2e",
    fontSize: "14px",
  },
  summaryKey: { color: "#555", fontWeight: 500 },
  summaryVal: { color: "#e0e0f0", textAlign: "right", maxWidth: "60%" },
  urgentBadge: {
    display: "inline-block", backgroundColor: "#2d0a0a",
    color: "#f87171", border: "1px solid #5a1a1a",
    borderRadius: "20px", fontSize: "11px", padding: "3px 10px",
  },
  summaryImgs: {
    display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px",
  },
  summaryImg: {
    width: "60px", height: "60px", objectFit: "cover",
    borderRadius: "6px", border: "1px solid #2a2a3e",
  },

  bottomBar: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(10,10,15,0.95)",
    borderTop: "1px solid #1a1a2e",
    backdropFilter: "blur(12px)",
    padding: "16px 24px",
    display: "flex", justifyContent: "center", gap: "12px", zIndex: 40,
  },
  btnCancel: {
    backgroundColor: "transparent", border: "1px solid #2a2a3e",
    color: "#888", borderRadius: "10px", padding: "12px 28px",
    fontSize: "14px", cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 500,
  },
  btnBack: {
    backgroundColor: "transparent", border: "1px solid #2a2a3e",
    color: "#ccc", borderRadius: "10px", padding: "12px 28px",
    fontSize: "14px", cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 500,
  },
  btnNext: {
    backgroundColor: "#500fe9", border: "none",
    color: "#fff", borderRadius: "10px", padding: "12px 32px",
    fontSize: "14px", cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 700,
  },
  btnDisabled: {
    backgroundColor: "#2a2a3e", border: "none",
    color: "#555", borderRadius: "10px", padding: "12px 32px",
    fontSize: "14px", cursor: "not-allowed",
    fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 700,
  },
  errorMsg: { color: "#f87171", fontSize: "12px", marginTop: "4px" },

  centrado: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px 24px", textAlign: "center",
  },
  bigIcon: { fontSize: "56px", marginBottom: "20px" },
  bigTitle: {
    fontFamily: "var(--font-syne), sans-serif", fontWeight: 800,
    fontSize: "28px", color: "#f0f0ff", marginBottom: "10px",
  },
  bigSub: { color: "#666", fontSize: "15px", marginBottom: "32px" },
  btnPrimary: {
    backgroundColor: "#500fe9", color: "#fff", border: "none",
    borderRadius: "10px", padding: "14px 32px", fontSize: "15px",
    fontWeight: 700, cursor: "pointer",
    fontFamily: "var(--font-dm-sans), sans-serif",
    textDecoration: "none",
  },
};

export default function NuevaSolicitud() {
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
  const focus = { borderColor: "#500fe9", boxShadow: "0 0 0 3px rgba(80,15,233,0.15)" };
  const blur  = { borderColor: "#2a2a3e", boxShadow: "none" };

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
      if (!form.titulo.trim())       e.titulo      = "El título es obligatorio";
      if (!form.descripcion.trim())  e.descripcion = "La descripción es obligatoria";
    }
    if (paso === 3 && !form.distrito) e.distrito = "Selecciona un distrito";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const avanzar = () => { if (validarPaso()) setPaso((p) => Math.min(p + 1, 4)); };

  
  
  const publicar = async () => {
    if (!user) return;
    setEnviando(true);

    try {
      let imageUrls = [];
      if (archivos.length > 0) {
        setSubiendoPct(0);
        imageUrls = await subirImagenesSolicitud(
          archivos,
          user.uid,
          (pct) => setSubiendoPct(Math.round(pct))
        );
        setSubiendoPct(null);
      }

      // 2. Guardar solicitud en Firestore
      const urgente = form.urgencia === "hoy" || form.urgente;
      const result = await crearSolicitud(
        {
          titulo:      form.titulo.trim(),
          descripcion: form.descripcion.trim(),
          tags:        [form.categoria.tag],
          precio:      form.presupuesto ? `s/ ${form.presupuesto}` : "A coordinar",
          distrito:    form.distrito,
          urgente,
          modalidad:   form.modalidad,
          urgencia:    form.urgencia,
          nombre:      user.displayName ?? user.email?.split("@")[0] ?? "Usuario",
          iniciales:   obtenerIniciales(user.displayName ?? user.email ?? "U"),
          imageUrls,  // ← URLs de Storage
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
      <div style={s.root}>
        <div style={s.inner}>
          <div style={s.centrado}>
            <div style={s.bigIcon}>🔒</div>
            <h2 style={s.bigTitle}>Inicia sesión primero</h2>
            <p style={s.bigSub}>Para publicar una solicitud necesitas una cuenta en Nexora.</p>
            <Link href="/login" style={s.btnPrimary}>Ingresar</Link>
          </div>
        </div>
      </div>
    );
  }

  if (publicado) {
    return (
      <div style={s.root}>
        <div style={s.inner}>
          <div style={s.centrado}>
            <div style={s.bigIcon}>🎉</div>
            <h2 style={s.bigTitle}>¡Solicitud publicada!</h2>
            <p style={s.bigSub}>Los trabajadores de tu zona ya pueden postularse.</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={{ ...s.btnCancel, cursor: "pointer" }} onClick={() => router.push("/FeedTrabajos")}>
                Ver el feed
              </button>
              <button
                style={s.btnPrimary}
                onClick={() => {
                  setPublicado(false);
                  setPaso(1);
                  setArchivos([]);
                  setPreviews([]);
                  setForm({ categoria: null, titulo: "", descripcion: "", presupuesto: "",
                             modalidad: "Presencial", distrito: "", urgencia: "acordar", urgente: false });
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
    <div style={s.root}>
      <div style={s.inner}>
          <div style={{ textAlign: "center", width: "100%" }}>
                <h1 style={s.pageTitle}>Nueva solicitud</h1>
            </div>

        <div style={s.stepper}>
          {PASOS.map((nombre, i) => {
            const n = i + 1;
            const active = paso === n;
            const done   = paso > n;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "unset" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={s.stepCircle(active, done)}>{done ? "✓" : n}</div>
                  <span style={s.stepLabel(active, done)}>{nombre}</span>
                </div>
                {i < 3 && <div style={s.stepLine(done)} />}
              </div>
            );
          })}
        </div>

        {paso === 1 && (
          <>
            <h2 style={s.sectionTitle}>¿Qué tipo de servicio necesitas?</h2>
            <p style={s.sectionSub}>Elige la categoría que mejor describe tu solicitud</p>
            <div style={s.grid}>
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.id}
                  style={s.catBtn(form.categoria?.id === cat.id)}
                  onClick={() => { setF("categoria", cat); setErrores({}); }}
                >
                  <span style={{ fontSize: "22px" }}>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
            {errores.categoria && <p style={s.errorMsg}>{errores.categoria}</p>}
          </>
        )}

        {paso === 2 && (
          <div style={s.formCard}>
            <div style={s.formCardTitle}>Describe tu solicitud</div>
            <div style={s.fieldGroup}>
              <div style={s.field}>
                <label style={s.label}>Título de la solicitud</label>
                <input
                  style={s.input}
                  placeholder="Ej. Necesito técnico para instalar cámaras de seguridad en casa"
                  value={form.titulo}
                  onChange={(e) => setF("titulo", e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, focus)}
                  onBlur={(e)  => Object.assign(e.target.style, blur)}
                />
                {errores.titulo && <p style={s.errorMsg}>{errores.titulo}</p>}
              </div>
              <div style={s.field}>
                <label style={s.label}>Descripción detallada</label>
                <textarea
                  style={s.textarea}
                  placeholder="Cuéntanos qué necesitas exactamente, cuándo, dónde y cualquier detalle relevante..."
                  value={form.descripcion}
                  onChange={(e) => setF("descripcion", e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#500fe9")}
                  onBlur={(e)  => (e.target.style.borderColor = "#2a2a3e")}
                />
                {errores.descripcion && <p style={s.errorMsg}>{errores.descripcion}</p>}
              </div>
            </div>
          </div>
        )}

        {paso === 3 && (
          <>
            <div style={s.formCard}>
              <div style={s.formCardTitle}>Detalles del trabajo</div>
              <div style={s.fieldGroup}>
                <div style={s.fieldRow}>
                  <div style={s.field}>
                    <label style={s.label}>Presupuesto (S/)</label>
                    <input
                      style={s.input}
                      placeholder="Ej: 100-200"
                      value={form.presupuesto}
                      onChange={(e) => setF("presupuesto", e.target.value)}
                      onFocus={(e) => Object.assign(e.target.style, focus)}
                      onBlur={(e)  => Object.assign(e.target.style, blur)}
                    />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Modalidad</label>
                    <select style={s.select} value={form.modalidad} onChange={(e) => setF("modalidad", e.target.value)}>
                      <option>Presencial</option>
                      <option>Remoto</option>
                      <option>Híbrido</option>
                    </select>
                  </div>
                </div>

                <div style={s.fieldRow}>
                  <div style={s.field}>
                    <label style={s.label}>Ubicación</label>
                    <select
                      style={s.select}
                      value={form.distrito}
                      onChange={(e) => { setF("distrito", e.target.value); setErrores({}); }}
                    >
                      <option value="">Selecciona un distrito</option>
                      {DISTRITOS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errores.distrito && <p style={s.errorMsg}>{errores.distrito}</p>}
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>¿Cuándo lo necesitas?</label>
                    <select style={s.select} value={form.urgencia} onChange={(e) => setF("urgencia", e.target.value)}>
                      {URGENCIA.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </div>
                </div>

                <div style={s.toggleRow}>
                  <span style={s.toggleLabel}>Marcar como urgente</span>
                  <div style={s.toggle(form.urgente)} onClick={() => setF("urgente", !form.urgente)}>
                    <div style={s.toggleDot(form.urgente)} />
                  </div>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => agregarArchivos(e.target.files)}
            />

            {previews.length > 0 && (
              <div style={s.previews}>
                {previews.map((src, i) => (
                  <div key={i} style={s.previewItem}>
                    <img src={src} alt={`preview-${i}`} style={s.previewImg} />
                    <button style={s.previewRemove} onClick={() => quitarImagen(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {archivos.length < MAX_IMAGENES && (
              <div
                style={s.dropzone(dragging)}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <p style={s.dropzoneText}>
                  {previews.length === 0
                    ? "Arrastra fotos del trabajo aquí"
                    : `${previews.length} imagen${previews.length > 1 ? "es" : ""} seleccionada${previews.length > 1 ? "s" : ""}`}
                </p>
                <p style={{ ...s.dropzoneText, marginBottom: 0 }}>
                  o <span style={s.dropzoneLink}>selecciona archivos</span>
                </p>
                <p style={s.dropzoneLimit}>
                  Máximo {MAX_IMAGENES} imágenes · JPG, PNG, WEBP
                </p>
              </div>
            )}
          </>
        )}

        {paso === 4 && (
          <>
            <h2 style={s.sectionTitle}>Revisa tu solicitud</h2>
            <p style={s.sectionSub}>Confirma que todo esté correcto antes de publicar</p>

            {subiendoPct !== null && (
              <div style={s.uploadProgress}>
                <span>Subiendo imágenes... {subiendoPct}%</span>
                <div style={s.progressBar}>
                  <div style={s.progressFill(subiendoPct)} />
                </div>
              </div>
            )}

            <div style={s.summaryCard}>
              {[
                { k: "Categoría",    v: <>{form.categoria?.icon} {form.categoria?.label}</> },
                { k: "Título",       v: form.titulo },
                { k: "Descripción",  v: form.descripcion },
                { k: "Presupuesto",  v: form.presupuesto ? `s/ ${form.presupuesto}` : "A coordinar" },
                { k: "Modalidad",    v: form.modalidad },
                { k: "Distrito",     v: form.distrito },
                { k: "Cuándo",       v: formatUrgencia(form.urgencia) },
                {
                  k: "Estado",
                  v: (form.urgente || form.urgencia === "hoy")
                    ? <span style={s.urgentBadge}> Urgente</span>
                    : <span style={{ color: "#555" }}>Normal</span>,
                },
              ].map(({ k, v }, i) => (
                <div key={k} style={{ ...s.summaryRow, borderBottom: i === 7 ? "none" : "1px solid #1a1a2e" }}>
                  <span style={s.summaryKey}>{k}</span>
                  <span style={s.summaryVal}>{v}</span>
                </div>
              ))}

              {previews.length > 0 && (
                <div style={{ ...s.summaryRow, borderBottom: "none", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                  <span style={s.summaryKey}>Imágenes ({previews.length})</span>
                  <div style={s.summaryImgs}>
                    {previews.map((src, i) => (
                      <img key={i} src={src} alt="" style={s.summaryImg} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p style={{ color: "#555", fontSize: "13px", textAlign: "center" }}>
              Al publicar, tu solicitud estará visible para los trabajadores de tu zona inmediatamente.
            </p>
          </>
        )}
      </div>
      <div style={s.bottomBar}>
        <button style={s.btnCancel} onClick={() => router.push("/FeedTrabajos")}>Cancelar</button>
        {paso > 1 && (
          <button style={s.btnBack} onClick={() => setPaso((p) => p - 1)}>Atrás</button>
        )}
        {paso < 4 ? (
          <button style={s.btnNext} onClick={avanzar}>Continuar</button>
        ) : (
          <button
            style={enviando ? s.btnDisabled : s.btnNext}
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