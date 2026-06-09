import { CedulaGenerator } from "@/components/cedula-generator"
import { Star } from "lucide-react"

export default function CedulaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5">
            <Star className="h-3.5 w-3.5 text-[#FFCD00]" fill="#FFCD00" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              EstrellaID v1.1
            </span>
          </div>
          <h1 className="text-balance text-4xl font-black tracking-tight md:text-5xl">
            REPÚBLICA DIGITAL DE COLOMZUELA
          </h1>
          <p className="mt-3 text-lg font-light text-muted-foreground">Dignidad humana intocable</p>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm text-muted-foreground/80">
            Genera tu cédula digital soberana. Sin expedición, sin vencimiento. Todos los ciudadanos son iguales.
          </p>
        </header>

        <CedulaGenerator />
      </div>
    </main>
  )
}
