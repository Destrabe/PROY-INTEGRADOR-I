"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/app/hooks/useUserRole";
import {
  collection, getDocs, doc, updateDoc, deleteDoc, query,
  where, orderBy, limit, startAfter,
} from "firebase/firestore";
import { db } from "@/firebase/db";

export default function AdministratorPage() {
  const { user, rol, loading } = useUserRole();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("workers");
  const [lastAppDoc, setLastAppDoc] = useState(null);
  const [lastReportDoc, setLastReportDoc] = useState(null);
  const [hayMasApps, setHayMasApps] = useState(false);
  const [hayMasReports, setHayMasReports] = useState(false);
  const PAGE_SIZE = 20;
  
  const fetchApplications = async (ultimo = null) => {
    const base = query(
      collection(db, "worker_applications"),
      where("estado", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE + 1)
    );

    const q = ultimo ? query(base, startAfter(ultimo)) : base;
    const snap = await getDocs(q);
    const docs = snap.docs;

    setHayMasApps(docs.length > PAGE_SIZE);
    const pagina = docs.slice(0, PAGE_SIZE);
    setLastAppDoc(pagina[pagina.length - 1] ?? null);

    const apps = pagina.map((d) => ({ id: d.id, ...d.data() }));

    if (ultimo) {
      setApplications((prev) => [...prev, ...apps]);
    } else {
      setApplications(apps);
    }
    setLoadingApps(false);
  };

  const fetchReports = async (ultimo = null) => {
    const base = query(
      collection(db, "reports"),
      where("resuelto", "==", false),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE + 1)
    );

    const q = ultimo ? query(base, startAfter(ultimo)) : base;
    const snap = await getDocs(q);
    const docs = snap.docs;

    setHayMasReports(docs.length > PAGE_SIZE);
    const pagina = docs.slice(0, PAGE_SIZE);
    setLastReportDoc(pagina[pagina.length - 1] ?? null);

    const data = pagina.map((d) => ({ id: d.id, ...d.data() }));

    if (ultimo) {
      setReports((prev) => [...prev, ...data]);
    } else {
      setReports(data);
    }
  };

  const approveApplication = async (app) => {
    const userRef = doc(db, "users", app.userId);
    await updateDoc(userRef, {
      rol: "trabajador",
      profesion: app.profesion,
      ambitos: app.ambitos,
      verificado: true,
      updatedAt: new Date(),
    });
    const appRef = doc(db, "worker_applications", app.id);
    await updateDoc(appRef, { estado: "approved" });
    fetchApplications(); // Recargar después de aprobar
  };

  const rejectApplication = async (app) => {
    const appRef = doc(db, "worker_applications", app.id);
    await updateDoc(appRef, { estado: "rejected" });
    fetchApplications();
  };

  const deleteSolicitud = async (solicitudId) => {
    if (confirm("¿Eliminar esta solicitud permanentemente?")) {
      await deleteDoc(doc(db, "solicitudes", solicitudId));
      alert("Solicitud eliminada");
      fetchReports();
    }
  };

  useEffect(() => {
    if (!loading && rol !== "admin") {
      router.push("/");
      return;
    }
    if (rol === "admin") {
      fetchApplications();
      fetchReports();
    }
  }, [rol, loading, fetchApplications, fetchReports]);

  if (loading || loadingApps) {
    return <div className="p-10 text-center" style={{ color: "var(--text-main)" }}>Cargando panel...</div>;
  }

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: "var(--bg-main)", color: "var(--text-main)" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6" style={{ fontFamily: "var(--font-syne), sans-serif" }}>Panel de Administración</h1>

        <div className="flex gap-4 border-b mb-6" style={{ borderColor: "var(--border-color)" }}>
          <button
            onClick={() => setActiveTab("workers")}
            className={`pb-2 px-4 ${activeTab === "workers" ? "border-b-2 border-[var(--accent)] text-[var(--accent)]" : "text-[var(--text-secondary)]"}`}
          >
            Solicitudes de trabajador
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-2 px-4 ${activeTab === "reports" ? "border-b-2 border-[var(--accent)] text-[var(--accent)]" : "text-[var(--text-secondary)]"}`}
          >
            Reportes
          </button>
        </div>

        {activeTab === "workers" && (
          <>
            {applications.length === 0 && <p className="text-center py-10">No hay solicitudes pendientes.</p>}
            <div className="grid gap-6 md:grid-cols-2">
              {applications.map((app) => (
                <div key={app.id} className="rounded-xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                  <p><strong>Usuario ID:</strong> {app.userId}</p>
                  <p><strong>Profesión:</strong> {app.profesion}</p>
                  <p><strong>Ámbitos:</strong> {app.ambitos?.join(", ")}</p>
                  <p><strong>Experiencia:</strong> {app.experiencia} años</p>
                  <p><strong>Descripción:</strong> {app.descripcion}</p>
                  {app.cvUrl && (
                    <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                      Ver CV
                    </a>
                  )}
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => approveApplication(app)} className="btn-primary text-sm">Aprobar</button>
                    <button onClick={() => rejectApplication(app)} className="btn-secondary text-sm">Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
            {hayMasApps && (
              <div className="flex justify-center mt-6">
                <button onClick={() => fetchApplications(lastAppDoc)} className="btn-secondary">
                  Cargar más solicitudes
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "reports" && (
          <>
            {reports.length === 0 && <p className="text-center py-10">No hay reportes.</p>}
            <div className="grid gap-4">
              {reports.map((report) => (
                <div key={report.id} className="rounded-xl border p-4" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                  <p><strong>Solicitud ID:</strong> {report.solicitudId}</p>
                  <p><strong>Usuario:</strong> {report.userId}</p>
                  <p><strong>Motivo:</strong> {report.motivo}</p>
                  <p><strong>Fecha:</strong> {report.createdAt?.toDate().toLocaleString()}</p>
                  <button onClick={() => deleteSolicitud(report.solicitudId)} className="btn-secondary text-sm mt-2">
                    Eliminar solicitud
                  </button>
                </div>
              ))}
            </div>
            {hayMasReports && (
              <div className="flex justify-center mt-6">
                <button onClick={() => fetchReports(lastReportDoc)} className="btn-secondary">
                  Cargar más reportes
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}