-- ============================================================
-- AVANZA SISTEMAS PRO — Schema SQL para Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. Tabla: config_campana (configuración global)
CREATE TABLE IF NOT EXISTS config_campana (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_grupo TEXT NOT NULL DEFAULT 'AVANZA SISTEMAS PRO',
  eslogan TEXT DEFAULT '¡El cambio que la EFP de Ingeniería de Sistemas necesita!',
  logo_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  whatsapp_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla: candidatos
CREATE TABLE IF NOT EXISTS candidatos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  cargo TEXT NOT NULL,
  ciclo TEXT,
  foto_url TEXT,
  sobre_mi TEXT,
  experiencia JSONB DEFAULT '[]'::jsonb,
  habilidades TEXT[] DEFAULT '{}',
  orden INT DEFAULT 0,
  facebook TEXT,
  instagram TEXT,
  linkedin TEXT,
  github TEXT,
  tiktok TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla: categorias_propuesta
CREATE TABLE IF NOT EXISTS categorias_propuesta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  icono TEXT DEFAULT 'Lightbulb',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabla: propuestas
CREATE TABLE IF NOT EXISTS propuestas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  justificacion TEXT,
  objetivos TEXT[] DEFAULT '{}',
  categoria_id UUID REFERENCES categorias_propuesta(id) ON DELETE SET NULL,
  orden INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabla: sugerencias (buzón)
CREATE TABLE IF NOT EXISTS sugerencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_estudiante TEXT NOT NULL,
  email TEXT,
  mensaje TEXT NOT NULL,
  atendido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabla: eventos (cronograma)
CREATE TABLE IF NOT EXISTS eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha TIMESTAMPTZ NOT NULL,
  ubicacion TEXT,
  tipo TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE config_campana ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_propuesta ENABLE ROW LEVEL SECURITY;
ALTER TABLE propuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sugerencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- config_campana: lectura pública, escritura autenticada
CREATE POLICY "config_campana_select_public" ON config_campana FOR SELECT USING (true);
CREATE POLICY "config_campana_insert_auth" ON config_campana FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "config_campana_update_auth" ON config_campana FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "config_campana_delete_auth" ON config_campana FOR DELETE USING (auth.role() = 'authenticated');

-- candidatos: lectura pública, escritura autenticada
CREATE POLICY "candidatos_select_public" ON candidatos FOR SELECT USING (true);
CREATE POLICY "candidatos_insert_auth" ON candidatos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "candidatos_update_auth" ON candidatos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "candidatos_delete_auth" ON candidatos FOR DELETE USING (auth.role() = 'authenticated');

-- categorias_propuesta: lectura pública, escritura autenticada
CREATE POLICY "categorias_select_public" ON categorias_propuesta FOR SELECT USING (true);
CREATE POLICY "categorias_insert_auth" ON categorias_propuesta FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "categorias_update_auth" ON categorias_propuesta FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "categorias_delete_auth" ON categorias_propuesta FOR DELETE USING (auth.role() = 'authenticated');

-- propuestas: lectura pública, escritura autenticada
CREATE POLICY "propuestas_select_public" ON propuestas FOR SELECT USING (true);
CREATE POLICY "propuestas_insert_auth" ON propuestas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "propuestas_update_auth" ON propuestas FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "propuestas_delete_auth" ON propuestas FOR DELETE USING (auth.role() = 'authenticated');

-- sugerencias: INSERT público (buzón), lectura y update solo autenticado
CREATE POLICY "sugerencias_insert_public" ON sugerencias FOR INSERT WITH CHECK (true);
CREATE POLICY "sugerencias_select_auth" ON sugerencias FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "sugerencias_update_auth" ON sugerencias FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "sugerencias_delete_auth" ON sugerencias FOR DELETE USING (auth.role() = 'authenticated');

-- eventos: lectura pública, escritura autenticada
CREATE POLICY "eventos_select_public" ON eventos FOR SELECT USING (true);
CREATE POLICY "eventos_insert_auth" ON eventos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "eventos_update_auth" ON eventos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "eventos_delete_auth" ON eventos FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE: Bucket para fotos de candidatos
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('candidatos-fotos', 'candidatos-fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Política de lectura pública en el bucket
DROP POLICY IF EXISTS "candidatos_fotos_select_public" ON storage.objects;
CREATE POLICY "candidatos_fotos_select_public"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'candidatos-fotos');

DROP POLICY IF EXISTS "candidatos_fotos_insert_auth" ON storage.objects;
CREATE POLICY "candidatos_fotos_insert_auth"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'candidatos-fotos');

