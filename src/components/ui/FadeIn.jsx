import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '../../utils/cn'
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  y = 40,
  x = 0,
  className,
  once = true,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-10%" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
