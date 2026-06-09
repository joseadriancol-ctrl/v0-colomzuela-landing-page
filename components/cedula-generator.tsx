"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import QRCode from "qrcode"
import { toPng } from "html-to-image"
import { Upload, Download, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Cedula = {
  id: string
  nombre: string
  foto: string
  fecha: string
  qr: string
}

function getNextId(): string {
  const key = "colomzuela_id_counter"
  let current = 0
  try {
    current = Number.parseInt(localStorage.getItem(key) || "0", 10)
  } catch {
    current = 0
  }
  const next = current + 1
  try {
    localStorage.setItem(key, String(next))
  } catch {
    // ignore
  }
  return `COL-2026-${String(next).padStart(6, "0")}`
}

function formatFecha(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export function CedulaGenerator() {
  const [nombre, setNombre] = useState("")
  const [foto, setFoto] = useState<string>("")
  const [cedula, setCedula] = useState<Cedula | null>(null)
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleFoto = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setFoto(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!nombre.trim() || !foto) return
    setGenerating(true)
    const id = getNextId()
    const fecha = formatFecha(new Date())
    const payload = JSON.stringify({
      estado: "República Digital de Colomzuela",
      id,
      nombre: nombre.trim(),
      ingreso: fecha,
    })
    const qr = await QRCode.toDataURL(payload, {
      margin: 1,
      width: 240,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    })
    setCedula({ id, nombre: nombre.trim(), foto, fecha, qr })
    setGenerating(false)
  }, [nombre, foto])

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || !cedula) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true })
      const link = document.createElement("a")
      link.download = `EstrellaID-${cedula.id}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setDownloading(false)
    }
  }, [cedula])

  return (
    <div className="grid gap-10 lg:grid-cols-2 items-start">
      {/* Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium">
            Nombre completo
          </Label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. María Fernanda Restrepo"
            className="bg-card border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="foto" className="text-sm font-medium">
            Fotografía
          </Label>
          <label
            htmlFor="foto"
            className="flex items-center gap-3 cursor-pointer rounded-md border border-dashed border-border bg-card px-4 py-4 text-sm text-muted-foreground hover:border-foreground/40 transition-colors"
          >
            {foto ? (
              <img
                src={foto || "/placeholder.svg"}
                alt="Vista previa"
                className="h-10 w-10 rounded object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                <Upload className="h-4 w-4" />
              </span>
            )}
            <span>{foto ? "Cambiar fotografía" : "Subir fotografía"}</span>
          </label>
          <input id="foto" type="file" accept="image/*" onChange={handleFoto} className="sr-only" />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!nombre.trim() || !foto || generating}
          className="w-full"
          size="lg"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generando…
            </>
          ) : (
            "Generar cédula"
          )}
        </Button>

        {cedula && (
          <Button onClick={handleDownload} disabled={downloading} variant="secondary" className="w-full" size="lg">
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparando PNG…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Descargar PNG
              </>
            )}
          </Button>
        )}
      </div>

      {/* Card preview */}
      <div className="flex justify-center lg:sticky lg:top-8">
        {cedula ? (
          <div
            ref={cardRef}
            className="w-[360px] overflow-hidden rounded-2xl bg-[#0a0a0a] text-[#fafafa] shadow-2xl"
          >
            {/* tricolor bar */}
            <div className="flex h-2 w-full">
              <div className="flex-1 bg-[#0038A8]" />
              <div className="flex-1 bg-[#FFCD00]" />
              <div className="flex-1 bg-[#009639]" />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[#FFCD00]" fill="#FFCD00" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fafafa]/90 leading-tight">
                  República Digital de Colomzuela
                </p>
              </div>
              <p className="mt-1 text-[10px] font-light italic text-[#fafafa]/60">Dignidad humana intocable</p>

              <div className="mt-5 flex gap-4">
                <img
                  src={cedula.foto || "/placeholder.svg"}
                  alt={`Fotografía de ${cedula.nombre}`}
                  className="h-28 w-24 rounded-md object-cover ring-1 ring-white/10"
                  crossOrigin="anonymous"
                />
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#fafafa]/40">Nombre</p>
                    <p className="text-sm font-semibold leading-snug text-balance">{cedula.nombre}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#fafafa]/40">Identificación</p>
                    <p className="font-mono text-sm font-bold text-[#FFCD00]">{cedula.id}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#fafafa]/40">Fecha de ingreso</p>
                    <p className="text-xs font-medium">{cedula.fecha}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-4">
                <img src={cedula.qr || "/placeholder.svg"} alt="Código QR de verificación" className="h-20 w-20 rounded bg-white p-1" />
                <div className="flex-1">
                  <p className="text-[9px] uppercase tracking-wider text-[#fafafa]/40">EstrellaID v1.1</p>
                  <p className="text-[10px] leading-relaxed text-[#fafafa]/60">
                    Documento digital soberano. Verificable mediante código QR. Todos los ciudadanos son iguales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-24 text-center">
            <Star className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground text-balance px-8">
              Completa el formulario para generar tu cédula EstrellaID
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
