"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { uploadProfilePhoto } from "@/firebase/uploadProfilePhoto";
import ProtectedRoute from "@/components/ProtectedRoute";
import { db, app } from "@/firebase/client";
import { useThemeStore } from "@/store/themeStore"; // <-- Importamos tu store
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
  signOut,
} from "firebase/auth";

const auth = getAuth(app);

const Icons = {
  Settings: () => (
    <svg className="w-6 h-6 currentColor group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  User: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
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
  return noEmail.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
}

function toDateLabel(value) {
  if (!value) return "Sin fecha";
  if (typeof value?.toDate === "function") return value.toDate().toLocaleDateString();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000).toLocaleDateString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Sin fecha" : date.toLocaleDateString();
}

function toDateTimeLabel(value) {
  if (!value) return "Sin registro";
  if (typeof value?.toDate === "function") return value.toDate().toLocaleString();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000).toLocaleString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Sin registro" : date.toLocaleString();
}

function detectDevice() {
  if (typeof navigator === "undefined") return "Dispositivo desconocido";
  const ua = navigator.userAgent;
  let browser = "Navegador";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";

  let os = "Dispositivo";
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";

  return `${browser} · ${os}`;
}

async function detectLocation() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("no location");
    const data = await res.json();
    if (data?.city) return `${data.city}, ${data.country_code || data.country_name || ""}`.trim();
    return "Ubicación desconocida";
  } catch {
    return "Ubicación desconocida";
  }
}

function getOrCreateSessionId() {
  if (typeof window === "undefined") return null;
  let id = window.localStorage.getItem("nexora_session_id");
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem("nexora_session_id", id);
  }
  return id;
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

const NAME_REGEX = /[^a-zA-ZÀ-ÿ\s]/g;
const USERNAME_REGEX = /[^a-z0-9_]/g;
const PHONE_REGEX = /\D/g;
const LIMITS = { username: 20, first_name: 30, last_name: 30, city: 40, about_me: 160, website: 100, phone: 9 };

function sanitizeName(value) { return value.replace(NAME_REGEX, "").replace(/\s{2,}/g, " ").slice(0, LIMITS.first_name); }
function sanitizeUsername(value) { return value.toLowerCase().replace(USERNAME_REGEX, "").slice(0, LIMITS.username); }
function sanitizeCity(value) { return value.replace(NAME_REGEX, "").replace(/\s{2,}/g, " ").slice(0, LIMITS.city); }
function sanitizePhone(value) { return value.replace(PHONE_REGEX, "").slice(0, LIMITS.phone); }

