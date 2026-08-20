import { ArrowLeft, ArrowRight, CheckCircle2, FileCheck2, LoaderCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { trpc } from "@/lib/trpc";

type AuthMode = "login" | "register";
type Step = "phone" | "code";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const initialMode: AuthMode = new URLSearchParams(window.location.search).get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<Step>("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [testCode, setTestCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const requestMutation = trpc.otp.request.useMutation();
  const verifyMutation = trpc.otp.verify.useMutation();

  useEffect(() => { if (!seconds) return; const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000); return () => window.clearTimeout(timer); }, [seconds]);
  function changeMode(next: AuthMode) { setMode(next); setError(""); setSuccess(false); setStep("phone"); setCode(""); navigate(`/auth?mode=${next}`, { replace: true }); }

  async function requestCode() {
    if (phone.replace(/\D/g, "").length < 10 || (mode === "register" && (name.trim().length < 2 || !consent))) { setError(mode === "register" ? "Заполните имя, телефон и подтвердите согласие." : "Введите номер телефона в полном формате."); return; }
    setError("");
    try { const receipt = await requestMutation.mutateAsync({ phone }); setTestCode(receipt.testCode ?? ""); setSeconds(receipt.retryAfterSeconds); setCode(""); setStep("code"); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Не удалось запросить код."); }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === "phone") { await requestCode(); return; }
    if (!/^\d{6}$/.test(code)) { setError("Введите шестизначный код."); return; }
    setError("");
    try { await verifyMutation.mutateAsync({ phone, code, ...(mode === "register" ? { name: name.trim() } : {}) }); setSuccess(true); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Не удалось подтвердить код."); }
  }

  const pending = requestMutation.isPending || verifyMutation.isPending;
  return <AppShell variant="auth"><Seo title={mode === "login" ? "Вход в аккаунт" : "Регистрация"} description="Вход и регистрация в Аренде БЕЗ по одноразовому коду." /><section className="auth-page"><div className="auth-layout"><aside className="auth-desktop-promo"><p className="eyebrow">Аренда БЕЗ</p><h1>Берём рутину на себя</h1><p>Оплата, документы и поддержка — всё в личном кабинете. Мы рядом 7 дней в неделю.</p><ul><li><ShieldCheck /> Проверяем арендаторов</li><li><FileCheck2 /> Готовим договор</li><li><Sparkles /> Сопровождаем аренду</li><li><CheckCircle2 /> Проверяем квартиру каждый месяц</li></ul></aside><div className="auth-card">{success ? <div className="auth-success" role="status"><CheckCircle2 size={42} /><p className="eyebrow">Номер подтверждён</p><h1>{mode === "login" ? "Вы вошли в аккаунт" : "Профиль создан"}</h1><p>Сессия защищена HTTP-only cookie. Теперь вы можете сохранять заявки и управлять арендой.</p><button className="button button--primary button--wide" onClick={() => navigate(mode === "register" ? "/owner" : "/search")}>Продолжить <ArrowRight size={16} /></button></div> : <form onSubmit={submit} noValidate><div className="auth-brand"><span aria-hidden="true">⌂</span><b>Аренда <i>БЕЗ</i></b></div><p className="eyebrow auth-eyebrow">Единый аккаунт</p><div className="auth-tabs auth-tabs--desktop" role="tablist" aria-label="Режим доступа"><button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "is-active" : ""} onClick={() => changeMode("login")}>Вход</button><button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "is-active" : ""} onClick={() => changeMode("register")}>Регистрация</button></div><h1>{step === "code" ? "Введите код" : mode === "login" ? "Войти в аккаунт" : "Регистрация"}</h1><p className="auth-lead">{step === "code" ? `Отправили код на ${phone}.` : "Введите номер телефона — пришлём код подтверждения."}</p><div className="auth-tabs auth-tabs--mobile" role="tablist" aria-label="Режим доступа"><button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "is-active" : ""} onClick={() => changeMode("login")}>Вход</button><button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "is-active" : ""} onClick={() => changeMode("register")}>Регистрация</button></div>{step === "phone" ? <><>{mode === "register" && <><label className="field-label" htmlFor="auth-name">Ваше имя *</label><input id="auth-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Иван Иванов" disabled={pending} /></>}</><label className="field-label" htmlFor="auth-phone">Телефон *</label><div className="phone-input"><Phone size={17} aria-hidden="true" /><input id="auth-phone" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+7 900 000 00 00" disabled={pending} /></div><p className="auth-explain">Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности.</p>{mode === "register" && <label className="checkbox-field"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={pending} /><span>Согласен с условиями сервиса и обработкой данных для создания профиля</span></label>}</> : <><label className="field-label" htmlFor="auth-code">Код из SMS</label><input id="auth-code" className="otp-code-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" disabled={pending} autoFocus />{testCode && <p className="otp-test-code" role="status">Тестовый код для локальной проверки: <b>{testCode}</b></p>}<button type="button" className="text-link otp-back" onClick={() => { setStep("phone"); setError(""); }}><ArrowLeft size={15} /> Изменить номер</button></>}{error && <p className="field-error" role="alert">{error}</p>}<button type="submit" className="button button--primary button--wide" disabled={pending}>{pending ? <><LoaderCircle size={16} className="button-spinner" /> Подождите…</> : step === "code" ? "Подтвердить код" : "Получить код"} <ArrowRight size={16} /></button>{step === "code" && <button type="button" className="otp-resend" onClick={requestCode} disabled={seconds > 0 || pending}>{seconds > 0 ? `Отправить повторно через ${seconds} с` : "Отправить код повторно"}</button>}<p className="form-note">Код действует 5 минут. Повторная отправка доступна через 60 секунд.</p></form>}</div></div></section></AppShell>;
}
