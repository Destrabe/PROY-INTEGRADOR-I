"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, loginWithGoogle, loginWithFacebook } from "@/firebase/auth";
import { useAuth } from "@/components/AuthContext";
import Image from "next/image";
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
      router.push("/FeedTrabajos");
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
      setError("Error al iniciar sesión con Google.");
    }
  };

  const handleFacebookLogin = async () => {
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
      if (error.code === "auth/account-exists-with-different-credential") {
        setError("Ya existe una cuenta con este correo asociada a otro proveedor.");
      } else {
        setError("Error al iniciar sesión con Facebook.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0A0A0F] font-body text-[#f0f0f5] relative overflow-hidden">
      {/* Luces de fondo (Efecto Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#635bff]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#9b59b6]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[480px] z-10">
        <div className="rounded-2xl p-6 sm:p-8 bg-[#111118] border border-[#2A2A38]">
          <h1 className="font-extrabold text-2xl sm:text-3xl mb-1 text-center font-display text-[#F0F0F8]">Bienvenido de nuevo</h1>
          <p className="text-sm text-center mb-6 text-[#9090A8]">Inicia sesión en tu cuenta</p>

          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm font-bold text-[#9090A8]">Correo electrónico</label>
            <input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-[52px] pl-9 pr-4 py-3 bg-[#1a1a24] border border-[#2A2A38] rounded-xl text-sm text-white outline-none focus:border-[#6c63ff]" />
          </div>

          <div className="mb-4 flex flex-col gap-2">
            <label className="text-sm font-bold text-[#9090A8]">Contraseña</label>
            <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-[52px] pl-9 pr-4 py-3 bg-[#1a1a24] border border-[#2A2A38] rounded-xl text-sm text-white outline-none focus:border-[#6c63ff]" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>

          <div className="flex items-center justify-between mb-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} className="accent-[#6C63FF]" />
              <span className="text-sm text-[#9090A8]">Recordarme</span>
            </label>
            <Link href="/forgot-password" className="text-sm font-bold text-[#6C63FF]">¿Olvidaste tu contraseña?</Link>
          </div>

          {error && <p className="text-red-400 text-sm text-center mb-4 bg-red-500/10 py-2.5 rounded-xl">{error}</p>}

          <button onClick={handleSubmit} disabled={loading} className="w-full h-[52px] rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6C63FF] to-[#9B59B6] hover:shadow-lg disabled:opacity-70">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : "Iniciar Sesión"}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#2A2A38]" />
            <span className="text-xs text-[#606078]">O continua con</span>
            <div className="flex-1 h-px bg-[#2A2A38]" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A1A28] border border-[#2A2A38] text-[#F0F0F8] hover:border-[#6C63FF]">
              <Image src="/svg/google.svg" alt="Google" width={16} height={16} /> Google
            </button>
            <button onClick={handleFacebookLogin} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A1A28] border border-[#2A2A38] text-[#F0F0F8] hover:border-[#6C63FF]">
              <Image src="/svg/facebook.svg" alt="Facebook" width={16} height={16} /> Facebook
            </button>
          </div>

          <p className="text-sm text-center text-[#9090A8]">¿No tienes una cuenta? <Link href="/register" className="text-[#6C63FF]">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
}