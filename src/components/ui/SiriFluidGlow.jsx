import { motion } from 'framer-motion'

export default function SiriFluidGlow({ active = false, mouseX, mouseY }) {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden">
      
      {/* Dark Glass Base */}
      <div className="absolute inset-0 bg-[#0a0a0a]/70 backdrop-blur-3xl z-0" />
      
      {/* Fluid Light Container - Tracks Mouse */}
      <motion.div 
        className="absolute w-[400px] h-[400px] pointer-events-none mix-blend-screen z-10"
        style={{ 
          left: mouseX, 
          top: mouseY,
          x: '-50%',
          y: '-50%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Blob 1: Magenta */}
          <motion.div
            animate={{ 
              x: [-40, 40, -20, 50, -40], 
              y: [20, -10, 30, -15, 20], 
              scale: [1, 1.3, 0.9, 1.4, 1] 
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[60%] h-[60%] bg-[#ff3366] rounded-full blur-[40px]"
          />
          
          {/* Blob 2: Cyan */}
          <motion.div
            animate={{ 
              x: [40, -40, 30, -30, 40], 
              y: [-15, 25, -10, 30, -15], 
              scale: [0.9, 1.5, 1, 1.3, 0.9] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[70%] h-[70%] bg-[#00f0ff] rounded-full blur-[50px]"
          />
          
          {/* Blob 3: Orange */}
          <motion.div
            animate={{ 
              x: [-60, 20, 60, -20, -60], 
              y: [25, -15, 35, -10, 25], 
              scale: [1.1, 0.8, 1.4, 1, 1.1] 
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[50%] h-[50%] bg-[#ffaa00] rounded-full blur-[40px]"
          />
          
          {/* Blob 4: Purple */}
          <motion.div
            animate={{ 
              x: [30, 70, -40, 30], 
              y: [-10, 30, -15, -10], 
              scale: [1, 1.6, 1, 1] 
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[65%] h-[65%] bg-[#a855f7] rounded-full blur-[60px]"
          />
        </div>
      </motion.div>
      
      {/* Subtle fallback glow when NOT active (resting at bottom edge) */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center mix-blend-screen z-0"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: active ? 0 : 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute w-[80%] h-10 bg-gradient-to-r from-[#ff3366] via-[#00f0ff] to-[#a855f7] rounded-full blur-[30px]" />
      </motion.div>

    </div>
  )
}
