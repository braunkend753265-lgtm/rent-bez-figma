/** Figma fidelity: светлый интерфейс Аренда БЕЗ; SEO-метаданные описывают реальную функцию каждого публичного маршрута. */
import { useEffect } from "react";

export function Seo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} — Аренда БЕЗ`;
    const tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (tag) tag.content = description;
  }, [description, title]);
  return null;
}