function isValidWebsite(value) {
  if (!value) return true;
  try {
    const url = value.startsWith("http") ? value : `https://${value}`;
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function Toast({ message, type, onClose }) {
  const theme = useThemeStore((state) => state.theme);
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = type === "success"
    ? `border ${theme === "dark" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`
    : `border ${theme === "dark" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`;

  return (
    <div className={`fixed bottom-8 right-8 ${styles} p-5 rounded-2xl flex items-center gap-4 z-200 shadow-2xl backdrop-blur-md max-w-sm`}>
      <div className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
      <p className="text-sm font-black uppercase tracking-widest">{message}</p>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  const theme = useThemeStore((state) => state.theme);
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`w-12 h-7 rounded-full relative transition-all ${checked ? "bg-emerald-500" : theme === "dark" ? "bg-slate-800" : "bg-slate-300"}`}>
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

function Field({ label, hint, children, counter }) {
  const textColor = useThemeStore((state) => state.textColor);
  const theme = useThemeStore((state) => state.theme);
  return (
    <label className="block space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <p className="text-sm font-black transition-colors" style={{ color: textColor[theme] }}>{label}</p>
          {hint && <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}>{hint}</p>}
        </div>
        {counter && <span className={`text-[10px] font-bold shrink-0 transition-colors ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}>{counter}</span>}
      </div>
      {children}
    </label>
  );
}

function Input(props) {
  const theme = useThemeStore((state) => state.theme);
  const textColor = useThemeStore((state) => state.textColor);
  const bg = theme === "dark" ? "#0A0A0F" : "#f4f4f5";
  const border = theme === "dark" ? "rgba(255,255,255,0.1)" : "#e4e4e7";

  return (
    <input
      {...props}
      className={`w-full rounded-2xl px-5 py-3.5 font-bold outline-none focus:border-[#6c63ff] transition-colors border ${props.className || ""}`}
      style={{ backgroundColor: bg, borderColor: border, color: textColor[theme] }}
    />
  );
}

function PasswordInput({ value, onChange, show, onToggleShow, placeholder }) {
  const theme = useThemeStore((state) => state.theme);
  const textColor = useThemeStore((state) => state.textColor);
  const bg = theme === "dark" ? "#0A0A0F" : "#f4f4f5";
  const border = theme === "dark" ? "rgba(255,255,255,0.1)" : "#e4e4e7";

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl px-5 py-3.5 pr-12 font-bold outline-none focus:border-[#6c63ff] transition-colors border"
        style={{ backgroundColor: bg, borderColor: border, color: textColor[theme] }}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${theme === "dark" ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-black"}`}
      >
        {show ? <Icons.EyeOff /> : <Icons.Eye />}
      </button>
    </div>
  );
}

function SettingsModal({ user, userData, editData, setEditData, avatarInitials, onClose, onSave, isSaving, onPhotoSelected, showToast }) {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const textColor = useThemeStore((state) => state.textColor);
  const cardBg = theme === "dark" ? "#111118" : "#ffffff";
  const inputBg = theme === "dark" ? "#0A0A0F" : "#f4f4f5";
  const borderColor = theme === "dark" ? "rgba(255,255,255,0.05)" : "#e4e4e7";
  const subtleBg = theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const mutedText = theme === "dark" ? "text-slate-500" : "text-slate-400";
  const overlayBg = theme === "dark" ? "bg-black/90" : "bg-white/80";

  const [section, setSection] = useState("Perfil");
  const [dangerText, setDangerText] = useState("");
  const [dangerPassword, setDangerPassword] = useState("");
  const [showDangerPassword, setShowDangerPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: userData?.securitySettings?.twoFactor ?? false,
    sessionAlerts: userData?.securitySettings?.sessionAlerts ?? true,
  });

  const [settings, setSettings] = useState({ theme: userData?.theme || "Oscuro" });

  const fullName = titleCaseName(`${editData.first_name || ""} ${editData.last_name || ""}`.trim() || user?.email || "Usuario");
  const username = `@${(editData.username || fullName || "usuario").toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const tabs = ["Perfil", "Cuenta", "Seguridad", "Apariencia", "Zona de Peligro"];

  useEffect(() => {
    if (!user?.uid) return;
    const currentSessionId = typeof window !== "undefined" ? window.localStorage.getItem("nexora_session_id") : null;
    const unsub = onSnapshot(
      query(collection(db, "sessions"), where("userId", "==", user.uid), orderBy("lastActive", "desc")),
      (snap) => {
        setSessions(snap.docs.map((d) => ({ id: d.id, ...d.data(), isCurrent: d.id === currentSessionId })));
      },
      () => setSessions([])
    );
    return () => unsub();
  }, [user?.uid]);

  const handleToggleSecuritySetting = async (key, value) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }));
    if (!user?.uid) return;
    try { await updateDoc(doc(db, "users", user.uid), { [`securitySettings.${key}`]: value }); } catch { showToast("No se pudo guardar el cambio", "error"); }
  };

  const handleCloseSession = async (sessionId) => {
    try { await deleteDoc(doc(db, "sessions", sessionId)); showToast("Sesión cerrada"); } catch { showToast("No se pudo cerrar la sesión", "error"); }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) return showToast("Ingresa tu contraseña actual", "error");
    if (newPassword.length < 8) return showToast("La nueva contraseña debe tener mínimo 8 caracteres", "error");
    if (newPassword !== confirmPassword) return showToast("Las contraseñas nuevas no coinciden", "error");
    try {
      setIsChangingPassword(true);
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      showToast("Contraseña actualizada correctamente");
    } catch (err) {
      if (err?.code === "auth/wrong-password" || err?.code === "auth/invalid-credential") showToast("La contraseña actual es incorrecta", "error");
      else if (err?.code === "auth/requires-recent-login") showToast("Vuelve a iniciar sesión e inténtalo de nuevo", "error");
      else showToast("Error al cambiar la contraseña", "error");
    } finally { setIsChangingPassword(false); }
  };

  const confirmDeactivateAccount = async () => {
    if (!user?.uid) return;
    try {
      setIsDeactivating(true);
      await updateDoc(doc(db, "users", user.uid), { disabled: true, disabledAt: serverTimestamp() });
      setShowDeactivateConfirm(false);
      showToast("Cuenta desactivada. Tienes 30 días para reactivarla iniciando sesión.");
      await signOut(auth);
      router.push("/login");
    } catch { showToast("No se pudo desactivar la cuenta", "error"); setIsDeactivating(false); }
  };

  const handleDeleteAccount = async () => {
    if (dangerText !== "ELIMINAR") return;
    if (!dangerPassword) return showToast("Ingresa tu contraseña para confirmar", "error");
    try {
      setIsDeleting(true);
      const credential = EmailAuthProvider.credential(user.email, dangerPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(auth.currentUser);
      router.push("/");
    } catch (err) {
      if (err?.code === "auth/wrong-password" || err?.code === "auth/invalid-credential") showToast("Contraseña incorrecta", "error");
      else if (err?.code === "auth/requires-recent-login") showToast("Vuelve a iniciar sesión e inténtalo de nuevo", "error");
      else showToast("No se pudo eliminar la cuenta", "error");
    } finally { setIsDeleting(false); }
  };

  const handleUsernameChange = (e) => setEditData({ ...editData, username: sanitizeUsername(e.target.value) });
  const handleFirstNameChange = (e) => setEditData({ ...editData, first_name: sanitizeName(e.target.value) });
  const handleLastNameChange = (e) => setEditData({ ...editData, last_name: sanitizeName(e.target.value) });
  const handleCityChange = (e) => setEditData({ ...editData, city: sanitizeCity(e.target.value) });
  const handleWebsiteChange = (e) => setEditData({ ...editData, website: e.target.value.slice(0, LIMITS.website) });
  const handleAboutMeChange = (e) => setEditData({ ...editData, about_me: e.target.value.slice(0, LIMITS.about_me) });
  const handlePhoneChange = (e) => setEditData({ ...editData, phone: sanitizePhone(e.target.value) });

  const websiteError = editData.website && !isValidWebsite(editData.website);

  const Footer = ({ danger = false, hideSave = false }) => (
    <div className="flex gap-4 pt-6">
      <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-colors" style={{ backgroundColor: subtleBg, borderColor: borderColor, color: textColor[theme] }}>Cancelar</button>
      {!danger && !hideSave && (
        <button onClick={onSave} disabled={isSaving || websiteError} className="flex-1 bg-[#6c63ff] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#6c63ff]/20 disabled:opacity-50">
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      )}
    </div>
  );

  return (
    <div className={`fixed inset-0 ${overlayBg} backdrop-blur-xl flex items-center justify-center z-100 p-6 transition-colors duration-300`}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(108, 99, 255, 0.35); border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(108, 99, 255, 0.6); }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(108, 99, 255, 0.35) transparent; }
      `}</style>

      <div className="w-full max-w-5xl rounded-[3rem] border relative shadow-2xl max-h-[90vh] overflow-hidden transition-colors" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
        <button onClick={onClose} className={`absolute top-8 right-8 transition-colors z-10 ${theme === "dark" ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-black"}`}>
          <Icons.X />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] max-h-[90vh]">
          <aside className="border-r p-6 space-y-2 overflow-y-auto custom-scrollbar max-h-[90vh] transition-colors" style={{ backgroundColor: inputBg, borderColor: borderColor }}>
            <h2 className="text-xl font-black mb-6 uppercase tracking-widest" style={{ color: textColor[theme] }}>Configuración</h2>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSection(tab)}
                className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  section === tab ? "bg-[#6c63ff] text-white" : `${mutedText} ${theme === "dark" ? "hover:text-white hover:bg-white/5" : "hover:text-black hover:bg-black/5"}`
                }`}
              >
                {tab}
              </button>
            ))}
          </aside>

          <section className="p-8 md:p-12 overflow-y-auto custom-scrollbar max-h-[90vh]">
            {section === "Perfil" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black transition-colors" style={{ color: textColor[theme] }}>Perfil</h3>
                  <p className={`font-bold mt-1 transition-colors ${mutedText}`}>Tu información pública en Nexora</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <label className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#6c63ff] cursor-pointer group relative bg-[#6c63ff]">
                    {userData.photoURL ? <img src={userData.photoURL} alt="perfil" className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" /> : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white">{avatarInitials}</div>}
                    <input type="file" accept="image/*" className="hidden" onChange={onPhotoSelected} />
                  </label>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${mutedText}`}>Haz clic en el ícono para cambiar tu foto</p>
                </div>
                <Field label="Nombre de usuario" hint="Solo minúsculas, números y guion bajo" counter={`${(editData.username || "").length}/${LIMITS.username}`}>
                  <Input value={editData.username || username} onChange={handleUsernameChange} placeholder="usuario_nexora" />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Nombre" counter={`${(editData.first_name || "").length}/${LIMITS.first_name}`}><Input value={editData.first_name} onChange={handleFirstNameChange} /></Field>
                  <Field label="Apellido" counter={`${(editData.last_name || "").length}/${LIMITS.last_name}`}><Input value={editData.last_name} onChange={handleLastNameChange} /></Field>
                </div>
                <Field label="Biografía" hint="Máx. 160 caracteres" counter={`${(editData.about_me || "").length}/${LIMITS.about_me}`}>
                  <textarea rows="3" maxLength={LIMITS.about_me} value={editData.about_me} onChange={handleAboutMeChange} className="w-full border rounded-2xl px-5 py-3.5 font-bold outline-none focus:border-[#6c63ff] resize-none transition-colors" style={{ backgroundColor: inputBg, borderColor: borderColor, color: textColor[theme] }} />
                </Field>
                <Field label="Ubicación" counter={`${(editData.city || "").length}/${LIMITS.city}`}><Input value={editData.city} onChange={handleCityChange} /></Field>
                <Field label="Sitio web" hint={websiteError ? "URL inválida" : undefined} counter={`${(editData.website || "").length}/${LIMITS.website}`}>
                  <Input value={editData.website || ""} onChange={handleWebsiteChange} placeholder="https://juanperez.dev" className={websiteError ? "border-red-500/50" : ""} />
                </Field>
                <Footer />
              </div>
            )}

            {section === "Cuenta" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black transition-colors" style={{ color: textColor[theme] }}>Cuenta</h3>
                  <p className={`font-bold mt-1 transition-colors ${mutedText}`}>Información de contacto y credenciales</p>
                </div>
                <Field label="Dirección de email" hint="Para notificaciones y recuperación">
                  <Input value={editData.email || user?.email || ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                </Field>
                <Field label="Teléfono" hint="Solo números, máximo 9 dígitos" counter={`${(editData.phone || "").length}/${LIMITS.phone}`}>
                  <Input type="tel" inputMode="numeric" value={editData.phone || ""} onChange={handlePhoneChange} placeholder="987654321" />
                </Field>
                <Footer />
              </div>
            )}

            {section === "Seguridad" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black transition-colors" style={{ color: textColor[theme] }}>Seguridad</h3>
                  <p className={`font-bold mt-1 transition-colors ${mutedText}`}>Protege tu cuenta con opciones avanzadas</p>
                </div>
                <div className={`border rounded-2xl p-5 transition-colors ${theme === "dark" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"}`}>
                  <p className={`font-black ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>Cuenta protegida</p>
                  <p className={`text-sm font-bold mt-1 ${mutedText}`}>Cambia tu contraseña regularmente para mayor seguridad</p>
                </div>
                <Field label="Contraseña actual"><PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} show={showCurrentPassword} onToggleShow={() => setShowCurrentPassword((v) => !v)} placeholder="Ingresa tu contraseña actual" /></Field>
                <Field label="Nueva contraseña" hint="Mín. 8 caracteres"><PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} show={showNewPassword} onToggleShow={() => setShowNewPassword((v) => !v)} placeholder="Nueva contraseña" /></Field>
                <Field label="Confirmar nueva contraseña"><Input type={showNewPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite la nueva contraseña" /></Field>
                <button onClick={handleChangePassword} disabled={isChangingPassword} className="w-full bg-[#6c63ff] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#6c63ff]/20 disabled:opacity-50">
                  {isChangingPassword ? "Actualizando..." : "Cambiar contraseña"}
                </button>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border rounded-2xl p-5 transition-colors" style={{ backgroundColor: inputBg, borderColor }}>
                    <div><p className="font-black" style={{ color: textColor[theme] }}>Autenticación 2FA</p><p className={`text-xs font-bold mt-1 ${mutedText}`}>Recomendado para mayor seguridad</p></div>
                    <Toggle checked={securitySettings.twoFactor} onChange={(v) => handleToggleSecuritySetting("twoFactor", v)} />
                  </div>
                  <div className="flex items-center justify-between border rounded-2xl p-5 transition-colors" style={{ backgroundColor: inputBg, borderColor }}>
                    <div><p className="font-black" style={{ color: textColor[theme] }}>Alertas de sesión</p><p className={`text-xs font-bold mt-1 ${mutedText}`}>Notificar al iniciar sesión desde nuevo dispositivo</p></div>
                    <Toggle checked={securitySettings.sessionAlerts} onChange={(v) => handleToggleSecuritySetting("sessionAlerts", v)} />
                  </div>
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${mutedText}`}>Sesiones activas ({sessions.length})</p>
                  {sessions.length > 0 ? (
                    sessions.map((s) => (
                      <div key={s.id} className="flex items-center justify-between py-4 border-b last:border-0 transition-colors" style={{ borderColor }}>
                        <div><p className="font-bold" style={{ color: textColor[theme] }}>{s.device || "Dispositivo desconocido"}</p><p className={`text-xs font-bold ${mutedText}`}>{s.location || "Ubicación desconocida"} · {toDateTimeLabel(s.lastActive)}</p></div>
                        {s.isCurrent ? <span className={`text-[10px] font-black uppercase tracking-widest ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>Actual</span> : <button onClick={() => handleCloseSession(s.id)} className={`text-[10px] font-black uppercase tracking-widest ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>Cerrar</button>}
                      </div>
                    ))
                  ) : <p className={`text-xs font-bold py-4 ${mutedText}`}>No hay sesiones registradas</p>}
                </div>
                <div className="flex gap-4 pt-2">
                  <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-colors" style={{ backgroundColor: subtleBg, borderColor, color: textColor[theme] }}>Cerrar</button>
                </div>
              </div>
            )}

            {section === "Apariencia" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black transition-colors" style={{ color: textColor[theme] }}>Apariencia</h3>
                  <p className={`font-bold mt-1 transition-colors ${mutedText}`}>Personaliza la interfaz según tus gustos</p>
                </div>
                <div>
                  <p className="text-sm font-black mb-4 transition-colors" style={{ color: textColor[theme] }}>Tema de la interfaz</p>
                  <p className={`text-xs font-bold mb-4 ${mutedText}`}>* El tema se sincroniza usando el botón superior principal.</p>
                </div>
                <div className="flex gap-4 pt-2">
                  <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-colors" style={{ backgroundColor: subtleBg, borderColor, color: textColor[theme] }}>Cerrar</button>
                </div>
              </div>
            )}

            {section === "Zona de Peligro" && (
              <div className="space-y-8">
                <div><h3 className={`text-2xl font-black ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>Zona de Peligro</h3><p className={`font-bold mt-1 ${mutedText}`}>Acciones irreversibles sobre tu cuenta</p></div>
                <div className={`border rounded-3xl p-6 space-y-4 transition-colors ${theme === "dark" ? "bg-red-500/5 border-red-500/20" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div><p className="font-black" style={{ color: textColor[theme] }}>Desactivar cuenta</p><p className={`text-sm font-bold mt-1 ${mutedText}`}>Tu cuenta quedará pausada. Si no inicias sesión en 30 días, se eliminará permanentemente.</p></div>
                    <button onClick={() => setShowDeactivateConfirm(true)} disabled={isDeactivating} className="border px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-colors" style={{ backgroundColor: subtleBg, borderColor, color: textColor[theme] }}>{isDeactivating ? "Desactivando..." : "Desactivar cuenta"}</button>
                  </div>
                </div>
                <div className={`border rounded-3xl p-6 space-y-5 transition-colors ${theme === "dark" ? "bg-red-500/10 border-red-500/30" : "bg-red-100 border-red-300"}`}>
                  <div><p className={`font-black ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>Eliminar cuenta permanentemente</p><p className={`text-sm font-bold mt-1 ${mutedText}`}>Esta acción eliminará todos tus datos, proyectos y mensajes. No se puede deshacer.</p></div>
                  <Field label="Contraseña" hint="Necesaria para confirmar tu identidad"><PasswordInput value={dangerPassword} onChange={(e) => setDangerPassword(e.target.value)} show={showDangerPassword} onToggleShow={() => setShowDangerPassword((v) => !v)} placeholder="Tu contraseña" /></Field>
                  <Field label="Escribe ELIMINAR para confirmar"><Input value={dangerText} onChange={(e) => setDangerText(e.target.value)} placeholder="ELIMINAR" /></Field>
                  <button onClick={handleDeleteAccount} disabled={dangerText !== "ELIMINAR" || isDeleting} className={`w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] ${theme === "dark" ? "disabled:bg-white/5 disabled:text-slate-600" : "disabled:bg-black/5 disabled:text-slate-400"}`}>{isDeleting ? "Eliminando..." : "Eliminar mi cuenta"}</button>
                </div>
                <Footer danger />
              </div>
            )}
          </section>
        </div>
      </div>

      {showDeactivateConfirm && (
        <div className={`fixed inset-0 ${overlayBg} backdrop-blur-xl flex items-center justify-center z-300 p-6 transition-colors duration-300`}>
          <div className="w-full max-w-md rounded-[2.5rem] p-10 border shadow-2xl text-center space-y-6 transition-colors" style={{ backgroundColor: cardBg, borderColor: theme === "dark" ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.4)" }}>
            <div className={`w-16 h-16 mx-auto rounded-full border flex items-center justify-center ${theme === "dark" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"}`}><Icons.Shield /></div>
            <div>
              <h3 className="text-xl font-black" style={{ color: textColor[theme] }}>¿Desactivar tu cuenta?</h3>
              <p className={`font-bold text-sm mt-3 leading-relaxed ${mutedText}`}>
                Tu perfil dejará de estar visible y se cerrará tu sesión ahora mismo. Si no vuelves a iniciar sesión dentro de <span className={theme === "dark" ? "text-amber-400" : "text-amber-600"}>30 días</span>, tu cuenta y todos tus datos se eliminarán permanentemente.
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowDeactivateConfirm(false)} disabled={isDeactivating} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border disabled:opacity-50 transition-colors" style={{ backgroundColor: subtleBg, borderColor, color: textColor[theme] }}>Cancelar</button>
              <button onClick={confirmDeactivateAccount} disabled={isDeactivating} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] disabled:opacity-50">{isDeactivating ? "Desactivando..." : "Sí, desactivar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NexoraProfileContent() {
  const { user } = useAuth();
  const theme = useThemeStore((state) => state.theme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);

  const cardBg = theme === "dark" ? "#111118" : "#ffffff";
  const borderColor = theme === "dark" ? "rgba(255,255,255,0.05)" : "#e4e4e7";
  const subtleBg = theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const mutedText = theme === "dark" ? "text-slate-500" : "text-slate-400";
  const overlayBg = theme === "dark" ? "bg-black/95" : "bg-white/90";

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
    first_name: "", last_name: "", username: "", city: "", phone: "", email: "", birth_date: "", about_me: "", website: "", disponibilidad: true,
  });

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (!user?.uid) return;
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setUserData(data);
      setEditData({
        first_name: data.first_name || "", last_name: data.last_name || "", username: data.username || "", city: data.city || "", phone: data.phone || "", email: data.email || user.email || "", birth_date: data.birth_date || "", about_me: data.about_me || "", website: data.website || "", disponibilidad: data.disponibilidad ?? true,
      });
    });
    const unsubOwnRequests = onSnapshot(query(collection(db, "solicitudes"), where("userId", "==", user.uid)), (snap) => setRawOwnRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubReviews = onSnapshot(query(collection(db, "reviews"), where("targetUserId", "==", user.uid)), (snap) => setRawResenas(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubPortfolio = onSnapshot(query(collection(db, "portfolio"), where("userId", "==", user.uid)), (snap) => setRawPortfolio(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => { unsubUser(); unsubOwnRequests(); unsubReviews(); unsubPortfolio(); };
  }, [user?.uid, user?.email]);

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;
    const registerSession = async () => {
      try {
        const sessionRef = doc(db, "sessions", sessionId);
        const existing = await getDoc(sessionRef);
        const device = detectDevice();
        const location = await detectLocation();
        if (cancelled) return;
        if (existing.exists()) await updateDoc(sessionRef, { lastActive: serverTimestamp() });
        else await setDoc(sessionRef, { userId: user.uid, device, location, createdAt: serverTimestamp(), lastActive: serverTimestamp() });
      } catch {}
    };
    registerSession();
    const heartbeat = setInterval(() => { updateDoc(doc(db, "sessions", sessionId), { lastActive: serverTimestamp() }).catch(() => {}); }, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(heartbeat); };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || !userData) return;
    if (!isWorkerRole(userData.rol) && !isAdminRole(userData.rol)) return;
    const unsubAll = onSnapshot(collection(db, "solicitudes"), (snap) => setRawAllRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), () => setRawAllRequests([]));
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

  const resenas = useMemo(() => [...rawResenas].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)), [rawResenas]);
  const portfolio = useMemo(() => [...rawPortfolio].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)), [rawPortfolio]);
  const serviciosCliente = useMemo(() => rawOwnRequests.filter((t) => t.tipo !== "solicitud_trabajador").sort((a, b) => ((b.creadoEn || b.fecha)?.seconds || 0) - ((a.creadoEn || a.fecha)?.seconds || 0)), [rawOwnRequests]);
  const trabajosTrabajador = useMemo(() => rawAllRequests.filter((t) => t.tipo !== "solicitud_trabajador").filter((t) => (t.postulantes || []).some((p) => getWorkerIdFromPostulante(p) === user?.uid)).sort((a, b) => ((b.creadoEn || b.fecha)?.seconds || 0) - ((a.creadoEn || a.fecha)?.seconds || 0)), [rawAllRequests, user?.uid]);
  const adminSolicitudes = useMemo(() => rawAllRequests.filter((t) => t.tipo !== "solicitud_trabajador").sort((a, b) => ((b.creadoEn || b.fecha)?.seconds || 0) - ((a.creadoEn || a.fecha)?.seconds || 0)), [rawAllRequests]);

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
    if (isAdmin) return [{ value: adminSolicitudes.length, label: "Solicitudes" }, { value: rawAllRequests.filter((r) => r.tipo === "solicitud_trabajador").length, label: "Verificaciones" }, { value: resenas.length, label: "Reseñas" }, { value: roleLabel, label: "Rol", icon: <Icons.Award /> }];
    return [{ value: mainItems.length, label: mainLabel }, { value: reputacion.score, label: "Valoración" }, { value: tasaExito, label: "Éxito" }, { value: roleLabel, label: "Rol", icon: <Icons.Award /> }];
  }, [isAdmin, adminSolicitudes, rawAllRequests, resenas, roleLabel, mainItems, mainLabel, reputacion, tasaExito]);

  useEffect(() => {
    if (!userData) return;
    const firstTab = isWorker ? "Trabajos" : isAdmin ? "Solicitudes" : "Servicios";
    setActiveTab(firstTab);
  }, [isWorker, isAdmin, userData]);

  const handleSaveSettings = async () => {
    if (!user?.uid) return;
    if (editData.website && !isValidWebsite(editData.website)) return showToast("El sitio web no es una URL válida", "error");
    try { setIsSaving(true); await updateDoc(doc(db, "users", user.uid), editData); showToast("Perfil actualizado"); setShowSettings(false); } catch { showToast("Error al guardar", "error"); } finally { setIsSaving(false); }
  };

  const createZoomedImage = useCallback(() => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 500;
        canvas.width = size; canvas.height = size;
        const scale = Math.max(size / img.width, size / img.height) * zoom;
        const width = img.width * scale; const height = img.height * scale;
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
      showToast("Foto actualizada"); setShowEditModal(false);
    } catch { showToast("Error al subir", "error"); } finally { setUploading(false); }
  };

  const tabs = isAdmin ? ["Solicitudes", "Reseñas", "Sobre mí"] : isWorker ? ["Trabajos", "Reseñas", "Sobre mí", "Portfolio"] : ["Servicios", "Reseñas", "Sobre mí"];

  if (!userData) return <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ background: background[theme] }}><div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="w-full min-h-screen font-sans selection:bg-[#6c63ff]/30 transition-colors duration-300" style={{ background: background[theme], color: textColor[theme] }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20 space-y-10">
        <div className="rounded-[2.5rem] p-10 border shadow-2xl transition-colors" style={{ backgroundColor: cardBg, borderColor }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-[#6c63ff] shrink-0 shadow-2xl border-4" style={{ borderColor }}>
              {userData.photoURL ? <img src={userData.photoURL} alt="perfil" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl font-black uppercase text-white">{avatarInitials}</div>}
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-4xl font-black tracking-tight" style={{ color: textColor[theme] }}>{displayName}</h1>
                <span className="flex items-center gap-2 bg-[#6c63ff]/10 text-[#6c63ff] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#6c63ff]/20"><Icons.Check /> Verificado</span>
              </div>
              <div className={`flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold uppercase tracking-widest transition-colors ${mutedText}`}>
                <span className="flex items-center gap-2"><Icons.MapPin /> {userData.city || "Sin ciudad"}</span>
                {!isAdmin && (
                  <span className={`flex items-center gap-2 ${userData.disponibilidad ? (theme === "dark" ? "text-emerald-400" : "text-emerald-600") : (theme === "dark" ? "text-red-400" : "text-red-600")}`}>
                    <div className={`w-2 h-2 rounded-full ${userData.disponibilidad ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                    {userData.disponibilidad ? "Disponible ahora" : "No disponible"}
                  </span>
                )}
                <span className="flex items-center gap-2 text-amber-400"><Icons.Star fill="currentColor" /> {reputacion.score} ({reputacion.count} reseñas)</span>
              </div>
              <p className={`text-lg leading-relaxed max-w-2xl font-medium italic transition-colors ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                "{userData.about_me || (isWorker ? "Trabajador profesional en Nexora." : isAdmin ? "Administrador de la plataforma Nexora." : "Cliente en Nexora.")}"
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {isWorker ? (
                <><button className="bg-[#6c63ff] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#6c63ff]/20">Ver disponibilidad</button><button className="px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all" style={{ backgroundColor: subtleBg, borderColor, color: textColor[theme] }}>Mensaje</button></>
              ) : isAdmin ? (
                <><button className="bg-[#6c63ff] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#6c63ff]/20">Panel Admin</button><button className="px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all" style={{ backgroundColor: subtleBg, borderColor, color: textColor[theme] }}>Auditoría</button></>
              ) : (
                <><button className="bg-[#6c63ff] text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#6c63ff]/20">Publicar servicio</button><button className="px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all" style={{ backgroundColor: subtleBg, borderColor, color: textColor[theme] }}>Mensajes</button></>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="rounded-4xl p-8 text-center border transition-all hover:border-[#6c63ff]/30" style={{ backgroundColor: cardBg, borderColor }}>
              <p className="text-4xl font-black tracking-tighter truncate" title={String(value)} style={{ color: textColor[theme] }}>{value}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5 ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}>{icon}{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-8">
            <div className="rounded-[2.5rem] p-8 border transition-colors" style={{ backgroundColor: cardBg, borderColor }}>
              <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2 ${mutedText}`}><Icons.Briefcase /> Información</h2>
              <div className="space-y-6 text-sm font-bold">
                <div className="flex justify-between border-b pb-4" style={{ borderColor }}><span className={mutedText}>Ciudad</span><span className="font-black" style={{ color: textColor[theme] }}>{userData.city || "No especificada"}</span></div>
                <div className="flex justify-between border-b pb-4" style={{ borderColor }}><span className={mutedText}>Teléfono</span><span className="font-black" style={{ color: textColor[theme] }}>{userData.phone || "No especificado"}</span></div>
                <div className="flex justify-between border-b pb-4" style={{ borderColor }}><span className={mutedText}>Email</span><span className="font-black truncate max-w-40" style={{ color: textColor[theme] }}>{userData.email || user?.email || "No especificado"}</span></div>
                {userData.website && (
                  <div className="flex justify-between border-b pb-4" style={{ borderColor }}><span className={mutedText}>Sitio web</span><a href={userData.website.startsWith("http") ? userData.website : `https://${userData.website}`} target="_blank" rel="noopener noreferrer" className="text-[#6c63ff] font-black truncate max-w-40 hover:underline">{userData.website.replace(/^https?:\/\//, "")}</a></div>
                )}
                <div className="flex justify-between"><span className={mutedText}>Rol</span><span className="text-[#6c63ff] uppercase font-black">{roleLabel}</span></div>
              </div>
            </div>

            <div className="rounded-[2.5rem] p-8 border transition-colors" style={{ backgroundColor: cardBg, borderColor }}>
              <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}><Icons.Shield /> Estado Nexora</h2>
              <div className={`space-y-3 text-xs font-bold ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                {["Identidad verificada", isWorker ? "Perfil visible para clientes" : isAdmin ? "Permisos administrativos activos" : "Cuenta lista para publicar servicios", "Protección de pagos activa"].map((item) => (
                  <div key={item} className={`flex items-center gap-2 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}><Icons.Check /> {item}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="flex p-2 rounded-2xl border gap-2 overflow-x-auto transition-colors" style={{ backgroundColor: cardBg, borderColor }}>
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-fit px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? "bg-[#6c63ff] text-white shadow-xl" : `${mutedText} hover:bg-black/5 dark:hover:bg-white/5`}`}>{tab}</button>
              ))}
            </div>

            <div className="min-h-75">
              {(activeTab === "Trabajos" || activeTab === "Servicios" || activeTab === "Solicitudes") && (
                <div className="space-y-6">
                  {mainItems.length > 0 ? (
                    mainItems.map((item) => {
                      const workerStatus = isWorker ? getWorkerStatusFromRequest(item, user?.uid) : null;
                      const status = workerStatus || item.estado || "Publicado";
                      return (
                        <div key={item.id} className="rounded-[2.5rem] p-8 border hover:border-[#6c63ff]/30 transition-all group" style={{ backgroundColor: cardBg, borderColor }}>
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <h3 className="text-xl font-black group-hover:text-[#6c63ff] transition-colors min-w-0 wrap-break-word" style={{ color: textColor[theme] }}>{getRequestTitle(item)}</h3>
                            <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest border px-4 py-1.5 rounded-full ${theme === "dark" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" : "text-emerald-600 border-emerald-300 bg-emerald-50"}`}>{status}</span>
                          </div>
                          <p className={`leading-relaxed mb-6 italic transition-colors ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>"{item.descripcion || item.detalle || "Sin descripción"}"</p>
                          <div className={`text-[10px] font-black uppercase tracking-widest flex flex-wrap items-center gap-4 transition-colors ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}>
                            <span className="flex items-center gap-2"><Icons.Calendar /> {toDateLabel(getRequestDate(item))}</span>
                            {item.precio && <span>{item.precio}</span>}
                            {item.distrito && <span>{item.distrito}</span>}
                          </div>
                        </div>
                      );
                    })
                  ) : <div className="rounded-[2.5rem] p-20 text-center border opacity-60 font-black uppercase tracking-[0.3em] text-[10px] transition-colors" style={{ backgroundColor: cardBg, borderColor, color: textColor[theme] }}>{emptyMainLabel}</div>}
                </div>
              )}

              {activeTab === "Reseñas" && (
                <div className="space-y-6">
                  {resenas.length > 0 ? (
                    resenas.map((r) => (
                      <div key={r.id} className="rounded-[2.5rem] p-8 border transition-colors" style={{ backgroundColor: cardBg, borderColor }}>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex text-amber-400 gap-1">{[...Array(5)].map((_, i) => <Icons.Star key={i} fill={i < Number(r.rating || 0) ? "currentColor" : "none"} />)}</div>
                          <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${theme === "dark" ? "text-slate-600" : "text-slate-400"}`}><Icons.Calendar /> {toDateLabel(r.timestamp)}</span>
                        </div>
                        <p className="text-lg font-medium italic mb-4 transition-colors" style={{ color: textColor[theme] }}>{r.comment || "Sin comentario"}</p>
                        <p className="text-[10px] font-black text-[#6c63ff] uppercase tracking-widest">— {r.authorName || "Usuario Nexora"}</p>
                      </div>
                    ))
                  ) : <div className="rounded-[2.5rem] p-20 text-center border opacity-60 font-black uppercase tracking-[0.3em] text-[10px] transition-colors" style={{ backgroundColor: cardBg, borderColor, color: textColor[theme] }}>Sin reseñas aún</div>}
                </div>
              )}

              {activeTab === "Sobre mí" && (
                <div className="rounded-[2.5rem] p-12 border transition-colors" style={{ backgroundColor: cardBg, borderColor }}>
                  <h3 className="text-2xl font-black mb-6" style={{ color: textColor[theme] }}>Biografía</h3>
                  <p className={`text-xl leading-relaxed italic font-medium transition-colors ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>"{userData.about_me || "Este usuario todavía no agregó una biografía."}"</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                    <div className="border rounded-2xl p-5 transition-colors" style={{ backgroundColor: subtleBg, borderColor }}>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${mutedText}`}>Especialidad</p>
                      <p className="font-black" style={{ color: textColor[theme] }}>{isWorker ? "Trabajador independiente" : isAdmin ? "Administración Nexora" : "Cliente Nexora"}</p>
                    </div>
                    <div className="border rounded-2xl p-5 transition-colors" style={{ backgroundColor: subtleBg, borderColor }}>
                      <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${mutedText}`}>Disponibilidad</p>
                      <p className="font-black" style={{ color: textColor[theme] }}>{userData.disponibilidad ? "Disponible" : "No disponible"}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Portfolio" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {portfolio.length > 0 ? (
                    portfolio.map((p) => (
                      <div key={p.id} className="rounded-[2.5rem] overflow-hidden border group hover:border-[#6c63ff]/30 transition-all" style={{ backgroundColor: cardBg, borderColor }}>
                        <div className="aspect-video overflow-hidden" style={{ backgroundColor: subtleBg }}>
                          <img src={p.imageUrl} alt={p.title || "portfolio"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-8"><h4 className="text-lg font-black uppercase tracking-widest" style={{ color: textColor[theme] }}>{p.title || "Proyecto"}</h4></div>
                      </div>
                    ))
                  ) : <div className="col-span-full rounded-[2.5rem] p-20 text-center border opacity-60 font-black uppercase tracking-[0.3em] text-[10px] transition-colors" style={{ backgroundColor: cardBg, borderColor, color: textColor[theme] }}>Portfolio vacío</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <button onClick={() => setShowSettings(true)} className="fixed bottom-10 right-10 bg-[#6c63ff] p-5 rounded-4xl shadow-2xl hover:scale-110 transition-all z-50 group text-white">
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
          showToast={showToast}
          onPhotoSelected={(e) => {
            const file = e.target.files?.[0];
            if (file) { setTempPreview(URL.createObjectURL(file)); setSelectedFile(file); setShowEditModal(true); }
          }}
        />
      )}

      {showEditModal && tempPreview && (
        <div className={`fixed inset-0 ${overlayBg} backdrop-blur-xl flex items-center justify-center z-200 p-6 transition-colors duration-300`}>
          <div className="w-full max-w-lg rounded-[3rem] p-10 border relative shadow-2xl transition-colors" style={{ backgroundColor: cardBg, borderColor }}>
            <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-center" style={{ color: textColor[theme] }}>Ajustar Foto</h2>
            <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-[#6c63ff] mb-8" style={{ backgroundColor: subtleBg }}>
              <img src={tempPreview} alt="perfil" style={{ transform: `scale(${zoom})` }} className="w-full h-full object-cover transition-transform" />
            </div>
            <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#6c63ff] mb-8" style={{ backgroundColor: subtleBg }} />
            <div className="flex gap-4">
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-colors" style={{ backgroundColor: subtleBg, color: textColor[theme] }}>Cancelar</button>
              <button onClick={handleApplyImage} disabled={uploading} className="flex-1 bg-[#6c63ff] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] disabled:opacity-50">{uploading ? "Subiendo..." : "Aplicar"}</button>
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