"use client";

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
    <div className="flex font-sans justify-center bg-gradient-to-t from-[#0a0a0f] to-[#111116] min-h-screen py-5">
      <div>
        <form onSubmit={handleRegister}>
          <div className="font-syne font-extrabold text-white mb-5">
            <div className="flex">
              <div className="text-[32px]">Nexora</div>

              <div className="text-[32px] text-[#500fe9]">.</div>
            </div>

            <div className="text-[40px]">Crea tu cuenta</div>
          </div>

          <div className="font-sans text-[#9090a8] flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <div className="font-normal">
                Únete a miles de personas que ya usan Nexora
              </div>

              <div className="font-bold">Soy un...</div>
            </div>

            <div className="flex gap-[15px] mb-[10px]">
              <div
                onClick={() => {
                  setRol("cliente");
                }}
                className={`w-[268px] h-[125px] rounded-[20px] border border-[#313141] flex flex-col justify-center items-center bg-[#22222c] cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-[rgba(124,92,255,0.6)] hover:shadow-[0_0_15px_rgba(124,92,255,0.25),0_10px_40px_rgba(0,0,0,0.8)]
                  
                  ${
                    !rol
                      ? ""
                      : rol === "trabajador"
                        ? "opacity-50"
                        : "ring-2 ring-indigo-500"
                  }
                `}
              >
                <img
                  className="w-[36px] h-[36px]"
                  src="/svg/client-register.svg"
                  alt="client-icon"
                />

                <p className="m-1 font-bold text-white text-[15px]">Cliente</p>

                <p className="m-0 font-normal text-[#9090a8] text-[15px]">
                  Necesito un servicio
                </p>
              </div>

              <div
                onClick={() => {
                  setRol("trabajador");
                }}
                className={`w-[268px] h-[125px] rounded-[20px] border border-[#313141] flex flex-col justify-center items-center bg-[#22222c] cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-[rgba(124,92,255,0.6)] hover:shadow-[0_0_15px_rgba(124,92,255,0.25),0_10px_40px_rgba(0,0,0,0.8)]

                  ${
                    !rol
                      ? ""
                      : rol === "cliente"
                        ? "opacity-50"
                        : "ring-2 ring-indigo-500"
                  }
                `}
              >
                <img
                  className="w-[36px] h-[36px]"
                  src="/svg/worker-register.svg"
                  alt="worker-icon"
                />

                <p className="m-1 font-bold text-white text-[15px]">
                  Trabajador
                </p>

                <p className="m-0 font-normal text-[#9090a8] text-[15px]">
                  Ofrezco mis servicios
                </p>
              </div>
            </div>

            <div className="flex gap-[15px]">
              <div className="flex flex-col gap-[6px] flex-1">
                <label className="font-bold text-[15px]">NOMBRE</label>

                <input
                  className="h-12 px-[14px] rounded-xl border border-[#313141] bg-[#22222c] text-white text-[15px] outline-none transition-all duration-200 ease-in-out focus:border-[#7c5cff] focus:shadow-[0_0_10px_rgba(124,92,255,0.3)]"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div className="flex flex-col gap-[6px] flex-1">
                <label className="font-bold text-[15px]">APELLIDO</label>

                <input
                  className="h-12 px-[14px] rounded-xl border border-[#313141] bg-[#22222c] text-white text-[15px] outline-none transition-all duration-200 ease-in-out focus:border-[#7c5cff] focus:shadow-[0_0_10px_rgba(124,92,255,0.3)]"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  required
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[6px] flex-1">
              <label className="font-bold text-[15px]">
                CORREO ELECTRÓNICO
              </label>

              <input
                className="h-12 px-[14px] rounded-xl border border-[#313141] bg-[#22222c] text-white text-[15px] outline-none transition-all duration-200 ease-in-out focus:border-[#7c5cff] focus:shadow-[0_0_10px_rgba(124,92,255,0.3)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="flex flex-col gap-[6px] flex-1">
              <label className="font-bold text-[15px]">CONTRASEÑA</label>

              <input
                className="h-12 px-[14px] rounded-xl border border-[#313141] bg-[#22222c] text-white text-[15px] outline-none transition-all duration-200 ease-in-out focus:border-[#7c5cff] focus:shadow-[0_0_10px_rgba(124,92,255,0.3)]"
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

            <div className="flex flex-col gap-[6px] flex-1">
              <label className="font-bold text-[15px]">DISTRITO</label>

              <select
                className="h-12 px-[14px] rounded-xl border border-[#313141] bg-[#22222c] text-white text-[15px] outline-none transition-all duration-200 ease-in-out focus:border-[#7c5cff] focus:shadow-[0_0_10px_rgba(124,92,255,0.3)] appearance-none cursor-pointer"
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
            className={`font-bold text-[15px] mt-5 h-[50px] w-full rounded-xl bg-[#6c63ff] text-white cursor-pointer flex justify-center items-center ${
              loading && "opacity-50"
            }`}
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
