import type { Metadata } from "next";
import { CaseStudy } from "../../components/case-study";
import { projectBySlug } from "../../lib/projects";

export const metadata: Metadata = { title: "API de transferencias | Jonathan Cascante", description: "Caso de estudio de una aplicación Flutter conectada a una Web API en C# para transferencias." };

export default function TransferPage() {
  return <CaseStudy project={projectBySlug("api-transferencias")} />;
}
