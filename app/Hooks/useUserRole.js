"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useUserProfile } from "./useUserProfile";

export function useUserRole() {
  const [user, loadingAuth] = useAuthState(auth);
  const { perfil, loading: loadingPerfil, refetch } = useUserProfile(loadingAuth ? undefined : user?.uid);

  return {
    user,
    rol: perfil?.rol ?? null,
    perfil,
    loadingAuth,
    loadingRol: loadingAuth || loadingPerfil,
    refetch,
    isAdmin: perfil?.rol === "admin",
  };
}