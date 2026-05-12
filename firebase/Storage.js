//No Funcional - no implementado
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "@/firebase/client";
 
const storage = getStorage(app);
 
export const subirImagenesSolicitud = (archivos, userId, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!archivos || archivos.length === 0) {
      resolve([]);
      return;
    }
 
    const urls        = new Array(archivos.length).fill(null);
    const progresos   = new Array(archivos.length).fill(0);
    let completados   = 0;
 
    const actualizarProgreso = (idx, pct) => {
      progresos[idx] = pct;
      const promedio = progresos.reduce((a, b) => a + b, 0) / progresos.length;
      onProgress?.(promedio);
    };
 
    archivos.forEach((archivo, idx) => {
      // Nombre único: timestamp + nombre original saneado
      const nombre    = `${Date.now()}_${archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const storageRef = ref(storage, `solicitudes/${userId}/${nombre}`);
      const task       = uploadBytesResumable(storageRef, archivo);
 
      task.on(
        "state_changed",
        (snapshot) => {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          actualizarProgreso(idx, pct);
        },
        (error) => {
          console.error(`[subirImagen] Error en archivo ${idx}:`, error);
          reject(error);
        },
        async () => {
          try {
            const url       = await getDownloadURL(task.snapshot.ref);
            urls[idx]       = url;
            completados    += 1;
            actualizarProgreso(idx, 100);
 
            if (completados === archivos.length) {
              resolve(urls);
            }
          } catch (error) {
            console.error(`[subirImagen] Error al obtener URL ${idx}:`, error);
            reject(error);
          }
        }
      );
    });
  });
};
 
export const subirImagen = (archivo, ruta, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, ruta);
    const task       = uploadBytesResumable(storageRef, archivo);
 
    task.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(pct);
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};
 
export const eliminarImagenPorUrl = async (url) => {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    // Si el archivo ya no existe, no es un error crítico
    if (error.code === "storage/object-not-found") {
      return { success: true };
    }
    console.error("[eliminarImagenPorUrl]", error);
    return { success: false, error };
  }
};
 
export const eliminarImagenesSolicitud = async (urls = []) => {
  if (!urls || urls.length === 0) return;
  await Promise.allSettled(urls.map((url) => eliminarImagenPorUrl(url)));
};