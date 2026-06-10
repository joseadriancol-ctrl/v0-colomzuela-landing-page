"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Download, Loader2 } from "lucide-react"

interface EstrellaCardProps {
  nombre: string
  email: string
  pais: string
  estrellaId: string
}

const W = 800
const H = 500

/** Loads an image from a base64 dataURL, resolving only AFTER onload fires. */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Draws a 5-point star centered at (cx, cy). */
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outer: number, inner: number, color: string) {
  ctx.save()
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner
    const angle = (Math.PI / 5) * i - Math.PI / 2
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

function getIniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return "?"
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

export function EstrellaCard({ nombre, email, pais, estrellaId }: EstrellaCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [foto, setFoto] = useState<string | null>(null)
  const [rendering, setRendering] = useState(false)

  const numeroFmt = estrellaId

  const renderCard = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setRendering(true)
    try {
      // Ensure the Inter font is loaded before drawing text onto the canvas.
      if (document.fonts?.ready) {
        await document.fonts.ready
      }

      ctx.clearRect(0, 0, W, H)

      // Blue Colomzuela gradient background
      const bg = ctx.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, "#0047AB")
      bg.addColorStop(1, "#002F6C")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Tricolor accent bar on the left edge
      ctx.fillStyle = "#0038A8"
      ctx.fillRect(0, 0, 16, H)
      ctx.fillStyle = "#FFCD00"
      ctx.fillRect(0, H / 3, 16, H / 3)
      ctx.fillStyle = "#009639"
      ctx.fillRect(0, (2 * H) / 3, 16, H / 3)

      // Logo star + republic label
      drawStar(ctx, 70, 70, 26, 11, "#FFCD00")
      ctx.fillStyle = "rgba(255,255,255,0.85)"
      ctx.font = "600 16px Inter, sans-serif"
      ctx.textBaseline = "alphabetic"
      ctx.fillText("REPÚBLICA DIGITAL DE COLOMZUELA", 110, 62)
      ctx.fillStyle = "rgba(255,255,255,0.6)"
      ctx.font = "400 13px Inter, sans-serif"
      ctx.fillText("Dignidad humana intocable", 110, 84)

      // ESTRELLAID title
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "800 56px Inter, sans-serif"
      ctx.fillText("ESTRELLAID", 48, 180)

      // Photo / avatar circle (right side)
      const cx = 660
      const cy = 200
      const radius = 90
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      if (foto) {
        const img = await loadImage(foto)
        // cover-fit the image inside the circle
        const scale = Math.max((radius * 2) / img.width, (radius * 2) / img.height)
        const dw = img.width * scale
        const dh = img.height * scale
        ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh)
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.12)"
        ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
        ctx.fillStyle = "#FFCD00"
        ctx.font = "700 64px Inter, sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(getIniciales(nombre), cx, cy + 4)
        ctx.textAlign = "left"
        ctx.textBaseline = "alphabetic"
      }
      ctx.restore()

      // Ring around the photo
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.lineWidth = 4
      ctx.strokeStyle = "rgba(255,255,255,0.7)"
      ctx.stroke()

      // Citizen data fields
      ctx.textBaseline = "alphabetic"
      ctx.fillStyle = "rgba(255,255,255,0.6)"
      ctx.font = "600 14px Inter, sans-serif"
      ctx.fillText("NOMBRE", 48, 250)
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "700 30px Inter, sans-serif"
      ctx.fillText(nombre, 48, 284)

      ctx.fillStyle = "rgba(255,255,255,0.6)"
      ctx.font = "600 14px Inter, sans-serif"
      ctx.fillText("EMAIL", 48, 328)
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "500 20px Inter, sans-serif"
      ctx.fillText(email, 48, 354)

      ctx.fillStyle = "rgba(255,255,255,0.6)"
      ctx.font = "600 14px Inter, sans-serif"
      ctx.fillText("PAÍS DE ORIGEN", 48, 398)
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "500 20px Inter, sans-serif"
      ctx.fillText(pais, 48, 424)

      // Citizen number badge (bottom right)
      ctx.fillStyle = "#FFCD00"
      ctx.font = "800 26px Inter, sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`EstrellaID: ${numeroFmt}`, W - 48, H - 40)
      ctx.textAlign = "left"
    } finally {
      setRendering(false)
    }
  }, [foto, nombre, email, pais, numeroFmt])

  useEffect(() => {
    renderCard()
  }, [renderCard])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFoto(typeof reader.result === "string" ? reader.result : null)
    }
    reader.readAsDataURL(file)
  }

  const handleDownload = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Re-render to guarantee the latest photo is fully drawn before exporting.
    await renderCard()
    const dataUrl = canvas.toDataURL("image/png")
    try {
      localStorage.setItem(`estrellaid_png_${email}`, dataUrl)
    } catch {
      // localStorage may be full; download still proceeds.
    }
    const link = document.createElement("a")
    link.download = `EstrellaID-${numeroFmt}-${nombre.replace(/\s+/g, "_")}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-border">
        <canvas ref={canvasRef} width={W} height={H} className="block h-auto w-full" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1"
          render={
            <label htmlFor="estrella-foto" className="cursor-pointer">
              <Upload className="h-4 w-4" />
              {foto ? "Cambiar foto" : "Subir foto (opcional)"}
              <input
                id="estrella-foto"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
              />
            </label>
          }
        />
        <Button
          className="flex-1 font-bold text-[#1a1205] hover:opacity-90"
          style={{ backgroundColor: "#D4AF37" }}
          onClick={handleDownload}
          disabled={rendering}
        >
          {rendering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Descargar PNG
        </Button>
      </div>
    </div>
  )
}