DROP POLICY IF EXISTS "candidatos_fotos_update_auth" ON storage.objects;
CREATE POLICY "candidatos_fotos_update_auth"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'candidatos-fotos')
WITH CHECK (bucket_id = 'candidatos-fotos');

DROP POLICY IF EXISTS "candidatos_fotos_delete_auth" ON storage.objects;
CREATE POLICY "candidatos_fotos_delete_auth"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'candidatos-fotos');

-- ============================================================
-- SEED DATA (datos de ejemplo)
-- ============================================================

-- Insertar configuración inicial
INSERT INTO config_campana (nombre_grupo, eslogan, facebook_url, instagram_url, tiktok_url, whatsapp_url, github_url)
VALUES (
  'AVANZA SISTEMAS PRO',
  '¡El cambio que la EFP de Ingeniería de Sistemas necesita!',
  'https://facebook.com/avanzasistemas',
  'https://instagram.com/avanzasistemas',
  'https://tiktok.com/@avanzasistemas',
  'https://wa.me/51999999999',
  'https://github.com/avanzasistemas'
);

-- Insertar categorías de propuesta
INSERT INTO categorias_propuesta (nombre, icono) VALUES
  ('Académico', 'GraduationCap'),
  ('Infraestructura', 'Building2'),
  ('Proyección Social', 'Heart'),
  ('Tecnología', 'Cpu'),
  ('Bienestar Estudiantil', 'Users'),
  ('Investigación', 'Search');

-- Insertar candidatos de ejemplo
INSERT INTO candidatos (nombre, cargo, ciclo, sobre_mi, experiencia, habilidades, orden, facebook, instagram, github) VALUES
(
  'Carlos Mendoza',
  'Presidente',
  'VIII Ciclo',
  'Estudiante apasionado por la innovación tecnológica y el liderazgo estudiantil. Comprometido con transformar la experiencia universitaria.',
  '[{"titulo": "Delegado de Aula", "periodo": "2024-2025"}, {"titulo": "Coordinador de Proyectos TI", "periodo": "2023-2024"}]'::jsonb,
  ARRAY['Liderazgo', 'Python', 'Gestión de Proyectos', 'Trabajo en Equipo'],
  1,
  'https://facebook.com/carlos.mendoza',
  'https://instagram.com/carlos.mendoza',
  'https://github.com/carlosmendoza'
),
(
  'María López',
  'Vicepresidenta',
  'VII Ciclo',
  'Desarrolladora web y activista estudiantil. Creo en que la tecnología puede mejorar la vida universitaria.',
  '[{"titulo": "Representante Estudiantil", "periodo": "2024-2025"}, {"titulo": "Voluntaria en ONG Tech", "periodo": "2023"}]'::jsonb,
  ARRAY['React', 'Node.js', 'Comunicación', 'Diseño UI/UX'],
  2,
  'https://facebook.com/maria.lopez',
  'https://instagram.com/maria.lopez',
  'https://github.com/marialopez'
),
(
  'Diego Ríos',
  'Secretario General',
  'VI Ciclo',
  'Entusiasta de la ciberseguridad y la administración. Organizado y comprometido con la transparencia.',
  '[{"titulo": "Asistente de Cátedra", "periodo": "2024"}, {"titulo": "Miembro del Club de Programación", "periodo": "2023-2024"}]'::jsonb,
  ARRAY['Ciberseguridad', 'Linux', 'Documentación', 'Análisis de Datos'],
  3,
  'https://facebook.com/diego.rios',
  'https://instagram.com/diego.rios',
  'https://github.com/diegorios'
),
(
  'Ana Torres',
  'Fiscal',
  'V Ciclo',
  'Apasionada por la inteligencia artificial y la ética en la tecnología. Defensora de la equidad estudiantil.',
  '[{"titulo": "Tutora de Programación", "periodo": "2024"}, {"titulo": "Participante Hackathon UNSCH", "periodo": "2023"}]'::jsonb,
  ARRAY['Machine Learning', 'Java', 'Ética Digital', 'Oratoria'],
  4,
  'https://facebook.com/ana.torres',
  'https://instagram.com/ana.torres',
  'https://github.com/anatorres'
);

