import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import FadeIn from './ui/FadeIn'
import LiveProjectButton from './ui/LiveProjectButton'

const PROJECTS_DATA = [
  {
    num: '01',
    category: 'Client',
    name: 'AI Film',
    brief: 'Create an engaging sci-fi narrative short blending traditional cinematography with generative AI pipelines.',
    role: 'Director & AI Filmmaker',
    tools: 'Midjourney, Seedance2.0, google Omni, Capcut.',
    workflow: 'Concept -> Prompting -> AI Gen -> Editing -> Color Grading',
    items: [
      { type: 'video', src: '/assets/portfolio/ai_film_v2_1.mp4', poster: '/assets/portfolio/ai_film_v2_1_poster.jpg' },
      { type: 'video', src: '/assets/portfolio/ai_film_v2_2.mp4', poster: '/assets/portfolio/ai_film_v2_2_poster.jpg' },
      { type: 'video', src: '/assets/portfolio/ai_film_v2_3.mp4', poster: '/assets/portfolio/ai_film_v2_3_poster.jpg' },
      { type: 'video', src: '/assets/portfolio/ai_film_v2_4.mp4', poster: '/assets/portfolio/ai_film_v2_4_poster.jpg' },
      { type: 'video', src: '/assets/portfolio/ai_film_v2_5.mp4', poster: '/assets/portfolio/ai_film_v2_5_poster.jpg' }
    ]
  },
  {
    num: '02',
    category: 'Personal',
    name: 'Graphic Design',
    brief: 'Design a cohesive brand identity and high-impact visual assets for a digital-first agency.',
    role: 'Multimedia Designer',
    tools: 'Illustrator, Photoshop, Indesign, Nano Banana 2.',
    workflow: 'Research -> Moodboard -> Drafting -> Revisions -> Final Assets',
    items: [
      { type: 'image', src: '/assets/portfolio/graphic_v2_1.webp' },
      { type: 'image', src: '/assets/portfolio/graphic_v2_2.webp' },
      { type: 'image', src: '/assets/portfolio/graphic_v2_3.webp' },
      { type: 'image', src: '/assets/portfolio/graphic_v2_4.webp' },
      { type: 'image', src: '/assets/portfolio/graphic_v2_5.webp' },
      { type: 'image', src: '/assets/portfolio/graphic_v2_6.webp' }
    ]
  },
  {
    num: '03',
    category: 'Client',
    name: 'Photography & Videography',
    brief: 'Produce a high-end commercial video highlighting spatial design and architectural details.',
    role: 'Photography & Video Editting',
    tools: 'CAPCUT, Sony, Nikon, DJI poket 2.',
    workflow: 'Storyboarding -> On-Site Shoot -> Editing -> Color Grading',
    items: [
      { type: 'video', src: '/assets/portfolio/photo_v2_1.mp4', poster: '/assets/portfolio/photo_v2_1_poster.jpg' },
      { type: 'video', src: '/assets/portfolio/photo_v2_2.mp4', poster: '/assets/portfolio/photo_v2_2_poster.jpg' },
      { type: 'video', src: '/assets/portfolio/photo_v2_3.mp4', poster: '/assets/portfolio/photo_v2_3_poster.jpg' },
      { type: 'video', src: '/assets/portfolio/photo_v2_4.mp4', poster: '/assets/portfolio/photo_v2_4_poster.jpg' }
    ]
  }
]

