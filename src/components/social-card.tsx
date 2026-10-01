import { Social, SocialPlatform } from "@/types/socials";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TelegramIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
  GlobeIcon,
  DoorOpenIcon,
  LinkSquare02Icon,
  ExpandIcon,
  CollapseIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const platformIcons: Record<SocialPlatform, typeof TelegramIcon> = {
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  youtube: YoutubeIcon,
  website: GlobeIcon,
  openday: DoorOpenIcon,
};

// Подписи платформ для нестандартных карточек (соцсети подписываются своим именем)
const platformLabels: Partial<Record<SocialPlatform, string>> = {
  website: "Сайт филиала",
  openday: "Абитуриенту",
};

// Фон карточки — узнаваемый градиент платформы (решение 2026-10-01);
// для website/openday остаётся фирменный градиент РГСУ
const platformBackgrounds: Record<SocialPlatform, string> = {
  telegram: "bg-[linear-gradient(135deg,#1D96D8_0%,#14709E_55%,#0B4A6C_100%)]",
  instagram: "bg-[linear-gradient(135deg,#833AB4_0%,#E1306C_55%,#F77737_100%)]",
  tiktok: "bg-[linear-gradient(135deg,#23272F_0%,#0B0E14_70%)]",
  youtube: "bg-[linear-gradient(135deg,#FF5A4E_0%,#E62117_55%,#8F0E0A_100%)]",
  website: "bg-rgsu-brand",
  openday: "bg-rgsu-brand",
};

// Цвет глифа на белой иконке-плитке
const platformGlyphColors: Record<SocialPlatform, string> = {
  telegram: "text-[#229ED9]",
  instagram: "text-[#E1306C]",
  tiktok: "text-[#0B0E14]",
  youtube: "text-[#E62117]",
  website: "text-rgsu-royal",
  openday: "text-rgsu-ruby",
};

// Bento-спаны карточки: featured — крупный угол, wide/full — растянуты, normal — 1x1
const sizeClasses: Record<NonNullable<Social["size"]>, string> = {
  featured: "col-span-2 row-span-2",
  wide: "col-span-2 lg:col-span-2",
  full: "col-span-2 lg:col-span-4",
  normal: "col-span-1 lg:col-span-1",
};

interface SocialCardProps {
  social: Social;
  /** Карточка раскрыта (пружинная сетка, только lg) */
  expanded?: boolean;
  /** Клик-переключатель раскрытия (mouse на всей площади карточки) */
  onToggle?: () => void;
  onHover?: () => void;
  onUnhover?: () => void;
}

// Карточка-баннер в стиле og-image: фирменный градиент, диагональные полосы, Bebas-заголовок
export function SocialCard({ social, expanded, onToggle, onHover, onUnhover }: SocialCardProps) {
  const Icon = platformIcons[social.platform];
  const featured = social.size === "featured";
  const compact = social.size === "normal";

  return (
    <article
      className={cn(
        "card-enter squircle group relative w-full h-full flex flex-col overflow-hidden text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition duration-200 hover:shadow-[0_14px_36px_rgba(0,0,0,0.5)] hover:-translate-y-0.5",
        platformBackgrounds[social.platform],
        onToggle && "lg:cursor-pointer",
        sizeClasses[social.size ?? "normal"]
      )}
      onClick={
        onToggle
          ? (e) => {
              // клики по ссылкам и кнопкам не должны раскрывать карточку
              if ((e.target as HTMLElement).closest("a, button")) return;
              onToggle();
            }
          : undefined
      }
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
    >
      {/* Диагональные световые полосы и свечение — как на баннерах rgsu.by */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -bottom-10 left-[14%] w-14 bg-white/5 -skew-x-[18deg]" />
        <div className="absolute -top-10 -bottom-10 left-[42%] w-24 bg-white/[0.04] -skew-x-[18deg]" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_280px_at_88%_0%,rgba(255,255,255,0.10),transparent_60%)]" />
      </div>

      <div className={cn("relative z-10 flex flex-col flex-grow", featured ? "p-5 sm:p-6" : "p-4")}>
        {/* Кнопка раскрытия: на hover и при клавиатурном фокусе (пружинная сетка, lg) */}
        {onToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-pressed={expanded}
            aria-label={`${expanded ? "Свернуть" : "Развернуть"} карточку «${social.title}»`}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:bg-white/20 active:scale-[0.96] transition"
          >
            <HugeiconsIcon
              icon={expanded ? CollapseIcon : ExpandIcon}
              size={14}
              strokeWidth={2}
            />
          </button>
        )}
        {/* Большая 3D-иконка: белая плитка-аппток с бликом и внутренними тенями */}
        <div
          className={cn(
            "relative rounded-2xl [corner-shape:superellipse(4)] bg-white flex items-center justify-center mb-3",
            "shadow-[0_14px_28px_-8px_rgba(0,0,0,0.45),inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_10px_rgba(0,0,0,0.14)]",
            featured ? "w-16 h-16" : "w-12 h-12"
          )}
        >
          <HugeiconsIcon
            icon={Icon}
            size={featured ? 36 : 27}
            strokeWidth={2.5}
            className={platformGlyphColors[social.platform]}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-1.5 right-1.5 top-1 h-1/3 rounded-full bg-gradient-to-b from-white/90 to-transparent blur-[1px]"
          />
          {social.members && (
            <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-rgsu-ruby text-white text-[11px] font-semibold leading-none border border-white/30 shadow-xs">
              {social.members}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/85">
            {platformLabels[social.platform] ?? social.platform}
          </span>
          {social.members && (
            <span className="text-xs text-white/60">· подписчики</span>
          )}
        </div>
        <h2
          className={cn(
            "font-display font-bold uppercase tracking-wide text-white mt-1",
            featured ? "text-3xl leading-[1.1]" : "text-xl leading-[1.1]"
          )}
        >
          {social.title}
        </h2>

        {social.image && (
          <img
            src={social.image}
            alt={social.title}
            loading="lazy"
            className={cn(
              "w-full object-cover border border-white/10 my-3 transition-transform duration-300",
              expanded && "scale-[1.04]",
              featured ? "h-40 sm:h-48 rounded" : "h-24 rounded-lg"
            )}
          />
        )}

        <p
          className={cn(
            "text-white/75 leading-relaxed mt-2 flex-grow",
            compact && !expanded ? "text-xs line-clamp-2" : "text-sm",
            featured && "text-sm"
          )}
        >
          {social.description}
        </p>

        <a
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Перейти — ${social.title}`}
          className={cn(
            "mt-4 inline-flex items-center justify-center gap-1.5 w-full rounded-full bg-rgsu-ruby text-white font-semibold ring-1 ring-white/25 shadow-[0_6px_16px_rgba(120,15,10,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:brightness-110 active:scale-[0.96] transition",
            compact ? "h-9 text-xs" : "h-11 text-sm"
          )}
        >
          Перейти
          <HugeiconsIcon icon={LinkSquare02Icon} size={compact ? 14 : 16} strokeWidth={2} />
        </a>
      </div>
    </article>
  );
}
