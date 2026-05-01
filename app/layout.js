export const metadata = {
  title: "Nexora",
  description:
    "Plataforma web basada en microservicios para la gestión eficiente de usuarios y operaciones digitales.",
  keywords: ["Nexora", "microservicios", "next.js"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
