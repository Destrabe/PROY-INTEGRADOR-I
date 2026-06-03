"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/db";
import { loginUser, loginWithGoogle, loginWithFacebook } from "../authService";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [tipo, setTipo] = useState("usuario");
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

      router.push("/FeedTrabajos");
    } catch (error) {
      console.log("GOOGLE ERROR:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setError("");

      const user = await handleFacebookLogin();

      login({
        uid: user.uid,
        email: user.email,
        first_name: user.displayName || "",
        last_name: "",
        rol: "cliente",
      });

      router.push("/FeedTrabajos");
    } catch (error) {
      console.log("GITHUB ERROR:", error);
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
        setError("No tienes permisos de administrador.");
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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#0A0A0F" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 font-extrabold text-white text-lg"
            style={{
              background: "linear-gradient(135deg, #6C63FF, #9B59B6)",
              fontFamily: "Syne, sans-serif",
            }}
          >
            N
          </div>
          <span
            className="font-extrabold text-xl"
            style={{ fontFamily: "Syne, sans-serif", color: "#6C63FF" }}
          >
            Nexora
          </span>
        </div>

        {/* Card */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="rounded-2xl p-8"
          style={{ background: "#111118", border: "1px solid #2A2A38" }}
        >
          <h1
            className="font-extrabold text-2xl mb-1 text-center"
            style={{ fontFamily: "Syne, sans-serif", color: "#F0F0F8" }}
          >
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-center mb-6" style={{ color: "#9090A8" }}>
            Inicia sesión en tu cuenta
          </p>

          {/* Tipo de cuenta */}
          <div className="mb-5">
            <label
              className="text-xs font-semibold mb-2 block"
              style={{ color: "#9090A8" }}
            >
              Tipo de cuenta
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipo("usuario")}
                className="flex flex-col items-center gap-2 py-4 rounded-xl border transition-all cursor-pointer"
                style={{
                  background: tipo === "usuario" ? "#6C63FF22" : "#1A1A28",
                  borderColor: tipo === "usuario" ? "#6C63FF" : "#2A2A38",
                  color: tipo === "usuario" ? "#fff" : "#9090A8",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-sm font-bold">Usuario</span>
              </button>

              <button
                type="button"
                onClick={() => setTipo("admin")}
                className="flex flex-col items-center gap-2 py-4 rounded-xl border transition-all cursor-pointer"
                style={{
                  background: tipo === "admin" ? "#6C63FF22" : "#1A1A28",
                  borderColor: tipo === "admin" ? "#6C63FF" : "#2A2A38",
                  color: tipo === "admin" ? "#fff" : "#9090A8",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-sm font-bold">Administrador</span>
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              className="text-xs font-semibold mb-2 block"
              style={{ color: "#9090A8" }}
            >
              Correo electrónico
            </label>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#606078" }}
              >
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
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A38",
                  color: "#F0F0F8",
                  fontFamily: "DM Sans, sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
                onBlur={(e) => (e.target.style.borderColor = "#2A2A38")}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <label
              className="text-xs font-semibold mb-2 block"
              style={{ color: "#9090A8" }}
            >
              Contraseña
            </label>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#606078" }}
              >
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
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A38",
                  color: "#F0F0F8",
                  fontFamily: "DM Sans, sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
                onBlur={(e) => (e.target.style.borderColor = "#2A2A38")}
              />
            </div>
          </div>

          {/* Recordarme + olvidé */}
          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                className="w-4 h-4 rounded accent-[#6C63FF]"
              />
              <span className="text-sm" style={{ color: "#9090A8" }}>
                Recordarme
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm"
              style={{ color: "#6C63FF" }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all mb-4 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #6C63FF, #9B59B6)",
              fontFamily: "DM Sans, sans-serif",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Iniciando sesión...
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          {/* Divisor */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: "#2A2A38" }} />
            <span className="text-xs" style={{ color: "#606078" }}>
              O continúa con
            </span>
            <div className="flex-1 h-px" style={{ background: "#2A2A38" }} />
          </div>

          {/* Google / GitHub */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              style={{
                background: "#1A1A28",
                border: "1px solid #2A2A38",
                color: "#F0F0F8",
                fontFamily: "DM Sans, sans-serif",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#6C63FF")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#2A2A38")
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
              style={{
                background: "#1A1A28",
                border: "1px solid #2A2A38",
                color: "#F0F0F8",
                fontFamily: "DM Sans, sans-serif",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#6C63FF")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#2A2A38")
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.009 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.082 24 18.092 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Registro */}
          <p className="text-sm text-center" style={{ color: "#9090A8" }}>
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              style={{ color: "#6C63FF", fontWeight: 600 }}
            >
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
