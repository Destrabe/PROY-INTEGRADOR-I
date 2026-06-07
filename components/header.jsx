"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "./AuthContext";
import { useUserRole } from "@/app/hooks/useUserRole";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout, loading } = useAuth();
  const { rol } = useUserRole();
  const router = useRouter();
  const pathname = usePathname();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    setMenuAbierto(false);
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="w-full lg:h-[90px] py-3 lg:py-0 border-b relative" style={{ background: "var(--bg-main)", borderColor: "var(--border-color)" }}>
      <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-[60px] gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-end font-syne font-extrabold text-2xl leading-none" style={{ color: "var(--text-main)" }}>
          Nexora<span className="text-[32px] text-[var(--accent)] relative top-[3px]">.</span>
        </Link>

        {/* Botón hamburguesa */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="lg:hidden p-2 rounded-lg transition-all hover:bg-[var(--bg-hover)]"
          aria-label="Menú"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Navegación desktop */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex gap-6 text-sm">
            <Link href="/" className={`transition-colors ${isActive("/") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Inicio</Link>
            <Link href="/feedJobs" className={`transition-colors ${isActive("/feedJobs") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Explorar</Link>
            <Link href="/configuration" className={`transition-colors ${isActive("/configuration") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Nosotros</Link>
            {user && (
              <>
                <Link href="/messages" className={`transition-colors ${isActive("/messages") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Mensajes</Link>
                <Link href="/profile" className={`transition-colors ${isActive("/profile") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Perfil</Link>
              </>
            )}
            {rol === "admin" && (
              <Link href="/administrator" className={`transition-colors ${isActive("/administrator") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Admin</Link>
            )}
          </nav>

          <div className="w-px h-6" style={{ backgroundColor: "var(--border-color)" }} />

          {!mounted ? (
            <div className="h-10 w-40 rounded-xl" style={{ background: "var(--bg-card)" }} />
          ) : user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-main)" }}>
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center" style={{ background: "var(--bg-main)" }}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <span style={{ color: "var(--text-secondary)" }}>Hola, <span style={{ color: "var(--text-main)" }} className="font-semibold">{user.name || user.email}</span></span>
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-44 rounded-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:text-red-400 transition-colors" style={{ color: "var(--text-main)" }}>Cerrar sesión</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="px-4 py-2 text-center transition-colors hover:text-[var(--accent)]" style={{ color: "var(--text-secondary)" }}>
                Iniciar Sesión
              </Link>
              <Link href="/register" className="px-4 py-2 text-center rounded-xl text-white transition-all btn-cta">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {menuAbierto && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-50 p-4 border-b shadow-lg" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <nav className="flex flex-col gap-3 text-sm mb-4">
            <Link href="/" onClick={() => setMenuAbierto(false)} className={`${isActive("/") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Inicio</Link>
            <Link href="/feedJobs" onClick={() => setMenuAbierto(false)} className={`${isActive("/feedJobs") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Explorar</Link>
            <Link href="/configuration" onClick={() => setMenuAbierto(false)} className={`${isActive("/configuration") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Nosotros</Link>
            {user && (
              <>
                <Link href="/messages" onClick={() => setMenuAbierto(false)} className={`${isActive("/messages") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Mensajes</Link>
                <Link href="/profile" onClick={() => setMenuAbierto(false)} className={`${isActive("/profile") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Perfil</Link>
              </>
            )}
            {rol === "admin" && (
              <Link href="/administrator" onClick={() => setMenuAbierto(false)} className={`${isActive("/administrator") ? "text-[var(--accent)]" : "hover:text-[var(--accent)]"}`} style={{ color: "var(--text-main)" }}>Admin</Link>
            )}
          </nav>
          <hr className="my-3 border-[var(--border-color)]" />
          {user ? (
            <button onClick={handleLogout} className="w-full text-left py-2 text-red-400 transition-colors">Cerrar sesión</button>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" onClick={() => setMenuAbierto(false)} className="flex-1 text-center px-4 py-2 rounded-lg border border-[var(--border-color)]" style={{ color: "var(--text-secondary)" }}>Iniciar Sesión</Link>
              <Link href="/register" onClick={() => setMenuAbierto(false)} className="flex-1 text-center px-4 py-2 rounded-lg text-white btn-cta">Registrarse</Link>
              </div>
          )}
        </div>
      )}
    </header>
  );
}