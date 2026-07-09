import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import FadeIn from './ui/FadeIn'
import LiveProjectButton from './ui/LiveProjectButton'
import { PROJECTS_DATA } from '../data/projects'
import { useDwellTimer } from '../hooks/useDwellTimer'

const getAssetUrl = (path) => {
  if (!path) return ''
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${cleanPath}`
}

const MediaCarousel = ({ items, projectId }) => {
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
      className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden bg-black/20 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] shadow-2xl ring-1 ring-white/10 cursor-ew-resize"
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
            // Use aspect-video to strictly enforce 16:9 scaling
            className="absolute w-[95%] sm:w-[90%] md:w-[85%] aspect-video rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-2xl bg-black/50"
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
            {isActive ? (
              <Link to={`/project/${projectId}`} className="block w-full h-full cursor-pointer group/link">
                {item.type === 'video' ? (
                  <video 
                    src={getAssetUrl(item.src)}
                    poster={getAssetUrl(item.poster)}
                    autoPlay={true}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img 
                    src={getAssetUrl(item.src)} 
                    className="w-full h-full object-contain"
                    alt=""
                    loading="lazy"
                  />
                )}
                {/* Hover UI inside the link */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center backdrop-blur-sm z-20">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 transform translate-y-4 group-hover/link:translate-y-0 transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6 text-white" />
                  </div>
                  <span className="mt-4 font-sans text-xs tracking-widest uppercase text-white transform translate-y-4 group-hover/link:translate-y-0 transition-all duration-500 delay-75">
                    View Case Study
                  </span>
                </div>
              </Link>
            ) : (
              <>
                {item.type === 'video' ? (
                  <video 
                    src={Math.abs(offset) <= 1 ? getAssetUrl(item.src) : undefined}
                    poster={getAssetUrl(item.poster)}
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img 
                    src={getAssetUrl(item.src)} 
                    className="w-full h-full object-contain"
                    alt=""
                    loading="lazy"
                  />
                )}
                {/* Dark overlay for inactive items */}
                <motion.div 
                  className="absolute inset-0 bg-[#050505] pointer-events-none"
                  initial={false}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.3 }}
                />
              </>
            )}
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
  
  // Track dwell time for this specific project card
  useDwellTimer(`ProjectCard_${project.id}`, containerRef)
  
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
    <div ref={containerRef} className="md:h-screen flex items-center justify-center md:sticky top-0 mb-12 md:mb-0">
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ scale, top: `calc(-5vh + ${i * 28}px)` }}
        // Removed fixed h-[85vh], allowing flex-col to dictate height naturally up to max-h-[90vh]
        className="group flex flex-col relative w-[95vw] md:w-[95vw] max-w-7xl max-h-none md:max-h-[90vh] h-auto rounded-[32px] sm:rounded-[40px] md:rounded-[50px] liquid-glass p-4 sm:p-8 md:p-10 transform-origin-top shadow-2xl overflow-hidden"
      >
        {/* Massive Watermark Number */}
        <div className="absolute -top-10 -left-6 text-[150px] sm:text-[200px] md:text-[240px] font-display font-bold text-white/[0.02] pointer-events-none select-none z-0 tracking-tighter leading-none transition-transform duration-1000 group-hover:scale-105 group-hover:text-white/[0.04]">
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
        <div className="relative z-30 flex flex-col lg:flex-row w-full h-full gap-5 sm:gap-6 lg:gap-8 pointer-events-none">
          
          {/* Left Column: Info & Details */}
          <div className="flex flex-col w-full lg:w-[35%] shrink-0 flex-none z-40 pointer-events-auto mt-4 lg:mt-0">
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
                  <LiveProjectButton projectId={project.id} />
                </div>
              </div>
              <h3 className="font-display text-white/90 uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tight mt-1 drop-shadow-lg transition-all duration-700 ease-out line-clamp-2">
                {project.name}
              </h3>
              <div className="hidden lg:block mt-2">
                <LiveProjectButton className="interactive" projectId={project.id} />
              </div>
            </div>

            {/* Project Details Panel */}
            <div className="mt-4 lg:mt-8 flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm font-sans text-white/80 bg-black/40 p-4 sm:p-5 md:p-6 rounded-[20px] sm:rounded-[24px] border border-white/10 backdrop-blur-md shadow-inner overflow-y-auto scrollbar-hide pointer-events-auto">
               <div className="grid grid-cols-2 gap-4">
                 <div><span className="text-sci-teal uppercase text-[9px] sm:text-[10px] tracking-widest block mb-0.5 sm:mb-1">Role</span> <span className="font-light">{project.role}</span></div>
                 <div><span className="text-sci-teal uppercase text-[9px] sm:text-[10px] tracking-widest block mb-0.5 sm:mb-1">Tools</span> <span className="font-light">{project.tools}</span></div>
               </div>
               <div className="w-full h-px bg-white/10 my-1 shrink-0" />
               <div><span className="text-sci-teal uppercase text-[9px] sm:text-[10px] tracking-widest block mb-0.5 sm:mb-1">Creative Brief</span> <span className="font-light leading-snug">{project.brief}</span></div>
               <div><span className="text-sci-teal uppercase text-[9px] sm:text-[10px] tracking-widest block mb-0.5 sm:mb-1">Workflow</span> <span className="font-light leading-snug text-white/60">{project.workflow}</span></div>
            </div>
          </div>

          {/* Right Column: Carousel - Using aspect-video wrapper */}
          <div className="relative z-30 flex-1 flex w-full aspect-[4/3] lg:aspect-video overflow-hidden pointer-events-auto">
            <MediaCarousel items={project.items} projectId={project.id} />
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
