import type { ConfigCampana } from "@/lib/types";

export type SocialNetwork =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "whatsapp"
  | "github"
  | "linkedin";

export interface SocialItem {
  network: SocialNetwork;
  label: string;
  href: string;
}

function clean(url?: string | null) {
  const v = url?.trim() ?? "";
  return v;
}

function cleanWhatsApp(urlOrNumber?: string | null) {
  const v = urlOrNumber?.trim() ?? "";
  if (!v) return "";
  if (v.startsWith("http")) return v;
  const cleaned = v.replace(/[\s-]/g, "");
  if (cleaned.startsWith("51")) {
    return `https://wa.me/${cleaned}`;
  }
  return `https://wa.me/51${cleaned}`;
}

export function campaignSocials(config: ConfigCampana | null): SocialItem[] {
  return [
    { network: "facebook" as SocialNetwork, label: "Facebook", href: clean(config?.facebook_url) },
    { network: "instagram" as SocialNetwork, label: "Instagram", href: clean(config?.instagram_url) },
    { network: "tiktok" as SocialNetwork, label: "TikTok", href: clean(config?.tiktok_url) },
    { network: "whatsapp" as SocialNetwork, label: "WhatsApp", href: cleanWhatsApp((config as any)?.whatsapp || (config as any)?.whatsapp_grupo_url || config?.whatsapp_url) },
    { network: "github" as SocialNetwork, label: "GitHub", href: clean(config?.github_url) },
  ];
}

export function candidateSocials(c: {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
  tiktok: string | null;
  whatsapp?: string | null;
}): SocialItem[] {
  return [
    { network: "facebook" as SocialNetwork, label: "Facebook", href: clean(c.facebook) },
    { network: "instagram" as SocialNetwork, label: "Instagram", href: clean(c.instagram) },
    { network: "linkedin" as SocialNetwork, label: "LinkedIn", href: clean(c.linkedin) },
    { network: "github" as SocialNetwork, label: "GitHub", href: clean(c.github) },
    { network: "tiktok" as SocialNetwork, label: "TikTok", href: clean(c.tiktok) },
    { network: "whatsapp" as SocialNetwork, label: "WhatsApp", href: cleanWhatsApp(c.whatsapp) },
  ].filter((s) => s.href);
}
