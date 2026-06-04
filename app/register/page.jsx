"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, loginWithGoogle, loginWithFacebook, loginUser} from "@/firebase/auth";
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
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await registerUser(email, password, firstName, lastName, rol);
      if (result.success) {
        // Auto-login después de registro
        const loginResult = await loginUser(email, password);
        login({
          uid: loginResult.uid,
          email,
          first_name: firstName,
          last_name: lastName,
          rol,
        });
        router.push("/FeedTrabajos");
      } else {
        if (result.error?.code === "auth/email-already-in-use") {
          setError("El correo ya está registrado");
        } else {
          setError("Error al crear la cuenta");
        }
      }
    } catch (err) {
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

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
      setError("Error al registrarse con Google");
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
      setError("Error al registrarse con Facebook");
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#0a0a0f] min-h-screen py-10 px-4">
      <div className="w-full max-w-[552px]">
        <div className="font-syne font-extrabold text-white mb-6">
          <div className="flex text-[36px] leading-none mb-1">Nexora<span className="text-[#6c63ff]">.</span></div>
          <div className="text-[36px] leading-tight">Crea tu cuenta</div>
        </div>

        <form onSubmit={handleRegister}>
          <div className="font-sans text-[#9090a8] flex flex-col gap-4">
            <div className="flex flex-col mb-1">
              <div className="font-normal text-[15px] mb-4">Únete a miles de personas que ya usan Nexora</div>
              <div className="font-bold text-[13px] uppercase tracking-wider mb-2">Soy un ...</div>
              <div className="flex gap-4 mb-4">
                <div onClick={() => setRol("cliente")} className={`w-full p-4 rounded-xl border cursor-pointer transition-all ${rol === "cliente" ? "border-[#6c63ff] bg-[#6c63ff10] ring-1 ring-[#6c63ff]" : "border-[#2A2A38] bg-[#1A1A28]"}`}>
                  <div className="text-center font-bold text-white">Cliente</div>
                  <div className="text-xs text-center">Necesito un servicio</div>
                </div>
                <div onClick={() => setRol("trabajador")} className={`w-full p-4 rounded-xl border cursor-pointer transition-all ${rol === "trabajador" ? "border-[#6c63ff] bg-[#6c63ff10] ring-1 ring-[#6c63ff]" : "border-[#2A2A38] bg-[#1A1A28]"}`}>
                  <div className="text-center font-bold text-white">Trabajador</div>
                  <div className="text-xs text-center">Ofrezco mis servicios</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-[11px] font-bold uppercase mb-1.5">Nombre</label>
                <input type="text" placeholder="Tu nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 h-[46px] rounded-xl bg-[#1a1a24] border border-[#2A2A38] text-white focus:border-[#6c63ff]" />
              </div>
              <div className="w-1/2">
                <label className="block text-[11px] font-bold uppercase mb-1.5">Apellido</label>
                <input type="text" placeholder="Tu apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 h-[46px] rounded-xl bg-[#1a1a24] border border-[#2A2A38] text-white focus:border-[#6c63ff]" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1.5">Correo electrónico</label>
              <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 h-[46px] rounded-xl bg-[#1a1a24] border border-[#2A2A38] text-white focus:border-[#6c63ff]" />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1.5">Contraseña</label>
              <input type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 h-[46px] rounded-xl bg-[#1a1a24] border border-[#2A2A38] text-white focus:border-[#6c63ff]" />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1.5">Confirmar contraseña</label>
              <input type="password" placeholder="●●●●●●●●" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 h-[46px] rounded-xl bg-[#1a1a24] border border-[#2A2A38] text-white focus:border-[#6c63ff]" />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button disabled={loading} type="submit" className="font-bold h-[48px] w-full rounded-xl bg-[#6c63ff] text-white transition-all hover:opacity-90 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : "Crear cuenta gratis"}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-[#2A2A38]" />
              <span className="text-[11px] text-[#606078]">O continua con</span>
              <div className="flex-1 h-px bg-[#2A2A38]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={handleGoogleRegister} className="flex items-center justify-center gap-2 h-[46px] rounded-xl bg-[#1a1a24] border border-[#2A2A38] text-[#F0F0F8] hover:border-[#6c63ff]">Google</button>
              <button type="button" onClick={handleFacebookRegister} className="flex items-center justify-center gap-2 h-[46px] rounded-xl bg-[#1a1a24] border border-[#2A2A38] text-[#F0F0F8] hover:border-[#6c63ff]">Facebook</button>
            </div>

            <p className="text-center text-[13px] text-[#9090A8]">¿Ya tienes cuenta? <Link href="/login" className="text-[#6c63ff] font-bold">Inicia sesión</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}