"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/components/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { db } from "@/firebase/client";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const Icons = {
  Briefcase: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  CreditCard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  Clock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>,
  CheckSmall: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>,
  MapPin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  DollarSign: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  Users: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Lock: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  ChevronRight: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>,
};

const STEPS = [
  { key: "inicio", label: "Inicio", Icon: Icons.Briefcase },
  { key: "postulado", label: "Postulación", Icon: Icons.User },
  { key: "pago", label: "Pago", Icon: Icons.CreditCard },
  { key: "en_proceso", label: "En Proceso", Icon: Icons.Clock },
  { key: "finalizado", label: "Finalizado", Icon: Icons.Check },
];

function toSafeDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function moneyNumber(value) {
  if (typeof value === "number") return value;
  const raw = String(value || "").replace(",", ".").replace(/[^\d.]/g, "");
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 850;
}

function formatMoney(value) {
  return `S/ ${moneyNumber(value).toFixed(2)}`;
}

function titleCaseName(value = "") {
  const noEmail = String(value).includes("@") ? String(value).split("@")[0] : String(value);
  return noEmail
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
}

function initialsFromName(value = "") {
  const parts = titleCaseName(value).split(" ").filter(Boolean);
  return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase() || "NX";
}

function colorAvatar(iniciales = "") {
  const colores = ["#2d1a5e", "#0f2d1a", "#2d1a0a", "#0a1a2d", "#2d0a1a", "#1a0a2d", "#0a2d2d"];
  let hash = 0;
  for (const c of iniciales) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colores[Math.abs(hash) % colores.length];
}

function getStepIndex(estado) {
  const idx = STEPS.findIndex((s) => s.key === estado);
  return idx === -1 ? 0 : idx;
}

function getPostulanteId(p) {
  return typeof p === "object" ? p.workerId || p.uid || p.userId : p;
}

function encontrarMiPostulacion(postulantes = [], uid) {
  if (!uid) return null;
  return postulantes.find((p) => getPostulanteId(p) === uid) || null;
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = type === "success"
    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    : "bg-red-500/10 border-red-500/20 text-red-400";

  return (
    <div className={`fixed bottom-8 right-8 ${styles} border p-5 rounded-2xl flex items-center gap-4 z-[200] shadow-2xl backdrop-blur-md max-w-md`}>
      <div className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
      <p className="text-sm font-black uppercase tracking-widest">{message}</p>
    </div>
  );
}

function Stepper({ currentIndex }) {
  return (
    <div className="flex items-center justify-between mb-10 px-2">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
              i === currentIndex
                ? "bg-[#6c63ff] border-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/30"
                : i < currentIndex
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-white/5 border-white/10 text-slate-600"
            }`}>
              {i < currentIndex ? <Icons.CheckSmall /> : <step.Icon />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              i === currentIndex ? "text-white" : i < currentIndex ? "text-emerald-400" : "text-slate-600"
            }`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-6 rounded-full ${i < currentIndex ? "bg-emerald-500/30" : "bg-white/5"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Avatar({ name, photoURL, size = "w-12 h-12", rounded = "rounded-2xl" }) {
  const initials = initialsFromName(name);
  return (
    <div className={`${size} ${rounded} overflow-hidden flex items-center justify-center font-black text-white uppercase shrink-0`} style={{ backgroundColor: colorAvatar(initials) }}>
      {photoURL ? <img src={photoURL} alt="" className="w-full h-full object-cover" /> : initials}
    </div>
  );
}

function ReviewBox({ placeholder, onSubmit, disabled }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!comment.trim() || sent || disabled) return;
    setSending(true);

    try {
      await onSubmit({ rating, comment });
      setSent(true);
      setComment("");
    } finally {
      setSending(false);
    }
  };

  if (disabled || sent) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl p-5 text-center text-[10px] font-black uppercase tracking-widest">
        Reseña publicada
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} className={`text-2xl font-black transition-all ${n <= rating ? "text-amber-400" : "text-slate-700"}`}>
            ★
          </button>
        ))}
      </div>

      <textarea
        className="w-full min-h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[#6c63ff] resize-none"
        placeholder={placeholder}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={sending || !comment.trim()}
        className="w-full bg-[#6c63ff] disabled:bg-white/10 disabled:text-slate-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
      >
        {sending ? "Publicando..." : "Publicar reseña"}
      </button>
    </div>
  );
}

