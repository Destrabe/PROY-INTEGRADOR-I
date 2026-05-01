"use client";
import "./register.css";
import "../globals.css";
import { useState } from "react";
import { registerUser } from "../authService";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Inventando registrar con: ", email, password);
    const result = await registerUser(email, password);
    if (!result.success) {
      if (result.error.code === "auth/email-already-in-use") {
        return alert("el correo ya esta registrado");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <form className="register-form" onSubmit={handleRegister}>
          <div className="nexora-card">
            <div className="nexora-logo">
              <div className="logo-register">Nexora</div>
              <div className="logo-register-point">.</div>
            </div>
            <div className="register-card-title">Crea tu cuenta</div>
          </div>
          <div className="form-register">
            <div className="messages">
              <div className="message-register01">
                Únete a miles de personas que ya usan Nexora
              </div>
              <div className="message-register02">Soy un...</div>
            </div>

            <div className="roles-buttons">
              <div className="rol-button">
                <img src="/svg/client-register.svg" alt="client-icon" />
                <p className="rol-tile">Cliente</p>
                <p className="rol-subtitle">Necesito un servicio</p>
              </div>
              <div className="rol-button">
                <img src="/svg/worker-register.svg" alt="worker-icon" />
                <p className="rol-tile">Trabajador</p>
                <p className="rol-subtitle">Ofrezco mis servicios</p>
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label className="label-input">NOMBRE</label>
                <input type="text" placeholder="Tu nombre" />
              </div>

              <div className="input-group">
                <label className="label-input">APELLIDO</label>
                <input type="text" placeholder="Tu apellido" />
              </div>
            </div>

            <div className="input-group">
              <label className="label-input">CORREO ELECTRÓNICO</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="input-group">
              <label className="label-input">CONTRASEÑA</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div className="input-group">
              <label className="label-input">DISTRITO</label>
              <select>
                <option>San Juan de Lurigancho</option>
              </select>
            </div>
          </div>
          <button type="submit" className="button-register">
            Crear cuenta gratis
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
