"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-10">
      <h1 className="text-4xl font-bold mb-5">
        Panel de Administración
      </h1>

      <p>
        Bienvenido administrador {user?.name}
      </p>
    </div>
  );
}