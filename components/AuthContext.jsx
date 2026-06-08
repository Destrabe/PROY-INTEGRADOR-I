"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/firebase/auth";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase/db";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("FIREBASE USER:", firebaseUser);

      const expiration = localStorage.getItem("sessionExpiration");

      if (firebaseUser && expiration && Date.now() > Number(expiration)) {
        signOut(auth);
        localStorage.removeItem("sessionExpiration");
        setUser(null);
        setLoading(false);
        return;
      }

      if (firebaseUser) {
        const savedRole =
          localStorage.getItem(`role_${firebaseUser.uid}`) || "cliente";

        const savedFirstName =
          localStorage.getItem(`firstName_${firebaseUser.uid}`) || "";

        const savedLastName =
          localStorage.getItem(`lastName_${firebaseUser.uid}`) || "";

        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let firestorePhoto = null;

        if (userSnap.exists()) {
          firestorePhoto = userSnap.data().photoURL || null;
        }

        setUser({
          uid: firebaseUser.uid,
          first_name: savedFirstName,
          last_name: savedLastName,
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          rol: savedRole,
          photoURL: firestorePhoto,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    const role = userData.rol || "cliente";

    localStorage.setItem(`role_${userData.uid}`, role);

    localStorage.setItem(
      `firstName_${userData.uid}`,
      userData.first_name || "",
    );

    localStorage.setItem(`lastName_${userData.uid}`, userData.last_name || "");

    const newUser = {
      uid: userData.uid,
      first_name: userData.first_name,
      last_name: userData.last_name,
      name: `${userData.first_name} ${userData.last_name}`,
      email: userData.email,
      rol: role,
      photoURL: userData.photoURL || null,
    };

    setUser(newUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.rol === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    return {
      user: null,
      login: () => {},
      logout: () => {},
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
    };
  }

  return context;
}
