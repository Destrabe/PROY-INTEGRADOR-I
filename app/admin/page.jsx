"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, app } from "@/firebase/client";
import { getAuth } from "firebase/auth";
import { eliminarUsuarioAdmin } from "@/firebase/admin";

// --- ICONOS SVG INLINE ---

const Icons = {
  Users: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  FileText: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  Clock: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Check: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Trash: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Search: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Download: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Eye: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Refresh: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
};

const ROLE_LABELS = {
  cliente: "Cliente",
  trabajador: "Trabajador",
  admin: "Admin",
};

const auth = getAuth(app);

const ROLE_COLORS = {
  cliente: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  trabajador: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  admin: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

// --- COMPONENTE TOAST (mismo diseño que profile/page.jsx) ---
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
    <div
      className={`fixed bottom-8 right-8 ${styles} border p-5 rounded-2xl flex items-center gap-4 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-2xl backdrop-blur-md`}
    >
      <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
      <p className="text-sm font-black uppercase tracking-widest">{message}</p>
    </div>
  );
}

// Componente Modal de Detalles
function SolicitudModal({ solicitud, onClose, onApprove, onReject, users }) {
  const [showPdf, setShowPdf] = useState(false);

  if (!solicitud) return null;

  const userRequest = users.find((u) => u.id === solicitud.userId);

  const downloadPDF = () => {
    if (!solicitud.cvUrl) return;
    const link = document.createElement("a");
    link.href = solicitud.cvUrl;
    link.download = `CV_${solicitud.nombre.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openImage = (imgUrl, index) => {
    const newTab = window.open();
    newTab.document.write(`
      <html>
        <head><title>Trabajo ${index + 1} - ${solicitud.nombre}</title></head>
        <body style="margin:0; background:#0A0A0F; display:flex; align-items:center; justify-content:center;">
          <img src="${imgUrl}" style="max-width:100%; max-height:100vh; object-fit:contain;" />
        </body>
      </html>
    `);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#111118] border border-white/10 w-full max-w-5xl max-h-[95vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header Modal */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#6c63ff] flex items-center justify-center font-black text-white uppercase overflow-hidden">
              {userRequest?.photoURL ? (
                <img
                  src={userRequest.photoURL}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{solicitud.nombre?.[0]}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {solicitud.nombre}
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {solicitud.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <Icons.X />
          </button>
        </div>

        {/* Contenido Modal */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8">
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6c63ff] mb-4">
                  Perfil Profesional
                </h3>
                <div className="bg-[#0A0A0F] p-8 rounded-4xl border border-white/5 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                        Profesión
                      </p>
                      <p className="text-white font-bold">
                        {solicitud.profesion}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                        Experiencia
                      </p>
                      <p className="text-white font-bold">
                        {solicitud.experiencia} Años
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">
                      Descripción
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.03]">
                      "{solicitud.descripcion}"
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6c63ff]">
                    Currículum Vitae
                  </h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowPdf(!showPdf)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                    >
                      <Icons.Eye /> {showPdf ? "Ocultar" : "Ver Vista Previa"}
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6c63ff] hover:underline"
                    >
                      <Icons.Download /> Descargar PDF
                    </button>
                  </div>
                </div>

                {solicitud.cvUrl ? (
                  <div className="space-y-4">
                    {showPdf ? (
                      <div className="w-full aspect-[1/1.4] bg-white rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <iframe
                          src={`${solicitud.cvUrl}#toolbar=0`}
                          className="w-full h-full border-none"
                          title="CV Viewer"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-6 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 font-black text-xs">
                            PDF
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Currículum_Vitae.pdf
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                              Documento Adjunto
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPdf(true)}
                          className="bg-white/5 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                          Abrir Visor
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-10 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">
                    No se adjuntó CV
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6c63ff] mb-4">
                  Fotos de Trabajos
                </h3>
                <div className="bg-[#0A0A0F] p-8 rounded-4xl border border-white/5 min-h-75">
                  {solicitud.imagenesUrls &&
                  solicitud.imagenesUrls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {solicitud.imagenesUrls.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => openImage(img, i)}
                          className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-[#6c63ff]/50 transition-all group cursor-pointer shadow-lg"
                        >
                          <img
                            src={img}
                            alt={`Trabajo ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <div className="text-center">
                              <Icons.Search />
                              <span className="text-white text-[8px] font-black uppercase tracking-widest block mt-1">
                                Ampliar
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-600 text-[10px] font-black uppercase tracking-widest">
                      Sin imágenes adjuntas
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-8 border-t border-white/5 bg-white/[0.02] flex gap-4">
          <button
            onClick={() => {
              onApprove(solicitud);
              onClose();
            }}
            className="flex-1 bg-emerald-500 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Icons.Check /> Aprobar Trabajador
          </button>
          <button
            onClick={() => {
              onReject(solicitud);
              onClose();
            }}
            className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Icons.X /> Rechazar Solicitud
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [solicitudes, setSolicitudes] = useState([]);
  const [users, setUsers] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
      else if (user.rol !== "admin") router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
      setLoading(false);
    });

    const qSolicitudes = query(
      collection(db, "solicitudes"),
      orderBy("fecha", "desc"),
    );
    const unsubSolicitudes = onSnapshot(qSolicitudes, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSolicitudes(data);
    });

    const qActividades = query(
      collection(db, "actividad"),
      orderBy("timestamp", "desc"),
    );
    const unsubActividades = onSnapshot(qActividades, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setActividades(data);
    });

    return () => {
      unsubUsers();
      unsubSolicitudes();
      unsubActividades();
    };
  }, []);

  const registrarActividad = async (mensaje, tipo = "info") => {
    try {
      await addDoc(collection(db, "actividad"), {
        mensaje,
        tipo,
        timestamp: serverTimestamp(),
        fecha: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error("Error al registrar actividad:", error);
    }
  };

  const handleApproveWorker = async (solicitud) => {
    try {
      await updateDoc(doc(db, "users", solicitud.userId), {
        rol: "trabajador",
      });
      await updateDoc(doc(db, "solicitudes", solicitud.id), {
        estado: "Aprobado",
      });
      await registrarActividad(
        `Aprobación: ${solicitud.nombre} es ahora Trabajador`,
        "update",
      );
      showToast(`${solicitud.nombre} aprobado.`);
    } catch (error) {
      showToast("Error al aprobar.", "error");
    }
  };

  const handleRejectWorker = async (solicitud) => {
    try {
      await updateDoc(doc(db, "solicitudes", solicitud.id), {
        estado: "Rechazado",
      });
      await registrarActividad(
        `Rechazo: Solicitud de ${solicitud.nombre}`,
        "delete",
      );
      showToast("Solicitud rechazada.");
    } catch (error) {
      showToast("Error al rechazar.", "error");
    }
  };

  const handleRoleChange = async (userId, userName, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { rol: newRole });
      await registrarActividad(
        `Cambio Rol: ${userName} a ${ROLE_LABELS[newRole]}`,
        "update",
      );
    } catch (error) {
      console.error("Error al cambiar rol:", error);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (
      !confirm(
        `¿Eliminar a ${userName}? Se borrará de Firestore y se inhabilitará su cuenta.`,
      )
    )
      return;
    try {
      if (!auth.currentUser) throw new Error("No hay sesión activa");
      const idToken = await auth.currentUser.getIdToken();
      await eliminarUsuarioAdmin(idToken, userId);
      await registrarActividad(
        `Eliminación: Usuario ${userName} eliminado e inhabilitado`,
        "delete",
      );
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "todos" || u.rol === roleFilter;
      const searchLower = search.toLowerCase();
      return (
        matchesRole &&
        (!search ||
          u.first_name?.toLowerCase().includes(searchLower) ||
          u.last_name?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower))
      );
    });
  }, [users, roleFilter, search]);

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      totalSolicitudes: solicitudes.length,
      clientes: users.filter((u) => u.rol === "cliente").length,
      trabajadores: users.filter((u) => u.rol === "trabajador").length,
      pendientes: solicitudes.filter((s) => s.estado === "pendiente").length,
    }),
    [users, solicitudes],
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#6c63ff]"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] text-slate-300 font-sans selection:bg-[#6c63ff]/30">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <SolicitudModal
        solicitud={selectedSolicitud}
        onClose={() => setSelectedSolicitud(null)}
        onApprove={handleApproveWorker}
        onReject={handleRejectWorker}
        users={users}
      />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20 space-y-12">
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-[#6c63ff] rounded-full animate-pulse shadow-[0_0_10px_#6c63ff]"></div>
            <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em] font-black">
              Control de Sistema en Tiempo Real
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "Usuarios Totales",
              value: stats.totalUsers,
              sub: `${stats.clientes} Clientes / ${stats.trabajadores} Trab.`,
              color: "border-blue-500/20 bg-blue-500/5",
              icon: <Icons.Users />,
            },
            {
              label: "Solicitudes",
              value: stats.totalSolicitudes,
              sub: "Historial completo",
              color: "border-purple-500/20 bg-purple-500/5",
              icon: <Icons.FileText />,
            },
            {
              label: "Pendientes",
              value: stats.pendientes,
              sub: "Por verificar",
              color: "border-amber-500/20 bg-amber-500/5",
              icon: <Icons.Clock />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`border ${item.color} p-10 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.03] relative overflow-hidden group`}
            >
              <div className="absolute right-8 top-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                {item.icon}
              </div>
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                {item.label}
              </h3>
              <p className="text-6xl font-black text-white mt-4 tracking-tighter">
                {item.value}
              </p>
              <p className="text-xs text-slate-500 mt-6 font-bold">
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            {/* Solicitudes Section */}
            <section className="bg-[#111118] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Solicitudes de Verificación
                  </h2>
                  <p className="text-[10px] text-amber-500 uppercase tracking-[0.2em] mt-2 font-bold">
                    Clientes que desean ser trabajadores
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Icons.Clock />
                </div>
              </div>
              <div className="divide-y divide-white/3">
                {solicitudes.filter((s) => s.estado === "pendiente").length ===
                0 ? (
                  <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                    No hay solicitudes pendientes
                  </div>
                ) : (
                  solicitudes
                    .filter((s) => s.estado === "pendiente")
                    .map((s) => (
                      <div
                        key={s.id}
                        className="p-10 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.01] transition-all gap-4 group/item"
                      >
                        <div
                          className="flex items-center gap-6 cursor-pointer"
                          onClick={() => setSelectedSolicitud(s)}
                        >
                          <div className="w-14 h-14 rounded-2xl bg-[#6c63ff] flex items-center justify-center font-black text-white uppercase overflow-hidden group-hover/item:scale-105 transition-transform">
                            {users.find((u) => u.id === s.userId)?.photoURL ? (
                              <img
                                src={
                                  users.find((u) => u.id === s.userId).photoURL
                                }
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{s.nombre?.[0]}</span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-black text-white group-hover/item:text-[#6c63ff] transition-colors">
                              {s.nombre}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                              {s.profesion} • {s.experiencia} años exp.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4 shrink-0">
                          <button
                            onClick={() => setSelectedSolicitud(s)}
                            className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                          >
                            <Icons.Eye /> Detalles
                          </button>
                          <button
                            onClick={() => handleApproveWorker(s)}
                            className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
                          >
                            <Icons.Check /> Aprobar
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </section>

            {/* Usuarios Section */}
            <section className="bg-[#111118] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-4">
                  <Icons.Users /> Gestión de Usuarios
                </h2>
                <div className="relative w-full md:w-80">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Icons.Search />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="bg-[#0A0A0F] border border-white/10 rounded-2xl pl-12 pr-8 py-4 text-sm focus:ring-2 focus:ring-[#6c63ff] outline-none w-full text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-black bg-white/2">
                    <tr>
                      <th className="px-10 py-8">Identidad</th>
                      <th className="px-10 py-8">Privilegios</th>
                      <th className="px-10 py-8 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/3">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-white/[0.01] transition-colors group"
                      >
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-[#6c63ff] flex items-center justify-center font-black text-white uppercase overflow-hidden">
                              {u.photoURL ? (
                                <img
                                  src={u.photoURL}
                                  alt="avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>
                                  {u.first_name?.[0]}
                                  {u.last_name?.[0]}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-white">
                                {u.first_name} {u.last_name}
                              </p>
                              <p className="text-xs text-slate-600">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${ROLE_COLORS[u.rol]}`}
                          >
                            {ROLE_LABELS[u.rol]}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                            <select
                              className="bg-[#0A0A0F] border border-white/10 rounded-xl text-[10px] px-4 py-2 text-white font-black cursor-pointer outline-none focus:border-[#6c63ff]"
                              value={u.rol}
                              onChange={(e) =>
                                handleRoleChange(
                                  u.id,
                                  u.first_name,
                                  e.target.value,
                                )
                              }
                            >
                              <option value="cliente">Cliente</option>
                              <option value="trabajador">Trabajador</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() => handleDelete(u.id, u.first_name)}
                              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Icons.Trash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Activity Section */}
          <div className="lg:col-span-4">
            <section className="bg-[#111118] border border-white/5 rounded-[3rem] p-10 sticky top-32 shadow-2xl h-fit max-h-[70vh] flex flex-col">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <Icons.Refresh /> Actividad Live
              </h2>
              <div className="flex-1 overflow-y-auto pr-4 space-y-6 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-white/3 custom-scrollbar">
                {actividades.length === 0 ? (
                  <div className="text-center py-10 opacity-30 text-[10px] font-black uppercase tracking-widest">
                    Esperando eventos...
                  </div>
                ) : (
                  actividades.map((act) => (
                    <div key={act.id} className="relative pl-12 group">
                      <div
                        className={`absolute left-0 top-1 w-8 h-8 rounded-lg border-4 border-[#111118] flex items-center justify-center shadow-lg z-10 ${act.tipo === "delete" ? "bg-red-500 text-white" : act.tipo === "update" ? "bg-blue-500 text-white" : "bg-[#6c63ff] text-white"}`}
                      >
                        {act.tipo === "delete" ? (
                          <Icons.Trash />
                        ) : act.tipo === "update" ? (
                          <Icons.Refresh />
                        ) : (
                          <Icons.Check />
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-300 leading-relaxed break-words">
                        {act.mensaje}
                      </p>
                      <p className="text-[9px] text-slate-600 mt-1 font-black uppercase tracking-widest">
                        {act.fecha}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
