import { HeroSection } from "@/components/hero-section"
import { PrincipiosSection } from "@/components/principios-section"
import { EstrellaSection } from "@/components/estrella-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <PrincipiosSection />
      <EstrellaSection />
      <Footer />
    </main>
  )
}
