export function NavEmblem({
  kind,
  active,
}: {
  kind: "inicio" | "equipo" | "propuestas" | "eventos" | "sugerencias";
  active?: boolean;
}) {
  const wrap = `w-10 h-10 rounded-xl overflow-hidden shrink-0 border ${
    active ? "border-gold shadow-[0_0_12px_rgba(234,179,8,0.35)]" : "border-white/10"
  }`;

  if (kind === "inicio") {
    return (
      <span className={`${wrap} bg-gradient-to-br from-crimson to-red-900 flex items-center justify-center`}>
        <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden>
          <circle cx="20" cy="20" r="15" fill="#DC2626" stroke="#EAB308" strokeWidth="2" />
          <polygon points="20,8 23,16 32,16 25,21 28,30 20,24 12,30 15,21 8,16 17,16" fill="#EAB308" />
        </svg>
      </span>
    );
  }

  if (kind === "equipo") {
    return (
      <span className={`${wrap} bg-gradient-to-br from-cyan-700 to-slate-900 flex items-center justify-center`}>
        <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" aria-hidden>
          <circle cx="14" cy="15" r="5" fill="#F5F5F5" />
          <circle cx="26" cy="15" r="5" fill="#EAB308" />
          <path d="M6 31c1.5-6 5-9 8-9s6.5 3 8 9" fill="#F5F5F5" />
          <path d="M18 31c1.5-6 5-9 8-9s6.5 3 8 9" fill="#EAB308" />
        </svg>
      </span>
    );
  }

  if (kind === "propuestas") {
    return (
      <span className={`${wrap} bg-gradient-to-br from-amber-700 to-zinc-900 flex items-center justify-center`}>
        <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden>
          <rect x="10" y="7" width="20" height="26" rx="2" fill="#F5F5F5" />
          <rect x="14" y="12" width="12" height="2" rx="1" fill="#DC2626" />
          <rect x="14" y="17" width="12" height="2" rx="1" fill="#A1A1AA" />
          <rect x="14" y="22" width="8" height="2" rx="1" fill="#A1A1AA" />
          <circle cx="28" cy="28" r="6" fill="#EAB308" />
          <path d="M25.5 28.2l2 2 4-4" stroke="#0D0D0F" strokeWidth="1.6" fill="none" />
        </svg>
      </span>
    );
  }

  if (kind === "eventos") {
    return (
      <span className={`${wrap} bg-gradient-to-br from-red-800 to-zinc-900 flex items-center justify-center`}>
        <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden>
          <rect x="8" y="11" width="24" height="20" rx="3" fill="#F5F5F5" />
          <rect x="8" y="11" width="24" height="6" fill="#DC2626" />
          <circle cx="14" cy="14" r="1.4" fill="#EAB308" />
          <circle cx="26" cy="14" r="1.4" fill="#EAB308" />
          <rect x="13" y="21" width="4" height="4" rx="0.6" fill="#06B6D4" />
          <rect x="18" y="21" width="4" height="4" rx="0.6" fill="#EAB308" />
          <rect x="23" y="21" width="4" height="4" rx="0.6" fill="#DC2626" />
        </svg>
      </span>
    );
  }

  return (
    <span className={`${wrap} bg-gradient-to-br from-cyan-800 to-zinc-900 flex items-center justify-center`}>
      <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden>
        <path d="M8 12h18a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H16l-6 5v-5H8a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z" fill="#F5F5F5" />
        <circle cx="14" cy="20" r="1.5" fill="#DC2626" />
        <circle cx="20" cy="20" r="1.5" fill="#EAB308" />
        <circle cx="26" cy="20" r="1.5" fill="#06B6D4" />
      </svg>
    </span>
  );
}
