"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Home, Users, FileText, Calendar, Inbox, Menu, X } from "lucide-react";
import type { ConfigCampana } from "@/lib/types";
import { campaignSocials } from "@/lib/social";
import { OfficialSocialRow } from "@/components/ui/OfficialSocials";

const navLinks = [
  { label: "Inicio", href: "#hero", icon: Home, hint: "Portada y logo" },
  { label: "Equipo", href: "#equipo", icon: Users, hint: "Candidatos" },
  { label: "Propuestas", href: "#propuestas", icon: FileText, hint: "Plan de gobierno" },
  { label: "Eventos", href: "#eventos", icon: Calendar, hint: "Cronograma" },
  { label: "Sugerencias", href: "#sugerencias", icon: Inbox, hint: "Buzón estudiantil" },
];

interface SidebarProps {
  config: ConfigCampana | null;
}

export default function Sidebar({ config }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.15, 0.4] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = (href: string) => {
    setOpen(false);
    setActive(href);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const socials = campaignSocials(config);

  const panel = (
    <div className="flex h-full flex-col">
      <button onClick={() => handleClick("#hero")} className="px-5 pt-6 pb-4 text-left group">
        <div className="relative mx-auto h-28 w-28 rounded-full overflow-hidden border-2 border-gold/50 shadow-[0_0_28px_rgba(234,179,8,0.28)] group-hover:border-gold transition-colors">
          <Image src="/logo.png" alt="AVANZA SISTEMAS PRO" fill className="object-cover rounded-full" sizes="112px" priority />
        </div>
        <p className="mt-4 text-center text-[11px] font-bold tracking-[0.18em] text-gold">
          AVANZA SISTEMAS PRO
        </p>
        <p className="mt-1 text-center text-[11px] text-text-muted leading-snug px-1">
          EFP Ingeniería de Sistemas
        </p>
      </button>

      <nav className="flex-1 px-3 mt-1 space-y-1.5 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = active === link.href;
          const Icon = link.icon;
          return (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? "bg-gradient-to-r from-gold/20 to-crimson/10 border border-gold/40 text-gold"
                  : "border border-transparent text-text-secondary hover:bg-dark-elevated hover:text-text-primary"
              }`}
            >
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isActive ? "bg-gradient-to-br from-gold/20 to-crimson/20 border-gold shadow-[0_0_12px_rgba(234,179,8,0.35)] text-gold" : "bg-dark-elevated border-white/10 text-cyan"
                }`}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{link.label}</span>
                <span className="block text-[10px] text-text-muted">{link.hint}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-dark-border">
        <p className="text-[10px] uppercase tracking-widest text-text-muted mb-3 text-center">Redes oficiales</p>
        <OfficialSocialRow items={socials} size="sm" />
      </div>
    </div>
  );

  return (
    <>
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 h-16 glass border-b border-dark-border flex items-center justify-between px-4">
        <button onClick={() => handleClick("#hero")} className="flex items-center gap-2 min-w-0">
          <span className="relative h-10 w-10 rounded-full overflow-hidden border border-gold/40 shrink-0">
            <Image src="/logo.png" alt="Logo" fill className="object-cover rounded-full" sizes="40px" />
          </span>
          <span className="text-xs font-bold tracking-wider truncate">
            AVANZA<span className="text-gold"> PRO</span>
          </span>
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-lg border border-dark-border text-text-secondary"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {open && (
        <button
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-dvh w-[min(18rem,88vw)] bg-dark-card border-r border-gold/15 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {panel}
      </aside>
    </>
  );
}
