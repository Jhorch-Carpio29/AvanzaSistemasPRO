"use client";

import { Briefcase, Sparkles, User, Code2, Target, Award, ChevronRight } from "lucide-react";
import type { Candidato } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import { candidateSocials } from "@/lib/social";
import { OfficialSocialRow } from "@/components/ui/OfficialSocials";

interface CandidateModalProps {
  candidato: Candidato | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CandidateModal({ candidato, isOpen, onClose }: CandidateModalProps) {
  if (!candidato) return null;

  const socialLinks = candidateSocials(candidato);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
      <div className="max-h-[90vh] overflow-y-auto w-full max-w-5xl p-4 md:p-6 mx-auto">
        {/* Header Section */}
        <div className="relative p-6 bg-dark/40 border-b border-dark-border rounded-t-2xl sm:rounded-2xl overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
            {/* Photo */}
            <div className="shrink-0">
              <div className="w-[280px] md:w-[300px] h-[450px] md:h-[550px] rounded-2xl overflow-hidden border-2 border-gold/40 bg-dark-elevated shadow-[0_0_30px_rgba(234,179,8,0.15)] relative">
                {candidato.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={candidato.foto_url}
                    alt={candidato.nombre}
                    className="w-full h-full object-cover object-top rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/10 to-crimson/10">
                    <span className="text-5xl font-bold text-gold opacity-80">
                      {candidato.nombre.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-60" />
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1 flex flex-col justify-center">
              <div className="mb-2">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-crimson/20 to-crimson/10 text-crimson border border-crimson/30 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                  {candidato.cargo}
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-1">
                {candidato.nombre}
              </h2>
              {candidato.ciclo && (
                <p className="text-sm font-medium text-gold/80 mb-3 tracking-wide">
                  {candidato.ciclo}
                </p>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center justify-center md:justify-start">
                  <OfficialSocialRow items={socialLinks} size="sm" />
                </div>
              )}

              {/* Lema Personal */}
              {candidato.lema && (
                <div className="mt-4">
                  <div className="inline-flex items-start gap-2 bg-dark-elevated/50 px-4 py-3 rounded-xl border border-gold/20 shadow-inner">
                    <Sparkles className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <p className="text-text-primary font-medium italic text-sm">
                      &quot;{candidato.lema}&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {/* Bio */}
            {candidato.sobre_mi && (
              <div className="p-5 rounded-2xl bg-dark-elevated border border-dark-border/50 hover:border-gold/50 transition-colors shadow-lg relative overflow-hidden group bg-gradient-to-br from-gold/10 via-dark-elevated to-dark-elevated border-l-4 border-l-gold">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 blur-[50px] rounded-full group-hover:bg-cyan/10 transition-colors" />
                <h3 className="text-xs font-bold text-gold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-gold/10 text-gold">
                    <User className="w-4 h-4" />
                  </div>
                  Sobre Mí
                </h3>
                <p className="text-sm text-zinc-100 leading-relaxed relative z-10 text-justify hyphens-auto" lang="es">
                  {candidato.sobre_mi}
                </p>
              </div>
            )}

            {/* Vision */}
            {candidato.vision && (
              <div className="p-5 rounded-2xl bg-dark-elevated border border-dark-border/50 hover:border-crimson/50 transition-colors shadow-lg relative overflow-hidden group bg-gradient-to-br from-crimson/15 via-dark-elevated to-dark-elevated border-l-4 border-l-crimson">
                <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/5 blur-[50px] rounded-full group-hover:bg-crimson/10 transition-colors" />
                <h3 className="text-xs font-bold text-crimson uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-crimson/10 text-crimson">
                    <Target className="w-4 h-4" />
                  </div>
                  Visión Estudiantil
                </h3>
                <p className="text-sm text-zinc-100 leading-relaxed relative z-10 text-justify hyphens-auto" lang="es">
                  {candidato.vision}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Experience */}
            {candidato.experiencia && candidato.experiencia.length > 0 && (
              <div className="p-5 rounded-2xl border border-dark-border/50 hover:border-gold/50 transition-colors shadow-lg bg-gradient-to-br from-gold/10 via-dark-elevated to-dark-elevated border-l-4 border-l-gold">
                <h3 className="text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-gold/10 text-gold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  Experiencia Profesional y Académica
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-[9px] before:w-[2px] before:bg-dark-border">
                  {candidato.experiencia.map((exp: any, i: number) => {
                    let parsedExp = exp;
                    if (typeof exp === 'string') {
                      try { parsedExp = JSON.parse(exp); } catch (e) { /* ignore */ }
                    }
                    const isObj = typeof parsedExp === 'object' && parsedExp !== null;
                    const titulo = isObj ? parsedExp.titulo || parsedExp.subtitulo : parsedExp;
                    const periodo = isObj ? parsedExp.periodo : null;
                    const descripcion = isObj ? parsedExp.descripcion : null;
                    
                    if (!titulo && !periodo && !descripcion) return null;

                    return (
                      <div key={i} className="relative pl-7">
                        <div className="absolute left-0 top-1 w-5 h-5 bg-dark-elevated flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        </div>
                        {titulo && <h4 className="text-[#FACC15] font-bold text-sm">{titulo}</h4>}
                        {periodo && <span className="inline-block px-2 py-0.5 mt-1 rounded bg-cyan/15 border border-cyan/30 text-[#22D3EE] text-xs font-semibold">{periodo}</span>}
                        {descripcion && (
                          <p className="text-zinc-100 text-[13px] mt-1 leading-relaxed text-justify">
                            {descripcion}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Skills */}
            {candidato.habilidades && candidato.habilidades.length > 0 && (
              <div className="p-5 rounded-2xl border border-dark-border/50 hover:border-cyan/50 transition-colors shadow-lg bg-gradient-to-br from-cyan/10 via-dark-elevated to-dark-elevated border-l-4 border-l-cyan">
                <h3 className="text-xs font-bold text-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-cyan/10 text-cyan">
                    <Code2 className="w-4 h-4" />
                  </div>
                  Habilidades y Especialidades
                </h3>
                <div className="space-y-3">
                  {candidato.habilidades.map((skill: any, i: number) => {
                    let parsedSkill = skill;
                    if (typeof skill === 'string') {
                      try { parsedSkill = JSON.parse(skill); } catch (e) { /* ignore */ }
                    }
                    const isObj = typeof parsedSkill === 'object' && parsedSkill !== null;
                    const area = isObj ? parsedSkill.area || parsedSkill.titulo : parsedSkill;
                    const descripcion = isObj ? parsedSkill.descripcion || parsedSkill.herramientas : null;

                    if (!area && !descripcion) return null;

                    return (
                      <div key={i} className="group">
                        {area && (
                          <h4 className="text-[#22D3EE] font-semibold text-sm flex items-center gap-1.5 mb-1">
                            <ChevronRight className="w-3 h-3 text-[#22D3EE] group-hover:translate-x-1 transition-transform shrink-0" />
                            {area}
                          </h4>
                        )}
                        {descripcion && (
                          <p className="text-zinc-100 text-[13px] mt-1 pl-4 leading-relaxed text-justify">
                            {descripcion}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
