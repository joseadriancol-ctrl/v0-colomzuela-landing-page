"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { SolicitudForm } from "@/components/solicitud-form"

export function HeroSection() {
  const [open, setOpen] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Tricolor gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0038A8 0%, #0038A8 30%, #FFCD00 50%, #009639 70%, #009639 100%)"
        }}
      />
      
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white drop-shadow-lg">
          Colomzuela
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-light mt-4 text-white/95">
          Dignidad humana intocable
        </h2>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl px-8 py-4 font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            style={{ background: "linear-gradient(135deg, #0047AB 0%, #002F6C 100%)" }}
          >
            Solicitar EstrellaID
          </button>
        </div>

        <p className="text-lg md:text-xl mt-6 text-white/80 max-w-2xl mx-auto text-pretty">
          Estado digital fundado el 29 de abril de 2026. Sin permiso. Sin frontera.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button 
            size="lg"
            nativeButton={false}
            className="bg-white text-[#0038A8] hover:bg-white/90 font-semibold px-8"
            render={
              <a 
                href="https://commons.wikimedia.org/wiki/File:Constitucion-Colomzuela-Art4-6-2026.jpg" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Leer Constitución Art. 4-6
              </a>
            }
          />
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/60" />
      </div>

      {/* EstrellaID Solicitud Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Star className="h-5 w-5 text-[#FFCD00]" fill="#FFCD00" />
              Solicitar EstrellaID
            </DialogTitle>
            <DialogDescription>
              Completa tus datos para unirte a la República Digital de Colomzuela.
            </DialogDescription>
          </DialogHeader>
          <SolicitudForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </section>
  )
}
