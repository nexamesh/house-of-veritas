import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import RecyclingGuideClient from "@/components/recycling/recycling-guide-client"

const PERSONAS = ["hans", "charl", "lucky", "irma"] as const
type Persona = (typeof PERSONAS)[number]

function isPersona(value: string): value is Persona {
  return PERSONAS.includes(value as Persona)
}

export default async function RecyclingPage({ params }: { params: Promise<{ persona: string }> }) {
  const { persona } = await params
  const normalized = persona.toLowerCase()
  if (!isPersona(normalized)) notFound()

  return (
    <DashboardLayout persona={normalized}>
      <RecyclingGuideClient />
    </DashboardLayout>
  )
}
