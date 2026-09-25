import { Calendar, MapPin, Clock, Megaphone, MessageSquare, Trophy, Vote, PartyPopper } from "lucide-react";
import type { Evento } from "@/lib/types";

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  lanzamiento: Megaphone,
  debate: MessageSquare,
  feria: Trophy,
  votacion: Vote,
  general: PartyPopper,
};

const typeColors: Record<string, string> = {
  lanzamiento: "text-gold border-gold/30 bg-gold-glow",
  debate: "text-crimson border-crimson/30 bg-crimson-glow",
  feria: "text-cyan border-cyan/30 bg-cyan-glow",
  votacion: "text-green-400 border-green-400/30 bg-green-400/10",
  general: "text-purple-400 border-purple-400/30 bg-purple-400/10",
};

interface EventsTimelineProps {
  eventos: Evento[];
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("es-PE", { day: "numeric" }),
    month: date.toLocaleDateString("es-PE", { month: "short" }).toUpperCase(),
    time: date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
    full: date.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  };
}

export default function EventsTimeline({ eventos }: EventsTimelineProps) {
  const now = new Date();

  return (
    <section id="eventos" className="py-24 relative">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold-glow mb-4">
            <Calendar className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium tracking-wider">CRONOGRAMA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Próximos <span className="text-gradient-gold">Eventos</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            No te pierdas ninguno de nuestros eventos. ¡Te esperamos!
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {eventos.map((evento, index) => {
            const date = formatDate(evento.fecha);
            const isPast = new Date(evento.fecha) < now;
            const TypeIcon = typeIcons[evento.tipo] || PartyPopper;
            const colorClasses = typeColors[evento.tipo] || typeColors.general;

            return (
              <div
                key={evento.id}
                className="relative flex gap-6 pb-12 last:pb-0 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline line */}
                {index < eventos.length - 1 && (
                  <div className="absolute left-[39px] top-16 bottom-0 w-px bg-dark-border" />
                )}

                {/* Date circle */}
                <div className="shrink-0">
                  <div
                    className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center ${
                      isPast
                        ? "border-dark-border bg-dark-elevated opacity-50"
                        : "border-gold/30 bg-gold-glow animate-pulse-glow"
                    }`}
                  >
                    <span className={`text-2xl font-bold ${isPast ? "text-text-muted" : "text-gold"}`}>
                      {date.day}
                    </span>
                    <span className={`text-xs font-medium ${isPast ? "text-text-muted" : "text-gold-dim"}`}>
                      {date.month}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`card-cyber p-5 flex-1 ${isPast ? "opacity-50" : ""}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClasses} mb-2`}>
                        <TypeIcon className="w-3 h-3" />
                        {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary">{evento.titulo}</h3>
                    </div>
                    {isPast && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-dark-elevated text-text-muted border border-dark-border">
                        Pasado
                      </span>
                    )}
                  </div>

                  {evento.descripcion && (
                    <p className="text-sm text-text-secondary mb-3">{evento.descripcion}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {date.time}
                    </span>
                    {evento.ubicacion && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {evento.ubicacion}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {eventos.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No hay eventos programados aún.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
