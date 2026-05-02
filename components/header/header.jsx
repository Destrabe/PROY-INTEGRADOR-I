import "./header.css";
import "@/app/register/register.css";

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
            <div className="menu-option">Inicio</div>
            <div className="menu-option">Explorar</div>
            <div className="menu-option">Mensajes</div>
            <div className="menu-option">Perfil</div>
          </div>
          <div className="separator-container">
            <div className="separator"></div>
          </div>
          <div className="headerButtons">
            <div className="boton-ingresar">Ingresar</div>
            <div className="boton-registrarse">Registarse</div>
          </div>
        </div>
      </div>
    </div>
  );
}
