import Image from "next/image";
import { Vote, Search, PenLine, CalendarCheck, CheckCircle2, IdCard } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    title: "Acude el 4 de diciembre",
    text: "Participa en las elecciones de nuestra escuela profesional. Tu voto cuenta.",
    color: "text-gold border-gold/40 bg-gold/10",
  },
  {
    icon: IdCard,
    title: "Lleva tu DNI o carné",
    text: "Presenta tu DNI o tu carné universitario para ejercer tu derecho al voto.",
    color: "text-cyan border-cyan/40 bg-cyan/10",
  },
  {
    icon: Search,
    title: "Ubica la Lista 1",
    text: "Busca en la cédula el logo de AVANZA SISTEMAS PRO y el número 1.",
    color: "text-gold border-gold/40 bg-gold/10",
  },
  {
    icon: PenLine,
    title: "Marca con una X",
    text: "Marca una sola X sobre el logo o el número 1 y deposita tu voto.",
    color: "text-crimson border-crimson/40 bg-crimson/10",
  },
];

function Cross() {
  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M20 20 L80 80 M80 20 L20 80" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function HowToVote() {
  return (
    <section id="como-votar" className="py-24 relative">
      <div className="section-container">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 mb-4">
            <Vote className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium tracking-wider">CÓMO VOTAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Tu voto, <span className="text-gradient-gold">Lista 1</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Así de simple es apoyar el cambio que nuestra escuela necesita.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto items-stretch">
          {/* Pasos */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="card-cyber p-5 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${s.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gold tracking-widest">PASO {i + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-1.5">{s.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{s.text}</p>
                </div>
              );
            })}
          </div>

          {/* Cédula de muestra */}
          <div className="lg:col-span-2 card-cyber p-6 flex flex-col items-center justify-center text-center border-gold/30">
            <p className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase mb-1">Cédula de muestra</p>
            <p className="text-xs text-text-muted mb-5">Así debes marcar tu voto</p>

            <div className="flex items-start justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="relative h-28 w-28 rounded-xl overflow-hidden border-2 border-gold bg-white shadow-[0_0_20px_rgba(234,179,8,0.25)]">
                  <Image src="/logo.png" alt="Logo AVANZA SISTEMAS PRO" fill className="object-contain p-2" sizes="112px" />
                  <Cross />
                </div>
                <span className="text-[10px] font-bold tracking-wider">
                  <span className="text-gold">AVANZA</span>{" "}
                  <span className="text-text-primary">SISTEMAS</span>{" "}
                  <span className="text-crimson">PRO</span>
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="relative h-28 w-28 rounded-xl border-2 border-gold bg-white flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.25)]">
                  <span className="text-7xl font-black text-black leading-none">1</span>
                  <Cross />
                </div>
                <span className="text-[10px] font-bold tracking-wider text-gold uppercase">Lista 1</span>
              </div>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              Este 4 de diciembre, marca Lista 1
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
