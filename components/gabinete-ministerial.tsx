"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Users, Shield, BookOpen } from "lucide-react"

const DEBATE = [
  { ministro: "Alianzas", rol: "Min. Alianzas y Retorno", icon: Users, color: "#0038A8", texto: "El que vuelve no es deportado, es Aliado Retornado. Casa-consulado por 30 días, con techo y WiFi." },
  { ministro: "Dignidad", rol: "Min. Dignidad Humana", icon: Shield, color: "#FFCD00", texto: "Art 3: Dignidad intocable. En 72h cédula EstrellaID y salud activa. Ninguna IA decide sola." },
  { ministro: "Memoria", rol: "Min. Memoria Histórica", icon: BookOpen, color: "#009639", texto: "Banco de Oficios: lo que aprendiste en Tampa vale aquí. ¿Cómo recibiría tu abuela al que vuelve?" },
]

export function GabineteMinisterial() {
  const [mensajes, setMensajes] = useState(DEBATE)
  const [input, setInput] = useState("")
  const [votos, setVotos] = useState(127)

  const enviar = () => {
    if(!input.trim()) return
    const nuevo = { ministro: "Tú", rol: "Pueblo Soberano", icon: Star, color: "#000", texto: input }
    setMensajes([...mensajes, nuevo as any])
    setInput("")
    setTimeout(()=>{
      setMensajes(m=>[...m, { ministro: "Gabinete", rol: "Respuesta Colectiva", icon: Users, color: "#0038A8", texto: `Aporte registrado: "${input.slice(0,40)}..." pasa a borrador del Decreto 001.`, } as any])
      setVotos(v=>v+1)
    }, 900)
  }

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-black text-white">
      {/* mismo tricolor pero oscuro */}
      <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(180deg, #0038A8 0%, #FFCD00 50%, #009639 100%)" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] border border-white/20 px-4 py-2 rounded-full mb-6">
            <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" /> EN VIVO - GABINETE MINISTERIAL
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            LEY 001: REINTEGRO DIGNO
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto text-lg">Para deportados a Colomzuela. Cero enemigos, todos aliados. Decide el pueblo.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {DEBATE.map((m,i)=>(
            <div key={i} className="bg-white/5 backdrop-blur border border-white/10 p-5 rounded-2xl">
              <m.icon className="w-5 h-5 mb-3" style={{color: m.color}} />
              <div className="text-[10px] tracking-widest opacity-50">{m.rol}</div>
              <div className="font-bold">{m.ministro}</div>
              <p className="text-sm mt-2 text-white/80 leading-relaxed">{m.texto}</p>
            </div>
          ))}
        </div>

        <div className="bg-white text-black rounded-[24px] p-5 md:p-7 max-w-3xl mx-auto shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2"><Star className="h-4 w-4" fill="black"/> Debate Ciudadano</h3>
            <span className="text-xs bg-black text-white px-3 py-1 rounded-full">{votos} aliados conectados</span>
          </div>
          <div className="space-y-3 h-[280px] overflow-y-auto mb-4 pr-1">
            {mensajes.map((m,i)=>(
              <div key={i} className={`p-3 rounded-2xl text-sm ${m.ministro==="Tú"? "bg-[#0038A8] text-white ml-8" : "bg-zinc-100"}`}>
                <b>{m.ministro}:</b> {m.texto}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enviar()} placeholder="Opina como pana... 'trabajo desde día 1'" className="flex-1 border rounded-full px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0038A8]" />
            <Button onClick={enviar} className="rounded-full px-6 h-[46px] bg-black hover:bg-black/80">Enviar</Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" className="rounded-full" onClick={()=>setVotos(v=>v+1)}>👍 Apruebo Decreto</Button>
            <Button variant="outline" className="rounded-full">✏️ Propongo Mejora</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
