import type { Metadata } from "next";
import { CaseStudy } from "../../components/case-study";
import { projectBySlug } from "../../lib/projects";

export const metadata: Metadata = { title: "Gestión institucional CCSS | Jonathan Cascante", description: "Caso de estudio sobre automatización de procesos institucionales, reglas de negocio y trazabilidad." };

export default function CcssPage() {
  return <CaseStudy project={projectBySlug("ccss")} />;
}
