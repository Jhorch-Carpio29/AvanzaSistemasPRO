"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import type { Candidato } from "@/lib/types";
import CandidateModal from "./CandidateModal";

interface TeamSectionProps {
  candidatos: Candidato[];
}

export default function TeamSection({ candidatos }: TeamSectionProps) {
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current === candidatos.length - 1 ? 0 : current + 1));
  }, [candidatos.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? candidatos.length - 1 : current - 1));
  }, [candidatos.length]);

  useEffect(() => {
    if (isPaused || selectedCandidato || candidatos.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, selectedCandidato, nextSlide, candidatos.length]);

  useEffect(() => {
    if (isPaused || selectedCandidato || candidatos.length <= 1) {
      setProgressWidth(100);
      return;
    }
    
    // Permitir que React renderice el width en 100% primero
    setProgressWidth(100);
    const timeoutId = setTimeout(() => {
      setProgressWidth(0);
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [activeIndex, isPaused, selectedCandidato, candidatos.length]);

  return (
    <section id="equipo" className="py-24 relative">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/20 bg-cyan-glow mb-4">
            <Users className="w-4 h-4 text-cyan" />
            <span className="text-sm text-cyan font-medium tracking-wider">NUESTRO EQUIPO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Conoce a los <span className="text-gradient-gold">Candidatos</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Un equipo comprometido con la innovación y el progreso de nuestra escuela profesional.
          </p>
        </div>

        {candidatos.length === 0 && (
          <p className="text-center text-text-muted mb-10">
            El equipo se publicará pronto.
          </p>
        )}

        {candidatos.length > 0 && (
          <div 
            className="relative w-full max-w-md mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Navigation Arrows */}
            {candidatos.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 z-20 p-2 rounded-full bg-dark/90 border border-gold/30 text-gold hover:bg-gold hover:text-dark transition-colors shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 z-20 p-2 rounded-full bg-dark/90 border border-gold/30 text-gold hover:bg-gold hover:text-dark transition-colors shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Slider Container */}
            <div className="relative aspect-[3/4.2] overflow-hidden rounded-[15px] border border-dark-border/50 bg-dark-card shadow-2xl">
              
              {/* Progress Bar */}
              {candidatos.length > 1 && (
                <div 
                  className="absolute top-0 left-0 h-1 bg-[#EAB308] rounded-full z-30"
                  style={{
                    width: `${progressWidth}%`,
                    transition: progressWidth === 100 ? 'none' : 'width 5000ms linear',
                  }}
                />
              )}

              {candidatos.map((candidato, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={candidato.id}
                    className={`absolute inset-0 card-cyber p-1 flex flex-col transition-all duration-500 ease-in-out ${
                      isActive ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-8 -z-10 pointer-events-none"
                    }`}
                  >
                    {/* Photo */}
                    <div className="relative flex-1 rounded-t-[11px] overflow-hidden bg-dark-elevated min-h-0">
                      {candidato.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={candidato.foto_url}
                          alt={candidato.nombre}
                          className="absolute inset-0 w-full h-full object-contain bg-zinc-950/50 p-2 rounded-t-xl transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-crimson/20 flex items-center justify-center">
                            <span className="text-4xl font-bold text-gold">
                              {candidato.nombre.charAt(0)}
                            </span>
                          </div>
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-80" />
                      {/* Cargo badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-crimson/90 text-white backdrop-blur-sm shadow-lg border border-crimson/50 uppercase tracking-wider mt-2">
                          {candidato.cargo}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5 sm:p-6 bg-dark/60 rounded-b-[11px] shrink-0 border-t border-dark-border/50">
                      <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-1">
                        {candidato.nombre}
                      </h3>
                      {candidato.ciclo && (
                        <p className="text-sm text-gold/80 mb-5 font-medium tracking-wide">{candidato.ciclo}</p>
                      )}
                      <button
                        onClick={() => setSelectedCandidato(candidato)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-dark-elevated border border-gold/30 text-gold text-sm font-semibold hover:bg-gold hover:text-dark hover:border-gold transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                      >
                        <Eye className="w-5 h-5" />
                        Ver Perfil Completo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dots */}
            {candidatos.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2.5 mt-8">
                {candidatos.map((candidato, index) => (
                  <button
                    key={candidato.id}
                    onClick={() => setActiveIndex(index)}
                    title={candidato.cargo}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeIndex ? "w-10 bg-gold shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "w-2.5 bg-dark-border hover:bg-gold/50"
                    }`}
                    aria-label={`Ir a ${candidato.nombre}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      <CandidateModal
        candidato={selectedCandidato}
        isOpen={!!selectedCandidato}
        onClose={() => setSelectedCandidato(null)}
      />
    </section>
  );
}
