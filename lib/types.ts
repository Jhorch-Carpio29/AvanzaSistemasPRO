export interface ConfigCampana {
  id: string;
  nombre_grupo: string;
  eslogan: string;
  logo_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  whatsapp_url: string | null;
  github_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExperienciaItem {
  titulo: string;
  periodo: string;
  descripcion?: string;
}

export interface HabilidadItem {
  area: string;
  descripcion: string;
}

export interface Candidato {
  id: string;
  nombre: string;
  cargo: string;
  ciclo: string | null;
  foto_url: string | null;
  sobre_mi: string | null;
  vision: string | null;
  lema: string | null;
  experiencia: ExperienciaItem[];
  habilidades: HabilidadItem[];
  orden: number;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
  tiktok: string | null;
  whatsapp: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoriaPropuesta {
  id: string;
  nombre: string;
  icono: string;
  created_at: string;
}

export interface Propuesta {
  id: string;
  titulo: string;
  justificacion: string | null;
  objetivos: string[];
  categoria_id: string | null;
  categorias_propuesta?: CategoriaPropuesta;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface Sugerencia {
  id: string;
  nombre_estudiante: string;
  email: string | null;
  mensaje: string;
  atendido: boolean;
  created_at: string;
}

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  ubicacion: string | null;
  tipo: string;
  created_at: string;
  updated_at: string;
}
