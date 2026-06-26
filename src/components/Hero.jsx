import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import FadeIn from './ui/FadeIn'
import ContactButton from './ui/ContactButton'
import WordsPullUp from './ui/WordsPullUp'

export default function Hero() {
  const containerRef = useRef(null)
  
  // Mouse tracking for spotlight
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Smooth spring physics for the cursor tracking
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Create a template string for the mask image using the motion values
  const maskImage = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(circle 300px at ${x}px ${y}px, black 10%, transparent 80%)`
  )

  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 }
    }
  }

  const itemVars = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  }

  // Parallax and 3D Rotation for the title based on mouse position
  const parallaxX = useTransform(smoothX, v => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1000
    return ((v / w) - 0.5) * 40 // -20px to 20px offset
  })
  const parallaxY = useTransform(smoothY, v => {
    const h = typeof window !== 'undefined' ? window.innerHeight : 1000
    return ((v / h) - 0.5) * 40
  })
  const rotateX = useTransform(smoothY, v => {
    const h = typeof window !== 'undefined' ? window.innerHeight : 1000
    return ((v / h) - 0.5) * -15 // -7.5 to 7.5 deg
  })
  const rotateY = useTransform(smoothX, v => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1000
    return ((v / w) - 0.5) * 15
  })

  return (
    <section ref={containerRef} id="hero" className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-[#050505]" style={{ perspective: 1000 }} data-inspector-label="Hero Section">
      
      {/* Base Background Video (Dark, Grayscale or Blurred) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover mix-blend-screen opacity-30 grayscale blur-[4px]"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#050505]/80 to-[#050505]" />
      </div>

      {/* Spotlight Reveal Layer (Full color, sharp) */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ WebkitMaskImage: maskImage, maskImage }}
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover mix-blend-screen opacity-100 saturate-150"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" 
        />
        <div className="absolute inset-0 bg-sci-teal/10 mix-blend-color" />
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 w-full mt-16 md:mt-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
        <motion.div 
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="w-full flex flex-col items-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div 
            style={{ x: parallaxX, y: parallaxY, rotateX, rotateY, z: 50 }}
            className="pointer-events-auto cursor-crosshair font-display font-normal uppercase tracking-tight leading-[0.9] text-[clamp(4rem,12vw,14rem)] text-sci-teal mix-blend-plus-lighter drop-shadow-2xl origin-center"
            whileHover={{ 
              scale: 1.03,
              textShadow: "0px 0px 40px rgba(0, 240, 255, 0.8), 0px 0px 80px rgba(255, 255, 255, 0.3)",
              color: "#ffffff"
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <WordsPullUp text="KAM NGAI LAU" />
          </motion.div>
          
          <motion.div variants={itemVars} className="mt-6 md:mt-10 flex flex-col items-center">
            <p className="font-sans font-light tracking-[0.2em] leading-relaxed text-[clamp(0.75rem,1.5vw,1.1rem)] max-w-[600px] text-titanium/80 uppercase">
              AI Filmmaker <span className="text-border mx-2">|</span> <span className="font-display italic lowercase text-sci-teal tracking-normal">Multimedia Designer</span> <span className="text-border mx-2">|</span> Creative Technologist
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar / CTA */}
      <div className="absolute bottom-10 sm:bottom-16 z-30 w-full flex justify-center">
        <FadeIn delay={1.2} y={20}>
          <div className="pointer-events-auto">
            <ContactButton 
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })} 
              label="VIEW WORK"
            />
          </div>
        </FadeIn>
      </div>

      {/* Cinematic Noise Overlay (global to hero) */}
      <div className="absolute inset-0 z-40 pointer-events-none noise-overlay opacity-30 mix-blend-overlay" />

    </section>
  )
}
