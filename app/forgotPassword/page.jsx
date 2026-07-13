"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendOtpCode, verifyOtpCode, changePassword } from "@/firebase/auth";
import Image from "next/image";
import { useThemeStore } from "@/store/themeStore"; // <-- Importamos tu store

/* ── Steps ── */
const Steps = ({ current, theme }) => {
  const steps = [
    { id: 1, label: "Correo" },
    { id: 2, label: "Verificar" },
    { id: 3, label: "Nueva clave" },
  ];
  return (
    <div className="flex items-start mb-7">
      {steps.map((s, i) => {
        const done = s.id < current;
        const active = s.id === current;
        return (
          <div
            key={s.id}
            className="flex-1 flex flex-col items-center relative"
          >
            {i < steps.length - 1 && (
              <div
                className={`absolute top-3.25eft-[calc(50%+13px)] right-[calc(-50%+13px)] h-px transition-all duration-500 
                ${done ? "bg-[#635bff]" : theme === "dark" ? "bg-[#2A2A38]" : "bg-[#e4e4e7]"}`}
              />
            )}
            <div
              className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[11px] font-semibold border z-10 transition-all duration-300
              ${done ? "bg-[#635bff] border-[#635bff] text-white" : ""}
              ${active ? "bg-[#635bff]/20 border-[#635bff] text-[#635bff] shadow-[0_0_10px_rgba(99,91,255,0.35)]" : ""}
              ${!done && !active ? (theme === "dark" ? "bg-[#22222C] border-[#2A2A38] text-[#606078]" : "bg-[#f4f4f5] border-[#e4e4e7] text-[#94a3b8]") : ""}
            `}
            >
              {done ? "✓" : s.id}
            </div>
            <span
              className={`text-[10px] mt-1 whitespace-nowrap transition-colors duration-300
              ${done ? "text-[#635bff]" : active ? (theme === "dark" ? "text-[#F0F0F8]" : "text-[#18181b]") : theme === "dark" ? "text-[#606078]" : "text-[#94a3b8]"}
            `}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ── Error alert ── */
const ErrorAlert = ({ msg }) =>
  msg ? (
    <p className="text-red-400 text-sm text-center mb-4 bg-red-500/10 py-2.5 px-4 rounded-xl border border-red-500/20">
      {msg}
    </p>
  ) : null;

/* ── Input con ícono ── */
const FieldInput = ({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  onKeyDown,
  autoComplete,
  theme,
}) => (
  <div className="mb-4 flex flex-col gap-2">
    <label
      className={`text-sm font-bold font-body transition-colors ${theme === "dark" ? "text-[#9090A8]" : "text-[#64748b]"}`}
    >
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606078]">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoComplete={autoComplete}
        className={`w-full h-13 pl-9 pr-4 py-3 border-2 rounded-xl text-sm font-light outline-none transition-all duration-200 focus:border-[#635bff]/60 focus:shadow-[0_0_0_3px_rgba(99,91,255,0.12)] font-body
        ${theme === "dark" ? "bg-[#22222C] border-white/10 text-[#F0F0F8] placeholder:text-[#5a5a6a] focus:bg-[#1a1a22]" : "bg-[#f4f4f5] border-black/5 text-[#18181b] placeholder:text-[#94a3b8] focus:bg-white"}`}
      />
    </div>
  </div>
);

/* ── Password input con toggle ── */
const PasswordField = ({
  label,
  value,
  onChange,
  placeholder,
  onKeyDown,
  theme,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-4 flex flex-col gap-2">
      <label
        className={`text-sm font-bold font-body transition-colors ${theme === "dark" ? "text-[#9090A8]" : "text-[#64748b]"}`}
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606078]">
          <Image
            src="/svg/lockIcon.svg"
            alt="lock"
            className={`object-contain ${theme === "light" ? "invert opacity-50" : ""}`}
            width={16}
            height={16}
          />
        </span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          className={`w-full h-13 pl-9 pr-10 py-3 border-2 rounded-xl text-sm font-light outline-none transition-all duration-200 focus:border-[#635bff]/60 focus:shadow-[0_0_0_3px_rgba(99,91,255,0.12)] font-body
          ${theme === "dark" ? "bg-[#22222C] border-white/10 text-[#F0F0F8] placeholder:text-[#5a5a6a] focus:bg-[#1a1a22]" : "bg-[#f4f4f5] border-black/5 text-[#18181b] placeholder:text-[#94a3b8] focus:bg-white"}`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${theme === "dark" ? "text-[#606078] hover:text-[#9090A8]" : "text-[#94a3b8] hover:text-[#64748b]"}`}
        >
          {show ? (
            <Image
              src="/svg/eyeIconOff.svg"
              alt="eye off"
              className={`object-contain ${theme === "light" ? "invert opacity-50" : ""}`}
              width={16}
              height={16}
            />
          ) : (
            <Image
              src="/svg/eyeIconOn.svg"
              alt="eye on"
              className={`object-contain ${theme === "light" ? "invert opacity-50" : ""}`}
              width={16}
              height={16}
            />
          )}
        </button>
      </div>
    </div>
  );
};

/* ── Barra de fortaleza ── */
const StrengthBar = ({ pw, theme }) => {
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
  const textColors = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-500",
    "text-emerald-500",
  ];
  const labels = ["", "Débil", "Regular", "Buena", "Muy segura"];
  return (
    <div className="-mt-1 mb-4">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 h-0.75 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : theme === "dark" ? "bg-[#2A2A38]" : "bg-[#e4e4e7]"}`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-[11px] ${textColors[score - 1]}`}>
          {labels[score]}
        </p>
      )}
    </div>
  );
};