-- Insertar propuestas de ejemplo
INSERT INTO propuestas (titulo, justificacion, objetivos, categoria_id, orden) VALUES
(
  'Laboratorio de Innovación Digital',
  'Actualmente los laboratorios de cómputo carecen de equipos modernos y software actualizado. Los estudiantes necesitan acceso a herramientas actuales para competir en el mercado laboral tecnológico.',
  ARRAY['Gestionar la renovación de equipos en los laboratorios', 'Implementar licencias educativas de software profesional', 'Crear un espacio de coworking tecnológico'],
  (SELECT id FROM categorias_propuesta WHERE nombre = 'Infraestructura'),
  1
),
(
  'Programa de Mentoría Tech',
  'Muchos estudiantes de primeros ciclos carecen de orientación profesional y técnica. Un programa de mentoría conectaría a estudiantes avanzados con novatos.',
  ARRAY['Establecer un sistema de mentores por especialidad', 'Organizar sesiones semanales de coding dojo', 'Crear una plataforma de seguimiento de progreso'],
  (SELECT id FROM categorias_propuesta WHERE nombre = 'Académico'),
  2
),
(
  'Hackathon Social Semestral',
  'La proyección social es fundamental para nuestra formación. Organizar hackathons enfocados en resolver problemas de la comunidad fortalece el impacto social de la carrera.',
  ARRAY['Organizar un hackathon por semestre con impacto social', 'Establecer alianzas con ONGs locales', 'Publicar los proyectos resultantes como open source'],
  (SELECT id FROM categorias_propuesta WHERE nombre = 'Proyección Social'),
  3
),
(
  'Plataforma de Recursos Académicos',
  'Los materiales de estudio están dispersos y no hay un repositorio centralizado. Una plataforma digital mejoraría el acceso al conocimiento.',
  ARRAY['Desarrollar un repositorio digital de materiales por curso', 'Implementar un sistema de compartición de apuntes', 'Crear videotutoriales de cursos clave'],
  (SELECT id FROM categorias_propuesta WHERE nombre = 'Tecnología'),
  4
);

-- Insertar eventos de ejemplo
INSERT INTO eventos (titulo, descripcion, fecha, ubicacion, tipo) VALUES
(
  'Lanzamiento de Campaña',
  'Presentación oficial del equipo AVANZA SISTEMAS PRO y nuestro plan de gobierno.',
  '2026-09-10 10:00:00-05',
  'Auditorio Principal UNSCH',
  'lanzamiento'
),
(
  'Debate Electoral',
  'Debate entre las listas candidatas. Ven y conoce nuestras propuestas en vivo.',
  '2026-09-15 14:00:00-05',
  'Sala de Conferencias - Facultad de Ingeniería',
  'debate'
),
(
  'Feria de Proyectos Tech',
  'Exhibición de proyectos tecnológicos desarrollados por miembros del equipo.',
  '2026-09-18 09:00:00-05',
  'Patio Central - Pabellón de Sistemas',
  'feria'
),
(
  'Día de Votación',
  '¡Ejerce tu derecho al voto! Marca AVANZA SISTEMAS PRO.',
  '2026-09-22 08:00:00-05',
  'Mesa de Votación - Facultad de Ingeniería',
  'votacion'
);
