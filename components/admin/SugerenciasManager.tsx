"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Mail, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import type { Sugerencia } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SugerenciasManager() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Sugerencia[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("sugerencias")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) showToast("No se pudieron cargar las sugerencias", "error");
    setItems((data as Sugerencia[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAtendido = async (s: Sugerencia) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("sugerencias")
      .update({ atendido: !s.atendido })
      .eq("id", s.id);
    if (error) {
      alert("Error Supabase: " + error.message);
      showToast(error.message, "error");
    } else {
      showToast(s.atendido ? "Marcada como pendiente" : "Marcada como atendida", "success");
      await load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este mensaje?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("sugerencias").delete().eq("id", id);
    if (error) showToast(error.message, "error");
    else {
      showToast("Mensaje eliminado", "success");
      await load();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Buzón de sugerencias</h2>
      {items.length === 0 && <p className="text-text-muted">Aún no hay mensajes.</p>}
      <div className="space-y-3">
        {items.map((s) => (
          <div
            key={s.id}
            className={`card-cyber p-5 ${s.atendido ? "opacity-70" : "border-gold/20"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{(s as any).nombre || s.nombre_estudiante}</p>
                {((s as any).correo || s.email) && (
                  <p className="text-xs text-cyan flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> {(s as any).correo || s.email}
                  </p>
                )}
                <p className="text-xs text-text-muted mt-1">
                  {new Date(s.created_at).toLocaleString("es-PE")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAtendido(s)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs border ${
                    s.atendido
                      ? "border-green-500/30 text-green-400"
                      : "border-gold/30 text-gold"
                  }`}
                >
                  {s.atendido ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  {s.atendido ? "Atendido" : "Marcar atendido"}
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 rounded-lg border border-crimson/30 text-crimson"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-text-secondary mt-4 whitespace-pre-wrap">{s.mensaje || (s as any).sugerencia}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
