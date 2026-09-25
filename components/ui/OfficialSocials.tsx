import type { ReactNode } from "react";
import type { SocialItem, SocialNetwork } from "@/lib/social";

function FacebookMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff" aria-hidden>
      <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.09 5.66 21.24 10.44 22v-7.02H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.09 22 12.07z" />
    </svg>
  );
}

function InstagramMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff" aria-hidden>
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.6A4.4 4.4 0 1 0 16.4 12 4.4 4.4 0 0 0 12 7.6zm0 7.25A2.85 2.85 0 1 1 14.85 12 2.85 2.85 0 0 1 12 14.85zM17.35 6.4a1.05 1.05 0 1 0 1.05 1.05 1.05 1.05 0 0 0-1.05-1.05z" />
    </svg>
  );
}

function TikTokMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff" aria-hidden>
      <path d="M14.5 3c.4 2.4 1.9 4.1 4.2 4.4v2.4c-1.45.14-2.77-.37-4.05-1.22v6.7a5.7 5.7 0 1 1-5.7-5.7c.3 0 .58.03.85.08v2.52a3.2 3.2 0 1 0 2.25 3.06V3h2.45z" />
    </svg>
  );
}

function WhatsAppMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff" aria-hidden>
      <path d="M12.04 2C6.5 2 2 6.37 2 11.77c0 1.72.46 3.4 1.33 4.88L2 22l5.54-1.45A10.2 10.2 0 0 0 12.04 21.5C17.58 21.5 22 17.13 22 11.73 22 6.37 17.58 2 12.04 2zm5.8 14.33c-.24.68-1.4 1.25-1.93 1.33-.49.07-1.12.1-1.81-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.36-.15-.2-1.2-1.6-1.2-3.05s.76-2.16 1.03-2.45c.24-.27.64-.4 1.02-.4.12 0 .23 0 .33.01.29.01.44.03.63.49.24.56.81 1.94.88 2.08.07.14.12.3.02.49-.1.2-.14.32-.28.49-.14.17-.3.38-.42.51-.14.14-.29.3-.12.58.16.27.73 1.2 1.56 1.95 1.08.96 1.98 1.26 2.26 1.4.28.14.44.12.6-.07.17-.2.7-.81.89-1.09.19-.27.38-.23.63-.14.26.1 1.64.77 1.92.91.28.14.46.2.53.32.07.11.07.65-.17 1.33z" />
    </svg>
  );
}

function GithubMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.36 6.84 9.72.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85.01 1.71.12 2.51.34 1.9-1.32 2.74-1.05 2.74-1.05.56 1.41.21 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function LinkedinMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

const styles: Record<SocialNetwork, { className: string; style?: React.CSSProperties; mark: (size: number) => ReactNode }> = {
  facebook: {
    className: "bg-[#1877F2]",
    mark: (s) => <FacebookMark size={s} />,
  },
  instagram: {
    className: "",
    style: {
      background: "radial-gradient(circle at 30% 110%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    },
    mark: (s) => <InstagramMark size={s} />,
  },
  tiktok: {
    className: "bg-black border border-white/20",
    mark: (s) => <TikTokMark size={s} />,
  },
  whatsapp: {
    className: "bg-[#25D366]",
    mark: (s) => <WhatsAppMark size={s} />,
  },
  github: {
    className: "bg-[#181717] border border-white/15",
    mark: (s) => <GithubMark size={s} />,
  },
  linkedin: {
    className: "bg-[#0A66C2]",
    mark: (s) => <LinkedinMark size={s} />,
  },
};

export function OfficialSocialButton({
  network,
  href,
  label,
  size = "md",
}: {
  network: SocialNetwork;
  href: string;
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? "w-12 h-12" : size === "sm" ? "w-9 h-9" : "w-11 h-11";
  const icon = size === "lg" ? 22 : size === "sm" ? 16 : 20;
  const enabled = Boolean(href);
  const visual = styles[network];

  const className = `${dim} rounded-2xl ${visual.className} flex items-center justify-center shadow-lg transition-transform ${
    enabled ? "hover:-translate-y-0.5 hover:scale-110 hover:brightness-110" : "opacity-35 cursor-not-allowed"
  }`;

  if (!enabled) {
    return (
      <span title={`${label} (configura el enlace en Admin)`} className={className} style={visual.style}>
        {visual.mark(icon)}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir ${label}`}
      title={label}
      className={className}
      style={visual.style}
    >
      {visual.mark(icon)}
    </a>
  );
}

export function OfficialSocialRow({
  items,
  size = "md",
}: {
  items: SocialItem[];
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {items.map((item) => (
        <OfficialSocialButton key={item.network} {...item} size={size} />
      ))}
    </div>
  );
}
