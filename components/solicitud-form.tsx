"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Star, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { EstrellaCard } from "@/components/estrella-card"

const PAISES = [
  "Colombia",
  "Venezuela",
  "Brasil",
  "Argentina",
  "México",
  "Perú",
  "Chile",
  "Ecuador",
  "Bolivia",
  "Paraguay",
  "Uruguay",
  "Estados Unidos",
  "España",
  "Panamá",
  "Costa Rica",
  "Guatemala",
  "República Dominicana",
  "Cuba",
  "Honduras",
  "Nicaragua",
]

const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbyzt_EPAxf9saefRXrovoVgk-pLACtGPsynF2heQSk5v4I8U6z6tV5BvYfQANYbcvTn/exec"

/** Genera un EstrellaID automático COL-XXXX (cuando el ciudadano no da documento). */
function generarColId(): string {
  return `COL-${String(Math.floor(1000 + Math.random() * 9000))}`
}

export function SolicitudForm({ onSuccess }: { onSuccess?: () => void }) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [pais, setPais] = useState("")
  const [cedula, setCedula] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [success, setSuccess] = useState<{
    nombre: string
    email: string
    pais: string
    estrellaId: string
  } | null>(null)
  const [showCard, setShowCard] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    if (!nombre.trim() || !email.trim() || !pais) return

    setSubmitting(true)
    try {
      // Documento del usuario (cualquier formato), o EstrellaID automático COL-XXXX.
      const cedulaFinal = cedula.trim() || generarColId()

      // Enviar DIRECTO al backend (Apps Script -> Google Sheet) usando los nombres
      // de campo EXACTOS que espera e.parameter: nombre, email, cedula, pais.
      const formData = new FormData()
      formData.append("nombre", nombre.trim())
      formData.append("email", email.trim())
      formData.append("cedula", cedulaFinal)
      formData.append("pais", pais)

      console.log("[v0] POST a Apps Script:", Object.fromEntries(formData))

      // mode: 'no-cors' es obligatorio con Apps Script: la respuesta es opaca
      // (status 0, no legible), por eso un fetch que no lanza = enviado.
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      })

      toast.success(`Ciudadano registrado en Colomzuela. Tu EstrellaID: ${cedulaFinal}`)

      setSuccess({
        nombre: nombre.trim(),
        email: email.trim(),
        pais,
        estrellaId: cedulaFinal,
      })
    } catch (err) {
      console.log("[v0] Error al enviar a Apps Script:", err)
      setErrorMsg("Error: No se pudo conectar con el Sheet. Revisa permisos e inténtalo de nuevo.")
      toast.error("Error de conexión con el servidor.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <>
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <CheckCircle2 className="h-12 w-12 text-[#009639]" />
          <div>
            <p className="text-lg font-semibold text-foreground">Ciudadano registrado</p>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Bienvenido a la espera presidencial de la República Digital de Colomzuela.
            </p>
          </div>
          <div className="w-full rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tu EstrellaID</p>
            <p className="font-mono text-2xl font-black text-foreground">{success.estrellaId}</p>
          </div>
          <Button
            className="w-full font-bold text-[#1a1205] hover:opacity-90"
            style={{ backgroundColor: "#D4AF37" }}
            onClick={() => setShowCard(true)}
          >
            <Star className="h-4 w-4" fill="currentColor" />
            Generar mi EstrellaID Digital
          </Button>
        </div>

        <Dialog open={showCard} onOpenChange={setShowCard}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Star className="h-5 w-5 text-[#FFCD00]" fill="#FFCD00" />
                Tu EstrellaID Digital
              </DialogTitle>
              <DialogDescription>
                Sube tu foto (opcional) y descarga tu cédula digital en PNG.
              </DialogDescription>
            </DialogHeader>
            <EstrellaCard
              nombre={success.nombre}
              email={success.email}
              pais={success.pais}
              estrellaId={success.estrellaId}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nombre">Nombre completo</Label>
        <Input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre completo"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cedula">Cédula o Pasaporte - Opcional</Label>
        <Input
          id="cedula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          placeholder="V-12345678 o déjalo vacío para EstrellaID automática"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pais">País de origen</Label>
        <Select value={pais} onValueChange={(value) => setPais(value as string)}>
          <SelectTrigger id="pais" className="w-full">
            <SelectValue placeholder="Selecciona tu país" />
          </SelectTrigger>
          <SelectContent>
            {PAISES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {errorMsg && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMsg}
        </p>
      )}

      <Button
        type="submit"
        disabled={submitting || !nombre.trim() || !email.trim() || !pais}
        className="mt-2 w-full font-bold text-[#1a1205] hover:opacity-90"
        style={{ backgroundColor: "#D4AF37" }}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar solicitud"
        )}
      </Button>
    </form>
  )
}
