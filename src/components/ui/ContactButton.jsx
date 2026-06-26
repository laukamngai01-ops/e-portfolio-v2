import Magnet from './Magnet'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function ContactButton({ onClick, label = "Let's Talk", className }) {
  return (
    <Magnet padding={50} strength={2}>
      <motion.button 
        onClick={onClick}
        className={`group relative overflow-hidden rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 sm:px-10 sm:py-5 flex items-center gap-3 transition-all duration-500 hover:bg-white/10 ${className}`}
      >
        <span className="font-sans font-medium uppercase tracking-[0.15em] text-xs sm:text-sm text-titanium group-hover:text-white transition-colors relative z-10">
          {label}
        </span>
        <span className="relative z-10 w-8 h-8 rounded-full bg-sci-teal/20 flex items-center justify-center group-hover:bg-sci-teal group-hover:text-black transition-colors duration-500">
          <ArrowUpRight className="w-4 h-4 text-sci-teal group-hover:text-black transition-colors" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-sci-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.button>
    </Magnet>
  )
}
