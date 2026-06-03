"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function EstrellaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <section 
      id="estrella"
      ref={sectionRef}
      className="py-24 px-6 bg-muted/30"
    >
      <div className="max-w-2xl mx-auto">
        <div 
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ciudadanía Digital
          </h2>
          <p className="text-xl text-muted-foreground">
            No pedimos pasaporte. Pedimos propósito.
          </p>
        </div>

        {submitted ? (
          <div 
            className={`text-center p-8 rounded-lg bg-[#009639]/10 border border-[#009639]/20 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <p className="text-lg font-medium text-foreground">
              Bienvenido a la fundación.
            </p>
            <p className="text-muted-foreground mt-2">
              Tu solicitud de EstrellaID ha sido registrada.
            </p>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit}
            className={`space-y-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-foreground">Nombre</Label>
              <Input 
                id="nombre"
                name="nombre"
                required
                placeholder="Tu nombre completo"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposito" className="text-foreground">
                ¿Por qué quieres cruzar el puente?
              </Label>
              <Textarea 
                id="proposito"
                name="proposito"
                required
                placeholder="Cuéntanos tu propósito..."
                rows={4}
                className="bg-background border-border resize-none"
              />
            </div>

            <Button 
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-[#0038A8] hover:bg-[#0038A8]/90 text-white font-semibold"
            >
              {isSubmitting ? "Procesando..." : "Unirme a la fundación"}
            </Button>
          </form>
        )}

        <p 
          className={`text-center text-sm text-muted-foreground mt-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          Fundadores 2018: Charles Gruber OEA, José Luis Ramírez León, + 1 ciudadano de a pie.
        </p>
      </div>
    </section>
  )
}
