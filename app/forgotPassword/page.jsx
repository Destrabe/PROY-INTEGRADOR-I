import { useState, useRef, useEffect } from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

/* ── Icons ── */
const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);
const LockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const EyeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 01-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const ChevronLeft = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const AlertIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const ShieldIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

/* ── Step dots ── */
const Steps = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {[1, 2, 3].map((s) => (
      <div key={s} className="flex items-center gap-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            s < current && "bg-purple-400 w-2 h-2",
            s === current && "bg-white w-3 h-3",
            s > current && "bg-white/20",
          )}
        />
        {s < 3 && (
          <div
            className={cn(
              "w-8 h-px transition-all duration-500",
              s < current ? "bg-purple-400" : "bg-white/15",
            )}
          />
        )}
      </div>
    ))}
  </div>
);

/* ── Alert ── */
const Alert = ({ msg }) =>
  msg ? (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
      <AlertIcon />
      <span>{msg}</span>
    </div>
  ) : null;

/* ── Input with left icon ── */
const IconInput = ({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  onKeyDown,
  autoComplete,
}) => (
  <div className="mb-4">
    <label className="block text-[13px] font-semibold text-white mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoComplete={autoComplete}
        className="w-full pl-10 pr-4 py-3 bg-[#1a1a2e]/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 outline-none transition-all duration-200 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/15"
      />
    </div>
  </div>
);

/* ── Password input ── */
const PasswordInput = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-white mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
          <LockIcon />
        </span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-[#1a1a2e]/80 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 outline-none transition-all duration-200 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/15"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

/* ── Strength bar ── */
const StrengthBar = ({ pw }) => {
  if (!pw) return null;
  const checks = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ];
  const score = checks.filter(Boolean).length;
  const colors = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-emerald-400",
  ];
  const labels = ["", "Débil", "Regular", "Buena", "Muy segura"];
  return (
    <div className="-mt-2 mb-4">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-[3px] rounded-full transition-all duration-300",
              i < score ? colors[score - 1] : "bg-white/10",
            )}
          />
        ))}
      </div>
      <p className="text-[11px] text-white/40">{labels[score]}</p>
    </div>
  );
};

/* ── Primary gradient button ── */
const GradBtn = ({ children, onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!!loading}
    className="w-full py-3 rounded-xl text-white font-bold text-[15px] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 mt-1"
    style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5)" }}
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        {loading}
      </span>
    ) : (
      children
    )}
  </button>
);

/* ── Back link ── */
const BackLink = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center gap-1 w-full mt-5 text-[13px] text-white/35 hover:text-white/70 transition-colors group"
  >
    <span className="group-hover:-translate-x-0.5 transition-transform">
      <ChevronLeft />
    </span>
    {children}
  </button>
);

/* ═══ STEP 1 — Email ═══ */
const StepEmail = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const submit = () => {
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    setLoading("Enviando…");
    setTimeout(() => {
      setLoading("");
      onNext(email);
    }, 1200);
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-purple-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        >
          <MailIcon />
        </div>
      </div>
      <h1
        className="text-[26px] font-black text-white text-center mb-1 tracking-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        ¿Olvidaste tu contraseña?
      </h1>
      <p className="text-white/45 text-[13px] text-center mb-7">
        Te enviaremos un código a tu correo
      </p>
      <Alert msg={error} />
      <IconInput
        label="Correo electrónico"
        icon={<MailIcon />}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        autoComplete="email"
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <GradBtn onClick={submit} loading={loading}>
        Enviar código
      </GradBtn>
      <BackLink onClick={() => alert("Volviendo a inicio de sesión…")}>
        Volver a inicio de sesión
      </BackLink>
    </div>
  );
};

/* ═══ STEP 2 — OTP ═══ */
const DEMO_CODE = "123456";