const getAssetUrl = (path) => {
  if (!path) return ''
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${cleanPath}`
}

const MediaCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const currentIndexRef = useRef(currentIndex);
  const lastScrollTime = useRef(0);
  const touchStartRef = useRef(null);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Desktop: wheel scrolling
  useEffect(() => {
    const handleRawWheel = (e) => {
      const now = Date.now();
      const idx = currentIndexRef.current;
      
      if (now - lastScrollTime.current > 600) {
        if (e.deltaY > 20 && idx < items.length - 1) {
          e.preventDefault();
          setCurrentIndex(idx + 1);
          lastScrollTime.current = now;
        } else if (e.deltaY < -20 && idx > 0) {
          e.preventDefault();
          setCurrentIndex(idx - 1);
          lastScrollTime.current = now;
        } else if ((e.deltaY > 0 && idx < items.length - 1) || (e.deltaY < 0 && idx > 0)) {
           e.preventDefault();
        }
      } else {
        if ((e.deltaY > 0 && idx < items.length - 1) || (e.deltaY < 0 && idx > 0)) {
          e.preventDefault();
        }
      }
    };
    
    const element = containerRef.current;
    if (element) {
      element.addEventListener('wheel', handleRawWheel, { passive: false });
    }
    return () => {
      if (element) {
        element.removeEventListener('wheel', handleRawWheel);
      }
    };
  }, [items.length]);

  // Mobile: touch swipe support
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    const idx = currentIndexRef.current;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && idx < items.length - 1) {
        setCurrentIndex(idx + 1);
      } else if (diff < 0 && idx > 0) {
        setCurrentIndex(idx - 1);
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/20 rounded-[32px] sm:rounded-[40px] shadow-2xl ring-1 ring-white/10 cursor-ew-resize"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((item, index) => {
        const offset = index - currentIndex;
        const isVisible = Math.abs(offset) <= 2;
        const isActive = offset === 0;
        
        if (!isVisible) return null;
 
        const scale = isActive ? 1 : 0.8;
        const opacity = isActive ? 1 : 0.3;
        const translateX = offset * 80; 
        const zIndex = 10 - Math.abs(offset);

        return (
          <motion.div
            key={index}
            className="absolute w-[80%] h-[90%] sm:w-[75%] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl bg-black/50"
            initial={false}
            animate={{
              x: `${translateX}%`,
              scale: scale,
              opacity: opacity,
              zIndex: zIndex
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25
            }}
          >
            {item.type === 'video' ? (
              <video 
                src={isActive || Math.abs(offset) <= 1 ? getAssetUrl(item.src) : undefined}
                poster={getAssetUrl(item.poster)}
                autoPlay={isActive}
                loop
                muted
                playsInline
                preload={isActive ? 'auto' : 'none'}
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={getAssetUrl(item.src)} 
                className="w-full h-full object-cover"
                alt=""
                loading="lazy"
                decoding="async"
              />
            )}
            
            {/* Dark overlay for inactive items */}
            <motion.div 
              className="absolute inset-0 bg-[#050505] pointer-events-none"
              initial={false}
              animate={{ opacity: isActive ? 0 : 0.6 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )
      })}
      
      {/* Scroll/Tap Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {items.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

const Card = ({ project, i, progress, range, targetScale }) => {
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  
  const scale = useTransform(progress, range, [1, targetScale])
  
  // Mouse tracking for interactive glow
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.5 })
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.5 })

  function handleMouseMove(e) {
    if (!cardRef.current) return
    const { left, top } = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  function handleMouseLeave() {
    mouseX.set(-1000)
    mouseY.set(-1000)
  }

  const edgeGlowMask = useMotionTemplate`radial-gradient(500px circle at ${smoothX}px ${smoothY}px, white, transparent 100%)`

  return (
    <div ref={containerRef} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ scale, top: `calc(-5vh + ${i * 28}px)` }}
        className="group flex flex-col relative w-[90vw] max-w-6xl h-[85vh] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] liquid-glass p-6 sm:p-8 md:p-12 transform-origin-top overflow-hidden shadow-2xl"
      >
        {/* Massive Watermark Number */}
        <div className="absolute -top-10 -left-6 text-[150px] sm:text-[200px] md:text-[280px] font-display font-bold text-white/[0.02] pointer-events-none select-none z-0 tracking-tighter leading-none transition-transform duration-1000 group-hover:scale-105 group-hover:text-white/[0.04]">
          {project.num}
        </div>

        {/* Interactive Edge Glow */}
        <motion.div
          className="absolute inset-0 z-20 rounded-[inherit] pointer-events-none mix-blend-screen"
          style={{ 
            boxShadow: '0 0 40px 8px rgba(0, 240, 255, 0.3), inset 0 0 30px 4px rgba(255, 51, 102, 0.3)',
            WebkitMaskImage: edgeGlowMask, 
            maskImage: edgeGlowMask
          }}
        />

        {/* Crisp White Edge Border */}
        <motion.div
          className="absolute inset-0 z-20 rounded-[inherit] border border-white/40 pointer-events-none mix-blend-overlay"
          style={{ 
            WebkitMaskImage: edgeGlowMask, 
            maskImage: edgeGlowMask
          }}
        />

        {/* Main Content Layout */}
        <div className="relative z-30 flex flex-col lg:flex-row w-full h-full gap-5 sm:gap-6 lg:gap-8 overflow-hidden">
          
          {/* Left Column (or Top on Mobile): Info & Details */}
          <div className="flex flex-col w-full lg:w-[40%] xl:w-[35%] shrink-0 flex-none lg:h-full z-40">
            {/* Title & Tags */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-inner shrink-0">
                  <span className="font-display font-bold text-white/90 text-xs sm:text-sm tracking-widest">{project.num}</span>
                </div>
                <span className="font-sans text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] text-white/70 uppercase border border-white/10 bg-white/5 backdrop-blur-md rounded-full px-4 py-1.5 sm:px-5 sm:py-2 shadow-inner whitespace-nowrap">
                  {project.category}
                </span>
                <div className="ml-auto lg:hidden">
                  <LiveProjectButton />
                </div>
              </div>
              <h3 className="font-display text-white/90 uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tight mt-1 drop-shadow-lg transition-all duration-700 ease-out line-clamp-2">
                {project.name}
              </h3>
              <div className="hidden lg:block mt-2">
                <LiveProjectButton className="interactive" />
              </div>
            </div>

            {/* Project Details Panel */}
            <div className="mt-4 lg:mt-auto flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm font-sans text-white/80 bg-black/40 p-4 sm:p-5 md:p-6 rounded-[20px] sm:rounded-[24px] border border-white/10 backdrop-blur-md shadow-inner overflow-y-auto max-h-[28vh] lg:max-h-[50vh] scrollbar-hide pointer-events-auto">
               <div className="grid grid-cols-2 gap-4">
                 <div><span className="text-sci-teal uppercase text-[9px] sm:text-[10px] tracking-widest block mb-0.5 sm:mb-1">Role</span> <span className="font-light">{project.role}</span></div>
                 <div><span className="text-sci-teal uppercase text-[9px] sm:text-[10px] tracking-widest block mb-0.5 sm:mb-1">Tools</span> <span className="font-light">{project.tools}</span></div>
               </div>
               <div className="w-full h-px bg-white/10 my-1 shrink-0" />
               <div><span className="text-sci-teal uppercase text-[9px] sm:text-[10px] tracking-widest block mb-0.5 sm:mb-1">Creative Brief</span> <span className="font-light leading-snug">{project.brief}</span></div>
               <div><span className="text-sci-teal uppercase text-[9px] sm:text-[10px] tracking-widest block mb-0.5 sm:mb-1">Workflow</span> <span className="font-light leading-snug text-white/60">{project.workflow}</span></div>
            </div>
          </div>

          {/* Right Column (or Bottom on Mobile): Carousel */}
          <div className="relative z-30 flex-1 flex w-full h-full min-h-[30vh] lg:min-h-0 overflow-hidden pointer-events-auto">
            <MediaCarousel items={project.items} />
          </div>

        </div>

      </motion.div>
    </div>
  )
}

export default function Projects() {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  return (
    <section 
      id="projects" 
      ref={containerRef}
      className="relative w-full bg-[#050505] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 pt-20 pb-[10vh]"
      data-inspector-label="Projects Section"
    >
      <FadeIn delay={0} y={40} className="w-full flex justify-center mb-16 md:mb-24">
        <h2 className="hero-heading font-display font-normal uppercase text-[clamp(2.5rem,8vw,120px)] leading-none text-sci-teal drop-shadow-2xl tracking-tight">
          Selected Works
        </h2>
      </FadeIn>

      <div className="relative mt-10">
        {PROJECTS_DATA.map((p, i) => {
          const targetScale = 1 - ((PROJECTS_DATA.length - 1 - i) * 0.03)
          return (
            <Card 
              key={p.num} 
              project={p} 
              i={i} 
              progress={scrollYProgress} 
              range={[i * 0.25, 1]} 
              targetScale={targetScale} 
            />
          )
        })}
      </div>
    </section>
  )
}
