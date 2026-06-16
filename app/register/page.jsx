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

  const [rol, setRol] = useState("cliente");
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
          rol: rol,
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
    <div className="mt-14 flex font-sans justify-center items-center bg-[#0a0a0f] min-h-screen py-10 px-4">
      <div className="w-full max-w-138">
        {/* LOGO */}
        <div className="font-syne font-extrabold text-white mb-6">
          <div className="flex text-[36px] leading-none mb-1">
            Nexora<span className="text-[#6c63ff]">.</span>
          </div>
          <div className="text-[36px] leading-tight">Crea tu cuenta</div>
        </div>

        {/* CARD */}
        <form onSubmit={handleRegister}>
          <div className="font-sans text-[#9090a8] flex flex-col gap-4">
            <div className="flex flex-col mb-1">
              <div className="font-normal text-[15px] mb-4">
                Únete a miles de personas que ya usan Nexora
              </div>
              <div className="font-bold text-[13px] uppercase tracking-wider text-[#9090A8] mb-2">
                Soy un ...
              </div>
            </div>

            {/* ROL */}
            <div className="flex gap-3.75 mb-2.5">
              {/* Tarjeta Cliente */}
              <div
                onClick={() => {
                  setRol("cliente");
                }}
                className={`w-67 h-31.25 rounded-[20px] border border-[#313141] flex flex-col justify-center items-center bg-[#22222c] cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-[rgba(124,92,255,0.6)] hover:shadow-[0_0_15px_rgba(124,92,255,0.25),0_10px_40px_rgba(0,0,0,0.8)]
      
      ${
        !rol
          ? ""
          : rol === "trabajador"
            ? "opacity-50"
            : "border-[rgba(124,92,255,0.6)] shadow-[0_0_15px_rgba(124,92,255,0.25),0_10px_40px_rgba(0,0,0,0.8)] ring-2 ring-indigo-500"
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

              {/* Tarjeta Trabajador */}
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
            : "border-[rgba(124,92,255,0.6)] shadow-[0_0_15px_rgba(124,92,255,0.25),0_10px_40px_rgba(0,0,0,0.8)] ring-2 ring-indigo-500"
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

            {/* NOMBRES Y APELLIDOS */}
            <div className="flex gap-[16px]">
              <div className="w-1/2">
                <label className="block text-[11px] font-bold text-[#9090A8] tracking-wider mb-1.5 uppercase">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 h-[46px] rounded-[10px] outline-none transition-colors text-[14px] bg-[#1a1a24] border border-[#2A2A38] text-white focus:border-[#6c63ff] placeholder:text-[#606078]"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-[11px] font-bold text-[#9090A8] tracking-wider mb-1.5 uppercase">
                  Apellido
                </label>
                <input
                  type="text"
                  placeholder="Tu apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 h-[46px] rounded-[10px] outline-none transition-colors text-[14px] bg-[#1a1a24] border border-[#2A2A38] text-white focus:border-[#6c63ff] placeholder:text-[#606078]"
                />
              </div>
            </div>

            {/* CORREO */}
            <div>
              <label className="block text-[11px] font-bold text-[#9090A8] tracking-wider mb-1.5 uppercase">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 h-[46px] rounded-[10px] outline-none transition-colors text-[14px] bg-[#1a1a24] border border-[#2A2A38] text-white focus:border-[#6c63ff] placeholder:text-[#606078]"
              />
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label className="block text-[11px] font-bold text-[#9090A8] tracking-wider mb-1.5 uppercase">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 h-[46px] rounded-[10px] outline-none transition-colors text-[14px] bg-[#1a1a24] border border-[#2A2A38] text-white focus:border-[#6c63ff] placeholder:text-[#606078]"
              />
              {sended && password.length < 8 && (
                <p className="text-red-400 text-xs mt-1.5">
                  La contraseña debe tener mínimo 8 caracteres
                </p>
              )}
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div className="mb-2">
              <label className="block text-[11px] font-bold text-[#9090A8] tracking-wider mb-1.5 uppercase">
                Confirmar contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 h-[46px] rounded-[10px] outline-none transition-colors text-[14px] bg-[#1a1a24] border border-[#2A2A38] text-white focus:border-[#6c63ff] placeholder:text-[#606078]"
              />
            </div>

            {/* CHECK */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                className="accent-[#6c63ff] w-[14px] h-[14px] rounded border-[#2A2A38] bg-[#1a1a24]"
              />
              <p className="text-[12px] text-[#9090A8] m-0">
                Acepto los{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-medium hover:underline text-[#6c63ff]"
                >
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="font-medium hover:underline text-[#6c63ff]"
                >
                  política de privacidad
                </Link>
              </p>
            </div>
          </div>

          {/* BOTÓN */}
          <button
            disabled={loading}
            type="submit"
            className={`font-bold text-[15px] mt-4 h-[48px] w-full rounded-[10px] bg-[#6c63ff] text-white cursor-pointer flex justify-center items-center transition-all hover:opacity-90 ${
              loading && "opacity-50"
            }`}
          >
            {loading ? (
              <div className="h-6 w-6 border-4 border-white/20 rounded-full border-t-white animate-spin" />
            ) : (
              <span>Crear cuenta gratis</span>
            )}
          </button>

          {/* DIVISOR */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#2A2A38]" />
            <span className="text-[11px] text-[#606078]">O continúa con</span>
            <div className="flex-1 h-px bg-[#2A2A38]" />
          </div>

          {/* GOOGLE Y FACEBOOK */}
          <div className="grid grid-cols-2 gap-[16px] mb-6">
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="flex items-center justify-center gap-2 h-[46px] rounded-[10px] text-[13px] font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-[#1a1a24] border border-[#2A2A38] text-[#F0F0F8] hover:border-[#6c63ff]"
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
              onClick={handleFacebookRegister}
              className="flex items-center justify-center gap-2 h-[46px] rounded-[10px] text-[13px] font-semibold transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-[#1a1a24] border border-[#2A2A38] text-[#F0F0F8] hover:border-[#6c63ff]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.009 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.082 24 18.092 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* LOGIN */}
          <p className="text-center text-[13px] mt-2 text-[#9090A8]">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-[#6c63ff] font-bold hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
