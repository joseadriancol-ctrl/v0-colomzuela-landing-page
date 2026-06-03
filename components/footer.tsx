import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-foreground font-medium mb-6 text-pretty">
          Colomzuela.org © 2026. Forjado en un despacho de la OEA. Nacido en Commons. Vive en el código.
        </p>
        
        <div className="flex items-center justify-center gap-6 mb-6">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a 
            href="https://commons.wikimedia.org/wiki/File:Constitucion-Colomzuela-Art4-6-2026.jpg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Constitución
          </a>
          <a 
            href="mailto:contacto@colomzuela.org"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contacto
          </a>
        </div>
        
        <p className="text-sm text-muted-foreground">
          El trinomio cuadrado perfecto: Brasil + Colombia + Venezuela.
        </p>
      </div>
    </footer>
  )
}
