"use client";
import { useState } from "react";
import "./loginStyles.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "../authService";

export default function NexoraLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      router.push("/FeedTrabajos");
    } else {
      const code = result.error?.code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Correo o contraseña incorrectos.");
      } else if (code === "auth/too-many-requests") {
        setError("Demasiados intentos. Intenta más tarde.");
      } else {
        setError("Error al iniciar sesión. Intenta nuevamente.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="nexora-root">
      <div className="bg-glow bg-glow--top" />
      <div className="bg-glow bg-glow--bottom" />
      <main className="main">
        <div className="card">
          <div className="card__header">
            <p className="card__brand">
              Nexora<span className="brand-dot">.</span>
            </p>
            <h1 className="card__title">Bienvenido de nuevo</h1>
            <p className="card__subtitle">Ingresa a tu cuenta para continuar</p>
          </div>
          <div className="card__body">
            {error && (
              <div style={{
                backgroundColor: "#2d0a0a",
                border: "1px solid #5a1a1a",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#f87171",
                fontSize: "13px",
                marginBottom: "16px",
              }}>
                {error}
              </div>
            )}
            <div className="field">
              <label className="field__label">CORREO ELECTRÓNICO</label>
              <input
                className="field__input"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="field">
              <label className="field__label">CONTRASEÑA</label>
              <input
                className="field__input"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="field__forgot">
                <Link href="/forgot-password" className="link--accent">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
            <button
              className={`btn btn--primary btn--full ${loading ? "btn--loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : "Ingresar"}
            </button>
            <p className="card__register">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="link--accent link--bold">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}