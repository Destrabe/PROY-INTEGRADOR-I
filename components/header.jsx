"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  if (loading) {
    return (
      <div className="font-sans w-full lg:h-[90px] text-white bg-black py-3 lg:py-0">
        <div className="h-full flex items-center px-4 sm:px-6 lg:px-[60px]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#6c63ff] flex items-center justify-center text-white font-extrabold text-base">
              N
            </div>
            <span className="font-syne font-extrabold text-xl tracking-tight text-[#6c63ff]">
              Nexora
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans w-full lg:h-[90px] text-white bg-black py-3 lg:py-0">
      <div className="h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[60px] py-4 gap-4">
        {/* Logo */}
        <div className="h-full flex items-center select-none">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-extrabold text-sm select-none"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed, #6c63ff, #4f8ef7)",
              }}
            >
              N
            </div>
            <span
              className="font-syne font-extrabold text-xl tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed, #6c63ff, #4f8ef7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nexora
            </span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-[20px] w-full lg:w-auto">
          {/* Nav links */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-[30px] text-sm sm:text-base">
            <Link
              href="/"
              className={`flex items-center gap-1.5 transition-colors ${pathname === "/" ? "text-[#6c63ff]" : "text-white hover:text-[#6c63ff]"}`}
            >
              <img
                src="/svg/home-svgrepo-com.svg"
                alt=""
                width={16}
                height={16}
                className="invert max-w-full h-auto"
              />
              Inicio
            </Link>
            <Link
              href="/FeedTrabajos"
              className={`flex items-center gap-1.5 transition-colors ${pathname === "/FeedTrabajos" ? "text-[#6c63ff]" : "text-white hover:text-[#6c63ff]"}`}
            >
              <img
                src="/svg/browse-svgrepo-com.svg"
                alt=""
                width={16}
                height={16}
                className="invert max-w-full h-auto"
              />
              Explorar
            </Link>
            <Link
              href="/faq"
              className={`flex items-center gap-1.5 transition-colors ${
                pathname === "/faq"
                  ? "text-[#6c63ff]"
                  : "text-white hover:text-[#6c63ff]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              FAQ
            </Link>
            {user && (
              <>
                {pathname.startsWith("/trabajador") && (
                  <Link
                    href="/trabajador/panel"
                    className="flex items-center gap-1.5 text-[#6c63ff] transition-colors hover:text-[#8b7cff]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" />
                    </svg>
                    Talent Hub
                  </Link>
                )}
                <Link
                  href="/messages"
                  className={`flex items-center gap-1.5 transition-colors ${
                    pathname === "/messages"
                      ? "text-[#6c63ff]"
                      : "text-white hover:text-[#6c63ff]"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4 4h16v12H5.17L4 17.17V4zm2 2v7.17L6.83 12H18V6H6z" />
                  </svg>
                  Mensajes
                </Link>

                <Link
                  href="/profile"
                  className={`flex items-center gap-1.5 transition-colors ${
                    pathname === "/profile"
                      ? "text-[#6c63ff]"
                      : "text-white hover:text-[#6c63ff]"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                  </svg>
                  Perfil
                </Link>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:flex h-[30px] justify-center items-center">
            <div className="w-[15px] border-r-2 border-r-[gray] h-[16px]"></div>
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
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
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link
                href="/login"
                className="text-white px-4 py-2 text-center transition-colors hover:text-[#6c63ff]"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="text-white px-4 py-2 text-center rounded-[10px] bg-[#6c63ff] hover:bg-[#5a52d5] transition-colors"
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
