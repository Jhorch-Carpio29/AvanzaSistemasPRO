"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import type { Evento } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const tipos = ["lanzamiento", "debate", "feria", "votacion", "general"];

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventosManager() {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Evento | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipo, setTipo] = useState("general");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("eventos").select("*").order("fecha");
    if (error) showToast("No se pudieron cargar los eventos", "error");
    setItems((data as Evento[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setTitulo("");
    setDescripcion("");
    setFecha("");
    setUbicacion("");
    setTipo("general");
    setOpen(true);
  };

  const openEdit = (ev: Evento) => {
    setEditing(ev);
    setTitulo(ev.titulo);
    setDescripcion(ev.descripcion ?? "");
    setFecha(toLocalInput(ev.fecha));
    setUbicacion(ev.ubicacion ?? "");
    setTipo(ev.tipo);
    setOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || '',
        fecha_hora: fecha ? new Date(fecha).toISOString() : new Date().toISOString(),
        fecha: fecha ? new Date(fecha).toISOString() : new Date().toISOString(),
        ubicacion: ubicacion.trim() || '',
        lugar: ubicacion.trim() || '',
        tipo,
      };
      if (editing) {
        const { data, error } = await supabase.from("eventos").update(payload).eq("id", editing.id);
        if (error) {
          alert("Error Supabase: " + error.message);
          throw error;
        }
        showToast("Evento actualizado", "success");
      } else {
        const { data, error } = await supabase.from("eventos").insert(payload);
        if (error) {
          alert("Error Supabase: " + error.message);
          throw error;
        }
        showToast("Evento creado", "success");
      }
      
      // Limpiar el formulario
      setTitulo("");
      setDescripcion("");
      setFecha("");
      setUbicacion("");
      setTipo("general");
      setEditing(null);

      setOpen(false);
      await load();
      router.refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este evento?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) showToast(error.message, "error");
    else {
      showToast("Evento eliminado", "success");
      await load();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Cronograma de eventos</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-dark text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>
      <div className="space-y-3">
        {items.map((ev) => (
          <div key={ev.id} className="card-cyber p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gold uppercase">{ev.tipo}</p>
              <h3 className="font-semibold">{ev.titulo}</h3>
              <p className="text-xs text-text-muted mt-1">
                {new Date(ev.fecha).toLocaleString("es-PE")} {ev.ubicacion ? `· ${ev.ubicacion}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(ev)} className="p-2 rounded-lg border border-gold/30 text-gold">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(ev.id)} className="p-2 rounded-lg border border-crimson/30 text-crimson">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? "Editar evento" : "Nuevo evento"}>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Título</label>
            <input
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Fecha y hora</label>
              <input
                type="datetime-local"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border"
              >
                {tipos.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Ubicación</label>
            <input
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dim text-dark font-bold"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
