"use client";

import { useState, useCallback } from "react";
import { contratarTrabajador } from "@/firebase/Contrataciones";

export function useContratar() {
  const [contratando,    setContratando]    = useState(false);
  const [errorContratar, setErrorContratar] = useState(null);

  const contratar = useCallback(async (params) => {
    setContratando(true);
    setErrorContratar(null);

    const result = await contratarTrabajador(params);

    if (!result.success) {
      const msg = result.error?.message ?? "Error al contratar. Intenta nuevamente.";
      setErrorContratar(msg);
    }

    setContratando(false);
    return result;
  }, []);

  return { contratar, contratando, errorContratar };
}