"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import type { Candidato, ExperienciaItem } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getErrorMessage } from "@/lib/errors";

const emptyForm = {
  nombre: "",
  cargo: "",
  ciclo: "",
  foto_url: "",
  sobre_mi: "",
  vision: "",
  lema: "",
  orden: 0,
  facebook: "",
  instagram: "",
  linkedin: "",
  github: "",
  tiktok: "",
  whatsapp: "",
};

export default function CandidatosManager() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Candidato | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [experiencia, setExperiencia] = useState<ExperienciaItem[]>([]);
  const [habilidades, setHabilidades] = useState<import("@/lib/types").HabilidadItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("candidatos")
      .select("*")
      .order("orden", { ascending: true });
    if (error) {
      showToast(error.message, "error");
    } else {
      const rows = ((data as Candidato[]) ?? []).map((c) => ({
        ...c,
        experiencia: Array.isArray(c.experiencia) ? c.experiencia : [],
        habilidades: Array.isArray(c.habilidades) ? c.habilidades : [],
      }));
      setItems(rows);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setExperiencia([]);
    setHabilidades([]);
    setOpen(true);
  };

  const openEdit = (c: Candidato) => {
    setEditing(c);
    setForm({
      nombre: c.nombre,
      cargo: c.cargo,
      ciclo: c.ciclo ?? "",
      foto_url: c.foto_url ?? "",
      sobre_mi: c.sobre_mi ?? "",
      vision: c.vision ?? "",
      lema: c.lema ?? "",
      orden: c.orden,
      facebook: c.facebook ?? "",
      instagram: c.instagram ?? "",
      linkedin: c.linkedin ?? "",
      github: c.github ?? "",
      tiktok: c.tiktok ?? "",
      whatsapp: c.whatsapp ?? "",
    });
    let parsedExp = Array.isArray(c.experiencia) ? c.experiencia : [];
    let mappedExp = parsedExp.map((item: any) => {
      let parsed = item;
      if (typeof item === "string") {
        try { parsed = JSON.parse(item); } catch (e) { /* ignore */ }
      }
      const isObj = typeof parsed === "object" && parsed !== null;
      return {
        titulo: isObj ? parsed.titulo || parsed.subtitulo || "" : typeof parsed === "string" ? parsed : "",
        periodo: isObj ? parsed.periodo || "" : "",
        descripcion: isObj ? parsed.descripcion || "" : "",
      };
    });
    if (mappedExp.length === 0) mappedExp = [{ titulo: "", periodo: "", descripcion: "" }];
    
    let parsedSkills = Array.isArray(c.habilidades) ? c.habilidades : [];
    let mappedSkills = parsedSkills.map((item: any) => {
      let parsed = item;
      if (typeof item === "string") {
        try { parsed = JSON.parse(item); } catch (e) { /* ignore */ }
      }
      const isObj = typeof parsed === "object" && parsed !== null;
      return {
        area: isObj ? parsed.area || parsed.titulo || "" : typeof parsed === "string" ? parsed : "",
        descripcion: isObj ? parsed.descripcion || parsed.herramientas || "" : "",
      };
    });
    if (mappedSkills.length === 0) mappedSkills = [{ area: "", descripcion: "" }];

    setExperiencia(mappedExp);
    setHabilidades(mappedSkills);
    setOpen(true);
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Solo se permiten imágenes (JPG, PNG, WEBP).", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("La foto no debe superar 5 MB.", "error");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || "No se pudo subir la foto");
      setForm((prev) => ({ ...prev, foto_url: json.url! }));
      showToast("Foto subida correctamente", "success");
    } catch (err) {
      showToast(getErrorMessage(err, "Error al subir la foto. Revisa el bucket candidatos-fotos."), "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        nombre: form.nombre.trim(),
        cargo: form.cargo.trim(),
        ciclo: form.ciclo.trim() || null,
        foto_url: form.foto_url || null,
        sobre_mi: form.sobre_mi.trim() || null,
        vision: form.vision.trim() || null,
        lema: form.lema.trim() || null,
        experiencia,
        habilidades,
        orden: Number(form.orden) || 0,
        facebook: form.facebook.trim() || null,
        instagram: form.instagram.trim() || null,
        linkedin: form.linkedin.trim() || null,
        github: form.github.trim() || null,
        tiktok: form.tiktok.trim() || null,
        whatsapp: form.whatsapp.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from("candidatos").update(payload).eq("id", editing.id);
        if (error) throw error;
        showToast("Candidato actualizado", "success");
      } else {
        const { error } = await supabase.from("candidatos").insert(payload);
        if (error) throw error;
        showToast("Candidato creado", "success");
      }
      setOpen(false);
      await load();
    } catch (err) {
      showToast(getErrorMessage(err, "No se pudo guardar"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este candidato?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("candidatos").delete().eq("id", id);
    if (error) showToast(error.message, "error");
    else {
      showToast("Candidato eliminado", "success");
      await load();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Gestión de Candidatos</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-dark text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {items.length === 0 && !loading && (
        <p className="text-text-muted mb-6 text-sm">Aún no hay candidatos. Pulsa Agregar para crear el primero.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((c) => (
          <div key={c.id} className="card-cyber p-4">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-dark-elevated shrink-0">
                {c.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.foto_url} alt={c.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold font-bold">
                    {c.nombre.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{c.nombre}</p>
                <p className="text-xs text-crimson">{c.cargo}</p>
                <p className="text-xs text-text-muted">{c.ciclo}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => openEdit(c)}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-gold/30 text-gold text-xs"
              >
                <Pencil className="w-3 h-3" /> Editar
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-crimson/30 text-crimson text-xs"
              >
                <Trash2 className="w-3 h-3" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={editing ? "Editar candidato" : "Nuevo candidato"}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} required />
            <Field label="Cargo" value={form.cargo} onChange={(v) => setForm({ ...form, cargo: v })} required />
            <Field label="Ciclo" value={form.ciclo} onChange={(v) => setForm({ ...form, ciclo: v })} />
            <Field
              label="Orden"
              type="number"
              value={String(form.orden)}
              onChange={(v) => setForm({ ...form, orden: Number(v) })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Foto</label>
            <div className="flex items-center gap-4">
              {form.foto_url && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-dark-elevated">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.foto_url} alt="Foto" className="w-full h-full object-cover" />
                </div>
              )}
              <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan/30 text-cyan text-sm cursor-pointer ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                <Upload className="w-4 h-4" />
                {uploading ? "Subiendo..." : "Subir foto"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) handleUpload(file);
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Sobre mí</label>
            <textarea
              value={form.sobre_mi}
              onChange={(e) => setForm({ ...form, sobre_mi: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Visión / Propósito</label>
            <textarea
              value={form.vision}
              onChange={(e) => setForm({ ...form, vision: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border"
            />
          </div>

          <div>
            <Field label="Lema / Frase Inspiradora" value={form.lema} onChange={(v) => setForm({ ...form, lema: v })} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Experiencia</label>
              <button
                type="button"
                onClick={() => setExperiencia([...experiencia, { titulo: "", periodo: "" }])}
                className="text-xs text-gold"
              >
                + Agregar
              </button>
            </div>
            <div className="space-y-2">
              {experiencia.map((exp, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-xl bg-dark/50 border border-dark-border">
                  <div className="flex gap-2">
                    <input
                      placeholder="Subtítulo / Cargo"
                      value={exp.titulo}
                      onChange={(e) => {
                        const next = [...experiencia];
                        next[i] = { ...next[i], titulo: e.target.value };
                        setExperiencia(next);
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-sm"
                    />
                    <input
                      placeholder="Periodo"
                      value={exp.periodo}
                      onChange={(e) => {
                        const next = [...experiencia];
                        next[i] = { ...next[i], periodo: e.target.value };
                        setExperiencia(next);
                      }}
                      className="w-32 px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setExperiencia(experiencia.filter((_, idx) => idx !== i))}
                      className="text-crimson p-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    placeholder="Descripción detallada"
                    value={exp.descripcion || ""}
                    onChange={(e) => {
                      const next = [...experiencia];
                      next[i] = { ...next[i], descripcion: e.target.value };
                      setExperiencia(next);
                    }}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Habilidades</label>
              <button
                type="button"
                onClick={() => setHabilidades([...habilidades, { area: "", descripcion: "" }])}
                className="text-xs text-gold"
              >
                + Agregar habilidad
              </button>
            </div>
            <div className="space-y-2">
              {habilidades.map((hab, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-xl bg-dark/50 border border-dark-border">
                  <div className="flex gap-2">
                    <input
                      placeholder="Área / Subtítulo (ej. Liderazgo)"
                      value={hab.area}
                      onChange={(e) => {
                        const next = [...habilidades];
                        next[i] = { ...next[i], area: e.target.value };
                        setHabilidades(next);
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setHabilidades(habilidades.filter((_, idx) => idx !== i))}
                      className="text-crimson p-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    placeholder="Descripción / Herramientas"
                    value={hab.descripcion}
                    onChange={(e) => {
                      const next = [...habilidades];
                      next[i] = { ...next[i], descripcion: e.target.value };
                      setHabilidades(next);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Facebook" value={form.facebook} onChange={(v) => setForm({ ...form, facebook: v })} />
            <Field label="Instagram" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />
            <Field label="LinkedIn" value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} />
            <Field label="GitHub" value={form.github} onChange={(v) => setForm({ ...form, github: v })} />
            <Field label="TikTok" value={form.tiktok} onChange={(v) => setForm({ ...form, tiktok: v })} />
            <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dim text-dark font-bold disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">
        {label} {required && <span className="text-crimson">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border"
      />
    </div>
  );
}
