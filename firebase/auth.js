import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { app } from "./client";
import { db } from "./db";

export const auth = getAuth(app);

// Iniciar sesión con email y contraseña
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Registro con email y contraseña
export const registerUser = async (email, password, firstName, lastName, rol) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const iniciales = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  await setDoc(doc(db, "users", uid), {
    userId: uid,
    email,
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    iniciales,
    rol,
    avatarUrl: null,
    bio: "",
    disponible: false,
    verificado: false,
    valoracionPromedio: 0,
    totalReseñas: 0,
    totalTrabajos: 0,
    porcentajeExito: 0,
    creadoEn: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { success: true };
};

// Google 
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      userId: user.uid,
      first_name: user.displayName?.split(" ")[0] || "",
      last_name: user.displayName?.split(" ").slice(1).join(" ") || "",
      email: user.email,
      rol: "cliente",
      creadoEn: serverTimestamp(),
    });
  }
  return user;
};

// Facebook 
export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      userId: user.uid,
      first_name: user.displayName?.split(" ")[0] || "",
      last_name: user.displayName?.split(" ").slice(1).join(" ") || "",
      email: user.email,
      rol: "cliente",
      creadoEn: serverTimestamp(),
    });
  }
  return user;
};