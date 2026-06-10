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

const STORAGE_KEY = "solicitudes_estrellaid"
const WEBHOOK_KEY = "webhook_url"
const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbyzt_EPAxf9saefRXrovoVgk-pLACtGPsynF2heQSk5v4I8U6z6tV5BvYfQANYbcvTn/exec"

/** Valida cédula (V-#####...) o pasaporte (P-#####...). Acepta longitudes variables. */
function validarDocumento(value: string): boolean {
  return /^[VP]-\d{1,}$/.test(value)
}

/** Genera el siguiente ID COL-XXXX buscando el último COL- registrado. */
function generarColId(lista: { cedulaFinal?: string }[]): string {
  let max = 0
  for (const s of lista) {
    const m = (s.cedulaFinal || "").match(/^COL-(\d+)$/)
    if (m) max = Math.max(max, Number.parseInt(m[1], 10))
  }
  return `COL-${String(max + 1).padStart(4, "0")}`
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
    numero: number
    estrellaId: string
  } | null>(null)
  const [showCard, setShowCard] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    if (!nombre.trim() || !email.trim() || !pais) return

    const doc = cedula.trim().toUpperCase()
    if (doc && !validarDocumento(doc)) {
      setErrorMsg("Formato inválido. Usa V-12345678 o P-123456 (o déjalo vacío).")
      toast.error("Formato de documento inválido.")
      return
    }

    setSubmitting(true)
    try {
      const existentes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
      const lista = Array.isArray(existentes) ? existentes : []

      // Documento del usuario, o EstrellaID automático COL-XXXX.
      const cedulaFinal = doc || generarColId(lista)

      const nueva = {
        nombre: nombre.trim(),
        email: email.trim(),
        pais,
        cedulaFinal,
        timestamp: new Date().toISOString(),
      }

      // Enviar al backend (Apps Script -> Google Sheet) usando los nombres de
      // campo EXACTOS que espera e.parameter: nombre, email, cedula, pais.
      const webhookUrl = localStorage.getItem(WEBHOOK_KEY) || WEBHOOK_URL
      const formData = new FormData()
      formData.append("nombre", nueva.nombre)
      formData.append("email", nueva.email)
      formData.append("cedula", cedulaFinal)
      formData.append("pais", nueva.pais)

      console.log("[v0] Enviando a Apps Script:", {
        url: webhookUrl,
        nombre: nueva.nombre,
        email: nueva.email,
        cedula: cedulaFinal,
        pais: nueva.pais,
      })

      // mode: 'no-cors' es obligatorio con Apps Script: la respuesta es opaca
      // (status 0, no legible), por eso un fetch que no lanza = enviado.
      const response = await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      })

      console.log("[v0] Respuesta Apps Script:", response)

      // Solo guardamos localmente y mostramos éxito si el envío no lanzó error.
      lista.push(nueva)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))

      toast.success(`Solicitud enviada. Tu EstrellaID: ${cedulaFinal}`)

      setSuccess({
        nombre: nueva.nombre,
        email: nueva.email,
        pais: nueva.pais,
        numero: lista.length,
        estrellaId: cedulaFinal,
      })
    } catch (err) {
      console.log("[v0] Error al enviar a Apps Script:", err)
      setErrorMsg("No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.")
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
            <p className="text-lg font-semibold text-foreground">Solicitud recibida</p>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Eres el ciudadano #{String(success.numero).padStart(3, "0")} en la espera presidencial.
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
              numero={success.numero}
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