function PaymentProcessing({ done }) {
  return (
    <div className="min-h-[420px] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-4 ${done ? "border-emerald-500/30" : "border-[#6c63ff]/20 border-t-[#6c63ff] animate-spin"}`} />
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${done ? "bg-emerald-500 text-white" : "bg-[#6c63ff]/10 text-[#6c63ff]"}`}>
            {done ? <Icons.Check /> : <Icons.Lock />}
          </div>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">{done ? "Pago procesado" : "Procesando pago"}</h2>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
          {done ? "Tu pago quedó protegido en escrow" : "Validando transacción segura"}
        </p>
      </div>
    </div>
  );
}

function PaymentPanel({ job, workerName, workerPhoto, onPay, processing, processed }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const total = moneyNumber(job.precio);
  const subtotal = total / 1.07;
  const comision = total * 0.06168;
  const igv = total - subtotal - comision;

  if (processing || processed) return <PaymentProcessing done={processed} />;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6c63ff] mb-3">Confirmar y Pagar</p>
        <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
          <Avatar name={workerName} photoURL={workerPhoto} size="w-14 h-14" />
          <div className="flex-1">
            <h2 className="text-xl font-black text-white">{workerName}</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{job.titulo || "Proyecto Nexora"} · {job.plazo || "14 días"}</p>
          </div>
          <p className="text-2xl font-black text-white">{formatMoney(total)}</p>
        </div>
      </div>

      <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-6 space-y-4">
        <div className="flex justify-between text-sm font-bold text-slate-400"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
        <div className="flex justify-between text-sm font-bold text-slate-400"><span>Comisión Nexora (6.6%)</span><span>{formatMoney(comision)}</span></div>
        <div className="flex justify-between text-sm font-bold text-slate-400"><span>IGV (18%)</span><span>{formatMoney(igv)}</span></div>
        <div className="h-px bg-white/10" />
        <div className="flex justify-between text-lg font-black text-white"><span>Total</span><span>{formatMoney(total)}</span></div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-2"><Icons.Shield /> Pago Protegido por Escrow</p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Tu dinero quedará retenido de forma segura. Se liberará al freelancer solo cuando apruebes el trabajo finalizado. Si hay un problema, Nexora podrá mediar la disputa según las condiciones del servicio.
        </p>
      </div>

      <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-black">Izipay · Pago Seguro</p>
            <p className="text-slate-500 text-xs font-bold">Transacción cifrada con TLS 1.3 · Pago retenido en escrow</p>
          </div>
          <p className="text-white font-black">{formatMoney(total)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm outline-none focus:border-[#6c63ff]" placeholder="Número de tarjeta" />
          <input className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm outline-none focus:border-[#6c63ff]" placeholder="Vencimiento" />
          <input className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm outline-none focus:border-[#6c63ff]" placeholder="CVV" />
          <input className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm outline-none focus:border-[#6c63ff]" placeholder="Nombre en la tarjeta" />
        </div>

        <label className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer">
          <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 accent-[#6c63ff]" />
          <span className="text-xs leading-relaxed text-slate-400 font-bold">
            Acepto los términos y condiciones. Entiendo que el pago quedará retenido en escrow y que la aprobación, revisión y liberación del pago son responsabilidad del cliente una vez recibido el trabajo.
          </span>
        </label>

        <button
          onClick={onPay}
          disabled={!acceptedTerms}
          className="w-full bg-[#6c63ff] disabled:bg-white/10 disabled:text-slate-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all"
        >
          Pagar {formatMoney(total)}
        </button>

        <div className="flex gap-2 flex-wrap text-[10px] font-black text-slate-500 tracking-widest">
          {["VISA", "MC", "AMEX", "BCP", "BBVA"].map((brand) => (
            <span key={brand} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">{brand}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProcessPanel({ job, workerName, workerPhoto, clientName, clientPhoto, isOwner, onFinish }) {
  const total = moneyNumber(job.precio);

  return (
    <div className="space-y-8">
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Pago retenido en escrow · {formatMoney(total)}</p>
        <p className="text-slate-300 text-sm">El pago será liberado al freelancer solo cuando el cliente marque el trabajo como completado.</p>
      </div>

      <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-black text-white">{formatMoney(total)} retenido en escrow</h2>
            <p className="text-slate-400 mt-2">
              {isOwner ? "Tu pago está seguro. Libéralo cuando el freelancer entregue el trabajo." : "Tu pago está seguro. Se liberará cuando el cliente apruebe tu entrega."}
            </p>
          </div>
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">En espera</span>
        </div>

        {!isOwner && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6c63ff] mb-3">Mensaje del sistema</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Hola {workerName.split(" ")[0]}, el cliente ha realizado el pago de {formatMoney(total)}. Este monto permanecerá retenido en escrow hasta que entregues el proyecto y el cliente lo apruebe. Mucho éxito con el desarrollo.
            </p>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-4">Nexora · Hoy, 10:34 am</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Progreso del proyecto", "Día 1 de 14"],
            ["Entrega estimada", "20 Jul 2026"],
            ["Revisiones", "Ilimitadas"],
            ["Estado", "En desarrollo"],
          ].map(([label, value]) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
              <p className="text-white font-black">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {isOwner ? (
        <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8">
          <h3 className="text-xl font-black text-white mb-2">¿El trabajo está listo?</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Cuando el freelancer entregue el trabajo y lo hayas revisado, confirma la finalización para liberar el pago de {formatMoney(total)}.
          </p>
          <button onClick={onFinish} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]">
            Aprobar entrega y liberar pago
          </button>
        </div>
      ) : (
        <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8">
          <h3 className="text-xl font-black text-white mb-2">Desarrolla y entrega el trabajo</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Una vez que entregues el proyecto, el cliente podrá aprobarlo y liberar el pago retenido en escrow.</p>
        </div>
      )}

      <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Partes del proyecto</p>
        <div className="space-y-4">
          <div className="flex items-center gap-4"><Avatar name={clientName} photoURL={clientPhoto} /><div><p className="font-black text-white">{clientName}</p><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Cliente</p></div></div>
          <div className="flex items-center gap-4"><Avatar name={workerName} photoURL={workerPhoto} /><div><p className="font-black text-white">{workerName}</p><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Freelancer</p></div></div>
          <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><Icons.Shield /></div><div><p className="font-black text-white">Escrow Izipay · {formatMoney(total)}</p><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Retenido · En espera</p></div></div>
        </div>
      </div>
    </div>
  );
}

function FinishedPanel({ job, workerName, isOwner, onSubmitReview, reviewSubmitted }) {
  const total = moneyNumber(job.precio);
  const ganancias = total * 0.94;

  return (
    <div className="space-y-8">
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6"><Icons.Check /></div>
        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Trabajo completado · Pago liberado</p>
        <h2 className="text-3xl font-black text-white mb-3">¡Proyecto completado!</h2>
        <p className="text-slate-300">
          {isOwner
            ? `${formatMoney(total)} fueron liberados a ${workerName}. Gracias por usar Nexora.`
            : `Felicitaciones. ${formatMoney(total)} han sido transferidos a tu cuenta. Excelente trabajo.`}
        </p>
      </div>

      <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Resumen del proyecto</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Monto pagado", formatMoney(total)],
            ["Tiempo total", "14 días"],
            ["Revisiones", "2 realizadas"],
            ["Estado", "Completado"],
          ].map(([label, value]) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
              <p className="text-white font-black">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8">
        {[
          ["Proyecto publicado", "6 Jul 2026"],
          ["Propuesta enviada", "6 Jul 2026"],
          ["Propuesta aceptada", "6 Jul 2026"],
          ["Pago realizado (Izipay)", "6 Jul 2026"],
          ["Desarrollo completado", "20 Jul 2026"],
          ["Pago liberado al freelancer", "20 Jul 2026"],
        ].map(([label, date]) => (
          <div key={label} className="flex items-center justify-between border-b border-white/5 last:border-0 py-4">
            <span className="text-slate-400 text-sm font-bold">{label}</span>
            <span className="text-white text-sm font-black">{date}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8">
        <h3 className="text-xl font-black text-white mb-2">
          {isOwner ? `Deja una reseña a ${workerName}` : "Califica al cliente"}
        </h3>
        <p className="text-slate-500 text-sm font-bold mb-6">
          {isOwner ? "Tu reseña aparecerá en el perfil del trabajador." : "Tu reseña aparecerá en el perfil del cliente."}
        </p>
        <ReviewBox
          disabled={reviewSubmitted}
          placeholder={isOwner ? `Cuéntanos cómo fue trabajar con ${workerName}` : "Cuéntanos cómo fue trabajar con este cliente"}
          onSubmit={onSubmitReview}
        />
      </div>

      {!isOwner && (
        <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">Tus ganancias</p>
            <h3 className="text-3xl font-black text-white">{formatMoney(ganancias)}</h3>
            <p className="text-slate-500 text-xs font-bold mt-1">Después de comisión Nexora</p>
          </div>
          <button className="bg-emerald-500 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Retirar fondos</button>
        </div>
      )}

      <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Próximos pasos</p>
        <div className="flex flex-wrap gap-3">
          {["Explorar nuevos proyectos", "Ver historial completo", "Actualizar tu perfil"].map((item) => (
            <button key={item} className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white">{item}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkerProfileModal({ workerId, onClose, onAceptar, yaAceptado }) {
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workerId) return;
    let active = true;

    (async () => {
      setLoading(true);
      const [userSnap, reviewsSnap, portfolioSnap] = await Promise.all([
        getDoc(doc(db, "users", workerId)),
        getDocs(query(collection(db, "reviews"), where("targetUserId", "==", workerId))),
        getDocs(query(collection(db, "portfolio"), where("userId", "==", workerId))),
      ]);

      if (!active) return;
      setData(userSnap.exists() ? userSnap.data() : null);
      setReviews(reviewsSnap.docs.map((d) => d.data()));
      setPortfolio(portfolioSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [workerId]);

  const reputacion = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return { score: (sum / reviews.length).toFixed(1), count: reviews.length };
  }, [reviews]);

  const fullName = titleCaseName(`${data?.first_name || ""} ${data?.last_name || ""}`.trim() || data?.displayName || data?.email || "Trabajador");

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className="bg-[#111118] border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">Perfil del Trabajador</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all text-sm">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" /></div>
          ) : !data ? (
            <div className="text-center text-slate-600 text-[10px] font-black uppercase tracking-widest py-20">No se encontró este perfil</div>
          ) : (
            <>
              <div className="flex items-center gap-6">
                <Avatar name={fullName} photoURL={data.photoURL} size="w-20 h-20" rounded="rounded-full" />
                <div>
                  <h3 className="text-2xl font-black text-white">{fullName}</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{data.city || "Ciudad no especificada"}</p>
                  {reputacion && <p className="text-amber-400 text-sm font-bold mt-1">★ {reputacion.score} · {reputacion.count} {reputacion.count === 1 ? "reseña" : "reseñas"}</p>}
                </div>
              </div>

              {data.about_me && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#6c63ff] mb-2">Sobre el trabajador</p>
                  <p className="text-slate-400 leading-relaxed italic">{data.about_me}</p>
                </div>
              )}

              {portfolio.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#6c63ff] mb-4">Portfolio</p>
                  <div className="grid grid-cols-2 gap-4">
                    {portfolio.slice(0, 4).map((p) => (
                      <div key={p.id} className="aspect-video rounded-2xl overflow-hidden border border-white/5">
                        <img src={p.imageUrl} alt={p.title || "portfolio"} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {data && (
          <div className="p-8 border-t border-white/5 flex gap-4">
            <button onClick={onClose} className="flex-1 bg-white/5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10">Cerrar</button>
            {!yaAceptado && <button onClick={onAceptar} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Aceptar Trabajador</button>}
          </div>
        )}
      </div>
    </div>
  );
}

function JobFlowContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [toast, setToast] = useState(null);
  const [clienteReviews, setClienteReviews] = useState([]);
  const [workersInfo, setWorkersInfo] = useState({});
  const [clientInfo, setClientInfo] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (!jobId) router.push("/FeedTrabajos");
  }, [jobId, router]);

  useEffect(() => {
    if (!jobId) return;
    const unsub = onSnapshot(doc(db, "solicitudes", jobId), (snap) => {
      setJob(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setJobLoading(false);
    });
    return () => unsub();
  }, [jobId]);

  useEffect(() => {
    if (!job?.userId) return;
    const unsub = onSnapshot(query(collection(db, "reviews"), where("targetUserId", "==", job.userId)), (snap) => {
      setClienteReviews(snap.docs.map((d) => d.data()));
    });
    return () => unsub();
  }, [job?.userId]);

  useEffect(() => {
    if (!job?.userId) return;
    let active = true;

    (async () => {
      const snap = await getDoc(doc(db, "users", job.userId));
      if (active) setClientInfo(snap.exists() ? snap.data() : null);
    })();

    return () => {
      active = false;
    };
  }, [job?.userId]);

  const postulantes = job?.postulantes ?? [];
  const miPostulacion = useMemo(() => encontrarMiPostulacion(postulantes, user?.uid), [postulantes, user?.uid]);
  const yaPostulo = !!miPostulacion;
  const esTrabajador = user?.rol === "trabajador" || user?.rol === "worker";
  const esPropietario = user?.uid && user.uid === job?.userId;

  const acceptedPostulante = useMemo(() => {
    return postulantes.find((p) => typeof p === "object" && ["pago", "en_proceso", "finalizado"].includes(p.estado)) || null;
  }, [postulantes]);

  const acceptedWorkerId = acceptedPostulante ? getPostulanteId(acceptedPostulante) : null;
  const estadoProyecto = acceptedPostulante?.estado || (yaPostulo ? miPostulacion?.estado || "postulado" : "inicio");
  const currentStepIndex = getStepIndex(estadoProyecto);

  useEffect(() => {
    if (postulantes.length === 0) return;
    let active = true;

    (async () => {
      const ids = postulantes.map(getPostulanteId).filter(Boolean);
      const entries = await Promise.all(
        ids.map(async (id) => {
          const snap = await getDoc(doc(db, "users", id));
          return [id, snap.exists() ? snap.data() : null];
        }),
      );
      if (active) setWorkersInfo(Object.fromEntries(entries));
    })();

    return () => {
      active = false;
    };
  }, [postulantes.length, job?.id]);

  const clienteReputacion = useMemo(() => {
    if (clienteReviews.length === 0) return null;
    const sum = clienteReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return { score: (sum / clienteReviews.length).toFixed(1), count: clienteReviews.length };
  }, [clienteReviews]);

  const clientName = titleCaseName(
    `${clientInfo?.first_name || ""} ${clientInfo?.last_name || ""}`.trim() ||
      clientInfo?.displayName ||
      clientInfo?.email ||
      job?.nombre ||
      "Cliente",
  );

  const workerInfo = acceptedWorkerId ? workersInfo[acceptedWorkerId] || {} : {};
  const workerName = titleCaseName(
    acceptedPostulante?.nombre ||
      `${workerInfo.first_name || ""} ${workerInfo.last_name || ""}`.trim() ||
      workerInfo.displayName ||
      workerInfo.email ||
      "Trabajador",
  );

  const reviewSubmitted = useMemo(() => {
    if (!acceptedPostulante || !user?.uid) return false;
    if (esPropietario) return !!acceptedPostulante?.reviews?.clientToWorker;
    if (user.uid === acceptedWorkerId) return !!acceptedPostulante?.reviews?.workerToClient;
    return false;
  }, [acceptedPostulante, user?.uid, esPropietario, acceptedWorkerId]);

  const handleAceptar = async (workerId) => {
    try {
      const nuevosPostulantes = postulantes.map((p) => {
        const id = getPostulanteId(p);
        if (id !== workerId) return p;
        return typeof p === "object"
          ? { ...p, estado: "pago", aceptadoEn: new Date().toISOString() }
          : { workerId: p, estado: "pago", aceptadoEn: new Date().toISOString() };
      });

      await updateDoc(doc(db, "solicitudes", jobId), { postulantes: nuevosPostulantes });
      showToast("Trabajador aceptado.");
      setSelectedWorkerId(null);
    } catch {
      showToast("Error al aceptar al trabajador.", "error");
    }
  };

  const handlePay = async () => {
    setPaymentProcessing(true);
    setPaymentProcessed(false);

    setTimeout(() => setPaymentProcessed(true), 1800);

    setTimeout(async () => {
      try {
        const nuevosPostulantes = postulantes.map((p) => {
          if (getPostulanteId(p) !== acceptedWorkerId) return p;
          return {
            ...(typeof p === "object" ? p : { workerId: p }),
            estado: "en_proceso",
            pago: {
              total: moneyNumber(job.precio),
              provider: "Izipay",
              escrow: true,
              pagadoEn: new Date().toISOString(),
            },
          };
        });

        await updateDoc(doc(db, "solicitudes", jobId), { postulantes: nuevosPostulantes });
        showToast("Pago retenido en escrow.");
      } catch {
        showToast("Error al procesar el pago.", "error");
      } finally {
        setPaymentProcessing(false);
        setPaymentProcessed(false);
      }
    }, 3000);
  };

  const handleSubmitReview = async ({ rating, comment }) => {
    if (!user?.uid || !jobId || !acceptedWorkerId || reviewSubmitted) {
      showToast("Esta reseña ya fue publicada.", "error");
      return;
    }

    const isClientReview = esPropietario;
    const targetUserId = isClientReview ? acceptedWorkerId : job.userId;
    const targetName = isClientReview ? workerName : clientName;
    const authorName = isClientReview ? clientName : workerName;

    if (!targetUserId) {
      showToast("No se encontró el usuario a reseñar.", "error");
      return;
    }

    await addDoc(collection(db, "reviews"), {
      jobId,
      jobTitle: job.titulo || job.profesion || "Proyecto Nexora",
      rating: Number(rating),
      comment: comment.trim(),
      targetUserId,
      targetName,
      targetRole: isClientReview ? "trabajador" : "cliente",
      authorId: user.uid,
      authorName,
      authorRole: isClientReview ? "cliente" : "trabajador",
      timestamp: serverTimestamp(),
    });

    const nuevosPostulantes = postulantes.map((p) => {
      if (getPostulanteId(p) !== acceptedWorkerId) return p;

      return {
        ...(typeof p === "object" ? p : { workerId: p }),
        reviews: {
          ...(typeof p === "object" ? p.reviews || {} : {}),
          ...(isClientReview ? { clientToWorker: true } : { workerToClient: true }),
        },
      };
    });

    await updateDoc(doc(db, "solicitudes", jobId), { postulantes: nuevosPostulantes });
    showToast("Reseña publicada.");
  };

  const handleFinalizar = async () => {
    const nuevosPostulantes = postulantes.map((p) => {
      if (getPostulanteId(p) !== acceptedWorkerId) return p;
      return {
        ...(typeof p === "object" ? p : { workerId: p }),
        estado: "finalizado",
        finalizadoEn: new Date().toISOString(),
        pagoLiberado: true,
      };
    });

    await updateDoc(doc(db, "solicitudes", jobId), { postulantes: nuevosPostulantes });
    showToast("Pago liberado al freelancer.");
  };

  const handlePostular = async () => {
    if (!user?.uid) return showToast("Debes iniciar sesión para postular.", "error");
    if (!esTrabajador) return showToast("Solo cuentas de Trabajador pueden postular a un trabajo.", "error");
    if (esPropietario) return showToast("No puedes postular a tu propia solicitud.", "error");
    if (yaPostulo) return;

    setApplying(true);

    try {
      await updateDoc(doc(db, "solicitudes", jobId), {
        postulantes: arrayUnion({
          workerId: user.uid,
          nombre: titleCaseName(`${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "Trabajador"),
          estado: "postulado",
          fecha: new Date().toISOString(),
        }),
      });

      showToast("Postulación enviada con éxito.");
    } catch {
      showToast("Error al enviar la postulación.", "error");
    } finally {
      setApplying(false);
    }
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-slate-500 font-black uppercase tracking-widest text-sm">
        Trabajo no encontrado
      </div>
    );
  }

  const {
    titulo = "Sin título",
    descripcion = "",
    distrito,
    modalidad,
    precio,
    urgente,
    tags = [],
    creadoEn,
  } = job;

  const creadoEnDate = toSafeDate(creadoEn);
  const tiempoRelativo = creadoEnDate ? formatDistanceToNow(creadoEnDate, { addSuffix: true, locale: es }) : "hace un momento";
  const showProjectFlow = ["pago", "en_proceso", "finalizado"].includes(estadoProyecto) && (esPropietario || user?.uid === acceptedWorkerId);

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] text-white font-sans selection:bg-[#6c63ff]/30">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <Stepper currentIndex={currentStepIndex} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#111118] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl space-y-8">
            {showProjectFlow && estadoProyecto === "pago" && esPropietario ? (
              <PaymentPanel job={job} workerName={workerName} workerPhoto={workerInfo.photoURL} onPay={handlePay} processing={paymentProcessing} processed={paymentProcessed} />
            ) : showProjectFlow && estadoProyecto === "en_proceso" ? (
              <ProcessPanel
                job={job}
                workerName={workerName}
                workerPhoto={workerInfo.photoURL}
                clientName={clientName}
                clientPhoto={clientInfo?.photoURL}
                isOwner={esPropietario}
                onFinish={handleFinalizar}
              />
            ) : showProjectFlow && estadoProyecto === "finalizado" ? (
              <FinishedPanel
                job={job}
                workerName={workerName}
                workerPhoto={workerInfo.photoURL}
                isOwner={esPropietario}
                onSubmitReview={handleSubmitReview}
                reviewSubmitted={reviewSubmitted}
              />
            ) : (
              <>
                <div className="flex flex-wrap gap-3">
                  {urgente && <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Urgente</span>}
                  {modalidad && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">{modalidad}</span>}
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight mb-2">{titulo}</h1>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Icons.MapPin /> {distrito || "Ubicación no especificada"} · {tiempoRelativo}
                  </p>
                </div>

                {descripcion && <p className="text-slate-400 leading-relaxed">{descripcion}</p>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-6">
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-2"><Icons.DollarSign /> Precio</p>
                    <p className="text-lg font-black text-white">{precio || "A convenir"}</p>
                  </div>
                  <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-6">
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-2"><Icons.Clock /> Plazo</p>
                    <p className="text-lg font-black text-white">{job.plazo || "No especificado"}</p>
                  </div>
                  <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-6">
                    <p className="text-[#6c63ff] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-2"><Icons.Users /> Postulantes</p>
                    <p className="text-lg font-black text-white">{postulantes.length} {postulantes.length === 1 ? "propuesta" : "propuestas"}</p>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag) => <span key={tag} className="bg-white/5 border border-white/10 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl">{tag}</span>)}
                  </div>
                )}

                {esPropietario ? (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Postulantes ({postulantes.length})</h3>
                    {postulantes.length === 0 ? (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">Aún no hay postulantes</div>
                    ) : (
                      postulantes.map((p, i) => {
                        const workerId = getPostulanteId(p);
                        const info = workersInfo[workerId] || {};
                        const nombrePostulante = titleCaseName((typeof p === "object" && p.nombre) || `${info.first_name || ""} ${info.last_name || ""}`.trim() || info.email || "Trabajador");
                        const aceptado = typeof p === "object" && ["pago", "en_proceso", "finalizado"].includes(p.estado);

                        return (
                          <div key={workerId || i} className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-4">
                              <Avatar name={nombrePostulante} photoURL={info.photoURL} size="w-10 h-10" rounded="rounded-xl" />
                              <div>
                                <p className="font-bold text-white text-sm">{nombrePostulante}</p>
                                <p className={`text-[10px] uppercase font-black tracking-widest ${aceptado ? "text-emerald-400" : "text-slate-500"}`}>{aceptado ? "Aceptado" : "Postulado"}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => setSelectedWorkerId(workerId)} className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Ver Perfil</button>
                              {!aceptado && <button onClick={() => handleAceptar(workerId)} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Aceptar</button>}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : !esTrabajador ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">Solo cuentas de Trabajador pueden postular</div>
                ) : yaPostulo ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl p-5 text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <Icons.CheckSmall /> {STEPS[currentStepIndex].label === "Postulación" ? "Postulación enviada · esperando respuesta del cliente" : `Estado actual: ${STEPS[currentStepIndex].label}`}
                  </div>
                ) : (
                  <button onClick={handlePostular} disabled={applying} className="w-full bg-gradient-to-r from-[#6c63ff] to-[#4b45b2] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#6c63ff]/20 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {applying ? "Enviando..." : "Postular ahora"}
                  </button>
                )}
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Cliente</h3>
              <div className="flex items-center gap-4 mb-6">
                <Avatar name={clientName} photoURL={clientInfo?.photoURL} />
                <div>
                  <p className="font-black text-white">{clientName}</p>
                  {clienteReputacion ? (
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <span className="text-amber-400">★ {clienteReputacion.score}</span> · {clienteReputacion.count} {clienteReputacion.count === 1 ? "reseña" : "reseñas"}
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-slate-500">{distrito || "Perú"}</p>
                  )}
                </div>
              </div>
              <div className="space-y-3 text-xs font-bold text-slate-400">
                {["Identidad verificada", "Pago protegido por Izipay", "Historial de pagos perfecto"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-emerald-400"><Icons.CheckSmall /> {item}</div>
                ))}
              </div>
            </div>

            <div className="bg-[#111118] rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Icons.Shield /> Protección Nexora</h3>
              <div className="space-y-4 text-xs font-bold text-slate-400">
                {["Pago retenido hasta completar", "Disputa mediada por Nexora", "Reembolso si no hay entrega"].map((t) => (
                  <div key={t} className="flex items-center gap-2"><Icons.ChevronRight /> {t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedWorkerId && (
        <WorkerProfileModal
          workerId={selectedWorkerId}
          onClose={() => setSelectedWorkerId(null)}
          onAceptar={() => handleAceptar(selectedWorkerId)}
          yaAceptado={(() => {
            const p = postulantes.find((p) => getPostulanteId(p) === selectedWorkerId);
            return typeof p === "object" && ["pago", "en_proceso", "finalizado"].includes(p.estado);
          })()}
        />
      )}
    </div>
  );
}

export default function JobFlowPage() {
  return (
    <ProtectedRoute>
      <JobFlowContent />
    </ProtectedRoute>
  );
}
