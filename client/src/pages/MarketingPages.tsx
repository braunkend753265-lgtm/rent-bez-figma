/** Figma fidelity: светлый интерфейс Аренда БЕЗ; асимметричный editorial-лендинг с доказательствами, процессом и точными CTA. */
import { ArrowRight, BadgeCheck, Check, CircleDollarSign, FileCheck2, HeartHandshake, House, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { AppShell } from "@/components/AppShell";
import { Seo } from "@/components/Seo";
import { calculateOwnerEconomics, formatRubles, propertyImage } from "@/lib/domain";
import { useState } from "react";

const tenantSteps = [
  ["01", "Выберите квартиру", "Фильтры, фотографии, условия и стоимость видны до заявки."],
  ["02", "Заполните анкету", "Нужна только базовая информация для знакомства с собственником."],
  ["03", "Посмотрите квартиру", "Показы организует менеджер сервиса в удобное время."],
  ["04", "Заселяйтесь спокойно", "Условия зафиксированы, а сервис остаётся на связи."],
];

const ownerSteps = [
  ["01", "Расскажите о квартире", "Заполните короткую форму — без сложного личного кабинета на старте."],
  ["02", "Мы проверим и оформим", "Поможем подготовить объект и понятное объявление."],
  ["03", "Получайте заявки", "Сначала квалификация арендатора, потом подходящие показы."],
  ["04", "Сдавайте без лишнего", "Статусы и коммуникация собраны в одном понятном сценарии."],
];

const ownerDesktopSteps = ownerSteps.slice(0, 3);

function Steps({ steps, className = "" }: { steps: string[][]; className?: string }) {
  return <div className={`steps-grid ${steps.length === 3 ? "steps-grid--three" : ""} ${className}`}>{steps.map(([number, title, text]) => <article className="step-card" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>;
}

function OwnerEstimator({ rate, setRate }: { rate: number; setRate: (value: number) => void }) {
  const economics = calculateOwnerEconomics(rate);
  return <section id="estimate" className="estimator-section"><div><p className="eyebrow">Оцените стоимость</p><h2>Посмотрите модель без скрытых вычетов</h2><p>Это локальный расчёт для сценария Figma. Реальные платежи и договоры не подключены в frontend-версии.</p><label htmlFor="owner-rate">Желаемая ставка, ₽ в месяц</label><input id="owner-rate" type="number" min="0" step="1000" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></div><div className="economics-card"><div><span>Вы получаете</span><strong>{formatRubles(economics.ownerIncome)}</strong></div><div><span>Арендатор платит в месяц</span><strong>{formatRubles(economics.tenantMonthlyTotal)}</strong></div><div><span>Сервисный сбор</span><strong>{formatRubles(economics.serviceFee)}</strong></div></div></section>;
}

function Faq({ owner = false }: { owner?: boolean }) {
  const items = owner
    ? ["Сколько стоит сервис?", "Можно ли сдать квартиру без залога?", "Как вы проверяете арендаторов?"]
    : ["Почему комиссия не берётся с арендатора?", "Как проходит показ?", "Что входит в сервисный сбор?"];
  return <section className="faq-section"><p className="eyebrow">Частые вопросы</p><h2>{owner ? "Понятные условия для собственника" : "Ничего не спрятано в мелком шрифте"}</h2><div className="faq-list">{items.map((item, index) => <details key={item} open={index === 0}><summary>{item}</summary><p>{owner ? "Вы заранее видите модель расчёта. Полная операционная модель и договоры подключаются после серверной интеграции." : "Вы видите ежемесячную сумму, сервисный сбор и условия объекта до того, как оставите заявку."}</p></details>)}</div></section>;
}

export function RentPage() {
  return <AppShell><Seo title="Снять квартиру без лишних расходов" description="Проверенные квартиры в Казани: прозрачные условия, понятная ежемесячная стоимость и заявка на просмотр." /><section className="marketing-page">
    <div className="marketing-hero marketing-hero--tenant"><div className="marketing-hero__copy"><p className="eyebrow">Аренда в Казани</p><h1>Снять квартиру просто и без лишних расходов</h1><p>Выбирайте проверенные объекты, видьте все условия заранее и проходите путь до показа без посреднической суеты.</p><div className="hero-actions"><Link href="/search" className="button button--primary">Найти квартиру <ArrowRight size={16} /></Link><a href="#how" className="text-link">Как это работает</a></div><div className="hero-proof"><span><BadgeCheck size={17} /> Проверенные объекты</span><span><CircleDollarSign size={17} /> Прозрачная сумма</span></div></div><div className="marketing-hero__visual"><img src={propertyImage.living} width="1200" height="800" fetchPriority="high" alt="Светлый интерьер проверенной квартиры" /><div className="photo-note">Без комиссии агенту<br /><b>Понятный сервисный сбор</b></div></div></div>
    <section className="benefits-section"><p className="eyebrow">Почему Аренда БЕЗ</p><h2>Мы упрощаем аренду, не пряча важное</h2><div className="benefits-grid"><article><ShieldCheck /><h3>Без комиссии</h3><p>Никаких непонятных процентов посреднику в день заселения.</p></article><article><FileCheck2 /><h3>Проверенные квартиры</h3><p>Статус объекта и ключевые условия показываем прямо в карточке.</p></article><article><HeartHandshake /><h3>Помощь с показом</h3><p>Менеджер помогает согласовать дальнейшие шаги после анкеты.</p></article><article className="desktop-benefit"><BadgeCheck /><h3>Понятный договор</h3><p>Ключевые условия аренды видны до того, как вы оставите заявку.</p></article></div></section>
    <section id="how" className="process-section"><div><p className="eyebrow">От поиска до новоселья</p><h2>Четыре шага без бесконечных звонков</h2></div><Steps steps={tenantSteps} /></section>
    <section className="comparison-section"><div><p className="eyebrow">Сравнение</p><h2>Аренда БЕЗ и обычная аренда</h2></div><div className="comparison-table"><div className="comparison-table__head"><span>Что важно</span><strong>Аренда БЕЗ</strong><span>Обычный поиск</span></div><div><span>Условия до заявки</span><strong><Check /> Показаны</strong><span>Часто уточняются позже</span></div><div><span>Комиссия агенту</span><strong><Check /> Нет</strong><span>Зависит от посредника</span></div><div><span>Статус квартиры</span><strong><Check /> В карточке</strong><span>Нужно перепроверять</span></div></div></section>
    <section className="cta-band"><div><p className="eyebrow">Готовы искать?</p><h2>Выберите квартиру, которая подходит именно вам</h2></div><Link href="/search" className="button button--primary">Открыть каталог <ArrowRight size={16} /></Link></section><Faq />
  </section></AppShell>;
}

export function LandlordsPage() {
  const [rate, setRate] = useState(50000);
  return <AppShell><Seo title="Сдать квартиру спокойно и выгодно" description="Сервисный сценарий для собственников: прозрачная стоимость, подготовка объекта и квалификация заявок." /><section className="marketing-page">
    <div className="marketing-hero marketing-hero--owner"><div className="marketing-hero__copy"><p className="eyebrow">Для собственников</p><h1>Сдавайте квартиру спокойно и выгодно</h1><p>Сохраняйте желаемую ставку, получайте подходящие заявки и понимаете, что происходит на каждом шаге.</p><div className="hero-actions"><Link href="/auth?mode=register" className="button button--primary">Разместить квартиру <ArrowRight size={16} /></Link><a href="#estimate" className="text-link">Оценить выгоду</a></div><div className="hero-proof"><span><House size={17} /> Только целевые показы</span><span><ShieldCheck size={17} /> Понятные статусы</span></div></div><div className="marketing-hero__visual"><img src={propertyImage.kitchen} width="1200" height="800" fetchPriority="high" alt="Светлый интерьер квартиры для сдачи" /><div className="photo-note">Ставку задаёте вы<br /><b>Сервисный сбор прозрачен</b></div></div></div>
    <section className="benefits-section"><p className="eyebrow">Почему Аренда БЕЗ</p><h2>Больше ясности на каждом этапе сдачи</h2><div className="benefits-grid"><article><CircleDollarSign /><h3>Без потери ставки</h3><p>Вы видите сумму, которую хотите получать, ещё до размещения.</p></article><article><Sparkles /><h3>Подготовка объявления</h3><p>Единая логика карточки и условий помогает сравнивать объекты честно.</p></article><article><HeartHandshake /><h3>Квалификация заявок</h3><p>Сначала базовая анкета, затем предложенные показы и понятный статус.</p></article><article className="desktop-benefit"><FileCheck2 /><h3>Статусы в одном месте</h3><p>Понимайте, на каком шаге объект и какие действия требуются дальше.</p></article></div></section>
    <div className="mobile-only"><OwnerEstimator rate={rate} setRate={setRate} /><section className="process-section"><div><p className="eyebrow">Как это работает</p><h2>Собираем сдачу в управляемый путь</h2></div><Steps steps={ownerSteps} /></section></div>
    <div className="desktop-only"><section className="process-section"><div><p className="eyebrow">Как это работает</p><h2>Сдайте квартиру за 3 шага</h2></div><Steps steps={ownerDesktopSteps} /></section><OwnerEstimator rate={rate} setRate={setRate} /></div>
    <section className="owner-cta"><div><p className="eyebrow">Готовы начать?</p><h2>Расскажите о квартире — мы покажем следующий шаг</h2><p>В этой frontend-поставке вы увидите клиентский путь; проверка документов и модерация добавляются с серверной частью.</p><Link href="/auth?mode=register" className="button button--primary">Создать профиль <ArrowRight size={16} /></Link></div><img src={propertyImage.bedroom} width="900" height="600" loading="lazy" alt="Светлая квартира для сдачи" /></section><Faq owner />
  </section></AppShell>;
}
