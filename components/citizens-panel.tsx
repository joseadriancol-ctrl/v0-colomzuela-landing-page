"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Users, Download, RefreshCw, Loader2, Settings, Save, PlugZap } from "lucide-react"

const STORAGE_KEY = "solicitudes_estrellaid"
const WEBHOOK_KEY = "webhook_url"
const DEFAULT_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbyzt_EPAxf9saefRXrovoVgk-pLACtGPsynF2heQSk5v4I8U6z6tV5BvYfQANYbcvTn/exec"

/** Extrae solo la URL pura /exec de Apps Script si el usuario pega código extra. */
function limpiarWebhook(value: string): string {
  const match = value.match(/https:\/\/script\.google\.com\/macros\/s\/[^\s"')]+\/exec/)
  if (match) return match[0]
  return value.replace(/^['"]+|['"]+$/g, "").trim()
}

type Solicitud = {
  nombre: string
  email: string
  pais: string
  cedulaFinal?: string
  timestamp: string
}

function formatFecha(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function CitizensPanel() {
  const [open, setOpen] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [draftWebhook, setDraftWebhook] = useState("")
  const [syncing, setSyncing] = useState(false)
  const [testing, setTesting] = useState(false)

  const cargar = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      setSolicitudes(Array.isArray(parsed) ? parsed : [])
    } catch {
      setSolicitudes([])
    }
    try {
      let saved = localStorage.getItem(WEBHOOK_KEY)
      if (!saved) {
        // Sembrar la URL por defecto la primera vez.
        saved = DEFAULT_WEBHOOK
        localStorage.setItem(WEBHOOK_KEY, saved)
      }
      setDraftWebhook(saved)
    } catch {
      setDraftWebhook(DEFAULT_WEBHOOK)
    }
  }, [])

  useEffect(() => {
    if (open || configOpen) cargar()
  }, [open, configOpen, cargar])

  const guardarWebhook = useCallback(() => {
    const limpia = limpiarWebhook(draftWebhook)
    setDraftWebhook(limpia)
    try {
      localStorage.setItem(WEBHOOK_KEY, limpia)
    } catch {
      // ignore storage errors
    }
    toast.success("URL guardada")
  }, [draftWebhook])

  const probarConexion = useCallback(async () => {
    const url = limpiarWebhook(draftWebhook) || localStorage.getItem(WEBHOOK_KEY) || ""
    if (!url || url === "[PEGA_AQUI_TU_URL]") {
      toast.error("Primero pega tu URL de Google Sheets en Configuración")
      return
    }
    setTesting(true)
    try {
      const body = new URLSearchParams({
        nombre: "Presidente Blindado",
        email: "test@colomzuela.org",
        cedula: "V-00000007",
        pais: "Colomzuela",
      })
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      })
      toast.success("✅ Conexión exitosa")
    } catch {
      toast.error("❌ Error de conexión")
    } finally {
      setTesting(false)
    }
  }, [draftWebhook])

  const sincronizar = useCallback(async () => {
    const webhookUrl = localStorage.getItem(WEBHOOK_KEY) || "[PEGA_AQUI_TU_URL]"
    if (!webhookUrl || webhookUrl === "[PEGA_AQUI_TU_URL]") {
      toast.error("Primero pega tu URL de Google Sheets en Configuración")
      return
    }
    if (solicitudes.length === 0) return

    setSyncing(true)
    try {
      // El Apps Script lee e.parameter.{nombre,email,cedula,pais}, que solo se
      // llena con cuerpos form-urlencoded (no JSON). Hace un appendRow por POST,
      // así que enviamos un ciudadano por petición.
      for (const s of solicitudes) {
        const body = new URLSearchParams({
          nombre: s.nombre,
          email: s.email,
          cedula: s.cedulaFinal || "",
          pais: s.pais,
        })

        // no-cors: la respuesta es opaca; si el fetch no lanza, lo damos por enviado.
        await fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        })
      }

      const n = solicitudes.length
      toast.success(`✅ Sincronizado: ${n} ${n === 1 ? "ciudadano" : "ciudadanos"} en tu Sheet`)
    } catch {
      toast.error("❌ Error de conexión")
    } finally {
      setSyncing(false)
    }
  }, [solicitudes])

  const exportarCSV = useCallback(() => {
    if (solicitudes.length === 0) return

    const escape = (val: string) => `"${String(val).replace(/"/g, '""')}"`
    const header = ["#", "Nombre", "Email", "EstrellaID", "País", "Fecha"]
    const rows = solicitudes.map((s, i) =>
      [i + 1, s.nombre, s.email, s.cedulaFinal || "", s.pais, formatFecha(s.timestamp)]
        .map((v) => escape(String(v)))
        .join(","),
    )
    const csv = "\uFEFF" + [header.map(escape).join(","), ...rows].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `censo-estrellaid-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [solicitudes])

  const total = solicitudes.length

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="gap-2 border-white/30 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
        >
          <Users className="h-4 w-4" />
          Panel Ciudadanos
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfigOpen(true)}
          aria-label="Configuración"
          className="gap-2 border-white/30 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Configuración</span>
        </Button>
      </div>

      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-5 w-5" />
              Configuración
            </DialogTitle>
            <DialogDescription>
              Conecta tu hoja de cálculo de Google Sheets vía Apps Script.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="webhook-config">URL Webhook Google Sheets</Label>
            <Input
              id="webhook-config"
              type="url"
              inputMode="url"
              placeholder="Pega tu URL /exec de Apps Script aquí"
              value={draftWebhook}
              onChange={(e) => setDraftWebhook(e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Se guarda en tu navegador. Si pegas código extra, extraemos solo la URL /exec.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button onClick={guardarWebhook} className="gap-2">
              <Save className="h-4 w-4" />
              Guardar URL
            </Button>
            <Button onClick={probarConexion} disabled={testing} variant="outline" className="gap-2">
              {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
              Probar Conexión
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Censo Presidencial - EstrellaID</DialogTitle>
            <DialogDescription>Registro de ciudadanos en espera de la República Digital de Colomzuela.</DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border bg-muted/40 p-5 text-center">
            <p className="text-sm text-muted-foreground">Total en espera</p>
            <p className="text-4xl font-black tracking-tight text-foreground">
              {total} <span className="text-lg font-medium text-muted-foreground">ciudadanos</span>
            </p>
          </div>

          {total === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-10 text-center text-muted-foreground">
              Aún no hay ciudadanos. Comparte la landing.
            </div>
          ) : (
            <>
              <div className="max-h-[45vh] overflow-y-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>EstrellaID</TableHead>
                      <TableHead>País</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitudes.map((s, i) => (
                      <TableRow key={`${s.email}-${i}`}>
                        <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="font-medium">{s.nombre}</TableCell>
                        <TableCell className="text-muted-foreground">{s.email}</TableCell>
                        <TableCell className="font-mono text-xs">{s.cedulaFinal || "—"}</TableCell>
                        <TableCell>{s.pais}</TableCell>
                        <TableCell className="text-muted-foreground">{formatFecha(s.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  onClick={sincronizar}
                  disabled={syncing}
                  className="gap-2 bg-[#0F9D58] text-white hover:bg-[#0c8348]"
                >
                  {syncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Sincronizar con Google Sheets
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false)
                    setConfigOpen(true)
                  }}
                  variant="ghost"
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Configuración
                </Button>
                <Button onClick={exportarCSV} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