const StepOtp = ({ email, onNext, onBack }) => {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
    const iv = setInterval(
      () =>
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(iv);
            setCanResend(true);
            return 0;
          }
          return t - 1;
        }),
      1000,
    );
    return () => clearInterval(iv);
  }, []);

  const handleDigit = (i, val) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0)
      refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length) {
      e.preventDefault();
      const next = [...digits];
      [...text].forEach((c, j) => (next[j] = c));
      setDigits(next);
      refs.current[Math.min(5, text.length - 1)]?.focus();
    }
  };

  const verify = () => {
    const code = digits.join("");
    setError("");
    if (code.length < 6) {
      setError("Ingresa el código completo de 6 dígitos.");
      return;
    }
    setLoading("Verificando…");
    setTimeout(() => {
      setLoading("");
      if (code === DEMO_CODE) onNext();
      else {
        setError("Código incorrecto. Inténtalo de nuevo.");
        setDigits(Array(6).fill(""));
        setTimeout(() => refs.current[0]?.focus(), 50);
      }
    }, 900);
  };

  const resend = () => {
    setDigits(Array(6).fill(""));
    setCanResend(false);
    setTimer(60);
    const iv = setInterval(
      () =>
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(iv);
            setCanResend(true);
            return 0;
          }
          return t - 1;
        }),
      1000,
    );
    refs.current[0]?.focus();
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-purple-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        >
          <ShieldIcon />
        </div>
      </div>
      <h1
        className="text-[26px] font-black text-white text-center mb-1 tracking-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Verifica tu identidad
      </h1>
      <p className="text-white/45 text-[13px] text-center mb-7">
        Código enviado a{" "}
        <span className="text-white/70 font-medium">{email}</span>
      </p>
      <Alert msg={error} />
      <div className="flex gap-2 mb-3" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleDigit(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            className={cn(
              "w-full h-13 text-center text-xl font-bold rounded-xl border outline-none transition-all duration-200",
              "bg-[#1a1a2e]/80 text-white",
              d
                ? "border-purple-500/70 ring-2 ring-purple-500/15"
                : "border-white/10",
              "focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/15",
            )}
            style={{ height: "52px" }}
          />
        ))}
      </div>
      <p className="text-[12px] text-white/35 text-center mb-5">
        ¿No recibiste el código?{" "}
        {canResend ? (
          <button
            type="button"
            onClick={resend}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Reenviar
          </button>
        ) : (
          <span>
            Reenviar en <strong className="text-white/55">{timer}s</strong>
          </span>
        )}
      </p>
      <GradBtn onClick={verify} loading={loading}>
        Verificar código
      </GradBtn>
      <BackLink onClick={onBack}>Cambiar correo</BackLink>
    </div>
  );
};

/* ═══ STEP 3 — New password ═══ */
const StepNewPassword = ({ onNext }) => {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  const save = () => {
    setError("");
    if (pw1.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (pw1 !== pw2) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    onNext();
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-purple-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        >
          <LockIcon />
        </div>
      </div>
      <h1
        className="text-[26px] font-black text-white text-center mb-1 tracking-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Nueva contraseña
      </h1>
      <p className="text-white/45 text-[13px] text-center mb-7">
        Elige una contraseña segura
      </p>
      <Alert msg={error} />
      <PasswordInput
        label="Nueva contraseña"
        value={pw1}
        onChange={(e) => setPw1(e.target.value)}
        placeholder="Mínimo 8 caracteres"
      />
      <StrengthBar pw={pw1} />
      <PasswordInput
        label="Confirmar contraseña"
        value={pw2}
        onChange={(e) => setPw2(e.target.value)}
        placeholder="Repite la contraseña"
      />
      <GradBtn onClick={save}>Guardar contraseña</GradBtn>
    </div>
  );
};

/* ═══ STEP 4 — Success ═══ */
const StepSuccess = () => (
  <div className="text-center py-2">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))",
        border: "1px solid rgba(16,185,129,0.3)",
      }}
    >
      <span className="text-emerald-400">
        <CheckIcon />
      </span>
    </div>
    <h1
      className="text-[26px] font-black text-white text-center mb-2 tracking-tight"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      ¡Listo!
    </h1>
    <p className="text-white/45 text-[13px] text-center mb-7 leading-relaxed">
      Tu contraseña fue actualizada exitosamente.
      <br />
      Ya puedes iniciar sesión.
    </p>
    <GradBtn onClick={() => alert("Redirigiendo…")}>
      Ir a inicio de sesión
    </GradBtn>
  </div>
);

/* ═══ ROOT ═══ */
export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #050508; min-height: 100vh; font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center px-4 bg-[#050508]">
        <div className="w-full max-w-[420px]">
          {/* Card */}
          <div
            className="rounded-2xl px-8 py-9"
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Step dots */}
            {step < 4 && <Steps current={step} />}

            {step === 1 && (
              <StepEmail
                onNext={(e) => {
                  setEmail(e);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <StepOtp
                email={email}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && <StepNewPassword onNext={() => setStep(4)} />}
            {step === 4 && <StepSuccess />}

            {/* Divider + social — only step 1 */}
            {step === 1 && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-[11px] text-white/30 uppercase tracking-widest">
                    o continúa con
                  </span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>
                <div className="flex gap-3">
                  {[
                    {
                      name: "Google",
                      logo: (
                        <svg width="16" height="16" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      ),
                    },
                    {
                      name: "Facebook",
                      logo: (
                        <svg width="16" height="16" viewBox="0 0 24 24">
                          <path
                            fill="#1877F2"
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                          />
                        </svg>
                      ),
                    },
                  ].map(({ name, logo }) => (
                    <button
                      key={name}
                      type="button"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:bg-white/8 active:scale-[0.98]"
                      style={{
                        background: "#1a1a28",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {logo}
                      {name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Footer */}
            <p className="text-center text-[13px] text-white/35 mt-6">
              ¿No tienes una cuenta?{" "}
              <a
                href="#"
                className="font-semibold"
                style={{ color: "#818cf8" }}
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
