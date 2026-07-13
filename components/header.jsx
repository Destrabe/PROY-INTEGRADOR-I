"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";
import ThemeToggle from "./themeToogle";

const Logo = ({ color }) => (
  <div
    style={{ color }}
    className="flex items-end font-extrabold text-2xl leading-none font-syne select-none"
  >
    <div className="logo-header-name">Nexora</div>
    <div className="text-[32px] text-[#6c63ff] relative top-0.75">.</div>
  </div>
);

const NavLink = ({ href, children, active }) => {
  const theme = useThemeStore((state) => state.theme);
  const textColor = useThemeStore((state) => state.textColor);

  return (
    <Link
      href={href}
      style={{
        color: active ? "#6c63ff" : textColor[theme],
      }}
      className="flex items-center transition-colors hover:text-[#6c63ff]"
    >
      {children}
    </Link>
  );
};

export default function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Variables del Store
  const theme = useThemeStore((state) => state.theme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div 
        className="font-sans w-full h-22.5" 
        style={{ backgroundColor: background[theme] }}
      >
        <div className="h-full flex items-center px-15">
          <Logo color={textColor[theme]} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: background[theme],
        color: textColor[theme],
        borderColor: theme === "dark" ? "#27272a" : "#e5e7eb",
      }}
      className="fixed z-10 h-12 font-sans w-full lg:h-22.5 py-3 lg:py-0 transition-all border-b"
    >
      <div className="h-full flex flex-col lg:grid lg:grid-cols-3 items-center px-4 sm:px-6 lg:px-15 py-4 gap-4">
        {/* LOGO */}
        <div className="h-full flex items-center justify-center lg:justify-start select-none w-full">
          <Link href="/" className="flex items-center gap-2">
            <Logo color={textColor[theme]} />
          </Link>
        </div>

        {/* NAV */}
        <div className="flex justify-center items-center w-full">
          <nav className="flex flex-wrap justify-center gap-4 lg:gap-7.5 text-sm sm:text-base">
            <NavLink href="/" active={pathname === "/"}>
              Inicio
            </NavLink>
            <NavLink href="/FeedTrabajos" active={pathname === "/FeedTrabajos"}>
              Explorar
            </NavLink>
            <NavLink href="/faq" active={pathname === "/faq"}>
              FAQ
            </NavLink>

            {user && (
              <>
                {pathname.startsWith("/trabajador") && (
                  <Link
                    href="/trabajador/panel"
                    className="flex items-center text-[#6c63ff] transition-colors hover:text-[#8b7cff]"
                  >
                    Talent Hub
                  </Link>
                )}

                {user?.rol === "admin" && (
                  <NavLink href="/admin" active={pathname.startsWith("/admin")}>
                    Admin
                  </NavLink>
                )}

                <NavLink href="/messages" active={pathname === "/messages"}>
                  Mensajes
                </NavLink>

                <NavLink href="/profile" active={pathname === "/profile"}>
                  Perfil
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* AUTH */}
        <div className="flex justify-center lg:justify-end items-center gap-4 w-full">
          <div>
            <ThemeToggle />
          </div>
          
          {user ? (
            <div className="relative group">
              <button 
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border ${
                  theme === "dark" 
                    ? "bg-[#121212] border-zinc-800 text-white" 
                    : "bg-white border-gray-200 text-black shadow-sm"
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border ${
                    theme === "dark" 
                      ? "bg-[#0a0a0a] border-zinc-800" 
                      : "bg-gray-100 border-gray-200"
                  }`}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Foto perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/svg/userIcon.svg"
                      alt="User Icon"
                      className={`w-4 h-4 opacity-70 ${theme === "light" ? "invert" : ""}`}
                    />
                  )}
                </div>

                <span className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                  Hola,{" "}
                  <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>
                    {user?.first_name
                      ? `${user.first_name.split(" ")[0]} ${user.last_name?.split(" ")[0] || ""}`
                      : user.email}
                  </span>
                </span>
                <ArrowIcon theme={theme} />
              </button>

              <div 
                className={`absolute right-0 mt-2 w-44 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden border ${
                  theme === "dark" ? "bg-[#121212] border-zinc-800" : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-all ${
                    theme === "dark" 
                      ? "text-white hover:text-red-400 hover:bg-white/5" 
                      : "text-gray-800 hover:text-red-600 hover:bg-gray-50"
                  }`}
                >
                  <LogoutIcon />
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link
                href="/login"
                style={{
                  color: pathname === "/login" ? "#6c63ff" : textColor[theme],
                  borderColor: pathname === "/login" ? "#6c63ff" : (theme === "dark" ? "#52525b" : "#d1d5db")
                }}
                className="h-10.5 px-4 border flex items-center justify-center rounded-[10px] text-center transition-all hover:text-[#6c63ff] hover:border-[#6c63ff]"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="h-10.5 px-4 flex items-center justify-center rounded-[10px] text-white transition-all bg-[#6c63ff] hover:bg-[#5b52e5]"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ArrowIcon = ({ theme }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    className={`transition-transform group-hover:rotate-180 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);