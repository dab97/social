# AGENTS.md — Точка входа для ИИ-агентов (social)

Сайт «Социальные сети» филиала РГСУ в г. Минске — карточки официальных сообществ в bento grid.
Стек: **Vite 6 + React 18 + TypeScript (strict) + Tailwind CSS** (без UI-библиотек). Интерфейс на русском. Бэкенда нет — данные из внешнего статического JSON.

**Дизайн-система наследуется от соседнего проекта `spravka`** (см. `E:\__REACT__\spravka\AGENTS.md`): Liquid Glass капсулы, Bebas Neue Pro для героя, hairline-границы, скругления Squircle.

## Команды

```bash
npm run dev       # dev-сервер (порт 3001, host: true)
npm run build     # tsc && vite build — основной критерий проверки
npm run preview   # предпросмотр собранной папки dist
```

## Карта кода

- `src/App.tsx` — корневой компонент: стеклянная капсула-шапка, Bebas-герой, bento-сетка, скелетоны, обработка ошибок
- `src/components/social-card.tsx` — карточка соцсети (bento-спаны по полю `size`)
- `src/components/ThemeSwitcher.tsx` — переключатель темы
- `src/context/theme-provider.tsx` — React-контекст темы (localStorage `social-ui-theme`)
- `public/data/socials.json` — данные карточек, редактируются на хостинге
- `scripts/` — пока пусто; при необходимости генерация og-image по образцу spravka

## Критические инварианты

1. **`socials.json` НЕЛЬЗЯ импортировать статически!** Только `fetch('/data/socials.json')` — файл редактируется на хостинге без пересборки.
2. **Внешние ссылки — только нативные `<a target="_blank" rel="noopener noreferrer">`**. Никаких SPA-роутеров.
3. **Bento grid:** поле `size` в JSON управляет спанами (`featured` = 2×2, `wide` = 2×1, `full` = 4×1, `normal` = 1×1). Раскладка должна сходиться без дыр на lg (4 колонки).
4. **Цвета — только из брендбука:** Royal Blue `#102FA1` (Pantone 286 C), Navy `#082567` (Pantone 2758 C), Ruby `#A91917` (Pantone 7627 C), Ice `#D5E4F4` (Pantone 656 U). Тёмная тема: светлые акценты — Ice.
5. **Мобильные — приоритет:** сначала вёрстка для узких экранов, затем брейкпоинты. Декоративные элементы не должны ломать чтение на 320–390px.
6. **TypeScript strict, сборка с нулём ошибок** — обязательна перед коммитом.
