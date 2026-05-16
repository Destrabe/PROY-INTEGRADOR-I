"use client";
import { useState } from "react";
import { registerUser } from "../authService";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [rol, setRol]               = useState("");
  const [district, setDistrict]     = useState("default");
  const [errors, setErrors]         = useState({});

  const router = useRouter();
  const validar = () => {
    const e = {};
    if (!rol)
      e.rol = "Selecciona si eres Cliente o Trabajador.";
    if (!firstName.trim())
      e.firstName = "Ingresa tu nombre.";
    if (!lastName.trim())
      e.lastName = "Ingresa tu apellido.";
    if (!email.trim())
      e.email = "Ingresa tu correo electrónico.";
    if (password.length < 8)
      e.password = "La contraseña debe tener al menos 8 caracteres.";
    if (!district || district === "default")
      e.district = "Selecciona un distrito.";
    return e;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validar();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await registerUser(
        email.trim(),
        password,
        firstName.trim(),
        lastName.trim(),
        rol,
        district
      );

      if (result.success) {
        router.push("/FeedTrabajos");
      } else {
        const code = result.error?.code;
        if (code === "auth/email-already-in-use") {
          setErrors({ email: "Este correo ya está registrado." });
        } else if (code === "auth/weak-password") {
          setErrors({ password: "La contraseña es demasiado débil." });
        } else {
          setErrors({ general: "Error al crear la cuenta. Intenta nuevamente." });
        }
      }
    } catch (error) {
      console.error("[RegisterPage]", error);
      setErrors({ general: "Error inesperado. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "h-12 px-[14px] rounded-xl border border-[#313141] bg-[#22222c] text-white text-[15px] outline-none transition-all duration-200 ease-in-out focus:border-[#7c5cff] focus:shadow-[0_0_10px_rgba(124,92,255,0.3)]";
  const errorCls = "text-red-400 text-sm mt-1";

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
            {errors.general && (
              <div className="bg-[#2d0a0a] border border-[#5a1a1a] rounded-lg px-4 py-3 text-red-400 text-sm">
                {errors.general}
              </div>
            )}

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
                  setErrors((prev) => ({ ...prev, rol: undefined }));
                }}
                className={`w-[268px] h-[125px] rounded-[20px] border border-[#313141] flex flex-col justify-center items-center bg-[#22222c] cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-[rgba(124,92,255,0.6)] hover:shadow-[0_0_15px_rgba(124,92,255,0.25),0_10px_40px_rgba(0,0,0,0.8)] ${
                  !rol
                    ? ""
                    : rol === "trabajador"
                    ? "opacity-50"
                    : "ring-2 ring-indigo-500"
                }`}
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
                  setErrors((prev) => ({ ...prev, rol: undefined }));
                }}
                className={`w-[268px] h-[125px] rounded-[20px] border border-[#313141] flex flex-col justify-center items-center bg-[#22222c] cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-[rgba(124,92,255,0.6)] hover:shadow-[0_0_15px_rgba(124,92,255,0.25),0_10px_40px_rgba(0,0,0,0.8)] ${
                  !rol
                    ? ""
                    : rol === "cliente"
                    ? "opacity-50"
                    : "ring-2 ring-indigo-500"
                }`}
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

            {/* Error de rol */}
            {errors.rol && <p className={errorCls}>{errors.rol}</p>}

            <div className="flex gap-[15px]">
              <div className="flex flex-col gap-[6px] flex-1">
                <label className="font-bold text-[15px]">NOMBRE</label>
                <input
                  className={inputCls}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="Tu nombre"
                />
                {errors.firstName && (
                  <p className={errorCls}>{errors.firstName}</p>
                )}
              </div>

              <div className="flex flex-col gap-[6px] flex-1">
                <label className="font-bold text-[15px]">APELLIDO</label>
                <input
                  className={inputCls}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Tu apellido"
                />
                {errors.lastName && (
                  <p className={errorCls}>{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[6px] flex-1">
              <label className="font-bold text-[15px]">
                CORREO ELECTRÓNICO
              </label>
              <input
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <p className={errorCls}>{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-[6px] flex-1">
              <label className="font-bold text-[15px]">CONTRASEÑA</label>
              <input
                className={inputCls}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Mínimo 8 caracteres"
              />
              {errors.password && (
                <p className={errorCls}>{errors.password}</p>
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
                <option value="miraflores">Miraflores</option>
                <option value="san_borja">San Borja</option>
                <option value="surco">Surco</option>
                <option value="la_molina">La Molina</option>
                <option value="san_miguel">San Miguel</option>
                <option value="barranco">Barranco</option>
                <option value="jesus_maria">Jesús María</option>
                <option value="lince">Lince</option>
                <option value="pueblo_libre">Pueblo Libre</option>
                <option value="san_isidro">San Isidro</option>
                <option value="surquillo">Surquillo</option>
                <option value="otro">Otro</option>
              </select>
              {errors.district && (
                <p className={errorCls}>{errors.district}</p>
              )}
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

          <p className="text-center text-[#9090a8] text-sm mt-4">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-[#6c63ff] font-bold">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;