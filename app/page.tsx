import Sidebar from "@/components/public/Sidebar";
import HeroSection from "@/components/public/HeroSection";
import TeamSection from "@/components/public/TeamSection";
import ProposalsSection from "@/components/public/ProposalsSection";
import EventsTimeline from "@/components/public/EventsTimeline";
import SuggestionsForm from "@/components/public/SuggestionsForm";
import Footer from "@/components/public/Footer";
import { createClient } from "@/lib/supabase/server";
import type {
  Candidato,
  CategoriaPropuesta,
  ConfigCampana,
  Evento,
  Propuesta,
} from "@/lib/types";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: config },
    { data: candidatos },
    { data: categorias },
    propuestasRes,
    { data: eventos },
  ] = await Promise.all([
    supabase.from("config_campana").select("*").limit(1).maybeSingle(),
    supabase.from("candidatos").select("*").order("orden", { ascending: true }),
    supabase.from("categorias_propuesta").select("*").order("nombre"),
    supabase
      .from("propuestas")
      .select("*")
      .order("orden", { ascending: true }),
    supabase.from("eventos").select("*").order("fecha", { ascending: true }),
  ]);

  console.log("Propuestas cargadas:", propuestasRes.data, propuestasRes.error);
  const propuestas = propuestasRes.data;

  const cfg = (config as ConfigCampana | null) ?? null;

  return (
    <div className="min-h-screen">
      <Sidebar config={cfg} />
      <div className="lg:pl-[18rem] pt-16 lg:pt-0 min-w-0">
        <main>
          <HeroSection config={cfg} />
          <TeamSection candidatos={(candidatos as Candidato[]) ?? []} />
          <ProposalsSection
            propuestas={(propuestas as Propuesta[]) ?? []}
            categorias={(categorias as CategoriaPropuesta[]) ?? []}
          />
          <EventsTimeline eventos={(eventos as Evento[]) ?? []} />
          <SuggestionsForm />
        </main>
        <Footer config={cfg} />
      </div>
    </div>
  );
}
