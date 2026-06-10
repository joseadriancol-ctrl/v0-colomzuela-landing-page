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
import { Users, Download, RefreshCw, Loader2 } from "lucide-react"

const STORAGE_KEY = "solicitudes_estrellaid"
const WEBHOOK_KEY = "colomzuela_sheets_webhook"
const DEFAULT_WEBHOOK = "https://script.google.com/macros/s/AKfycbxColomzuelaEstrellaID2026exec/exec"

type Solicitud = {
  nombre: string
  email: string
  pais: string
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
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [webhook, setWebhook] = useState("")
  const [syncing, setSyncing] = useState(false)

  const cargar = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      setSolicitudes(Array.isArray(parsed) ? parsed : [])
    } catch {
      setSolicitudes([])
    }
    try {
      setWebhook(localStorage.getItem(WEBHOOK_KEY) || DEFAULT_WEBHOOK)
    } catch {
      setWebhook(DEFAULT_WEBHOOK)
    }
  }, [])

  useEffect(() => {
    if (open) cargar()
  }, [open, cargar])

  const guardarWebhook = useCallback((value: string) => {
    // Guarda solo la URL pura: quita comillas, espacios y cualquier envoltura tipo fetch("...")
    const match = value.match(/https:\/\/script\.google\.com\/macros\/s\/[^\s"')]+/)
    const limpia = match ? match[0] : value.replace(/^['"]+|['"]+$/g, "").trim()
    setWebhook(limpia)
    try {
      localStorage.setItem(WEBHOOK_KEY, limpia)
    } catch {
      // ignore storage errors
    }
  }, [])

  const sincronizar = useCallback(async () => {
    const url = webhook.trim()
    if (!url) {
      toast.error("❌ Error. Revisa URL del webhook")
      return
    }
    if (solicitudes.length === 0) return

    setSyncing(true)
    try {
      const datos = solicitudes.map((s) => ({
        nombre: s.nombre,
        email: s.email,
        pais: s.pais,
        fecha: formatFecha(s.timestamp),
      }))

      // Apps Script rechaza CORS cross-origin, así que usamos no-cors.
      // La respuesta es opaca (no se puede leer res.ok), por lo que si el
      // fetch no lanza error consideramos el envío exitoso.
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(datos),
      })

      toast.success(`✅ Sincronizado: ${datos.length} ciudadanos en tu Sheet`)
    } catch {
      toast.error("❌ Error. Revisa URL del webhook")
    } finally {
      setSyncing(false)
    }
  }, [webhook, solicitudes])

  const exportarCSV = useCallback(() => {
    if (solicitudes.length === 0) return

    const escape = (val: string) => `"${String(val).replace(/"/g, '""')}"`
    const header = ["#", "Nombre", "Email", "País", "Fecha"]
    const rows = solicitudes.map((s, i) =>
      [i + 1, s.nombre, s.email, s.pais, formatFecha(s.timestamp)].map((v) => escape(String(v))).join(","),
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
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 gap-2 border-white/30 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
      >
        <Users className="h-4 w-4" />
        Panel Ciudadanos
      </Button>

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
                        <TableCell>{s.pais}</TableCell>
                        <TableCell className="text-muted-foreground">{formatFecha(s.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
                <Label htmlFor="webhook-url" className="text-sm font-medium">
                  URL del webhook (Google Sheets)
                </Label>
                <Input
                  id="webhook-url"
                  type="url"
                  inputMode="url"
                  placeholder="https://script.google.com/macros/s/TU_ID/exec"
                  value={webhook}
                  onChange={(e) => guardarWebhook(e.target.value)}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Se guarda en tu navegador. Pégala una sola vez.
                </p>
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
