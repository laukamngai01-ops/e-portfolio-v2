import { motion } from 'framer-motion'

export default function WordsPullUp({ text, className = '' }) {
  const words = text.split(' ')

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const wordItem = {
    hidden: { y: 120, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] // cubic-bezier matching the reference style
      }
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`inline-flex flex-wrap justify-center gap-[0.2em] ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block leading-[0.9] pb-[0.1em]">
          <motion.span variants={wordItem} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  )
}
