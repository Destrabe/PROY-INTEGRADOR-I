"use client";

import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useNotificaciones } from "@/app/Hooks/useNotificaciones";
import { useMensajesNoLeidos } from "@/app/Hooks/useMsjNL"; 

export default function Header() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { noLeidas } = useNotificaciones(user?.uid ?? null);
  const mensajesNoLeidos = useMensajesNoLeidos(user?.uid);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="font-sans w-full h-[90px] text-white bg-black">
      <div className="h-full flex items-center justify-between px-[60px] py-0">
        <div className="h-full flex items-center select-none">
          <Link
            href="/"
            className="flex items-end font-syne font-extrabold text-2xl leading-none text-white no-underline"
          >
            <div>Nexora</div>
            <div className="text-[32px] text-[#6c63ff] relative top-[3px]">.</div>
          </Link>
        </div>
        <div className="flex items-center gap-[20px]">
          <div className="flex gap-[30px] text-base">
            <Link href="/" className="flex justify-center items-center text-white"> Inicio </Link>
            <Link href="/FeedTrabajos" className="flex justify-center items-center text-white"> Explorar </Link>
            <Link href="/mensajes" className="flex justify-center items-center text-white relative"> Mensajes
              {mensajesNoLeidos > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#6c63ff] text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                  {mensajesNoLeidos > 9 ? "9+" : mensajesNoLeidos}
                </span>
              )}
            </Link>

            {/* Perfil con badge de notificaciones de sistema */}
            {user && (
              <Link href="/perfil" className="flex justify-center items-center text-white relative">
                Perfil
                {noLeidas > 0 && (
                  <span className="absolute -top-2 -right-3 bg-[#6c63ff] text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                    {noLeidas > 9 ? "9+" : noLeidas}
                  </span>
                )}
              </Link>
            )}
          </div>

          <div className="h-[30px] flex justify-center items-center">
            <div className="w-[15px] flex justify-center items-center border-r-2 border-r-[gray] border-solid h-[16px]" />
          </div>

          <div className="flex gap-[10px] items-center">
            {user ? (
              <>
                <span className="text-[#9090a8] text-sm hidden md:block">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white px-2.5 py-[5px] rounded-lg border border-[gray] cursor-pointer bg-transparent hover:border-white transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white px-2.5 py-[5px] rounded-lg border border-[gray]"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="text-white px-2.5 py-[5px] rounded-[10px] bg-[#6c63ff]"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}