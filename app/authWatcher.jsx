"use client";

import { auth } from "../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FirebaseAuthWatcher({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) return null;

  return <>{children}</>;
}
