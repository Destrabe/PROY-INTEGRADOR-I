"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [solicitudes, setSolicitudes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (user.rol !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("USUARIOS =>", data);
      setUsuarios(data);
    });

    const unsubscribeSolicitudes = onSnapshot(
      collection(db, "solicitudes"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("SOLICITUDES =>", data);
        setSolicitudes(data);
      },
    );

    return () => {
      unsubscribeUsers();
      unsubscribeSolicitudes();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <h1 className="text-4xl font-bold">Panel de Administración</h1>

        <p className="text-gray-400 mt-2">Bienvenido {user?.first_name}</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-[#15151D] p-6 rounded-2xl">
            <h3 className="text-gray-400">Usuarios</h3>
            <p className="text-4xl font-bold mt-2">{usuarios.length}</p>
          </div>

          <div className="bg-[#15151D] p-6 rounded-2xl">
            <h3 className="text-gray-400">Solicitudes</h3>
            <p className="text-4xl font-bold mt-2">{solicitudes.length}</p>
          </div>

          <div className="bg-[#15151D] p-6 rounded-2xl">
            <h3 className="text-gray-400">Proyectos</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>

          <div className="bg-[#15151D] p-6 rounded-2xl">
            <h3 className="text-gray-400">Ingresos</h3>
            <p className="text-4xl font-bold mt-2">S/0</p>
          </div>
        </div>

        {/* Solicitudes */}
        <div className="bg-[#15151D] rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Solicitudes Recientes</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="pb-4">Usuario</th>
                  <th className="pb-4">Servicio</th>
                  <th className="pb-4">Estado</th>
                  <th className="pb-4">Fecha</th>
                </tr>
              </thead>

              <tbody>
                {solicitudes.map((s) => (
                  <tr key={s.id} className="border-b border-white/5">
                    <td className="py-4">{s.nombre}</td>

                    <td>{s.servicio}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          s.estado === "Aprobado"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {s.estado}
                      </span>
                    </td>

                    <td>{s.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actividad */}
        <div className="bg-[#15151D] rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Usuarios Registrados</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left pb-4">Nombre</th>
                <th className="text-left pb-4">Email</th>
                <th className="text-left pb-4">Rol</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="py-4">
                    {u.first_name} {u.last_name}
                  </td>

                  <td>{u.email}</td>

                  <td>
                    <span className="bg-[#6c63ff]/20 text-[#6c63ff] px-3 py-1 rounded-full">
                      {u.rol}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[#15151D] rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Actividad en Tiempo Real</h2>

          <div className="space-y-3">
            {usuarios.slice(0, 5).map((u) => (
              <div key={u.id} className="bg-[#1D1D28] p-4 rounded-xl">
                Nuevo usuario: {u.first_name} {u.last_name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
