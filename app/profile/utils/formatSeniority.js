export function formatSeniority(creadoEn) {
  if (!creadoEn) return "";
  let date;
  if (typeof creadoEn.toDate === "function") date = creadoEn.toDate();
  else if (creadoEn instanceof Date) date = creadoEn;
  else date = new Date(creadoEn);

  const diffDias = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
  const diffMeses = Math.floor(diffDias / 30);
  const diffAnios = Math.floor(diffDias / 365);

  if (diffAnios > 0) return `${diffAnios} ${diffAnios === 1 ? "año" : "años"}`;
  if (diffMeses > 0) return `${diffMeses} ${diffMeses === 1 ? "mes" : "meses"}`;
  return `${diffDias} ${diffDias === 1 ? "día" : "días"}`;
}