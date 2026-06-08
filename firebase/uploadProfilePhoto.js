import { db } from "@/firebase/db";
import { doc, setDoc } from "firebase/firestore";

export async function uploadProfilePhoto(uid, file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64 = reader.result;

        await setDoc(
          doc(db, "users", uid),
          {
            photoURL: base64,
          },
          { merge: true }
        );

        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}