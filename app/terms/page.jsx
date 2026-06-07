export default function TermsPage() {
  const iconos = {
    uso: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 2v4M16 2v4" />
      </svg>
    ),
    responsabilidad: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
    conducta: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    modificaciones: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 2v6h-6" />
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M3 22v-6h6" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      </svg>
    ),
    aceptacion: (
      <svg width="24" height="24" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
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
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold mb-3" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>
            Términos y Condiciones
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Conoce las reglas y responsabilidades para utilizar Nexora.
          </p>
        </div>

        {/* Contenido */}
        <div className="rounded-3xl p-8 md:p-10" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <p className="leading-8 mb-8" style={{ color: "var(--text-secondary)" }}>
            Bienvenido a Nexora. Al crear una cuenta y utilizar nuestra plataforma aceptas los siguientes términos y condiciones.
          </p>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">{iconos.uso}<h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Uso de la plataforma</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Nexora permite publicar, buscar y gestionar oportunidades laborales y servicios profesionales entre usuarios.</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">{iconos.responsabilidad}<h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Responsabilidad del usuario</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Cada usuario es responsable de la información que comparte dentro de la plataforma y debe proporcionar datos reales y actualizados.</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">{iconos.conducta}<h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Conducta adecuada</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Está prohibido publicar contenido ofensivo, engañoso, discriminatorio, ilegal o que vulnere derechos de terceros.</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">{iconos.modificaciones}<h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Modificaciones</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Nexora podrá actualizar estos términos para mejorar el servicio o adaptarse a nuevas obligaciones legales.</p>
          </div>

          <div className="rounded-2xl p-6 mt-10" style={{ background: "rgba(var(--accent-rgb), 0.08)", border: "1px solid rgba(var(--accent-rgb), 0.3)" }}>
            <div className="flex items-center gap-3 mb-3">{iconos.aceptacion}<h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-syne), sans-serif", color: "var(--text-main)" }}>Aceptación de los términos</h2></div>
            <p className="leading-7" style={{ color: "var(--text-secondary)" }}>Al registrarte y utilizar Nexora confirmas que has leído, comprendido y aceptado estos términos y condiciones.</p>
          </div>
        </div>
      </div>
    </main>
  );
}