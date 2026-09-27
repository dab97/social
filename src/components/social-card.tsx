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

// Bento-спаны карточки: featured — крупный угол, wide/full — растянуты, normal — 1x1
const sizeClasses: Record<NonNullable<Social["size"]>, string> = {
  featured: "col-span-2 row-span-2",
  wide: "col-span-2 lg:col-span-2",
  full: "col-span-2 lg:col-span-4",
  normal: "col-span-1 lg:col-span-1",
};

interface SocialCardProps {
  social: Social;
}

// Карточка-баннер в стиле og-image: фирменный градиент, диагональные полосы, Bebas-заголовок
export function SocialCard({ social }: SocialCardProps) {
  const Icon = platformIcons[social.platform];
  const featured = social.size === "featured";
  const compact = social.size === "normal";

  return (
    <article
      className={cn(
        "relative w-full h-full flex flex-col overflow-hidden rounded-3xl bg-rgsu-brand text-white shadow-[0_8px_24px_rgba(8,37,103,0.35)] transition duration-300 hover:shadow-[0_14px_36px_rgba(8,37,103,0.5)] hover:-translate-y-0.5",
        sizeClasses[social.size ?? "normal"]
      )}
    >
      {/* Диагональные световые полосы и свечение — как на баннерах rgsu.by */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -bottom-10 left-[14%] w-14 bg-white/5 -skew-x-[18deg]" />
        <div className="absolute -top-10 -bottom-10 left-[42%] w-24 bg-white/[0.04] -skew-x-[18deg]" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_280px_at_88%_0%,rgba(255,255,255,0.10),transparent_60%)]" />
      </div>

      <div className={cn("relative z-10 flex flex-col flex-grow", featured ? "p-5 sm:p-6" : "p-4")}>
        {/* Иконка платформы — стеклянный круг на баннере */}
        <div
          className={cn(
            "relative rounded-full bg-white/15 border border-white/25 flex items-center justify-center mb-3",
            featured ? "w-12 h-12" : "w-9 h-9"
          )}
        >
          <HugeiconsIcon icon={Icon} size={featured ? 24 : 18} strokeWidth={1.5} className="text-white" />
          {social.members && (
            <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-rgsu-ruby text-white text-[9px] font-semibold leading-none shadow-xs">
              {social.members}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-rgsu-ice/90">
            {platformLabels[social.platform] ?? social.platform}
          </span>
          {social.members && (
            <span className="text-[10px] text-white/60">· подписчики</span>
          )}
        </div>
        <h3
          className={cn(
            "font-display font-bold uppercase tracking-wide text-white !leading-tight mt-1",
            featured ? "text-3xl" : "text-xl"
          )}
        >
          {social.title}
        </h3>

        {social.image && (
          <img
            src={social.image}
            alt={social.title}
            loading="lazy"
            className={cn(
              "w-full object-cover rounded-2xl border border-white/15 my-3",
              featured ? "h-40 sm:h-48" : "h-24"
            )}
          />
        )}

        <p
          className={cn(
            "text-white/75 leading-relaxed mt-2 flex-grow",
            compact ? "text-xs line-clamp-2" : "text-sm",
            featured && "text-sm"
          )}
        >
          {social.description}
        </p>

        <a
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${social.title} — открыть в ${social.platform}`}
          className={cn(
            "mt-4 inline-flex items-center justify-center gap-1.5 w-full rounded-full bg-rgsu-ruby text-white font-semibold shadow-[0_6px_16px_rgba(120,15,10,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:brightness-110 active:scale-[0.98] transition",
            compact ? "h-9 text-xs" : "h-11 text-sm"
          )}
        >
          Перейти
          <HugeiconsIcon icon={LinkSquare02Icon} size={compact ? 14 : 16} strokeWidth={1.5} />
        </a>
      </div>
    </article>
  );
}
