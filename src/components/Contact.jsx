import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FadeIn from './ui/FadeIn'
import ContactButton from './ui/ContactButton'

export default function Contact() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  // Paralax background effect
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative w-full bg-[#0a0a0a] flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-32 sm:py-40 overflow-hidden" 
      data-inspector-label="Contact Section"
    >
      {/* Background Graphic/Gradients */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen"
      >
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-sci-teal/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-sci-teal/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
      </motion.div>

      <div className="z-10 flex flex-col items-center w-full max-w-4xl mx-auto">
        <FadeIn delay={0} y={40} className="w-full text-center mb-8">
          <h2 className="font-display font-normal uppercase leading-none text-[clamp(2.5rem,8vw,100px)] text-sci-teal drop-shadow-lg">
            Let's create something<br />
            <span className="text-titanium">extraordinary.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2} y={20} className="w-full text-center mb-16">
          <p className="font-sans font-light text-muted-cyan text-[clamp(1rem,1.5vw,1.25rem)] max-w-[600px] mx-auto">
            Available for full-time roles, creative opportunities, or a virtual coffee chat.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} y={20}>
          <a href="mailto:hello@example.com">
            <ContactButton label="START A CONVERSATION" className="px-10 py-5 sm:px-12 sm:py-6" />
          </a>
        </FadeIn>

        <div className="w-full h-px bg-border my-16 sm:my-20" />

        <FadeIn delay={0.5} y={10} className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 text-titanium/50 text-xs sm:text-sm font-sans tracking-widest uppercase">
          <div className="flex gap-6">
            <a href="#" className="hover:text-sci-teal transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-sci-teal transition-colors">Instagram</a>
            <a href="#" className="hover:text-sci-teal transition-colors">Behance</a>
          </div>
          <div>
            © {new Date().getFullYear()} Kam Ngai Lau
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
