export function calculateRevStats(reseñas = []) {
  if (reseñas.length === 0) {
    return { avgCalidad: 0, avgComunicacion: 0, avgPuntualidad: 0, avgPrecio: 0 };
  }
  const total = reseñas.length;
  return {
    avgCalidad: reseñas.reduce((a, r) => a + (r.calidad || 0), 0) / total,
    avgComunicacion: reseñas.reduce((a, r) => a + (r.comunicacion || 0), 0) / total,
    avgPuntualidad: reseñas.reduce((a, r) => a + (r.puntualidad || 0), 0) / total,
    avgPrecio: reseñas.reduce((a, r) => a + (r.precio || 0), 0) / total,
  };
}