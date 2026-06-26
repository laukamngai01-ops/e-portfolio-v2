import Magnet from './ui/Magnet'
import { motion, useScroll, useTransform } from 'framer-motion'

const NAV_LINKS = [
  { href: '#hero',     label: 'HOME' },
  { href: '#skills',   label: 'SKILLS' },
  { href: '#projects', label: 'WORK' },
  { href: '#about',    label: 'ABOUT' },
  { href: '#contact',  label: 'CONTACT' },
]

export default function Navbar() {
  const { scrollY } = useScroll()
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(5, 5, 5, 0)', 'rgba(5, 5, 5, 0.4)']
  )

  const handleNavClick = (e, href) => {
    e.preventDefault()
    if (href === '#resume') {
      // For now, open a placeholder or alert since we don't have the PDF yet
      alert('Resume download will be available soon.');
      return;
    }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 z-50 pt-4 md:pt-6 px-4 md:px-6 flex justify-center" 
      data-inspector-label="Navigation Bar"
    >
      <motion.nav 
        style={{ backgroundColor: navBackground }}
        className="w-full max-w-[1400px] flex items-center justify-between px-6 py-3 rounded-full liquid-glass shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300"
      >
        
        {/* Left Section: Live Status */}
        <div className="flex items-center gap-2.5">
          <span className="font-display font-semibold uppercase tracking-[0.1em] text-titanium/90 text-[10px] md:text-xs">
            PORTFOLIO V2
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-sci-teal shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          <span className="font-display font-semibold uppercase tracking-[0.1em] text-titanium/90 text-[10px] md:text-xs">
            LIVE
          </span>
        </div>

        {/* Center Section: Logo/Name Pill */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Magnet padding={20}>
            <div className="border border-white/10 rounded-full px-6 py-1.5 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer interactive">
              <span className="font-display font-bold uppercase tracking-[0.2em] text-titanium text-[10px] md:text-xs">
                KAM NGAI LAU
              </span>
            </div>
          </Magnet>
        </div>

        {/* Right Section: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Magnet padding={20} key={link.href}>
              <a
                href={link.href}
                className="group relative font-sans font-medium tracking-[0.15em] text-[10px] md:text-xs text-titanium/70 hover:text-sci-teal transition-all duration-300 interactive block px-1"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
                <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-sci-teal transition-all duration-300 group-hover:w-full" />
              </a>
            </Magnet>
          ))}
        </div>

      </motion.nav>
    </motion.div>
  )
}
