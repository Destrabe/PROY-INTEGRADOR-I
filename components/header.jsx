"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const { user, logout, loading } = useAuth();

  const [profilePhoto, setProfilePhoto] = useState(null);

  const pathname = usePathname();

  useEffect(() => {
    const loadPhoto = () => {
      const savedPhoto = localStorage.getItem("profilePhoto");

      if (savedPhoto) {
        setProfilePhoto(savedPhoto);
      }
    };

    loadPhoto();

    window.addEventListener("profile-photo-updated", loadPhoto);

    return () => {
      window.removeEventListener("profile-photo-updated", loadPhoto);
    };
  }, []);

  if (loading) {
    return (
      <div
        className="font-sans w-full lg:h-[90px] py-3 lg:py-0"
        style={{
          background: "var(--bg-main)",
          color: "var(--text-main)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="h-full flex items-center px-4 sm:px-6 lg:px-[60px]">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-base"
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="font-sans w-full lg:h-[90px] py-3 lg:py-0 transition-all"
      style={{
        background: "var(--bg-main)",
        color: "var(--text-main)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[60px] py-4 gap-4">
        {/* LOGO */}
        <div className="h-full flex items-center select-none">
          <Link
            href="/"
            className="flex items-center gap-2"
            style={{
              color: "var(--text-main)",
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-extrabold text-sm"
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
          {/* NAV */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-[30px] text-sm sm:text-base">
            {/* INICIO */}
            <Link
              href="/"
              className="flex items-center gap-1.5 transition-all hover:text-[#6c63ff]"
              style={{
                color:
                  pathname === "/"
                    ? "#6c63ff"
                    : "var(--text-main)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z" />
              </svg>

              Inicio
            </Link>

            {/* EXPLORAR */}
            <Link
              href="/FeedTrabajos"
              className="flex items-center gap-1.5 transition-all hover:text-[#6c63ff]"
              style={{
                color:
                  pathname === "/FeedTrabajos"
                    ? "#6c63ff"
                    : "var(--text-main)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
              </svg>

              Explorar
            </Link>

            {/* FAQ */}
            <Link
              href="/faq"
              className="flex items-center gap-1.5 transition-all hover:text-[#6c63ff]"
              style={{
                color:
                  pathname === "/faq"
                    ? "#6c63ff"
                    : "var(--text-main)",
              }}
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
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.82 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>

              FAQ
            </Link>

            {user && (
              <>
                {/* MENSAJES */}
                <Link
                  href="/messages"
                  className="flex items-center gap-1.5 transition-all hover:text-[#6c63ff]"
                  style={{
                    color:
                      pathname === "/messages"
                        ? "#6c63ff"
                        : "var(--text-main)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16v12H5.17L4 17.17V4zm2 2v7.17L6.83 12H18V6H6z" />
                  </svg>

                  Mensajes
                </Link>

                {/* PERFIL */}
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 transition-all hover:text-[#6c63ff]"
                  style={{
                    color:
                      pathname === "/profile"
                        ? "#6c63ff"
                        : "var(--text-main)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                  </svg>

                  Perfil
                </Link>
              </>
            )}
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:flex h-[30px] justify-center items-center">
            <div
              className="w-[15px] h-[16px] border-r-2"
              style={{
                borderColor: "var(--border-color)",
              }}
            />
          </div>

          {/* AUTH */}
          {user ? (
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-main)",
                }}
              >
                {/* FOTO */}
                <div
                  className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
                  style={{
                    background: "var(--bg-main)",
                    border: "1px solid var(--border-color)",
                  }}
                >
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

                <span
                  className="text-sm"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Hola,{" "}
                  <span
                    style={{
                      color: "var(--text-main)",
                      fontWeight: "600",
                    }}
                  >
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
                  className="transition-transform group-hover:rotate-180"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* DROPDOWN */}
              <div
                className="absolute right-0 mt-2 w-44 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-all hover:text-red-400"
                  style={{
                    color: "var(--text-main)",
                  }}
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
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link
                href="/login"
                className="px-4 py-2 text-center transition-all hover:text-[#6c63ff]"
                style={{
                  color: "var(--text-main)",
                }}
              >
                Iniciar Sesión
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 text-center rounded-[10px] text-white transition-all"
                style={{
                  background: "#6c63ff",
                }}
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