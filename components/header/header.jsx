import "./header.css";
import "@/app/register/register.css";
import Link from "next/link";

export default function Header() {
  return (
    <div className="header">
      <div className="headerContainer">
        <div className="headerContainer-logo">
          <div className="logo-header">
            <div className="logo-header">Nexora</div>
            <div className="logo-header-point">.</div>
          </div>
        </div>
        <div className="options">
          <div className="menu">
            <Link href="/" className="menu-option">
              Inicio
            </Link>
            <Link href="#" className="menu-option">
              Explorar
            </Link>
            <Link href="#" className="menu-option">
              Mensajes
            </Link>
            <Link href="#" className="menu-option">
              Perfil
            </Link>
          </div>
          <div className="separator-container">
            <div className="separator"></div>
          </div>
          <div className="headerButtons">
            <Link href="/login" className="boton-ingresar">
              Ingresar
            </Link>
            <Link href="/register" className="boton-registrarse">
              Registarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
