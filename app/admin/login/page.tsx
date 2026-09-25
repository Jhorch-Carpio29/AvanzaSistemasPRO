"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/errors";

export default function AdminLoginPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast("Sesión iniciada correctamente", "success");
      window.location.assign("/admin");
    } catch (err) {
      showToast(getErrorMessage(err, "No se pudo iniciar sesión"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="hero-particles" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(234,179,8,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md card-cyber p-8 space-y-6"
      >
        <div className="text-center">
          <div className="relative mx-auto mb-4 h-20 w-20 rounded-full overflow-hidden border-2 border-gold/40 bg-white">
            <Image src="/logo.png" alt="Logo AVANZA SISTEMAS PRO" fill className="object-cover" sizes="80px" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Panel de Administración</h1>
          <p className="text-sm text-text-muted mt-1">AVANZA SISTEMAS PRO</p>
        </div>

        <div>
          <label htmlFor="admin-email" className="flex items-center gap-2 text-sm font-medium mb-2">
            <Mail className="w-4 h-4 text-gold" />
            Correo
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="admin@avanza.edu"
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="flex items-center gap-2 text-sm font-medium mb-2">
            <Lock className="w-4 h-4 text-gold" />
            Contraseña
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-text-primary focus:outline-none focus:border-gold/50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-dim text-dark font-bold disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
