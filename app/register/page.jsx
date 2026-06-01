"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  registerUser,
  loginUser,
  loginWithGoogle,
  loginWithFacebook,
} from "../authService";
import { useAuth } from "@/components/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [sended, setSended] = useState(false);
  const handleGoogleRegister = async () => {
    try {
      const user = await loginWithGoogle();

      login({
        uid: user.uid,
        email: user.email,
        first_name: user.displayName?.split(" ")[0] || "",
        last_name: user.displayName?.split(" ").slice(1).join(" ") || "",
        rol: "cliente",
      });

      router.push("/FeedTrabajos");
    } catch (error) {
      console.log("GOOGLE REGISTER ERROR:", error);
    }
  };

  const handleFacebookRegister = async () => {
    try {
      const user = await loginWithFacebook();

      login({
        uid: user.uid,
        email: user.email,
        first_name: user.displayName || "",
        last_name: "",
        rol: "cliente",
      });

      router.push("/FeedTrabajos");
    } catch (error) {
      console.log("FACEBOOK REGISTER ERROR:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setSended(true);

    console.log("firstName:", firstName);
    console.log("lastName:", lastName);
    console.log("email:", email);
    console.log("password:", password);
    console.log("confirmPassword:", confirmPassword);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      alert("Completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    const rol = "cliente";

    try {
      const result = await registerUser(
        email,
        password,
        firstName,
        lastName,
        rol,
      );

      if (result.success) {
        const firebaseUser = await loginUser(email, password);

        login({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          first_name: firstName,
          last_name: lastName,
          rol: "cliente",
        });

        router.push("/");
      } else {
        if (result.error?.code === "auth/email-already-in-use") {
          alert("El correo ya está registrado");
        } else {
          alert("Error al crear la cuenta");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado");
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
        {/* LOGO */}
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
            style={{
              fontFamily: "Syne, sans-serif",
              color: "#6C63FF",
            }}
          >
            Nexora
          </span>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleRegister}
          className="rounded-2xl p-8"
          style={{
            background: "#111118",
            border: "1px solid #2A2A38",
          }}
        >
          <h1
            className="font-extrabold text-3xl mb-2 text-center text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Crear cuenta
          </h1>

          <p className="text-center mb-7" style={{ color: "#9090A8" }}>
            Únete a nuestra comunidad
          </p>

          {/* NOMBRES */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#F0F0F8" }}
            >
              Nombres
            </label>

            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#606078" }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
                style={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A38",
                  color: "#fff",
                }}
              />
            </div>
          </div>

          {/* APELLIDOS */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#F0F0F8" }}
            >
              Apellidos
            </label>

            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#606078" }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
                style={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A38",
                  color: "#fff",
                }}
              />
            </div>
          </div>

          {/* CORREO */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#F0F0F8" }}
            >
              Correo electrónico
            </label>

            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#606078" }}
              >
                <svg
                  width="18"
                  height="18"
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
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
                style={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A38",
                  color: "#fff",
                }}
              />
            </div>
          </div>

          {/* CONTRASEÑA */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#F0F0F8" }}
            >
              Contraseña
            </label>

            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#606078" }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
                style={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A38",
                  color: "#fff",
                }}
              />
            </div>

            {sended && password.length < 8 && (
              <p className="text-red-400 text-sm mt-2">
                La contraseña debe tener mínimo 8 caracteres
              </p>
            )}
          </div>

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="mb-5">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#F0F0F8" }}
            >
              Confirmar contraseña
            </label>

            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#606078" }}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>

              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
                style={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A38",
                  color: "#fff",
                }}
              />
            </div>
          </div>

          {/* CHECK */}
          <div className="flex items-start gap-2 mb-6">
            <input
              type="checkbox"
              className="mt-1 accent-[#A855F7]"
            />

            <p className="text-sm" style={{ color: "#9090A8" }}>
              Acepto los{" "}
              <Link
                href="/terms"
                target="_blank"
                className="font-medium hover:underline"
                style={{ color: "#A855F7" }}
              >
                términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link
                href="/privacy"
                target="_blank"
                className="font-medium hover:underline"
                style={{ color: "#A855F7" }}
              >
                política de privacidad
              </Link>
            </p>
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #A855F7, #6366F1)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>

          {/* DIVISOR */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "#2A2A38" }} />

            <span className="text-xs" style={{ color: "#606078" }}>
              O continúa con
            </span>

            <div className="flex-1 h-px" style={{ background: "#2A2A38" }} />
          </div>

          {/* GOOGLE Y GITHUB */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* GOOGLE */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-1"
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

            {/* GITHUB */}
            <button
              type="button"
              onClick={handleFacebookRegister}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-1"
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

          {/* LOGIN */}
          <p className="text-center text-sm mt-6" style={{ color: "#9090A8" }}>
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              style={{
                color: "#A855F7",
                fontWeight: "bold",
              }}
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
