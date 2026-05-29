"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function PerfilPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
      className="min-h-screen p-6 md:p-10 transition-all"
      style={{
        background: "var(--bg-main)",
        color: "var(--text-main)",
      }}
    >
      <div
        className="max-w-2xl mx-auto rounded-3xl p-8 border transition-all"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <h1
          className="text-3xl font-extrabold mb-8"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Mi Perfil
        </h1>

        {/* FOTO */}
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>

          <label
            className="
              mt-5
              px-5 py-2.5
              rounded-xl
              bg-[#6c63ff]
              hover:bg-[#5a52d5]
              transition-all
              cursor-pointer
              text-sm
              font-semibold
              text-white
            "
          >
            Cambiar foto

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* INFO */}
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

          {/* WORKER */}
          {user?.rol !== "trabajador" && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/worker"
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-6 py-3
                  rounded-xl
                  font-bold
                  text-white
                  transition-all
                  hover:scale-[1.02]
                "
                style={{
                  background:
                    "linear-gradient(135deg, #A855F7, #6366F1)",
                }}
              >
                ¡Únete como Trabajador!
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}