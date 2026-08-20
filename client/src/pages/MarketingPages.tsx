/** Figma reference: public tenant and owner routes use canonical product copy, benefits and conversion flows. */
import { ArrowRight, BadgeCheck, Check, CircleDollarSign, FileCheck2, HeartHandshake, House, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { calculateOwnerEconomics, formatRubles, propertyImage } from "@/lib/domain";
import { useState } from "react";

const tenantSteps = [
  ["1", "Найдите квартиру", "Воспользуйтесь картой или списком. Фильтруйте по бюджету, комнатности и метро."],
  ["2", "Оставьте заявку", "Понравилась квартира — оставьте заявку прямо на сайте."],
  ["3", "Подпишите договор онлайн", "Договор аренды подписывается онлайн без визита к нотариусу."],
  ["4", "Въезжайте и управляйте арендой", "Оплата, документы и поддержка — всё в личном кабинете."],
];

const ownerMobileSteps = [
  ["01", "Расскажите о квартире", "Заполните короткую форму — мы свяжемся с вами."],
  ["02", "Мы подготовим объявление", "Сделаем качественные фото и опубликуем объявление."],
  ["03", "Выберите арендатора", "Выберите подходящего кандидата и подпишите договор онлайн."],
  ["04", "Сопровождаем аренду", "Остаёмся на связи после заселения и помогаем решать вопросы."],
];

const ownerDesktopSteps = [
  ["1", "Расскажите о квартире", "Заполните короткую форму — мы свяжемся с вами."],
  ["2", "Мы подготовим объявление", "Сделаем качественные фото и опубликуем объявление."],
  ["3", "Выберите арендатора и подпишите договор", "Выберите подходящего арендатора и подпишите договор онлайн."],
];

function Steps({ steps }: { steps: string[][] }) {
  return <div className={`steps-grid ${steps.length === 3 ? "steps-grid--three" : ""}`}>{steps.map(([number, title, text]) => <article className="step-card" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>;
}

function OwnerEstimator({ rate, setRate }: { rate: number; setRate: (value: number) => void }) {
  const economics = calculateOwnerEconomics(rate);
  return <section id="estimate" className="estimator-section"><div><p className="eyebrow">Оцените стоимость аренды</p><h2>Узнайте, сколько можно получать</h2><p>Локальный калькулятор дохода для mobile-сценария. Реальные платежи и договоры не подключены в frontend-версии.</p><label htmlFor="owner-rate">Желаемая ставка, ₽ в месяц</label><input id="owner-rate" type="number" min="0" step="1000" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></div><div className="economics-card"><div><span>Вы получаете</span><strong>{formatRubles(economics.ownerIncome)}</strong></div><div><span>Арендатор платит в месяц</span><strong>{formatRubles(economics.tenantMonthlyTotal)}</strong></div><div><span>Сервисный сбор</span><strong>{formatRubles(economics.serviceFee)}</strong></div></div></section>;
}

function DesktopAddressEstimator() {
  const [address, setAddress] = useState("");
  const [sent, setSent] = useState(false);
  return <section id="estimate" className="estimator-section estimator-section--address"><div><p className="eyebrow">Оцените стоимость аренды</p><h2>Узнайте рыночную стоимость аренды для вашей квартиры за пару минут</h2><p>Введите адрес — мы рассчитаем рыночный диапазон. Без звонков и обязательств.</p></div><div className="estimate-address-card"><label htmlFor="owner-address">Адрес квартиры</label><input id="owner-address" value={address} onChange={(event) => { setAddress(event.target.value); setSent(false); }} placeholder="Например, ул. Баумана, 15" /><button type="button" className="button button--primary" onClick={() => setSent(true)} disabled={!address.trim()}>Получить оценку <ArrowRight size={16} /></button>{sent && <p className="estimate-success" role="status">Заявка на оценку подготовлена. В этой frontend-версии адрес не отправляется.</p>}</div></section>;
}

function Faq({ owner = false }: { owner?: boolean }) {
  const items = owner
    ? ["Сколько стоит размещение?", "Как вы проверяете арендаторов?", "Можно ли выбрать арендатора самостоятельно?", "Как проходит подписание договора?"]
    : ["Почему комиссия не берётся с арендатора?", "Как проходит показ?", "Что входит в сервисный сбор?"];
  const answer = owner
    ? "Размещение квартиры и первичная консультация полностью бесплатны. Мы берём комиссию только после успешного заключения договора аренды — никаких скрытых платежей."
    : "Вы видите ежемесячную сумму, сервисный сбор и условия объекта до того, как оставите заявку.";
  return <section className="faq-section"><p className="eyebrow">Частые вопросы</p><h2>{owner ? "Если не нашли ответ — напишите нам" : "Ничего не спрятано в мелком шрифте"}</h2><div className="faq-list">{items.map((item, index) => <details key={item} open={index === 0}><summary>{item}</summary><p>{answer}</p></details>)}</div></section>;
}

export function RentPage() {
  return <AppShell><Seo title="Снять квартиру без лишних расходов" description="Проверенные квартиры в Казани: без залога, без комиссии риелтора и с прозрачным договором." /><section className="marketing-page">
    <div className="marketing-hero marketing-hero--tenant"><div className="marketing-hero__copy"><p className="eyebrow">Арендаторам</p><h1>Снять квартиру просто и без лишних расходов</h1><p>Без залога, без комиссии риелтора, с проверенными квартирами и прозрачным договором. Весь процесс от поиска до заселения — онлайн.</p><div className="hero-actions"><Link href="/search" className="button button--primary">Найти квартиру <ArrowRight size={16} /></Link><a href="#how" className="text-link">Как это работает</a></div><div className="hero-proof"><span><BadgeCheck size={17} /> Проверенные квартиры</span><span><CircleDollarSign size={17} /> Без залога. Без комиссии риелтора.</span></div></div><div className="marketing-hero__visual"><img src={propertyImage.living} width="1200" height="800" fetchPriority="high" alt="Светлый интерьер проверенной квартиры" /><div className="photo-note">Без залога<br /><b>Без комиссии риелтора</b></div></div></div>
    <section className="benefits-section"><p className="eyebrow">Почему «Аренда БЕЗ»</p><h2>Мы упростили аренду так, чтобы вы сосредоточились на выборе квартиры</h2><div className="benefits-grid"><article><ShieldCheck /><h3>Без залога</h3><p>Никакого залога при заселении. Только арендная плата и небольшой сервисный сбор.</p></article><article><FileCheck2 /><h3>Проверенные квартиры</h3><p>Каждый объект осмотрен нашей командой. Фото соответствуют реальному состоянию квартиры.</p></article><article><HeartHandshake /><h3>Договор с защитой</h3><p>Официальный договор аренды с понятными условиями защищает ваши права с первого дня.</p></article><article className="desktop-benefit"><BadgeCheck /><h3>Поддержка 7 дней</h3><p>Любые вопросы по квартире или договору — мы на связи каждый день в рабочие часы.</p></article></div></section>
    <section id="how" className="process-section"><div><p className="eyebrow">От поиска до новоселья — 4 шага</p><h2>Простой путь от заявки до подписанного договора</h2></div><Steps steps={tenantSteps} /></section>
    <section className="comparison-section"><div><p className="eyebrow">Аренда БЕЗ vs. обычная аренда</p><h2>Посмотрите, как мы отличаемся от традиционного рынка</h2></div><div className="comparison-table"><div className="comparison-table__head"><span>Что важно</span><strong>Аренда БЕЗ</strong><span>Рынок / риелтор</span></div><div><span>Залог при заселении</span><strong><Check /> 0 ₽</strong><span>1–2 месяца аренды</span></div><div><span>Комиссия риелтора</span><strong><Check /> 0 ₽</strong><span>50–100% от аренды</span></div><div><span>Проверка квартиры</span><strong><Check /> Да, командой сервиса</strong><span>Не гарантируется</span></div><div><span>Договор</span><strong><Check /> Онлайн, понятные условия</strong><span>Зависит от собственника</span></div></div></section>
    <section className="cta-band"><div><p className="eyebrow">Готовы найти квартиру?</p><h2>Просматривайте проверенные варианты на карте, выбирайте по фото и оставляйте заявку прямо сейчас.</h2></div><Link href="/search" className="button button--primary">Перейти к поиску <ArrowRight size={16} /></Link></section><Faq />
  </section></AppShell>;
}

export function LandlordsPage() {
  const [rate, setRate] = useState(50000);
  return <AppShell><Seo title="Сдавайте квартиру спокойно и выгодно" description="Поможем найти надёжного арендатора, оформить договор и сопровождать аренду." /><section className="marketing-page">
    <div className="marketing-hero marketing-hero--owner"><div className="marketing-hero__copy"><p className="eyebrow">Для собственников</p><h1>Сдавайте квартиру спокойно и выгодно</h1><p>Поможем найти надёжного арендатора, оформить договор и сопровождать аренду.</p><div className="hero-actions"><Link href="/auth?mode=register" className="button button--primary">Разместить квартиру <ArrowRight size={16} /></Link><a href="#estimate" className="text-link">Узнать, сколько можно получать →</a></div><div className="hero-proof"><span><House size={17} /> Размещение и консультация — бесплатно</span></div></div><div className="marketing-hero__visual"><img src={propertyImage.kitchen} width="1200" height="800" fetchPriority="high" alt="Светлый интерьер квартиры для сдачи" /><div className="photo-note">Договор онлайн<br /><b>Поддержка 7 дней</b></div></div></div>
    <section className="benefits-section"><p className="eyebrow">Аренда БЕЗ</p><h2>Вы выбираете арендатора — остальное делаем мы</h2><div className="benefits-grid"><article><CircleDollarSign /><h3>Проверяем арендаторов</h3><p>Собираем анкету и помогаем выбрать подходящего кандидата.</p></article><article><Sparkles /><h3>Готовим договор</h3><p>Оформляем договор аренды с понятными условиями.</p></article><article><HeartHandshake /><h3>Сопровождаем аренду</h3><p>Остаёмся на связи после заселения и помогаем решать вопросы.</p></article><article className="desktop-benefit"><FileCheck2 /><h3>Проверяем квартиру каждый месяц</h3><p>Проверяем состояние жилья и отправляем фотоотчёт в личный кабинет.</p></article></div></section>
    <div className="mobile-only"><OwnerEstimator rate={rate} setRate={setRate} /><section className="process-section"><div><p className="eyebrow">Как это работает</p><h2>Собираем сдачу в управляемый путь</h2></div><Steps steps={ownerMobileSteps} /></section></div>
    <div className="desktop-only"><section className="process-section"><div><p className="eyebrow">Как это работает</p><h2>Сдадим квартиру за 3 шага</h2></div><Steps steps={ownerDesktopSteps} /></section><DesktopAddressEstimator /></div>
    <section className="owner-cta"><div><p className="eyebrow">Готовы сдать квартиру без лишней рутины?</p><h2>Оставьте заявку — поможем подготовить объект, найти арендатора и оформить договор.</h2><Link href="/auth?mode=register" className="button button--primary">Разместить квартиру <ArrowRight size={16} /></Link></div><img src={propertyImage.bedroom} width="900" height="600" loading="lazy" alt="Светлая квартира для сдачи" /></section><Faq owner />
  </section></AppShell>;
}
