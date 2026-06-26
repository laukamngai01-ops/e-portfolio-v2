import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import PremiumCinematicCard from './ui/PremiumCinematicCard'
import FadeIn from './ui/FadeIn'

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Research',
    desc: 'Analyzing market trends, establishing visual references, and determining technical feasibility.'
  },
  {
    num: '02',
    title: 'Concept',
    desc: 'Developing the core narrative, creative brief, and overarching aesthetic language.'
  },
  {
    num: '03',
    title: 'Storyboard',
    desc: 'Visualizing the narrative sequence and mapping out the user or viewer journey.'
  },
  {
    num: '04',
    title: 'Production',
    desc: 'Executing the vision through 3D modeling, filming, coding, and dynamic motion design.'
  },
  {
    num: '05',
    title: 'Post Production',
    desc: 'Refining details through editing, VFX integration, and precise color grading.'
  },
  {
    num: '06',
    title: 'Delivery',
    desc: 'Final optimization, rendering, and handoff for the target platforms or mediums.'
  }
]

export default function Process() {
  const containerRef = useRef(null)

  return (
    <section 
      id="process" 
      ref={containerRef}
      className="w-full bg-[#050505] px-5 sm:px-8 md:px-12 py-24 sm:py-32 relative z-20 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <FadeIn delay={0} y={40} className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display font-normal uppercase text-[clamp(2.5rem,5vw,70px)] leading-none text-titanium drop-shadow-lg tracking-tight">
              Creative Process
            </h2>
            <p className="font-sans text-white/50 mt-6 max-w-xl tracking-wide leading-relaxed">
              A structured, highly iterative approach from initial concept to final delivery, ensuring premium quality and consistent results.
            </p>
          </div>
        </FadeIn>

        {/* Staggered Masonry-Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative">
          {PROCESS_STEPS.map((step, i) => (
            <FadeIn 
              key={step.num} 
              delay={i * 0.15} 
              className={`flex w-full ${i % 2 === 1 ? 'md:mt-16 lg:mt-24' : ''}`}
            >
              <PremiumCinematicCard className="h-full min-h-[280px]">
                {/* Large Background Number */}
                <div className="absolute -right-4 -bottom-8 text-white/[0.02] font-display text-[12rem] sm:text-[15rem] leading-none pointer-events-none select-none z-0">
                  {step.num}
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-white/30 font-sans text-sm tracking-widest font-bold mb-4">
                    PHASE {step.num}
                  </div>
                  <h3 className="font-display text-titanium uppercase text-2xl sm:text-3xl md:text-4xl mb-4 tracking-wide">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-white/50 leading-relaxed max-w-[90%] mt-auto">
                    {step.desc}
                  </p>
                </div>
              </PremiumCinematicCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