/* ── Botón principal ── */
const PrimaryBtn = ({ children, onClick, loading, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading || disabled}
    className="w-full h-13 rounded-xl text-sm font-bold text-white transition-all duration-200 bg-linear-to-br from-[#6C63FF] to-[#9B59B6] hover:shadow-[0_0_32px_rgba(99,91,255,0.4)] hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer font-body"
  >
    {loading ? (
      <>
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        {loading}
      </>
    ) : (
      children
    )}
  </button>
);

/* ── Back link ── */
const BackLink = ({ onClick, children, theme }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-1.5 w-full mt-5 text-sm transition-colors group font-body ${theme === "dark" ? "text-[#9090A8] hover:text-[#F0F0F8]" : "text-[#64748b] hover:text-[#18181b]"}`}
  >
    <span className="group-hover:-translate-x-0.5 transition-transform">
      <Image
        src="/svg/chevronLeftIcon.svg"
        alt="chevron left"
        className={`object-contain ${theme === "light" ? "invert opacity-50" : ""}`}
        width={14}
        height={14}
      />
    </span>
    {children}
  </button>
);

/* STEP 1 — Correo */
const StepEmail = ({ onNext, theme }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const submit = async () => {
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    setLoading("Enviando...");
    try {
      await sendOtpCode(email);
      onNext(email);
    } catch (err) {
      const msgs = {
        "auth/user-not-found": "No existe una cuenta con ese correo.",
        "auth/invalid-email": "Correo no válido.",
        "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
      };
      setError(msgs[err.code] || "Error al enviar el código.");
    } finally {
      setLoading("");
    }
  };

  return (
    <>
      <h1
        className={`font-extrabold text-2xl sm:text-3xl mb-1 text-center font-display tracking-tight transition-colors ${theme === "dark" ? "text-[#F0F0F8]" : "text-[#18181b]"}`}
      >
        Recuperar contraseña
      </h1>
      <p
        className={`text-sm text-center mb-6 transition-colors ${theme === "dark" ? "text-[#9090A8]" : "text-[#64748b]"}`}
      >
        Ingresa tu correo y te enviaremos un código
      </p>
      <ErrorAlert msg={error} />
      <FieldInput
        label="Correo electrónico"
        theme={theme}
        icon={
          <Image
            src="/svg/mailIcon.svg"
            alt="mailIcon"
            className={`object-contain ${theme === "light" ? "invert opacity-50" : ""}`}
            width={16}
            height={16}
          />
        }
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        autoComplete="email"
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <PrimaryBtn onClick={submit} loading={loading}>
        Enviar código
      </PrimaryBtn>
      <BackLink onClick={() => window.history.back()} theme={theme}>
        Volver a inicio de sesión
      </BackLink>
    </>
  );
};

/* OTP*/
const StepOtp = ({ email, onNext, onBack, theme }) => {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
    startCountdown();
  }, []);

  const startCountdown = () => {
    setTimer(60);
    setCanResend(false);
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
  };

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
      const next = Array(6).fill("");
      [...text].forEach((c, j) => (next[j] = c));
      setDigits(next);
      refs.current[Math.min(5, text.length - 1)]?.focus();
    }
  };

  const verify = async () => {
    const code = digits.join("");
    setError("");
    if (code.length < 6) {
      setError("Ingresa el código completo de 6 dígitos.");
      return;
    }
    setLoading("Verificando...");
    try {
      await verifyOtpCode(email, code);
      onNext();
    } catch {
      setError("Código incorrecto o expirado. Inténtalo de nuevo.");
      setDigits(Array(6).fill(""));
      setTimeout(() => refs.current[0]?.focus(), 50);
    } finally {
      setLoading("");
    }
  };

  const resend = async () => {
    setDigits(Array(6).fill(""));
    setError("");
    try {
      await sendOtpCode(email);
      startCountdown();
      refs.current[0]?.focus();
    } catch {
      setError("Error al reenviar el código.");
    }
  };

  return (
    <>
      <h1
        className={`font-extrabold text-2xl sm:text-3xl mb-1 text-center font-display tracking-tight transition-colors ${theme === "dark" ? "text-[#F0F0F8]" : "text-[#18181b]"}`}
      >
        Verifica tu identidad
      </h1>
      <p
        className={`text-sm text-center mb-6 transition-colors ${theme === "dark" ? "text-[#9090A8]" : "text-[#64748b]"}`}
      >
        Enviamos un código a{" "}
        <span
          className={`font-semibold ${theme === "dark" ? "text-[#F0F0F8]" : "text-[#18181b]"}`}
        >
          {email}
        </span>
      </p>
      <ErrorAlert msg={error} />

      {/* OTP inputs */}
      <div className="mb-2 flex flex-col gap-2">
        <label
          className={`text-sm font-bold font-body transition-colors ${theme === "dark" ? "text-[#9090A8]" : "text-[#64748b]"}`}
        >
          Código de verificación
        </label>
        <div className="flex gap-2" onPaste={handlePaste}>
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
              className={`w-full h-13 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all duration-200 font-body
                ${theme === "dark" ? "bg-[#22222C] text-[#F0F0F8] focus:bg-[#1a1a22]" : "bg-[#f4f4f5] text-[#18181b] focus:bg-white"}
                ${d ? "border-[#635bff]/60 shadow-[0_0_0_3px_rgba(99,91,255,0.12)]" : theme === "dark" ? "border-white/10" : "border-black/5"}
                focus:border-[#635bff]/60 focus:shadow-[0_0_0_3px_rgba(99,91,255,0.12)]`}
            />
          ))}
        </div>
      </div>

      <p
        className={`text-[12px] text-center mb-5 font-body transition-colors ${theme === "dark" ? "text-[#9090A8]" : "text-[#64748b]"}`}
      >
        ¿No recibiste el código?{" "}
        {canResend ? (
          <button
            type="button"
            onClick={resend}
            className="text-[#6C63FF] hover:text-[#7b75ff] font-bold transition-colors"
          >
            Reenviar
          </button>
        ) : (
          <span>
            Reenviar en{" "}
            <strong
              className={theme === "dark" ? "text-[#F0F0F8]" : "text-[#18181b]"}
            >
              {timer}s
            </strong>
          </span>
        )}
      </p>

      <PrimaryBtn onClick={verify} loading={loading}>
        Verificar código
      </PrimaryBtn>
      <BackLink onClick={onBack} theme={theme}>
        Cambiar correo
      </BackLink>
    </>
  );
};

