export default function PrivacyPage() {
  const iconos = {
    informacion: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
    uso: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
    proteccion: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    compartir: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 4" />
        <path d="M15.4 6.5l-6.8 4" />
      </svg>
    ),
    derechos: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    cambios: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 2v6h-6" />
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M3 22v-6h6" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      </svg>
    ),
  };

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: "var(--bg-main)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}>
            <svg width="40" height="40" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold mb-3" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
            Política de Privacidad
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Tu información y seguridad son importantes para nosotros.
          </p>
        </div>

        {/* Contenido */}
        <div className="rounded-3xl p-8 md:p-10" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <p className="leading-8 mb-8" style={{ color: "var(--text-secondary)" }}>
            En Nexora valoramos y protegemos la privacidad de nuestros usuarios...
          </p>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">{iconos.informacion}<h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Información recopilada</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Podemos recopilar información como nombre, correo electrónico, fotografía de perfil y otros datos necesarios...</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">{iconos.uso}<h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Uso de la información</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Utilizamos la información para gestionar cuentas, mejorar la experiencia de usuario...</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">{iconos.proteccion}<h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Protección de datos</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Implementamos medidas de seguridad razonables para proteger la información...</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">{iconos.compartir}<h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Compartición de información</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Nexora no vende ni comparte información personal con terceros...</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">{iconos.derechos}<h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Derechos del usuario</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Los usuarios pueden solicitar la actualización, corrección o eliminación de su información personal...</p>
          </div>

          <div className="rounded-2xl p-6 mt-10" style={{ background: "rgba(var(--accent-rgb), 0.08)", border: "1px solid rgba(var(--accent-rgb), 0.3)" }}>
            <div className="flex items-center gap-3 mb-3">{iconos.cambios}<h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Cambios en esta política</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Esta política puede actualizarse periódicamente...</p>
          </div>
        </div>
      </div>
    </main>
  );
}