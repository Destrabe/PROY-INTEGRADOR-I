"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/db";

export function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "solicitudes"),
      orderBy("creadoEn", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),

          creadoEn: doc.data().creadoEn?.toDate?.() ?? new Date(),
        }));
        setSolicitudes(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error al obtener solicitudes:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { solicitudes, loading, error };
}