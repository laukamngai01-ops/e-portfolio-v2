import { ArrowUpRight } from 'lucide-react'

export default function LiveProjectButton({ className = '' }) {
  return (
    <a 
      href="#" 
      className={`group flex items-center gap-2 border border-white/20 rounded-full pl-5 pr-2 py-2 hover:bg-white/10 transition-colors duration-300 ${className}`}
    >
      <span className="font-sans text-[10px] uppercase tracking-widest text-titanium/80 group-hover:text-titanium transition-colors">
        View Project
      </span>
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-sci-teal transition-colors duration-300">
        <ArrowUpRight className="w-4 h-4 text-titanium group-hover:text-black transition-colors" />
      </div>
    </a>
  )
}
