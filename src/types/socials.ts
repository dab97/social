export type SocialPlatform = "telegram" | "instagram" | "tiktok" | "youtube" | "website" | "openday";

export type SocialSize = "featured" | "wide" | "full" | "normal";

export interface Social {
  id: string;
  platform: SocialPlatform;
  title: string;
  description: string;
  url: string;
  size?: SocialSize;
  /** Необязательно: превью-изображение (путь от корня сайта, например /img/tg.jpg) */
  image?: string;
  /** Необязательно: счётчик подписчиков строкой, например "1,2 тыс." */
  members?: string;
}

export interface SocialsData {
  site: {
    title: string;
    subtitle: string;
  };
  socials: Social[];
}
