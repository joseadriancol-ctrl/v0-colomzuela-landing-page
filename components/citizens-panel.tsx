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
import { Users, Download } from "lucide-react"

const STORAGE_KEY = "solicitudes_estrellaid"

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

  const cargar = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      setSolicitudes(Array.isArray(parsed) ? parsed : [])
    } catch {
      setSolicitudes([])
    }
  }, [])

  useEffect(() => {
    if (open) cargar()
  }, [open, cargar])

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

              <Button onClick={exportarCSV} className="gap-2 self-end">
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
