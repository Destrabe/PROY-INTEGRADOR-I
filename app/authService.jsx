import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/firebase/db";
import { auth } from "@/firebase/auth";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  email,
  password,
  firstName,
  lastName,
  rol
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      uid,
      first_name: firstName,
      last_name: lastName,
      email,
      rol,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

const googleProvider = new GoogleAuthProvider();
const facebookProvider  = new FacebookAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        first_name: user.displayName?.split(" ")[0] || "",
        last_name:
          user.displayName?.split(" ").slice(1).join(" ") || "",
        email: user.email,
        rol: "cliente",
        createdAt: new Date(),
      });
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const loginWithFacebook = async () => {
  const result = await signInWithPopup(auth, facebookProvider);

  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      first_name: user.displayName?.split(" ")[0] || "",
      last_name: user.displayName?.split(" ").slice(1).join(" ") || "",
      email: user.email,
      rol: "cliente",
      createdAt: new Date(),
    });
  }

  return user;
};