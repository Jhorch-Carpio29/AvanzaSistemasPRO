"use client";

import { useState } from "react";
import { Send, MessageSquarePlus, User, Mail, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export default function SuggestionsForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !mensaje.trim()) {
      showToast("Por favor completa tu nombre y mensaje.", "error");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const payload = {
        nombre: nombre.trim(),
        nombre_estudiante: nombre.trim(),
        correo: email.trim() || '',
        email: email.trim() || '',
        mensaje: mensaje.trim(),
        sugerencia: mensaje.trim(),
      };
      
      const { data, error } = await supabase.from("sugerencias").insert(payload);

      if (error) {
        alert("Error Supabase: " + error.message);
        throw error;
      }

      showToast("¡Sugerencia enviada!", "success");
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch {
      showToast("Error al enviar tu sugerencia. Intenta de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="sugerencias" className="py-24 relative">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(6,182,212,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="section-container relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold-glow mb-4">
              <MessageSquarePlus className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold font-medium tracking-wider">BUZÓN DE SUGERENCIAS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Tu Voz <span className="text-gradient-gold">Importa</span>
            </h2>
            <p className="text-text-secondary">
              ¿Tienes una idea, propuesta o consulta? Compártela con nosotros. Cada sugerencia cuenta.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card-cyber p-6 sm:p-8 space-y-6">
            {/* Nombre */}
            <div>
              <label htmlFor="suggestion-name" className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                <User className="w-4 h-4 text-gold" />
                Nombre completo <span className="text-crimson">*</span>
              </label>
              <input
                id="suggestion-name"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-text-primary placeholder-text-muted focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="suggestion-email" className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                <Mail className="w-4 h-4 text-cyan" />
                Correo electrónico <span className="text-text-muted text-xs">(opcional)</span>
              </label>
              <input
                id="suggestion-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-text-primary placeholder-text-muted focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20 transition-all"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label htmlFor="suggestion-message" className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                <MessageCircle className="w-4 h-4 text-gold" />
                Tu sugerencia <span className="text-crimson">*</span>
              </label>
              <textarea
                id="suggestion-message"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu propuesta, idea o consulta aquí..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-text-primary placeholder-text-muted focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all resize-none"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-dim text-dark font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Sugerencia
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
