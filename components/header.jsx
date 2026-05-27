"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  if (loading) {
    return (
      <div className="font-sans w-full h-[90px] text-white bg-black">
        <div className="h-full flex items-center px-[60px]">
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
    <div className="font-sans w-full h-[90px] text-white bg-black">
      <div className="h-full flex items-center justify-between px-[60px] py-0">
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

        <div className="flex items-center gap-[20px]">
          {/* Nav links */}
          <div className="flex gap-[30px] text-base">
            <Link
              href="/"
              className={`flex items-center gap-1.5 transition-colors ${pathname === "/" ? "text-[#6c63ff]" : "text-white hover:text-[#6c63ff]"}`}
            >
              <img
                src="/svg/home-svgrepo-com.svg"
                alt=""
                width={16}
                height={16}
                className="invert"
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
                className="invert"
              />
              Explorar
            </Link>
            <Link
              href="/nosotros"
              className={`flex items-center gap-1.5 transition-colors ${pathname === "/nosotros" ? "text-[#6c63ff]" : "text-white hover:text-[#6c63ff]"}`}
            >
              <img
                src="/svg/group-chat-svgrepo-com.svg"
                alt=""
                width={16}
                height={16}
                className="invert"
              />
              Nosotros
            </Link>
            {user && (
              <>
                <Link
                  href="/mensajes"
                  className={`flex items-center gap-1.5 transition-colors ${
                    pathname === "/mensajes"
                      ? "text-[#6c63ff]"
                      : "text-white hover:text-[#6c63ff]"
                  }`}
                >
                  <img
                    src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24"><path d="M4 4h16v12H5.17L4 17.17V4zm2 2v7.17L6.83 12H18V6H6z"/></svg>'
                    alt=""
                    width={16}
                    height={16}
                  />
                  Mensajes
                </Link>

                <Link
                  href="/perfil"
                  className={`flex items-center gap-1.5 transition-colors ${
                    pathname === "/perfil"
                      ? "text-[#6c63ff]"
                      : "text-white hover:text-[#6c63ff]"
                  }`}
                >
                  <img
                    src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>'
                    alt=""
                    width={16}
                    height={16}
                  />
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
