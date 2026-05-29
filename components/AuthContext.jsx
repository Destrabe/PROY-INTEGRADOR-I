"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/firebase/auth";
import { signOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    const newUser = {
      uid: userData.uid,
      name: `${userData.first_name} ${userData.last_name}`,
      email: userData.email,
      rol: userData.rol || "cliente",
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
