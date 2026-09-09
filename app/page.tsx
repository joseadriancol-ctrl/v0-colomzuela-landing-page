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
      
      {/* PODERES CONSTITUIDOS - ART 4-6 NUEVO */}
      <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', margin:'0 20px 30px', padding:'24px', background:'#111', borderRadius:'16px', border:'1px solid #333'}}>
        <div style={{width:'100%', textAlign:'center', marginBottom:12, color:'#fff', fontWeight:'bold', fontSize:'16px'}}>🏛️ Poderes Constituidos - Constitución Viva</div>
        <a href="/congreso" style={{background:'#2563eb', color:'#fff', padding:'16px 24px', borderRadius:'12px', textDecoration:'none', fontWeight:'bold', flex:1, textAlign:'center', minWidth:'140px'}}>
          🏛️ Congreso 75 Sillas
        </a>
        <a href="/corte" style={{background:'#f59e0b', color:'#000', padding:'16px 24px', borderRadius:'12px', textDecoration:'none', fontWeight:'bold', flex:1, textAlign:'center', minWidth:'140px'}}>
          ⚖️ Corte 7 Jueces
        </a>
      </div>

      <Footer />
    </main>
  )
}
