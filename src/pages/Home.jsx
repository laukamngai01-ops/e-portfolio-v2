import { useEffect } from 'react'
import Hero from '../components/Hero'
import Skills from '../components/Skills'
import Process from '../components/Process'
import Projects from '../components/Projects'
import About from '../components/About'
import Contact from '../components/Contact'

function Home() {
  // Scroll Restoration Logic for Home Page
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem('homeScrollPos', window.scrollY.toString())
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Restore scroll position on mount
    const savedPos = sessionStorage.getItem('homeScrollPos')
    if (savedPos) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedPos, 10), behavior: 'instant' })
      }, 50)
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Hero />
      <Projects />
      <Skills />
      <Process />
      <About />
      <Contact />
    </>
  )
}

export default Home
