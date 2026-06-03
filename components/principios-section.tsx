"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Scale } from "lucide-react"

const principios = [
  {
    icon: Shield,
    title: "Dignidad Luxemburgo",
    text: "La dignidad humana es intocable. Inspirado en el modelo social más avanzado del mundo."
  },
  {
    icon: Eye,
    title: "Transparencia 24h",
    text: "Todo contrato público visible online en menos de 24 horas. Sin excepciones."
  },
  {
    icon: Scale,
    title: "Gobierno Abierto",
    text: "Código, leyes y presupuesto en GitHub. Si no está público, no existe."
  }
]

export function PrincipiosSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-6 bg-background"
    >
      <div className="max-w-6xl mx-auto">
        <h2 
          className={`text-3xl md:text-4xl font-bold text-center mb-16 text-foreground transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Tres principios. Cero negociación.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {principios.map((principio, index) => (
            <Card 
              key={principio.title}
              className={`bg-card border-border/50 transition-all duration-700 delay-${index * 100} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#0038A8]/10 flex items-center justify-center mb-4">
                  <principio.icon className="w-6 h-6 text-[#0038A8]" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {principio.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {principio.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
