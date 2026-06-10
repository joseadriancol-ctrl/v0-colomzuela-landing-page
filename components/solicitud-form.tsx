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
import { Loader2 } from "lucide-react"

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

export function SolicitudForm({ onSuccess }: { onSuccess?: () => void }) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [pais, setPais] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !email.trim() || !pais) return

    setSubmitting(true)
    try {
      const nueva = {
        nombre: nombre.trim(),
        email: email.trim(),
        pais,
        timestamp: new Date().toISOString(),
      }

      const existentes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
      const lista = Array.isArray(existentes) ? existentes : []
      lista.push(nueva)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))

      toast.success("Solicitud recibida. Bienvenido a la espera presidencial 🇨🇴")

      setNombre("")
      setEmail("")
      setPais("")
      onSuccess?.()
    } finally {
      setSubmitting(false)
    }
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
