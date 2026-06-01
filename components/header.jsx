"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";
import { usePathname } from "next/navigation";

const Logo = () => (
  <div className="flex items-end font-extrabold text-2xl leading-none text-white font-syne">
    <div className="logo-header-name">Nexora</div>
    <div className="text-[32px] text-[#6c63ff] relative top-[3px]">.</div>
  </div>
);

export default function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="font-sans w-full h-[90px] text-white bg-black">
        <div className="h-full flex items-center px-[60px]">
          <Logo />
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans w-full h-[90px] text-white bg-black">
      <div className="h-full flex items-center justify-between px-[60px] py-0">
        {/* Logo */}
        <div className="h-full flex items-center select-none">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-[20px]">
          {/* Nav links */}
          <div className="flex gap-[30px] text-base">
            <Link
              href="/"
              className={`flex items-center transition-colors ${
                pathname === "/"
                  ? "text-[#6c63ff]"
                  : "text-white hover:text-[#6c63ff]"
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/FeedTrabajos"
              className={`flex items-center transition-colors ${
                pathname === "/FeedTrabajos"
                  ? "text-[#6c63ff]"
                  : "text-white hover:text-[#6c63ff]"
              }`}
            >
              Explorar
            </Link>
            <Link
              href="/nosotros"
              className={`flex items-center transition-colors ${
                pathname === "/nosotros"
                  ? "text-[#6c63ff]"
                  : "text-white hover:text-[#6c63ff]"
              }`}
            >
              Nosotros
            </Link>

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
                <Link
                  href="/mensajes"
                  className={`flex items-center transition-colors ${
                    pathname === "/mensajes"
                      ? "text-[#6c63ff]"
                      : "text-white hover:text-[#6c63ff]"
                  }`}
                >
                  Mensajes
                </Link>

                <Link
                  href="/perfil"
                  className={`flex items-center transition-colors ${
                    pathname === "/perfil"
                      ? "text-[#6c63ff]"
                      : "text-white hover:text-[#6c63ff]"
                  }`}
                >
                  Perfil
                </Link>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="h-[30px] flex justify-center items-center">
            <div className="w-[15px] flex justify-center items-center border-r-2 border-r-[gray] border-solid h-[16px]"></div>
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-[10px]">
              <span className="text-sm text-gray-300">
                Hola,{" "}
                <span className="text-white font-semibold">
                  {user.name || user.email}
                </span>
              </span>
              <button
                onClick={logout}
                className="text-white px-2.5 py-[5px] rounded-lg border border-[gray] hover:border-red-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex gap-[10px]">
              <Link
                href="/login"
                className="text-white px-2.5 py-[5px] transition-colors hover:text-[#6c63ff]"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="text-white px-2.5 py-[5px] rounded-[10px] bg-[#6c63ff] hover:bg-[#5a52d5] transition-colors"
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
