"use client";
import "./register.css";
import "../globals.css";
import { useState } from "react";
import { registerUser } from "../authService";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sended, setSendend] = useState(false);
  const [rol, setRol] = useState("");
  const [district, setDistrict] = useState("default");

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSendend(true);
    if (!firstName || !lastName || !email || !password || !district) {
      alert("Completar el formulario antes de enviar");
      setLoading(false);
      return;
    }
    console.log("Inventando registrar con: ", email, password);
    try {
      const result = await registerUser(
        email,
        password,
        firstName,
        lastName,
        rol,
        district,
      );
      if (result.success) {
        alert("Cuenta creada correctamente");
        router.push("/login");
        setLoading(false);
      } else {
        if (!result.success) {
          if (result.error.code === "auth/email-already-in-use") {
            alert("el correo ya esta registrado");
            setLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
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
              <div
                onClick={() => {
                  setRol("cliente");
                }}
                className={`rol-button ${
                  !rol
                    ? ""
                    : rol === "trabajador"
                      ? "opacity-50"
                      : "ring-2 ring-indigo-500"
                }
               `}
              >
                <img src="/svg/client-register.svg" alt="client-icon" />
                <p className="rol-tile">Cliente</p>
                <p className="rol-subtitle">Necesito un servicio</p>
              </div>
              <div
                onClick={() => {
                  setRol("trabajador");
                }}
                className={`rol-button ${
                  !rol
                    ? ""
                    : rol === "cliente"
                      ? "opacity-50"
                      : "ring-2 ring-indigo-500 "
                }
               `}
              >
                <img src="/svg/worker-register.svg" alt="worker-icon" />
                <p className="rol-tile">Trabajador</p>
                <p className="rol-subtitle">Ofrezco mis servicios</p>
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label className="label-input">NOMBRE</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div className="input-group">
                <label className="label-input">APELLIDO</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  required
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="label-input">CORREO ELECTRÓNICO</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
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
              {sended && password.length < 8 && (
                <span className="text-red-500 text-sm">
                  Completar contraseña por favor
                </span>
              )}
            </div>

            <div className="input-group">
              <label className="label-input">DISTRITO</label>

              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="default" disabled>
                  Seleccione un distrito
                </option>
                <option value="sjl">San Juan de Lurigancho</option>
              </select>
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className={`button-register flex justify-center items-center ${loading && "opacity-50"}`}
          >
            {loading ? (
              <div className="h-8 w-8 border-4 border-red-200 rounded-full border-t-indigo-500 animate-spin" />
            ) : (
              <span>Crear cuenta gratis</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
