"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOut,
  Users,
  FileText,
  Share2,
  Inbox,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import CandidatosManager from "./CandidatosManager";
import PropuestasManager from "./PropuestasManager";
import ConfigManager from "./ConfigManager";
import SugerenciasManager from "./SugerenciasManager";
import EventosManager from "./EventosManager";

const tabs = [
  { id: "candidatos", label: "Candidatos", hint: "Fotos y perfiles", icon: Users },
  { id: "propuestas", label: "Propuestas", hint: "Plan de gobierno", icon: FileText },
  { id: "config", label: "Redes y Marca", hint: "Enlaces oficiales", icon: Share2 },
  { id: "sugerencias", label: "Sugerencias", hint: "Buzón de alumnos", icon: Inbox },
  { id: "eventos", label: "Eventos", hint: "Cronograma", icon: Calendar },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminShell() {
  const router = useRouter();
  const [active, setActive] = useState<TabId>("candidatos");
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const nav = (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-4">
        <div className="relative mx-auto h-20 w-20 rounded-full overflow-hidden border-2 border-gold/40 bg-white">
          <Image src="/logo.png" alt="Logo" fill className="object-cover" sizes="80px" />
        </div>
        <p className="mt-3 text-center text-[11px] font-bold tracking-[0.18em] text-gold">ADMIN</p>
        <p className="text-center text-xs text-text-muted">AVANZA SISTEMAS PRO</p>
      </div>
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActive(tab.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? "bg-gradient-to-r from-gold/20 to-crimson/10 border border-gold/40 text-gold"
                  : "border border-transparent text-text-secondary hover:bg-dark-elevated"
              }`}
            >
              <span
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isActive ? "bg-gold text-dark" : "bg-dark-elevated text-cyan"
                }`}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{tab.label}</span>
                <span className="block text-[10px] text-text-muted">{tab.hint}</span>
              </span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-dark-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-crimson border border-crimson/30 hover:bg-crimson-glow"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark">
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 h-16 glass border-b border-dark-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="relative h-10 w-10 rounded-full overflow-hidden border border-gold/40 bg-white">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" sizes="40px" />
          </span>
          <span className="text-xs font-bold">Panel Admin</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-lg border border-dark-border"
          aria-label="Menú"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {open && (
        <button className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)} aria-label="Cerrar" />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-dvh w-[17.5rem] bg-dark-card border-r border-gold/15 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </aside>

      <div className="lg:pl-[18rem] pt-20 lg:pt-8 px-4 sm:px-8 pb-12 min-w-0">
        {active === "candidatos" && <CandidatosManager />}
        {active === "propuestas" && <PropuestasManager />}
        {active === "config" && <ConfigManager />}
        {active === "sugerencias" && <SugerenciasManager />}
        {active === "eventos" && <EventosManager />}
      </div>
    </div>
  );
}
