"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import type { ConfigCampana } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ConfigManager() {
  const router = useRouter();
  const { showToast } = useToast();
  const [config, setConfig] = useState<ConfigCampana | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("config_campana").select("*").limit(1).maybeSingle();
    if (error) showToast(error.message, "error");
    if (!data) {
      const { data: created, error: insertError } = await supabase
        .from("config_campana")
        .insert({
          nombre_grupo: "AVANZA SISTEMAS PRO",
          eslogan: "¡El cambio que la EFP de Ingeniería de Sistemas necesita!",
          logo_url: "/logo.png",
        })
        .select()
        .single();
      if (insertError) showToast(insertError.message, "error");
      setConfig((created as ConfigCampana | null) ?? null);
    } else {
      setConfig(data as ConfigCampana);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (key: keyof ConfigCampana, value: string) => {
    if (!config) return;
    setConfig({ ...config, [key]: value });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        nombre_grupo: config.nombre_grupo || (config as any).nombre || (config as any).nombre_lista || '',
        nombre: config.nombre_grupo || (config as any).nombre || (config as any).nombre_lista || '',
        nombre_lista: config.nombre_grupo || (config as any).nombre || (config as any).nombre_lista || '',
        eslogan: config.eslogan || '',
        logo_url: config.logo_url || '',
        facebook_url: config.facebook_url || (config as any).facebook || '',
        facebook: config.facebook_url || (config as any).facebook || '',
        instagram_url: config.instagram_url || (config as any).instagram || '',
        instagram: config.instagram_url || (config as any).instagram || '',
        tiktok_url: config.tiktok_url || (config as any).tiktok || '',
        tiktok: config.tiktok_url || (config as any).tiktok || '',
        whatsapp_url: config.whatsapp_url || (config as any).whatsapp || (config as any).whatsapp_grupo_url || '',
        whatsapp: config.whatsapp_url || (config as any).whatsapp || (config as any).whatsapp_grupo_url || '',
        whatsapp_grupo_url: config.whatsapp_url || (config as any).whatsapp || (config as any).whatsapp_grupo_url || '',
        github_url: config.github_url || (config as any).github || '',
        github: config.github_url || (config as any).github || '',
        updated_at: new Date().toISOString(),
      };
      
      if (config.id) {
        const { error } = await supabase.from("config_campana").update(payload).eq("id", config.id);
        if (error) {
          alert("Error Supabase: " + error.message);
          throw error;
        }
      } else {
        const { error } = await supabase.from("config_campana").upsert(payload);
        if (error) {
          alert("Error Supabase: " + error.message);
          throw error;
        }
      }
      
      await load();
      router.refresh();
      showToast("Marca y redes actualizadas", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!config) {
    return <p className="text-text-muted">No hay fila en config_campana. Ejecuta el SQL de seed en Supabase.</p>;
  }

  const fields: { key: keyof ConfigCampana; label: string }[] = [
    { key: "nombre_grupo", label: "Nombre del grupo" },
    { key: "eslogan", label: "Eslogan" },
    { key: "logo_url", label: "URL del logo oficial" },
    { key: "facebook_url", label: "Facebook" },
    { key: "instagram_url", label: "Instagram" },
    { key: "tiktok_url", label: "TikTok" },
    { key: "whatsapp_url", label: "WhatsApp" },
    { key: "github_url", label: "GitHub" },
  ];

  return (
    <form onSubmit={handleSave} className="card-cyber p-6 max-w-2xl space-y-4">
      <h2 className="text-xl font-semibold mb-2">Redes y Marca</h2>
      {fields.map((f) => (
        <div key={f.key}>
          <label className="text-sm font-medium mb-2 block">{f.label}</label>
          <input
            value={(config[f.key] as string) ?? ""}
            onChange={(e) => setField(f.key, e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border"
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dim text-dark font-bold"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
