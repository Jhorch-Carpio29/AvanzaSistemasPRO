import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { ConfigCampana } from "@/lib/types";
import { campaignSocials } from "@/lib/social";
import { OfficialSocialRow } from "@/components/ui/OfficialSocials";

interface HeroSectionProps {
  config: ConfigCampana | null;
}

export default function HeroSection({ config }: HeroSectionProps) {
  const socials = campaignSocials(config);
  const slogan =
    config?.eslogan || "¡El cambio que la EFP de Ingeniería de Sistemas necesita!";

  return (
    <section 
      id="hero" 
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[url('/fondo.jpg')] bg-[length:100%_auto] sm:bg-cover bg-center bg-no-repeat"
    >
      {/* Capa oscura (Overlay) adaptada para que resalte el texto tanto en móvil como en escritorio */}
      <div className="absolute inset-0 bg-black/70 sm:bg-black/75 backdrop-blur-[1px]" />

      <div className="hero-particles" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(234,179,8,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 section-container text-center py-24 lg:py-16">
        <div className="mb-8 flex justify-center animate-slide-up">
          <div className="relative h-40 w-40 sm:h-52 sm:w-52 rounded-full overflow-hidden border-[3px] border-gold/50 shadow-[0_0_40px_rgba(234,179,8,0.28)]">
            <Image
              src={config?.logo_url || "/logo.png"}
              alt="Logo oficial AVANZA SISTEMAS PRO"
              fill
              className="object-cover rounded-full"
              sizes="208px"
              priority
            />
          </div>
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-gradient-gold">AVANZA</span>{" "}
          <span className="text-text-primary">SISTEMAS</span>{" "}
          <span className="text-gradient-crimson">PRO</span>
        </h1>

        <p
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          {slogan}
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#equipo"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-dim text-dark font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            Conoce al Equipo
          </a>
          <a
            href="#propuestas"
            className="px-8 py-3.5 rounded-xl border border-crimson/40 text-crimson font-semibold text-sm tracking-wide hover:bg-crimson-glow hover:border-crimson/60 transition-all duration-300"
          >
            Ver Propuestas
          </a>
        </div>

        <div className="flex flex-col items-center gap-3 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted">Síguenos</p>
          <OfficialSocialRow items={socials} size="lg" />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float hidden sm:block">
          <ChevronDown className="w-6 h-6 text-text-muted" />
        </div>
      </div>
    </section>
  );
}