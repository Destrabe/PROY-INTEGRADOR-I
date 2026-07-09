"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/components/AuthContext";
import { uploadProfilePhoto } from "@/firebase/uploadProfilePhoto";
import ProtectedRoute from "@/components/ProtectedRoute";
import { db } from "@/firebase/client";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";

const Icons = {
  Settings: () => (
    <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Star: ({ fill = "none" }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Calendar: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  Award: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Bell: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  User: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const ROLE_LABELS = {
  cliente: "Cliente",
  client: "Cliente",
  worker: "Trabajador",
  trabajador: "Trabajador",
  admin: "Admin",
  administrador: "Administrador",
};

function normalizeRole(rol) {
  return String(rol || "cliente").toLowerCase().trim();
}

function getRoleLabel(rol) {
  const normalized = normalizeRole(rol);
  return ROLE_LABELS[normalized] || normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function isWorkerRole(rol) {
  return ["worker", "trabajador"].includes(normalizeRole(rol));
}

function isAdminRole(rol) {
  return ["admin", "administrador"].includes(normalizeRole(rol));
}

function titleCaseName(value = "") {
  const noEmail = String(value).includes("@") ? String(value).split("@")[0] : String(value);
  return noEmail
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
}

function toDateLabel(value) {
  if (!value) return "Sin fecha";
  if (typeof value?.toDate === "function") return value.toDate().toLocaleDateString();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000).toLocaleDateString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Sin fecha" : date.toLocaleDateString();
}

function getRequestTitle(item) {
  return item.titulo || item.profesion || item.servicio || item.categoria || "Servicio Nexora";
}

function getRequestDate(item) {
  return item.fecha || item.creadoEn || item.createdAt || item.timestamp;
}

function getWorkerIdFromPostulante(p) {
  return typeof p === "string" ? p : p?.workerId || p?.uid || p?.userId;
}

function getWorkerStatusFromRequest(request, uid) {
  const match = (request.postulantes || []).find((p) => getWorkerIdFromPostulante(p) === uid);
  if (!match) return null;
  return typeof match === "object" ? match.estado || "postulado" : "postulado";
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles =
    type === "success"
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      : "bg-red-500/10 border-red-500/20 text-red-400";

  return (
    <div className={`fixed bottom-8 right-8 ${styles} border p-5 rounded-2xl flex items-center gap-4 z-[200] shadow-2xl backdrop-blur-md`}>
      <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
      <p className="text-sm font-black uppercase tracking-widest">{message}</p>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full relative transition-all ${checked ? "bg-emerald-500" : "bg-slate-800"}`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block space-y-2">
      <div>
        <p className="text-sm font-black text-white">{label}</p>
        {hint && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-1">{hint}</p>}
      </div>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold outline-none focus:border-[#6c63ff] ${props.className || ""}`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={`w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold outline-none focus:border-[#6c63ff] ${props.className || ""}`}
    />
  );
}

function SettingsModal({
  user,
  userData,
  editData,
  setEditData,
  avatarInitials,
  onClose,
  onSave,
  isSaving,
  onPhotoSelected,
}) {
  const [section, setSection] = useState("Perfil");
  const [dangerText, setDangerText] = useState("");
  const [settings, setSettings] = useState({
    twoFactor: true,
    sessionAlerts: true,
    email: true,
    push: true,
    messages: true,
    projects: true,
    weekly: true,
    marketing: false,
    theme: "Oscuro",
    accent: "#6c63ff",
    density: "Normal",
  });

  const fullName = titleCaseName(`${editData.first_name || ""} ${editData.last_name || ""}`.trim() || user?.email || "Usuario");
  const username = `@${(editData.username || fullName || "usuario").toLowerCase().replace(/[^a-z0-9]/g, "")}`;

  const tabs = ["Perfil", "Cuenta", "Seguridad", "Notificaciones", "Apariencia", "Zona de Peligro"];

  const Footer = ({ danger = false }) => (
    <div className="flex gap-4 pt-6">
      <button onClick={onClose} className="flex-1 bg-white/5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10">
        Cancelar
      </button>
      {!danger && (
        <button onClick={onSave} disabled={isSaving} className="flex-1 bg-[#6c63ff] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#6c63ff]/20 disabled:opacity-50">
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
      <div className="bg-[#111118] w-full max-w-5xl rounded-[3rem] border border-white/5 relative shadow-2xl max-h-[90vh] overflow-hidden">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors z-10">
          <Icons.X />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] max-h-[90vh]">
          <aside className="bg-[#0A0A0F] border-r border-white/5 p-6 space-y-2 overflow-y-auto">
            <h2 className="text-xl font-black mb-6 uppercase tracking-widest">Configuración</h2>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSection(tab)}
                className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  section === tab ? "bg-[#6c63ff] text-white" : "text-slate-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </aside>

          <section className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
            {section === "Perfil" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-white">Perfil</h3>
                  <p className="text-slate-500 font-bold mt-1">Tu información pública en Nexora</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <label className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#6c63ff] cursor-pointer group relative">
                    {userData.photoURL ? (
                      <img src={userData.photoURL} alt="perfil" className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" />
                    ) : (
                      <div className="w-full h-full bg-[#6c63ff] flex items-center justify-center text-3xl font-black">{avatarInitials}</div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={onPhotoSelected} />
                  </label>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Haz clic en el ícono para cambiar tu foto</p>
                </div>

                <Field label="Nombre de usuario" hint="Visible para otros usuarios">
                  <Input value={editData.username || username} onChange={(e) => setEditData({ ...editData, username: e.target.value.replace("@", "") })} />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Nombre">
                    <Input value={editData.first_name} onChange={(e) => setEditData({ ...editData, first_name: e.target.value })} />
                  </Field>
                  <Field label="Apellido">
                    <Input value={editData.last_name} onChange={(e) => setEditData({ ...editData, last_name: e.target.value })} />
                  </Field>
                </div>

                <Field label="Biografía" hint="Máx. 160 caracteres">
                  <textarea
                    rows="3"
                    maxLength={160}
                    value={editData.about_me}
                    onChange={(e) => setEditData({ ...editData, about_me: e.target.value })}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-5 py-3.5 text-white font-bold outline-none focus:border-[#6c63ff] resize-none"
                  />
                </Field>

                <Field label="Ubicación">
                  <Input value={editData.city} onChange={(e) => setEditData({ ...editData, city: e.target.value })} />
                </Field>

                <Field label="Sitio web">
                  <Input value={editData.website || ""} onChange={(e) => setEditData({ ...editData, website: e.target.value })} placeholder="https://juanperez.dev" />
                </Field>

                <Footer />
              </div>
            )}

            {section === "Cuenta" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-white">Cuenta</h3>
                  <p className="text-slate-500 font-bold mt-1">Información de contacto y credenciales</p>
                </div>

                <Field label="Dirección de email" hint="Para notificaciones y recuperación">
                  <Input value={editData.email || user?.email || ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                </Field>

                <Field label="Teléfono" hint="Opcional, para recuperación">
                  <Input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                </Field>

                <Field label="Idioma preferido">
                  <Select value={editData.language || "Español"} onChange={(e) => setEditData({ ...editData, language: e.target.value })}>
                    <option>Español</option>
                    <option>English</option>
                    <option>Português</option>
                  </Select>
                </Field>

                <Field label="Zona horaria">
                  <Select value={editData.timezone || "America/Lima (UTC-5)"} onChange={(e) => setEditData({ ...editData, timezone: e.target.value })}>
                    <option>America/Lima (UTC-5)</option>
                    <option>Europe/Madrid (UTC+1)</option>
                    <option>America/Bogota (UTC-5)</option>
                    <option>America/Mexico_City (UTC-6)</option>
                  </Select>
                </Field>

                <Footer />
              </div>
            )}

            {section === "Seguridad" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-white">Seguridad</h3>
                  <p className="text-slate-500 font-bold mt-1">Protege tu cuenta con opciones avanzadas</p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                  <p className="text-emerald-400 font-black">Cuenta protegida</p>
                  <p className="text-slate-500 text-sm font-bold mt-1">Última contraseña cambiada hace 3 meses</p>
                </div>

                <Field label="Contraseña actual">
                  <Input type="password" value="••••••••••" readOnly />
                </Field>

                <Field label="Nueva contraseña" hint="Mín. 8 caracteres">
                  <Input type="password" placeholder="Nueva contraseña" />
                </Field>

                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#0A0A0F] border border-white/5 rounded-2xl p-5">
                    <div>
                      <p className="text-white font-black">Autenticación 2FA</p>
                      <p className="text-slate-500 text-xs font-bold mt-1">Recomendado para mayor seguridad</p>
                    </div>
                    <Toggle checked={settings.twoFactor} onChange={(v) => setSettings({ ...settings, twoFactor: v })} />
                  </div>

                  <div className="flex items-center justify-between bg-[#0A0A0F] border border-white/5 rounded-2xl p-5">
                    <div>
                      <p className="text-white font-black">Alertas de sesión</p>
                      <p className="text-slate-500 text-xs font-bold mt-1">Notificar al iniciar sesión desde nuevo dispositivo</p>
                    </div>
                    <Toggle checked={settings.sessionAlerts} onChange={(v) => setSettings({ ...settings, sessionAlerts: v })} />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Sesiones activas (2)</p>
                  {[
                    ["Chrome · MacOS", "Madrid, ES", "Actual"],
                    ["Safari · iPhone", "Madrid, ES", "Cerrar"],
                  ].map(([device, city, action]) => (
                    <div key={device} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-white font-bold">{device}</p>
                        <p className="text-slate-500 text-xs font-bold">{city}</p>
                      </div>
                      <button className={`text-[10px] font-black uppercase tracking-widest ${action === "Actual" ? "text-emerald-400" : "text-red-400"}`}>
                        {action}
                      </button>
                    </div>
                  ))}
                </div>

                <Footer />
              </div>
            )}

            {section === "Notificaciones" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-white">Notificaciones</h3>
                  <p className="text-slate-500 font-bold mt-1">Controla qué alertas recibes y cómo</p>
                </div>

                {[
                  ["email", "Notificaciones por email", "Recibe actualizaciones en tu correo"],
                  ["push", "Notificaciones push", "Alertas en tiempo real en el navegador"],
                  ["messages", "Mensajes nuevos", "Cuando alguien te escribe"],
                  ["projects", "Actualizaciones de proyectos", "Cambios en proyectos que sigues"],
                  ["weekly", "Reporte semanal", "Resumen de actividad cada lunes"],
                  ["marketing", "Emails de marketing", "Novedades y ofertas de Nexora"],
                ].map(([key, title, desc]) => (
                  <div key={key} className="flex items-center justify-between bg-[#0A0A0F] border border-white/5 rounded-2xl p-5">
                    <div>
                      <p className="text-white font-black">{title}</p>
                      <p className="text-slate-500 text-xs font-bold mt-1">{desc}</p>
                    </div>
                    <Toggle checked={settings[key]} onChange={(v) => setSettings({ ...settings, [key]: v })} />
                  </div>
                ))}

                <Footer />
              </div>
            )}

            {section === "Apariencia" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-white">Apariencia</h3>
                  <p className="text-slate-500 font-bold mt-1">Personaliza la interfaz según tus gustos</p>
                </div>

                <div>
                  <p className="text-sm font-black text-white mb-4">Tema de la interfaz</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      ["Oscuro", "Fondo negro profundo"],
                      ["Claro", "Fondo blanco limpio"],
                      ["Sistema", "Según preferencia del SO"],
                    ].map(([theme, desc]) => (
                      <button
                        key={theme}
                        onClick={() => setSettings({ ...settings, theme })}
                        className={`text-left p-5 rounded-2xl border transition-all ${
                          settings.theme === theme ? "bg-[#6c63ff]/10 border-[#6c63ff] text-white" : "bg-[#0A0A0F] border-white/5 text-slate-400"
                        }`}
                      >
                        <p className="font-black">{theme}</p>
                        <p className="text-xs text-slate-500 font-bold mt-1">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Field label="Color de acento">
                  <Input type="color" value={settings.accent} onChange={(e) => setSettings({ ...settings, accent: e.target.value })} className="h-14 p-2" />
                </Field>

                <div>
                  <p className="text-sm font-black text-white mb-4">Densidad de la interfaz</p>
                  <div className="flex p-2 bg-[#0A0A0F] border border-white/5 rounded-2xl gap-2">
                    {["Compacta", "Normal", "Espaciada"].map((density) => (
                      <button
                        key={density}
                        onClick={() => setSettings({ ...settings, density })}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          settings.density === density ? "bg-[#6c63ff] text-white" : "text-slate-500"
                        }`}
                      >
                        {density}
                      </button>
                    ))}
                  </div>
                </div>

                <Footer />
              </div>
            )}

            {section === "Zona de Peligro" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-red-400">Zona de Peligro</h3>
                  <p className="text-slate-500 font-bold mt-1">Acciones irreversibles sobre tu cuenta</p>
                </div>

                <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-black">Desactivar cuenta</p>
                      <p className="text-slate-500 text-sm font-bold mt-1">Tu cuenta quedará pausada. Puedes reactivarla en cualquier momento iniciando sesión.</p>
                    </div>
                    <button className="bg-white/5 border border-white/10 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                      Desactivar cuenta
                    </button>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 space-y-5">
                  <div>
                    <p className="text-red-400 font-black">Eliminar cuenta permanentemente</p>
                    <p className="text-slate-400 text-sm font-bold mt-1">Esta acción eliminará todos tus datos, proyectos y mensajes. No se puede deshacer.</p>
                  </div>

                  <Field label="Escribe ELIMINAR para confirmar">
                    <Input value={dangerText} onChange={(e) => setDangerText(e.target.value)} placeholder="ELIMINAR" />
                  </Field>

                  <button
                    disabled={dangerText !== "ELIMINAR"}
                    className="w-full bg-red-500 disabled:bg-white/5 disabled:text-slate-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                  >
                    Eliminar mi cuenta
                  </button>
                </div>

                <Footer danger />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function NexoraProfileContent() {
  const { user } = useAuth();

  const [userData, setUserData] = useState(null);
  const [rawOwnRequests, setRawOwnRequests] = useState([]);
  const [rawAllRequests, setRawAllRequests] = useState([]);
  const [rawResenas, setRawResenas] = useState([]);
  const [rawPortfolio, setRawPortfolio] = useState([]);

  const [activeTab, setActiveTab] = useState("Trabajos");
  const [showSettings, setShowSettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [tempPreview, setTempPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [toast, setToast] = useState(null);

  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    city: "",
    phone: "",
    email: "",
    birth_date: "",
    about_me: "",
    website: "",
    language: "Español",
    timezone: "America/Lima (UTC-5)",
    disponibilidad: true,
  });

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (!user?.uid) return;

    const unsubUser = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setUserData(data);
      setEditData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        username: data.username || "",
        city: data.city || "",
        phone: data.phone || "",
        email: data.email || user.email || "",
        birth_date: data.birth_date || "",
        about_me: data.about_me || "",
        website: data.website || "",
        language: data.language || "Español",
        timezone: data.timezone || "America/Lima (UTC-5)",
        disponibilidad: data.disponibilidad ?? true,
      });
    });

    const unsubOwnRequests = onSnapshot(
      query(collection(db, "solicitudes"), where("userId", "==", user.uid)),
      (snap) => setRawOwnRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    const unsubReviews = onSnapshot(
      query(collection(db, "reviews"), where("targetUserId", "==", user.uid)),
      (snap) => setRawResenas(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    const unsubPortfolio = onSnapshot(
      query(collection(db, "portfolio"), where("userId", "==", user.uid)),
      (snap) => setRawPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    return () => {
      unsubUser();
      unsubOwnRequests();
      unsubReviews();
      unsubPortfolio();
    };
  }, [user?.uid, user?.email]);

  useEffect(() => {
    if (!user?.uid || !userData) return;
    if (!isWorkerRole(userData.rol) && !isAdminRole(userData.rol)) return;

    const unsubAll = onSnapshot(
      collection(db, "solicitudes"),
      (snap) => setRawAllRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => setRawAllRequests([]),
    );

    return () => unsubAll();
  }, [user?.uid, userData]);

  const roleLabel = useMemo(() => getRoleLabel(userData?.rol), [userData?.rol]);
  const isWorker = isWorkerRole(userData?.rol);
  const isAdmin = isAdminRole(userData?.rol);

  const displayName = useMemo(() => {
    const fromFirestore = `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim();
    return titleCaseName(fromFirestore || userData?.displayName || user?.email || "Usuario");
  }, [userData, user]);

  const avatarInitials = useMemo(() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [displayName]);

  const resenas = useMemo(
    () => [...rawResenas].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)),
    [rawResenas],
  );

  const portfolio = useMemo(
    () => [...rawPortfolio].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)),
    [rawPortfolio],
  );

  const serviciosCliente = useMemo(
    () =>
      rawOwnRequests
        .filter((t) => t.tipo !== "solicitud_trabajador")
        .sort((a, b) => ((b.creadoEn || b.fecha)?.seconds || 0) - ((a.creadoEn || a.fecha)?.seconds || 0)),
    [rawOwnRequests],
  );

  const trabajosTrabajador = useMemo(
    () =>
      rawAllRequests
        .filter((t) => t.tipo !== "solicitud_trabajador")
        .filter((t) => (t.postulantes || []).some((p) => getWorkerIdFromPostulante(p) === user?.uid))
        .sort((a, b) => ((b.creadoEn || b.fecha)?.seconds || 0) - ((a.creadoEn || a.fecha)?.seconds || 0)),
    [rawAllRequests, user?.uid],
  );

  const adminSolicitudes = useMemo(
    () =>
      rawAllRequests
        .filter((t) => t.tipo !== "solicitud_trabajador")
        .sort((a, b) => ((b.creadoEn || b.fecha)?.seconds || 0) - ((a.creadoEn || a.fecha)?.seconds || 0)),
    [rawAllRequests],
  );

  const mainItems = isAdmin ? adminSolicitudes : isWorker ? trabajosTrabajador : serviciosCliente;
  const mainLabel = isAdmin ? "Solicitudes" : isWorker ? "Trabajos" : "Servicios";
  const emptyMainLabel = isAdmin ? "Sin solicitudes aún" : isWorker ? "Sin trabajos aún" : "Sin servicios aún";

  const reputacion = useMemo(() => {
    if (resenas.length === 0) return { score: "0.0", count: 0 };
    const sum = resenas.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return { score: (sum / resenas.length).toFixed(1), count: resenas.length };
  }, [resenas]);

  const tasaExito = useMemo(() => {
    const base = isWorker ? trabajosTrabajador : serviciosCliente;
    if (base.length === 0) return "—";
    const completados = base.filter((t) => ["Aprobado", "finalizado", "completado"].includes(t.estado)).length;
    return `${Math.round((completados / base.length) * 100)}%`;
  }, [isWorker, trabajosTrabajador, serviciosCliente]);

  const stats = useMemo(() => {
    if (isAdmin) {
      return [
        { value: adminSolicitudes.length, label: "Solicitudes" },
        { value: rawAllRequests.filter((r) => r.tipo === "solicitud_trabajador").length, label: "Verificaciones" },
        { value: resenas.length, label: "Reseñas" },
        { value: roleLabel, label: "Rol", icon: <Icons.Award /> },
      ];
    }

    return [
      { value: mainItems.length, label: mainLabel },
      { value: reputacion.score, label: "Valoración" },
      { value: tasaExito, label: "Éxito" },
      { value: roleLabel, label: "Rol", icon: <Icons.Award /> },
    ];
  }, [isAdmin, adminSolicitudes, rawAllRequests, resenas, roleLabel, mainItems, mainLabel, reputacion, tasaExito]);

  useEffect(() => {
    if (!userData) return;
    const firstTab = isWorker ? "Trabajos" : isAdmin ? "Solicitudes" : "Servicios";
    setActiveTab(firstTab);
  }, [isWorker, isAdmin, userData]);

  const handleSaveSettings = async () => {
    if (!user?.uid) return;
    try {
      setIsSaving(true);
      await updateDoc(doc(db, "users", user.uid), editData);
      showToast("Perfil actualizado");
      setShowSettings(false);
    } catch {
      showToast("Error al guardar", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const createZoomedImage = useCallback(() => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 500;
        canvas.width = size;
        canvas.height = size;
        const scale = Math.max(size / img.width, size / img.height) * zoom;
        const width = img.width * scale;
        const height = img.height * scale;
        ctx.drawImage(img, (size - width) / 2, (size - height) / 2, width, height);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      };
      img.src = tempPreview;
    });
  }, [tempPreview, zoom]);

  const handleApplyImage = async () => {
    if (!selectedFile || !user?.uid) return;
    try {
      setUploading(true);
      const blob = await createZoomedImage();
      const photoURL = await uploadProfilePhoto(user.uid, blob);
      await updateDoc(doc(db, "users", user.uid), { photoURL });
      showToast("Foto actualizada");
      setShowEditModal(false);
    } catch {
      showToast("Error al subir", "error");
    } finally {
      setUploading(false);
    }
  };

  const tabs = isAdmin
    ? ["Solicitudes", "Reseñas", "Sobre mí"]
    : isWorker
    ? ["Trabajos", "Reseñas", "Sobre mí", "Portfolio"]
    : ["Servicios", "Reseñas", "Sobre mí"];

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] text-white font-sans selection:bg-[#6c63ff]/30">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20 space-y-10">
        <div className="bg-[#111118] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-[#6c63ff] shrink-0 shadow-2xl border-4 border-white/5">
              {userData.photoURL ? (
                <img src={userData.photoURL} alt="perfil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-black uppercase">{avatarInitials}</div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-4xl font-black tracking-tight">{displayName}</h1>
                <span className="flex items-center gap-2 bg-[#6c63ff]/10 text-[#6c63ff] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#6c63ff]/20">
                  <Icons.Check /> Verificado
                </span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Icons.MapPin /> {userData.city || "Sin ciudad"}
                </span>

                {!isAdmin && (
                  <span className={`flex items-center gap-2 ${userData.disponibilidad ? "text-emerald-400" : "text-red-400"}`}>
                    <div className={`w-2 h-2 rounded-full ${userData.disponibilidad ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                    {userData.disponibilidad ? "Disponible ahora" : "No disponible"}
                  </span>
                )}

                <span className="flex items-center gap-2 text-amber-400">
                  <Icons.Star fill="currentColor" /> {reputacion.score} ({reputacion.count} reseñas)
                </span>
              </div>

              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium italic">
                "{userData.about_me || (isWorker ? "Trabajador profesional en Nexora." : isAdmin ? "Administrador de la plataforma Nexora." : "Cliente en Nexora.")}"
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              {isWorker ? (
                <>
                  <button className="bg-[#6c63ff] hover:bg-[#5a52d5] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#6c63ff]/20">
                    Ver disponibilidad
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all">
                    Mensaje
                  </button>
                </>
              ) : isAdmin ? (
                <>
                  <button className="bg-[#6c63ff] hover:bg-[#5a52d5] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#6c63ff]/20">
                    Panel Admin
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all">
                    Auditoría
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-[#6c63ff] hover:bg-[#5a52d5] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#6c63ff]/20">
                    Publicar servicio
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all">
                    Mensajes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="bg-[#111118] rounded-[2rem] p-8 text-center border border-white/5 hover:border-[#6c63ff]/30 transition-all">
              <p className="text-4xl font-black text-white tracking-tighter truncate" title={String(value)}>
                {value}
              </p>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5">
                {icon}
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-8">
            <div className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/5">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <Icons.Briefcase /> Información
              </h2>

              <div className="space-y-6 text-sm font-bold">
                <div className="flex justify-between text-slate-400 border-b border-white/5 pb-4">
                  <span>Ciudad</span>
                  <span className="text-white font-black">{userData.city || "No especificada"}</span>
                </div>

                <div className="flex justify-between text-slate-400 border-b border-white/5 pb-4">
                  <span>Teléfono</span>
                  <span className="text-white font-black">{userData.phone || "No especificado"}</span>
                </div>

                <div className="flex justify-between text-slate-400 border-b border-white/5 pb-4">
                  <span>Email</span>
                  <span className="text-white font-black truncate max-w-[160px]">{userData.email || user?.email || "No especificado"}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Rol</span>
                  <span className="text-[#6c63ff] uppercase font-black">{roleLabel}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/5">
              <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Icons.Shield /> Estado Nexora
              </h2>

              <div className="space-y-3 text-xs font-bold text-slate-400">
                {[
                  "Identidad verificada",
                  isWorker ? "Perfil visible para clientes" : isAdmin ? "Permisos administrativos activos" : "Cuenta lista para publicar servicios",
                  "Protección de pagos activa",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-emerald-400">
                    <Icons.Check /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="flex p-2 bg-[#111118] rounded-2xl border border-white/5 gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-fit px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    activeTab === tab ? "bg-[#6c63ff] text-white shadow-xl" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
              {(activeTab === "Trabajos" || activeTab === "Servicios" || activeTab === "Solicitudes") && (
                <div className="space-y-6">
                  {mainItems.length > 0 ? (
                    mainItems.map((item) => {
                      const workerStatus = isWorker ? getWorkerStatusFromRequest(item, user?.uid) : null;
                      const status = workerStatus || item.estado || "Publicado";

                      return (
                        <div key={item.id} className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/5 hover:border-[#6c63ff]/30 transition-all group">
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <h3 className="text-xl font-black text-white group-hover:text-[#6c63ff] transition-colors">
                              {getRequestTitle(item)}
                            </h3>
                            <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-400/20 px-4 py-1.5 rounded-full bg-emerald-400/5">
                              {status}
                            </span>
                          </div>

                          <p className="text-slate-400 leading-relaxed mb-6 italic">
                            "{item.descripcion || item.detalle || "Sin descripción"}"
                          </p>

                          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-2">
                              <Icons.Calendar /> {toDateLabel(getRequestDate(item))}
                            </span>
                            {item.precio && <span>{item.precio}</span>}
                            {item.distrito && <span>{item.distrito}</span>}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-[#111118] rounded-[2.5rem] p-20 text-center border border-white/5 opacity-40 font-black uppercase tracking-[0.3em] text-[10px]">
                      {emptyMainLabel}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Reseñas" && (
                <div className="space-y-6">
                  {resenas.length > 0 ? (
                    resenas.map((r) => (
                      <div key={r.id} className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex text-amber-400 gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Icons.Star key={i} fill={i < Number(r.rating || 0) ? "currentColor" : "none"} />
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                            <Icons.Calendar /> {toDateLabel(r.timestamp)}
                          </span>
                        </div>

                        <p className="text-white text-lg font-medium italic mb-4">{r.comment || "Sin comentario"}</p>
                        <p className="text-[10px] font-black text-[#6c63ff] uppercase tracking-widest">
                          — {r.authorName || "Usuario Nexora"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#111118] rounded-[2.5rem] p-20 text-center border border-white/5 opacity-40 font-black uppercase tracking-[0.3em] text-[10px]">
                      Sin reseñas aún
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Sobre mí" && (
                <div className="bg-[#111118] rounded-[2.5rem] p-12 border border-white/5">
                  <h3 className="text-2xl font-black text-white mb-6">Biografía</h3>
                  <p className="text-slate-400 text-xl leading-relaxed italic font-medium">
                    "{userData.about_me || "Este usuario todavía no agregó una biografía."}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                    <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Especialidad</p>
                      <p className="text-white font-black">{isWorker ? "Trabajador independiente" : isAdmin ? "Administración Nexora" : "Cliente Nexora"}</p>
                    </div>

                    <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Disponibilidad</p>
                      <p className="text-white font-black">{userData.disponibilidad ? "Disponible" : "No disponible"}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Portfolio" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {portfolio.length > 0 ? (
                    portfolio.map((p) => (
                      <div key={p.id} className="bg-[#111118] rounded-[2.5rem] overflow-hidden border border-white/5 group hover:border-[#6c63ff]/30 transition-all">
                        <div className="aspect-video bg-[#0A0A0F] overflow-hidden">
                          <img src={p.imageUrl} alt={p.title || "portfolio"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-8">
                          <h4 className="text-lg font-black text-white uppercase tracking-widest">{p.title || "Proyecto"}</h4>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-[#111118] rounded-[2.5rem] p-20 text-center border border-white/5 opacity-40 font-black uppercase tracking-[0.3em] text-[10px]">
                      Portfolio vacío
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-10 right-10 bg-[#6c63ff] p-5 rounded-[2rem] shadow-2xl hover:scale-110 transition-all z-50 group"
      >
        <Icons.Settings />
      </button>

      {showSettings && (
        <SettingsModal
          user={user}
          userData={userData}
          editData={editData}
          setEditData={setEditData}
          avatarInitials={avatarInitials}
          onClose={() => setShowSettings(false)}
          onSave={handleSaveSettings}
          isSaving={isSaving}
          onPhotoSelected={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setTempPreview(URL.createObjectURL(file));
              setSelectedFile(file);
              setShowEditModal(true);
            }
          }}
        />
      )}

      {showEditModal && tempPreview && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[200] p-6">
          <div className="bg-[#111118] w-full max-w-lg rounded-[3rem] p-10 border border-white/5 relative shadow-2xl">
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-center">Ajustar Foto</h2>

            <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-[#6c63ff] bg-[#0A0A0F] mb-8">
              <img src={tempPreview} alt="perfil" style={{ transform: `scale(${zoom})` }} className="w-full h-full object-cover transition-transform" />
            </div>

            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#6c63ff] mb-8"
            />

            <div className="flex gap-4">
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-white/5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                Cancelar
              </button>
              <button onClick={handleApplyImage} disabled={uploading} className="flex-1 bg-[#6c63ff] py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] disabled:opacity-50">
                {uploading ? "Subiendo..." : "Aplicar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NexoraProfile() {
  return (
    <ProtectedRoute>
      <NexoraProfileContent />
    </ProtectedRoute>
  );
}
