"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/app/hooks/useUserRole";
import { useAuth } from "@/components/AuthContext";
import { doc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/db";
import { deleteUser } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditProfilePage() {
  const [user, loadingAuth] = useAuthState(auth);
  const { logout } = useAuth();
  const router = useRouter();
  const { perfil, rol, loadingRol, refetch } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);

  // Estados del formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [habilidades, setHabilidades] = useState([]);
  const [nuevaHabilidad, setNuevaHabilidad] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");
  const [tarifaEstandar, setTarifaEstandar] = useState("");
  const [website, setWebsite] = useState("");
  const [district, setDistrict] = useState("");

  useEffect(() => {
    if (perfil) {
      setFirstName(perfil.first_name || "");
      setLastName(perfil.last_name || "");
      setBio(perfil.bio || "");
      setHabilidades(perfil.habilidades || []);
      setDisponibilidad(perfil.disponibilidad || "");
      setTarifaEstandar(perfil.tarifaEstandar?.toString() || "");
      setWebsite(perfil.website || "");
      setDistrict(perfil.district || "");
      if (perfil.avatarUrl) {
        setAvatarPreview(perfil.avatarUrl);
      }
    }
  }, [perfil]);

  useEffect(() => {
    if (!loadingAuth && !user) router.push("/login");
  }, [user, loadingAuth, router]);

  const agregarHabilidad = () => {
    const hab = nuevaHabilidad.trim();
    if (hab && !habilidades.includes(hab)) {
      setHabilidades([...habilidades, hab]);
      setNuevaHabilidad("");
    }
  };

  const eliminarHabilidad = (hab) => {
    setHabilidades(habilidades.filter(h => h !== hab));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMensaje("Solo se permiten imágenes");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const subirAvatar = async (uid) => {
    if (!avatarFile) return null;
    const storage = getStorage();
    const path = `avatars/${uid}_${Date.now()}.jpg`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, avatarFile);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMensaje("");
    try {
      const userRef = doc(db, "users", user.uid);
      const updates = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        bio: bio.trim(),
        habilidades,
        disponibilidad: disponibilidad.trim(),
        website: website.trim(),
        district: district.trim(),
        updatedAt: serverTimestamp(),
      };
      if (rol === "trabajador" && tarifaEstandar) {
        updates.tarifaEstandar = parseFloat(tarifaEstandar) || 0;
      }
      // Subir avatar si cambió
      if (avatarFile) {
        const avatarUrl = await subirAvatar(user.uid);
        if (avatarUrl) updates.avatarUrl = avatarUrl;
      }
      await updateDoc(userRef, updates);
      setMensaje("Perfil actualizado correctamente");
      if (refetch) await refetch();
      setTimeout(() => router.push("/profile"), 1500);
    } catch (error) {
      console.error(error);
      setMensaje("Error al actualizar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmar = confirm("¿Estás seguro? Esta acción eliminará permanentemente tu cuenta y todos tus datos. No se puede deshacer.");
    if (!confirmar) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      await logout();
      router.push("/");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/requires-recent-login") {
        setMensaje(
          "Por seguridad, debes volver a iniciar sesión antes de eliminar tu cuenta. " +
          "Redirigiendo al login..."
        );
        setTimeout(async () => {
          await logout();
          router.push("/login");
        }, 2500);
      } else {
        setMensaje("Error al eliminar cuenta: " + error.message);
      }
      setLoading(false);
    }
  };

  if (loadingAuth || loadingRol) {
    return <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center" style={{ color: "var(--text-main)" }}>Cargando...</div>;
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--bg-main)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border p-6 md:p-8" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Editar perfil</h1>

          {mensaje && (
            <div className={`mb-4 p-3 rounded-lg text-center ${mensaje.includes("Error") ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Foto de perfil</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2" style={{ borderColor: "var(--accent)" }}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl" style={{ background: "var(--bg-hover)" }}>
                      {perfil?.first_name?.[0] || user?.email?.[0] || "?"}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary text-sm"
                >
                  Cambiar foto
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
              </div>
            </div>

            {/* Nombres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Nombre</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-lg px-4 py-2 border outline-none transition-all" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Apellido</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-lg px-4 py-2 border outline-none transition-all" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Biografía (sobre mí)</label>
              <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-lg px-4 py-2 border outline-none resize-vertical" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} />
            </div>

            {/* Habilidades */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Habilidades</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={nuevaHabilidad} onChange={(e) => setNuevaHabilidad(e.target.value)} placeholder="Ej: React, Diseño, Electricidad" className="flex-1 rounded-lg px-4 py-2 border outline-none" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} />
                <button type="button" onClick={agregarHabilidad} className="btn-secondary text-sm">+ Agregar</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {habilidades.map((hab) => (
                  <span key={hab} className="badge flex items-center gap-2" style={{ background: "var(--accent-bg)", color: "var(--accent-text)" }}>
                    {hab}
                    <button type="button" onClick={() => eliminarHabilidad(hab)} className="text-red-400 hover:text-red-300">✕</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Disponibilidad, distrito, tarifa, website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Disponibilidad</label>
                <input type="text" value={disponibilidad} onChange={(e) => setDisponibilidad(e.target.value)} placeholder="Ej: Tiempo completo, Fines de semana" className="w-full rounded-lg px-4 py-2 border outline-none" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Distrito</label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full rounded-lg px-4 py-2 border outline-none" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }}>
                  <option value="">Selecciona un distrito</option>
                  <option>San Juan de Lurigancho</option>
                  <option>Miraflores</option>
                  <option>San Borja</option>
                  <option>Surco</option>
                  <option>La Molina</option>
                  <option>San Miguel</option>
                  <option>Barranco</option>
                  <option>Jesús María</option>
                  <option>Lince</option>
                  <option>Pueblo Libre</option>
                  <option>San Isidro</option>
                  <option>Surquillo</option>
                  <option>Otro</option>
                </select>
              </div>
              {rol === "trabajador" && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Tarifa estándar (S/ por hora o trabajo)</label>
                  <input type="number" step="1" value={tarifaEstandar} onChange={(e) => setTarifaEstandar(e.target.value)} className="w-full rounded-lg px-4 py-2 border outline-none" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Sitio web</label>
                <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className="w-full rounded-lg px-4 py-2 border outline-none" style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }} />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? "Guardando..." : "Guardar cambios"}</button>
                <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">Cancelar</button>
              </div>
              <button type="button" onClick={handleDeleteAccount} className="bg-[var(--error)] hover:bg-red-700 text-white py-2 rounded-lg transition-colors w-full">Eliminar mi cuenta</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}