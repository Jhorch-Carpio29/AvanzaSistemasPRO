"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import type { CategoriaPropuesta, Propuesta } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function PropuestasManager() {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState<Propuesta[]>([]);
  const [categorias, setCategorias] = useState<CategoriaPropuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Propuesta | null>(null);
  const [titulo, setTitulo] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [objetivos, setObjetivos] = useState<string[]>([""]);
  const [categoriaId, setCategoriaId] = useState("");
  const [orden, setOrden] = useState(0);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const supabase = createClient();
    const [propuestasRes, { data: cats }] = await Promise.all([
      supabase.from("propuestas").select("*").order("orden"),
      supabase.from("categorias_propuesta").select("*").order("nombre"),
    ]);
    console.log("Propuestas cargadas:", propuestasRes.data, propuestasRes.error);
    const { data: propuestas, error } = propuestasRes;
    if (error) showToast("No se pudieron cargar las propuestas", "error");
    setItems((propuestas as Propuesta[]) ?? []);
    setCategorias((cats as CategoriaPropuesta[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setTitulo("");
    setJustificacion("");
    setObjetivos([""]);
    setCategoriaId(categorias[0]?.id ?? "");
    setOrden(items.length + 1);
    setOpen(true);
  };

  const openEdit = (p: Propuesta) => {
    setEditing(p);
    setTitulo(p.titulo);
    setJustificacion(p.justificacion ?? "");
    setObjetivos(Array.isArray(p.objetivos) && p.objetivos.length > 0 ? p.objetivos : [""]);
    setCategoriaId(p.categoria_id ?? "");
    setOrden(p.orden);
    setOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();
      
      const rawPayload = {
        titulo: titulo.trim(),
        categoria_id: categoriaId || null,
        orden,
        justificacion: justificacion || "",
        objetivos: Array.isArray(objetivos) ? objetivos.filter(Boolean) : [],
        updated_at: new Date().toISOString(),
      };

      // Remove undefined, null, and empty arrays
      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(([_, v]) => {
          if (v === undefined || v === null) return false;
          if (Array.isArray(v) && v.length === 0) return false;
          return true;
        })
      );

      if (editing) {
        const { data, error } = await supabase.from("propuestas").update(payload).eq("id", editing.id);
        if (error) {
          alert("Error Supabase: " + error.message);
          throw error;
        }
        showToast("Propuesta actualizada", "success");
      } else {
        const { data, error } = await supabase.from("propuestas").insert(payload);
        if (error) {
          alert("Error Supabase: " + error.message);
          throw error;
        }
        showToast("Propuesta creada", "success");
      }
      
      // Limpiar el formulario
      setTitulo("");
      setJustificacion("");
      setObjetivos([""]);
      setCategoriaId(categorias[0]?.id ?? "");
      setOrden(items.length + 1);
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
    if (!confirm("¿Eliminar esta propuesta?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("propuestas").delete().eq("id", id);
    if (error) showToast(error.message, "error");
    else {
      showToast("Propuesta eliminada", "success");
      await load();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Gestión de Propuestas</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-dark text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="card-cyber p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-cyan mb-1">{p.categorias_propuesta?.nombre ?? "General"}</p>
              <h3 className="font-semibold">{p.titulo}</h3>
              <p className="text-xs text-text-muted mt-1">{p.objetivos?.length ?? 0} objetivos</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg border border-gold/30 text-gold">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg border border-crimson/30 text-crimson">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? "Editar propuesta" : "Nueva propuesta"}>
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
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Categoría</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border"
              >
                <option value="">General</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Orden</label>
              <input
                type="number"
                value={orden}
                onChange={(e) => setOrden(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Justificación de la problemática</label>
            <textarea
              value={justificacion}
              onChange={(e) => setJustificacion(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Objetivos</label>
              <button
                type="button"
                onClick={() => setObjetivos([...objetivos, ""])}
                className="text-xs text-gold"
              >
                + Agregar objetivo
              </button>
            </div>
            <div className="space-y-2">
              {objetivos.map((obj, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={obj}
                    onChange={(e) => {
                      const next = [...objetivos];
                      next[i] = e.target.value;
                      setObjetivos(next);
                    }}
                    placeholder={`Objetivo ${i + 1}`}
                    className="flex-1 px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-sm"
                  />
                  <button type="button" onClick={() => setObjetivos(objetivos.filter((_, idx) => idx !== i))} className="text-crimson">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
