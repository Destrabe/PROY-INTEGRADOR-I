import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from "firebase/auth";
import { app } from "./client";

export const auth = getAuth(app);

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error en Google Auth:", error);
    throw error;
  }
};

export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error en Facebook Auth:", error);
    throw error;
  }
};
export const sendOtpCode = async (email) => {
  const res = await fetch("/api/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
};

export const verifyOtpCode = async (email, code) => {
  const res = await fetch("/api/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
};

export const changePassword = async (email, newPassword) => {
  const res = await fetch("/api/otp/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data;
};