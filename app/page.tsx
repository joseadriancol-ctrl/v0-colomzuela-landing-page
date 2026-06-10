import { HeroSection } from "@/components/hero-section"
import { PrincipiosSection } from "@/components/principios-section"
import { Footer } from "@/components/footer"
import { CitizensPanel } from "@/components/citizens-panel"

export default function Home() {
  return (
    <main className="min-h-screen">
      <CitizensPanel />
      <HeroSection />
      <PrincipiosSection />
      <Footer />
    </main>
  )
}
