import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/db";
import { auth } from "@/firebase/auth";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error };
  }
};

export const registerUser = async (
  email,
  password,
  firstName,
  lastName,
  rol,
  district
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;
    const nombreCompleto = `${firstName} ${lastName}`.trim();
    await updateProfile(userCredential.user, {
      displayName: nombreCompleto,
    });

    const iniciales = `${firstName.trim()[0] ?? ""}${
      lastName.trim()[0] ?? ""
    }`.toUpperCase();

    await setDoc(doc(db, "users", uid), {
      userId:     uid,
      email:      email,
      first_name: firstName.trim(),
      last_name:  lastName.trim(),
      iniciales:  iniciales,
      rol:        rol, 
      district:   district,

      // editable luego en boton editar de perfil) 
      avatarUrl:       null,
      bio:             "",
      disponible:      false,
      disponibilidad:  "",   
      tarifaEstandar:  null, 
      habilidades:     [],   
      portfolioUrl:    null,
      website:         null,

      verificado: false,
      valoracionPromedio: 0,
      totalReseñas:       0,
      totalTrabajos:      0,
      porcentajeExito:    0,
      creadoEn:  serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};