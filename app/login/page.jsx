"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, loginWithGoogle, loginWithFacebook } from "@/firebase/auth";
import { useAuth } from "@/components/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/db";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      login({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        rol: rolReal,
      });
      router.push("/feedJobs");
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

  const handleGoogleLogin = async () => {
    try {
      const firebaseUser = await loginWithGoogle();
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const data = userDoc.exists() ? userDoc.data() : {};
      login({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        first_name: data.first_name || firebaseUser.displayName?.split(" ")[0] || "",
        last_name: data.last_name || firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
        rol: data.rol || "cliente",
      });
      router.push("/feedJobs");
    } catch (error) {
      setError("Error al iniciar sesión con Google.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const firebaseUser = await loginWithFacebook();
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const data = userDoc.exists() ? userDoc.data() : {};
      login({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        first_name: data.first_name || firebaseUser.displayName || "",
        last_name: data.last_name || "",
        rol: data.rol || "cliente",
      });
      router.push("/feedJobs");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        setError("Ya existe una cuenta con este correo asociada a otro proveedor.");
      } else {
        setError("Error al iniciar sesión con Facebook.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "var(--bg-main)", color: "var(--text-main)" }}
    >
      <div className="w-full max-w-[480px] z-10">
        <div
          className="rounded-2xl p-6 sm:p-8 border"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        >
          <h1 className="font-extrabold text-2xl sm:text-3xl mb-1 text-center" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-center mb-6" style={{ color: "var(--text-secondary)" }}>
            Inicia sesión en tu cuenta
          </p>

          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[52px] pl-9 pr-4 py-3 rounded-xl border outline-none transition-all"
              style={{
                background: "var(--bg-input)",
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
          </div>

          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[52px] pl-9 pr-4 py-3 rounded-xl border outline-none transition-all"
              style={{
                background: "var(--bg-input)",
                borderColor: "var(--border-color)",
                color: "var(--text-main)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="flex items-center justify-between mb-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Recordarme
              </span>
            </label>
            <Link href="/forgot-password" className="text-sm font-bold" style={{ color: "var(--accent)" }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {error && (
            <p
              className="text-sm text-center mb-4 py-2.5 rounded-xl"
              style={{ background: "var(--error)", color: "white" }}
            >
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              O continua con
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              Google
            </button>
            <button
              onClick={handleFacebookLogin}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              Facebook
            </button>
          </div>

          <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="font-bold" style={{ color: "var(--accent)" }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}