import Image from "next/image";
import { Heart } from "lucide-react";
import type { ConfigCampana } from "@/lib/types";
import { campaignSocials } from "@/lib/social";
import { OfficialSocialRow } from "@/components/ui/OfficialSocials";

interface FooterProps {
  config: ConfigCampana | null;
}

export default function Footer({ config }: FooterProps) {
  const socials = campaignSocials(config);

  return (
    <footer className="border-t border-dark-border bg-dark-card">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex gap-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border border-gold/40 bg-white shrink-0">
              <Image src="/logo.png" alt="Logo AVANZA SISTEMAS PRO" fill className="object-contain" sizes="64px" />
            </div>
            <div>
              <p className="font-bold tracking-wider text-text-primary">AVANZA SISTEMAS PRO</p>
              <p className="text-sm text-text-muted leading-relaxed mt-2">
                {config?.eslogan || "¡El cambio que la EFP de Ingeniería de Sistemas necesita!"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Redes oficiales
            </h3>
            <OfficialSocialRow items={socials} />
          </div>
        </div>

        <div className="border-t border-dark-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} {config?.nombre_grupo || "AVANZA SISTEMAS PRO"}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-text-muted flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-crimson" /> por el equipo AVANZA
          </p>
        </div>
      </div>
    </footer>
  );
}
