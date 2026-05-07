"use client";

import { useState } from "react";
import "./loginStyles.css";

export default function NexoraLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="nexora-root">
      <div className="bg-glow bg-glow--top" />
      <div className="bg-glow bg-glow--bottom" />
      <div className="bg-grid" />

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
              />
              <div className="field__forgot">
                <a href="#" className="link--accent">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <button
              className={`btn btn--primary btn--full ${loading ? "btn--loading" : ""}`}
              onClick={handleSubmit}
            >
              {loading ? <span className="spinner" /> : "Ingresar"}
            </button>

            <p className="card__register">
              ¿No tienes cuenta?{" "}
              <a href="#" className="link--accent link--bold">
                Regístrate gratis
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
