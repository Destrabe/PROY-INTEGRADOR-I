"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log("USER:", user);
  console.log("LOADING:", loading);

  useEffect(() => {
    if (!loading && !user) {
      console.log("REDIRIGIENDO A LOGIN");
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Cargando...</div>;

  if (!user) return null;

  return children;
}