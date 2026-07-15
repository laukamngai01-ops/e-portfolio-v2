import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import DevInspector from './components/DevInspector'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import { useTracker } from './hooks/useTracker'

function App() {
  useTracker(); // Stealth Analytics
  return (
    <>
      {import.meta.env.DEV && <DevInspector />}
      <Navbar />
      <main id="main-content" className="bg-[#050505] min-h-screen font-sans text-muted-cyan selection:bg-sci-teal/40">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </main>
    </>
  )
}

export default App
