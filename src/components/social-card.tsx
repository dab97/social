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
  featured: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  wide: "sm:col-span-2 lg:col-span-2",
  full: "sm:col-span-2 lg:col-span-4",
  normal: "",
};

interface SocialCardProps {
  social: Social;
}

// Карточка-баннер в стиле og-image: фирменный градиент, диагональные полосы, Bebas-заголовок
export function SocialCard({ social }: SocialCardProps) {
  const Icon = platformIcons[social.platform];
  const featured = social.size === "featured";

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

      <div className={cn("relative z-10 flex flex-col flex-grow", featured ? "p-6 sm:p-7" : "p-5")}>
        {/* Иконка платформы — стеклянный круг на баннере */}
        <div
          className={cn(
            "rounded-full bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center mb-4",
            featured ? "w-14 h-14" : "w-11 h-11"
          )}
        >
          <HugeiconsIcon icon={Icon} size={featured ? 26 : 22} strokeWidth={1.5} className="text-white" />
        </div>

        <span className="text-[11px] font-semibold uppercase tracking-widest text-rgsu-ice/90">
          {platformLabels[social.platform] ?? social.platform}
        </span>
        <h3
          className={cn(
            "font-display font-bold uppercase tracking-wide text-white !leading-tight mt-1",
            featured ? "text-3xl sm:text-4xl" : "text-2xl"
          )}
        >
          {social.title}
        </h3>
        <p
          className={cn(
            "text-sm text-white/75 leading-relaxed mt-2 flex-grow",
            featured && "text-sm sm:text-base"
          )}
        >
          {social.description}
        </p>

        <a
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${social.title} — открыть в ${social.platform}`}
          className="mt-5 inline-flex items-center justify-center gap-2 h-11 px-6 w-full rounded-full bg-rgsu-ruby text-white text-sm font-semibold shadow-[0_6px_16px_rgba(120,15,10,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:brightness-110 active:scale-[0.98] transition"
        >
          Перейти
          <HugeiconsIcon icon={LinkSquare02Icon} size={16} strokeWidth={1.5} />
        </a>
      </div>
    </article>
  );
}
