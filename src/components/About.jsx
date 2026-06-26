import FadeIn from './ui/FadeIn'
import WordsPullUp from './ui/WordsPullUp'

export default function About() {
  return (
    <section id="about" className="relative w-full min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden" data-inspector-label="About Section">
      
      {/* 3D Decorative Corners */}
      <FadeIn delay={0.1} duration={0.9} x={-80} y={0} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="3D Moon" className="w-[120px] sm:w-[160px] md:w-[210px] opacity-70" />
      </FadeIn>
      <FadeIn delay={0.25} duration={0.9} x={-80} y={0} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] pointer-events-none">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="3D Shape" className="w-[100px] sm:w-[140px] md:w-[180px] opacity-70" />
      </FadeIn>
      <FadeIn delay={0.15} duration={0.9} x={80} y={0} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="3D Lego" className="w-[120px] sm:w-[160px] md:w-[210px] opacity-70" />
      </FadeIn>
      <FadeIn delay={0.3} duration={0.9} x={80} y={0} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] pointer-events-none">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="3D Group" className="w-[130px] sm:w-[170px] md:w-[220px] opacity-70" />
      </FadeIn>

      <div className="z-10 flex flex-col items-center">
        <FadeIn delay={0} y={40} className="w-full text-center">
          <h2 className="font-display text-sci-teal font-normal uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)] mix-blend-plus-lighter drop-shadow-2xl">
            <WordsPullUp text="About me" />
          </h2>
        </FadeIn>

        <div className="mt-10 sm:mt-14 md:mt-16 text-center text-muted-cyan font-medium leading-relaxed max-w-[700px] text-[clamp(1rem,2vw,1.35rem)]">
          <FadeIn delay={0.2} y={20}>
            <p className="font-sans font-light mb-10">
              Kam Ngai Lau is an AI Filmmaker, Multimedia Designer, and Creative Technologist. Focused on combining visual storytelling with cutting-edge AI technology, managing all stages of production from concept to final delivery. Strong foundation in spatial design, motion, and creative coding.
            </p>
          </FadeIn>
          <FadeIn delay={0.3} y={20}>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert('Resume PDF will be placed here.'); }}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-sci-teal/10 hover:bg-sci-teal/20 border border-sci-teal/30 text-sci-teal font-sans tracking-widest text-xs sm:text-sm uppercase transition-all duration-300"
            >
              DOWNLOAD RESUME
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
