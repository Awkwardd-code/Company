import { Blocks } from "lucide-react"
import Link from "next/link"

function Footer() {
  return (
    <footer className="relative z-10 mt-auto backdrop-blur-xl bg-gradient-to-r from-[#0f0f1a] to-[#1a1a2e] border-t border-white/10 ">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-8 justify-between">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Logo + tagline */}
          <div className="flex items-center gap-3 group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
              group-hover:opacity-100 transition-all duration-1000 ease-in-out blur-xl" />
            
            <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-1000 ease-in-out">
              <Blocks className="size-5 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-1000 ease-in-out" />
            </div>

            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text transition-all duration-5000 ease-in-out">
              Built for developers, by developers
            </span>
          </div>

          {/* Right: Footer Links */}
          <div className="flex items-center gap-6 text-sm font-medium">
            {[ 
              { href: "/support", label: "Support" }, 
              { href: "/privacy", label: "Privacy" }, 
              { href: "/terms", label: "Terms" } 
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative uppercase tracking-wide transition-all duration-1000 ease-in-out group"
              >
                <span className="absolute -inset-1 rounded-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-md transition-all duration-1000 ease-in-out" />
                <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text group-hover:brightness-110 transition-all duration-1000 ease-in-out">
                  {label}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
