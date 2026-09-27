export type SocialPlatform = "telegram" | "instagram" | "tiktok" | "youtube" | "website" | "openday";

export type SocialSize = "featured" | "wide" | "full" | "normal";

export interface Social {
  id: string;
  platform: SocialPlatform;
  title: string;
  description: string;
  url: string;
  size?: SocialSize;
}

export interface SocialsData {
  site: {
    title: string;
    subtitle: string;
  };
  socials: Social[];
}
