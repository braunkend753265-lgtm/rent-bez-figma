import { LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatRubles, type Property } from "@/lib/domain";
import { trpc } from "@/lib/trpc";

export function ApplicationDialog({ property, onClose }: { property: Property; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const applicationMutation = trpc.application.create.useMutation();
  useEffect(() => closeRef.current?.focus(), []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 10 || !consent) { setError("Укажите имя, телефон и согласитесь на обработку данных."); return; }
    setError("");
    try {
      await applicationMutation.mutateAsync({ listingId: property.id, listingTitle: property.title, name: name.trim(), phone, consent: true });
      setSubmitted(true);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Не удалось отправить заявку. Попробуйте ещё раз."); }
  }

  return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="application-dialog" role="dialog" aria-modal="true" aria-labelledby="application-title" onMouseDown={(event) => event.stopPropagation()}><button ref={closeRef} type="button" className="icon-button dialog-close" onClick={onClose} aria-label="Закрыть форму заявки"><X size={20} aria-hidden="true" /></button>{submitted ? <div className="success-state" role="status"><p className="eyebrow">Заявка принята</p><h2 id="application-title">Менеджер свяжется с вами</h2><p>Заявка на объект «{property.title}» сохранена. Мы свяжемся с вами по указанному номеру, чтобы обсудить показ.</p><button type="button" className="button button--primary" onClick={onClose}>Вернуться к квартире</button></div> : <form onSubmit={submit} noValidate><p className="eyebrow">Первичная анкета</p><h2 id="application-title">Оставить заявку на просмотр</h2><p className="dialog-subtitle">{property.title} · {formatRubles(property.price)} в месяц</p><label className="field-label" htmlFor="application-name">Ваше имя</label><input id="application-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Например, Анна" disabled={applicationMutation.isPending} /><label className="field-label" htmlFor="application-phone">Телефон</label><input id="application-phone" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" placeholder="+7 900 000-00-00" disabled={applicationMutation.isPending} /><label className="checkbox-field"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={applicationMutation.isPending} /><span>Согласен на обработку данных для рассмотрения заявки</span></label>{error && <p className="field-error" role="alert">{error}</p>}<button type="submit" className="button button--primary button--wide" disabled={applicationMutation.isPending}>{applicationMutation.isPending ? <><LoaderCircle size={16} className="button-spinner" /> Отправляем…</> : "Отправить анкету"}</button><p className="form-note">Без оплаты и без обязательств. Статус объекта можно проверить до подачи заявки.</p></form>}</section></div>;
}
