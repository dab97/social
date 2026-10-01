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

// Bento-спаны на lg (4 трека). На мобильном — асимметричная мозаика на 3 треках,
// классы приходят пропсом mobileClassName из BentoGrid (как в референсе vuesax)
const lgSizeClasses: Record<NonNullable<Social["size"]>, string> = {
  featured: "lg:col-span-2 lg:row-span-2",
  wide: "lg:col-span-2",
  full: "lg:col-span-4",
  normal: "lg:col-span-1",
};

// RGB-триплеты для proximity-glow (рамка подсвечивается цветом платформы)
const platformGlowRgb: Record<SocialPlatform, string> = {
  telegram: "34 174 222",
  instagram: "225 48 108",
  tiktok: "205 215 235",
  youtube: "255 70 60",
  website: "90 120 255",
  openday: "220 60 55",
};

interface SocialCardProps {
  social: Social;
  /** Мобильные bento-спаны (мозаика на 3 треках) */
  mobileClassName?: string;
  /** Узкая карточка мобильной мозаики — компактная вёрстка (text-xs, clamp) */
  mobileCompact?: boolean;
  /** Карточка раскрыта (пружинная сетка) */
  expanded?: boolean;
  /** Клик-переключатель раскрытия (mouse на всей площади карточки) */
  onToggle?: () => void;
  onHover?: () => void;
  onUnhover?: () => void;
}

// Ripple при нажатии (адаптация vs-fx pressRipple, плоская — без 3D-наклона)
function spawnCardRipple(e: React.PointerEvent<HTMLElement>) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const host = e.currentTarget;
  const r = host.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const dx = Math.max(x, r.width - x);
  const dy = Math.max(y, r.height - y);
  const size = Math.hypot(dx, dy) * 2;
  const span = document.createElement("span");
  span.className = "card-ripple";
  span.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px`;
  span.addEventListener("animationend", () => span.remove());
  host.appendChild(span);
}

// Карточка-баннер в стиле og-image: фирменный градиент, диагональные полосы, Bebas-заголовок
export function SocialCard({ social, mobileClassName, mobileCompact, expanded, onToggle, onHover, onUnhover }: SocialCardProps) {
  const Icon = platformIcons[social.platform];
  const featured = social.size === "featured";
  const compact = social.size === "normal" || mobileCompact;

  return (
    <article
      className={cn(
        "card-enter squircle group relative w-full h-full flex flex-col overflow-hidden text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-[box-shadow,background-color] duration-200 hover:shadow-[0_14px_36px_rgba(0,0,0,0.5)]",
        platformBackgrounds[social.platform],
        onToggle && "cursor-pointer",
        mobileClassName,
        lgSizeClasses[social.size ?? "normal"]
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
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onHover?.(); // hover-расширение треков только для мыши
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") onUnhover?.();
      }}
      onPointerDown={spawnCardRipple}
      style={{ "--glow-tint": platformGlowRgb[social.platform] } as React.CSSProperties}
    >
      {/* Proximity-glow: рамка подсвечивается цветом платформы при приближении курсора */}
      <span aria-hidden className="card-glow" />
      {/* Диагональные световые полосы и свечение — как на баннерах rgsu.by */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -bottom-10 left-[14%] w-14 bg-white/5 -skew-x-[18deg]" />
        <div className="absolute -top-10 -bottom-10 left-[42%] w-24 bg-white/[0.04] -skew-x-[18deg]" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_280px_at_88%_0%,rgba(255,255,255,0.10),transparent_60%)]" />
      </div>

      <div className={cn("relative z-10 flex flex-col flex-grow", featured ? "p-5 sm:p-6" : "p-4", mobileCompact && "max-lg:p-3")}>
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
            className={cn(
              "absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover:bg-white/20 active:scale-[0.96] transition",
              mobileCompact && "max-lg:hidden"
            )}
          >
            <HugeiconsIcon
              icon={expanded ? CollapseIcon : ExpandIcon}
              size={14}
              strokeWidth={2}
            />
          </button>
        )}
        {/* Большая 3D-иконка: белая плитка-аппток с бликом и внутренними тенями.
            Радиус концентричный: внешний 40px − паддинг карточки (better-ui). */}
        <div
          className={cn(
            "relative bg-white flex items-center justify-center mb-3 [corner-shape:superellipse(2.4)]",
            "shadow-[0_14px_28px_-8px_rgba(0,0,0,0.45),inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_10px_rgba(0,0,0,0.14)]",
            featured
              ? "w-16 h-16 rounded-tile-lg"
              : cn("w-12 h-12 rounded-tile", mobileCompact && "max-lg:w-10 max-lg:h-10 max-lg:rounded-tile-sm")
          )}
        >
          <HugeiconsIcon
            icon={Icon}
            size={featured ? 36 : 27}
            strokeWidth={2.5}
            className={cn(platformGlyphColors[social.platform], mobileCompact && "max-lg:w-[22px] max-lg:h-[22px]")}
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
            featured && "text-sm",
            mobileCompact && "max-lg:text-xs max-lg:line-clamp-2 max-lg:hidden"
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
            "inline-flex items-center justify-center rounded-full bg-rgsu-ruby text-white font-semibold ring-1 ring-white/25 shadow-[0_6px_16px_rgba(120,15,10,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:brightness-110 active:scale-[0.96] transition",
            // Узкие карточки на мобильном: круг-иконка прижат к низу; иначе — полная плашка
            compact || mobileCompact
              ? "max-lg:mt-auto max-lg:ml-auto max-lg:w-10 max-lg:h-10 mt-4 w-full h-11 text-sm"
              : "mt-4 gap-1.5 w-full h-11 text-sm"
          )}
        >
          <span className={cn((compact || mobileCompact) && "max-lg:hidden")}>Перейти</span>
          <HugeiconsIcon
            icon={LinkSquare02Icon}
            size={16}
            strokeWidth={2}
            className={cn((compact || mobileCompact) && "max-lg:w-[18px] max-lg:h-[18px]")}
          />
        </a>
      </div>
    </article>
  );
}
