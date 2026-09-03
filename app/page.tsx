import { HeroSection } from "@/components/hero-section"
import { PrincipiosSection } from "@/components/principios-section"
import { Footer } from "@/components/footer"
import { CitizensPanel } from "@/components/citizens-panel"
import { GabineteMinisterial } from "@/components/gabinete-ministerial"

export default function Home() {
  return (
    <main className="min-h-screen">
      <CitizensPanel />
      <HeroSection />
      <GabineteMinisterial />
      <PrincipiosSection />
      <Footer />
    </main>
  )
}
