import type { Metadata } from "next";
import { CaseStudy } from "../../components/case-study";
import { projectBySlug } from "../../lib/projects";

export const metadata: Metadata = { title: "Casa Net | Caso de estudio de Jonathan Cascante", description: "Arquitectura, desafíos y resultados de Casa Net, plataforma inmobiliaria desarrollada con .NET 8." };

export default function CasaNetPage() {
  return <CaseStudy project={projectBySlug("casanet")} />;
}
