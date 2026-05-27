import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

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

    // GUARDAR EN FIRESTORE
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