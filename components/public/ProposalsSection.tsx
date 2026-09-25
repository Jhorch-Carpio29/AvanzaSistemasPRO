"use client";

import { useState } from "react";
import {
  Target,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Building2,
  Heart,
  Cpu,
  Users,
  Search,
  Lightbulb,
  CheckCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import type { Propuesta, CategoriaPropuesta } from "@/lib/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Building2,
  Heart,
  Cpu,
  Users,
  Search,
  Lightbulb,
};

interface ProposalsSectionProps {
  propuestas: Propuesta[];
  categorias: CategoriaPropuesta[];
}

export default function ProposalsSection({ propuestas, categorias }: ProposalsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filteredPropuestas = activeCategory
    ? propuestas.filter((p) => p.categoria_id === activeCategory)
    : propuestas;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getCategoryName = (catId: string | null) => {
    if (!catId) return "General";
    return categorias.find((c) => c.id === catId)?.nombre || "General";
  };

  const getCategoryIcon = (catId: string | null) => {
    if (!catId) return Lightbulb;
    const cat = categorias.find((c) => c.id === catId);
    return (cat && iconMap[cat.icono]) || Lightbulb;
  };

  return (
    <section id="propuestas" className="py-24 relative">
      {/* Subtle background accent */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 80% 50%, rgba(220,38,38,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-crimson/20 bg-crimson-glow mb-4">
            <Target className="w-4 h-4 text-crimson" />
            <span className="text-sm text-crimson font-medium tracking-wider">PLAN DE GOBIERNO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Nuestras <span className="text-gradient-crimson">Propuestas</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Propuestas concretas para mejorar la experiencia académica y tecnológica de nuestra escuela.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeCategory === null
                ? "bg-gold text-dark shadow-lg shadow-gold/20"
                : "border border-dark-border text-text-secondary hover:border-gold/30 hover:text-gold"
            }`}
          >
            Todas
          </button>
          {categorias.map((cat) => {
            const Icon = iconMap[cat.icono] || Lightbulb;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? "bg-gold text-dark shadow-lg shadow-gold/20"
                    : "border border-dark-border text-text-secondary hover:border-gold/30 hover:text-gold"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.nombre}
              </button>
            );
          })}
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPropuestas.map((propuesta, index) => {
            const isExpanded = expandedIds.has(propuesta.id);
            const CatIcon = getCategoryIcon(propuesta.categoria_id);

            return (
              <div
                key={propuesta.id}
                className="card-cyber overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  {/* Category badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <CatIcon className="w-4 h-4 text-cyan" />
                    <span className="text-xs font-medium text-cyan uppercase tracking-wider">
                      {getCategoryName(propuesta.categoria_id)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[#EAB308] font-extrabold text-lg md:text-xl tracking-wide uppercase mb-3">{propuesta.titulo}</h3>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="animate-slide-up">
                      {/* Justification */}
                      {propuesta.justificacion && (
                        <div className="mb-5">
                          <h4 className="text-[#06B6D4] font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Justificación
                          </h4>
                          <p className="text-zinc-100 text-sm leading-relaxed">
                            {propuesta.justificacion}
                          </p>
                        </div>
                      )}

                      {/* Objectives */}
                      {propuesta.objetivos && propuesta.objetivos.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-red-500 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Objetivos
                          </h4>
                          <ul className="space-y-2">
                            {propuesta.objetivos.map((obj, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                <span className="text-zinc-100 text-sm leading-relaxed">{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Toggle button */}
                  <button
                    onClick={() => toggleExpand(propuesta.id)}
                    className="flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-dim transition-colors mt-2"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Ver menos
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Ver más
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPropuestas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No hay propuestas en esta categoría aún.</p>
          </div>
        )}
      </div>
    </section>
  );
}
