"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexora_user");
      if (saved) setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem("nexora_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    const newUser = {
      uid:   userData.uid,
      name:  `${userData.first_name} ${userData.last_name}`,
      email: userData.email,
      rol:   userData.rol || "cliente",
    };
    setUser(newUser);
    localStorage.setItem("nexora_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nexora_user");
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