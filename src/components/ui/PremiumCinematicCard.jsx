import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'

export default function PremiumCinematicCard({ children, className = '' }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mouse tracking for the soft elegant spotlight
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  
  // Extra smooth and heavy spring for a luxurious, weighty feel
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 100, mass: 1.2 })
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 100, mass: 1.2 })

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

  // A very soft, wide, pure white gradient to act as the tactile glass reflection
  const hoverGlowMask = useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, rgba(255, 255, 255, 0.08), transparent 80%)`
  const borderGlowMask = useMotionTemplate`radial-gradient(400px circle at ${smoothX}px ${smoothY}px, white, transparent 100%)`

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group flex flex-col relative w-full h-full rounded-[24px] sm:rounded-[32px] bg-[#080808] p-8 sm:p-10 border border-white/[0.03] overflow-hidden transition-all duration-700 ease-out ${className}`}
      whileHover={{ y: -2, scale: 1.005 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      style={{
        boxShadow: isHovered ? '0 20px 40px -10px rgba(0,0,0,0.8)' : '0 10px 30px -10px rgba(0,0,0,0.5)'
      }}
    >
      {/* 1. Base Frosted Glass & Subtle Noise */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.95\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay'
      }} />
      
      {/* 2. Perpetual Ambient Lighting (Very subtle diagonal gradient wash) */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          opacity: isHovered ? 0.3 : 0.6
        }}
        transition={{ 
          duration: 20, 
          ease: "linear", 
          repeat: Infinity 
        }}
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 40%, rgba(255,255,255,0.01) 60%, transparent 100%)',
          backgroundSize: '200% 200%'
        }}
      />

      {/* 3. Hover Tactile Glass Reflection (Body) */}
      {mounted && (
        <motion.div
          className="absolute inset-0 z-20 rounded-[inherit] pointer-events-none transition-opacity duration-500 ease-out"
          style={{ 
            opacity: isHovered ? 1 : 0,
            background: hoverGlowMask,
          }}
        />
      )}

      {/* 4. Crisp Silver Edge Border on Hover */}
      {mounted && (
        <motion.div
          className="absolute inset-0 z-20 rounded-[inherit] border border-white/[0.15] pointer-events-none transition-opacity duration-500 ease-out"
          style={{ 
            opacity: isHovered ? 1 : 0,
            WebkitMaskImage: borderGlowMask, 
            maskImage: borderGlowMask
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-30 h-full flex flex-col">
        {children}
      </div>

    </motion.div>
  )
}
