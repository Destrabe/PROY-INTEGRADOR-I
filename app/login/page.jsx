"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/db";
import { loginUser, loginWithGoogle, loginWithFacebook } from "@/firebase/auth";
import { useAuth } from "@/components/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      const user = await loginWithGoogle();
      login({
        uid: user.uid,
        email: user.email,
        first_name: user.displayName || "",
        last_name: "",
        rol: "cliente",
      });
      router.push("/");
    } catch (error) {
      console.log("GOOGLE ERROR:", error);
      setError("Error al iniciar sesión con Google.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setError("");
      const user = await loginWithFacebook();
      login({
        uid: user.uid,
        email: user.email,
        first_name: user.displayName || "",
        last_name: "",
        rol: "cliente",
      });

      router.push("/");
    } catch (error) {
      console.log("FACEBOOK ERROR:", error);
      if (error.code === "auth/account-exists-with-different-credential") {
        setError(
          "Ya existe una cuenta con este correo asociada a otro proveedor.",
        );
      } else {
        setError("Error al iniciar sesión con Facebook.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const firebaseUser = await loginUser(email, password);
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const data = userDoc.exists() ? userDoc.data() : {};

      const rolReal = data.rol || "cliente";
      const esAdmin = rolReal === "admin";

      if (tipo === "admin" && !esAdmin) {
        setError("No tienes permisos");
        setLoading(false);
        return;
      }

      login({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        rol: rolReal,
      });

      router.push(esAdmin ? "/admin/dashboard" : "/FeedTrabajos");
    } catch (err) {
      const messages = {
        "auth/user-not-found": "No existe una cuenta con ese correo.",
        "auth/wrong-password": "Contraseña incorrecta.",
        "auth/invalid-credential": "Correo o contraseña incorrectos.",
        "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
      };
      setError(messages[err.code] || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0A0A0F] font-body text-[#f0f0f5] relative overflow-hidden selection:bg-[#635bff]/30">
      {/* Luces de fondo (Efecto Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#635bff]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#9b59b6]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[480px] animate-[cardIn_0.5s_cubic-bezier(0.22,1,0.36,1)_both] z-10">
        {/* Card Principal */}
        <div className="rounded-2xl p-6 sm:p-8 bg-[#111118] border border-[#2A2A38] shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
          <h1 className="font-extrabold text-2xl sm:text-3xl mb-1 text-center font-display text-[#F0F0F8] tracking-tight">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-center mb-6 text-[#9090A8]">
            Inicia sesión en tu cuenta
          </p>

          {/* Campo Email */}
          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm font-bold text-[#9090A8] font-body">
              Correo electrónico
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606078]">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full h-[52px] pl-9 pr-4 py-3 bg-[#22222C] border-2 border-white/10 rounded-xl text-sm font-light text-[#F0F0F8] outline-none placeholder:text-[#5a5a6a] transition-all duration-200 focus:border-[#635bff]/60 focus:bg-[#1a1a22] focus:shadow-[0_0_0_3px_rgba(99,91,255,0.12)] font-body"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm font-bold text-[#9090A8] font-body">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606078]">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full h-[52px] pl-9 pr-4 py-3 bg-[#22222C] border-2 border-white/10 rounded-xl text-sm font-light text-[#F0F0F8] outline-none placeholder:text-[#5a5a6a] transition-all duration-200 focus:border-[#635bff]/60 focus:bg-[#1a1a22] focus:shadow-[0_0_0_3px_rgba(99,91,255,0.12)] font-body"
              />
            </div>
          </div>

          {/* Opciones extras (Recordarme / Recuperar) */}
          <div className="flex items-center justify-between mb-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                className="w-4 h-4 rounded accent-[#6C63FF] bg-[#1A1A28] border-[#2A2A38]"
              />
              <span className="text-sm text-[#9090A8] group-hover:text-[#F0F0F8] transition-colors font-body">
                Recordarme
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-bold text-[#6C63FF] hover:text-[#7b75ff] transition-colors font-body"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Alerta de Error */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-4 bg-red-500/10 py-2.5 px-4 rounded-xl border border-red-500/20">
              {error}
            </p>
          )}

          {/* Botón Iniciar Sesión */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-[52px] rounded-xl text-sm font-bold text-white transition-all duration-200 bg-gradient-to-br from-[#6C63FF] to-[#9B59B6] hover:shadow-[0_0_32px_rgba(99,91,255,0.4)] hover:-translate-y-[1px] active:translate-y-0 disabled:pointer-events-none disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer font-body"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          {/* Divisor */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#2A2A38]" />
            <span className="text-xs text-[#606078] uppercase tracking-wider font-semibold">
              O continúa con
            </span>
            <div className="flex-1 h-px bg-[#2A2A38]" />
          </div>

          {/* Botones de Proveedores (Oauth) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#1A1A28] border border-[#2A2A38] text-[#F0F0F8] hover:border-[#6C63FF] cursor-pointer font-body"
            >
              <Image
                src="/svg/google.svg"
                alt="Google"
                className="object-contain"
                width={16}
                height={16}
              />
              Google
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#1A1A28] border border-[#2A2A38] text-[#F0F0F8] hover:border-[#6C63FF] cursor-pointer font-body"
            >
              <Image
                src="/svg/facebook.svg"
                alt="facebook"
                className="object-contain"
                width={16}
                height={16}
              />
              Facebook
            </button>
          </div>

          {/* Enlace de Registro */}
          <p className="text-sm text-center text-[#9090A8] font-body font-black">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="text-[#6C63FF] hover:text-[#7b75ff] transition-colors font-black"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
