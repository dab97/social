# HANDOFF — статус проекта social (и spravka)

> Документ для продолжения работы в новой сессии. Обновляется вручную.
> Актуально на: 2026-09-27, после push c11d413 (social) и локальных правок favicon.

## Проект social (E:\__REACT__\social, github.com/dab97/social)

**Готово:**
- Приложение «Социальные сети» филиала РГСУ в г. Минске — Vite 6 + React 18 + TS strict + Tailwind, БЕЗ UI-библиотек (без Radix).
- Карточки-баннеры в стиле rgsu.by: градиент navy #082567 → royal #102FA1, диагональные полосы, свечение, Bebas Neue Pro заголовки, рубиновые CTA «Перейти» (#A91917, класс bg-rgsu-ruby — НЕ bg-ruby, классы фирменных цветов всегда с префиксом rgsu-!).
- Bento grid: `size` в JSON → featured (2×2), wide (2×1), full (4×1), normal (1×1). Мобильные: сетка 2 колонки, featured/wide — на всю ширину.
- Данные: `public/data/socials.json`, fetch + cache-bust, редактируются на хостинге. Ссылки заполнены пользователем (2 Telegram-чата, Instagram, TikTok, сайт rgsu.by, дни открытых дверей).
- Опциональные поля поддержаны вёрсткой: `image` (превью-скриншот, положить в public/img/) и `members` (счётчик подписчиков строкой) — пока не заполнены.
- Доступность: prefers-reduced-motion / reduced-transparency / contrast. Тёмная тема: акценты Ice #D5E4F4 (классы text-rgsu-ice).
- GitHub: запушено, ветка master.

**НЕ ЗАБУДЬ СДЕЛАТЬ (по приоритету):**
1. **Перегенерировать `social/public/favicon.png`** — он остался от старого квадратного дизайна. Порядок: создать в public файл-рендер `_favicon-render.html` (img 320×320 c /favicon.svg, образец в spravka/public/_favicon-render.html), открыть через dev-сервер, скриншот 320×320 → сохранить в public/favicon.png. Браузерные скриншоты иногда таймаутят — повторять.
2. **OG-image** — не создана. Сделать по образцу spravka (scripts/generate-promo-mockups.mjs) или простой баннер с Bebas + QR/иконками.
3. **git init в social сделан, remote origin прописан** — пушить после каждого изменения.
4. Идея на будущее: сайт-филиала rgsu.by использует синий #1237B8 — решили НЕ заводить третий синий, у нас Pantone 286 C #102FA1.

## Проект spravka (E:\__REACT__\spravka, github.com/dab97/spravka)

**Готово и запушено (5ef6ca5):** Lighthouse 99/100/100/100, Liquid Glass капсулы, Bebas-герой, градиентные кнопки bg-rgsu-brand, кобальтовая палитра, ленивая QR-модалка (cssCodeSplit:false + инлайн CSS + prefetch по hover/idle — баг «Unable to preload CSS» при открытии QR исправлен), preconnect к формам Яндекса/Google (AGENTS.md: не удалять!), доступность.

**НЕ ЗАКОММИЧЕНО (ждёт в рабочем дереве):**
1. `public/favicon.svg`, `public/logo-white.svg`, `public/logo-sapphire.svg` — знак логотипа вписан в круглую маску (scale 0.78 вокруг центра, БЕЗ обрезки — знак обрезать нельзя).
2. `public/_favicon-render.html` — утилита рендера favicon.png (оставить или удалить после перегенерации).
3. **`public/favicon.png` перегенерировать** из нового favicon.svg (см. пункт 1 social).
4. `public/fonts/BebasNeuePro-Book.woff2` удалён, `logo-blue.svg` удалён — чисто.

## Единая дизайн-система (брендбук)

| Цвет | Pantone | HEX | Роль |
|---|---|---|---|
| Royal Blue | 286 C | #102FA1 | Действия, кнопки, favicon, лого-плашка |
| Navy | 2758 C | #082567 | Логотип на белом, тёмная часть градиента |
| Ruby | 7627 C | #A91917 | Условия «паспорт», промо-CTA |
| Ice | 656 U | #D5E4F4 | Акценты тёмной темы |
| Градиент | — | #082567→#102FA1 | Токен `bg-rgsu-brand`, фон баннеров |

- Имена цветов в коде ТОЛЬКО с префиксом `rgsu-` (navy/royal/ice/ruby) — «Кобальт», «Сапфир» и др. не использовать.
- Числа: счётчики — font-bold по центру; «Каб. N» — обычное начертание; mono НЕ используется (решение 2026-09).
- Знак логотипа обрезать нельзя — вписывать в круг масштабом.
- Три иконки-кнопки шапки spravka — всегда одинаковые (дефолт и hover).
- preconnect к форм-доменам в spravka — намеренный, не удалять несмотря на Lighthouse insight.

## Деплой (оба сайта)

1. `npm run build` в каждом проекте.
2. На хостинге ПОЛНОСТЬЮ заменить содержимое (особенно папку `assets/` — старые хэшированные файлы должны удалиться).
3. Один раз Ctrl+F5 (у ассетов годовой кэш; HTML — no-cache).
