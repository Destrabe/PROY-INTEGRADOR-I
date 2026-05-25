"use client";

import { useState } from "react";
import "./loginStyles.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "../authService";
import { useAuth } from "@/components/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/db";

export default function NexoraLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const firebaseUser = await loginUser(email, password);

      // Traer datos extra de Firestore (nombre, rol, etc.)
      const snap = await getDoc(doc(db, "users", firebaseUser.uid));
      const data = snap.exists() ? snap.data() : {};

      login({
        uid:        firebaseUser.uid,
        email:      firebaseUser.email,
        first_name: data.first_name || "",
        last_name:  data.last_name  || "",
        rol:        data.rol        || "cliente",
      });

      router.push("/");
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Correo o contraseña incorrectos");
      } else if (err.code === "auth/user-not-found") {
        setError("No existe una cuenta con ese correo");
      } else {
        setError("Ocurrió un error, intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
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
            <div className="field">
              <label className="field__label">CORREO ELECTRÓNICO</label>
              <input
                className="field__input"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <div className="field__forgot">
                <Link href="/forgot-password" className="link--accent">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

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