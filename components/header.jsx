"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Logo = () => (
  <div className="flex items-end font-extrabold text-2xl leading-none text-white font-syne select-none">
    <div className="logo-header-name">Nexora</div>
    <div className="text-[32px] text-[#6c63ff] relative top-[3px]">.</div>
  </div>
);

const NavLink = ({ href, children, active }) => (
  <Link
    href={href}
    className={`flex items-center transition-colors ${
      active ? "text-[#6c63ff]" : "text-zinc-400 hover:text-[#6c63ff]"
    }`}
  >
    {children}
  </Link>
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
      <div className="h-full flex flex-col lg:grid lg:grid-cols-3 items-center px-4 sm:px-6 lg:px-[60px] py-4 gap-4">
        {/* LOGO */}
        <div className="h-full flex items-center justify-center lg:justify-start select-none w-full">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Logo />
          </Link>
        </div>

        {/* NAV */}
        <div className="flex justify-center items-center w-full">
          <nav className="flex flex-wrap justify-center gap-4 lg:gap-[30px] text-sm sm:text-base">
            <NavLink href="/" active={pathname === "/"}>
              Inicio
            </NavLink>
            <NavLink href="/FeedTrabajos" active={pathname === "/FeedTrabajos"}>
              Explorar
            </NavLink>
            <NavLink href="/nosotros" active={pathname === "/nosotros"}>
              Nosotros
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
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all bg-[#121212] border border-zinc-800 text-white">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#0a0a0a] border border-zinc-800">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Foto perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src="./svg/userIcon.svg" alt="User Icon" />
                  )}
                </div>

                  <span className="text-sm text-zinc-400">
                    Hola,{" "}
                    <span className="text-white font-semibold">
                      {user.name || user.email}
                    </span>
                  </span>
                </span>
                <ArrowIcon />
              </button>

              <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden bg-[#121212] border border-zinc-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-all text-white hover:text-red-400"
                >
                  <LogoutIcon />
                  Cerrar sesión
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
                className="px-4 py-2 border border-white/26 rounded-[10px] text-center transition-all text-white hover:text-[#6c63ff]"
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

const ArrowIcon = () => (
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
);