/* Nueva contraseña*/
const StepNewPassword = ({ email, onNext, theme }) => {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const save = async () => {
    setError("");
    if (pw1.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (pw1 !== pw2) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading("Guardando...");
    try {
      await changePassword(email, pw1);
      onNext();
    } catch {
      setError("Error al cambiar la contraseña. Intenta de nuevo.");
    } finally {
      setLoading("");
    }
  };

  return (
    <>
      <h1
        className={`font-extrabold text-2xl sm:text-3xl mb-1 text-center font-display tracking-tight transition-colors ${theme === "dark" ? "text-[#F0F0F8]" : "text-[#18181b]"}`}
      >
        Nueva contraseña
      </h1>
      <p
        className={`text-sm text-center mb-6 transition-colors ${theme === "dark" ? "text-[#9090A8]" : "text-[#64748b]"}`}
      >
        Elige una contraseña segura para tu cuenta
      </p>
      <ErrorAlert msg={error} />
      <PasswordField
        label="Nueva contraseña"
        value={pw1}
        onChange={(e) => setPw1(e.target.value)}
        placeholder="Mínimo 8 caracteres"
        onKeyDown={(e) => e.key === "Enter" && save()}
        theme={theme}
      />
      <StrengthBar pw={pw1} theme={theme} />
      <PasswordField
        label="Confirmar contraseña"
        value={pw2}
        onChange={(e) => setPw2(e.target.value)}
        placeholder="Repite la contraseña"
        onKeyDown={(e) => e.key === "Enter" && save()}
        theme={theme}
      />
      <PrimaryBtn onClick={save} loading={loading}>
        Guardar contraseña
      </PrimaryBtn>
    </>
  );
};

const StepSuccess = ({ theme }) => {
  const router = useRouter();
  return (
    <div className="text-center py-2">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-emerald-500">
        <Image
          src="/svg/checkCircleIcon.svg"
          alt="check circle"
          className="object-contain"
          width={50}
          height={50}
        />
      </div>
      <h1
        className={`font-extrabold text-2xl sm:text-3xl mb-2 text-center font-display tracking-tight transition-colors ${theme === "dark" ? "text-[#F0F0F8]" : "text-[#18181b]"}`}
      >
        ¡Contraseña actualizada!
      </h1>
      <p
        className={`text-sm text-center mb-7 leading-relaxed transition-colors ${theme === "dark" ? "text-[#9090A8]" : "text-[#64748b]"}`}
      >
        Tu contraseña fue cambiada exitosamente.
        <br />
        Ya puedes iniciar sesión.
      </p>
      <PrimaryBtn onClick={() => router.push("/login")}>
        Ir a inicio de sesión
      </PrimaryBtn>
    </div>
  );
};

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  // Usamos tu Store
  const theme = useThemeStore((state) => state.theme);
  const background = useThemeStore((state) => state.background);
  const textColor = useThemeStore((state) => state.textColor);

  const cardBg = theme === "dark" ? "#111118" : "#ffffff";
  const cardBorder = theme === "dark" ? "#2A2A38" : "#e4e4e7";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 font-body relative overflow-hidden selection:bg-[#635bff]/30 transition-colors duration-300"
      style={{ background: background[theme], color: textColor[theme] }}
    >
      {/* Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-75 h-75 rounded-full bg-[#635bff]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-75 h-75 rounded-full bg-[#9b59b6]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-120 z-10">
        <div
          className="rounded-2xl p-6 sm:p-8 border shadow-[0_24px_64px_rgba(0,0,0,0.5)] transition-colors duration-300"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          {step < 4 && <Steps current={step} theme={theme} />}

          {step === 1 && (
            <StepEmail
              theme={theme}
              onNext={(e) => {
                setEmail(e);
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <StepOtp
              email={email}
              theme={theme}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepNewPassword
              email={email}
              theme={theme}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && <StepSuccess theme={theme} />}
        </div>
      </div>
    </div>
  );
}
