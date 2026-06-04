"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      const saved = localStorage.getItem(`profilePhoto_${user.uid}`);
      if (saved) setProfilePhoto(saved);
      const handleUpdate = () => {
        const updated = localStorage.getItem(`profilePhoto_${user.uid}`);
        if (updated) setProfilePhoto(updated);
      };
      window.addEventListener("profile-photo-updated", handleUpdate);
      return () => window.removeEventListener("profile-photo-updated", handleUpdate);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (path) => pathname === path;

  if (loading) {
    return <div className="w-full h-[90px] bg-black flex items-center px-6 lg:px-[60px]"><div className="font-syne font-extrabold text-2xl text-white">Nexora<span className="text-[#6c63ff]">.</span></div></div>;
  }

  return (
    <header className="w-full lg:h-[90px] py-3 lg:py-0 bg-[#0A0A0F] text-white border-b border-[#2A2A38]">
      <div className="h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[60px] gap-4">
        <Link href="/" className="flex items-end font-syne font-extrabold text-2xl leading-none">Nexora<span className="text-[32px] text-[#6c63ff] relative top-[3px]">.</span></Link>

        <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
          <nav className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
            <Link href="/" className={`${isActive("/") ? "text-[#6c63ff]" : "hover:text-[#6c63ff]"}`}>Inicio</Link>
            <Link href="/FeedTrabajos" className={`${isActive("/FeedTrabajos") ? "text-[#6c63ff]" : "hover:text-[#6c63ff]"}`}>Explorar</Link>
            <Link href="/nosotros" className={`${isActive("/nosotros") ? "text-[#6c63ff]" : "hover:text-[#6c63ff]"}`}>Nosotros</Link>
            {user && (
              <>
                <Link href="/mensajes" className={`${isActive("/mensajes") ? "text-[#6c63ff]" : "hover:text-[#6c63ff]"}`}>Mensajes</Link>
                <Link href="/perfil" className={`${isActive("/perfil") ? "text-[#6c63ff]" : "hover:text-[#6c63ff]"}`}>Perfil</Link>
              </>
            )}
          </nav>

          <div className="hidden lg:block w-px h-6 bg-[#2A2A38]" />

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111118] border border-[#2A2A38] text-sm">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#0A0A0F] flex items-center justify-center">
                  {profilePhoto ? <img src={profilePhoto} alt="avatar" className="w-full h-full object-cover" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>}
                </div>
                <span className="text-[#9090A8]">Hola, <span className="text-white font-semibold">{user.name || user.email}</span></span>
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#111118] border border-[#2A2A38] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:text-red-400">Cerrar sesión</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="px-4 py-2 text-center hover:text-[#6c63ff]">Iniciar Sesión</Link>
              <Link href="/register" className="px-4 py-2 text-center rounded-xl bg-[#6c63ff] text-white">Registrarse</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}