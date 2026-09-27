# Социальные сети — Филиал РГСУ в г. Минске

Карточки официальных социальных сетей филиала в bento grid. Оформление в фирменном стиле РГСУ.

## Запуск

```bash
npm install
npm run dev       # http://localhost:3001
npm run build     # сборка в dist/
npm run preview   # предпросмотр сборки
```

## Как добавить / изменить карточку

Отредактируйте `public/data/socials.json` прямо на хостинге (пересборка не нужна):

```json
{
  "id": "youtube",
  "platform": "youtube",
  "title": "YouTube-канал",
  "description": "Описание карточки",
  "url": "https://www.youtube.com/@...",
  "size": "wide"
}
```

`size` управляет размером карточки в bento-сетке: `featured` (большая 2×2), `wide` (широкая 2×1), `full` (на всю ширину), `normal` (обычная).
