function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function MetaAILogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 287 191"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="metaai-grad" x1="0" y1="0" x2="287" y2="191" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0064E1" />
          <stop offset="0.4" stopColor="#0082FB" />
          <stop offset="0.8" stopColor="#9A57E8" />
          <stop offset="1" stopColor="#E7398C" />
        </linearGradient>
      </defs>
      <path
        fill="url(#metaai-grad)"
        d="M31.06 126c0 11 2.41 19.41 5.56 24.51 4.13 6.69 10.28 9.52 16.55 9.52 8.08 0 15.47-2 29.71-21.69 11.42-15.78 24.86-37.94 33.92-51.83l15.34-23.57c10.65-16.37 22.99-34.57 37.13-46.92C180.31 5.97 192.71 0 205.18 0c20.94 0 40.88 12.13 56.13 34.89 16.69 24.92 24.78 56.31 24.78 88.71 0 19.27-3.8 33.42-10.26 44.6-6.25 10.81-18.43 21.61-38.93 21.61v-30.95c17.55 0 21.93-16.13 21.93-34.58 0-26.3-6.13-55.48-19.64-76.32-9.59-14.78-22.02-23.81-35.7-23.81-14.79 0-26.69 11.16-40.06 31.06-7.11 10.57-14.41 23.46-22.6 38l-9.05 16.04c-18.18 32.27-22.78 39.62-31.86 51.72-15.91 21.19-29.49 29.21-47.4 29.21-21.13 0-34.49-9.15-42.76-22.94C3.18 165.34 0 145.99 0 123.93l31.06 2.07Z"
      />
      <path
        fill="url(#metaai-grad)"
        d="M24.49 37.08C38.63 15.27 59.02 0 82.4 0c13.54 0 27 4.01 41.05 15.49 15.37 12.55 31.75 33.21 52.18 67.27l7.33 12.22c17.69 29.5 27.75 44.68 33.64 51.84 7.58 9.2 12.89 11.94 19.78 11.94 17.55 0 21.93-16.13 21.93-34.58l27.4-.86c0 19.27-3.8 33.42-10.26 44.6-6.25 10.81-18.43 21.61-38.93 21.61-12.75 0-24.04-2.77-36.52-14.54-9.59-9.03-20.8-25.07-29.43-39.51l-25.66-42.86c-12.88-21.51-24.69-37.55-31.53-44.81-7.36-7.8-16.82-17.22-31.91-17.22-12.21 0-22.58 8.57-31.26 21.69L24.49 37.08Z"
      />
      <path
        fill="url(#metaai-grad)"
        d="M81.87 31.06c-12.21 0-22.58 8.57-31.26 21.69-12.27 18.54-19.78 46.16-19.78 72.67 0 11 2.41 19.41 5.56 24.51L9.93 167.06C3.18 165.34 0 145.99 0 123.93 0 93.31 8.39 61.39 24.49 37.08 38.63 15.27 59.02 0 82.4 0l-.53 31.06Z"
      />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-4xl mx-auto text-center py-12 px-6">
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
            <GitHubIcon className="w-4 h-4" />
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

      <div className="border-t border-[#1E293B] py-8 px-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-[#94A3B8]">
            Construido con <span aria-hidden="true">❤️</span>
            <span className="sr-only">amor</span> por Colomzuela
          </p>
          <a
            href="https://meta.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] transition-colors hover:text-foreground"
          >
            <MetaAILogo className="h-3.5 w-auto" />
            Powered by Meta AI
          </a>
        </div>
      </div>
    </footer>
  )
}
