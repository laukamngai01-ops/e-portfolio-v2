import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Process from './components/Process'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import DevInspector from './components/DevInspector'

function App() {
  return (
    <>
      <DevInspector />
      <Navbar />
      <main id="main-content" className="bg-[#050505] min-h-screen font-sans text-muted-cyan selection:bg-sci-teal/40">
        <Hero />
        <Projects />
        <Skills />
        <Process />
        <About />
        <Contact />
      </main>
    </>
  )
}

export default App
