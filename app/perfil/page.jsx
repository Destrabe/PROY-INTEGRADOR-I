"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function PerfilPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-10">
      <div className="max-w-2xl mx-auto bg-[#111118] border border-[#2A2A38] rounded-3xl p-8">
        
        <h1
          className="text-3xl font-extrabold mb-6"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Mi Perfil
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-[#9090A8] text-sm">Nombre</p>
            <h2 className="text-xl font-bold">
              {user?.name || "Usuario"}
            </h2>
          </div>

          <div>
            <p className="text-[#9090A8] text-sm">Correo</p>
            <h2 className="text-lg">
              {user?.email || "Sin correo"}
            </h2>
          </div>

          <div>
            <p className="text-[#9090A8] text-sm">Rol</p>
            <h2 className="text-lg capitalize">
              {user?.rol || "cliente"}
            </h2>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/trabajador"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #A855F7, #6366F1)",
            }}
          >
            ¡Únete como Trabajador!
          </Link>
        </div>
      </div>
    </div>
  );
}