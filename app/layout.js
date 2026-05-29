import "./globals.css";
import { DM_Sans, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/components/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const dm_sans = DM_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
  variable: "--font-syne",
});

export const metadata = {
  title: "Nexora",
  description:
    "Plataforma web basada en microservicios para la gestión eficiente de usuarios y operaciones digitales.",
  keywords: ["Nexora", "microservicios", "next.js"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`
    ${dm_sans.variable}
    ${syne.variable}
    overflow-x-hidden
  `}
      >
        <ThemeProvider>
          <AuthProvider>
            <Header />

            {children}

            <Footer />

            <ThemeSwitcher />

            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
