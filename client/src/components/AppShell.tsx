/** Figma fidelity: светлый интерфейс Аренда БЕЗ; нейтральный фон, синий акцент, плотная практичная навигация. */
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

const logoUrl = "/manus-storage/rentbez-logo_db53fdec.png";

export function AppShell({
  children,
  variant = "public",
}: {
  children: React.ReactNode;
  variant?: "public" | "auth";
}) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const menuId = useId();

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={`app-shell app-shell--${variant}`}>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/search" className="brand" aria-label="Аренда БЕЗ: перейти к поиску">
            <img src={logoUrl} width="36" height="36" alt="" className="brand__mark" />
            <span className="brand__name">Аренда БЕЗ</span>
          </Link>
          <span className="city-control" aria-label="Выбранный город: Казань">Казань</span>
          <nav className="desktop-nav" aria-label="Основная навигация">
            <Link href="/search">Найти квартиру</Link>
            <Link href="/rent">Как это работает</Link>
            <Link href="/landlords">Собственникам</Link>
          </nav>
          <Link href="/auth?mode=login" className="header-login">Войти</Link>
          <button
            type="button"
            className="mobile-menu-button"
            aria-controls={menuId}
            aria-expanded={open}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
        {open && (
          <nav id={menuId} className="mobile-nav" aria-label="Мобильная навигация">
            <Link href="/search">Найти квартиру</Link>
            <Link href="/rent">Как это работает</Link>
            <Link href="/landlords">Собственникам</Link>
            <Link href="/auth?mode=login">Войти</Link>
          </nav>
        )}
      </header>
      <main>{children}</main>
      {variant === "public" && (
        <footer className="site-footer">
          <div className="site-footer__inner">
            <div className="site-footer__brand">
              <Link href="/search" className="brand" aria-label="Аренда БЕЗ: перейти к поиску">
                <img src={logoUrl} width="32" height="32" alt="" className="brand__mark" />
                <span className="brand__name">Аренда БЕЗ</span>
              </Link>
              <p>Аренда жилья с понятными условиями и сервисной поддержкой.</p>
            </div>
            <div><strong>Арендаторам</strong><Link href="/search">Найти квартиру</Link><Link href="/rent">Как это работает</Link><Link href="/auth?mode=login">Войти в кабинет</Link></div>
            <div><strong>Собственникам</strong><Link href="/landlords">Разместить квартиру</Link><Link href="/landlords#estimate">Оценить стоимость</Link><Link href="/owner">Кабинет собственника</Link></div>
            <div><strong>Контакты</strong><a href="tel:+78432000000">+7 (843) 200-00-00</a><a href="mailto:hello@arendabez.ru">hello@arendabez.ru</a><span>Казань, Республика Татарстан</span></div>
          </div>
          <div className="site-footer__bottom"><span>© 2026 Аренда БЕЗ</span><span>Пользовательское соглашение · Конфиденциальность</span></div>
        </footer>
      )}
    </div>
  );
}
