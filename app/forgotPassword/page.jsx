"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendOtpCode, verifyOtpCode, changePassword } from "@/firebase/auth";
import Image from "next/image";

const Steps = ({ current }) => {
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
                className={`absolute top-[13px] left-[calc(50%+13px)] right-[calc(-50%+13px)] h-px transition-all duration-500 ${done ? "bg-[#635bff]" : "bg-[#2A2A38]"}`}
              />
            )}
            <div
              className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-semibold border z-10 transition-all duration-300
              ${done ? "bg-[#635bff] border-[#635bff] text-white" : ""}
              ${active ? "bg-[#635bff]/20 border-[#635bff] text-[#635bff] shadow-[0_0_10px_rgba(99,91,255,0.35)]" : ""}
              ${!done && !active ? "bg-[#22222C] border-[#2A2A38] text-[#606078]" : ""}
            `}
            >
              {done ? "✓" : s.id}
            </div>
            <span
              className={`text-[10px] mt-1 whitespace-nowrap transition-colors duration-300
              ${done ? "text-[#635bff]" : active ? "text-[#F0F0F8]" : "text-[#606078]"}
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

/* ── Error alert (igual al LoginPage) ── */
const ErrorAlert = ({ msg }) =>
  msg ? (
    <p className="text-red-400 text-sm text-center mb-4 bg-red-500/10 py-2.5 px-4 rounded-xl border border-red-500/20">
      {msg}
    </p>
  ) : null;

/* ── Input con ícono (idéntico al LoginPage) ── */
const FieldInput = ({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  onKeyDown,
  autoComplete,
}) => (
  <div className="mb-4 flex flex-col gap-2">
    <label className="text-sm font-bold text-[#9090A8] font-body">
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
        className="w-full h-[52px] pl-9 pr-4 py-3 bg-[#22222C] border-2 border-white/10 rounded-xl text-sm font-light text-[#F0F0F8] outline-none placeholder:text-[#5a5a6a] transition-all duration-200 focus:border-[#635bff]/60 focus:bg-[#1a1a22] focus:shadow-[0_0_0_3px_rgba(99,91,255,0.12)] font-body"
      />
    </div>
  </div>
);

/* ── Password input con toggle ── */
const PasswordField = ({ label, value, onChange, placeholder, onKeyDown }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-4 flex flex-col gap-2">
      <label className="text-sm font-bold text-[#9090A8] font-body">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606078]">
          <Image
            src="/svg/lockIcon.svg"
            alt="lock"
            className="object-contain"
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
          className="w-full h-[52px] pl-9 pr-10 py-3 bg-[#22222C] border-2 border-white/10 rounded-xl text-sm font-light text-[#F0F0F8] outline-none placeholder:text-[#5a5a6a] transition-all duration-200 focus:border-[#635bff]/60 focus:bg-[#1a1a22] focus:shadow-[0_0_0_3px_rgba(99,91,255,0.12)] font-body"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606078] hover:text-[#9090A8] transition-colors"
        >
          {show ? (
            <Image
              src="/svg/eyeIconOff.svg"
              alt="eye off"
              className="object-contain"
              width={16}
              height={16}
            />
          ) : (
            <Image
              src="/svg/eyeIconOn.svg"
              alt="eye on"
              className="object-contain"
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
  const textColors = [
    "text-red-400",
    "text-orange-400",
    "text-yellow-400",
    "text-emerald-400",
  ];
  const labels = ["", "Débil", "Regular", "Buena", "Muy segura"];
  return (
    <div className="-mt-1 mb-4">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-[#2A2A38]"}`}
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

/* ── Botón principal (idéntico al LoginPage) ── */
const PrimaryBtn = ({ children, onClick, loading, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading || disabled}
    className="w-full h-[52px] rounded-xl text-sm font-bold text-white transition-all duration-200 bg-gradient-to-br from-[#6C63FF] to-[#9B59B6] hover:shadow-[0_0_32px_rgba(99,91,255,0.4)] hover:-translate-y-[1px] active:translate-y-0 disabled:pointer-events-none disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer font-body"
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
const BackLink = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center gap-1.5 w-full mt-5 text-sm text-[#9090A8] hover:text-[#F0F0F8] transition-colors group font-body"
  >
    <span className="group-hover:-translate-x-0.5 transition-transform">
      <Image
        src="/svg/chevronLeftIcon.svg"
        alt="chevron left"
        className="object-contain"
        width={14}
        height={14}
      />
    </span>
    {children}
  </button>
);

/* STEP 1 — Correo */
const StepEmail = ({ onNext }) => {
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
      <h1 className="font-extrabold text-2xl sm:text-3xl mb-1 text-center font-display text-[#F0F0F8] tracking-tight">
        Recuperar contraseña
      </h1>
      <p className="text-sm text-center mb-6 text-[#9090A8]">
        Ingresa tu correo y te enviaremos un código
      </p>
      <ErrorAlert msg={error} />
      <FieldInput
        label="Correo electrónico"
        icon={
          <Image
            src="/svg/mailIcon.svg"
            alt="mailIcon"
            className="object-contain"
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
      <BackLink onClick={() => window.history.back()}>
        Volver a inicio de sesión
      </BackLink>
    </>
  );
};

/* OTP*/
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
      <h1 className="font-extrabold text-2xl sm:text-3xl mb-1 text-center font-display text-[#F0F0F8] tracking-tight">
        Verifica tu identidad
      </h1>
      <p className="text-sm text-center mb-6 text-[#9090A8]">
        Enviamos un código a{" "}
        <span className="text-[#F0F0F8] font-semibold">{email}</span>
      </p>
      <ErrorAlert msg={error} />

      {/* OTP inputs */}
      <div className="mb-2 flex flex-col gap-2">
        <label className="text-sm font-bold text-[#9090A8] font-body">
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
              className={`w-full h-[52px] text-center text-xl font-bold bg-[#22222C] border-2 rounded-xl text-[#F0F0F8] outline-none transition-all duration-200 font-body
                ${d ? "border-[#635bff]/60 shadow-[0_0_0_3px_rgba(99,91,255,0.12)]" : "border-white/10"}
                focus:border-[#635bff]/60 focus:bg-[#1a1a22] focus:shadow-[0_0_0_3px_rgba(99,91,255,0.12)]`}
            />
          ))}
        </div>
      </div>

      <p className="text-[12px] text-[#9090A8] text-center mb-5 font-body">
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
            Reenviar en <strong className="text-[#F0F0F8]">{timer}s</strong>
          </span>
        )}
      </p>

      <PrimaryBtn onClick={verify} loading={loading}>
        Verificar código
      </PrimaryBtn>
      <BackLink onClick={onBack}>Cambiar correo</BackLink>
    </>
  );
};

