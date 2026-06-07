"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, loginWithGoogle, loginWithFacebook, loginUser } from "@/firebase/auth";
import { useAuth } from "@/components/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/db";

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
        const firebaseUser = await loginUser(email, password);
        login({
          uid: firebaseUser.uid,
          email,
          first_name: firstName,
          last_name: lastName,
          rol: rol,
        });
        if (rol === "trabajador") {
          router.push("/worker");
        } else {
          router.push("/feedJobs");
        }
      } else {
        if (result.error?.code === "auth/email-already-in-use") {
          setError("El correo ya está registrado");
        } else {
          setError("Error al crear la cuenta");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const firebaseUser = await loginWithGoogle();
      // Consultar si ya existe el documento en Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      let rolReal = "cliente";
      let firstNameReal = firebaseUser.displayName?.split(" ")[0] || "";
      let lastNameReal = firebaseUser.displayName?.split(" ").slice(1).join(" ") || "";

      if (userDoc.exists()) {
        const data = userDoc.data();
        rolReal = data.rol || "cliente";
        firstNameReal = data.first_name || firstNameReal;
        lastNameReal = data.last_name || lastNameReal;
      }

      login({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        first_name: firstNameReal,
        last_name: lastNameReal,
        rol: rolReal,
      });
      router.push("/feedJobs");
    } catch (error) {
      console.error(error);
      setError("Error al registrarse con Google");
    }
  };

  const handleFacebookRegister = async () => {
    try {
      const firebaseUser = await loginWithFacebook();
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      let rolReal = "cliente";
      let firstNameReal = firebaseUser.displayName || "";
      let lastNameReal = "";

      if (userDoc.exists()) {
        const data = userDoc.data();
        rolReal = data.rol || "cliente";
        firstNameReal = data.first_name || firstNameReal;
        lastNameReal = data.last_name || "";
      }

      login({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        first_name: firstNameReal,
        last_name: lastNameReal,
        rol: rolReal,
      });
      router.push("/feedJobs");
    } catch (error) {
      console.error(error);
      setError("Error al registrarse con Facebook");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-10 px-4" style={{ background: "var(--bg-main)", color: "var(--text-main)" }}>
      <div className="w-full max-w-[552px]">
        <div className="font-syne font-extrabold mb-6">
          <div className="flex text-[36px] leading-none mb-1">Nexora<span style={{ color: "var(--accent)" }}>.</span></div>
          <div className="text-[36px] leading-tight">Crea tu cuenta</div>
        </div>

        <form onSubmit={handleRegister}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col mb-1">
              <div className="font-normal text-[15px] mb-4" style={{ color: "var(--text-secondary)" }}>Únete a miles de personas que ya usan Nexora</div>
              <div className="font-bold text-[13px] uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Soy un ...</div>
              <div className="flex gap-4 mb-4">
                <div onClick={() => setRol("cliente")} className={`w-full p-4 rounded-xl border cursor-pointer transition-all ${rol === "cliente" ? "border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent-text)]" : "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)]"}`}>
                  <div className="text-center font-bold">Cliente</div>
                  <div className="text-xs text-center">Necesito un servicio</div>
                </div>
                <div onClick={() => setRol("trabajador")} className={`w-full p-4 rounded-xl border cursor-pointer transition-all ${rol === "trabajador" ? "border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent-text)]" : "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)]"}`}>
                  <div className="text-center font-bold">Trabajador</div>
                  <div className="text-xs text-center">Ofrezco mis servicios</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-[11px] font-bold uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>Nombre</label>
                <input type="text" placeholder="Tu nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 h-[46px] rounded-xl border outline-none transition-all" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} onFocus={(e) => (e.target.style.borderColor = "var(--accent)")} onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
              </div>
              <div className="w-1/2">
                <label className="block text-[11px] font-bold uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>Apellido</label>
                <input type="text" placeholder="Tu apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 h-[46px] rounded-xl border outline-none transition-all" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} onFocus={(e) => (e.target.style.borderColor = "var(--accent)")} onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>Correo electrónico</label>
              <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 h-[46px] rounded-xl border outline-none transition-all" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} onFocus={(e) => (e.target.style.borderColor = "var(--accent)")} onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>Contraseña</label>
              <input type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 h-[46px] rounded-xl border outline-none transition-all" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} onFocus={(e) => (e.target.style.borderColor = "var(--accent)")} onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>Confirmar contraseña</label>
              <input type="password" placeholder="●●●●●●●●" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 h-[46px] rounded-xl border outline-none transition-all" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} onFocus={(e) => (e.target.style.borderColor = "var(--accent)")} onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button disabled={loading} type="submit" className="btn-primary w-full justify-center">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : "Crear cuenta gratis"}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>O continua con</span>
              <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={handleGoogleRegister} className="btn-secondary flex items-center justify-center gap-2">Google</button>
              <button type="button" onClick={handleFacebookRegister} className="btn-secondary flex items-center justify-center gap-2">Facebook</button>
            </div>

            <p className="text-center text-[13px]" style={{ color: "var(--text-secondary)" }}>¿Ya tienes cuenta? <Link href="/login" className="font-bold" style={{ color: "var(--accent)" }}>Inicia sesión</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}