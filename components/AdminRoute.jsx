"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (user.rol !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) return null;

  if (!user || user.rol !== "admin") return null;

  return children;
}