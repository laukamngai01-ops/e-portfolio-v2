import { useEffect, useRef } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PROJECTS_DATA } from '../data/projects'
import { useDwellTimer } from '../hooks/useDwellTimer'

const getAssetUrl = (path) => {
  if (!path) return ''
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${cleanPath}`
}

// 1. 媒体黑洞：性能优化 (LazyVideo)
const LazyVideo = ({ src, poster, className }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "200px 0px" })
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
      }
    }
  }, [isInView])

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center bg-[#050505]">
      {isInView ? (
        <video 
          ref={videoRef}
          src={src} 
          poster={poster}
          className={className}
          autoPlay 
          muted={true}
          loop 
          playsInline
        />
      ) : (
        <img src={poster} className={className} alt="Loading video..." />
      )}
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const projectIndex = PROJECTS_DATA.findIndex(p => p.id === id)
  const project = PROJECTS_DATA[projectIndex]
  
  // 5. 详情页死胡同：计算下一个项目
  const nextProject = projectIndex >= 0 && projectIndex < PROJECTS_DATA.length - 1 
    ? PROJECTS_DATA[projectIndex + 1] 
    : PROJECTS_DATA[0] // Loop back to first if at end
    
  // Track dwell time on the detail page
  useDwellTimer(`ProjectDetail_${id}`)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!project) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-sci-teal/40">
      {/* Navigation */}
      <nav className="fixed top-6 left-6 md:top-8 md:left-12 lg:left-20 z-50">
        <button 
          onClick={() => navigate(-1)}
          data-track="back_button"
          className="group flex items-center gap-3 px-5 py-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/60 transition-all duration-300 shadow-2xl cursor-pointer pointer-events-auto"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-sci-teal/20 group-hover:text-sci-teal transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-semibold pr-2">Back</span>
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-[80vh] flex flex-col justify-end p-6 md:p-12 lg:p-20 overflow-hidden">
        {/* Background Ambient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/60 to-[#050505] z-10" />
          {project.items[0]?.type === 'video' ? (
             <video 
               src={getAssetUrl(project.items[0].src)} 
               poster={getAssetUrl(project.items[0].poster)}
               className="w-full h-full object-cover opacity-40 blur-sm scale-105"
               autoPlay 
               muted={true}
               loop 
               playsInline
             />
          ) : (
            <img 
               src={getAssetUrl(project.items[0]?.src)} 
               className="w-full h-full object-cover opacity-40 blur-sm scale-105"
               alt=""
            />
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-6"
          >
            <span className="font-sans text-[10px] tracking-[0.3em] text-white/70 uppercase border border-white/20 bg-white/5 backdrop-blur-md rounded-full px-4 py-1.5">
              {project.category}
            </span>
            <span className="font-display text-sci-teal tracking-widest text-sm">{project.num}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl uppercase tracking-tighter leading-[0.9]"
          >
            {project.name}
          </motion.h1>
        </div>
      </header>

      {/* Information Grid */}
      <section className="relative z-20 -mt-10 mx-6 md:mx-12 lg:mx-20 bg-[#0A0A0A] border border-white/10 rounded-[30px] md:rounded-[40px] p-6 md:p-12 backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[10px] tracking-[0.2em] text-white/40 uppercase">Role</span>
            <span className="font-sans text-sm md:text-base text-white/90">{project.role}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[10px] tracking-[0.2em] text-white/40 uppercase">Tools</span>
            <span className="font-sans text-sm md:text-base text-white/90">{project.tools}</span>
          </div>
          <div className="flex flex-col gap-2 lg:col-span-2">
            <span className="font-sans text-[10px] tracking-[0.2em] text-white/40 uppercase">Brief</span>
            <span className="font-sans text-sm md:text-base text-white/80 leading-relaxed">{project.brief}</span>
          </div>
        </div>
      </section>

      {/* Media Showcase */}
      <section className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="w-full flex flex-col gap-16 md:gap-24">
          {project.items.map((item, index) => {
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full rounded-[20px] md:rounded-[32px] overflow-hidden border border-white/10 bg-white/5 shadow-2xl"
              >
                {item.type === 'video' ? (
                  <LazyVideo 
                    src={getAssetUrl(item.src)} 
                    poster={getAssetUrl(item.poster)}
                    // 添加了 max-h-[80vh] 和 object-contain 限制最大高度，防止竖屏过大
                    className="w-full max-h-[80vh] object-contain block"
                  />
                ) : (
                  <img 
                    src={getAssetUrl(item.src)} 
                    // 添加了 max-h-[80vh] 和 object-contain
                    className="w-full max-h-[80vh] object-contain block"
                    alt={`${project.name} preview ${index + 1}`}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Next Project CTA */}
      {nextProject && (
        <section className="w-full border-t border-white/10 bg-[#0A0A0A]">
          <Link 
            to={`/project/${nextProject.id}`}
            data-track={`next_project_clicked_${nextProject.id}`}
            className="group block w-full py-24 md:py-32 px-6 md:px-12 lg:px-20 hover:bg-white/5 transition-colors duration-500"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex flex-col gap-4">
                <span className="font-sans text-[10px] tracking-[0.3em] text-white/40 uppercase">Next Project</span>
                <h2 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter text-white/90 group-hover:text-white transition-colors duration-300">
                  {nextProject.name}
                </h2>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/20 flex items-center justify-center group-hover:border-sci-teal group-hover:bg-sci-teal/10 transition-all duration-500 shrink-0">
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white/70 group-hover:text-sci-teal group-hover:translate-x-2 transition-all duration-300" />
              </div>
            </div>
          </Link>
        </section>
      )}
      
      {/* Footer minimal */}
      <footer className="w-full py-12 bg-[#050505] flex justify-center items-center">
         <p className="font-sans text-[10px] tracking-widest text-white/40 uppercase">&copy; {new Date().getFullYear()} KAM NGAI LAU. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  )
}
