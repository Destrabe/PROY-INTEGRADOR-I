"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Logo = () => (
  <div className="flex items-end font-extrabold text-2xl leading-none text-white font-syne">
    <div className="logo-header-name">Nexora</div>
    <div className="text-[32px] text-[#6c63ff] relative top-[3px]">.</div>
  </div>
);

export default function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="font-sans w-full h-[90px] text-white bg-[#0a0a0a]">
        <div className="h-full flex items-center px-[60px]">
          <Logo />
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans w-full lg:h-[90px] py-3 lg:py-0 transition-all bg-[#0a0a0a] text-white border-b border-zinc-800">
      <div className="h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[60px] py-4 gap-4">
        {/* LOGO */}
        <div className="h-full flex items-center select-none">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-[32px] w-full lg:w-auto">
          {/* NAV */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm sm:text-base">
            {/* INICIO */}
            <button
              onClick={() => router.push("/")}
              className={`flex items-center gap-2 transition-colors cursor-pointer ${
                pathname === "/"
                  ? "text-[#6c63ff]"
                  : "text-zinc-400 hover:text-[#6c63ff]"
              }`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
              </svg>
              Inicio
            </button>

            {/* EXPLORAR */}
            <button
              onClick={() => router.push("/FeedTrabajos")}
              className={`flex items-center gap-2 transition-colors cursor-pointer ${
                pathname === "/FeedTrabajos"
                  ? "text-[#6c63ff]"
                  : "text-zinc-400 hover:text-[#6c63ff]"
              }`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Explorar
            </button>

            {/* FAQ */}
            <button
              onClick={() => router.push("/faq")}
              className={`flex items-center gap-2 transition-colors cursor-pointer ${
                pathname === "/faq"
                  ? "text-[#6c63ff]"
                  : "text-zinc-400 hover:text-[#6c63ff]"
              }`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 115.82 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              FAQ
            </button>
          </div>
         
          {/* AUTH */}
          {user ? (
            <>
              <div className="flex items-center gap-6">
                {/* MENSAJES */}
                <button
                  onClick={() => router.push("/messages")}
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    pathname === "/messages"
                      ? "text-[#6c63ff]"
                      : "text-zinc-400 hover:text-[#6c63ff]"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Mensajes
                </button>

                {/* CONFIGURATION */}
                <button
                  onClick={() => router.push("/configuration")}
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    pathname === "/configuration"
                      ? "text-[#6c63ff]"
                      : "text-zinc-400 hover:text-[#6c63ff]"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Configuración
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all bg-[#121212] border border-zinc-800 text-white">
                  {/* FOTO */}
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#0a0a0a] border border-zinc-800">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Foto perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="#A78BFA"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 21a8 8 0 0 0-16 0" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>

                  <span className="text-sm text-zinc-400">
                    Hola,{" "}
                    <span className="text-white font-semibold">
                      {user.name || user.email}
                    </span>
                  </span>

                  {/* FLECHA */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="transition-transform group-hover:rotate-180 text-zinc-400"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* DROPDOWN */}
                <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden bg-[#121212] border border-zinc-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-all text-white hover:text-red-400"
                  >
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
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link
                href="/login"
                className="px-4 py-2 text-center transition-all text-white hover:text-[#6c63ff]"
              >
                Iniciar Sesión
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 text-center rounded-[10px] text-white transition-all bg-[#6c63ff] hover:bg-[#5b52e5]"
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
