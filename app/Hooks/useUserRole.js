"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/auth";
import { useUserProfile } from "./useUserProfile";

export function useUserRole() {
  const [user, loadingAuth] = useAuthState(auth);

  
  const { perfil, loading: loadingPerfil } = useUserProfile(
    loadingAuth ? undefined : user?.uid
  );

  return {
    user,
    rol:         perfil.rol,          // "cliente" | "trabajador" | null
    perfil,
    loadingAuth,
    loadingRol:  loadingAuth || loadingPerfil,
  };
}