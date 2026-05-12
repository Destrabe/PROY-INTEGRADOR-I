import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/db";
import { auth } from "@/firebase/auth";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
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
  rol,
  district,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      userId: uid,
      email,
      first_name: firstName,
      last_name: lastName,
      rol: rol,
      district: district,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const createRequest = async (requestData) => {
  try {
    const user = auth.currentUser;
    const docRef = await addDoc(collection(db, "solicitudes"), {
      userId: user?.uid || null,
      ...requestData,
      creadoEn: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error };
  }
};
