/*import {

  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "@/firebase/db";
import { auth } from "@/firebase/auth";

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

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

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
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

export const loginWithFacebook = async () => {
  const result = await signInWithPopup(auth, facebookProvider);
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

export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error en Facebook Auth:", error);
    throw error;
  }
};*/