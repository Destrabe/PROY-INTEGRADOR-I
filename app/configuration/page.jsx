"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function ConfigurationPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [tab, setTab] = useState("perfil");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem("profilePhoto");

    if (savedPhoto) {
      setPreview(savedPhoto);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageBase64 = reader.result;

      localStorage.setItem("profilePhoto", imageBase64);

      setPreview(imageBase64);

      window.dispatchEvent(new Event("profile-photo-updated"));
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{
        background: "var(--bg-main)",
        color: "var(--text-main)",
      }}
    >
      <div
        className="max-w-2xl mx-auto rounded-3xl p-8 border"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <h1
          className="text-3xl font-extrabold mb-8"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Configuración
        </h1>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setTab("perfil")}
            className="px-4 py-2 rounded-xl transition-all"
            style={{
              background:
                tab === "perfil" ? "#6c63ff" : "var(--bg-main)",
              color:
                tab === "perfil" ? "#fff" : "var(--text-main)",
              border: "1px solid var(--border-color)",
            }}
          >
            Perfil
          </button>

          <button
            onClick={() => setTab("apariencia")}
            className="px-4 py-2 rounded-xl transition-all"
            style={{
              background:
                tab === "apariencia"
                  ? "#6c63ff"
                  : "var(--bg-main)",
              color:
                tab === "apariencia"
                  ? "#fff"
                  : "var(--text-main)",
              border: "1px solid var(--border-color)",
            }}
          >
            Apariencia
          </button>
        </div>

        {tab === "perfil" && (
          <>
            <div className="flex flex-col items-center mb-10">
              <div
                className="w-32 h-32 rounded-full overflow-hidden border-4"
                style={{
                  borderColor: "#6c63ff",
                  background: "var(--bg-main)",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Foto perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="52"
                      height="52"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#A78BFA"
                      strokeWidth="1.8"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </div>

              <label className="mt-5 px-5 py-2.5 rounded-xl bg-[#6c63ff] hover:bg-[#5a52d5] cursor-pointer text-white">
                Cambiar foto

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="space-y-5">
              <div>
                <p
                  className="text-sm mb-1"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Nombre
                </p>

                <h2 className="text-xl font-bold">
                  {user?.name || "Usuario"}
                </h2>
              </div>

              <div>
                <p
                  className="text-sm mb-1"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Correo
                </p>

                <h2 className="text-lg">
                  {user?.email || "Sin correo"}
                </h2>
              </div>

              <div>
                <p
                  className="text-sm mb-1"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Rol
                </p>

                <h2 className="text-lg capitalize">
                  {user?.rol || "cliente"}
                </h2>
              </div>

              {user?.rol !== "trabajador" && (
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/worker"
                    className="px-6 py-3 rounded-xl font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg,#A855F7,#6366F1)",
                    }}
                  >
                    ¡Únete como Trabajador!
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {tab === "apariencia" && (
          <div>
            <h2 className="text-xl font-bold mb-5">
              Apariencia
            </h2>

            <div className="flex gap-3">
              <button
                onClick={() => setTheme("light")}
                className="px-5 py-3 rounded-xl"
                style={{
                  background:
                    theme === "light"
                      ? "#6c63ff"
                      : "var(--bg-main)",
                  color:
                    theme === "light"
                      ? "#fff"
                      : "var(--text-main)",
                  border: "1px solid var(--border-color)",
                }}
              >
                Claro
              </button>

              <button
                onClick={() => setTheme("dark")}
                className="px-5 py-3 rounded-xl"
                style={{
                  background:
                    theme === "dark"
                      ? "#6c63ff"
                      : "var(--bg-main)",
                  color:
                    theme === "dark"
                      ? "#fff"
                      : "var(--text-main)",
                  border: "1px solid var(--border-color)",
                }}
              >
                Oscuro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}