import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import PremiumCinematicCard from './ui/PremiumCinematicCard'
import FadeIn from './ui/FadeIn'
import WordsPullUp from './ui/WordsPullUp'

const SKILL_CATEGORIES = [
  {
    title: 'Video & Film Production',
    skills: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Cinematography', 'Color Grading'],
    icon: '🎥'
  },
  {
    title: 'VR & 3D Spatial',
    skills: ['Unreal Engine', 'Blender', 'Unity', 'Spatial Design', 'Interactive Environments'],
    icon: '🕶️'
  },
  {
    title: 'Design & Motion',
    skills: ['Figma', 'Illustrator', 'Photoshop', 'Motion Graphics', 'UI/UX Design'],
    icon: '✨'
  },
  {
    title: 'Creative Technology',
    skills: ['Generative AI', 'ComfyUI', 'React/Web3D', 'Prompt Engineering', 'Creative Coding'],
    icon: '🧠'
  }
]

export default function Skills() {
  const containerRef = useRef(null)
  
  return (
    <section 
      id="skills" 
      ref={containerRef}
      className="w-full bg-[#050505] px-5 sm:px-8 md:px-12 py-24 sm:py-32 relative z-20"
      data-inspector-label="Skills Section"
    >
      <div className="max-w-7xl mx-auto">
        <FadeIn delay={0} y={40}>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-sans text-[10px] md:text-xs tracking-[0.3em] text-white/70 uppercase border border-white/10 bg-white/5 backdrop-blur-md rounded-full px-5 py-2 shadow-inner">
              Core Competencies
            </span>
          </div>
          <h2 className="font-display font-normal uppercase text-[clamp(2.5rem,5vw,70px)] mb-16 leading-none text-titanium drop-shadow-2xl">
            <WordsPullUp text="Technical" />
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {SKILL_CATEGORIES.map((category, i) => (
            <FadeIn key={category.title} delay={i * 0.15} className="flex">
              <PremiumCinematicCard className="h-full">
                <div className="text-4xl mb-6 opacity-80">{category.icon}</div>
                <h3 className="font-display text-titanium uppercase text-2xl sm:text-3xl mb-6 relative z-10 tracking-wide">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-3 mt-auto relative z-10">
                  {category.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="font-sans text-xs sm:text-sm tracking-wide text-white/60 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-inner"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </PremiumCinematicCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