/* Nueva contraseña*/
const StepNewPassword = ({ email, onNext }) => {
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
      <h1 className="font-extrabold text-2xl sm:text-3xl mb-1 text-center font-display text-[#F0F0F8] tracking-tight">
        Nueva contraseña
      </h1>
      <p className="text-sm text-center mb-6 text-[#9090A8]">
        Elige una contraseña segura para tu cuenta
      </p>
      <ErrorAlert msg={error} />
      <PasswordField
        label="Nueva contraseña"
        value={pw1}
        onChange={(e) => setPw1(e.target.value)}
        placeholder="Mínimo 8 caracteres"
        onKeyDown={(e) => e.key === "Enter" && save()}
      />
      <StrengthBar pw={pw1} />
      <PasswordField
        label="Confirmar contraseña"
        value={pw2}
        onChange={(e) => setPw2(e.target.value)}
        placeholder="Repite la contraseña"
        onKeyDown={(e) => e.key === "Enter" && save()}
      />
      <PrimaryBtn onClick={save} loading={loading}>
        Guardar contraseña
      </PrimaryBtn>
    </>
  );
};

const StepSuccess = () => {
  const router = useRouter();
  return (
    <div className="text-center py-2">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-emerald-400">
        <Image
          src="/svg/checkCircleIcon.svg"
          alt="check circle"
          className="object-contain"
          width={50}
          height={50}
        />
      </div>
      <h1 className="font-extrabold text-2xl sm:text-3xl mb-2 text-center font-display text-[#F0F0F8] tracking-tight">
        ¡Contraseña actualizada!
      </h1>
      <p className="text-sm text-center mb-7 text-[#9090A8] leading-relaxed">
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0A0A0F] font-body text-[#f0f0f5] relative overflow-hidden selection:bg-[#635bff]/30">
      {/* Glow — igual al LoginPage */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#635bff]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#9b59b6]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[480px] z-10">
        <div className="rounded-2xl p-6 sm:p-8 bg-[#111118] border border-[#2A2A38] shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
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
          {step === 3 && (
            <StepNewPassword email={email} onNext={() => setStep(4)} />
          )}
          {step === 4 && <StepSuccess />}
        </div>
      </div>
    </div>
  );
}
