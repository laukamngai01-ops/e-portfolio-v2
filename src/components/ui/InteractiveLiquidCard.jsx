import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'

export default function InteractiveLiquidCard({ children, className = '' }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse tracking for interactive glow
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  
  // Smooth springs
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.5 })

  function handleMouseMove(e) {
    if (!cardRef.current) return
    const { left, top } = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  function handleMouseEnter() {
    setIsHovered(true)
  }

  function handleMouseLeave() {
    setIsHovered(false)
    mouseX.set(-1000)
    mouseY.set(-1000)
  }

  // The sharp spotlight glow that tracks the mouse
  const hoverGlowMask = useMotionTemplate`radial-gradient(400px circle at ${smoothX}px ${smoothY}px, white, transparent 100%)`

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group flex flex-col relative w-full h-full rounded-[32px] sm:rounded-[40px] bg-[#050505] p-8 sm:p-10 border border-white/[0.05] overflow-hidden shadow-2xl transition-all duration-500 ${className}`}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* 1. Base Glass & Noise Layer */}
      <div className="absolute inset-0 liquid-glass pointer-events-none z-0" />
      
      {/* 2. Perpetual Motion Blob (Idle State) */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center mix-blend-screen"
        animate={{ opacity: isHovered ? 0 : 0.6 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-[150%] h-[150%] absolute top-[-25%] left-[-25%] bg-sci-teal/10 blur-[80px] rounded-full animate-blob pointer-events-none" />
        <div className="w-[100%] h-[100%] absolute bottom-[-20%] right-[-20%] bg-muted-cyan/10 blur-[100px] rounded-full animate-blob pointer-events-none" style={{ animationDelay: '-5s' }} />
      </motion.div>

      {/* 3. Hover Tracking Spotlight (Active State) */}
      <motion.div
        className="absolute inset-0 z-20 rounded-[inherit] pointer-events-none mix-blend-screen transition-opacity duration-300"
        style={{ 
          opacity: isHovered ? 1 : 0,
          boxShadow: '0 0 60px 10px rgba(0, 240, 255, 0.15), inset 0 0 40px 5px rgba(123, 178, 196, 0.15)',
          WebkitMaskImage: hoverGlowMask, 
          maskImage: hoverGlowMask
        }}
      />

      {/* Crisp White Edge Border on Hover */}
      <motion.div
        className="absolute inset-0 z-20 rounded-[inherit] border border-sci-teal/30 pointer-events-none mix-blend-overlay transition-opacity duration-300"
        style={{ 
          opacity: isHovered ? 1 : 0,
          WebkitMaskImage: hoverGlowMask, 
          maskImage: hoverGlowMask
        }}
      />

      {/* Content */}
      <div className="relative z-30 h-full flex flex-col">
        {children}
      </div>

    </motion.div>
  )
}
